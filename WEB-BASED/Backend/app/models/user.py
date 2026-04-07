"""
User Models
SQLAlchemy ORM models for all user types.

The live operational hierarchy is now:
    Admin -> Utility -> DMA -> Team -> Engineer
"""

from sqlalchemy import Column, String, DateTime, Enum as SQLEnum, ForeignKey, UniqueConstraint, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.models.base import Base


class EntityStatusEnum(str, enum.Enum):
    """Entity status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"


# ============================================================
# User Model (Default Users Table)
# ============================================================

class User(Base):
    """User - Default users table for admin and user management"""
    
    __tablename__ = "user"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Hashed with bcrypt
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    avatar = Column(String(255), nullable=True)
    status = Column(SQLEnum(EntityStatusEnum), default=EntityStatusEnum.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    activity_logs = relationship("ActivityLog", back_populates="user", foreign_keys="ActivityLog.user_id")
    notifications = relationship("Notification", back_populates="user")





# ============================================================
# Utility Model
# ============================================================

class Utility(Base):
    """Water Utility Company - Can manage multiple DMAs"""
    
    __tablename__ = "utility"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)
    status = Column(SQLEnum(EntityStatusEnum), default=EntityStatusEnum.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    manager = relationship("UtilityManager", back_populates="utility", uselist=False, foreign_keys="UtilityManager.utility_id")
    dmas = relationship("DMA", back_populates="utility")
    reports = relationship("Report", back_populates="utility")
    activity_logs = relationship("ActivityLog", back_populates="utility", foreign_keys="ActivityLog.utility_id")


# ============================================================
# UtilityManager Model
# ============================================================

class UtilityManager(Base):
    """Utility Manager - Manages a water utility"""
    
    __tablename__ = "utility_manager"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Hashed with bcrypt
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    avatar = Column(String(255), nullable=True)
    status = Column(SQLEnum(EntityStatusEnum), default=EntityStatusEnum.ACTIVE)
    utility_id = Column(String(36), ForeignKey("utility.id", ondelete="SET NULL"), nullable=True, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    utility = relationship("Utility", back_populates="manager", foreign_keys=[utility_id])
    activity_logs = relationship("ActivityLog", back_populates="utility_mgr", foreign_keys="ActivityLog.utility_mgr_id")
    notifications = relationship("Notification", back_populates="utility_mgr")


# ============================================================
# DMA Model
# ============================================================

class DMA(Base):
    """District Meter Area - Manages a specific geographic area"""
    
    __tablename__ = "dma"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    utility_id = Column(String(36), ForeignKey("utility.id", ondelete="CASCADE"), nullable=False, index=True)
    # Geospatial fields for location-based report assignment
    center_latitude = Column(Float, nullable=True)
    center_longitude = Column(Float, nullable=True)
    status = Column(SQLEnum(EntityStatusEnum), default=EntityStatusEnum.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    __table_args__ = (UniqueConstraint("name", "utility_id", name="uq_dma_name_utility"),)
    
    # Relationships
    utility = relationship("Utility", back_populates="dmas")
    manager = relationship("DMAManager", back_populates="dma", uselist=False, foreign_keys="DMAManager.dma_id")
    engineers = relationship("Engineer", back_populates="dma")
    teams = relationship("Team", back_populates="dma")
    reports = relationship("Report", back_populates="dma")
    activity_logs = relationship("ActivityLog", back_populates="dma", foreign_keys="ActivityLog.dma_id")


# ============================================================
# DMAManager Model
# ============================================================

class DMAManager(Base):
    """DMA Manager - Manages a District Meter Area"""
    
    __tablename__ = "dma_manager"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Hashed with bcrypt
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    avatar = Column(String(255), nullable=True)
    status = Column(SQLEnum(EntityStatusEnum), default=EntityStatusEnum.ACTIVE)
    utility_id = Column(String(36), ForeignKey("utility.id", ondelete="CASCADE"), nullable=False, index=True)
    dma_id = Column(String(36), ForeignKey("dma.id"), nullable=True, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    utility = relationship("Utility")  # Not bidirectional - just reference
    dma = relationship("DMA", back_populates="manager", foreign_keys=[dma_id])
    activity_logs = relationship("ActivityLog", back_populates="dma_mgr", foreign_keys="ActivityLog.dma_mgr_id")
    notifications = relationship("Notification", back_populates="dma_mgr")


# ============================================================
# Team Model
# ============================================================

class Team(Base):
    """Team - Group of engineers working together"""
    
    __tablename__ = "team"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    dma_id = Column(String(36), ForeignKey("dma.id", ondelete="CASCADE"), nullable=False, index=True)
    leader_id = Column(String(36), ForeignKey("engineer.id"), nullable=True, unique=True, index=True)
    status = Column(SQLEnum(EntityStatusEnum), default=EntityStatusEnum.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    __table_args__ = (UniqueConstraint("name", "dma_id", name="uq_team_name_dma"),)
    
    # Relationships
    dma = relationship("DMA", back_populates="teams")
    leader = relationship("Engineer", back_populates="team_leading", uselist=False, foreign_keys=[leader_id])
    engineers = relationship("Engineer", back_populates="team", foreign_keys="Engineer.team_id")
    reports = relationship("Report", back_populates="team")


# ============================================================
# Engineer Model
# ============================================================

class Engineer(Base):
    """Engineer - Field technician handling water leakage reports"""
    
    __tablename__ = "engineer"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)  # Hashed with bcrypt
    phone = Column(String(20), nullable=True)
    dma_id = Column(String(36), ForeignKey("dma.id", ondelete="CASCADE"), nullable=False, index=True)
    team_id = Column(String(36), ForeignKey("team.id"), nullable=True, index=True)
    status = Column(SQLEnum(EntityStatusEnum), default=EntityStatusEnum.ACTIVE)
    role = Column(String(50), default="engineer")  # "engineer" or "team_leader"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    dma = relationship("DMA", back_populates="engineers")
    team = relationship("Team", back_populates="engineers", foreign_keys=[team_id])
    team_leading = relationship("Team", back_populates="leader", uselist=False, foreign_keys="Team.leader_id")
    reports = relationship("Report", back_populates="assigned_engineer")
    activity_logs = relationship("ActivityLog", back_populates="engineer", foreign_keys="ActivityLog.engineer_id")
    notifications = relationship("Notification", back_populates="engineer")
