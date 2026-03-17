"""
Pydantic schemas for User-related models
Request and response models for API validation
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from app.constants.enums import EntityStatus


# ============================================================================
# User Schemas
# ============================================================================

class UserBase(BaseModel):
    """Base schema for User"""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    avatar: Optional[str] = Field(None, max_length=255)
    status: EntityStatus = EntityStatus.ACTIVE


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str = Field(..., min_length=8, max_length=255)


class UserUpdate(BaseModel):
    """Schema for updating user details"""
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    avatar: Optional[str] = Field(None, max_length=255)
    status: Optional[EntityStatus] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: str
    created_at: datetime
    updated_at: datetime
    user_type: str = "user"  # Type of user: user, utility_manager, dma_manager, engineer
    role: Optional[str] = None  # For engineers: "engineer" or "team_leader"
    # Manager-specific fields
    utility_id: Optional[str] = None
    utility_name: Optional[str] = None
    dma_id: Optional[str] = None
    dma_name: Optional[str] = None

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    """Schema for list of users"""
    total: int
    items: List[UserResponse]


# ============================================================================
# Utility Schemas
# ============================================================================

class UtilityBase(BaseModel):
    """Base schema for Utility"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: EntityStatus = EntityStatus.ACTIVE


class UtilityCreate(UtilityBase):
    """Schema for creating a utility"""
    pass


class UtilityUpdate(BaseModel):
    """Schema for updating utility"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[EntityStatus] = None


class UtilityResponse(UtilityBase):
    """Schema for utility response"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UtilityListResponse(BaseModel):
    """Schema for list of utilities"""
    total: int
    items: List[UtilityResponse]


# ============================================================================
# Utility Manager Schemas
# ============================================================================

class UtilityManagerBase(BaseModel):
    """Base schema for UtilityManager"""
    name: str
    email: str
    phone: Optional[str] = None
    status: str = "active"
    utility_id: Optional[str] = None


class UtilityManagerCreate(UtilityManagerBase):
    """Schema for creating a utility manager"""
    password: str


class UtilityManagerResponse(UtilityManagerBase):
    """Schema for utility manager response"""
    id: str
    avatar: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UtilityManagerListResponse(BaseModel):
    """Schema for list of utility managers"""
    total: int
    items: List[UtilityManagerResponse]


# ============================================================================
# DMA Schemas (District Metering Area)
# ============================================================================

class DMABase(BaseModel):
    """Base schema for DMA"""
    utility_id: str
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: EntityStatus = EntityStatus.ACTIVE


class DMACreate(DMABase):
    """Schema for creating a DMA"""
    pass


class DMAUpdate(BaseModel):
    """Schema for updating DMA"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[EntityStatus] = None


class DMAResponse(DMABase):
    """Schema for DMA response"""
    id: str
    utility_name: Optional[str] = None
    manager_id: Optional[str] = None
    manager_name: Optional[str] = None
    branches_count: int = 0
    reports_count: int = 0
    engineers_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DMAListResponse(BaseModel):
    """Schema for list of DMAs"""
    total: int
    items: List[DMAResponse]


# ============================================================================
# DMA Manager Schemas
# ============================================================================

class DMAManagerBase(BaseModel):
    """Base schema for DMAManager"""
    name: str
    email: str
    phone: Optional[str] = None
    status: str = "active"
    utility_id: str
    dma_id: Optional[str] = None


class DMAManagerCreate(DMAManagerBase):
    """Schema for creating a DMA manager"""
    password: str


class DMAManagerUpdate(BaseModel):
    """Schema for updating a DMA manager"""
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    utility_id: Optional[str] = None
    dma_id: Optional[str] = None
    password: Optional[str] = None  # Optional for updates


class DMAManagerResponse(DMAManagerBase):
    """Schema for DMA manager response"""
    id: str
    avatar: Optional[str] = None
    utility_name: Optional[str] = None
    dma_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DMAManagerListResponse(BaseModel):
    """Schema for list of DMA managers"""
    total: int
    items: List[DMAManagerResponse]


# ============================================================================
# Branch Schemas
# ============================================================================

class BranchBase(BaseModel):
    """Base schema for Branch"""
    dma_id: str
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: EntityStatus = EntityStatus.ACTIVE


class BranchCreate(BranchBase):
    """Schema for creating a branch"""
    pass


class BranchUpdate(BaseModel):
    """Schema for updating branch"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[EntityStatus] = None


class BranchResponse(BranchBase):
    """Schema for branch response"""
    id: str
    dma_name: Optional[str] = None
    utility_id: Optional[str] = None
    utility_name: Optional[str] = None
    engineer_count: int = 0
    team_count: int = 0
    report_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BranchListResponse(BaseModel):
    """Schema for list of branches"""
    total: int
    items: List[BranchResponse]


# ============================================================================
# Team Schemas
# ============================================================================

class TeamBase(BaseModel):
    """Base schema for Team"""
    branch_id: str
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: EntityStatus = EntityStatus.ACTIVE


class TeamCreate(TeamBase):
    """Schema for creating a team"""
    dma_id: Optional[str] = None  # Optional - will be derived from branch if not provided


class TeamUpdate(BaseModel):
    """Schema for updating team"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    branch_id: Optional[str] = None  # Allow changing the branch
    status: Optional[EntityStatus] = None


class TeamResponse(TeamBase):
    """Schema for team response"""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeamListResponse(BaseModel):
    """Schema for list of teams"""
    total: int
    items: List[TeamResponse]


# ============================================================================
# Engineer Schemas
# ============================================================================

class EngineerBase(BaseModel):
    """Base schema for Engineer"""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    branch_id: str
    dma_id: str
    team_id: Optional[str] = None
    role: str = Field(default="engineer", pattern="^(engineer|team_leader)$")
    status: EntityStatus = EntityStatus.ACTIVE
    specialization: Optional[str] = Field(None, max_length=255)


class EngineerCreate(BaseModel):
    """Schema for creating an engineer"""
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    branch_id: str
    dma_id: str
    team_id: Optional[str] = None
    role: str = Field(default="engineer", pattern="^(engineer|team_leader)$")
    status: EntityStatus = EntityStatus.ACTIVE


class EngineerUpdate(BaseModel):
    """Schema for updating engineer"""
    id: str  # Required for update operations
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    branch_id: Optional[str] = None
    team_id: Optional[str] = None
    role: Optional[str] = Field(None, pattern="^(engineer|team_leader)$")
    status: Optional[EntityStatus] = None
    password: Optional[str] = Field(None, min_length=8, max_length=255)


class EngineerResponse(BaseModel):
    """Schema for engineer response"""
    id: str
    name: str
    email: str
    phone: Optional[str]
    branch_id: str
    dma_id: str
    team_id: Optional[str]
    status: str
    role: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EngineerListResponse(BaseModel):
    """Schema for list of engineers"""
    total: int
    items: List[EngineerResponse]


# ============================================================================
# Report Schemas (Extended for Frontend)
# ============================================================================

class ReportResponse(BaseModel):
    """Schema for report response with all details"""
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

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    """Schema for list of reports"""
    total: int
    items: List[ReportResponse]


class ReportWithDetailsResponse(ReportResponse):
    """Extended report response with additional computed fields"""
    pass
