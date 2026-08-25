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

    # Shape of the payload posted to inquiry_notify_webhook:
    #   "generic" — raw JSON of the inquiry fields (e.g. for an email-relay/Zapier hook)
    #   "slack"   — {"text": "..."} , the shape Slack/Mattermost incoming webhooks expect
    #   "discord" — {"content": "..."}, the shape a Discord webhook expects
    # See docs/DEPLOYMENT.md "Configuring inquiry notifications".
    inquiry_notify_webhook_format: str = "generic"

    # Rate limiting for POST /api/v1/inquiries, per client IP (see
    # app/services/rate_limit.py). Cheap spam protection without a CAPTCHA
    # dependency — see docs/SPRINT-PLAN.md Sprint 3.
    inquiry_rate_limit_max: int = 20
    inquiry_rate_limit_window_seconds: int = 3600

    # Shared-secret header (X-Admin-Key) gating admin-only endpoints (e.g.
    # GET /api/v1/inquiries) until real per-user auth arrives in Phase 3
    # (see docs/ROADMAP.md). Unset by default — admin endpoints refuse all
    # requests until this is configured.
    admin_api_key: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
