"""
User Routes
CRUD operations for users
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
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


@users_router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    token: str,
    db: Session = Depends(get_db),
):
    """
    Get current user profile from token
    
    Args:
        token: JWT token
        db: Database session
        
    Returns:
        UserResponse with current user info
    """
    user_info = extract_user_from_token(token)
    
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    
    user = db.query(User).filter(User.id == user_info['user_id']).first()
    
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
