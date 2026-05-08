from __future__ import annotations

from collections.abc import AsyncGenerator
from enum import Enum as PyEnum

from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import Settings, get_settings


def build_metadata(schema: str | None = None) -> MetaData:
    settings = get_settings()
    return MetaData(schema=schema or settings.db_schema)


class Base(DeclarativeBase):
    metadata = build_metadata()


def create_engine(settings: Settings | None = None) -> AsyncEngine:
    resolved_settings = settings or get_settings()
    return create_async_engine(
        resolved_settings.database_url,
        pool_pre_ping=True,
        echo=resolved_settings.env == "development",
    )


settings = get_settings()
STUDIO_SCHEMA = settings.db_schema


def enum_values(enum_cls: type[PyEnum]) -> list[str]:
    return [str(member.value) for member in enum_cls]


def studio_enum(
    enum_cls: type[PyEnum],
    *,
    name: str,
) -> SQLAlchemyEnum:
    return SQLAlchemyEnum(
        enum_cls,
        name=name,
        schema=STUDIO_SCHEMA,
        values_callable=enum_values,
        validate_strings=True,
    )


engine = create_engine(settings)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
