import threading
import time
from collections import defaultdict, deque

from app.core.config import get_settings

settings = get_settings()


class InMemoryRateLimiter:
    """A simple sliding-window rate limiter, keyed by an arbitrary string
    (e.g. a client IP).

    This is process-local: it does not share state across multiple backend
    workers/instances or survive a restart. That's a deliberate trade-off for
    a solo-founder deployment at current traffic (see
    docs/SPRINT-PLAN.md Sprint 3) — cheap and dependency-free. If EnochLabs
    ever runs multiple backend processes/instances behind a load balancer,
    swap this for a shared store (e.g. Redis) instead.
    """

    def __init__(self, max_requests: int, window_seconds: int) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def is_allowed(self, key: str) -> bool:
        """Record a hit for ``key`` and report whether it's within the
        allowed rate. Returns False (and does not record) once ``key`` has
        hit ``max_requests`` within the trailing ``window_seconds``."""
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and now - hits[0] > self.window_seconds:
                hits.popleft()
            if len(hits) >= self.max_requests:
                return False
            hits.append(now)
            return True


_default_limiter = InMemoryRateLimiter(
    max_requests=settings.inquiry_rate_limit_max,
    window_seconds=settings.inquiry_rate_limit_window_seconds,
)


def get_rate_limiter() -> InMemoryRateLimiter:
    """FastAPI dependency provider — overridable in tests."""
    return _default_limiter
