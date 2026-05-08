from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.content_requests.models import ContentRequest
from app.modules.content_requests.schemas import (
    ContentRequestCreate,
    ContentRequestStatusUpdate,
)
from app.modules.tenants.service import TenantService
from app.shared.enums import ContentRequestStatus
from app.shared.errors import ConflictError, NotFoundError

MANAGED_TEXT_STATUSES = {
    ContentRequestStatus.AWAITING_TEXT_APPROVAL,
    ContentRequestStatus.TEXT_REVISION_REQUESTED,
    ContentRequestStatus.TEXT_APPROVED,
}
MANAGED_VISUAL_STATUSES = {
    ContentRequestStatus.VISUAL_PROMPT_READY,
    ContentRequestStatus.IN_MANUAL_PRODUCTION,
}
VISUAL_WORKFLOW_STATUSES = {
    ContentRequestStatus.VISUAL_PROMPT_READY,
    ContentRequestStatus.IN_MANUAL_PRODUCTION,
    ContentRequestStatus.AWAITING_FINAL_APPROVAL,
    ContentRequestStatus.FINAL_REVISION_REQUESTED,
    ContentRequestStatus.DELIVERED,
}


class ContentRequestService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.tenant_service = TenantService(session)

    async def create(
        self,
        tenant_id: UUID,
        payload: ContentRequestCreate,
    ) -> ContentRequest:
        await self.tenant_service.get_or_404(tenant_id)
        content_request = ContentRequest(
            tenant_id=tenant_id,
            **payload.model_dump(),
        )
        self.session.add(content_request)
        await self.session.commit()
        await self.session.refresh(content_request)
        return content_request

    async def list_for_tenant(self, tenant_id: UUID) -> list[ContentRequest]:
        await self.tenant_service.get_or_404(tenant_id)
        result = await self.session.execute(
            select(ContentRequest)
            .where(ContentRequest.tenant_id == tenant_id)
            .order_by(ContentRequest.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_or_404(self, tenant_id: UUID, request_id: UUID) -> ContentRequest:
        await self.tenant_service.get_or_404(tenant_id)
        result = await self.session.execute(
            select(ContentRequest).where(
                ContentRequest.id == request_id,
                ContentRequest.tenant_id == tenant_id,
            )
        )
        content_request = result.scalar_one_or_none()
        if content_request is None:
            raise NotFoundError("Content request not found.")
        return content_request

    async def update_status(
        self,
        tenant_id: UUID,
        request_id: UUID,
        payload: ContentRequestStatusUpdate,
    ) -> ContentRequest:
        content_request = await self.get_or_404(tenant_id, request_id)
        if payload.status in MANAGED_TEXT_STATUSES | MANAGED_VISUAL_STATUSES:
            raise ConflictError(
                "Workflow-managed statuses must be changed through dedicated "
                "workflow endpoints."
            )
        if (
            payload.status in VISUAL_WORKFLOW_STATUSES
            and content_request.status != ContentRequestStatus.TEXT_APPROVED
        ):
            raise ConflictError(
                "Visual workflow cannot start before the text is approved."
            )
        content_request.status = payload.status
        await self.session.commit()
        await self.session.refresh(content_request)
        return content_request
