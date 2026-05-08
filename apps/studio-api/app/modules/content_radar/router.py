from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.content_radar.schemas import (
    ContentRadarRequest,
    ContentRadarSuggestionsResponse,
)
from app.modules.content_radar.service import ContentRadarService

router = APIRouter(tags=["content-radar"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post(
    "/tenants/{tenant_id}/content-radar/suggestions",
    response_model=ContentRadarSuggestionsResponse,
)
async def generate_content_radar_suggestions(
    tenant_id: UUID,
    payload: ContentRadarRequest,
    session: DbSession,
) -> ContentRadarSuggestionsResponse:
    return await ContentRadarService(session).generate_suggestions(tenant_id, payload)
