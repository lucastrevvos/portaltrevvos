from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.shared.enums import (
    ApprovalActorType,
    CreativeAssetStatus,
    CreativeAssetType,
    ImageRenderJobStatus,
    RenderSpecStatus,
    RenderType,
)


class RenderSpecGeneratePayload(BaseModel):
    visual_template_id: UUID
    actor_type: ApprovalActorType = ApprovalActorType.ADMIN
    actor_name: str | None = Field(default=None, max_length=255)
    comment: str | None = None
    force_regenerate: bool = False


class RenderWorkflowActionPayload(BaseModel):
    actor_type: ApprovalActorType = ApprovalActorType.ADMIN
    actor_name: str | None = Field(default=None, max_length=255)
    comment: str | None = None


class RenderSpecResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    content_request_id: UUID
    content_draft_id: UUID
    carousel_slide_id: UUID | None
    visual_template_id: UUID
    render_type: RenderType
    slide_number: int | None
    total_slides: int | None
    width: int
    height: int
    title: str
    body: str | None
    cta: str | None
    visual_notes: str | None
    brand_logo_url: str | None
    brand_primary_color: str | None
    brand_secondary_color: str | None
    brand_accent_color: str | None
    brand_visual_style: str | None
    photo_url: str | None
    status: RenderSpecStatus
    created_at: datetime
    updated_at: datetime


class RenderSpecGenerationResponse(BaseModel):
    content_request_id: UUID
    status: str
    render_specs: list[RenderSpecResponse]


class ImageRenderJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    content_request_id: UUID
    render_spec_id: UUID
    status: ImageRenderJobStatus
    renderer: str
    output_path: str | None
    error_message: str | None
    started_at: datetime | None
    finished_at: datetime | None
    created_at: datetime
    updated_at: datetime


class CreativeAssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    content_request_id: UUID
    render_spec_id: UUID | None
    image_render_job_id: UUID | None
    asset_type: CreativeAssetType
    url: str
    file_name: str
    mime_type: str
    width: int | None
    height: int | None
    status: CreativeAssetStatus
    created_at: datetime
    updated_at: datetime


class RenderExecutionResponse(BaseModel):
    content_request_id: UUID
    status: str
    assets: list[CreativeAssetResponse]
