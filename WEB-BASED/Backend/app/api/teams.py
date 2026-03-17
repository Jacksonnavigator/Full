"""
Team Routes
CRUD operations for teams
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models import Team, Engineer, Branch, DMA, Report
from app.models.user import EntityStatusEnum
from app.schemas.user import (
    TeamCreate,
    TeamUpdate,
    TeamResponse,
)
from typing import List, Optional
from pydantic import BaseModel, Field

teams_router = APIRouter(prefix="/api/teams", tags=["teams"])


class TeamListResponse(BaseModel):
    """Team list response with pagination"""
    total: int
    items: List[TeamResponse]


class TeamWithDetails(TeamResponse):
    """Team response with additional details"""
    branch_name: Optional[str] = None
    dma_name: Optional[str] = None
    utility_id: Optional[str] = None
    utility_name: Optional[str] = None
    leader_name: Optional[str] = None
    leader_email: Optional[str] = None
    leader_phone: Optional[str] = None
    member_count: int = 0
    active_reports: int = 0
    engineer_ids: List[str] = []


class TeamListWithDetailsResponse(BaseModel):
    """Team list response with details and pagination"""
    total: int
    items: List[TeamWithDetails]


@teams_router.get("", response_model=TeamListWithDetailsResponse)
async def list_teams(
    branch_id: str = Query(None),
    dma_id: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all teams with optional branch and DMA filters, including related details"""
    query = db.query(Team)
    
    if branch_id:
        query = query.filter(Team.branch_id == branch_id)
    
    if dma_id:
        query = query.filter(Team.dma_id == dma_id)
    
    total = query.count()
    teams = query.offset(skip).limit(limit).all()
    
    # Build response with details
    items = []
    for team in teams:
        # Get branch name
        branch = db.query(Branch).filter(Branch.id == team.branch_id).first()
        branch_name = branch.name if branch else None
        
        # Get DMA name
        dma = db.query(DMA).filter(DMA.id == team.dma_id).first()
        dma_name = dma.name if dma else None
        
        # Get utility info from DMA
        utility_id = None
        utility_name = None
        if dma:
            utility_id = dma.utility_id
            from app.models import Utility
            utility = db.query(Utility).filter(Utility.id == dma.utility_id).first()
            utility_name = utility.name if utility else None
        
        # Get leader info
        leader_name = None
        leader_email = None
        leader_phone = None
        if team.leader_id:
            leader = db.query(Engineer).filter(Engineer.id == team.leader_id).first()
            if leader:
                leader_name = leader.name
                leader_email = leader.email
                leader_phone = leader.phone
        
        # Count team members (engineers assigned to this team)
        member_count = db.query(Engineer).filter(Engineer.team_id == team.id).count()
        
        # Count active reports assigned to this team
        active_reports = db.query(Report).filter(
            Report.team_id == team.id,
            Report.status.in_(["new", "assigned", "in_progress", "pending_approval"])
        ).count()
        
        items.append(TeamWithDetails(
            id=team.id,
            name=team.name,
            description=team.description,
            branch_id=team.branch_id,
            dma_id=team.dma_id,
            leader_id=team.leader_id,
            status=team.status,
            created_at=team.created_at,
            updated_at=team.updated_at,
            branch_name=branch_name,
            dma_name=dma_name,
            utility_id=utility_id,
            utility_name=utility_name,
            leader_name=leader_name,
            leader_email=leader_email,
            leader_phone=leader_phone,
            member_count=member_count,
            active_reports=active_reports,
            engineer_ids=[e.id for e in db.query(Engineer).filter(Engineer.team_id == team.id).all()],
        ))
    
    return TeamListWithDetailsResponse(total=total, items=items)


