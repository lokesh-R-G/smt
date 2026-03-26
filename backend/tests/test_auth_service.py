import pytest

from app.schemas.auth_schema import LoginRequest, RegisterRequest
from app.services import auth_service


class FakeUsersCollection:
    def __init__(self):
        self.docs = {}

    async def create_index(self, *_args, **_kwargs):
        return None

    async def find_one(self, query):
        if "email" in query:
            for doc in self.docs.values():
                if doc["email"] == query["email"]:
                    return doc
            return None
        if "_id" in query:
            return self.docs.get(str(query["_id"]))
        return None

    async def insert_one(self, doc):
        new_id = str(len(self.docs) + 1)
        saved = {**doc, "_id": new_id}
        self.docs[new_id] = saved

        class Result:
            inserted_id = new_id

        return Result()


@pytest.mark.asyncio
async def test_register_and_login(monkeypatch):
    fake_users = FakeUsersCollection()

    monkeypatch.setattr(auth_service, "_users_collection", lambda: fake_users)
    monkeypatch.setattr(auth_service, "hash_password", lambda value: f"hashed:{value}")
    monkeypatch.setattr(auth_service, "verify_password", lambda pwd, hashed: hashed == f"hashed:{pwd}")
    monkeypatch.setattr(auth_service, "create_access_token", lambda data: f"token-{data['user_id']}")

    register_payload = RegisterRequest(name="Tester", email="tester@example.com", password="Password123!")
    register_result = await auth_service.register_user(register_payload)

    assert register_result.success is True
    assert register_result.user_id == "1"

    login_payload = LoginRequest(email="tester@example.com", password="Password123!")
    login_result = await auth_service.login_user(login_payload)
    assert login_result.access_token == "token-1"
