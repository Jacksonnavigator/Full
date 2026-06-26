"""
Hydraulic model launch integration.

This API prepares scoped MajiScope data for the external hydraulic model while
keeping user access decisions inside MajiScope.
"""

from datetime import datetime, timedelta
import hashlib
import json
import secrets
from urllib.parse import urlencode
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database.session import get_db
from app.models import (
    DMA,
    HydraulicModelLaunchSession,
    HydraulicSimulationSnapshot,
    Utility,
    UtilityInfrastructureLayer,
)
from app.schemas.hydraulic_model import (
    HydraulicModelChoice,
    HydraulicModelPrepareRequest,
    HydraulicModelPrepareResponse,
    HydraulicModelReadinessRequest,
    HydraulicModelReadinessResponse,
    HydraulicModelRequirementStatus,
    HydraulicSimulationSnapshotCreate,
    HydraulicSimulationSnapshotResponse,
)
from app.security.dependencies import CurrentUser, get_current_user, require_admin
from app.services.activity_logs import audit_log


hydraulic_model_router = APIRouter(prefix="/api/hydraulic-model", tags=["hydraulic-model"])

REQUIRED_ASSET_TYPES = {"pipe_network"}
SOURCE_ASSET_TYPES = {"water_sources", "storage_facilities"}
OPTIONAL_ASSET_TYPES = {"valves", "bulk_meters"}
HYDRAULIC_ASSET_ORDER = (
    "pipe_network",
    "water_sources",
    "storage_facilities",
    "valves",
    "bulk_meters",
)


def _choice(entity: Utility | DMA) -> HydraulicModelChoice:
    return HydraulicModelChoice(id=entity.id, name=entity.name)


def _user_role(current_user: CurrentUser) -> str:
    if current_user.user_type == "user":
        return "admin"
    return current_user.user_type


def _actor_columns(current_user: CurrentUser) -> dict[str, Optional[str]]:
    return {
        "user_id": current_user.id if current_user.user_type == "user" else None,
        "utility_mgr_id": current_user.id if current_user.user_type == "utility_manager" else None,
        "dma_mgr_id": current_user.id if current_user.user_type == "dma_manager" else None,
        "engineer_id": current_user.id if current_user.user_type == "engineer" else None,
    }


def _allowed_utilities(db: Session, current_user: CurrentUser) -> list[Utility]:
    if current_user.user_type == "user":
        return db.query(Utility).order_by(Utility.name.asc()).all()
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        utility = db.query(Utility).filter(Utility.id == current_user.utility_id).first()
        return [utility] if utility else []
    if current_user.user_type in {"dma_manager", "engineer"} and current_user.dma_id:
        dma = db.query(DMA).filter(DMA.id == current_user.dma_id).first()
        return [dma.utility] if dma and dma.utility else []
    return []


def _allowed_dmas(db: Session, current_user: CurrentUser, utility_id: Optional[str]) -> list[DMA]:
    if current_user.user_type == "user":
        query = db.query(DMA)
        if utility_id:
            query = query.filter(DMA.utility_id == utility_id)
        return query.order_by(DMA.name.asc()).all()

    if current_user.user_type == "utility_manager" and current_user.utility_id:
        if utility_id and utility_id != current_user.utility_id:
            return []
        return (
            db.query(DMA)
            .filter(DMA.utility_id == current_user.utility_id)
            .order_by(DMA.name.asc())
            .all()
        )

    if current_user.user_type in {"dma_manager", "engineer"} and current_user.dma_id:
        dma = db.query(DMA).filter(DMA.id == current_user.dma_id).first()
        if not dma:
            return []
        if utility_id and dma.utility_id != utility_id:
            return []
        return [dma]

    return []