@teams_router.get("/{team_id}", response_model=TeamWithDetails)
async def get_team(
    team_id: str,
    db: Session = Depends(get_db),
):
    """Get team by ID with full details"""
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Get branch name
    branch = db.query(Branch).filter(Branch.id == team.branch_id).first()
    branch_name = branch.name if branch else None
    
    # Get DMA name
    dma = db.query(DMA).filter(DMA.id == team.dma_id).first()
    dma_name = dma.name if dma else None
    
    # Get leader name
    leader_name = None
    if team.leader_id:
        leader = db.query(Engineer).filter(Engineer.id == team.leader_id).first()
        leader_name = leader.name if leader else None
    
    # Count team members
    member_count = db.query(Engineer).filter(Engineer.team_id == team.id).count()
    
    # Count active reports
    active_reports = db.query(Report).filter(
        Report.team_id == team.id,
        Report.status.in_(["new", "assigned", "in_progress", "pending_approval"])
    ).count()
    
    return TeamWithDetails(
        id=team.id,
        name=team.name,
        description=team.description,
        branch_id=team.branch_id,
        dma_id=team.dma_id,
        leader_id=team.leader_id,
        status=team.status,
        created_at=team.created_at,
        updated_at=team.updated_at,
        branch_name=branch_name,
        dma_name=dma_name,
        leader_name=leader_name,
        member_count=member_count,
        active_reports=active_reports,
    )


@teams_router.post("", response_model=TeamWithDetails, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreate,
    db: Session = Depends(get_db),
):
    """Create a new team"""
    # Get DMA from branch if not provided
    dma_id = team_data.dma_id
    if not dma_id and team_data.branch_id:
        branch = db.query(Branch).filter(Branch.id == team_data.branch_id).first()
        if branch:
            dma_id = branch.dma_id
    
    if not dma_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not determine DMA for team. Please provide dma_id or a valid branch_id.",
        )
    
    new_team = Team(
        branch_id=team_data.branch_id,
        dma_id=dma_id,
        name=team_data.name,
        description=team_data.description,
        status=team_data.status,
    )
    
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    
    # Return with details
    branch = db.query(Branch).filter(Branch.id == new_team.branch_id).first()
    dma = db.query(DMA).filter(DMA.id == new_team.dma_id).first()
    
    return TeamWithDetails(
        id=new_team.id,
        name=new_team.name,
        description=new_team.description,
        branch_id=new_team.branch_id,
        dma_id=new_team.dma_id,
        leader_id=new_team.leader_id,
        status=new_team.status,
        created_at=new_team.created_at,
        updated_at=new_team.updated_at,
        branch_name=branch.name if branch else None,
        dma_name=dma.name if dma else None,
        leader_name=None,
        member_count=0,
        active_reports=0,
    )


@teams_router.put("/{team_id}", response_model=TeamWithDetails)
async def update_team(
    team_id: str,
    team_data: TeamUpdate,
    db: Session = Depends(get_db),
):
    """Update team details"""
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    update_data = team_data.dict(exclude_unset=True)
    
    # If branch_id is being updated, also update dma_id from the new branch
    if 'branch_id' in update_data and update_data['branch_id']:
        new_branch = db.query(Branch).filter(Branch.id == update_data['branch_id']).first()
        if new_branch:
            update_data['dma_id'] = new_branch.dma_id
    
    for field, value in update_data.items():
        setattr(team, field, value)
    
    db.commit()
    db.refresh(team)
    
    # Get branch name
    branch = db.query(Branch).filter(Branch.id == team.branch_id).first()
    branch_name = branch.name if branch else None
    
    # Get DMA name
    dma = db.query(DMA).filter(DMA.id == team.dma_id).first()
    dma_name = dma.name if dma else None
    
    # Get leader name
    leader_name = None
    if team.leader_id:
        leader = db.query(Engineer).filter(Engineer.id == team.leader_id).first()
        leader_name = leader.name if leader else None
    
    # Count team members
    member_count = db.query(Engineer).filter(Engineer.team_id == team.id).count()
    
    # Count active reports
    active_reports = db.query(Report).filter(
        Report.team_id == team.id,
        Report.status.in_(["new", "assigned", "in_progress", "pending_approval"])
    ).count()
    
    return TeamWithDetails(
        id=team.id,
        name=team.name,
        description=team.description,
        branch_id=team.branch_id,
        dma_id=team.dma_id,
        leader_id=team.leader_id,
        status=team.status,
        created_at=team.created_at,
        updated_at=team.updated_at,
        branch_name=branch_name,
        dma_name=dma_name,
        leader_name=leader_name,
        member_count=member_count,
        active_reports=active_reports,
    )


