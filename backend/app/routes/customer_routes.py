from fastapi import APIRouter, Depends

from app.schemas.auth_schema import UserResponse
from app.schemas.customer_schema import AdminCustomerResponse
from app.services.customer_service import list_admin_customers
from app.utils.dependencies import get_admin_user

router = APIRouter(prefix="/admin/customers", tags=["admin-customers"])


@router.get("", response_model=list[AdminCustomerResponse])
async def get_admin_customers(_: UserResponse = Depends(get_admin_user)) -> list[AdminCustomerResponse]:
    return await list_admin_customers()
