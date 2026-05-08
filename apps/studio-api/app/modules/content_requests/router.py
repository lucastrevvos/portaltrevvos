from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.content_requests.schemas import (
    ContentRequestCreate,
    ContentRequestResponse,
    ContentRequestStatusUpdate,
)
from app.modules.content_requests.service import ContentRequestService

router = APIRouter(
    prefix="/tenants/{tenant_id}/content-requests",
    tags=["content-requests"],
)
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post(
    "",
    response_model=ContentRequestResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_content_request(
    tenant_id: UUID,
    payload: ContentRequestCreate,
    session: DbSession,
) -> ContentRequestResponse:
    content_request = await ContentRequestService(session).create(tenant_id, payload)
    return ContentRequestResponse.model_validate(content_request)


@router.get("", response_model=list[ContentRequestResponse])
async def list_content_requests(
    tenant_id: UUID,
    session: DbSession,
) -> list[ContentRequestResponse]:
    content_requests = await ContentRequestService(session).list_for_tenant(tenant_id)
    return [
        ContentRequestResponse.model_validate(content_request)
        for content_request in content_requests
    ]


@router.get("/{request_id}", response_model=ContentRequestResponse)
async def get_content_request(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
) -> ContentRequestResponse:
    content_request = await ContentRequestService(session).get_or_404(
        tenant_id,
        request_id,
    )
    return ContentRequestResponse.model_validate(content_request)


@router.patch("/{request_id}/status", response_model=ContentRequestResponse)
async def update_content_request_status(
    tenant_id: UUID,
    request_id: UUID,
    payload: ContentRequestStatusUpdate,
    session: DbSession,
) -> ContentRequestResponse:
    content_request = await ContentRequestService(session).update_status(
        tenant_id,
        request_id,
        payload,
    )
    return ContentRequestResponse.model_validate(content_request)
