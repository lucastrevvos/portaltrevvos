from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.shared.enums import ContentFormat, ContentObjective, ContentRequestStatus


class ContentRequestCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    format: ContentFormat
    objective: ContentObjective
    cta: str | None = Field(default=None, max_length=255)
    theme: str = Field(min_length=1, max_length=255)
    visual_template_id: UUID | None = None
    status: ContentRequestStatus = ContentRequestStatus.DRAFT
    briefing: str | None = None


class ContentRequestStatusUpdate(BaseModel):
    status: ContentRequestStatus


class ContentRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    title: str
    format: ContentFormat
    objective: ContentObjective
    cta: str | None
    theme: str
    visual_template_id: UUID | None
    status: ContentRequestStatus
    briefing: str | None
    created_at: datetime
    updated_at: datetime
