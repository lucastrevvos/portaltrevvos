from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    env: str = "development"
    api_name: str = "Ma.ia API"
    api_version: str = "0.1.0"
    api_port: int = 3340
    db_schema: str = "maia"
    trevvos_auth_issuer: str = Field(
        default="trevvos-auth",
        validation_alias="TREVVOS_AUTH_ISSUER",
    )
    trevvos_auth_app_slug: str = Field(
        default="maia",
        validation_alias="TREVVOS_AUTH_APP_SLUG",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="MAIA_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