@teams_router.patch("/{team_id}", response_model=TeamWithDetails)
async def patch_team(
    team_id: str,
    team_data: TeamUpdate,
    db: Session = Depends(get_db),
):
    """Partially update team"""
    return await update_team(team_id, team_data, db)


# ============================================================================
# Team Members Management Endpoints
# ============================================================================



@teams_router.get("/{team_id}/members")
async def get_team_members(
    team_id: str,
    db: Session = Depends(get_db),
):
    """Get team with members and eligible engineers"""
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Get branch info
    branch = db.query(Branch).filter(Branch.id == team.branch_id).first()
    
    # Get DMA info
    dma = db.query(DMA).filter(DMA.id == team.dma_id).first()
    
    # Get team leader
    leader = None
    if team.leader_id:
        leader_engineer = db.query(Engineer).filter(Engineer.id == team.leader_id).first()
        if leader_engineer:
            leader = {
                "id": leader_engineer.id,
                "name": leader_engineer.name,
                "email": leader_engineer.email,
                "phone": leader_engineer.phone,
                "role": leader_engineer.role,
                "status": leader_engineer.status.value if hasattr(leader_engineer.status, 'value') else leader_engineer.status,
            }
    
    # Get team members (engineers)
    engineers = db.query(Engineer).filter(Engineer.team_id == team_id).order_by(Engineer.name).all()
    members = [
        {
            "id": e.id,
            "name": e.name,
            "email": e.email,
            "phone": e.phone,
            "role": e.role,
            "status": e.status.value if hasattr(e.status, 'value') else e.status,
            "team_id": e.team_id,
        }
        for e in engineers
    ]
    
    # Get eligible engineers (same branch and DMA, active, not in any team or already in this team)
    eligible_engineers_query = db.query(Engineer).filter(
        Engineer.branch_id == team.branch_id,
        Engineer.status == EntityStatusEnum.ACTIVE,
        or_(
            Engineer.team_id == None,
            Engineer.team_id == team_id
        )
    ).order_by(Engineer.name)
    
    eligible_engineers = [
        {
            "id": e.id,
            "name": e.name,
            "email": e.email,
            "phone": e.phone,
            "role": e.role,
            "status": e.status.value if hasattr(e.status, 'value') else e.status,
            "team_id": e.team_id,
            "branch_id": e.branch_id,
            "dma_id": e.dma_id,
        }
        for e in eligible_engineers_query.all()
    ]
    
    # Return plain dict with camelCase keys for frontend
    return {
        "team": {
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "branch_id": team.branch_id,
            "branch_name": branch.name if branch else None,
            "dma_id": team.dma_id,
            "dma_name": dma.name if dma else None,
            "utility_id": branch.utility_id if branch else None,
            "leader_id": team.leader_id,
            "leader": leader,
            "status": team.status.value if hasattr(team.status, 'value') else team.status,
            "engineers": members,
            "created_at": team.created_at,
            "updated_at": team.updated_at,
        },
        "eligibleEngineers": eligible_engineers,
        "currentMemberIds": [e.id for e in engineers],
    }


class AddMembersRequest(BaseModel):
    """Request for adding members to team"""
    engineer_ids: List[str] = Field(alias="engineerIds")
    
    class Config:
        populate_by_name = True


