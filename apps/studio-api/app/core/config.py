from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

APP_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = APP_ROOT / ".env"


class Settings(BaseSettings):
    env: str = "development"
    api_name: str = "Trevvos Studio API"
    api_version: str = "0.1.0"
    api_port: int = 3350
    db_schema: str = "studio"
    generated_assets_dir: str = "generated/studio"
    generated_mount_dir: str = "generated"
    uploads_dir: str = "uploads"
    openai_api_key: str | None = None
    ai_model: str = "gpt-4.1-mini"
    image_model: str = "gpt-image-2"
    enable_ai_visual: bool = True
    database_url: str = (
        "postgresql+asyncpg://trevvos:trevvos@localhost:5432/trevvos"
    )

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_prefix="STUDIO_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
