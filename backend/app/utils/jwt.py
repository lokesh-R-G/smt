from datetime import UTC, datetime, timedelta
from typing import Any

import jwt

from app.core.config import get_settings


def create_access_token(data: dict[str, Any]) -> str:
    settings = get_settings()
    expire_at = datetime.now(UTC) + timedelta(minutes=settings.jwt_access_token_expire_minutes)

    payload = {**data, "exp": expire_at, "type": "access"}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
