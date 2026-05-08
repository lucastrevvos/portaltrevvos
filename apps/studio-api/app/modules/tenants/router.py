from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.tenants.schemas import TenantCreate, TenantResponse
from app.modules.tenants.service import TenantService

router = APIRouter(prefix="/tenants", tags=["tenants"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post("", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def create_tenant(
    payload: TenantCreate,
    session: DbSession,
) -> TenantResponse:
    tenant = await TenantService(session).create(payload)
    return TenantResponse.model_validate(tenant)


@router.get("", response_model=list[TenantResponse])
async def list_tenants(
    session: DbSession,
) -> list[TenantResponse]:
    tenants = await TenantService(session).list_all()
    return [TenantResponse.model_validate(tenant) for tenant in tenants]


@router.get("/{tenant_id}", response_model=TenantResponse)
async def get_tenant(
    tenant_id: UUID,
    session: DbSession,
) -> TenantResponse:
    tenant = await TenantService(session).get_or_404(tenant_id)
    return TenantResponse.model_validate(tenant)