def _resolve_selection(
    db: Session,
    current_user: CurrentUser,
    requested_utility_id: Optional[str],
    requested_dma_id: Optional[str],
) -> tuple[Optional[Utility], Optional[DMA], list[Utility], list[DMA]]:
    utilities = _allowed_utilities(db, current_user)
    utility_ids = {utility.id for utility in utilities}

    selected_utility_id = requested_utility_id
    if current_user.user_type == "utility_manager":
        selected_utility_id = current_user.utility_id
    elif current_user.user_type in {"dma_manager", "engineer"} and current_user.dma_id:
        user_dma = db.query(DMA).filter(DMA.id == current_user.dma_id).first()
        selected_utility_id = user_dma.utility_id if user_dma else requested_utility_id

    utility = None
    if selected_utility_id:
        utility = db.query(Utility).filter(Utility.id == selected_utility_id).first()
        if not utility or utility.id not in utility_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this utility")

    dmas = _allowed_dmas(db, current_user, utility.id if utility else requested_utility_id)
    dma_ids = {dma.id for dma in dmas}

    selected_dma_id = requested_dma_id
    if current_user.user_type in {"dma_manager", "engineer"}:
        selected_dma_id = current_user.dma_id

    dma = None
    if selected_dma_id:
        dma = db.query(DMA).filter(DMA.id == selected_dma_id).first()
        if not dma or dma.id not in dma_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this DMA")
        if utility and dma.utility_id != utility.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selected DMA does not belong to selected utility")
        if not utility:
            utility = dma.utility

    return utility, dma, utilities, dmas


def _has_valid_boundary(raw_boundary: Optional[str]) -> bool:
    if not raw_boundary:
        return False
    try:
        geometry = json.loads(raw_boundary)
    except (TypeError, json.JSONDecodeError):
        return False
    if not isinstance(geometry, dict):
        return False
    geometry_type = geometry.get("type")
    if geometry_type not in {"Polygon", "MultiPolygon"}:
        return False
    return bool(geometry.get("coordinates"))


def _layer_map(db: Session, utility_id: str) -> dict[str, UtilityInfrastructureLayer]:
    layers = db.query(UtilityInfrastructureLayer).filter(UtilityInfrastructureLayer.utility_id == utility_id).all()
    return {layer.asset_type: layer for layer in layers}


