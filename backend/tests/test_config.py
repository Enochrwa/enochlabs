from app.core.config import Settings


def test_cors_origins_default() -> None:
    settings = Settings()
    assert "http://localhost:5173" in settings.cors_origins_list


def test_cors_origins_comma_separated_string() -> None:
    settings = Settings(cors_origins="https://enochlabs.dev, https://www.enochlabs.dev")
    assert settings.cors_origins_list == ["https://enochlabs.dev", "https://www.enochlabs.dev"]


def test_cors_origins_single_value() -> None:
    settings = Settings(cors_origins="https://enochlabs.dev")
    assert settings.cors_origins_list == ["https://enochlabs.dev"]


def test_cors_origins_ignores_blank_entries() -> None:
    settings = Settings(cors_origins="https://enochlabs.dev,,  ,https://www.enochlabs.dev")
    assert settings.cors_origins_list == ["https://enochlabs.dev", "https://www.enochlabs.dev"]
