from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class EnquiryCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    company: str = Field(min_length=2, max_length=180)
    subject: str = Field(min_length=3, max_length=200)
    message: str = Field(min_length=10, max_length=3000)


class EnquiryResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    company: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime
