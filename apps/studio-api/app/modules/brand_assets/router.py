from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.brand_assets.schemas import BrandAssetResponse, BrandAssetUpdate
from app.modules.brand_assets.service import BrandAssetService
from app.shared.enums import BrandAssetType

router = APIRouter(tags=["brand-assets"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.get(
    "/tenants/{tenant_id}/brand-assets",
    response_model=list[BrandAssetResponse],
)
async def list_brand_assets(
    tenant_id: UUID,
    session: DbSession,
) -> list[BrandAssetResponse]:
    assets = await BrandAssetService(session).list_for_tenant(tenant_id)
    return [BrandAssetResponse.model_validate(asset) for asset in assets]


@router.post(
    "/tenants/{tenant_id}/brand-assets",
    response_model=BrandAssetResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_brand_asset(
    tenant_id: UUID,
    session: DbSession,
    file: Annotated[UploadFile, File(...)],
    asset_type: Annotated[BrandAssetType, Form(..., alias="type")],
    label: Annotated[str | None, Form()] = None,
    is_primary: Annotated[bool, Form()] = False,
) -> BrandAssetResponse:
    asset = await BrandAssetService(session).create(
        tenant_id,
        file,
        asset_type,
        label,
        is_primary,
    )
    return BrandAssetResponse.model_validate(asset)


@router.put(
    "/tenants/{tenant_id}/brand-assets/{asset_id}",
    response_model=BrandAssetResponse,
)
async def update_brand_asset(
    tenant_id: UUID,
    asset_id: UUID,
    payload: BrandAssetUpdate,
    session: DbSession,
) -> BrandAssetResponse:
    asset = await BrandAssetService(session).update(tenant_id, asset_id, payload)
    return BrandAssetResponse.model_validate(asset)


@router.delete(
    "/tenants/{tenant_id}/brand-assets/{asset_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_brand_asset(
    tenant_id: UUID,
    asset_id: UUID,
    session: DbSession,
) -> None:
    await BrandAssetService(session).delete(tenant_id, asset_id)
