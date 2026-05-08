import asyncio
from collections.abc import AsyncGenerator, Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings
from app.core.database import Base, get_db_session
from app.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
def session() -> Generator[AsyncSession, None, None]:
    engine = create_async_engine(
        TEST_DATABASE_URL,
        future=True,
        poolclass=StaticPool,
    )

    @event.listens_for(engine.sync_engine, "connect")
    def attach_studio_schema(dbapi_connection, _connection_record) -> None:  # type: ignore[no-untyped-def]
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("ATTACH DATABASE ':memory:' AS studio")
        cursor.close()

    async def setup_database() -> async_sessionmaker[AsyncSession]:
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

        return async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )

    session_factory = asyncio.run(setup_database())
    db_session = session_factory()
    try:
        yield db_session
    finally:
        asyncio.run(db_session.close())

        async def teardown_database() -> None:
            async with engine.begin() as connection:
                await connection.run_sync(Base.metadata.drop_all)
            await engine.dispose()

        asyncio.run(teardown_database())


@pytest.fixture
def client(
    session: AsyncSession,
    tmp_path: Path,
) -> Generator[TestClient, None, None]:
    settings = get_settings()
    original_generated_dir = settings.generated_assets_dir
    original_uploads_dir = settings.uploads_dir
    settings.generated_assets_dir = str(tmp_path / "generated" / "studio")
    settings.uploads_dir = str(tmp_path / "uploads")

    async def override_get_db_session() -> AsyncGenerator[AsyncSession, None]:
        yield session

    app.dependency_overrides[get_db_session] = override_get_db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    settings.generated_assets_dir = original_generated_dir
    settings.uploads_dir = original_uploads_dir
