from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.services.auth_service import get_user_by_id
from app.utils.jwt import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = decode_access_token(token)
    except jwt.PyJWTError as exc:
        raise credentials_exception from exc

    user_id = payload.get("user_id")
    if not isinstance(user_id, str):
        raise credentials_exception

    user = await get_user_by_id(user_id)
    if user is None:
        raise credentials_exception

    return user


async def get_admin_user(current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
