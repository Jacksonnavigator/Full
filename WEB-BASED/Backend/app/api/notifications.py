"""
Notification Routes
CRUD operations for notifications
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Notification
from app.schemas.business import (
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse,
    NotificationListResponse,
    NotificationBulkCreate,
)

notifications_router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@notifications_router.get("", response_model=NotificationListResponse)
async def list_notifications(
    user_id: str = Query(None),
    is_read: bool = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all notifications with optional filters"""
    query = db.query(Notification)
    
    if user_id:
        query = query.filter(Notification.user_id == user_id)
    
    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)
    
    total = query.count()
    notifications = query.offset(skip).limit(limit).all()
    
    return NotificationListResponse(
        total=total,
        items=[NotificationResponse.from_orm(n) for n in notifications],
    )


@notifications_router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: str,
    db: Session = Depends(get_db),
):
    """Get notification by ID"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    
    return NotificationResponse.from_orm(notification)


@notifications_router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification_data: NotificationCreate,
    db: Session = Depends(get_db),
):
    """Create a new notification"""
    # Ensure at least one recipient is specified
    if not any([
        notification_data.user_id,
        notification_data.utility_manager_id,
        notification_data.dma_manager_id,
        notification_data.engineer_id,
    ]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one recipient must be specified",
        )
    
    new_notification = Notification(
        notification_type=notification_data.notification_type,
        title=notification_data.title,
        message=notification_data.message,
        is_read=notification_data.is_read,
        user_id=notification_data.user_id,
        utility_manager_id=notification_data.utility_manager_id,
        dma_manager_id=notification_data.dma_manager_id,
        engineer_id=notification_data.engineer_id,
        data=notification_data.data,
    )
    
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    
    return NotificationResponse.from_orm(new_notification)


@notifications_router.post("/bulk/create", response_model=List[NotificationResponse])
async def create_bulk_notifications(
    bulk_data: NotificationBulkCreate,
    db: Session = Depends(get_db),
):
    """Create notifications for multiple recipients"""
    notifications = []
    
    # Create notification for each user_id
    for user_id in bulk_data.user_ids or []:
        notif = Notification(
            notification_type=bulk_data.notification_type,
            title=bulk_data.title,
            message=bulk_data.message,
            user_id=user_id,
            data=bulk_data.data,
        )
        notifications.append(notif)
    
    # Create notification for each utility_manager_id
    for ut_mgr_id in bulk_data.utility_manager_ids or []:
        notif = Notification(
            notification_type=bulk_data.notification_type,
            title=bulk_data.title,
            message=bulk_data.message,
            utility_manager_id=ut_mgr_id,
            data=bulk_data.data,
        )
        notifications.append(notif)
    
    # Create notification for each dma_manager_id
    for dma_mgr_id in bulk_data.dma_manager_ids or []:
        notif = Notification(
            notification_type=bulk_data.notification_type,
            title=bulk_data.title,
            message=bulk_data.message,
            dma_manager_id=dma_mgr_id,
            data=bulk_data.data,
        )
        notifications.append(notif)
    
    # Create notification for each engineer_id
    for eng_id in bulk_data.engineer_ids or []:
        notif = Notification(
            notification_type=bulk_data.notification_type,
            title=bulk_data.title,
            message=bulk_data.message,
            engineer_id=eng_id,
            data=bulk_data.data,
        )
        notifications.append(notif)
    
    if not notifications:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No recipients specified",
        )
    
    db.add_all(notifications)
    db.commit()
    
    return [NotificationResponse.from_orm(n) for n in notifications]


@notifications_router.put("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: str,
    notification_data: NotificationUpdate,
    db: Session = Depends(get_db),
):
    """Update notification details"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    
    update_data = notification_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notification, field, value)
    
    db.commit()
    db.refresh(notification)
    
    return NotificationResponse.from_orm(notification)


@notifications_router.patch("/{notification_id}", response_model=NotificationResponse)
async def patch_notification(
    notification_id: str,
    notification_data: NotificationUpdate,
    db: Session = Depends(get_db),
):
    """Partially update notification"""
    return await update_notification(notification_id, notification_data, db)


@notifications_router.post("/{notification_id}/mark-as-read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
):
    """Mark notification as read"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    
    notification.is_read = True
    
    db.commit()
    db.refresh(notification)
    
    return NotificationResponse.from_orm(notification)


@notifications_router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: str,
    db: Session = Depends(get_db),
):
    """Delete notification by ID"""
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    
    db.delete(notification)
    db.commit()
