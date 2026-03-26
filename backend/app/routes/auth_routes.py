from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.auth_schema import LoginRequest, RegisterRequest, RegisterResponse, TokenResponse, UserResponse
from app.services.auth_service import AuthServiceError, login_user, register_user
from app.utils.dependencies import get_admin_user, get_current_user
from app.utils.rate_limit import rate_limit

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> RegisterResponse:
    try:
        return await register_user(payload)
    except AuthServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    _: None = Depends(rate_limit("auth_login", max_requests=10, window_seconds=60)),
) -> TokenResponse:
    try:
        return await login_user(payload)
    except AuthServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@router.get("/me", response_model=UserResponse)
async def me(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    return current_user


@router.get("/admin-check")
async def admin_check(_: UserResponse = Depends(get_admin_user)) -> dict[str, str]:
    return {"message": "Admin access granted"}
