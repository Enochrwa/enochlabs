import logging

import httpx
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryStatus

logger = logging.getLogger(__name__)
settings = get_settings()


def create_inquiry(db: Session, payload: InquiryCreate) -> Inquiry:
    inquiry = Inquiry(
        name=payload.name,
        business=payload.business,
        contact=payload.contact,
        problem=payload.problem,
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    _notify(inquiry)

    return inquiry


def list_inquiries(
    db: Session,
    *,
    status_filter: InquiryStatus | None = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Inquiry], int]:
    """Admin-only listing, newest first. Returns (page, total matching count)
    so the caller can paginate without a second round trip."""
    query = db.query(Inquiry)
    if status_filter is not None:
        query = query.filter(Inquiry.status == status_filter)

    total = query.count()
    items = query.order_by(Inquiry.created_at.desc()).offset(skip).limit(limit).all()
    return items, total


def _notify(inquiry: Inquiry) -> None:
    """Best-effort webhook ping for a new inquiry. Never blocks or fails the
    request that created it — the inquiry is already safely in the database
    (see docs/LLD.md §5: an inquiry must never be a dead end)."""
    if not settings.inquiry_notify_webhook:
        return

    try:
        httpx.post(
            settings.inquiry_notify_webhook,
            json=_notify_payload(inquiry),
            timeout=5.0,
        )
    except httpx.HTTPError as error:
        logger.warning("Failed to notify inquiry webhook: %s", error)


def _notify_payload(inquiry: Inquiry) -> dict[str, str | None]:
    """Shape the notify payload for the configured webhook target.

    See ``inquiry_notify_webhook_format`` in app/core/config.py and
    docs/DEPLOYMENT.md "Configuring inquiry notifications" — Slack/Discord
    incoming webhooks expect a specific single-field payload, not arbitrary
    JSON, so a plain email-relay/Zapier webhook and a chat webhook need
    different shapes.
    """
    summary_lines = [f"New inquiry from {inquiry.name}"]
    if inquiry.business:
        summary_lines.append(f"Business: {inquiry.business}")
    summary_lines.append(f"Contact: {inquiry.contact}")
    summary_lines.append(f"Problem: {inquiry.problem}")
    summary = "\n".join(summary_lines)

    if settings.inquiry_notify_webhook_format == "slack":
        return {"text": summary}
    if settings.inquiry_notify_webhook_format == "discord":
        return {"content": summary}

    return {
        "name": inquiry.name,
        "business": inquiry.business,
        "contact": inquiry.contact,
        "problem": inquiry.problem,
    }
