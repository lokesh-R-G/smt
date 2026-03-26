from datetime import UTC, datetime
from typing import Any

from bson import ObjectId

from app.core.database import mongo_db
from app.schemas.product_schema import ProductCreateRequest, ProductResponse, ProductUpdateRequest


class ProductServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def _products_collection():
    return mongo_db.database["products"]


def _serialize_product(document: dict[str, Any]) -> ProductResponse:
    return ProductResponse(
        id=str(document["_id"]),
        name=document["name"],
        category=document["category"],
        price=document["price"],
        image=document["image"],
        description=document["description"],
        specifications=document.get("specifications", []),
        is_visible=document.get("is_visible", True),
        created_at=document["created_at"],
        updated_at=document["updated_at"],
    )


async def ensure_product_indexes() -> None:
    products = _products_collection()
    await products.create_index("category")
    await products.create_index("is_visible")


async def list_public_products(category: str | None = None) -> list[ProductResponse]:
    query: dict[str, Any] = {"is_visible": True}
    if category:
        query["category"] = category

    cursor = _products_collection().find(query).sort("created_at", -1)
    documents = await cursor.to_list(length=500)
    return [_serialize_product(doc) for doc in documents]


async def list_all_products() -> list[ProductResponse]:
    cursor = _products_collection().find({}).sort("created_at", -1)
    documents = await cursor.to_list(length=1000)
    return [_serialize_product(doc) for doc in documents]


async def get_product_by_id(product_id: str, public_only: bool = True) -> ProductResponse:
    if not ObjectId.is_valid(product_id):
        raise ProductServiceError(status_code=404, detail="Product not found")

    query: dict[str, Any] = {"_id": ObjectId(product_id)}
    if public_only:
        query["is_visible"] = True

    document = await _products_collection().find_one(query)
    if document is None:
        raise ProductServiceError(status_code=404, detail="Product not found")
    return _serialize_product(document)


async def create_product(payload: ProductCreateRequest) -> ProductResponse:
    now = datetime.now(UTC)
    document = {
        "name": payload.name.strip(),
        "category": payload.category.strip(),
        "price": payload.price,
        "image": payload.image.strip(),
        "description": payload.description.strip(),
        "specifications": [spec.model_dump() for spec in payload.specifications],
        "is_visible": payload.is_visible,
        "created_at": now,
        "updated_at": now,
    }

    result = await _products_collection().insert_one(document)
    saved = await _products_collection().find_one({"_id": result.inserted_id})
    if saved is None:
        raise ProductServiceError(status_code=500, detail="Failed to create product")
    return _serialize_product(saved)


async def update_product(product_id: str, payload: ProductUpdateRequest) -> ProductResponse:
    if not ObjectId.is_valid(product_id):
        raise ProductServiceError(status_code=404, detail="Product not found")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise ProductServiceError(status_code=400, detail="No fields provided for update")

    if "name" in update_data and update_data["name"] is not None:
        update_data["name"] = update_data["name"].strip()
    if "category" in update_data and update_data["category"] is not None:
        update_data["category"] = update_data["category"].strip()
    if "image" in update_data and update_data["image"] is not None:
        update_data["image"] = update_data["image"].strip()
    if "description" in update_data and update_data["description"] is not None:
        update_data["description"] = update_data["description"].strip()

    update_data["updated_at"] = datetime.now(UTC)

    result = await _products_collection().update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise ProductServiceError(status_code=404, detail="Product not found")

    updated = await _products_collection().find_one({"_id": ObjectId(product_id)})
    if updated is None:
        raise ProductServiceError(status_code=404, detail="Product not found")
    return _serialize_product(updated)


async def delete_product(product_id: str) -> None:
    if not ObjectId.is_valid(product_id):
        raise ProductServiceError(status_code=404, detail="Product not found")

    result = await _products_collection().delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise ProductServiceError(status_code=404, detail="Product not found")
