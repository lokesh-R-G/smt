import asyncio
from datetime import UTC, datetime

from app.core.database import mongo_db
from app.utils.hash import hash_password


USERS = [
    {
        "name": "System Admin",
        "email": "admin@srimaruthitraders.com",
        "password": "Admin@123456",
        "role": "admin",
    },
    {
        "name": "Acme Procurement",
        "email": "buyer@acme-industries.com",
        "password": "Customer@123",
        "role": "customer",
    },
    {
        "name": "BuildRight Stores",
        "email": "orders@buildright.in",
        "password": "Customer@123",
        "role": "customer",
    },
]

PRODUCTS = [
    {
        "name": "Industrial Safety Helmet",
        "category": "Safety Helmets",
        "price": 649.0,
        "image": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=900&q=80",
        "description": "High-impact safety helmet designed for industrial construction and manufacturing zones.",
        "specifications": [
            {"key": "Material", "value": "ABS"},
            {"key": "Compliance", "value": "IS 2925"},
        ],
        "is_visible": True,
    },
    {
        "name": "Nitrile Safety Gloves",
        "category": "Safety Gloves",
        "price": 299.0,
        "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
        "description": "Oil-resistant nitrile gloves with strong grip and tear resistance for daily industrial handling.",
        "specifications": [
            {"key": "Material", "value": "Nitrile"},
            {"key": "Length", "value": "30 cm"},
        ],
        "is_visible": True,
    },
    {
        "name": "Reflective Safety Jacket",
        "category": "Safety Jackets",
        "price": 849.0,
        "image": "https://images.unsplash.com/photo-1542223616-740d5dff8a3b?auto=format&fit=crop&w=900&q=80",
        "description": "High-visibility reflective jacket for low-light site operations and road safety compliance.",
        "specifications": [
            {"key": "Color", "value": "Fluorescent Yellow"},
            {"key": "Reflective Tape", "value": "5 cm"},
        ],
        "is_visible": True,
    },
]


async def seed_users() -> tuple[int, int]:
    users = mongo_db.database["users"]
    inserted = 0
    skipped = 0

    for user in USERS:
        existing = await users.find_one({"email": user["email"].lower()})
        if existing:
            skipped += 1
            continue

        await users.insert_one(
            {
                "name": user["name"].strip(),
                "email": user["email"].lower(),
                "password": hash_password(user["password"]),
                "role": user["role"],
                "created_at": datetime.now(UTC),
            }
        )
        inserted += 1

    return inserted, skipped


async def seed_products() -> tuple[int, int]:
    products = mongo_db.database["products"]
    inserted = 0
    skipped = 0

    for product in PRODUCTS:
        existing = await products.find_one({"name": product["name"]})
        if existing:
            skipped += 1
            continue

        now = datetime.now(UTC)
        await products.insert_one(
            {
                **product,
                "name": product["name"].strip(),
                "category": product["category"].strip(),
                "description": product["description"].strip(),
                "created_at": now,
                "updated_at": now,
            }
        )
        inserted += 1

    return inserted, skipped


async def main() -> None:
    await mongo_db.connect()
    try:
        user_inserted, user_skipped = await seed_users()
        product_inserted, product_skipped = await seed_products()

        print("Seed complete")
        print(f"Users: inserted={user_inserted}, skipped={user_skipped}")
        print(f"Products: inserted={product_inserted}, skipped={product_skipped}")
    finally:
        await mongo_db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