def _build_readiness(
    db: Session,
    current_user: CurrentUser,
    requested_utility_id: Optional[str],
    requested_dma_id: Optional[str],
) -> HydraulicModelReadinessResponse:
    utility, dma, utilities, dmas = _resolve_selection(db, current_user, requested_utility_id, requested_dma_id)
    role = _user_role(current_user)

    if current_user.user_type == "engineer":
        return HydraulicModelReadinessResponse(
            ready=False,
            can_prepare=False,
            role=role,
            selected_utility_id=utility.id if utility else None,
            selected_dma_id=dma.id if dma else None,
            utilities=[_choice(item) for item in utilities],
            dmas=[_choice(item) for item in dmas],
            message="Hydraulic model access is available to administrators, utility managers, and DMA managers.",
        )

    if not utility:
        return HydraulicModelReadinessResponse(
            ready=False,
            can_prepare=False,
            role=role,
            utilities=[_choice(item) for item in utilities],
            dmas=[],
            message="Select a utility before preparing the hydraulic model.",
        )

    if not dma:
        return HydraulicModelReadinessResponse(
            ready=False,
            can_prepare=False,
            role=role,
            selected_utility_id=utility.id,
            utilities=[_choice(item) for item in utilities],
            dmas=[_choice(item) for item in dmas],
            message="Select a DMA before preparing the hydraulic model.",
        )

    layers = _layer_map(db, utility.id)
    has_boundary = _has_valid_boundary(dma.boundary_geojson)
    has_pipe_upload = "pipe_network" in layers
    has_water_source_upload = "water_sources" in layers
    has_storage_upload = "storage_facilities" in layers
    has_source_or_storage_upload = has_water_source_upload or has_storage_upload
    scoped_counts: dict[str, int] = {}
    validation_error: Optional[str] = None

    if has_boundary and (
        has_pipe_upload
        or has_water_source_upload
        or has_storage_upload
        or "valves" in layers
        or "bulk_meters" in layers
    ):
        scoped_counts, validation_error = _call_hydraulic_gpkg_validator(dma=dma, layers=layers)

    pipe_count = scoped_counts.get("waterpipes", 0)
    water_source_count = scoped_counts.get("watersources", 0)
    storage_count = scoped_counts.get("storagefacility", 0)
    valve_count = scoped_counts.get("valves", 0)
    bulk_meter_count = scoped_counts.get("bulk_meters", 0)

    has_pipe_network = has_boundary and has_pipe_upload and not validation_error and pipe_count > 0
    has_source_or_storage = (
        has_boundary
        and
        has_source_or_storage_upload
        and not validation_error
        and (water_source_count > 0 or storage_count > 0)
    )

    pipe_message = None
    if not has_boundary:
        pipe_message = "Set the DMA boundary first so pipe network features can be checked against this DMA."
    elif not has_pipe_upload:
        pipe_message = "Upload the utility pipe network in Infrastructure Upload."
    elif validation_error:
        pipe_message = validation_error
    elif pipe_count <= 0:
        pipe_message = "The uploaded pipe network has no features inside or on this DMA boundary."
    else:
        pipe_message = f"{pipe_count} pipe feature{'s' if pipe_count != 1 else ''} found inside or on this DMA boundary."

    supply_message = None
    if not has_boundary:
        supply_message = "Set the DMA boundary first so water source and storage features can be checked against this DMA."
    elif not has_source_or_storage_upload:
        supply_message = "Upload at least one water source or storage facility layer."
    elif validation_error:
        supply_message = validation_error
    elif water_source_count <= 0 and storage_count <= 0:
        supply_message = "Uploaded water source and storage layers have no features inside or on this DMA boundary."
    else:
        supply_total = water_source_count + storage_count
        supply_message = f"{supply_total} water source/storage feature{'s' if supply_total != 1 else ''} found inside or on this DMA boundary."

    required = [
        HydraulicModelRequirementStatus(
            key="dma_boundary",
            label="DMA boundary",
            present=has_boundary,
            required=True,
            message=None if has_boundary else "Set this DMA boundary before preparing model data.",
        ),
        HydraulicModelRequirementStatus(
            key="pipe_network",
            label="Pipe network",
            present=has_pipe_network,
            required=True,
            message=pipe_message,
        ),
        HydraulicModelRequirementStatus(
            key="water_supply_point",
            label="Water source or storage facility",
            present=has_source_or_storage,
            required=True,
            message=supply_message,
        ),
    ]
    optional = [
        HydraulicModelRequirementStatus(
            key="valves",
            label="Valves",
            present=has_boundary and "valves" in layers and not validation_error and valve_count > 0,
            required=False,
            message=(
                "Set the DMA boundary first so valves can be checked against this DMA."
                if not has_boundary
                else
                "Optional: upload valves for richer model context."
                if "valves" not in layers
                else "Uploaded valves have no features inside or on this DMA boundary."
                if valve_count <= 0
                else f"{valve_count} valve feature{'s' if valve_count != 1 else ''} found inside or on this DMA boundary."
            ),
        ),
        HydraulicModelRequirementStatus(
            key="bulk_meters",
            label="Bulk meters",
            present=has_boundary and "bulk_meters" in layers and not validation_error and bulk_meter_count > 0,
            required=False,
            message=(
                "Set the DMA boundary first so bulk meters can be checked against this DMA."
                if not has_boundary
                else
                "Optional: upload bulk meters for richer model context."
                if "bulk_meters" not in layers
                else "Uploaded bulk meters have no features inside or on this DMA boundary."
                if bulk_meter_count <= 0
                else f"{bulk_meter_count} bulk meter feature{'s' if bulk_meter_count != 1 else ''} found inside or on this DMA boundary."
            ),
        ),
    ]

    ready = all(item.present for item in required)
    if ready:
        message = "Hydraulic model data is ready to prepare for this DMA."
        action_hint = None
    elif role == "dma_manager":
        message = "Hydraulic model cannot run yet because required DMA or utility data is missing."
        action_hint = "Ask your utility manager to upload the missing infrastructure or update the DMA boundary."
    else:
        message = "Hydraulic model cannot run yet because required DMA or utility data is missing."
        action_hint = "Update the DMA boundary or upload the missing infrastructure before preparing the model."

    return HydraulicModelReadinessResponse(
        ready=ready,
        can_prepare=ready,
        role=role,
        selected_utility_id=utility.id,
        selected_dma_id=dma.id,
        utilities=[_choice(item) for item in utilities],
        dmas=[_choice(item) for item in dmas],
        required=required,
        optional=optional,
        message=message,
        action_hint=action_hint,
    )


