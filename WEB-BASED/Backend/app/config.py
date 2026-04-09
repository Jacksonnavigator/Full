"""
Global Backend Configuration
Centralized environment and application settings
"""

import os
from typing import Any, List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )
    
    # ===== Application Settings =====
    app_name: str = "HydraNet Backend"
    app_version: str = "1.0.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = environment == "development"

    # ===== Database Settings =====
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://user:password@localhost:5432/hydranet"
    )

    # ===== Security Settings =====
    secret_key: str = os.getenv(
        "SECRET_KEY",
        "your-secret-key-change-in-production-12345"
    )
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    # ===== Frontend Configuration =====
    # IMPORTANT: This is used for CORS and rendering frontend URLs
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    cors_origins_raw: str = Field(default="", alias="CORS_ORIGINS")
    cors_origin_regex: str = os.getenv(
        "CORS_ORIGIN_REGEX",
        r"^https:\/\/.*\.onrender\.com$|^http:\/\/localhost:3000$|^http:\/\/127\.0\.0\.1:3000$"
    )
    
    # ===== CORS Settings =====
    default_cors_origins: List[str] = [
        "http://localhost:3000",      # Development frontend
        "http://127.0.0.1:3000",      # Alternative localhost
        "http://192.168.1.2:8081",    # Expo development server
        "http://10.0.2.2:8081",       # Android emulator
        "exp://192.168.1.2:8081",     # Expo Go app
        "exp://10.0.2.2:8081",        # Expo Go on Android emulator
    ]
    cors_credentials: bool = True
    cors_allow_methods: List[str] = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    cors_allow_headers: List[str] = ["*"]

    # ===== Invitation & Email Settings =====
    invite_token_expiry_hours: int = int(os.getenv("INVITE_TOKEN_EXPIRY_HOURS", "72"))
    password_reset_token_expiry_hours: int = int(os.getenv("PASSWORD_RESET_TOKEN_EXPIRY_HOURS", "2"))
    resend_api_key: str = os.getenv("RESEND_API_KEY", "")
    resend_from_email: str = os.getenv("RESEND_FROM_EMAIL", "")
    resend_from_name: str = os.getenv("RESEND_FROM_NAME", "HydraNet")
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_username: str = os.getenv("SMTP_USERNAME", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from_email: str = os.getenv("SMTP_FROM_EMAIL", "")
    smtp_from_name: str = os.getenv("SMTP_FROM_NAME", "HydraNet")
    smtp_use_tls: bool = os.getenv("SMTP_USE_TLS", "true").strip().lower() in {"1", "true", "yes", "on"}

    # ===== Password Hashing =====
    password_hash_algorithm: str = "bcrypt"
    password_bcrypt_rounds: int = 12

    # ===== API Settings =====
    api_prefix: str = "/api"
    
    # ===== Server Settings =====
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug_value(cls, value: Any) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"1", "true", "yes", "on", "debug", "development"}:
                return True
            if normalized in {"0", "false", "no", "off", "release", "production"}:
                return False
        return bool(value)

    def get_cors_origins(self) -> List[str]:
        """
        Get all CORS origins including frontend_url
        Ensures frontend is always allowed
        """
        configured_origins = [
            origin.strip()
            for origin in self.cors_origins_raw.split(",")
            if origin.strip()
        ]

        origins = list(self.default_cors_origins)
        for origin in configured_origins:
            if origin not in origins:
                origins.append(origin)

        if self.frontend_url and self.frontend_url not in origins:
            origins.insert(0, self.frontend_url)

        deduped_origins: List[str] = []
        for origin in origins:
            if origin and origin not in deduped_origins:
                deduped_origins.append(origin)

        return deduped_origins


# Create global settings instance
settings = Settings()
