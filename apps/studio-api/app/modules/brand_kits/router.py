from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.brand_kits.schemas import (
    BrandKitCreate,
    BrandKitResponse,
    BrandKitUpdate,
)
from app.modules.brand_kits.service import BrandKitService

router = APIRouter(prefix="/tenants/{tenant_id}/brand-kit", tags=["brand-kits"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post("", response_model=BrandKitResponse, status_code=status.HTTP_201_CREATED)
async def create_brand_kit(
    tenant_id: UUID,
    payload: BrandKitCreate,
    session: DbSession,
) -> BrandKitResponse:
    brand_kit = await BrandKitService(session).create(tenant_id, payload)
    return BrandKitResponse.model_validate(brand_kit)


@router.get("", response_model=BrandKitResponse)
async def get_brand_kit(
    tenant_id: UUID,
    session: DbSession,
) -> BrandKitResponse:
    brand_kit = await BrandKitService(session).get_or_404(tenant_id)
    return BrandKitResponse.model_validate(brand_kit)


@router.put("", response_model=BrandKitResponse)
async def update_brand_kit(
    tenant_id: UUID,
    payload: BrandKitUpdate,
    session: DbSession,
) -> BrandKitResponse:
    brand_kit = await BrandKitService(session).update(tenant_id, payload)
    return BrandKitResponse.model_validate(brand_kit)
