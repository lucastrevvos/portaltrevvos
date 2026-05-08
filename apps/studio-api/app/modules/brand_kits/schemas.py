from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.shared.enums import PhotoUsagePreference


class BrandKitBase(BaseModel):
    logo_url: HttpUrl | None = None
    primary_color: str | None = Field(default=None, max_length=32)
    secondary_color: str | None = Field(default=None, max_length=32)
    accent_color: str | None = Field(default=None, max_length=32)
    font_preferences: str | None = None
    visual_style: str | None = None
    photo_usage_preference: PhotoUsagePreference = PhotoUsagePreference.UNKNOWN
    layout_preference: str | None = None


class BrandKitCreate(BrandKitBase):
    pass


class BrandKitUpdate(BrandKitBase):
    pass


class BrandKitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    logo_url: str | None
    primary_color: str | None
    secondary_color: str | None
    accent_color: str | None
    font_preferences: str | None
    visual_style: str | None
    photo_usage_preference: PhotoUsagePreference
    layout_preference: str | None
    created_at: datetime
    updated_at: datetime
