from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.tenants.models import Tenant
from app.modules.tenants.schemas import TenantCreate
from app.shared.errors import ConflictError, NotFoundError


class TenantService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, payload: TenantCreate) -> Tenant:
        tenant = Tenant(**payload.model_dump())
        self.session.add(tenant)

        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("Tenant slug already exists.") from exc

        await self.session.refresh(tenant)
        return tenant

    async def list_all(self) -> list[Tenant]:
        result = await self.session.execute(
            select(Tenant).order_by(Tenant.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_or_404(self, tenant_id: UUID) -> Tenant:
        tenant = await self.session.get(Tenant, tenant_id)
        if tenant is None:
            raise NotFoundError("Tenant not found.")
        return tenant
