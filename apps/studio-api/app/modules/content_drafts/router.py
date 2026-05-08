from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.content_drafts.schemas import (
    ApprovalEventResponse,
    ContentDraftCreate,
    ContentDraftResponse,
    ContentDraftUpdate,
    DraftWorkflowActionPayload,
)
from app.modules.content_drafts.service import ContentDraftService

router = APIRouter(tags=["content-drafts"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/draft",
    response_model=ContentDraftResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_content_draft(
    tenant_id: UUID,
    request_id: UUID,
    payload: ContentDraftCreate,
    session: DbSession,
) -> ContentDraftResponse:
    draft = await ContentDraftService(session).create(tenant_id, request_id, payload)
    return ContentDraftResponse.model_validate(draft)


@router.get(
    "/tenants/{tenant_id}/content-requests/{request_id}/draft",
    response_model=ContentDraftResponse,
)
async def get_content_draft(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
) -> ContentDraftResponse:
    draft = await ContentDraftService(session).get_or_404(tenant_id, request_id)
    return ContentDraftResponse.model_validate(draft)


@router.put(
    "/tenants/{tenant_id}/content-requests/{request_id}/draft",
    response_model=ContentDraftResponse,
)
async def update_content_draft(
    tenant_id: UUID,
    request_id: UUID,
    payload: ContentDraftUpdate,
    session: DbSession,
) -> ContentDraftResponse:
    draft = await ContentDraftService(session).update(tenant_id, request_id, payload)
    return ContentDraftResponse.model_validate(draft)


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/draft/submit",
    response_model=ContentDraftResponse,
)
async def submit_content_draft(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
    payload: DraftWorkflowActionPayload | None = None,
) -> ContentDraftResponse:
    draft = await ContentDraftService(session).submit_for_approval(
        tenant_id,
        request_id,
        payload,
    )
    return ContentDraftResponse.model_validate(draft)


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/draft/request-revision",
    response_model=ContentDraftResponse,
)
async def request_draft_revision(
    tenant_id: UUID,
    request_id: UUID,
    payload: DraftWorkflowActionPayload,
    session: DbSession,
) -> ContentDraftResponse:
    draft = await ContentDraftService(session).request_revision(
        tenant_id,
        request_id,
        payload,
    )
    return ContentDraftResponse.model_validate(draft)


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/draft/approve",
    response_model=ContentDraftResponse,
)
async def approve_content_draft(
    tenant_id: UUID,
    request_id: UUID,
    payload: DraftWorkflowActionPayload,
    session: DbSession,
) -> ContentDraftResponse:
    draft = await ContentDraftService(session).approve(
        tenant_id,
        request_id,
        payload,
    )
    return ContentDraftResponse.model_validate(draft)


@router.get(
    "/tenants/{tenant_id}/content-requests/{request_id}/approval-events",
    response_model=list[ApprovalEventResponse],
)
async def list_approval_events(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
) -> list[ApprovalEventResponse]:
    events = await ContentDraftService(session).list_approval_events(
        tenant_id,
        request_id,
    )
    return [ApprovalEventResponse.model_validate(event) for event in events]
