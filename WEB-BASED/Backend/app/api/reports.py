"""
Report Routes
CRUD operations for reports
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models import Report, Team, Engineer, Branch, DMA, Utility
from app.models.user import EntityStatusEnum
from app.models.business import ReportStatusEnum, ReportPriorityEnum
from app.schemas.business import (
    ReportCreate,
    ReportUpdate,
    ReportStatusUpdateRequest,
    AnonymousReportCreate,
)
from app.schemas.user import (
    ReportResponse,
    ReportListResponse,
    ReportWithDetailsResponse,
)
from app.constants.enums import ReportStatus, ReportPriority
from app.security.dependencies import get_current_user, CurrentUser
from typing import Optional, List, Tuple
from pydantic import BaseModel, Field
from datetime import datetime
import math

# ============================================================
# Geospatial Helper Functions
# ============================================================

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees).
    Returns distance in kilometers.
    """
    # Convert decimal degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    km = 6371 * c
    return km


def find_nearest_branch(
    latitude: float, 
    longitude: float, 
    db: Session
) -> Tuple[Optional[Branch], float]:
    """
    Find the nearest branch to the given coordinates.
    
    Returns:
        Tuple of (Branch object, distance in km) or (None, inf) if no branches exist
    """
    branches = db.query(Branch).filter(
        Branch.status == EntityStatusEnum.ACTIVE
    ).all()
    
    if not branches:
        return None, float('inf')
    
    # For now, since we don't have branch center coordinates stored,
    # we'll assign to the first/default branch.
    # In the future, when geoBoundary data is added, this can be improved
    # to use proper geospatial queries.
    
    # TODO: Once branches have center_latitude, center_longitude or geoBoundary,
    # implement the following logic:
    # min_distance = float('inf')
    # nearest_branch = None
    # for branch in branches:
    #     if branch.center_latitude and branch.center_longitude:
    #         distance = haversine_distance(
    #             latitude, longitude,
    #             branch.center_latitude, branch.center_longitude
    #         )
    #         if distance < min_distance:
    #             min_distance = distance
    #             nearest_branch = branch
    # return nearest_branch or branches[0], min_distance if nearest_branch else 0
    
    # For now, return the first active branch
    return branches[0], 0.0


reports_router = APIRouter(prefix="/api/reports", tags=["reports"])


class ReportWithDetails(BaseModel):
    """Report response with additional details"""
    id: str
    tracking_id: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    photos: List[str] = []
    priority: str
    status: str
    utility_id: str
    utility_name: Optional[str] = None
    dma_id: Optional[str] = None
    dma_name: Optional[str] = None
    branch_id: Optional[str] = None
    branch_name: Optional[str] = None
    team_id: Optional[str] = None
    team_name: Optional[str] = None
    assigned_engineer_id: Optional[str] = None
    assigned_engineer_name: Optional[str] = None
    reporter_name: str
    reporter_phone: str
    notes: Optional[str] = None
    sla_deadline: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class AssignReportRequest(BaseModel):
    """Request for assigning report to team and engineer"""
    team_id: str = Field(..., description="Team ID to assign")
    engineer_id: str = Field(..., description="Engineer ID to assign")


