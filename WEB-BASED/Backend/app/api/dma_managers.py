"""
DMA Manager Routes
CRUD operations for DMA manager assignments
Matches the functionality of the old system's dma-managers API
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from enum import Enum

from app.database.session import get_db
from app.models import DMAManager, Utility, DMA, User, UtilityManager, Engineer
from app.security.auth import hash_password
from app.schemas.user import (
    DMAManagerCreate,
    DMAManagerUpdate,
    DMAManagerResponse,
    DMAManagerListResponse,
)

dma_managers_router = APIRouter(prefix="/api/dma-managers", tags=["dma-managers"])


def check_email_uniqueness(email: str, exclude_id: Optional[str] = None, db: Session = None) -> dict:
    """
    Check if email is unique across all user tables
    Returns dict with is_unique boolean and found_in string if not unique
    """
    # Check User table
    user_query = db.query(User).filter(User.email == email)
    if exclude_id:
        user_query = user_query.filter(User.id != exclude_id)
    if user_query.first():
        return {"is_unique": False, "found_in": "user"}
    
    # Check UtilityManager table
    utility_mgr_query = db.query(UtilityManager).filter(UtilityManager.email == email)
    if exclude_id:
        utility_mgr_query = utility_mgr_query.filter(UtilityManager.id != exclude_id)
    if utility_mgr_query.first():
        return {"is_unique": False, "found_in": "utility_manager"}
    
    # Check DMAManager table
    dma_mgr_query = db.query(DMAManager).filter(DMAManager.email == email)
    if exclude_id:
        dma_mgr_query = dma_mgr_query.filter(DMAManager.id != exclude_id)
    if dma_mgr_query.first():
        return {"is_unique": False, "found_in": "dma_manager"}
    
    # Check Engineer table
    engineer_query = db.query(Engineer).filter(Engineer.email == email)
    if exclude_id:
        engineer_query = engineer_query.filter(Engineer.id != exclude_id)
    if engineer_query.first():
        return {"is_unique": False, "found_in": "engineer"}
    
    return {"is_unique": True, "found_in": None}


def get_status_enum_value(status_str: str):
    """Convert string status to enum value"""
    from app.constants.enums import EntityStatus
    try:
        return EntityStatus(status_str)
    except ValueError:
        return EntityStatus.ACTIVE


def transform_manager(manager: DMAManager) -> dict:
    """Transform DMA manager to response format with utility_name and dma_name"""
    return {
        "id": manager.id,
        "name": manager.name,
        "email": manager.email,
        "phone": manager.phone,
        "status": manager.status.value if hasattr(manager.status, 'value') else manager.status,
        "role": "dma_manager",
        "utility_id": manager.utility_id,
        "utility_name": manager.utility.name if manager.utility else None,
        "dma_id": manager.dma_id,
        "dma_name": manager.dma.name if manager.dma else None,
        "avatar": manager.avatar,
        "created_at": manager.created_at,
        "updated_at": manager.updated_at,
    }


@dma_managers_router.get("", response_model=DMAManagerListResponse)
async def list_dma_managers(
    utility_id: str = Query(None),
    dma_id: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all DMA managers with optional filters"""
    query = db.query(DMAManager).join(Utility, isouter=True).join(DMA, isouter=True)
    
    if utility_id:
        query = query.filter(DMAManager.utility_id == utility_id)
    
    if dma_id:
        query = query.filter(DMAManager.dma_id == dma_id)
    
    total = query.count()
    managers = query.offset(skip).limit(limit).all()
    
    # Transform to include utility_name and dma_name
    transformed = [transform_manager(m) for m in managers]
    
    return DMAManagerListResponse(
        total=total,
        items=[DMAManagerResponse(**t) for t in transformed],
    )


@dma_managers_router.get("/{manager_id}", response_model=DMAManagerResponse)
async def get_dma_manager(
    manager_id: str,
    db: Session = Depends(get_db),
):
    """Get DMA manager assignment by ID"""
    manager = db.query(DMAManager).filter(DMAManager.id == manager_id).first()
    
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DMA manager not found",
        )
    
    return DMAManagerResponse(**transform_manager(manager))