def _hash_launch_token(token: str) -> str:
    seed = f"{settings.hydraulic_model_launch_secret}:{token}"
    return hashlib.sha256(seed.encode("utf-8")).hexdigest()


def _layer_upload_files(layers: dict[str, UtilityInfrastructureLayer]) -> dict[str, tuple[str, bytes, str]]:
    files: dict[str, tuple[str, bytes, str]] = {}
    for asset_type in HYDRAULIC_ASSET_ORDER:
        layer = layers.get(asset_type)
        if not layer:
            continue
        files[asset_type] = (
            layer.file_name or f"{asset_type}.gpkg",
            bytes(layer.file_data or b""),
            layer.mime_type or "application/octet-stream",
        )
    return files


def _call_hydraulic_gpkg_validator(
    *,
    dma: DMA,
    layers: dict[str, UtilityInfrastructureLayer],
) -> tuple[dict[str, int], Optional[str]]:
    if not settings.hydraulic_model_base_url:
        return {}, "Hydraulic model service URL is not configured."
    if not settings.hydraulic_model_api_key:
        return {}, "Hydraulic model service API key is not configured."
    if not dma.boundary_geojson:
        return {}, None

    files = _layer_upload_files(layers)
    data = {
        "dma_id": dma.id,
        "dma_name": dma.name,
        "dma_geojson": dma.boundary_geojson,
    }

    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.post(
                f"{settings.hydraulic_model_base_url}/majiscope/validate-gpkg",
                data=data,
                files=files,
                headers={"X-API-Key": settings.hydraulic_model_api_key},
            )
    except httpx.HTTPError as exc:
        return {}, f"Hydraulic model service is not reachable: {exc}"

    if response.status_code >= 400:
        try:
            payload = response.json()
        except ValueError:
            payload = {}
        detail = payload.get("detail") or payload.get("message") or response.text or "Hydraulic model asset validation failed."
        return {}, str(detail)

    try:
        payload = response.json()
    except ValueError:
        return {}, "Hydraulic model asset validation returned invalid data."

    raw_counts = payload.get("feature_counts") or {}
    counts: dict[str, int] = {}
    for key, value in raw_counts.items():
        try:
            counts[str(key)] = int(value)
        except (TypeError, ValueError):
            counts[str(key)] = 0
    return counts, None


def _call_hydraulic_gpkg_builder(
    *,
    session: HydraulicModelLaunchSession,
    launch_token: str,
    dma: DMA,
    layers: dict[str, UtilityInfrastructureLayer],
) -> dict:
    if not settings.hydraulic_model_base_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hydraulic model service URL is not configured.",
        )
    if not settings.hydraulic_model_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hydraulic model service API key is not configured.",
        )
    if not dma.boundary_geojson:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Selected DMA has no boundary geometry.",
        )

    files = _layer_upload_files(layers)

    data = {
        "session_id": session.id,
        "launch_token": launch_token,
        "expires_at": session.expires_at.isoformat(),
        "utility_id": session.utility_id,
        "dma_id": dma.id,
        "dma_name": dma.name,
        "dma_geojson": dma.boundary_geojson,
    }

    try:
        with httpx.Client(timeout=120.0) as client:
            response = client.post(
                f"{settings.hydraulic_model_base_url}/majiscope/prepare-gpkg",
                data=data,
                files=files,
                headers={"X-API-Key": settings.hydraulic_model_api_key},
            )
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Hydraulic model service is not reachable: {exc}",
        ) from exc

    if response.status_code >= 400:
        try:
            payload = response.json()
        except ValueError:
            payload = {}
        detail = payload.get("detail") or payload.get("message") or response.text or "Hydraulic model file preparation failed."
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

    return response.json()


