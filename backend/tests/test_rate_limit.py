from fastapi.testclient import TestClient

from app.main import app
from app.services.rate_limit import InMemoryRateLimiter, get_rate_limiter


def _payload(name: str) -> dict[str, str]:
    return {"name": name, "contact": "person@example.com", "problem": "Need help."}


def test_rate_limiter_allows_then_blocks() -> None:
    limiter = InMemoryRateLimiter(max_requests=2, window_seconds=60)

    assert limiter.is_allowed("1.2.3.4") is True
    assert limiter.is_allowed("1.2.3.4") is True
    assert limiter.is_allowed("1.2.3.4") is False

    # A different key has its own independent budget.
    assert limiter.is_allowed("5.6.7.8") is True


def test_submit_inquiry_is_throttled_per_ip(client: TestClient) -> None:
    # One shared instance across requests — the override must return the
    # *same* limiter each time, or every request gets a fresh empty budget.
    limiter = InMemoryRateLimiter(max_requests=2, window_seconds=60)
    app.dependency_overrides[get_rate_limiter] = lambda: limiter

    try:
        first = client.post("/api/v1/inquiries", json=_payload("One"))
        second = client.post("/api/v1/inquiries", json=_payload("Two"))
        third = client.post("/api/v1/inquiries", json=_payload("Three"))

        assert first.status_code == 201
        assert second.status_code == 201
        assert third.status_code == 429
    finally:
        del app.dependency_overrides[get_rate_limiter]
