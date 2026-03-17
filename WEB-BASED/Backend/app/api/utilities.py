"""
Utility Routes
CRUD operations for utilities
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Utility
from app.schemas.user import (
    UtilityCreate,
    UtilityUpdate,
    UtilityResponse,
    UtilityListResponse,
)
from app.security.dependencies import get_current_user, require_admin, CurrentUser

utilities_router = APIRouter(prefix="/api/utilities", tags=["utilities"])


@utilities_router.get("", response_model=UtilityListResponse)
async def list_utilities(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all utilities with pagination
    Requires authentication
    """
    total = db.query(Utility).count()
    utilities = db.query(Utility).offset(skip).limit(limit).all()
    
    return UtilityListResponse(
        total=total,
        items=[UtilityResponse.from_orm(u) for u in utilities],
    )


@utilities_router.get("/{utility_id}", response_model=UtilityResponse)
async def get_utility(
    utility_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get utility by ID
    Requires authentication
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )
    
    return UtilityResponse.from_orm(utility)


@utilities_router.post("", response_model=UtilityResponse, status_code=status.HTTP_201_CREATED)
async def create_utility(
    utility_data: UtilityCreate,
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Create a new utility
    Requires admin role
    """
    new_utility = Utility(
        name=utility_data.name,
        description=utility_data.description,
        status=utility_data.status,
    )
    
    db.add(new_utility)
    db.commit()
    db.refresh(new_utility)
    
    return UtilityResponse.from_orm(new_utility)


@utilities_router.put("/{utility_id}", response_model=UtilityResponse)
async def update_utility(
    utility_id: str,
    utility_data: UtilityUpdate,
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Update utility details
    Requires admin role
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )
    
    update_data = utility_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(utility, field, value)
    
    db.commit()
    db.refresh(utility)
    
    return UtilityResponse.from_orm(utility)


@utilities_router.patch("/{utility_id}", response_model=UtilityResponse)
async def patch_utility(
    utility_id: str,
    utility_data: UtilityUpdate,
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Partially update utility
    Requires admin role
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )
    
    update_data = utility_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(utility, field, value)
    
    db.commit()
    db.refresh(utility)
    
    return UtilityResponse.from_orm(utility)


@utilities_router.delete("/{utility_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_utility(
    utility_id: str,
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Delete utility by ID
    Requires admin role
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )
    
    db.delete(utility)
    db.commit()
