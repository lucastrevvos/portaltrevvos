from __future__ import annotations

from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.tenants.service import TenantService
from app.modules.visual_templates.models import VisualTemplate
from app.modules.visual_templates.schemas import (
    VisualTemplateCreate,
    VisualTemplateUpdate,
)
from app.shared.errors import ConflictError, NotFoundError


class VisualTemplateService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.tenant_service = TenantService(session)

    async def create(
        self,
        tenant_id: UUID,
        payload: VisualTemplateCreate,
    ) -> VisualTemplate:
        await self.tenant_service.get_or_404(tenant_id)
        template = VisualTemplate(tenant_id=tenant_id, **payload.model_dump())
        self.session.add(template)
        await self.session.commit()
        await self.session.refresh(template)
        return template

    async def list_for_tenant(self, tenant_id: UUID) -> list[VisualTemplate]:
        await self.tenant_service.get_or_404(tenant_id)
        result = await self.session.execute(
            select(VisualTemplate)
            .where(
                or_(
                    VisualTemplate.tenant_id == tenant_id,
                    VisualTemplate.tenant_id.is_(None),
                )
            )
            .order_by(VisualTemplate.created_at.asc(), VisualTemplate.id.asc())
        )
        return list(result.scalars().all())

    async def get_for_tenant_or_404(
        self,
        tenant_id: UUID,
        template_id: UUID,
    ) -> VisualTemplate:
        await self.tenant_service.get_or_404(tenant_id)
        result = await self.session.execute(
            select(VisualTemplate).where(
                VisualTemplate.id == template_id,
                or_(
                    VisualTemplate.tenant_id == tenant_id,
                    VisualTemplate.tenant_id.is_(None),
                ),
            )
        )
        template = result.scalar_one_or_none()
        if template is None:
            raise NotFoundError("Visual template not found.")
        return template

    async def update(
        self,
        tenant_id: UUID,
        template_id: UUID,
        payload: VisualTemplateUpdate,
    ) -> VisualTemplate:
        template = await self.get_for_tenant_or_404(tenant_id, template_id)
        if template.tenant_id is None:
            raise ConflictError("Global visual templates cannot be updated here.")
        for field, value in payload.model_dump().items():
            setattr(template, field, value)
        await self.session.commit()
        await self.session.refresh(template)
        return template
