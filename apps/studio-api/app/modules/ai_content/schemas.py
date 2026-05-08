from __future__ import annotations

from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.content_drafts.schemas import ContentDraftResponse
from app.shared.enums import ContentFormat, ContentObjective


class ContentIdeaRequest(BaseModel):
    goal: ContentObjective
    count: int = Field(default=10, ge=1, le=20)
    format: ContentFormat = ContentFormat.CAROUSEL
    additional_context: str | None = None


class ContentIdeaResponseItem(BaseModel):
    title: str
    format: ContentFormat
    objective: ContentObjective
    rationale: str
    cta_suggestion: str | None = None


class ContentIdeasResponse(BaseModel):
    ideas: list[ContentIdeaResponseItem]


class GeneratedSlidePayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    slide_number: int
    title: str
    body: str | None = None
    visual_notes: str | None = None


class AIGenerateDraftPayload(BaseModel):
    slide_count: int = Field(default=5, ge=1, le=12)
    overwrite: bool = False
    extra_instructions: str | None = None


class QualityCheckScore(BaseModel):
    clarity: int = Field(ge=0, le=10)
    authority: int = Field(ge=0, le=10)
    niche_fit: int = Field(ge=0, le=10)
    brand_voice: int = Field(ge=0, le=10)
    conversion_potential: int = Field(ge=0, le=10)


class DraftQualityCheckResponse(BaseModel):
    approved: bool
    risk_level: Literal["low", "medium", "high"]
    score: QualityCheckScore
    warnings: list[str] = Field(default_factory=list)
    suggested_changes: list[str] = Field(default_factory=list)


class AIGenerateDraftResponse(BaseModel):
    draft: ContentDraftResponse
    quality_check: DraftQualityCheckResponse


class AIDraftOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    caption: str
    fixed_comment: str
    stories_suggestion: str
    slides: list[GeneratedSlidePayload]


class AIIdeasOutputItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    format: ContentFormat
    objective: ContentObjective
    rationale: str
    cta_suggestion: str


class AIIdeasOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    ideas: list[AIIdeasOutputItem]


class AIWorkflowResult(BaseModel):
    draft: ContentDraftResponse
    quality_check: DraftQualityCheckResponse
    overwritten: bool
    previous_status: str | None = None
    content_request_id: UUID
