from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models.inquiry import Inquiry


def test_submit_inquiry_success(client: TestClient) -> None:
    payload = {
        "name": "Alice",
        "business": "Alice's Shop",
        "contact": "+250780000000",
        "problem": "No website yet.",
    }

    response = client.post("/api/v1/inquiries", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["business"] == payload["business"]
    assert data["contact"] == payload["contact"]
    assert data["problem"] == payload["problem"]
    assert data["status"] == "new"
    assert "id" in data
    assert "created_at" in data


def test_submit_inquiry_without_business(client: TestClient) -> None:
    payload = {
        "name": "Bob",
        "contact": "bob@example.com",
        "problem": "Stock tracking is a mess.",
    }

    response = client.post("/api/v1/inquiries", json=payload)

    assert response.status_code == 201
    assert response.json()["business"] is None


def test_submit_inquiry_missing_required_field(client: TestClient) -> None:
    payload = {"name": "Charlie", "contact": "charlie@example.com"}

    response = client.post("/api/v1/inquiries", json=payload)

    assert response.status_code == 422


def test_submit_inquiry_honeypot_looks_successful_but_is_dropped(
    client: TestClient, db_session: Session
) -> None:
    payload = {
        "name": "Spambot",
        "contact": "bot@example.com",
        "problem": "Buy my product!",
        "hp_website": "https://spam.example.com",
    }

    response = client.post("/api/v1/inquiries", json=payload)

    # Looks like an ordinary success to whatever submitted it...
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == payload["name"]
    assert data["status"] == "new"

    # ...but nothing was actually written to the database.
    count = db_session.execute(
        select(func.count()).select_from(Inquiry).where(Inquiry.name == "Spambot")
    ).scalar_one()
    assert count == 0
