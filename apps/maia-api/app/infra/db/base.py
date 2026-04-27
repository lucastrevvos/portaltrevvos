from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings


def build_metadata(schema: str | None = None) -> MetaData:
    settings = get_settings()
    return MetaData(schema=schema or settings.db_schema)


class Base(DeclarativeBase):
    metadata = build_metadata()