@teams_router.post("/{team_id}/members", response_model=TeamWithDetails)
async def add_team_members(
    team_id: str,
    data: AddMembersRequest,
    db: Session = Depends(get_db),
):
    """Add engineers to team"""
    if not data.engineer_ids or len(data.engineer_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer IDs are required",
        )
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Verify all engineers exist and are eligible
    engineers = db.query(Engineer).filter(Engineer.id.in_(data.engineer_ids)).all()
    
    if len(engineers) != len(data.engineer_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="One or more engineers not found",
        )
    
    # Check eligibility: same branch, DMA, and either no team or this team
    ineligible = []
    for e in engineers:
        if e.branch_id != team.branch_id or e.dma_id != team.dma_id or (e.team_id is not None and e.team_id != team_id):
            ineligible.append(e.name)
    
    if ineligible:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Engineers must have the same branch and DMA as the team, and not be in another team. Ineligible: {', '.join(ineligible)}",
        )
    
    # Add engineers to team
    for engineer_id in data.engineer_ids:
        db.query(Engineer).filter(Engineer.id == engineer_id).update({"team_id": team_id})
    
    db.commit()
    
    # Return updated team with details
    return await _get_team_with_details(team_id, db)


@teams_router.delete("/{team_id}/members", response_model=TeamWithDetails)
async def remove_team_members(
    team_id: str,
    engineerIds: str = Query(..., alias="engineerIds", description="Comma-separated engineer IDs"),
    db: Session = Depends(get_db),
):
    """Remove engineers from team"""
    ids = engineerIds.split(",") if engineerIds else []
    
    if not ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer IDs are required",
        )
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Remove members and handle leader unassignment
    for eng_id in ids:
        # If this engineer is the team leader, remove leader assignment
        if team.leader_id == eng_id:
            team.leader_id = None
            # Update engineer role back to engineer
            db.query(Engineer).filter(Engineer.id == eng_id).update({
                "team_id": None,
                "role": "engineer",
            })
        else:
            # Just remove from team
            db.query(Engineer).filter(Engineer.id == eng_id).update({"team_id": None})
    
    db.commit()
    
    return await _get_team_with_details(team_id, db)


# ============================================================================
# Team Leader Management Endpoints
# ============================================================================

class TeamLeaderResponse(BaseModel):
    """Response for team leader info"""
    leader: Optional[dict] = None
    eligible_leaders: List[dict]
    team: dict


@teams_router.get("/{team_id}/leader")
async def get_team_leader(
    team_id: str,
    db: Session = Depends(get_db),
):
    """Get team leader info and eligible leaders"""
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Get branch info
    branch = db.query(Branch).filter(Branch.id == team.branch_id).first()
    
    # Get current leader
    leader = None
    if team.leader_id:
        leader_engineer = db.query(Engineer).filter(Engineer.id == team.leader_id).first()
        if leader_engineer:
            leader = {
                "id": leader_engineer.id,
                "name": leader_engineer.name,
                "email": leader_engineer.email,
                "phone": leader_engineer.phone,
                "role": leader_engineer.role,
                "status": leader_engineer.status.value if hasattr(leader_engineer.status, 'value') else leader_engineer.status,
            }
    
    # Get eligible leaders (same branch, same DMA, active, not in any team or already in this team)
    eligible_query = db.query(Engineer).filter(
        Engineer.branch_id == team.branch_id,
        Engineer.dma_id == team.dma_id,
        Engineer.status == EntityStatusEnum.ACTIVE,
        or_(
            Engineer.team_id == None,
            Engineer.team_id == team_id
        )
    ).order_by(Engineer.name)
    
    eligible_leaders = [
        {
            "id": e.id,
            "name": e.name,
            "email": e.email,
            "phone": e.phone,
            "role": e.role,
            "status": e.status.value if hasattr(e.status, 'value') else e.status,
            "team_id": e.team_id,
            "branch_id": e.branch_id,
            "dma_id": e.dma_id,
        }
        for e in eligible_query.all()
    ]
    
    # Return plain dict with camelCase keys for frontend
    return {
        "leader": leader,
        "eligibleLeaders": eligible_leaders,
        "team": {
            "id": team.id,
            "name": team.name,
            "branch_id": team.branch_id,
            "branch_name": branch.name if branch else None,
            "dma_id": team.dma_id,
        },
    }


class AssignLeaderRequest(BaseModel):
    """Request for assigning team leader"""
    engineer_id: str = Field(alias="engineerId")
    
    class Config:
        populate_by_name = True


