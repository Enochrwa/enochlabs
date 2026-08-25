from fastapi.testclient import TestClient

from app.api.deps import settings as deps_settings


def test_list_inquiries_refuses_when_not_configured(client: TestClient) -> None:
    assert deps_settings.admin_api_key is None

    response = client.get("/api/v1/inquiries")

    assert response.status_code == 503


def test_list_inquiries_rejects_wrong_key(client: TestClient, monkeypatch) -> None:
    monkeypatch.setattr(deps_settings, "admin_api_key", "correct-horse-battery-staple")

    response = client.get("/api/v1/inquiries", headers={"X-Admin-Key": "wrong"})

    assert response.status_code == 401


def test_list_inquiries_rejects_missing_key(client: TestClient, monkeypatch) -> None:
    monkeypatch.setattr(deps_settings, "admin_api_key", "correct-horse-battery-staple")

    response = client.get("/api/v1/inquiries")

    assert response.status_code == 401


def test_list_inquiries_with_valid_key_returns_stored_inquiries(
    client: TestClient, monkeypatch
) -> None:
    monkeypatch.setattr(deps_settings, "admin_api_key", "correct-horse-battery-staple")
    headers = {"X-Admin-Key": "correct-horse-battery-staple"}

    client.post(
        "/api/v1/inquiries",
        json={"name": "Dana", "contact": "dana@example.com", "problem": "Need a website."},
    )

    response = client.get("/api/v1/inquiries", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Dana"


def test_list_inquiries_filters_by_status(client: TestClient, monkeypatch) -> None:
    monkeypatch.setattr(deps_settings, "admin_api_key", "correct-horse-battery-staple")
    headers = {"X-Admin-Key": "correct-horse-battery-staple"}

    client.post(
        "/api/v1/inquiries",
        json={"name": "Eve", "contact": "eve@example.com", "problem": "Need help."},
    )

    response = client.get(
        "/api/v1/inquiries", headers=headers, params={"status_filter": "contacted"}
    )

    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0}
