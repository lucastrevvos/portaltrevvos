from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.brand_kits.models import BrandKit
from app.modules.brand_kits.schemas import BrandKitCreate, BrandKitUpdate
from app.modules.tenants.service import TenantService
from app.shared.errors import ConflictError, NotFoundError


class BrandKitService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.tenant_service = TenantService(session)

    async def create(self, tenant_id: UUID, payload: BrandKitCreate) -> BrandKit:
        await self.tenant_service.get_or_404(tenant_id)

        existing = await self._get_for_tenant(tenant_id)
        if existing is not None:
            raise ConflictError("Brand kit already exists for this tenant.")

        brand_kit = BrandKit(
            tenant_id=tenant_id,
            **payload.model_dump(mode="json"),
        )
        self.session.add(brand_kit)
        await self.session.commit()
        await self.session.refresh(brand_kit)
        return brand_kit

    async def get_or_404(self, tenant_id: UUID) -> BrandKit:
        await self.tenant_service.get_or_404(tenant_id)
        brand_kit = await self._get_for_tenant(tenant_id)
        if brand_kit is None:
            raise NotFoundError("Brand kit not found.")
        return brand_kit

    async def update(self, tenant_id: UUID, payload: BrandKitUpdate) -> BrandKit:
        brand_kit = await self.get_or_404(tenant_id)
        for field, value in payload.model_dump(mode="json").items():
            setattr(brand_kit, field, value)

        await self.session.commit()
        await self.session.refresh(brand_kit)
        return brand_kit

    async def _get_for_tenant(self, tenant_id: UUID) -> BrandKit | None:
        result = await self.session.execute(
            select(BrandKit).where(BrandKit.tenant_id == tenant_id)
        )
        return result.scalar_one_or_none()
