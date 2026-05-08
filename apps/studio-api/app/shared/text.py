from __future__ import annotations

import re
import unicodedata


def slugify(value: str) -> str:
    """Normalize text only for slugs, filenames, and paths.

    Do not use this for user-facing content such as titles, captions, or body text.
    """
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value).strip("-").lower()
    return cleaned or "item"