@hydraulic_model_router.post("/readiness", response_model=HydraulicModelReadinessResponse)
def check_hydraulic_model_readiness(
    payload: HydraulicModelReadinessRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _build_readiness(db, current_user, payload.utility_id, payload.dma_id)


@hydraulic_model_router.post("/prepare", response_model=HydraulicModelPrepareResponse)
def prepare_hydraulic_model(
    payload: HydraulicModelPrepareRequest,
    request: Request,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    readiness = _build_readiness(db, current_user, payload.utility_id, payload.dma_id)
    if not readiness.ready or not readiness.selected_utility_id or not readiness.selected_dma_id:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=readiness.message)

    dma = db.query(DMA).filter(DMA.id == readiness.selected_dma_id).first()
    if not dma:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected DMA was not found")
    utility = db.query(Utility).filter(Utility.id == readiness.selected_utility_id).first()
    layers = _layer_map(db, readiness.selected_utility_id)

    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=max(1, settings.hydraulic_model_temp_ttl_hours))
    session = HydraulicModelLaunchSession(
        **_actor_columns(current_user),
        user_name=current_user.email,
        user_role=_user_role(current_user),
        utility_id=readiness.selected_utility_id,
        dma_id=readiness.selected_dma_id,
        launch_token_hash=_hash_launch_token(token),
        status="prepared",
        readiness_json=readiness.model_dump(),
        missing_required_json=[item.model_dump() for item in readiness.required if not item.present],
        optional_status_json=[item.model_dump() for item in readiness.optional],
        expires_at=expires_at,
    )
    db.add(session)
    db.flush()

    try:
        prepared = _call_hydraulic_gpkg_builder(session=session, launch_token=token, dma=dma, layers=layers)
    except HTTPException as exc:
        session.status = "failed"
        session.error_message = str(exc.detail)
        db.commit()
        raise

    session.hydraulic_filename = prepared.get("filename")
    session.hydraulic_file_ref = prepared.get("filename")
    session.status = "prepared"
    session.readiness_json = {
        **readiness.model_dump(),
        "prepared_file": prepared,
    }
    db.commit()
    db.refresh(session)

    base_url = settings.hydraulic_model_base_url or ""
    launch_url = None
    if base_url and session.hydraulic_filename:
        query = urlencode(
            {
                "launch_token": token,
                "session_id": session.id,
                "file": session.hydraulic_filename,
                "return_url": f"{settings.frontend_url.rstrip('/')}/dashboard",
                "utility_name": utility.name if utility else "Utility",
                "dma_name": dma.name,
            }
        )
        launch_url = f"{base_url}/app?{query}"

    audit_log(
        db,
        action="hydraulic model prepared",
        actor=current_user,
        entity="hydraulic_model_launch_session",
        entity_id=session.id,
        details="Prepared hydraulic model launch session",
        event_type="hydraulic_model.prepare",
        status="success",
        target_name=session.id,
        request=request,
        after_data={
            "session_id": session.id,
            "utility_id": session.utility_id,
            "dma_id": session.dma_id,
            "hydraulic_filename": session.hydraulic_filename,
            "expires_at": session.expires_at.isoformat(),
        },
        utility_id=session.utility_id,
        dma_id=session.dma_id,
    )
    db.commit()

    return HydraulicModelPrepareResponse(
        session_id=session.id,
        ready=True,
        status=session.status,
        launch_url=launch_url,
        expires_at=session.expires_at,
        message="Hydraulic model is prepared. Open the hydraulic model to continue.",
    )


