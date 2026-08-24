from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.inquiry import InquiryCreate, InquiryRead
from app.services import inquiries as inquiry_service

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


@router.post("", response_model=InquiryRead, status_code=status.HTTP_201_CREATED)
def submit_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)) -> InquiryRead:
    """Public endpoint the contact form on the marketing site posts to."""
    inquiry = inquiry_service.create_inquiry(db, payload)
    return InquiryRead.model_validate(inquiry)
