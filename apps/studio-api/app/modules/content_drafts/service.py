from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.content_drafts.models import ApprovalEvent, CarouselSlide, ContentDraft
from app.modules.content_drafts.schemas import (
    CarouselSlideCreate,
    ContentDraftCreate,
    ContentDraftUpdate,
    DraftWorkflowActionPayload,
)
from app.modules.content_requests.models import ContentRequest
from app.modules.content_requests.service import ContentRequestService
from app.shared.enums import (
    ApprovalActorType,
    ApprovalEventType,
    ContentDraftStatus,
    ContentFormat,
    ContentRequestStatus,
)
from app.shared.errors import BadRequestError, ConflictError, NotFoundError

TEXT_MANAGED_STATUSES = {
    ContentRequestStatus.AWAITING_TEXT_APPROVAL,
    ContentRequestStatus.TEXT_REVISION_REQUESTED,
    ContentRequestStatus.TEXT_APPROVED,
}


class ContentDraftService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.content_request_service = ContentRequestService(session)

    async def create(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: ContentDraftCreate,
    ) -> ContentDraft:
        content_request = await self.content_request_service.get_or_404(
            tenant_id,
            request_id,
        )
        self._validate_slides_for_request_format(content_request, payload.slides)
        existing_draft = await self._get_for_request(tenant_id, request_id)
        if existing_draft is not None:
            raise ConflictError(
                "An active content draft already exists for this request."
            )

        draft = ContentDraft(
            tenant_id=tenant_id,
            content_request_id=request_id,
            title=payload.title,
            caption=payload.caption,
            fixed_comment=payload.fixed_comment,
            stories_suggestion=payload.stories_suggestion,
            slides=self._build_slides(tenant_id, payload.slides),
        )
        self.session.add(draft)
        self._sync_request_status_for_draft_creation(content_request)
        await self.session.commit()
        return await self.get_or_404(tenant_id, request_id)

    async def get_or_404(self, tenant_id: UUID, request_id: UUID) -> ContentDraft:
        await self.content_request_service.get_or_404(tenant_id, request_id)
        draft = await self._get_for_request(tenant_id, request_id)
        if draft is None:
            raise NotFoundError("Content draft not found.")
        return draft

    async def update(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: ContentDraftUpdate,
    ) -> ContentDraft:
        content_request = await self.content_request_service.get_or_404(
            tenant_id,
            request_id,
        )
        draft = await self.get_or_404(tenant_id, request_id)
        if draft.status == ContentDraftStatus.APPROVED:
            raise ConflictError(
                "Approved drafts cannot be edited. Versioning will be supported later."
            )
        self._validate_slides_for_request_format(content_request, payload.slides)

        draft.title = payload.title
        draft.caption = payload.caption
        draft.fixed_comment = payload.fixed_comment
        draft.stories_suggestion = payload.stories_suggestion
        self._replace_slides(draft, tenant_id, payload.slides)
        await self.session.commit()
        return await self.get_or_404(tenant_id, request_id)

    async def submit_for_approval(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: DraftWorkflowActionPayload | None,
    ) -> ContentDraft:
        content_request = await self.content_request_service.get_or_404(
            tenant_id,
            request_id,
        )
        draft = await self.get_or_404(tenant_id, request_id)
        if draft.status == ContentDraftStatus.APPROVED:
            raise ConflictError("Approved drafts cannot be resubmitted.")
        self._validate_draft_ready_for_approval(content_request, draft)
        resolved_payload = payload or DraftWorkflowActionPayload()

        previous_draft_status = draft.status
        previous_request_status = content_request.status
        draft.status = ContentDraftStatus.AWAITING_APPROVAL
        content_request.status = ContentRequestStatus.AWAITING_TEXT_APPROVAL
        self._add_approval_event(
            tenant_id=tenant_id,
            content_request=content_request,
            content_draft=draft,
            event_type=ApprovalEventType.TEXT_SUBMITTED,
            actor_type=resolved_payload.actor_type,
            actor_name=resolved_payload.actor_name,
            from_status=previous_request_status.value,
            to_status=content_request.status.value,
            comment=resolved_payload.comment,
        )
        if previous_request_status != content_request.status:
            self._add_approval_event(
                tenant_id=tenant_id,
                content_request=content_request,
                content_draft=draft,
                event_type=ApprovalEventType.STATUS_CHANGED,
                actor_type=ApprovalActorType.SYSTEM,
                actor_name=None,
                from_status=previous_request_status.value,
                to_status=content_request.status.value,
                comment="Content request status updated after draft submission.",
            )
        if previous_draft_status != draft.status:
            draft.version = max(draft.version, 1)
        await self.session.commit()
        return await self.get_or_404(tenant_id, request_id)

    async def request_revision(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: DraftWorkflowActionPayload,
    ) -> ContentDraft:
        content_request = await self.content_request_service.get_or_404(
            tenant_id,
            request_id,
        )
        draft = await self.get_or_404(tenant_id, request_id)
        if content_request.status != ContentRequestStatus.AWAITING_TEXT_APPROVAL:
            raise ConflictError("Only submitted drafts can receive revision requests.")

        previous_request_status = content_request.status
        draft.status = ContentDraftStatus.REVISION_REQUESTED
        content_request.status = ContentRequestStatus.TEXT_REVISION_REQUESTED
        self._add_approval_event(
            tenant_id=tenant_id,
            content_request=content_request,
            content_draft=draft,
            event_type=ApprovalEventType.TEXT_REVISION_REQUESTED,
            actor_type=payload.actor_type,
            actor_name=payload.actor_name,
            from_status=previous_request_status.value,
            to_status=content_request.status.value,
            comment=payload.comment,
        )
        if previous_request_status != content_request.status:
            self._add_approval_event(
                tenant_id=tenant_id,
                content_request=content_request,
                content_draft=draft,
                event_type=ApprovalEventType.STATUS_CHANGED,
                actor_type=ApprovalActorType.SYSTEM,
                actor_name=None,
                from_status=previous_request_status.value,
                to_status=content_request.status.value,
                comment="Content request status updated after revision request.",
            )
        await self.session.commit()
        return await self.get_or_404(tenant_id, request_id)

    async def approve(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: DraftWorkflowActionPayload,
    ) -> ContentDraft:
        content_request = await self.content_request_service.get_or_404(
            tenant_id,
            request_id,
        )
        draft = await self.get_or_404(tenant_id, request_id)
        self._validate_draft_ready_for_approval(content_request, draft)
        if content_request.status != ContentRequestStatus.AWAITING_TEXT_APPROVAL:
            raise ConflictError("Only submitted drafts can be approved.")

        previous_request_status = content_request.status
        draft.status = ContentDraftStatus.APPROVED
        content_request.status = ContentRequestStatus.TEXT_APPROVED
        self._add_approval_event(
            tenant_id=tenant_id,
            content_request=content_request,
            content_draft=draft,
            event_type=ApprovalEventType.TEXT_APPROVED,
            actor_type=payload.actor_type,
            actor_name=payload.actor_name,
            from_status=previous_request_status.value,
            to_status=content_request.status.value,
            comment=payload.comment,
        )
        if previous_request_status != content_request.status:
            self._add_approval_event(
                tenant_id=tenant_id,
                content_request=content_request,
                content_draft=draft,
                event_type=ApprovalEventType.STATUS_CHANGED,
                actor_type=ApprovalActorType.SYSTEM,
                actor_name=None,
                from_status=previous_request_status.value,
                to_status=content_request.status.value,
                comment="Content request status updated after text approval.",
            )
        await self.session.commit()
        return await self.get_or_404(tenant_id, request_id)

    async def list_approval_events(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> list[ApprovalEvent]:
        await self.content_request_service.get_or_404(tenant_id, request_id)
        result = await self.session.execute(
            select(ApprovalEvent)
            .where(
                ApprovalEvent.tenant_id == tenant_id,
                ApprovalEvent.content_request_id == request_id,
            )
            .order_by(ApprovalEvent.created_at.asc(), ApprovalEvent.id.asc())
        )
        return list(result.scalars().all())

    async def _get_for_request(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> ContentDraft | None:
        result = await self.session.execute(
            select(ContentDraft)
            .options(selectinload(ContentDraft.slides))
            .where(
                ContentDraft.tenant_id == tenant_id,
                ContentDraft.content_request_id == request_id,
            )
        )
        return result.scalar_one_or_none()

    def _replace_slides(
        self,
        draft: ContentDraft,
        tenant_id: UUID,
        slides: list[CarouselSlideCreate],
    ) -> None:
        draft.slides = self._build_slides(tenant_id, slides)

    def _build_slides(
        self,
        tenant_id: UUID,
        slides: list[CarouselSlideCreate],
    ) -> list[CarouselSlide]:
        unique_slide_numbers = {slide.slide_number for slide in slides}
        if len(unique_slide_numbers) != len(slides):
            raise BadRequestError("Slide numbers must be unique within the draft.")

        return [
            CarouselSlide(
                tenant_id=tenant_id,
                slide_number=slide.slide_number,
                title=slide.title,
                body=slide.body,
                visual_notes=slide.visual_notes,
            )
            for slide in sorted(slides, key=lambda item: item.slide_number)
        ]
    def _validate_draft_ready_for_approval(
        self,
        content_request: ContentRequest,
        draft: ContentDraft,
    ) -> None:
        if not draft.title.strip():
            raise BadRequestError("Draft title cannot be empty.")

        has_body_content = any(
            [
                (draft.caption or "").strip(),
                (draft.fixed_comment or "").strip(),
                (draft.stories_suggestion or "").strip(),
            ]
        )
        if content_request.format == ContentFormat.CAROUSEL and not draft.slides:
            raise BadRequestError("Carousel drafts must include at least one slide.")
        if not has_body_content and not draft.slides:
            raise BadRequestError("Draft must contain textual content before approval.")

    def _validate_slides_for_request_format(
        self,
        content_request: ContentRequest,
        slides: list[CarouselSlideCreate],
    ) -> None:
        if content_request.format != ContentFormat.CAROUSEL and slides:
            raise BadRequestError(
                "Slides are only supported for carousel content requests."
            )

    def _sync_request_status_for_draft_creation(
        self,
        content_request: ContentRequest,
    ) -> None:
        if content_request.status in TEXT_MANAGED_STATUSES:
            raise ConflictError(
                "Cannot create a new draft while the content request is already "
                "in the text approval workflow."
            )

    def _add_approval_event(
        self,
        *,
        tenant_id: UUID,
        content_request: ContentRequest,
        content_draft: ContentDraft,
        event_type: ApprovalEventType,
        actor_type: ApprovalActorType,
        actor_name: str | None,
        from_status: str | None,
        to_status: str | None,
        comment: str | None,
    ) -> None:
        self.session.add(
            ApprovalEvent(
                tenant_id=tenant_id,
                content_request_id=content_request.id,
                content_draft_id=content_draft.id,
                event_type=event_type,
                actor_type=actor_type,
                actor_name=actor_name,
                from_status=from_status,
                to_status=to_status,
                comment=comment,
                created_at=datetime.now(UTC),
            )
        )