@reports_router.get("", response_model=ReportListResponse)
async def list_reports(
    branch_id: str = Query(None),
    dma_id: str = Query(None),
    utility_id: str = Query(None),
    status_filter: str = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all reports with optional filters (requires authentication)"""
    query = db.query(Report)
    
    # Role-based filtering
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        # Utility managers see reports from their utility only
        query = query.filter(Report.utility_id == current_user.utility_id)
    elif current_user.user_type == "dma_manager" and current_user.dma_id:
        # DMA managers see reports from their DMA only
        query = query.filter(Report.dma_id == current_user.dma_id)
    # Admins see all reports
    
    # Apply additional filters
    if branch_id:
        query = query.filter(Report.branch_id == branch_id)
    
    if dma_id:
        query = query.filter(Report.dma_id == dma_id)
        
    if utility_id:
        query = query.filter(Report.utility_id == utility_id)
    
    if status_filter:
        query = query.filter(Report.status == status_filter)
    
    total = query.count()
    reports = query.offset(skip).limit(limit).all()
    
    # Build response with details
    items = []
    for report in reports:
        items.append(_build_report_with_details(report, db))
    
    return ReportListResponse(total=total, items=items)


@reports_router.get("/{report_id}", response_model=ReportWithDetails)
async def get_report(
    report_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get report by ID (requires authentication)"""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        if report.utility_id != current_user.utility_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.user_type == "dma_manager" and current_user.dma_id:
        if report.dma_id != current_user.dma_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return _build_report_with_details(report, db)


@reports_router.get("/tracking/{tracking_id}", response_model=ReportWithDetails)
async def get_report_by_tracking_id(
    tracking_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get report by tracking ID (requires authentication)"""
    report = db.query(Report).filter(Report.tracking_id == tracking_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        if report.utility_id != current_user.utility_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.user_type == "dma_manager" and current_user.dma_id:
        if report.dma_id != current_user.dma_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return _build_report_with_details(report, db)


@reports_router.post("", response_model=ReportWithDetails, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_data: ReportCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new report (requires authentication)"""
    # Verify tracking_id is unique
    existing = db.query(Report).filter(Report.tracking_id == report_data.tracking_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report with this tracking ID already exists",
        )
    
    # Get branch info to determine DMA and utility
    branch = db.query(Branch).filter(Branch.id == report_data.branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Branch not found",
        )
    
    new_report = Report(
        tracking_id=report_data.tracking_id,
        branch_id=report_data.branch_id,
        dma_id=branch.dma_id,
        utility_id=branch.utility_id,
        description=report_data.description,
        priority=report_data.priority,
        photos=report_data.photos or [],
        assigned_engineer_id=report_data.assigned_engineer_id,
        status=ReportStatusEnum.NEW,
        reporter_name="System",
        reporter_phone="N/A",
        latitude=0.0,
        longitude=0.0,
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return _build_report_with_details(new_report, db)


@reports_router.post("/anonymous", response_model=ReportWithDetails, status_code=status.HTTP_201_CREATED)
async def create_anonymous_report(
    report_data: AnonymousReportCreate,
    db: Session = Depends(get_db),
):
    """Create a new anonymous report from mobile app (no authentication required)"""
    import uuid
    import random
    import string
    
    # Generate unique tracking ID
    tracking_id = f"ANON-{uuid.uuid4().hex[:8].upper()}"
    
    # Use geospatial lookup to find the appropriate branch
    # This assigns the report to the utility/DMA/branch based on coordinates
    branch, distance = find_nearest_branch(report_data.latitude, report_data.longitude, db)
    
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No branches configured in system",
        )
    
    # Map priority string to enum
    priority_map = {
        "Low": ReportPriorityEnum.LOW,
        "Medium": ReportPriorityEnum.MEDIUM,
        "High": ReportPriorityEnum.HIGH,
        "Critical": ReportPriorityEnum.CRITICAL,
        "urgent": ReportPriorityEnum.HIGH,  # Handle mobile app format
        "moderate": ReportPriorityEnum.MEDIUM,
        "low": ReportPriorityEnum.LOW,
    }
    priority = priority_map.get(report_data.priority.lower(), ReportPriorityEnum.MEDIUM)
    
    from datetime import timedelta

    new_report = Report(
        tracking_id=tracking_id,
        branch_id=branch.id,
        dma_id=branch.dma_id,
        utility_id=branch.utility_id,
        description=report_data.description,
        priority=priority,
        photos=report_data.images or [],
        status=ReportStatusEnum.NEW,
        reporter_name=report_data.reported_by or "Anonymous",
        reporter_phone="N/A",
        latitude=report_data.latitude,
        longitude=report_data.longitude,
        sla_deadline=datetime.utcnow() + timedelta(days=7),
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return _build_report_with_details(new_report, db)


@reports_router.put("/{report_id}", response_model=ReportWithDetails)
async def update_report(
    report_id: str,
    report_data: ReportUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update report details (requires authentication)"""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        if report.utility_id != current_user.utility_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.user_type == "dma_manager" and current_user.dma_id:
        if report.dma_id != current_user.dma_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    update_data = report_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(report, field, value)
    
    db.commit()
    db.refresh(report)
    
    return _build_report_with_details(report, db)


@reports_router.patch("/{report_id}", response_model=ReportWithDetails)
async def patch_report(
    report_id: str,
    report_data: ReportUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Partially update report (requires authentication)"""
    return await update_report(report_id, report_data, current_user, db)


@reports_router.post("/{report_id}/status", response_model=ReportWithDetails)
async def update_report_status(
    report_id: str,
    status_update: ReportStatusUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update report status (requires authentication)"""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        if report.utility_id != current_user.utility_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.user_type == "dma_manager" and current_user.dma_id:
        if report.dma_id != current_user.dma_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    report.status = status_update.status
    if status_update.notes:
        report.notes = status_update.notes
    
    if status_update.status == ReportStatusEnum.APPROVED:
        report.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return _build_report_with_details(report, db)


@reports_router.put("/{report_id}/assign", response_model=ReportWithDetails)
async def assign_report(
    report_id: str,
    assign_data: AssignReportRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Assign report to team and engineer (DMA Manager only)"""
    if current_user.user_type != "dma_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only DMA Managers can assign reports",
        )
    
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.dma_id and report.dma_id != current_user.dma_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    # Verify team exists and belongs to same DMA
    team = db.query(Team).filter(Team.id == assign_data.team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found",
        )
    
    if team.dma_id != report.dma_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team must be from the same DMA as the report",
        )
    
    # Verify engineer exists and belongs to the team
    engineer = db.query(Engineer).filter(Engineer.id == assign_data.engineer_id).first()
    if not engineer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Engineer not found",
        )
    
    if engineer.team_id != assign_data.team_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Engineer must be a member of the selected team",
        )
    
    # Assign report
    report.team_id = assign_data.team_id
    report.assigned_engineer_id = assign_data.engineer_id
    report.status = ReportStatusEnum.ASSIGNED
    
    db.commit()
    db.refresh(report)
    
    return _build_report_with_details(report, db)


@reports_router.post("/{report_id}/approve", response_model=ReportWithDetails)
async def approve_report(
    report_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Approve a completed report (DMA Manager only)"""
    if current_user.user_type != "dma_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only DMA Managers can approve reports",
        )
    
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.dma_id and report.dma_id != current_user.dma_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    if report.status != ReportStatusEnum.PENDING_APPROVAL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report must be in 'pending_approval' status to approve",
        )
    
    report.status = ReportStatusEnum.APPROVED
    report.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(report)
    
    return _build_report_with_details(report, db)


@reports_router.post("/{report_id}/reject", response_model=ReportWithDetails)
async def reject_report(
    report_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Reject a completed report (DMA Manager only)"""
    if current_user.user_type != "dma_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only DMA Managers can reject reports",
        )
    
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.dma_id and report.dma_id != current_user.dma_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    if report.status != ReportStatusEnum.PENDING_APPROVAL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report must be in 'pending_approval' status to reject",
        )
    
    report.status = ReportStatusEnum.REJECTED
    
    db.commit()
    db.refresh(report)
    
    return _build_report_with_details(report, db)


