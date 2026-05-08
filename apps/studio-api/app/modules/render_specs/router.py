from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.render_specs.schemas import (
    CreativeAssetResponse,
    RenderExecutionResponse,
    RenderSpecGeneratePayload,
    RenderSpecGenerationResponse,
    RenderSpecResponse,
    RenderWorkflowActionPayload,
)
from app.modules.render_specs.service import RenderSpecService

router = APIRouter(tags=["rendering"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/render-specs/generate",
    response_model=RenderSpecGenerationResponse,
)
async def generate_render_specs(
    tenant_id: UUID,
    request_id: UUID,
    payload: RenderSpecGeneratePayload,
    session: DbSession,
) -> RenderSpecGenerationResponse:
    content_request, specs = await RenderSpecService(session).generate(
        tenant_id,
        request_id,
        payload,
    )
    return RenderSpecGenerationResponse(
        content_request_id=content_request.id,
        status=content_request.status.value,
        render_specs=[RenderSpecResponse.model_validate(spec) for spec in specs],
    )


@router.get(
    "/tenants/{tenant_id}/content-requests/{request_id}/render-specs",
    response_model=list[RenderSpecResponse],
)
async def list_render_specs(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
) -> list[RenderSpecResponse]:
    specs = await RenderSpecService(session).list_for_request(tenant_id, request_id)
    return [RenderSpecResponse.model_validate(spec) for spec in specs]


@router.get(
    "/tenants/{tenant_id}/content-requests/{request_id}/render-specs/{spec_id}",
    response_model=RenderSpecResponse,
)
async def get_render_spec(
    tenant_id: UUID,
    request_id: UUID,
    spec_id: UUID,
    session: DbSession,
) -> RenderSpecResponse:
    spec = await RenderSpecService(session).get_or_404(tenant_id, request_id, spec_id)
    return RenderSpecResponse.model_validate(spec)


@router.post(
    "/tenants/{tenant_id}/content-requests/{request_id}/render",
    response_model=RenderExecutionResponse,
)
async def render_content_request(
    tenant_id: UUID,
    request_id: UUID,
    payload: RenderWorkflowActionPayload,
    session: DbSession,
) -> RenderExecutionResponse:
    content_request, assets = await RenderSpecService(session).render_request(
        tenant_id,
        request_id,
        payload,
    )
    return RenderExecutionResponse(
        content_request_id=content_request.id,
        status=content_request.status.value,
        assets=[CreativeAssetResponse.model_validate(asset) for asset in assets],
    )


@router.get(
    "/tenants/{tenant_id}/content-requests/{request_id}/creative-assets",
    response_model=list[CreativeAssetResponse],
)
async def list_creative_assets(
    tenant_id: UUID,
    request_id: UUID,
    session: DbSession,
) -> list[CreativeAssetResponse]:
    assets = await RenderSpecService(session).list_assets(tenant_id, request_id)
    return [CreativeAssetResponse.model_validate(asset) for asset in assets]
