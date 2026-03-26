import pytest

from app.services import product_service


class FakeCursor:
    def __init__(self, docs):
        self.docs = docs

    def sort(self, *_args, **_kwargs):
        return self

    async def to_list(self, length):
        return self.docs[:length]


class FakeProductCollection:
    def __init__(self, docs):
        self.docs = docs

    async def create_index(self, *_args, **_kwargs):
        return None

    def find(self, query):
        result = [doc for doc in self.docs if all(doc.get(k) == v for k, v in query.items())]
        return FakeCursor(result)


@pytest.mark.asyncio
async def test_list_public_products(monkeypatch):
    fake_docs = [
        {
            "_id": "1",
            "name": "Public Product",
            "category": "Safety",
            "price": 10,
            "image": "https://example.com/a.png",
            "description": "Valid description text",
            "specifications": [],
            "is_visible": True,
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z",
        },
        {
            "_id": "2",
            "name": "Private Product",
            "category": "Safety",
            "price": 20,
            "image": "https://example.com/b.png",
            "description": "Valid description text",
            "specifications": [],
            "is_visible": False,
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z",
        },
    ]

    monkeypatch.setattr(product_service, "_products_collection", lambda: FakeProductCollection(fake_docs))

    products = await product_service.list_public_products()
    assert len(products) == 1
    assert products[0].name == "Public Product"
