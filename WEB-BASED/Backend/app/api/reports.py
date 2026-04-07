"""
Report Routes
CRUD operations for reports in the simplified DMA -> Team -> Engineer flow.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Report, Team, Engineer, DMA, Utility, ImageUpload, ImageTypeEnum
from app.models.business import ReportStatusEnum, ReportPriorityEnum, NotificationTypeEnum
from app.models.user import DMAManager
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
import re
from app.services.hierarchy import find_nearest_dma
from app.services.push_notifications import create_notification_record, deliver_notifications_push
from app.services.activity_logs import log_report_activity


reports_router = APIRouter(prefix="/api/reports", tags=["reports"])

UPLOAD_URL_PATTERN = re.compile(r"/api/uploads/([0-9a-fA-F-]{36})$")


class ReportWithDetails(BaseModel):
    """Report response with additional details"""
    id: str
    tracking_id: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    photos: List[str] = []
    report_photos: List[str] = []
    submission_before_photos: List[str] = []
    submission_after_photos: List[str] = []
    priority: str
    status: str
    utility_id: str
    utility_name: Optional[str] = None
    dma_id: Optional[str] = None
    dma_name: Optional[str] = None
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


def _report_link(report_id: str) -> str:
    return f"/dashboard/reports/{report_id}"


def _queue_dma_manager_notification(
    db: Session,
    report: Report,
    title: str,
    message: str,
    notification_type: NotificationTypeEnum,
):
    dma_manager = db.query(DMAManager).filter(DMAManager.dma_id == report.dma_id).first()
    if not dma_manager:
        return None

    return create_notification_record(
        db,
        title=title,
        message=message,
        notification_type=notification_type,
        dma_manager_id=dma_manager.id,
        data={"reportId": report.id, "trackingId": report.tracking_id, "status": report.status.value if hasattr(report.status, "value") else report.status},
        link=_report_link(report.id),
        flush=False,
    )


def _queue_engineer_notification(
    db: Session,
    report: Report,
    title: str,
    message: str,
    notification_type: NotificationTypeEnum,
):
    if not report.assigned_engineer_id:
        return None
    return create_notification_record(
        db,
        title=title,
        message=message,
        notification_type=notification_type,
        engineer_id=report.assigned_engineer_id,
        data={"reportId": report.id, "trackingId": report.tracking_id, "status": report.status.value if hasattr(report.status, "value") else report.status},
        link=_report_link(report.id),
        flush=False,
    )


def _queue_team_leader_notification(
    db: Session,
    report: Report,
    title: str,
    message: str,
    notification_type: NotificationTypeEnum,
):
    if not report.team_id:
        return None
    team = db.query(Team).filter(Team.id == report.team_id).first()
    if not team or not team.leader_id:
        return None
    return create_notification_record(
        db,
        title=title,
        message=message,
        notification_type=notification_type,
        engineer_id=team.leader_id,
        data={"reportId": report.id, "trackingId": report.tracking_id, "status": report.status.value if hasattr(report.status, "value") else report.status},
        link=_report_link(report.id),
        flush=False,
    )


def _extract_upload_id(photo_ref: str) -> Optional[str]:
    if not photo_ref:
        return None

    match = UPLOAD_URL_PATTERN.search(photo_ref)
    return match.group(1) if match else None


def _attach_upload_refs_to_report(report: Report, photo_refs: List[str], db: Session) -> None:
    upload_ids = [_extract_upload_id(photo_ref) for photo_ref in photo_refs]
    upload_ids = [upload_id for upload_id in upload_ids if upload_id]
    if not upload_ids:
        return

    uploads = db.query(ImageUpload).filter(ImageUpload.id.in_(upload_ids)).all()
    for upload in uploads:
        upload.report_id = report.id
        upload.image_type = ImageTypeEnum.REPORT


def _apply_report_photo_update(report: Report, incoming_photos: List[str], db: Session) -> None:
    """
    Backward-compatible photo handling.

    Older mobile builds sent repair upload URLs through the generic `photos` field.
    That should not overwrite the original report photos. We now:
    1. Associate any referenced uploaded images with this report.
    2. Keep original report.photos intact when the incoming set is only submission media.
    3. Still allow true report-photo updates (data URIs / normal URLs / report uploads).
    """
    upload_ids = [_extract_upload_id(photo) for photo in incoming_photos]
    upload_ids = [upload_id for upload_id in upload_ids if upload_id]

    uploads_by_id = {}
    if upload_ids:
        uploads = db.query(ImageUpload).filter(ImageUpload.id.in_(upload_ids)).all()
        uploads_by_id = {upload.id: upload for upload in uploads}

        for upload in uploads:
            if upload.report_id != report.id:
                upload.report_id = report.id

    matched_uploads = [uploads_by_id[upload_id] for upload_id in upload_ids if upload_id in uploads_by_id]
    only_submission_uploads = bool(matched_uploads) and len(matched_uploads) == len(incoming_photos) and all(
        (upload.image_type.value if hasattr(upload.image_type, "value") else upload.image_type)
        in {"submission_before", "submission_after"}
        for upload in matched_uploads
    )
    engineer_submission_uploads = bool(matched_uploads) and len(matched_uploads) == len(incoming_photos) and all(
        upload.engineer_id is not None and upload.user_id is None
        for upload in matched_uploads
    )

    if engineer_submission_uploads:
        for upload in matched_uploads:
            upload.image_type = ImageTypeEnum.SUBMISSION_AFTER

    if only_submission_uploads or engineer_submission_uploads:
        return

    report.photos = incoming_photos


def _append_unique(target: List[str], value: str) -> None:
    if value and value not in target:
        target.append(value)


def _split_report_photo_groups(report: Report, db: Session) -> Tuple[List[str], List[str], List[str]]:
    report_photos: List[str] = []
    submission_before_photos: List[str] = []
    submission_after_photos: List[str] = []

    stored_photo_refs = list(report.photos or [])
    stored_upload_ids = [_extract_upload_id(photo_ref) for photo_ref in stored_photo_refs]
    stored_upload_ids = [upload_id for upload_id in stored_upload_ids if upload_id]

    uploads_by_id = {}
    if stored_upload_ids:
        uploads = db.query(ImageUpload).filter(ImageUpload.id.in_(stored_upload_ids)).all()
        uploads_by_id = {upload.id: upload for upload in uploads}

    for photo_ref in stored_photo_refs:
        upload_id = _extract_upload_id(photo_ref)
        upload = uploads_by_id.get(upload_id) if upload_id else None

        if not upload:
            _append_unique(report_photos, photo_ref)
            continue

        image_type = upload.image_type.value if hasattr(upload.image_type, "value") else upload.image_type
        if image_type == "submission_before":
            _append_unique(submission_before_photos, photo_ref)
        elif image_type == "submission_after":
            _append_unique(submission_after_photos, photo_ref)
        elif upload.engineer_id and not upload.user_id:
            _append_unique(submission_after_photos, photo_ref)
        else:
            _append_unique(report_photos, photo_ref)

    for image in report.images or []:
        download_url = f"/api/uploads/{image.id}"
        image_type = image.image_type.value if hasattr(image.image_type, "value") else image.image_type

        if image_type == "submission_before":
            _append_unique(submission_before_photos, download_url)
        elif image_type == "submission_after":
            _append_unique(submission_after_photos, download_url)
        elif image.engineer_id and not image.user_id:
            _append_unique(submission_after_photos, download_url)
        else:
            _append_unique(report_photos, download_url)

    return report_photos, submission_before_photos, submission_after_photos


@reports_router.get("", response_model=ReportListResponse)
async def list_reports(
    dma_id: str = Query(None),
    utility_id: str = Query(None),
    status_filter: str = Query(None, alias="status"),
    user_id: str = Query(None, alias="user_id"),  # Add user_id filter for engineers
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
    elif current_user.user_type == "engineer":
        # Engineers see only reports assigned to them
        query = query.filter(Report.assigned_engineer_id == current_user.id)
    # Admins see all reports
    
    # Apply additional filters
    if dma_id:
        query = query.filter(Report.dma_id == dma_id)
        
    if utility_id:
        query = query.filter(Report.utility_id == utility_id)
    
    if user_id:
        # Allow filtering by specific user_id (for admin/manager views)
        query = query.filter(Report.assigned_engineer_id == user_id)
    
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
    
    dma = None
    if report_data.dma_id:
        dma = db.query(DMA).filter(DMA.id == report_data.dma_id).first()
        if not dma:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="DMA not found",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="DMA is required",
        )

    new_report = Report(
        tracking_id=report_data.tracking_id,
        dma_id=dma.id if dma else None,
        utility_id=dma.utility_id if dma else None,
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
    log_report_activity(
        db,
        report=new_report,
        action="report_created",
        details=f"Report {new_report.tracking_id} was created from the authenticated workflow.",
        actor=current_user,
    )
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
    
    # Assign the report to the nearest DMA based on coordinates.
    dma, distance = find_nearest_dma(report_data.latitude, report_data.longitude, db)

    if not dma:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No DMAs configured in system",
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
        dma_id=dma.id,
        utility_id=dma.utility_id,
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
    db.flush()
    _attach_upload_refs_to_report(new_report, report_data.images or [], db)
    queued_notification = _queue_dma_manager_notification(
        db,
        new_report,
        title="New leakage report received",
        message=f"{new_report.tracking_id} was reported in {dma.name} and needs assignment.",
        notification_type=NotificationTypeEnum.WARNING,
    )
    log_report_activity(
        db,
        report=new_report,
        action="report_created",
        details=f"Anonymous report {tracking_id} was created and routed to {dma.name}.",
        actor_name=report_data.reported_by or "Anonymous",
        actor_role="anonymous_reporter",
    )
    db.commit()
    db.refresh(new_report)
    if queued_notification:
        deliver_notifications_push([queued_notification], db)
    
    return _build_report_with_details(new_report, db)


@reports_router.get("/public/by-location", response_model=ReportListResponse)
async def get_reports_by_location(
    utility_id: str = Query(None),
    dma_id: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Get reports by utility/DMA (public, no auth needed)
    Useful for viewing anonymous/public reports submitted from mobile app
    Returns all reports including anonymous ones for a given location
    """
    query = db.query(Report)
    
    if utility_id:
        query = query.filter(Report.utility_id == utility_id)
    
    if dma_id:
        query = query.filter(Report.dma_id == dma_id)
    
    total = query.count()
    reports = query.order_by(Report.created_at.desc()).offset(skip).limit(limit).all()
    
    # Build response with details
    items = []
    for report in reports:
        items.append(_build_report_with_details(report, db))
    
    return ReportListResponse(total=total, items=items)


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
    incoming_photos = update_data.pop("photos", None)
    queued_notifications = []
    changed_fields: list[str] = []
    for field, value in update_data.items():
        setattr(report, field, value)
        changed_fields.append(field)

    if incoming_photos is not None:
        _apply_report_photo_update(report, incoming_photos, db)
        changed_fields.append("photos")

    if changed_fields:
        log_report_activity(
            db,
            report=report,
            action="report_updated",
            details=f"Updated report fields: {', '.join(sorted(set(changed_fields)))}.",
            actor=current_user,
        )
    
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
    queued_notifications = []
    
    if status_update.status == ReportStatusEnum.APPROVED:
        report.resolved_at = datetime.utcnow()
    elif status_update.status == ReportStatusEnum.PENDING_APPROVAL:
        if current_user.user_type == "engineer" and current_user.role == "team_leader":
            notification = _queue_dma_manager_notification(
                db,
                report,
                title="Team leader approved field repair",
                message=f"{report.tracking_id} is awaiting DMA approval.",
                notification_type=NotificationTypeEnum.INFO,
            )
            if notification:
                queued_notifications.append(notification)
        elif current_user.user_type == "engineer":
            notification = _queue_team_leader_notification(
                db,
                report,
                title="Repair submitted for review",
                message=f"{report.tracking_id} has been submitted by the field engineer.",
                notification_type=NotificationTypeEnum.INFO,
            )
            if notification:
                queued_notifications.append(notification)
    elif status_update.status == ReportStatusEnum.ASSIGNED and current_user.user_type == "engineer" and current_user.role == "team_leader":
        notification = _queue_engineer_notification(
            db,
            report,
            title="Repair sent back for rework",
            message=status_update.notes or f"{report.tracking_id} was returned by the team leader for more work.",
            notification_type=NotificationTypeEnum.WARNING,
        )
        if notification:
            queued_notifications.append(notification)

    log_report_activity(
        db,
        report=report,
        action="report_status_changed",
        details=f"Status changed to {getattr(status_update.status, 'value', status_update.status)}."
        + (f" Notes: {status_update.notes}" if status_update.notes else ""),
        actor=current_user,
    )
    
    db.commit()
    db.refresh(report)
    if queued_notifications:
        deliver_notifications_push(queued_notifications, db)
    
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
    queued_notifications = []
    log_report_activity(
        db,
        report=report,
        action="report_assigned",
        details=f"Assigned to team {team.name} and engineer {engineer.name}.",
        actor=current_user,
    )
    notification = _queue_engineer_notification(
        db,
        report,
        title="New field task assigned",
        message=f"{report.tracking_id} has been assigned to you.",
        notification_type=NotificationTypeEnum.INFO,
    )
    if notification:
        queued_notifications.append(notification)
    if team.leader_id and team.leader_id != report.assigned_engineer_id:
        leader_notification = _queue_team_leader_notification(
            db,
            report,
            title="New team task assigned",
            message=f"{report.tracking_id} has been assigned to {engineer.name}.",
            notification_type=NotificationTypeEnum.INFO,
        )
        if leader_notification:
            queued_notifications.append(leader_notification)

    db.commit()
    db.refresh(report)
    if queued_notifications:
        deliver_notifications_push(queued_notifications, db)
    
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
    queued_notifications = []
    log_report_activity(
        db,
        report=report,
        action="report_approved",
        details="Report approved by DMA and marked as resolved.",
        actor=current_user,
    )
    engineer_notification = _queue_engineer_notification(
        db,
        report,
        title="Repair approved by DMA",
        message=f"{report.tracking_id} has been approved and closed.",
        notification_type=NotificationTypeEnum.SUCCESS,
    )
    if engineer_notification:
        queued_notifications.append(engineer_notification)
    leader_notification = _queue_team_leader_notification(
        db,
        report,
        title="DMA approved resolved report",
        message=f"{report.tracking_id} has been approved and closed.",
        notification_type=NotificationTypeEnum.SUCCESS,
    )
    if leader_notification and (not engineer_notification or leader_notification.engineer_id != engineer_notification.engineer_id):
        queued_notifications.append(leader_notification)

    db.commit()
    db.refresh(report)
    if queued_notifications:
        deliver_notifications_push(queued_notifications, db)
    
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
    queued_notifications = []
    log_report_activity(
        db,
        report=report,
        action="report_rejected",
        details="Report rejected by DMA and returned for follow-up work.",
        actor=current_user,
    )
    engineer_notification = _queue_engineer_notification(
        db,
        report,
        title="Repair rejected by DMA",
        message=f"{report.tracking_id} needs more work before it can be closed.",
        notification_type=NotificationTypeEnum.ERROR,
    )
    if engineer_notification:
        queued_notifications.append(engineer_notification)
    leader_notification = _queue_team_leader_notification(
        db,
        report,
        title="DMA rejected repair",
        message=f"{report.tracking_id} needs follow-up before resubmission.",
        notification_type=NotificationTypeEnum.ERROR,
    )
    if leader_notification and (not engineer_notification or leader_notification.engineer_id != engineer_notification.engineer_id):
        queued_notifications.append(leader_notification)

    db.commit()
    db.refresh(report)
    if queued_notifications:
        deliver_notifications_push(queued_notifications, db)
    
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

    report_photos, submission_before_photos, submission_after_photos = _split_report_photo_groups(report, db)
    
    return ReportWithDetails(
        id=report.id,
        tracking_id=report.tracking_id,
        description=report.description,
        latitude=report.latitude,
        longitude=report.longitude,
        address=report.address,
        photos=report.photos or [],
        report_photos=report_photos,
        submission_before_photos=submission_before_photos,
        submission_after_photos=submission_after_photos,
        priority=report.priority.value if hasattr(report.priority, 'value') else report.priority,
        status=report.status.value if hasattr(report.status, 'value') else report.status,
        utility_id=report.utility_id,
        utility_name=utility_name,
        dma_id=report.dma_id,
        dma_name=dma_name,
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
