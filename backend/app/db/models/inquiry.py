import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Inquiry(Base):
    """A contact-form submission from the marketing site.

    Mirrors the InquiryCreate schema in app/schemas/inquiry.py — see
    docs/LLD.md §5 (Contact/inquiry flow) for the end-to-end flow.
    """

    __tablename__ = "inquiries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    business: Mapped[str | None] = mapped_column(String(200), nullable=True)
    contact: Mapped[str] = mapped_column(String(200), nullable=False)
    problem: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="new")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
