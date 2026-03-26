from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.product_schema import ProductSpecification


class CartAddRequest(BaseModel):
    product_id: str = Field(min_length=1)
    quantity: int = Field(default=1, ge=1, le=1000)


class CartUpdateRequest(BaseModel):
    product_id: str = Field(min_length=1)
    quantity: int = Field(ge=1, le=1000)


class CartRemoveRequest(BaseModel):
    product_id: str = Field(min_length=1)


class CartProductSnapshot(BaseModel):
    id: str
    name: str
    category: str
    price: float
    image: str
    description: str
    specifications: list[ProductSpecification]
    is_visible: bool


class CartItemResponse(BaseModel):
    product: CartProductSnapshot
    quantity: int


class CartResponse(BaseModel):
    user_id: str
    items: list[CartItemResponse]
    total: float
    updated_at: datetime
