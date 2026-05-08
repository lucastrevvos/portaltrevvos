from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.shared.enums import VisualTemplateCategory


class VisualTemplateBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    category: VisualTemplateCategory
    layout_rules: str = Field(min_length=1)
    css_theme: dict[str, Any] = Field(default_factory=dict)
    default_aspect_ratio: str = Field(default="1:1", min_length=3, max_length=50)
    width: int = Field(default=1080, ge=1)
    height: int = Field(default=1080, ge=1)
    is_active: bool = True


class VisualTemplateCreate(VisualTemplateBase):
    pass


class VisualTemplateUpdate(VisualTemplateBase):
    pass


class VisualTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID | None
    name: str
    description: str | None
    category: VisualTemplateCategory
    layout_rules: str
    css_theme: dict[str, Any]
    default_aspect_ratio: str
    width: int
    height: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
