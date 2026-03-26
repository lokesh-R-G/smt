from fastapi import APIRouter, Depends, HTTPException

from app.schemas.auth_schema import UserResponse
from app.schemas.order_schema import CreateOrderRequest, OrderResponse, UpdateOrderStatusRequest
from app.services.order_service import (
    OrderServiceError,
    create_order,
    list_all_orders,
    list_my_orders,
    mark_order_completed,
    update_order_status,
)
from app.utils.dependencies import get_admin_user, get_current_user
from app.utils.rate_limit import rate_limit

router = APIRouter(prefix="/order", tags=["order"])
admin_router = APIRouter(prefix="/admin/orders", tags=["admin-orders"])


@router.post("/create", response_model=OrderResponse)
async def create_order_route(
    payload: CreateOrderRequest,
    current_user: UserResponse = Depends(get_current_user),
    _: None = Depends(rate_limit("order_create", max_requests=20, window_seconds=300)),
) -> OrderResponse:
    try:
        return await create_order(current_user, payload)
    except OrderServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("/my", response_model=list[OrderResponse])
async def get_my_orders(current_user: UserResponse = Depends(get_current_user)) -> list[OrderResponse]:
    return await list_my_orders(current_user.id)


@admin_router.get("", response_model=list[OrderResponse])
async def get_all_orders(_: UserResponse = Depends(get_admin_user)) -> list[OrderResponse]:
    return await list_all_orders()


@admin_router.put("/{order_id}/status", response_model=OrderResponse)
async def update_status(
    order_id: str,
    payload: UpdateOrderStatusRequest,
    _: UserResponse = Depends(get_admin_user),
) -> OrderResponse:
    try:
        return await update_order_status(order_id, payload)
    except OrderServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@admin_router.put("/{order_id}/complete", response_model=OrderResponse)
async def complete_order(
    order_id: str,
    _: UserResponse = Depends(get_admin_user),
) -> OrderResponse:
    try:
        return await mark_order_completed(order_id)
    except OrderServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
