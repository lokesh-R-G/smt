from datetime import UTC, datetime
from typing import Any

from bson import ObjectId

from app.core.database import mongo_db
from app.schemas.cart_schema import (
    CartAddRequest,
    CartItemResponse,
    CartProductSnapshot,
    CartRemoveRequest,
    CartResponse,
    CartUpdateRequest,
)


class CartServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def _carts_collection():
    return mongo_db.database["carts"]


def _products_collection():
    return mongo_db.database["products"]


async def ensure_cart_indexes() -> None:
    await _carts_collection().create_index("user_id", unique=True)


async def _get_product_snapshot(product_id: str) -> CartProductSnapshot:
    if not ObjectId.is_valid(product_id):
        raise CartServiceError(status_code=404, detail="Product not found")

    document = await _products_collection().find_one({"_id": ObjectId(product_id), "is_visible": True})
    if document is None:
        raise CartServiceError(status_code=404, detail="Product not found")

    return CartProductSnapshot(
        id=str(document["_id"]),
        name=document["name"],
        category=document["category"],
        price=document["price"],
        image=document["image"],
        description=document["description"],
        specifications=document.get("specifications", []),
        is_visible=document.get("is_visible", True),
    )


async def _get_cart_document(user_id: str) -> dict[str, Any]:
    cart = await _carts_collection().find_one({"user_id": user_id})
    if cart is None:
        now = datetime.now(UTC)
        cart = {
            "user_id": user_id,
            "items": [],
            "updated_at": now,
        }
        await _carts_collection().insert_one(cart)
    return cart


async def get_cart(user_id: str) -> CartResponse:
    cart = await _get_cart_document(user_id)
    items: list[CartItemResponse] = []
    total = 0.0

    for item in cart.get("items", []):
        try:
            product = await _get_product_snapshot(item["product_id"])
        except CartServiceError:
            continue
        quantity = int(item["quantity"])
        items.append(CartItemResponse(product=product, quantity=quantity))
        total += product.price * quantity

    return CartResponse(
        user_id=user_id,
        items=items,
        total=round(total, 2),
        updated_at=cart.get("updated_at", datetime.now(UTC)),
    )


async def add_to_cart(user_id: str, payload: CartAddRequest) -> CartResponse:
    await _get_product_snapshot(payload.product_id)
    cart = await _get_cart_document(user_id)

    items = cart.get("items", [])
    updated = False
    for item in items:
        if item["product_id"] == payload.product_id:
            item["quantity"] = int(item["quantity"]) + payload.quantity
            updated = True
            break

    if not updated:
        items.append({"product_id": payload.product_id, "quantity": payload.quantity})

    await _carts_collection().update_one(
        {"user_id": user_id},
        {"$set": {"items": items, "updated_at": datetime.now(UTC)}},
    )
    return await get_cart(user_id)


async def update_cart_item(user_id: str, payload: CartUpdateRequest) -> CartResponse:
    cart = await _get_cart_document(user_id)
    items = cart.get("items", [])

    matched = False
    for item in items:
        if item["product_id"] == payload.product_id:
            item["quantity"] = payload.quantity
            matched = True
            break

    if not matched:
        raise CartServiceError(status_code=404, detail="Cart item not found")

    await _carts_collection().update_one(
        {"user_id": user_id},
        {"$set": {"items": items, "updated_at": datetime.now(UTC)}},
    )
    return await get_cart(user_id)


async def remove_cart_item(user_id: str, payload: CartRemoveRequest) -> CartResponse:
    cart = await _get_cart_document(user_id)
    items = cart.get("items", [])

    filtered = [item for item in items if item["product_id"] != payload.product_id]
    if len(filtered) == len(items):
        raise CartServiceError(status_code=404, detail="Cart item not found")

    await _carts_collection().update_one(
        {"user_id": user_id},
        {"$set": {"items": filtered, "updated_at": datetime.now(UTC)}},
    )
    return await get_cart(user_id)


async def clear_cart(user_id: str) -> None:
    await _carts_collection().update_one(
        {"user_id": user_id},
        {"$set": {"items": [], "updated_at": datetime.now(UTC)}},
        upsert=True,
    )
