from __future__ import annotations

import asyncio
from logging.config import fileConfig

from sqlalchemy import pool, text
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context
from app.core.config import get_settings
from app.core.database import Base
from app.modules.brand_kits import models as brand_kit_models  # noqa: F401
from app.modules.content_drafts import models as content_draft_models  # noqa: F401
from app.modules.content_requests import models as content_request_models  # noqa: F401
from app.modules.onboarding import models as onboarding_models  # noqa: F401
from app.modules.tenants import models as tenant_models  # noqa: F401

config = context.config
settings = get_settings()
target_metadata = Base.metadata

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def _create_schema_sql(schema_name: str) -> str:
    escaped_schema_name = schema_name.strip().replace('"', '""')
    return f'CREATE SCHEMA IF NOT EXISTS "{escaped_schema_name}"'


def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,
        version_table="alembic_version",
        version_table_schema=settings.db_schema,
    )

    with context.begin_transaction():
        context.execute(_create_schema_sql(settings.db_schema))
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    connection.execute(text(_create_schema_sql(settings.db_schema)))
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        include_schemas=True,
        version_table="alembic_version",
        version_table_schema=settings.db_schema,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    section = config.get_section(config.config_ini_section, {})
    section["sqlalchemy.url"] = settings.database_url
    connectable = async_engine_from_config(
        section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
