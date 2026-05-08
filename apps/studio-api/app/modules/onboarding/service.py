from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.onboarding.models import OnboardingProfile
from app.modules.onboarding.schemas import OnboardingCreate, OnboardingUpdate
from app.modules.tenants.service import TenantService
from app.shared.errors import ConflictError, NotFoundError


class OnboardingService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.tenant_service = TenantService(session)

    async def create(
        self,
        tenant_id: UUID,
        payload: OnboardingCreate,
    ) -> OnboardingProfile:
        await self.tenant_service.get_or_404(tenant_id)

        existing = await self._get_for_tenant(tenant_id)
        if existing is not None:
            raise ConflictError("Onboarding profile already exists for this tenant.")

        onboarding = OnboardingProfile(
            tenant_id=tenant_id,
            **payload.model_dump(mode="json"),
        )
        self.session.add(onboarding)
        await self.session.commit()
        await self.session.refresh(onboarding)
        return onboarding

    async def get_or_404(self, tenant_id: UUID) -> OnboardingProfile:
        await self.tenant_service.get_or_404(tenant_id)
        onboarding = await self._get_for_tenant(tenant_id)
        if onboarding is None:
            raise NotFoundError("Onboarding profile not found.")
        return onboarding

    async def update(
        self,
        tenant_id: UUID,
        payload: OnboardingUpdate,
    ) -> OnboardingProfile:
        onboarding = await self.get_or_404(tenant_id)
        for field, value in payload.model_dump(mode="json").items():
            setattr(onboarding, field, value)

        await self.session.commit()
        await self.session.refresh(onboarding)
        return onboarding

    async def _get_for_tenant(self, tenant_id: UUID) -> OnboardingProfile | None:
        result = await self.session.execute(
            select(OnboardingProfile).where(OnboardingProfile.tenant_id == tenant_id)
        )
        return result.scalar_one_or_none()
