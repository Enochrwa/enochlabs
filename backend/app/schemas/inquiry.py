import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

InquiryStatus = Literal["new", "contacted", "closed"]


class InquiryCreate(BaseModel):
    """Payload accepted from the public contact form (see frontend ContactForm)."""

    name: str = Field(min_length=1, max_length=200)
    business: str | None = Field(default=None, max_length=200)
    contact: str = Field(min_length=1, max_length=200)
    problem: str = Field(min_length=1, max_length=5000)


class InquiryRead(BaseModel):
    """What we return to a client (e.g. an admin view) after creation/listing."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    business: str | None
    contact: str
    problem: str
    status: InquiryStatus
    created_at: datetime
