from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.shared.enums import ContentFormat, ContentObjective


class ContentRadarRequest(BaseModel):
    count: int = Field(default=6, ge=1, le=12)
    format: ContentFormat | None = None
    objective: ContentObjective | None = None
    additional_context: str | None = None
    avoid_repeating_recent_themes: bool = False


class ContentRadarSuggestionItem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    theme: str
    format: ContentFormat
    objective: ContentObjective
    cta: str
    briefing: str
    extra_instructions: str
    rationale: str
    content_angle: str
    estimated_difficulty: Literal["easy", "medium", "hard"]
    risk_level: Literal["low", "medium", "high"]


class ContentRadarSuggestionsResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    suggestions: list[ContentRadarSuggestionItem]


class ContentRadarSuggestionsOutput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    suggestions: list[ContentRadarSuggestionItem]


class ContentRadarRequestContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    count: int
    format: ContentFormat | None
    objective: ContentObjective | None
    additional_context: str | None
    avoid_repeating_recent_themes: bool
    recent_requests: list[dict[str, str | None]]


class ContentRadarTenantContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tenant: dict[str, str | None]
    onboarding: dict[str, str | None]
    brand_kit: dict[str, str | None] | None
    recent_requests: list[dict[str, str | None]]
