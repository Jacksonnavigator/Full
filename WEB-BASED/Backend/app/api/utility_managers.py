"""
Utility Manager Routes
CRUD operations for utility manager assignments
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import UtilityManager
from app.models.user import EntityStatusEnum
from app.security.auth import hash_password
from app.schemas.user import (
    UtilityManagerCreate,
    UtilityManagerBase,
    UtilityManagerResponse,
    UtilityManagerListResponse,
)

utility_managers_router = APIRouter(prefix="/api/utility-managers", tags=["utility-managers"])


@utility_managers_router.get("", response_model=UtilityManagerListResponse)
async def list_utility_managers(
    utility_id: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all utility managers with optional filters"""
    query = db.query(UtilityManager)
    
    if utility_id:
        query = query.filter(UtilityManager.utility_id == utility_id)
    
    total = query.count()
    managers = query.offset(skip).limit(limit).all()
    
    return UtilityManagerListResponse(
        total=total,
        items=[UtilityManagerResponse.from_orm(m) for m in managers],
    )


@utility_managers_router.get("/{manager_id}", response_model=UtilityManagerResponse)
async def get_utility_manager(
    manager_id: str,
    db: Session = Depends(get_db),
):
    """Get utility manager assignment by ID"""
    manager = db.query(UtilityManager).filter(UtilityManager.id == manager_id).first()
    
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility manager assignment not found",
        )
    
    return UtilityManagerResponse.from_orm(manager)


@utility_managers_router.post("", response_model=UtilityManagerResponse, status_code=status.HTTP_201_CREATED)
async def create_utility_manager(
    manager_data: UtilityManagerCreate,
    db: Session = Depends(get_db),
):
    """Create a new utility manager"""
    from sqlalchemy.exc import IntegrityError
    
    try:
        # Check if email already exists
        existing = db.query(UtilityManager).filter(
            UtilityManager.email == manager_data.email,
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Utility manager with this email already exists",
            )
        
        # Convert status string to enum
        status_enum = EntityStatusEnum(manager_data.status) if isinstance(manager_data.status, str) else manager_data.status
        
        new_manager = UtilityManager(
            name=manager_data.name,
            email=manager_data.email,
            password=hash_password(manager_data.password),
            phone=manager_data.phone,
            status=status_enum,
            utility_id=manager_data.utility_id,
        )
        
        db.add(new_manager)
        db.commit()
        db.refresh(new_manager)
        
        return UtilityManagerResponse.from_orm(new_manager)
    except IntegrityError as e:
        db.rollback()
        if "UNIQUE constraint failed" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This utility already has an assigned manager. Unassign the existing manager first.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database constraint violation",
        )


@utility_managers_router.put("/{manager_id}", response_model=UtilityManagerResponse)
async def update_utility_manager(
    manager_id: str,
    manager_data: UtilityManagerBase,
    db: Session = Depends(get_db),
):
    """Update utility manager details"""
    from sqlalchemy.exc import IntegrityError
    
    try:
        manager = db.query(UtilityManager).filter(UtilityManager.id == manager_id).first()
        
        if not manager:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Utility manager not found",
            )
        
        # Convert status string to enum if needed
        status_enum = EntityStatusEnum(manager_data.status) if isinstance(manager_data.status, str) else manager_data.status
        
        # Update all fields from the request data
        manager.name = manager_data.name
        manager.email = manager_data.email
        manager.phone = manager_data.phone
        manager.status = status_enum
        # Always update utility_id (can be None to unassign)
        manager.utility_id = manager_data.utility_id
        
        db.commit()
        db.refresh(manager)
        
        return UtilityManagerResponse.from_orm(manager)
    except IntegrityError as e:
        db.rollback()
        if "UNIQUE constraint failed" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This utility already has an assigned manager. Unassign the existing manager first.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database constraint violation",
        )


@utility_managers_router.delete("/{manager_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_utility_manager(
    manager_id: str,
    db: Session = Depends(get_db),
):
    """Delete utility manager assignment"""
    manager = db.query(UtilityManager).filter(UtilityManager.id == manager_id).first()
    
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility manager assignment not found",
        )
    
    db.delete(manager)
    db.commit()
