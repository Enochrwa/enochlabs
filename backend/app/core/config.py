from functools import lru_cache

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration, loaded from environment variables / .env."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    project_name: str = "EnochLabs API"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"  # development | staging | production
    debug: bool = True

    # Database
    database_url: str = "postgresql+psycopg://enochlabs:enochlabs@localhost:5432/enochlabs"

    # CORS — origins allowed to call this API (the frontend's dev + production URLs)
    cors_origins: list[AnyHttpUrl] | list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Outbound notification for new inquiries (optional — e.g. an email relay webhook)
    inquiry_notify_webhook: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
