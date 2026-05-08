from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.shared.enums import BrandAssetType


class BrandAssetUpdate(BaseModel):
    label: str | None = Field(default=None, max_length=255)
    asset_type: BrandAssetType
    is_primary: bool = False


class BrandAssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    asset_type: BrandAssetType
    label: str | None
    file_name: str
    mime_type: str
    storage_path: str
    public_url: str
    width: int | None
    height: int | None
    is_primary: bool
    created_at: datetime
    updated_at: datetime
