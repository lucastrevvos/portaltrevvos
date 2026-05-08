from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from app.shared.text import slugify


def build_safe_file_name(source_name: str, fallback_stem: str, extension: str) -> str:
    stem = Path(source_name).stem or fallback_stem
    cleaned_stem = slugify(stem)
    cleaned_extension = extension.lstrip(".").lower() or "bin"
    return f"{cleaned_stem}-{uuid4().hex[:12]}.{cleaned_extension}"


def build_public_url(path: str) -> str:
    normalized = path.replace("\\", "/")
    return f"/{normalized.lstrip('/')}"
