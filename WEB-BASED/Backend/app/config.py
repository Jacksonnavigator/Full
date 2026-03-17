"""
Global Backend Configuration
Centralized environment and application settings
"""

import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
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
    
    # ===== CORS Settings =====
    cors_origins: List[str] = [
        "http://localhost:3000",      # Development frontend
        "http://127.0.0.1:3000",      # Alternative localhost
        # Add production URLs here when deployed
    ]
    cors_credentials: bool = True
    cors_allow_methods: List[str] = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    cors_allow_headers: List[str] = ["*"]

    # ===== Password Hashing =====
    password_hash_algorithm: str = "bcrypt"
    password_bcrypt_rounds: int = 12

    # ===== API Settings =====
    api_prefix: str = "/api"
    
    # ===== Server Settings =====
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))

    class Config:
        """Pydantic config"""
        env_file = ".env"
        case_sensitive = False

    def get_cors_origins(self) -> List[str]:
        """
        Get all CORS origins including frontend_url
        Ensures frontend is always allowed
        """
        origins = list(self.cors_origins)
        
        # Add frontend URL if not already present
        if self.frontend_url not in origins:
            origins.insert(0, self.frontend_url)
        
        return origins


# Create global settings instance
settings = Settings()
