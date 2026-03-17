"""
Engineer Routes
CRUD operations for engineers
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Engineer, Branch, DMA, Team, Report
from app.schemas.user import (
    EngineerCreate,
    EngineerUpdate,
    EngineerResponse,
    EngineerListResponse,
)

engineers_router = APIRouter(prefix="/api/engineers", tags=["engineers"])


def build_engineer_response(engineer: Engineer) -> dict:
    """Build engineer response with related data"""
    branch = engineer.branch
    dma = engineer.dma
    team = engineer.team if engineer.team_id else None
    
    # Count assigned reports
    assigned_reports = len(engineer.reports) if engineer.reports else 0
    
    return {
        "id": engineer.id,
        "name": engineer.name,
        "email": engineer.email,
        "phone": engineer.phone,
        "branch_id": engineer.branch_id,
        "branch_name": branch.name if branch else None,
        "dma_id": engineer.dma_id,
        "dma_name": dma.name if dma else None,
        "team_id": engineer.team_id,
        "team_name": team.name if team else None,
        "status": engineer.status.value if engineer.status else "active",
        "role": engineer.role,
        "assigned_reports": assigned_reports,
        "created_at": engineer.created_at,
        "updated_at": engineer.updated_at,
    }


@engineers_router.get("")
async def list_engineers(
    team_id: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List all engineers with optional team filter"""
    query = db.query(Engineer)
    
    if team_id:
        query = query.filter(Engineer.team_id == team_id)
    
    total = query.count()
    engineers = query.offset(skip).limit(limit).all()
    
    return {
        "total": total,
        "items": [build_engineer_response(e) for e in engineers],
    }


@engineers_router.get("/{engineer_id}")
async def get_engineer(
    engineer_id: str,
    db: Session = Depends(get_db),
):
    """Get engineer by ID"""
    engineer = db.query(Engineer).filter(Engineer.id == engineer_id).first()
    
    if not engineer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Engineer not found",
        )
    
    return build_engineer_response(engineer)


@engineers_router.post("", status_code=status.HTTP_201_CREATED)
async def create_engineer(
    engineer_data: EngineerCreate,
    db: Session = Depends(get_db),
):
    """Create a new engineer"""
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Check if email already exists
    existing = db.query(Engineer).filter(Engineer.email == engineer_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # Verify branch exists and belongs to the DMA
    branch = db.query(Branch).filter(Branch.id == engineer_data.branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Branch not found",
        )
    
    if branch.dma_id != engineer_data.dma_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Branch does not belong to the specified DMA",
        )
    
    new_engineer = Engineer(
        name=engineer_data.name,
        email=engineer_data.email,
        password=pwd_context.hash(engineer_data.password),
        phone=engineer_data.phone,
        branch_id=engineer_data.branch_id,
        dma_id=engineer_data.dma_id,
        team_id=engineer_data.team_id,
        role=engineer_data.role or "engineer",
        status=engineer_data.status,
    )
    
    db.add(new_engineer)
    db.commit()
    db.refresh(new_engineer)
    
    return build_engineer_response(new_engineer)


@engineers_router.put("")
async def update_engineer(
    engineer_data: EngineerUpdate,
    db: Session = Depends(get_db),
):
    """Update engineer details"""
    # Get engineer ID from request body
    engineer_id = getattr(engineer_data, 'id', None)
    if not engineer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer ID is required",
        )
    
    engineer = db.query(Engineer).filter(Engineer.id == engineer_id).first()
    
    if not engineer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Engineer not found",
        )
    
    # Update fields
    if engineer_data.name is not None:
        engineer.name = engineer_data.name
    if engineer_data.email is not None:
        # Check if new email already exists
        existing = db.query(Engineer).filter(
            Engineer.email == engineer_data.email,
            Engineer.id != engineer_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        engineer.email = engineer_data.email
    if engineer_data.phone is not None:
        engineer.phone = engineer_data.phone
    if engineer_data.branch_id is not None:
        # When branch changes, also update dma_id from the new branch
        new_branch = db.query(Branch).filter(Branch.id == engineer_data.branch_id).first()
        if new_branch:
            engineer.branch_id = engineer_data.branch_id
            engineer.dma_id = new_branch.dma_id  # Update DMA from branch
    if engineer_data.team_id is not None:
        engineer.team_id = engineer_data.team_id
    if engineer_data.role is not None:
        engineer.role = engineer_data.role
    if engineer_data.status is not None:
        engineer.status = engineer_data.status
    
    # Handle password update if provided
    if hasattr(engineer_data, 'password') and engineer_data.password:
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        engineer.password = pwd_context.hash(engineer_data.password)
    
    db.commit()
    db.refresh(engineer)
    
    return build_engineer_response(engineer)


@engineers_router.delete("")
async def delete_engineer(
    id: str = Query(..., description="Engineer ID to delete"),
    db: Session = Depends(get_db),
):
    """Delete engineer by ID"""
    engineer = db.query(Engineer).filter(Engineer.id == id).first()
    
    if not engineer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Engineer not found",
        )
    
    db.delete(engineer)
    db.commit()
    
    return {"message": "Engineer deleted successfully"}