@dma_managers_router.post("", response_model=DMAManagerResponse, status_code=status.HTTP_201_CREATED)
async def create_dma_manager(
    manager_data: DMAManagerCreate,
    db: Session = Depends(get_db),
):
    """Create a new DMA manager"""
    # Check email uniqueness across all user tables
    email_check = check_email_uniqueness(manager_data.email, db=db)
    if not email_check["is_unique"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This email is already in use by a {email_check['found_in']}",
        )
    
    # Verify utility exists
    utility = db.query(Utility).filter(Utility.id == manager_data.utility_id).first()
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Utility not found",
        )
    
    # If assigning to a DMA, verify DMA exists and unassign any existing manager
    if manager_data.dma_id:
        dma = db.query(DMA).filter(DMA.id == manager_data.dma_id).first()
        if not dma:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="DMA not found",
            )
        # Unassign any existing manager from this DMA
        db.query(DMAManager).filter(
            DMAManager.dma_id == manager_data.dma_id
        ).update({DMAManager.dma_id: None}, synchronize_session=False)
    
    # Convert status string to enum if needed
    status_value = get_status_enum_value(manager_data.status) if isinstance(manager_data.status, str) else manager_data.status
    
    new_manager = DMAManager(
        name=manager_data.name,
        email=manager_data.email,
        password=hash_password(manager_data.password),
        phone=manager_data.phone,
        status=status_value,
        utility_id=manager_data.utility_id,
        dma_id=manager_data.dma_id,
    )
    
    db.add(new_manager)
    db.commit()
    db.refresh(new_manager)
    
    return DMAManagerResponse(**transform_manager(new_manager))


@dma_managers_router.put("/{manager_id}", response_model=DMAManagerResponse)
async def update_dma_manager(
    manager_id: str,
    manager_data: DMAManagerUpdate,
    db: Session = Depends(get_db),
):
    """Update DMA manager details - supports partial updates"""
    manager = db.query(DMAManager).filter(DMAManager.id == manager_id).first()
    
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DMA manager not found",
        )
    
    # Get update data, excluding None values for partial updates
    update_data = manager_data.dict(exclude_unset=True)
    
    # Check email uniqueness if email is being updated
    if 'email' in update_data and update_data['email']:
        email_check = check_email_uniqueness(update_data['email'], exclude_id=manager_id, db=db)
        if not email_check["is_unique"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This email is already in use by a {email_check['found_in']}",
            )
    
    # Handle DMA assignment
    if 'dma_id' in update_data:
        new_dma_id = update_data['dma_id']
        old_dma_id = manager.dma_id
        
        # If assigning to a new DMA (different from current)
        if new_dma_id and new_dma_id != old_dma_id:
            # Verify new DMA exists
            dma = db.query(DMA).filter(DMA.id == new_dma_id).first()
            if not dma:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="DMA not found",
                )
            # Unassign other managers from this DMA
            db.query(DMAManager).filter(
                DMAManager.dma_id == new_dma_id,
                DMAManager.id != manager_id
            ).update({DMAManager.dma_id: None}, synchronize_session=False)
    
    # Handle password update
    if update_data.get('password'):
        manager.password = hash_password(update_data['password'])
    
    # Update other fields
    if 'name' in update_data and update_data['name'] is not None:
        manager.name = update_data['name']
    
    if 'email' in update_data and update_data['email'] is not None:
        manager.email = update_data['email']
    
    if 'phone' in update_data:
        manager.phone = update_data['phone']
    
    if 'status' in update_data and update_data['status'] is not None:
        manager.status = get_status_enum_value(update_data['status'])
    
    if 'utility_id' in update_data and update_data['utility_id'] is not None:
        manager.utility_id = update_data['utility_id']
    
    if 'dma_id' in update_data:
        manager.dma_id = update_data['dma_id']
    
    db.commit()
    db.refresh(manager)
    
    return DMAManagerResponse(**transform_manager(manager))


@dma_managers_router.delete("/{manager_id}", status_code=status.HTTP_200_OK)
async def delete_dma_manager(
    manager_id: str,
    db: Session = Depends(get_db),
):
    """Delete DMA manager assignment"""
    manager = db.query(DMAManager).filter(DMAManager.id == manager_id).first()
    
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DMA manager not found",
        )
    
    db.delete(manager)
    db.commit()
    
    return {"success": True, "message": "DMA manager deleted successfully"}