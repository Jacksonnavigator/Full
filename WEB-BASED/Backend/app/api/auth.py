"""
Authentication Routes
Login, logout, token refresh, and token verification endpoints
"""

from datetime import timedelta
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import User
from app.models.user import UtilityManager, DMAManager, Engineer
from app.schemas.user import UserResponse
from app.security.auth import (
    hash_password,
    verify_password,
    create_token_pair,
    verify_token,
    extract_user_from_token,
)
from pydantic import BaseModel, EmailStr, Field


# ============================================================================
# Request/Response Models for Authentication
# ============================================================================

class LoginRequest(BaseModel):
    """Login request model"""
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=255)


class LoginResponse(BaseModel):
    """Login response model"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Refresh token request model"""
    refresh_token: str


class TokenVerifyRequest(BaseModel):
    """Token verification request model"""
    token: str


class TokenVerifyResponse(BaseModel):
    """Token verification response model"""
    valid: bool
    user_id: Optional[str] = None
    email: Optional[str] = None
    message: str


class ChangePasswordRequest(BaseModel):
    """Change password request model"""
    current_password: str = Field(..., min_length=6, max_length=255)
    new_password: str = Field(..., min_length=6, max_length=255)


# ============================================================================
# Router Setup
# ============================================================================

auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ============================================================================
# Authentication Endpoints
# ============================================================================

@auth_router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Multi-table user login endpoint
    Checks User, UtilityManager, DMAManager, and Engineer tables
    
    Args:
        request: LoginRequest with email and password
        db: Database session
        
    Returns:
        LoginResponse with access token, refresh token, and user info
        
    Raises:
        HTTPException: If user not found or password is incorrect
    """
    user_data = None
    user_type = None
    user_obj = None
    
    # 1. Check User table (Admin users)
    user_obj = db.query(User).filter(User.email == request.email).first()
    if user_obj:
        if verify_password(request.password, user_obj.password):
            user_data = {
                'id': user_obj.id,
                'email': user_obj.email,
                'name': user_obj.name,
                'phone': user_obj.phone,
                'avatar': user_obj.avatar,
                'status': user_obj.status.value,  # Convert enum to string
                'created_at': user_obj.created_at,
                'updated_at': user_obj.updated_at,
                'user_type': 'user',
                'role': None,
                'utility_id': None,
                'utility_name': None,
                'dma_id': None,
                'dma_name': None,
            }
            user_type = 'user'
    
    # 2. Check UtilityManager table
    if not user_data:
        util_mgr = db.query(UtilityManager).filter(UtilityManager.email == request.email).first()
        if util_mgr:
            if verify_password(request.password, util_mgr.password):
                user_data = {
                    'id': util_mgr.id,
                    'email': util_mgr.email,
                    'name': util_mgr.name,
                    'phone': util_mgr.phone,
                    'avatar': util_mgr.avatar,
                    'status': util_mgr.status.value,  # Convert enum to string
                    'created_at': util_mgr.created_at,
                    'updated_at': util_mgr.updated_at,
                    'user_type': 'utility_manager',
                    'role': None,
                    'utility_id': util_mgr.utility_id,
                    'utility_name': None,  # Will be populated if needed
                    'dma_id': None,
                    'dma_name': None,
                }
                user_type = 'utility_manager'
    
    # 3. Check DMAManager table
    if not user_data:
        dma_mgr = db.query(DMAManager).filter(DMAManager.email == request.email).first()
        if dma_mgr:
            if verify_password(request.password, dma_mgr.password):
                user_data = {
                    'id': dma_mgr.id,
                    'email': dma_mgr.email,
                    'name': dma_mgr.name,
                    'phone': dma_mgr.phone,
                    'avatar': dma_mgr.avatar,
                    'status': dma_mgr.status.value,  # Convert enum to string
                    'created_at': dma_mgr.created_at,
                    'updated_at': dma_mgr.updated_at,
                    'user_type': 'dma_manager',
                    'role': None,
                    'utility_id': dma_mgr.utility_id,
                    'utility_name': None,  # Will be populated if needed
                    'dma_id': dma_mgr.dma_id,
                    'dma_name': None,  # Will be populated if needed
                }
                user_type = 'dma_manager'
    
    # 4. Check Engineer table
    if not user_data:
        engineer = db.query(Engineer).filter(Engineer.email == request.email).first()
        if engineer:
            if verify_password(request.password, engineer.password):
                user_data = {
                    'id': engineer.id,
                    'email': engineer.email,
                    'name': engineer.name,
                    'phone': engineer.phone,
                    'avatar': None,
                    'status': engineer.status.value,  # Convert enum to string
                    'created_at': engineer.created_at,
                    'updated_at': engineer.updated_at,
                    'user_type': 'engineer',
                    'role': engineer.role,  # "engineer" or "team_leader"
                    'utility_id': None,
                    'utility_name': None,
                    'dma_id': engineer.dma_id,
                    'dma_name': None,
                }
                user_type = 'engineer'
    
    # If no user found or password incorrect
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create token pair
    tokens = create_token_pair(user_data['id'], user_data['email'])
    
    # Create UserResponse from dict
    user_response = UserResponse(**user_data)
    
    return LoginResponse(
        access_token=tokens['access_token'],
        refresh_token=tokens['refresh_token'],
        token_type='bearer',
        user=user_response,
    )


@auth_router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    
    Args:
        request: RefreshTokenRequest with refresh token
        
    Returns:
        Dictionary with new access token
        
    Raises:
        HTTPException: If refresh token is invalid/expired
    """
    payload = verify_token(request.refresh_token)
    
    if not payload or payload.get('type') != 'refresh':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    
    user_id = payload.get('user_id')
    email = payload.get('email')
    
    # Create new access token
    new_access_token = create_token_pair(user_id, email)
    
    return {
        'access_token': new_access_token['access_token'],
        'token_type': 'bearer',
    }


@auth_router.post("/verify", response_model=TokenVerifyResponse)
async def verify_access_token(request: TokenVerifyRequest):
    """
    Verify if a token is valid
    
    Args:
        request: TokenVerifyRequest with token
        
    Returns:
        TokenVerifyResponse with validation status
    """
    payload = verify_token(request.token)
    
    if not payload:
        return TokenVerifyResponse(
            valid=False,
            message="Invalid or expired token",
        )
    
    if payload.get('type') != 'access':
        return TokenVerifyResponse(
            valid=False,
            message="Token is not an access token",
        )
    
    return TokenVerifyResponse(
        valid=True,
        user_id=payload.get('user_id'),
        email=payload.get('email'),
        message="Token is valid",
    )


@auth_router.post("/logout")
async def logout():
    """
    Logout endpoint (token invalidation should be handled on frontend)
    
    Returns:
        Success message
    """
    # Note: Token invalidation is typically handled on the frontend
    # by removing the token from localStorage.
    # For production, consider implementing a token blacklist.
    return {
        "message": "Successfully logged out",
    }


# ============================================================================
# Helper Dependency Functions
# ============================================================================

async def get_current_user(
    token: str,
    db: Session = Depends(get_db)
) -> User:
    """
    Get current user from token (dependency for protected routes)
    
    Args:
        token: JWT token from Authorization header
        db: Database session
        
    Returns:
        User object
        
    Raises:
        HTTPException: If token invalid or user not found
    """
    user_info = extract_user_from_token(token)
    
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = db.query(User).filter(User.id == user_info['user_id']).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user
