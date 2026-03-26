from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


OrderStatus = Literal["Processing", "Packing", "Shipped", "Delivered"]


class OrderProductSnapshot(BaseModel):
    product_id: str
    name: str
    category: str
    price: float
    image: str
    quantity: int = Field(ge=1)


class CreateOrderRequest(BaseModel):
    company_name: str = Field(min_length=2, max_length=200)
    shipping_address: str = Field(min_length=10, max_length=800)


class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus


class OrderResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    customer_name: str
    customer_email: str
    company_name: str
    shipping_address: str
    products: list[OrderProductSnapshot]
    total: float
    status: OrderStatus
    is_completed: bool
    created_at: datetime
    updated_at: datetime
