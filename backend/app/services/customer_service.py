from app.core.database import mongo_db
from app.schemas.customer_schema import AdminCustomerResponse


async def list_admin_customers() -> list[AdminCustomerResponse]:
    users = await mongo_db.database["users"].find({}).to_list(length=5000)
    orders = await mongo_db.database["orders"].find({}).to_list(length=10000)

    order_by_user: dict[str, list[dict]] = {}
    for order in orders:
        order_by_user.setdefault(order["user_id"], []).append(order)

    response: list[AdminCustomerResponse] = []
    for user in users:
        user_orders = order_by_user.get(str(user["_id"]), [])
        total_spent = sum(float(order.get("total", 0)) for order in user_orders)
        response.append(
            AdminCustomerResponse(
                id=str(user["_id"]),
                name=user["name"],
                email=user["email"],
                company="N/A",
                total_orders=len(user_orders),
                total_spent=round(total_spent, 2),
            )
        )

    return response
