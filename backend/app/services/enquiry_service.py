from datetime import UTC, datetime
import logging
from typing import Any

from bson import ObjectId

from app.core.database import mongo_db
from app.schemas.enquiry_schema import EnquiryCreateRequest, EnquiryResponse
from app.services.notification_service import send_enquiry_notifications


logger = logging.getLogger("smt.backend.enquiry")


class EnquiryServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def _enquiries_collection():
    return mongo_db.database["enquiries"]


async def ensure_enquiry_indexes() -> None:
    await _enquiries_collection().create_index("created_at")


def _serialize(document: dict[str, Any]) -> EnquiryResponse:
    return EnquiryResponse(
        id=str(document["_id"]),
        name=document["name"],
        email=document["email"],
        company=document["company"],
        subject=document["subject"],
        message=document["message"],
        is_read=document.get("is_read", False),
        created_at=document["created_at"],
    )


async def create_enquiry(payload: EnquiryCreateRequest) -> EnquiryResponse:
    document = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "company": payload.company.strip(),
        "subject": payload.subject.strip(),
        "message": payload.message.strip(),
        "is_read": False,
        "created_at": datetime.now(UTC),
    }
    result = await _enquiries_collection().insert_one(document)
    saved = await _enquiries_collection().find_one({"_id": result.inserted_id})
    if saved is None:
        raise EnquiryServiceError(status_code=500, detail="Failed to create enquiry")

    enquiry = _serialize(saved)
    try:
        await send_enquiry_notifications(
            name=enquiry.name,
            email=enquiry.email,
            company=enquiry.company,
            subject=enquiry.subject,
            message=enquiry.message,
        )
    except Exception:
        logger.exception("enquiry_notification_failed enquiry_id=%s", enquiry.id)
    return enquiry


async def list_enquiries() -> list[EnquiryResponse]:
    cursor = _enquiries_collection().find({}).sort("created_at", -1)
    documents = await cursor.to_list(length=2000)
    return [_serialize(doc) for doc in documents]


async def mark_enquiry_read(enquiry_id: str) -> EnquiryResponse:
    if not ObjectId.is_valid(enquiry_id):
        raise EnquiryServiceError(status_code=404, detail="Enquiry not found")

    result = await _enquiries_collection().update_one(
        {"_id": ObjectId(enquiry_id)},
        {"$set": {"is_read": True}},
    )
    if result.matched_count == 0:
        raise EnquiryServiceError(status_code=404, detail="Enquiry not found")

    updated = await _enquiries_collection().find_one({"_id": ObjectId(enquiry_id)})
    if updated is None:
        raise EnquiryServiceError(status_code=404, detail="Enquiry not found")
    return _serialize(updated)