@teams_router.put("/{team_id}/leader", response_model=TeamWithDetails)
async def assign_team_leader(
    team_id: str,
    data: AssignLeaderRequest,
    db: Session = Depends(get_db),
):
    """Assign team leader"""
    if not data.engineer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer ID is required",
        )
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Check if engineer exists and is eligible
    engineer = db.query(Engineer).filter(Engineer.id == data.engineer_id).first()
    if not engineer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Engineer not found",
        )
    
    # Validate eligibility
    if engineer.branch_id != team.branch_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer must be from the same branch as the team",
        )
    
    if engineer.dma_id != team.dma_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer must be from the same DMA as the team",
        )
    
    if engineer.status != EntityStatusEnum.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer must be active",
        )
    
    # If engineer is in another team, they can't be leader of this team
    if engineer.team_id and engineer.team_id != team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer is already a member of another team",
        )
    
    # If there's an existing leader, demote them to engineer
    if team.leader_id and team.leader_id != data.engineer_id:
        db.query(Engineer).filter(Engineer.id == team.leader_id).update({"role": "engineer"})
    
    # Add engineer to team if not already a member
    if not engineer.team_id:
        db.query(Engineer).filter(Engineer.id == data.engineer_id).update({
            "team_id": team_id,
            "role": "team_leader",
        })
    else:
        # Just update the role if already in team
        db.query(Engineer).filter(Engineer.id == data.engineer_id).update({"role": "team_leader"})
    
    # Update team's leader reference
    team.leader_id = data.engineer_id
    db.commit()
    
    return await _get_team_with_details(team_id, db)


@teams_router.delete("/{team_id}/leader", response_model=TeamWithDetails)
async def remove_team_leader(
    team_id: str,
    db: Session = Depends(get_db),
):
    """Remove team leader"""
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    if not team.leader_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No team leader assigned",
        )
    
    # Update the leader's role back to engineer (keep them in team)
    db.query(Engineer).filter(Engineer.id == team.leader_id).update({"role": "engineer"})
    
    # Remove leader reference from team
    team.leader_id = None
    db.commit()
    
    return await _get_team_with_details(team_id, db)


# ============================================================================
# Helper Functions
# ============================================================================

async def _get_team_with_details(team_id: str, db: Session) -> TeamWithDetails:
    """Helper to get team with full details"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Get branch name
    branch = db.query(Branch).filter(Branch.id == team.branch_id).first()
    branch_name = branch.name if branch else None
    
    # Get DMA name
    dma = db.query(DMA).filter(DMA.id == team.dma_id).first()
    dma_name = dma.name if dma else None
    
    # Get leader details
    leader_name = None
    leader_email = None
    leader_phone = None
    if team.leader_id:
        leader = db.query(Engineer).filter(Engineer.id == team.leader_id).first()
        if leader:
            leader_name = leader.name
            leader_email = leader.email
            leader_phone = leader.phone
    
    # Count team members
    member_count = db.query(Engineer).filter(Engineer.team_id == team.id).count()
    
    # Count active reports
    active_reports = db.query(Report).filter(
        Report.team_id == team.id,
        Report.status.in_(["new", "assigned", "in_progress", "pending_approval"])
    ).count()
    
    return TeamWithDetails(
        id=team.id,
        name=team.name,
        description=team.description,
        branch_id=team.branch_id,
        dma_id=team.dma_id,
        leader_id=team.leader_id,
        status=team.status,
        created_at=team.created_at,
        updated_at=team.updated_at,
        branch_name=branch_name,
        dma_name=dma_name,
        leader_name=leader_name,
        leader_email=leader_email,
        leader_phone=leader_phone,
        member_count=member_count,
        active_reports=active_reports,
    )


@teams_router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(
    team_id: str,
    db: Session = Depends(get_db),
):
    """Delete team by ID"""
    team = db.query(Team).filter(Team.id == team_id).first()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    # Unassign all engineers from this team
    db.query(Engineer).filter(Engineer.team_id == team_id).update({"team_id": None})
    
    db.delete(team)
    db.commit()
