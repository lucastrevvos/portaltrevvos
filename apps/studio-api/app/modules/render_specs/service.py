from __future__ import annotations

from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.modules.brand_assets.service import BrandAssetService
from app.modules.brand_kits.models import BrandKit
from app.modules.content_drafts.models import ApprovalEvent, ContentDraft
from app.modules.content_requests.models import ContentRequest
from app.modules.content_requests.service import ContentRequestService
from app.modules.onboarding.models import OnboardingProfile
from app.modules.render_specs.models import CreativeAsset, ImageRenderJob, RenderSpec
from app.modules.render_specs.schemas import (
    RenderSpecGeneratePayload,
    RenderWorkflowActionPayload,
)
from app.modules.rendering.service import HtmlCssRenderer
from app.modules.tenants.models import Tenant
from app.modules.visual_templates.models import VisualTemplate
from app.modules.visual_templates.service import VisualTemplateService
from app.shared.enums import (
    ApprovalActorType,
    ApprovalEventType,
    BrandAssetType,
    ContentDraftStatus,
    ContentFormat,
    ContentRequestStatus,
    CreativeAssetStatus,
    CreativeAssetType,
    ImageRenderJobStatus,
    RenderMode,
    RenderSpecStatus,
    RenderType,
)
from app.shared.errors import BadRequestError, ConflictError, NotFoundError
from app.shared.text import slugify


