from fastapi import Header, HTTPException, Request, status

from app.core.config import get_settings

settings = get_settings()


def require_admin(x_admin_key: str | None = Header(default=None, alias="X-Admin-Key")) -> None:
    """Gate admin-only endpoints behind a shared-secret header.

    This is an interim measure (see docs/SPRINT-PLAN.md Sprint 3) — real
    per-user authentication arrives with the client portal in Phase 3 (see
    docs/ROADMAP.md). If ``ADMIN_API_KEY`` isn't set, admin endpoints refuse
    every request rather than silently allowing access.
    """
    if not settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin access is not configured on this deployment.",
        )
    if x_admin_key != settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin key.",
        )


def get_client_ip(request: Request) -> str:
    """Best-effort client IP for rate limiting.

    Respects a proxy's ``X-Forwarded-For`` header — Render, Vercel, and most
    hosting platforms sit the app behind one, so ``request.client.host``
    alone would just see the proxy's address.
    """
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"
