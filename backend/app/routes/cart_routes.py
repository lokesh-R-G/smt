from fastapi import APIRouter, Depends, HTTPException

from app.schemas.auth_schema import UserResponse
from app.schemas.cart_schema import CartAddRequest, CartRemoveRequest, CartResponse, CartUpdateRequest
from app.services.cart_service import CartServiceError, add_to_cart, get_cart, remove_cart_item, update_cart_item
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
async def fetch_cart(current_user: UserResponse = Depends(get_current_user)) -> CartResponse:
    return await get_cart(current_user.id)


@router.post("/add", response_model=CartResponse)
async def add_item(
    payload: CartAddRequest,
    current_user: UserResponse = Depends(get_current_user),
) -> CartResponse:
    try:
        return await add_to_cart(current_user.id, payload)
    except CartServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.put("/update", response_model=CartResponse)
async def update_item(
    payload: CartUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
) -> CartResponse:
    try:
        return await update_cart_item(current_user.id, payload)
    except CartServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.delete("/remove", response_model=CartResponse)
async def remove_item(
    payload: CartRemoveRequest,
    current_user: UserResponse = Depends(get_current_user),
) -> CartResponse:
    try:
        return await remove_cart_item(current_user.id, payload)
    except CartServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
