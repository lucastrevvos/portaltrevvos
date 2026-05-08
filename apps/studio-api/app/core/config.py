from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    env: str = "development"
    api_name: str = "Trevvos Studio API"
    api_version: str = "0.1.0"
    api_port: int = 3350
    db_schema: str = "studio"
    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/trevvos"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="STUDIO_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
