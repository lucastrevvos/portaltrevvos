from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.modules.onboarding.schemas import (
    OnboardingCreate,
    OnboardingResponse,
    OnboardingUpdate,
)
from app.modules.onboarding.service import OnboardingService

router = APIRouter(prefix="/tenants/{tenant_id}/onboarding", tags=["onboarding"])
DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.post("", response_model=OnboardingResponse, status_code=status.HTTP_201_CREATED)
async def create_onboarding(
    tenant_id: UUID,
    payload: OnboardingCreate,
    session: DbSession,
) -> OnboardingResponse:
    onboarding = await OnboardingService(session).create(tenant_id, payload)
    return OnboardingResponse.model_validate(onboarding)


@router.get("", response_model=OnboardingResponse)
async def get_onboarding(
    tenant_id: UUID,
    session: DbSession,
) -> OnboardingResponse:
    onboarding = await OnboardingService(session).get_or_404(tenant_id)
    return OnboardingResponse.model_validate(onboarding)


@router.put("", response_model=OnboardingResponse)
async def update_onboarding(
    tenant_id: UUID,
    payload: OnboardingUpdate,
    session: DbSession,
) -> OnboardingResponse:
    onboarding = await OnboardingService(session).update(tenant_id, payload)
    return OnboardingResponse.model_validate(onboarding)
