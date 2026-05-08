from __future__ import annotations

from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class GenerateVisualBackgroundsPayload(BaseModel):
    overwrite: bool = False
    style_mode: Literal["brand_aligned", "editorial"] = "brand_aligned"
    slides: list[int] | None = Field(default=None, min_length=1)


class GeneratedVisualBackgroundResponseItem(BaseModel):
    slide_number: int
    asset_id: UUID
    public_url: str


class GenerateVisualBackgroundsResponse(BaseModel):
    content_request_id: UUID
    generated_backgrounds: list[GeneratedVisualBackgroundResponseItem]
