"""
User Routes
CRUD operations for users
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import User
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
    UserListResponse,
)
from app.security.auth import hash_password, extract_user_from_token


users_router = APIRouter(prefix="/api/users", tags=["users"])


# ============================================================================
# Read Operations
# ============================================================================

@users_router.get("", response_model=UserListResponse)
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    List all users with pagination
    
    Args:
        skip: Number of records to skip
        limit: Number of records to return
        db: Database session
        
    Returns:
        UserListResponse with total count and paginated items
    """
    total = db.query(User).count()
    users = db.query(User).offset(skip).limit(limit).all()
    
    return UserListResponse(
        total=total,
        items=[UserResponse.from_orm(user) for user in users],
    )


@users_router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    """
    Get current user profile from Authorization header token.
    
    Works for all user types: User (admin), UtilityManager, DMAManager, Engineer

    Requires:
    - Authorization: Bearer <token> header

    Args:
        authorization: Bearer token from Authorization header
        db: Database session

    Returns:
        UserResponse with current user info
    """
    import logging
    logger = logging.getLogger(__name__)
    
    if not authorization:
        logger.error("[/api/users/me] Authorization header missing")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
        )

    # Extract token from "Bearer <token>" format
    if authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    else:
        logger.error(f"[/api/users/me] Invalid auth header format: {authorization}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    user_info = extract_user_from_token(token)
    logger.info(f"[/api/users/me] Decoded token: {user_info}")
    
    if not user_info:
        logger.error("[/api/users/me] Invalid or expired token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    
    user_id = user_info['user_id']
    
    # Check User table (admin)
    user = db.query(User).filter(User.id == user_id).first()
    logger.info(f"[/api/users/me] User table lookup for id={user_id}: {user}")
    if user:
        logger.info(f"[/api/users/me] Returning User: {user.email}")
        return UserResponse.from_orm(user)
    
    # Check Engineer table
    from app.models.user import Engineer
    engineer = db.query(Engineer).filter(Engineer.id == user_id).first()
    logger.info(f"[/api/users/me] Engineer table lookup for id={user_id}: {engineer}")
    if engineer:
        logger.info(f"[/api/users/me] Returning Engineer: {engineer.email}")
        return UserResponse.from_orm(engineer)
    
    # Check UtilityManager table
    from app.models.user import UtilityManager
    util_mgr = db.query(UtilityManager).filter(UtilityManager.id == user_id).first()
    logger.info(f"[/api/users/me] UtilityManager table lookup for id={user_id}: {util_mgr}")
    if util_mgr:
        logger.info(f"[/api/users/me] Returning UtilityManager: {util_mgr.email}")
        return UserResponse.from_orm(util_mgr)
    
    # Check DMAManager table
    from app.models.user import DMAManager
    dma_mgr = db.query(DMAManager).filter(DMAManager.id == user_id).first()
    logger.info(f"[/api/users/me] DMAManager table lookup for id={user_id}: {dma_mgr}")
    if dma_mgr:
        logger.info(f"[/api/users/me] Returning DMAManager: {dma_mgr.email}")
        return UserResponse.from_orm(dma_mgr)
    
    logger.error(f"[/api/users/me] User not found in any table for id={user_id}")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found",
    )


@users_router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: Session = Depends(get_db),
):
    """
    Get user by ID
    
    Args:
        user_id: User ID
        db: Database session
        
    Returns:
        UserResponse
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return UserResponse.from_orm(user)


# ============================================================================
# Create Operations
# ============================================================================

@users_router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new user
    
    Args:
        user_data: UserCreate schema
        db: Database session
        
    Returns:
        UserResponse with created user
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        phone=user_data.phone,
        avatar=user_data.avatar,
        status=user_data.status,
        password=hash_password(user_data.password),
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse.from_orm(new_user)


# ============================================================================
# Update Operations
# ============================================================================

@users_router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
):
    """
    Update user details
    
    Args:
        user_id: User ID
        user_data: UserUpdate schema
        db: Database session
        
    Returns:
        UserResponse with updated user
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Update only provided fields
    update_data = user_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return UserResponse.from_orm(user)


@users_router.patch("/{user_id}", response_model=UserResponse)
async def patch_user(
    user_id: str,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
):
    """
    Partially update user (same as PUT in this case)
    
    Args:
        user_id: User ID
        user_data: UserUpdate schema
        db: Database session
        
    Returns:
        UserResponse with updated user
    """
    return await update_user(user_id, user_data, db)


# ============================================================================
# Delete Operations
# ============================================================================

@users_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
):
    """
    Delete user by ID
    
    Args:
        user_id: User ID
        db: Database session
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    db.delete(user)
    db.commit()
