from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.schemas.auth_schema import UserResponse
from app.schemas.product_schema import ProductCreateRequest, ProductResponse, ProductUpdateRequest
from app.services.product_service import (
    ProductServiceError,
    create_product,
    delete_product,
    get_product_by_id,
    list_all_products,
    list_public_products,
    update_product,
)
from app.utils.dependencies import get_admin_user

router = APIRouter(tags=["products"])


@router.get("/products/public", response_model=list[ProductResponse])
async def get_public_products(category: str | None = Query(default=None)) -> list[ProductResponse]:
    return await list_public_products(category=category)


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_public_product_by_id(product_id: str) -> ProductResponse:
    try:
        return await get_product_by_id(product_id=product_id, public_only=True)
    except ProductServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("/admin/products", response_model=list[ProductResponse])
async def get_admin_products(_: UserResponse = Depends(get_admin_user)) -> list[ProductResponse]:
    return await list_all_products()


@router.post("/admin/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_admin_product(
    payload: ProductCreateRequest,
    _: UserResponse = Depends(get_admin_user),
) -> ProductResponse:
    try:
        return await create_product(payload)
    except ProductServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.put("/admin/products/{product_id}", response_model=ProductResponse)
async def update_admin_product(
    product_id: str,
    payload: ProductUpdateRequest,
    _: UserResponse = Depends(get_admin_user),
) -> ProductResponse:
    try:
        return await update_product(product_id, payload)
    except ProductServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.delete("/admin/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin_product(
    product_id: str,
    _: UserResponse = Depends(get_admin_user),
) -> None:
    try:
        await delete_product(product_id)
    except ProductServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
