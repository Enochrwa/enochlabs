from functools import lru_cache

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

    # CORS — origins allowed to call this API (the frontend's dev + production URLs).
    # Set via the CORS_ORIGINS env var as a plain comma-separated string (e.g.
    # "https://enochlabs.dev,https://www.enochlabs.dev") — a single-line value
    # that's easy to paste into a hosting dashboard (e.g. Render) without needing
    # JSON-escaping. Use the `cors_origins` property below to get the parsed list.
    # See docs/DEPLOYMENT.md.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    # Outbound notification for new inquiries (optional — e.g. an email relay webhook)
    inquiry_notify_webhook: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
