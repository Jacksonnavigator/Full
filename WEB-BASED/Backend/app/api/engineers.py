"""
Engineer Routes
CRUD operations for engineers in the simplified DMA -> Team -> Engineer flow.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import Engineer, Team
from app.schemas.user import EngineerCreate, EngineerUpdate

engineers_router = APIRouter(prefix="/api/engineers", tags=["engineers"])


def build_engineer_response(engineer: Engineer) -> dict:
    """Build engineer response with live hierarchy details."""
    dma = engineer.dma
    team = engineer.team if engineer.team_id else None

    return {
        "id": engineer.id,
        "name": engineer.name,
        "email": engineer.email,
        "phone": engineer.phone,
        "dma_id": engineer.dma_id,
        "dma_name": dma.name if dma else None,
        "team_id": engineer.team_id,
        "team_name": team.name if team else None,
        "status": engineer.status.value if hasattr(engineer.status, "value") else engineer.status,
        "role": engineer.role,
        "assigned_reports": len(engineer.reports) if engineer.reports else 0,
        "created_at": engineer.created_at,
        "updated_at": engineer.updated_at,
    }


def _get_team_or_400(team_id: str, db: Session) -> Team:
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team not found",
        )
    return team


@engineers_router.get("")
async def list_engineers(
    team_id: str = Query(None),
    dma_id: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List engineers with optional team and DMA filters."""
    query = db.query(Engineer)

    if team_id:
        query = query.filter(Engineer.team_id == team_id)

    if dma_id:
        query = query.filter(Engineer.dma_id == dma_id)

    total = query.count()
    engineers = query.offset(skip).limit(limit).all()

    return {
        "total": total,
        "items": [build_engineer_response(engineer) for engineer in engineers],
    }


@engineers_router.get("/{engineer_id}")
async def get_engineer(
    engineer_id: str,
    db: Session = Depends(get_db),
):
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
    """Create a new engineer directly under a team."""
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    existing = db.query(Engineer).filter(Engineer.email == engineer_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    team = _get_team_or_400(engineer_data.team_id, db)

    new_engineer = Engineer(
        name=engineer_data.name,
        email=engineer_data.email,
        password=pwd_context.hash(engineer_data.password),
        phone=engineer_data.phone,
        dma_id=team.dma_id,
        team_id=team.id,
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
    """Update engineer details."""
    engineer_id = getattr(engineer_data, "id", None)
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

    if engineer_data.name is not None:
        engineer.name = engineer_data.name

    if engineer_data.email is not None:
        existing = db.query(Engineer).filter(
            Engineer.email == engineer_data.email,
            Engineer.id != engineer_id,
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        engineer.email = engineer_data.email

    if engineer_data.phone is not None:
        engineer.phone = engineer_data.phone

    if engineer_data.team_id is not None:
        if engineer_data.team_id == "":
            engineer.team_id = None
        else:
            team = _get_team_or_400(engineer_data.team_id, db)
            engineer.team_id = team.id
            engineer.dma_id = team.dma_id

    if engineer_data.role is not None:
        engineer.role = engineer_data.role

    if engineer_data.status is not None:
        engineer.status = engineer_data.status

    if hasattr(engineer_data, "password") and engineer_data.password:
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
    engineer = db.query(Engineer).filter(Engineer.id == id).first()
    if not engineer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Engineer not found",
        )

    db.delete(engineer)
    db.commit()

    return {"message": "Engineer deleted successfully"}
