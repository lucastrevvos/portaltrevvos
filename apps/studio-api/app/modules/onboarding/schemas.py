from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.shared.enums import ServiceMode


class OnboardingBase(BaseModel):
    professional_name: str = Field(min_length=1, max_length=255)
    instagram_handle: str | None = Field(default=None, max_length=255)
    website_url: HttpUrl | None = None
    whatsapp_number: str | None = Field(default=None, max_length=50)
    city: str | None = Field(default=None, max_length=255)
    service_mode: ServiceMode
    target_audience: str = Field(min_length=1)
    audience_pain_points: str = Field(min_length=1)
    main_services: str = Field(min_length=1)
    desired_positioning: str = Field(min_length=1)
    tone_of_voice: str = Field(min_length=1)
    avoid_communication: str | None = None
    brand_phrase: str | None = None
    main_cta: str | None = Field(default=None, max_length=255)


class OnboardingCreate(OnboardingBase):
    pass


class OnboardingUpdate(OnboardingBase):
    pass


class OnboardingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    professional_name: str
    instagram_handle: str | None
    website_url: str | None
    whatsapp_number: str | None
    city: str | None
    service_mode: ServiceMode
    target_audience: str
    audience_pain_points: str
    main_services: str
    desired_positioning: str
    tone_of_voice: str
    avoid_communication: str | None
    brand_phrase: str | None
    main_cta: str | None
    created_at: datetime
    updated_at: datetime
