from datetime import UTC, datetime
import logging
from typing import Any
from uuid import uuid4

from bson import ObjectId

from app.core.database import mongo_db
from app.schemas.auth_schema import UserResponse
from app.schemas.order_schema import CreateOrderRequest, OrderResponse, OrderProductSnapshot, UpdateOrderStatusRequest
from app.services.cart_service import clear_cart, get_cart
from app.services.notification_service import send_order_created_notifications


logger = logging.getLogger("smt.backend.order")


class OrderServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def _orders_collection():
    return mongo_db.database["orders"]


async def ensure_order_indexes() -> None:
    orders = _orders_collection()
    await orders.create_index("order_id", unique=True)
    await orders.create_index("user_id")
    await orders.create_index("status")
    await orders.create_index("is_completed")


def _generate_order_id() -> str:
    return f"ORD-{datetime.now(UTC).strftime('%Y%m%d')}-{uuid4().hex[:6].upper()}"


def _serialize_order(document: dict[str, Any]) -> OrderResponse:
    return OrderResponse(
        id=str(document["_id"]),
        order_id=document["order_id"],
        user_id=document["user_id"],
        customer_name=document["customer_name"],
        customer_email=document["customer_email"],
        company_name=document["company_name"],
        shipping_address=document["shipping_address"],
        products=document.get("products", []),
        total=document["total"],
        status=document["status"],
        is_completed=document.get("is_completed", False),
        created_at=document["created_at"],
        updated_at=document["updated_at"],
    )


async def create_order(current_user: UserResponse, payload: CreateOrderRequest) -> OrderResponse:
    cart = await get_cart(current_user.id)
    if not cart.items:
        raise OrderServiceError(status_code=400, detail="Cart is empty")

    now = datetime.now(UTC)
    product_snapshots: list[OrderProductSnapshot] = [
        OrderProductSnapshot(
            product_id=item.product.id,
            name=item.product.name,
            category=item.product.category,
            price=item.product.price,
            image=item.product.image,
            quantity=item.quantity,
        )
        for item in cart.items
    ]

    order_document = {
        "order_id": _generate_order_id(),
        "user_id": current_user.id,
        "customer_name": current_user.name,
        "customer_email": current_user.email,
        "company_name": payload.company_name.strip(),
        "shipping_address": payload.shipping_address.strip(),
        "products": [item.model_dump() for item in product_snapshots],
        "total": cart.total,
        "status": "Processing",
        "is_completed": False,
        "created_at": now,
        "updated_at": now,
    }

    result = await _orders_collection().insert_one(order_document)
    await clear_cart(current_user.id)

    logger.info(
        "order_created order_id=%s user_id=%s total=%s item_count=%s",
        order_document["order_id"],
        current_user.id,
        cart.total,
        len(product_snapshots),
    )

    saved = await _orders_collection().find_one({"_id": result.inserted_id})
    if saved is None:
        raise OrderServiceError(status_code=500, detail="Failed to create order")

    order = _serialize_order(saved)
    try:
        await send_order_created_notifications(order)
    except Exception:
        pass
    return order


async def list_my_orders(user_id: str) -> list[OrderResponse]:
    cursor = _orders_collection().find({"user_id": user_id}).sort("created_at", -1)
    documents = await cursor.to_list(length=1000)
    return [_serialize_order(doc) for doc in documents]


async def list_all_orders() -> list[OrderResponse]:
    cursor = _orders_collection().find({}).sort("created_at", -1)
    documents = await cursor.to_list(length=2000)
    return [_serialize_order(doc) for doc in documents]


async def update_order_status(order_id: str, payload: UpdateOrderStatusRequest) -> OrderResponse:
    if not ObjectId.is_valid(order_id):
        raise OrderServiceError(status_code=404, detail="Order not found")

    existing = await _orders_collection().find_one({"_id": ObjectId(order_id)})
    if existing is None:
        raise OrderServiceError(status_code=404, detail="Order not found")
    if existing.get("is_completed", False):
        raise OrderServiceError(status_code=400, detail="Completed orders cannot be modified")

    result = await _orders_collection().update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": payload.status, "updated_at": datetime.now(UTC)}},
    )

    if result.matched_count == 0:
        raise OrderServiceError(status_code=404, detail="Order not found")

    updated = await _orders_collection().find_one({"_id": ObjectId(order_id)})
    if updated is None:
        raise OrderServiceError(status_code=404, detail="Order not found")

    logger.info("order_status_updated order_id=%s status=%s", updated["order_id"], payload.status)
    return _serialize_order(updated)


async def mark_order_completed(order_id: str) -> OrderResponse:
    if not ObjectId.is_valid(order_id):
        raise OrderServiceError(status_code=404, detail="Order not found")

    existing = await _orders_collection().find_one({"_id": ObjectId(order_id)})
    if existing is None:
        raise OrderServiceError(status_code=404, detail="Order not found")
    if existing.get("is_completed", False):
        raise OrderServiceError(status_code=400, detail="Order is already completed")

    await _orders_collection().update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"is_completed": True, "status": "Delivered", "updated_at": datetime.now(UTC)}},
    )

    updated = await _orders_collection().find_one({"_id": ObjectId(order_id)})
    if updated is None:
        raise OrderServiceError(status_code=404, detail="Order not found")

    logger.info("order_completed order_id=%s", updated["order_id"])
    return _serialize_order(updated)
