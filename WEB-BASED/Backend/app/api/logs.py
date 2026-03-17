"""
Activity Log Routes
CRUD operations for activity logs
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import ActivityLog
from app.schemas.business import (
    ActivityLogCreate,
    ActivityLogResponse,
    ActivityLogListResponse,
    ActivityLogFilterRequest,
)

logs_router = APIRouter(prefix="/api/logs", tags=["activity-logs"])


@logs_router.get("", response_model=ActivityLogListResponse)
async def list_activity_logs(
    user_id: str = Query(None),
    action: str = Query(None),
    entity_type: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all activity logs with optional filters"""
    query = db.query(ActivityLog)
    
    if user_id:
        query = query.filter(ActivityLog.user_id == user_id)
    
    if action:
        query = query.filter(ActivityLog.action.ilike(f"%{action}%"))
    
    if entity_type:
        query = query.filter(ActivityLog.entity_type == entity_type)
    
    total = query.count()
    logs = query.order_by(ActivityLog.timestamp.desc()).offset(skip).limit(limit).all()
    
    return ActivityLogListResponse(
        total=total,
        items=[ActivityLogResponse.from_orm(log) for log in logs],
    )


@logs_router.get("/{log_id}", response_model=ActivityLogResponse)
async def get_activity_log(
    log_id: str,
    db: Session = Depends(get_db),
):
    """Get activity log by ID"""
    log = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity log not found",
        )
    
    return ActivityLogResponse.from_orm(log)


@logs_router.post("", response_model=ActivityLogResponse, status_code=status.HTTP_201_CREATED)
async def create_activity_log(
    log_data: ActivityLogCreate,
    db: Session = Depends(get_db),
):
    """Create a new activity log"""
    new_log = ActivityLog(
        user_id=log_data.user_id,
        action=log_data.action,
        entity_type=log_data.entity_type,
        entity_id=log_data.entity_id,
        description=log_data.description,
    )
    
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return ActivityLogResponse.from_orm(new_log)


@logs_router.post("/filter", response_model=ActivityLogListResponse)
async def filter_activity_logs(
    filter_data: ActivityLogFilterRequest,
    db: Session = Depends(get_db),
):
    """Filter activity logs with advanced criteria"""
    query = db.query(ActivityLog)
    
    if filter_data.user_id:
        query = query.filter(ActivityLog.user_id == filter_data.user_id)
    
    if filter_data.action:
        query = query.filter(ActivityLog.action.ilike(f"%{filter_data.action}%"))
    
    if filter_data.entity_type:
        query = query.filter(ActivityLog.entity_type == filter_data.entity_type)
    
    if filter_data.start_date:
        query = query.filter(ActivityLog.timestamp >= filter_data.start_date)
    
    if filter_data.end_date:
        query = query.filter(ActivityLog.timestamp <= filter_data.end_date)
    
    total = query.count()
    logs = query.order_by(ActivityLog.timestamp.desc()).offset(filter_data.offset).limit(filter_data.limit).all()
    
    return ActivityLogListResponse(
        total=total,
        items=[ActivityLogResponse.from_orm(log) for log in logs],
    )
