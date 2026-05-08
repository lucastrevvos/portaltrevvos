from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.ai_content.schemas import (
    AIGenerateDraftPayload,
    AIGenerateDraftResponse,
    ContentIdeaRequest,
    ContentIdeasResponse,
    DraftQualityCheckResponse,
)
from app.modules.ai_content.service import AIContentService

router = APIRouter(tags=["ai-content"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post(
    "/tenants/{tenant_id}/ai/content-ideas",
    response_model=ContentIdeasResponse,
)
async def generate_content_ideas(
    tenant_id: UUID,
    payload: ContentIdeaRequest,
    session: DbSession,
) -> ContentIdeasResponse:
    return await AIContentService(session).generate_content_ideas(tenant_id, payload)


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/ai/generate-draft",
    response_model=AIGenerateDraftResponse,
)
async def generate_content_draft_with_ai(
    tenant_id: UUID,
    request_id: UUID,
    payload: AIGenerateDraftPayload,
    session: DbSession,
) -> AIGenerateDraftResponse:
    return await AIContentService(session).generate_draft(
        tenant_id,
        request_id,
        payload,
    )


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/ai/check-draft-quality",
    response_model=DraftQualityCheckResponse,
)
async def check_draft_quality(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
) -> DraftQualityCheckResponse:
    return await AIContentService(session).check_draft_quality(tenant_id, request_id)
