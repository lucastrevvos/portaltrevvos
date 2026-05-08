from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.shared.enums import (
    ApprovalActorType,
    ApprovalEventType,
    ContentDraftStatus,
)


class CarouselSlideBase(BaseModel):
    slide_number: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=255)
    body: str | None = None
    visual_notes: str | None = None


class CarouselSlideCreate(CarouselSlideBase):
    pass


class CarouselSlideResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    content_draft_id: UUID
    slide_number: int
    title: str
    body: str | None
    visual_notes: str | None
    created_at: datetime
    updated_at: datetime


class ContentDraftBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    caption: str | None = None
    fixed_comment: str | None = None
    stories_suggestion: str | None = None
    slides: list[CarouselSlideCreate] = Field(default_factory=list)


class ContentDraftCreate(ContentDraftBase):
    pass


class ContentDraftUpdate(ContentDraftBase):
    slides: list[CarouselSlideCreate] | None = None


class ContentDraftResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    content_request_id: UUID
    title: str
    caption: str | None
    fixed_comment: str | None
    stories_suggestion: str | None
    status: ContentDraftStatus
    version: int
    slides: list[CarouselSlideResponse]
    created_at: datetime
    updated_at: datetime


class DraftWorkflowActionPayload(BaseModel):
    actor_type: ApprovalActorType = ApprovalActorType.CLIENT
    actor_name: str | None = Field(default=None, max_length=255)
    comment: str | None = None


class ApprovalEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    content_request_id: UUID
    content_draft_id: UUID | None
    event_type: ApprovalEventType
    actor_type: ApprovalActorType
    actor_name: str | None
    from_status: str | None
    to_status: str | None
    comment: str | None
    created_at: datetime
