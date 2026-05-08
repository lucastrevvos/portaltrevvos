from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.visual_templates.schemas import (
    VisualTemplateCreate,
    VisualTemplateResponse,
    VisualTemplateUpdate,
)
from app.modules.visual_templates.service import VisualTemplateService

router = APIRouter(tags=["visual-templates"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post(
    "/tenants/{tenant_id}/visual-templates",
    response_model=VisualTemplateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_visual_template(
    tenant_id: UUID,
    payload: VisualTemplateCreate,
    session: DbSession,
) -> VisualTemplateResponse:
    return await VisualTemplateService(session).create(tenant_id, payload)


@router.get(
    "/tenants/{tenant_id}/visual-templates",
    response_model=list[VisualTemplateResponse],
)
async def list_visual_templates(
    tenant_id: UUID,
    session: DbSession,
) -> list[VisualTemplateResponse]:
    return await VisualTemplateService(session).list_for_tenant(tenant_id)


@router.get(
    "/tenants/{tenant_id}/visual-templates/{template_id}",
    response_model=VisualTemplateResponse,
)
async def get_visual_template(
    tenant_id: UUID,
    template_id: UUID,
    session: DbSession,
) -> VisualTemplateResponse:
    return await VisualTemplateService(session).get_for_tenant_or_404(
        tenant_id,
        template_id,
    )


@router.put(
    "/tenants/{tenant_id}/visual-templates/{template_id}",
    response_model=VisualTemplateResponse,
)
async def update_visual_template(
    tenant_id: UUID,
    template_id: UUID,
    payload: VisualTemplateUpdate,
    session: DbSession,
) -> VisualTemplateResponse:
    return await VisualTemplateService(session).update(tenant_id, template_id, payload)
