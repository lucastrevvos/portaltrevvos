import pytest

from app.core.config import Settings
from app.infra.db.base import build_metadata
from app.infra.db.schema import create_schema_sql, quote_schema_name
from app.infra.db.session import create_engine


def test_settings_include_async_database_url() -> None:
    settings = Settings()

    assert settings.database_url.startswith("postgresql+asyncpg://")
    assert settings.db_schema == "maia"


def test_metadata_uses_configured_schema() -> None:
    metadata = build_metadata("maia_test")

    assert metadata.schema == "maia_test"


def test_create_schema_sql_quotes_schema_name() -> None:
    assert create_schema_sql("maia") == 'CREATE SCHEMA IF NOT EXISTS "maia"'
    assert quote_schema_name("custom-schema") == '"custom-schema"'


def test_empty_schema_name_is_invalid() -> None:
    with pytest.raises(ValueError):
        create_schema_sql(" ")


def test_create_engine_uses_asyncpg_url_without_connecting() -> None:
    settings = Settings(
        database_url="postgresql+asyncpg://user:pass@localhost:5432/db",
    )
    engine = create_engine(settings)

    try:
        assert engine.url.drivername == "postgresql+asyncpg"
    finally:
        engine.sync_engine.dispose()