@hydraulic_model_router.post("/snapshots", response_model=HydraulicSimulationSnapshotResponse)
def create_hydraulic_simulation_snapshot(
    payload: HydraulicSimulationSnapshotCreate,
    request: Request,
    x_majiscope_hydraulic_secret: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if settings.hydraulic_model_callback_secret:
        if x_majiscope_hydraulic_secret != settings.hydraulic_model_callback_secret:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid hydraulic model callback secret")

    launch_session = None
    if payload.launch_session_id:
        launch_session = (
            db.query(HydraulicModelLaunchSession)
            .filter(HydraulicModelLaunchSession.id == payload.launch_session_id)
            .first()
        )

    snapshot = HydraulicSimulationSnapshot(
        launch_session_id=payload.launch_session_id,
        utility_id=payload.utility_id,
        dma_id=payload.dma_id,
        hydraulic_scenario_id=payload.hydraulic_scenario_id,
        scenario_name=payload.scenario_name,
        scenario_status=payload.scenario_status,
        input_parameters_json=payload.input_parameters_json,
        summary_json=payload.summary_json,
        nrw_json=payload.nrw_json,
        leakage_json=payload.leakage_json,
        alerts_json=payload.alerts_json,
        nodes_geojson=payload.nodes_geojson,
        pipes_geojson=payload.pipes_geojson,
        hotspots_geojson=payload.hotspots_geojson,
        created_by_user_id=launch_session.user_id if launch_session else None,
        created_by_role=launch_session.user_role if launch_session else None,
    )
    db.add(snapshot)

    if launch_session:
        launch_session.status = "completed"
        launch_session.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(snapshot)

    audit_log(
        db,
        action="hydraulic simulation snapshot saved",
        actor=None,
        entity="hydraulic_simulation_snapshot",
        entity_id=snapshot.id,
        details="Hydraulic model saved completed simulation output",
        event_type="hydraulic_model.snapshot",
        status="success",
        target_name=snapshot.scenario_name or snapshot.hydraulic_scenario_id or snapshot.id,
        request=request,
        after_data={
            "id": snapshot.id,
            "launch_session_id": snapshot.launch_session_id,
            "utility_id": snapshot.utility_id,
            "dma_id": snapshot.dma_id,
            "hydraulic_scenario_id": snapshot.hydraulic_scenario_id,
            "scenario_status": snapshot.scenario_status,
        },
        utility_id=snapshot.utility_id,
        dma_id=snapshot.dma_id,
    )
    db.commit()

    return snapshot


@hydraulic_model_router.get("/snapshots", response_model=list[HydraulicSimulationSnapshotResponse])
def list_hydraulic_simulation_snapshots(
    utility_id: Optional[str] = None,
    dma_id: Optional[str] = None,
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db),
):
    query = db.query(HydraulicSimulationSnapshot)
    if utility_id:
        query = query.filter(HydraulicSimulationSnapshot.utility_id == utility_id)
    if dma_id:
        query = query.filter(HydraulicSimulationSnapshot.dma_id == dma_id)
    return query.order_by(HydraulicSimulationSnapshot.created_at.desc()).limit(200).all()


@hydraulic_model_router.post("/sessions/{session_id}/cleanup")
def mark_hydraulic_model_session_cleaned(
    session_id: str,
    request: Request,
    x_majiscope_hydraulic_secret: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if settings.hydraulic_model_callback_secret:
        if x_majiscope_hydraulic_secret != settings.hydraulic_model_callback_secret:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid hydraulic model callback secret")

    session = (
        db.query(HydraulicModelLaunchSession)
        .filter(HydraulicModelLaunchSession.id == session_id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hydraulic model launch session not found")

    session.status = "cleaned"
    session.cleaned_at = datetime.utcnow()
    db.commit()

    audit_log(
        db,
        action="hydraulic model temporary files cleaned",
        actor=None,
        entity="hydraulic_model_launch_session",
        entity_id=session.id,
        details="Hydraulic service cleaned temporary model files",
        event_type="hydraulic_model.cleanup",
        status="success",
        target_name=session.id,
        request=request,
        after_data={
            "session_id": session.id,
            "utility_id": session.utility_id,
            "dma_id": session.dma_id,
            "cleaned_at": session.cleaned_at.isoformat() if session.cleaned_at else None,
        },
        utility_id=session.utility_id,
        dma_id=session.dma_id,
    )
    db.commit()

    return {"success": True, "session_id": session.id, "status": session.status}
