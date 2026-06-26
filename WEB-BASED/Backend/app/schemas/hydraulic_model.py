"""
Schemas for the hydraulic model launch and snapshot integration.
"""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class HydraulicModelChoice(BaseModel):
    id: str
    name: str


class HydraulicModelRequirementStatus(BaseModel):
    key: str
    label: str
    present: bool
    required: bool = True
    message: Optional[str] = None


class HydraulicModelReadinessRequest(BaseModel):
    utility_id: Optional[str] = None
    dma_id: Optional[str] = None


class HydraulicModelReadinessResponse(BaseModel):
    ready: bool
    can_prepare: bool
    role: str
    selected_utility_id: Optional[str] = None
    selected_dma_id: Optional[str] = None
    utilities: list[HydraulicModelChoice] = Field(default_factory=list)
    dmas: list[HydraulicModelChoice] = Field(default_factory=list)
    required: list[HydraulicModelRequirementStatus] = Field(default_factory=list)
    optional: list[HydraulicModelRequirementStatus] = Field(default_factory=list)
    message: str
    action_hint: Optional[str] = None


class HydraulicModelPrepareRequest(BaseModel):
    utility_id: Optional[str] = None
    dma_id: Optional[str] = None


class HydraulicModelPrepareResponse(BaseModel):
    session_id: str
    ready: bool
    status: str
    launch_url: Optional[str] = None
    expires_at: datetime
    message: str


class HydraulicSimulationSnapshotCreate(BaseModel):
    launch_session_id: Optional[str] = None
    utility_id: str
    dma_id: str
    hydraulic_scenario_id: Optional[str] = None
    scenario_name: Optional[str] = None
    scenario_status: Optional[str] = None
    input_parameters_json: Optional[dict[str, Any]] = None
    summary_json: Optional[dict[str, Any]] = None
    nrw_json: Optional[dict[str, Any]] = None
    leakage_json: Optional[dict[str, Any]] = None
    alerts_json: Optional[dict[str, Any]] = None
    nodes_geojson: Optional[dict[str, Any]] = None
    pipes_geojson: Optional[dict[str, Any]] = None
    hotspots_geojson: Optional[dict[str, Any]] = None


class HydraulicSimulationSnapshotResponse(BaseModel):
    id: str
    launch_session_id: Optional[str]
    utility_id: str
    dma_id: str
    hydraulic_scenario_id: Optional[str]
    scenario_name: Optional[str]
    scenario_status: Optional[str]
    created_by_user_id: Optional[str]
    created_by_role: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
