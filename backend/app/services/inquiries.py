import logging

import httpx
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate

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


def _notify(inquiry: Inquiry) -> None:
    """Best-effort webhook ping for a new inquiry. Never blocks or fails the
    request that created it — the inquiry is already safely in the database
    (see docs/LLD.md §5: an inquiry must never be a dead end)."""
    if not settings.inquiry_notify_webhook:
        return

    try:
        httpx.post(
            settings.inquiry_notify_webhook,
            json={
                "name": inquiry.name,
                "business": inquiry.business,
                "contact": inquiry.contact,
                "problem": inquiry.problem,
            },
            timeout=5.0,
        )
    except httpx.HTTPError as error:
        logger.warning("Failed to notify inquiry webhook: %s", error)