class RenderSpecService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.content_request_service = ContentRequestService(session)
        self.visual_template_service = VisualTemplateService(session)
        self.brand_asset_service = BrandAssetService(session)
        self.renderer = HtmlCssRenderer()

    async def generate(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: RenderSpecGeneratePayload,
    ) -> tuple[ContentRequest, list[RenderSpec]]:
        content_request = await self._get_request_with_related(tenant_id, request_id)
        template = await self.visual_template_service.get_for_tenant_or_404(
            tenant_id,
            payload.visual_template_id,
        )
        draft = content_request.draft
        if draft is None:
            raise NotFoundError("Content draft not found.")
        if content_request.status != ContentRequestStatus.TEXT_APPROVED:
            raise BadRequestError(
                "Render specs can only be generated after text approval."
            )
        if draft.status != ContentDraftStatus.APPROVED:
            raise BadRequestError("Only approved drafts can generate render specs.")

        existing_specs = await self._list_specs(tenant_id, request_id)
        active_specs = [
            spec for spec in existing_specs if spec.status != RenderSpecStatus.DISCARDED
        ]
        if active_specs and not payload.force_regenerate:
            raise ConflictError(
                "Render specs already exist for this request. "
                "Use force_regenerate to replace them."
            )
        for spec in active_specs:
            spec.status = RenderSpecStatus.DISCARDED

        primary_logo = await self.brand_asset_service.get_primary(
            tenant_id,
            BrandAssetType.LOGO,
        )
        logo_url = (
            primary_logo.public_url
            if primary_logo is not None
            else (
                content_request.tenant.brand_kit.logo_url
                if content_request.tenant.brand_kit
                else None
            )
        )
        specs = self._build_specs(
            tenant=content_request.tenant,
            content_request=content_request,
            draft=draft,
            template=template,
            brand_kit=content_request.tenant.brand_kit,
            onboarding_profile=content_request.tenant.onboarding_profile,
            logo_url=logo_url,
        )
        for spec in specs:
            self.session.add(spec)

        previous_status = content_request.status
        content_request.status = ContentRequestStatus.VISUAL_PROMPT_READY
        content_request.visual_template_id = template.id
        self._add_status_event(
            tenant_id=tenant_id,
            content_request=content_request,
            content_draft=draft,
            from_status=previous_status.value,
            to_status=content_request.status.value,
            comment=payload.comment or "Render specs generated for visual production.",
        )
        await self.session.commit()
        return content_request, await self._list_specs(tenant_id, request_id)

    async def list_for_request(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> list[RenderSpec]:
        await self.content_request_service.get_or_404(tenant_id, request_id)
        return await self._list_specs(tenant_id, request_id)

    async def get_or_404(
        self,
        tenant_id: UUID,
        request_id: UUID,
        spec_id: UUID,
    ) -> RenderSpec:
        await self.content_request_service.get_or_404(tenant_id, request_id)
        result = await self.session.execute(
            select(RenderSpec).where(
                RenderSpec.id == spec_id,
                RenderSpec.tenant_id == tenant_id,
                RenderSpec.content_request_id == request_id,
            )
        )
        spec = result.scalar_one_or_none()
        if spec is None:
            raise NotFoundError("Render spec not found.")
        return spec

    async def render_request(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: RenderWorkflowActionPayload,
    ) -> tuple[ContentRequest, list[CreativeAsset]]:
        content_request = await self._get_request_with_related(tenant_id, request_id)
        if content_request.status != ContentRequestStatus.VISUAL_PROMPT_READY:
            raise BadRequestError(
                "Rendering can only start after visual specs are ready."
            )
        ready_specs = await self._list_specs(
            tenant_id,
            request_id,
            statuses=[RenderSpecStatus.READY],
        )
        if not ready_specs:
            raise BadRequestError("No ready render specs found for this request.")

        template_map = await self._get_templates_for_specs(tenant_id, ready_specs)
        request_slug = slugify(content_request.theme or content_request.title)
        primary_logo = await self.brand_asset_service.get_primary(
            tenant_id,
            BrandAssetType.LOGO,
        )
        background_assets = await self._get_background_assets_for_specs(
            tenant_id,
            request_id,
            ready_specs,
        )
        if payload.mode == RenderMode.AI_VISUAL:
            missing_slides = [
                spec.slide_number
                for spec in ready_specs
                if spec.id not in background_assets
            ]
            if missing_slides:
                raise BadRequestError(
                    "AI visual render requested but some slide backgrounds "
                    "are missing. "
                    "Generate visual backgrounds before rendering with ai_visual."
                )
        previous_status = content_request.status

        for spec in ready_specs:
            template = template_map[spec.visual_template_id]
            job = ImageRenderJob(
                tenant_id=tenant_id,
                content_request_id=request_id,
                render_spec_id=spec.id,
                status=ImageRenderJobStatus.RUNNING,
                started_at=datetime.now(UTC),
            )
            self.session.add(job)
            await self.session.flush()

            try:
                output_path, public_url = await self.renderer.render(
                    tenant_slug=content_request.tenant.slug,
                    tenant_name=content_request.tenant.name,
                    request_slug=request_slug,
                    request_id=str(content_request.id),
                    spec=spec,
                    template=template,
                    background_asset_url=(
                        background_assets[spec.id].url
                        if payload.mode == RenderMode.AI_VISUAL
                        and spec.id in background_assets
                        else None
                    ),
                    logo_asset_url=(
                        primary_logo.public_url
                        if primary_logo is not None
                        else (
                            content_request.tenant.brand_kit.logo_url
                            if content_request.tenant.brand_kit
                            else None
                        )
                    ),
                    render_mode=payload.mode.value,
                )
                job.status = ImageRenderJobStatus.COMPLETED
                job.output_path = str(output_path)
                job.finished_at = datetime.now(UTC)
                spec.status = RenderSpecStatus.RENDERED
                self.session.add(
                    CreativeAsset(
                        tenant_id=tenant_id,
                        content_request_id=request_id,
                        render_spec_id=spec.id,
                        image_render_job_id=job.id,
                        asset_type=CreativeAssetType.RENDERED_SLIDE,
                        url=public_url,
                        file_name=output_path.name,
                        width=spec.width,
                        height=spec.height,
                        status=CreativeAssetStatus.READY_FOR_REVIEW,
                    )
                )
            except Exception as exc:
                job.status = ImageRenderJobStatus.FAILED
                job.error_message = str(exc)
                job.finished_at = datetime.now(UTC)
                raise

        content_request.status = ContentRequestStatus.IN_MANUAL_PRODUCTION
        self._add_status_event(
            tenant_id=tenant_id,
            content_request=content_request,
            content_draft=content_request.draft,
            from_status=previous_status.value,
            to_status=content_request.status.value,
            comment=payload.comment or "Visual rendering started for this request.",
        )
        await self.session.commit()
        return content_request, await self.list_assets(tenant_id, request_id)

    async def list_assets(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> list[CreativeAsset]:
        await self.content_request_service.get_or_404(tenant_id, request_id)
        result = await self.session.execute(
            select(CreativeAsset)
            .where(
                CreativeAsset.tenant_id == tenant_id,
                CreativeAsset.content_request_id == request_id,
            )
            .order_by(CreativeAsset.created_at.asc(), CreativeAsset.id.asc())
        )
        return list(result.scalars().all())

    async def _get_request_with_related(
        self,
        tenant_id: UUID,
        request_id: UUID,
    ) -> ContentRequest:
        result = await self.session.execute(
            select(ContentRequest)
            .options(
                selectinload(ContentRequest.draft).selectinload(ContentDraft.slides),
                selectinload(ContentRequest.tenant).selectinload(Tenant.brand_kit),
                selectinload(ContentRequest.tenant).selectinload(Tenant.onboarding_profile),
            )
            .where(
                ContentRequest.id == request_id,
                ContentRequest.tenant_id == tenant_id,
            )
        )
        content_request = result.scalar_one_or_none()
        if content_request is None:
            raise NotFoundError("Content request not found.")
        return content_request

    async def _list_specs(
        self,
        tenant_id: UUID,
        request_id: UUID,
        statuses: list[RenderSpecStatus] | None = None,
    ) -> list[RenderSpec]:
        statement = (
            select(RenderSpec)
            .where(
                RenderSpec.tenant_id == tenant_id,
                RenderSpec.content_request_id == request_id,
            )
            .order_by(
                RenderSpec.slide_number.asc().nulls_last(),
                RenderSpec.created_at.asc(),
            )
        )
        if statuses:
            statement = statement.where(RenderSpec.status.in_(statuses))
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def _get_templates_for_specs(
        self,
        tenant_id: UUID,
        specs: list[RenderSpec],
    ) -> dict[UUID, VisualTemplate]:
        template_ids = sorted({spec.visual_template_id for spec in specs}, key=str)
        templates = [
            await self.visual_template_service.get_for_tenant_or_404(
                tenant_id,
                template_id,
            )
            for template_id in template_ids
        ]
        return {template.id: template for template in templates}

    async def _get_background_assets_for_specs(
        self,
        tenant_id: UUID,
        request_id: UUID,
        specs: list[RenderSpec],
    ) -> dict[UUID, CreativeAsset]:
        spec_ids = [spec.id for spec in specs]
        if not spec_ids:
            return {}
        result = await self.session.execute(
            select(CreativeAsset)
            .where(
                CreativeAsset.tenant_id == tenant_id,
                CreativeAsset.content_request_id == request_id,
                CreativeAsset.asset_type == CreativeAssetType.GENERATED_BACKGROUND,
                CreativeAsset.render_spec_id.in_(spec_ids),
            )
            .order_by(CreativeAsset.created_at.asc(), CreativeAsset.id.asc())
        )
        backgrounds: dict[UUID, CreativeAsset] = {}
        for asset in result.scalars().all():
            if asset.render_spec_id is not None:
                backgrounds[asset.render_spec_id] = asset
        return backgrounds

    def _build_specs(
        self,
        *,
        tenant: Tenant,
        content_request: ContentRequest,
        draft: ContentDraft,
        template: VisualTemplate,
        brand_kit: BrandKit | None,
        onboarding_profile: OnboardingProfile | None,
        logo_url: str | None,
    ) -> list[RenderSpec]:
        total_slides = len(draft.slides)
        if content_request.format == ContentFormat.CAROUSEL:
            return [
                RenderSpec(
                    tenant_id=tenant.id,
                    content_request_id=content_request.id,
                    content_draft_id=draft.id,
                    carousel_slide_id=slide.id,
                    visual_template_id=template.id,
                    render_type=self._resolve_render_type(
                        slide.slide_number,
                        total_slides,
                    ),
                    slide_number=slide.slide_number,
                    total_slides=total_slides,
                    width=template.width,
                    height=template.height,
                    title=slide.title,
                    body=slide.body,
                    cta=content_request.cta,
                    visual_notes=slide.visual_notes,
                    brand_logo_url=logo_url,
                    brand_primary_color=brand_kit.primary_color if brand_kit else None,
                    brand_secondary_color=(
                        brand_kit.secondary_color if brand_kit else None
                    ),
                    brand_accent_color=brand_kit.accent_color if brand_kit else None,
                    brand_visual_style=brand_kit.visual_style if brand_kit else None,
                    photo_url=None,
                    status=RenderSpecStatus.READY,
                )
                for slide in draft.slides
            ]

        return [
            RenderSpec(
                tenant_id=tenant.id,
                content_request_id=content_request.id,
                content_draft_id=draft.id,
                carousel_slide_id=None,
                visual_template_id=template.id,
                render_type=RenderType.STATIC_POST,
                slide_number=None,
                total_slides=None,
                width=template.width,
                height=template.height,
                title=draft.title,
                body=draft.caption or draft.stories_suggestion,
                cta=content_request.cta,
                visual_notes=draft.fixed_comment,
                brand_logo_url=logo_url,
                brand_primary_color=brand_kit.primary_color if brand_kit else None,
                brand_secondary_color=brand_kit.secondary_color if brand_kit else None,
                brand_accent_color=brand_kit.accent_color if brand_kit else None,
                brand_visual_style=brand_kit.visual_style if brand_kit else None,
                photo_url=(
                    onboarding_profile.website_url if onboarding_profile else None
                ),
                status=RenderSpecStatus.READY,
            )
        ]

    def _resolve_render_type(
        self,
        slide_number: int,
        total_slides: int,
    ) -> RenderType:
        if slide_number == 1:
            return RenderType.COVER_SLIDE
        if slide_number == total_slides:
            return RenderType.CLOSING_SLIDE
        return RenderType.CAROUSEL_SLIDE

    def _add_status_event(
        self,
        *,
        tenant_id: UUID,
        content_request: ContentRequest,
        content_draft: ContentDraft | None,
        from_status: str,
        to_status: str,
        comment: str | None,
    ) -> None:
        self.session.add(
            ApprovalEvent(
                tenant_id=tenant_id,
                content_request_id=content_request.id,
                content_draft_id=content_draft.id if content_draft else None,
                event_type=ApprovalEventType.STATUS_CHANGED,
                actor_type=ApprovalActorType.SYSTEM,
                actor_name=None,
                from_status=from_status,
                to_status=to_status,
                comment=comment,
                created_at=datetime.now(UTC),
            )
        )