@reports_router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete report by ID (requires authentication)"""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    
    # Check access
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        if report.utility_id != current_user.utility_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    elif current_user.user_type == "dma_manager" and current_user.dma_id:
        if report.dma_id != current_user.dma_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    db.delete(report)
    db.commit()


def _build_report_with_details(report: Report, db: Session) -> ReportWithDetails:
    """Helper to build report response with all related details"""
    # Get branch name
    branch_name = None
    if report.branch_id:
        branch = db.query(Branch).filter(Branch.id == report.branch_id).first()
        branch_name = branch.name if branch else None
    
    # Get DMA name
    dma_name = None
    if report.dma_id:
        dma = db.query(DMA).filter(DMA.id == report.dma_id).first()
        dma_name = dma.name if dma else None
    
    # Get utility name
    utility_name = None
    if report.utility_id:
        utility = db.query(Utility).filter(Utility.id == report.utility_id).first()
        utility_name = utility.name if utility else None
    
    # Get team name
    team_name = None
    if report.team_id:
        team = db.query(Team).filter(Team.id == report.team_id).first()
        team_name = team.name if team else None
    
    # Get assigned engineer name
    assigned_engineer_name = None
    if report.assigned_engineer_id:
        engineer = db.query(Engineer).filter(Engineer.id == report.assigned_engineer_id).first()
        assigned_engineer_name = engineer.name if engineer else None
    
    return ReportWithDetails(
        id=report.id,
        tracking_id=report.tracking_id,
        description=report.description,
        latitude=report.latitude,
        longitude=report.longitude,
        address=report.address,
        photos=report.photos or [],
        priority=report.priority.value if hasattr(report.priority, 'value') else report.priority,
        status=report.status.value if hasattr(report.status, 'value') else report.status,
        utility_id=report.utility_id,
        utility_name=utility_name,
        dma_id=report.dma_id,
        dma_name=dma_name,
        branch_id=report.branch_id,
        branch_name=branch_name,
        team_id=report.team_id,
        team_name=team_name,
        assigned_engineer_id=report.assigned_engineer_id,
        assigned_engineer_name=assigned_engineer_name,
        reporter_name=report.reporter_name,
        reporter_phone=report.reporter_phone,
        notes=report.notes,
        sla_deadline=report.sla_deadline,
        resolved_at=report.resolved_at,
        created_at=report.created_at,
        updated_at=report.updated_at,
    )