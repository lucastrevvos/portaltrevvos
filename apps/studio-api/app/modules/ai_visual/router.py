from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.ai_visual.schemas import (
    GenerateVisualBackgroundsPayload,
    GenerateVisualBackgroundsResponse,
)
from app.modules.ai_visual.service import AIVisualService
from app.modules.render_specs.schemas import CreativeAssetResponse

router = APIRouter(tags=["ai-visual"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/ai/generate-visual-backgrounds",
    response_model=GenerateVisualBackgroundsResponse,
)
async def generate_visual_backgrounds(
    tenant_id: UUID,
    request_id: UUID,
    payload: GenerateVisualBackgroundsPayload,
    session: DbSession,
) -> GenerateVisualBackgroundsResponse:
    return await AIVisualService(session).generate_backgrounds(
        tenant_id,
        request_id,
        payload,
    )


@router.get(
    "/tenants/{tenant_id}/content-requests/{request_id}/ai/visual-backgrounds",
    response_model=list[CreativeAssetResponse],
)
async def list_visual_backgrounds(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
) -> list[CreativeAssetResponse]:
    assets = await AIVisualService(session).list_backgrounds(tenant_id, request_id)
    return [CreativeAssetResponse.model_validate(asset) for asset in assets]
