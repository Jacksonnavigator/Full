"""
Constants and Enums
Application-wide constants and enumeration definitions
"""

from enum import Enum


class EntityStatus(str, Enum):
    """Entity status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"


class ReportStatus(str, Enum):
    """Report status enumeration"""
    NEW = "new"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    CLOSED = "closed"


class ReportPriority(str, Enum):
    """Report priority enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class NotificationType(str, Enum):
    """Notification type enumeration"""
    INFO = "info"
    WARNING = "warning"
    SUCCESS = "success"
    ERROR = "error"


class UserRole(str, Enum):
    """User role enumeration"""
    ADMIN = "admin"
    UTILITY_MANAGER = "utility_manager"
    DMA_MANAGER = "dma_manager"
    ENGINEER = "engineer"
