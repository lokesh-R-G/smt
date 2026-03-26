from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "SMT Backend API"
    app_env: str = "development"
    app_debug: bool = True
    api_v1_prefix: str = "/api/v1"

    mongodb_uri: str
    mongodb_db_name: str = "smt_db"

    jwt_secret_key: str = Field(validation_alias=AliasChoices("JWT_SECRET", "JWT_SECRET_KEY"))
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    smtp_host: str = "localhost"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from_email: str = "noreply@smt.local"
    smtp_use_tls: bool = True
    admin_notification_email: str = "admin@smt.local"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("mongodb_uri")
    @classmethod
    def validate_mongodb_uri(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("MONGODB_URI is required and cannot be empty")
        return value.strip()

    @field_validator("jwt_secret_key")
    @classmethod
    def validate_jwt_secret_key(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("JWT_SECRET is required and cannot be empty")
        if len(cleaned) < 32:
            raise ValueError("JWT_SECRET must be at least 32 characters")
        if "change-this" in cleaned.lower() or "your-secret" in cleaned.lower():
            raise ValueError("JWT_SECRET must not use placeholder values")
        return cleaned


@lru_cache
def get_settings() -> Settings:
    return Settings()
