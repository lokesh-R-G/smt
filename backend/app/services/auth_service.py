from datetime import UTC, datetime
import logging
from typing import Any

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.core.database import mongo_db
from app.schemas.auth_schema import LoginRequest, RegisterRequest, RegisterResponse, TokenResponse, UserResponse
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_access_token


logger = logging.getLogger("smt.backend.auth")


class AuthServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def _users_collection():
    return mongo_db.database["users"]


def _serialize_user(document: dict[str, Any]) -> UserResponse:
    return UserResponse(
        id=str(document["_id"]),
        name=document["name"],
        email=document["email"],
        role=document["role"],
        created_at=document["created_at"],
    )


async def ensure_user_indexes() -> None:
    await _users_collection().create_index("email", unique=True)


async def register_user(payload: RegisterRequest) -> RegisterResponse:
    users = _users_collection()
    normalized_email = payload.email.lower()

    existing = await users.find_one({"email": normalized_email})
    if existing is not None:
        logger.info("auth_register_conflict email=%s", normalized_email)
        raise AuthServiceError(status_code=409, detail="Email is already registered")

    user_document = {
        "name": payload.name.strip(),
        "email": normalized_email,
        "password": hash_password(payload.password),
        "role": "customer",
        "created_at": datetime.now(UTC),
    }

    try:
        insert_result = await users.insert_one(user_document)
    except DuplicateKeyError as exc:
        logger.info("auth_register_duplicate email=%s", normalized_email)
        raise AuthServiceError(status_code=409, detail="Email is already registered") from exc

    logger.info("auth_register_success email=%s user_id=%s", normalized_email, insert_result.inserted_id)

    return RegisterResponse(
        success=True,
        message="User registered successfully",
        user_id=str(insert_result.inserted_id),
    )


async def login_user(payload: LoginRequest) -> TokenResponse:
    users = _users_collection()
    normalized_email = payload.email.lower()

    user = await users.find_one({"email": normalized_email})
    if user is None or not verify_password(payload.password, user["password"]):
        logger.info("auth_login_failed email=%s", normalized_email)
        raise AuthServiceError(status_code=401, detail="Invalid email or password")

    logger.info("auth_login_success email=%s user_id=%s role=%s", normalized_email, user["_id"], user["role"])

    access_token = create_access_token(
        {
            "user_id": str(user["_id"]),
            "role": user["role"],
        }
    )
    return TokenResponse(access_token=access_token)


async def get_user_by_id(user_id: str) -> UserResponse | None:
    if not ObjectId.is_valid(user_id):
        return None

    user = await _users_collection().find_one({"_id": ObjectId(user_id)})
    if user is None:
        return None
    return _serialize_user(user)
