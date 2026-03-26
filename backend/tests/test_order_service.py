from datetime import UTC, datetime

import pytest

from app.schemas.auth_schema import UserResponse
from app.schemas.cart_schema import CartItemResponse, CartProductSnapshot, CartResponse
from app.schemas.order_schema import CreateOrderRequest
from app.services import order_service


class FakeOrdersCollection:
    def __init__(self):
        self.docs = {}

    async def create_index(self, *_args, **_kwargs):
        return None

    async def insert_one(self, doc):
        new_id = str(len(self.docs) + 1)
        self.docs[new_id] = {**doc, "_id": new_id}

        class Result:
            inserted_id = new_id

        return Result()

    async def find_one(self, query):
        return self.docs.get(str(query.get("_id")))


@pytest.mark.asyncio
async def test_create_order(monkeypatch):
    fake_orders = FakeOrdersCollection()

    async def fake_get_cart(_user_id):
        return CartResponse(
            user_id="u1",
            items=[
                CartItemResponse(
                    product=CartProductSnapshot(
                        id="p1",
                        name="Helmet",
                        category="Safety",
                        price=100,
                        image="https://example.com/p1.png",
                        description="Industrial safety helmet",
                        specifications=[],
                        is_visible=True,
                    ),
                    quantity=2,
                )
            ],
            total=200,
            updated_at=datetime.now(UTC),
        )

    async def fake_clear_cart(_user_id):
        return None

    async def fake_send_notifications(_order):
        return None

    monkeypatch.setattr(order_service, "_orders_collection", lambda: fake_orders)
    monkeypatch.setattr(order_service, "get_cart", fake_get_cart)
    monkeypatch.setattr(order_service, "clear_cart", fake_clear_cart)
    monkeypatch.setattr(order_service, "send_order_created_notifications", fake_send_notifications)

    user = UserResponse(
        id="u1",
        name="Tester",
        email="tester@example.com",
        role="customer",
        created_at=datetime.now(UTC),
    )
    payload = CreateOrderRequest(company_name="ACME", shipping_address="123 Industrial Road, Bengaluru")

    order = await order_service.create_order(user, payload)

    assert order.order_id.startswith("ORD-")
    assert order.total == 200
    assert order.customer_email == "tester@example.com"
