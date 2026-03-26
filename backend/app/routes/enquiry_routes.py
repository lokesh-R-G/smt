from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.auth_schema import UserResponse
from app.schemas.enquiry_schema import EnquiryCreateRequest, EnquiryResponse
from app.services.enquiry_service import EnquiryServiceError, create_enquiry, list_enquiries, mark_enquiry_read
from app.utils.dependencies import get_admin_user
from app.utils.rate_limit import rate_limit

router = APIRouter(prefix="/enquiry", tags=["enquiry"])
admin_router = APIRouter(prefix="/admin/enquiries", tags=["admin-enquiries"])


async def _create_enquiry(payload: EnquiryCreateRequest) -> EnquiryResponse:
    try:
        return await create_enquiry(payload)
    except EnquiryServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
async def submit_enquiry(
    payload: EnquiryCreateRequest,
    _: None = Depends(rate_limit("enquiry_submit", max_requests=8, window_seconds=60)),
) -> EnquiryResponse:
    return await _create_enquiry(payload)


@router.post("/submit", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
async def submit_enquiry_legacy(
    payload: EnquiryCreateRequest,
    _: None = Depends(rate_limit("enquiry_submit", max_requests=8, window_seconds=60)),
) -> EnquiryResponse:
    return await _create_enquiry(payload)


@admin_router.get("", response_model=list[EnquiryResponse])
async def get_admin_enquiries(_: UserResponse = Depends(get_admin_user)) -> list[EnquiryResponse]:
    return await list_enquiries()


@admin_router.put("/{enquiry_id}/read", response_model=EnquiryResponse)
async def mark_read(enquiry_id: str, _: UserResponse = Depends(get_admin_user)) -> EnquiryResponse:
    try:
        return await mark_enquiry_read(enquiry_id)
    except EnquiryServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
