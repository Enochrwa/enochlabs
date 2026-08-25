import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.deps import get_client_ip, require_admin
from app.db.session import get_db
from app.schemas.inquiry import (
    InquiryCreate,
    InquiryListResponse,
    InquiryRead,
    InquiryStatus,
)
from app.services import inquiries as inquiry_service
from app.services.rate_limit import InMemoryRateLimiter, get_rate_limiter

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


def enforce_rate_limit(
    request: Request, limiter: InMemoryRateLimiter = Depends(get_rate_limiter)
) -> None:
    """Cheap spam protection: throttle POSTs per client IP. See
    app/services/rate_limit.py and docs/SPRINT-PLAN.md Sprint 3."""
    if not limiter.is_allowed(get_client_ip(request)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many inquiries from this address recently. Please try again later.",
        )


@router.post(
    "",
    response_model=InquiryRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(enforce_rate_limit)],
)
def submit_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)) -> InquiryRead:
    """Public endpoint the contact form on the marketing site posts to."""
    if payload.hp_website:
        # Honeypot tripped: a real visitor never sees or fills this field
        # (it's hidden via CSS in the frontend ContactForm). Respond exactly
        # as if it succeeded — so a bot doesn't learn to route around it —
        # but never persist it or notify anyone.
        return InquiryRead(
            id=uuid.uuid4(),
            name=payload.name,
            business=payload.business,
            contact=payload.contact,
            problem=payload.problem,
            status="new",
            created_at=datetime.now(UTC),
        )

    inquiry = inquiry_service.create_inquiry(db, payload)
    return InquiryRead.model_validate(inquiry)


@router.get(
    "",
    response_model=InquiryListResponse,
    dependencies=[Depends(require_admin)],
)
def list_inquiries(
    db: Session = Depends(get_db),
    status_filter: InquiryStatus | None = None,
    skip: int = 0,
    limit: int = 50,
) -> InquiryListResponse:
    """Admin-only: list stored inquiries, newest first.

    Gated by the `X-Admin-Key` shared-secret header (see `app/api/deps.py`)
    until real per-user auth arrives in Phase 3 — see docs/SPRINT-PLAN.md
    Sprint 3 and docs/ROADMAP.md. Consumed by the internal `/admin` view in
    the frontend.
    """
    limit = max(1, min(limit, 200))
    skip = max(0, skip)
    items, total = inquiry_service.list_inquiries(
        db, status_filter=status_filter, skip=skip, limit=limit
    )
    read_items = [InquiryRead.model_validate(item) for item in items]
    return InquiryListResponse(items=read_items, total=total)
