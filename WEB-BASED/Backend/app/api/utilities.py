"""
Utility Routes
CRUD operations for utilities
"""

import json
from pathlib import Path
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Utility, UtilityPipeNetwork
from app.schemas.user import (
    UtilityCreate,
    UtilityUpdate,
    UtilityResponse,
    UtilityListResponse,
)
from app.security.dependencies import get_current_user, require_admin, require_utility_manager, CurrentUser

utilities_router = APIRouter(prefix="/api/utilities", tags=["utilities"])

MAX_PIPE_NETWORK_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_PIPE_NETWORK_EXTENSIONS = {
    ".geojson",
    ".json",
    ".kml",
    ".kmz",
    ".zip",
    ".csv",
    ".gpkg",
    ".pdf",
    ".txt",
}


def _ensure_utility_access(utility: Utility, current_user: CurrentUser) -> None:
    if current_user.user_type == "user":
        return

    if current_user.user_type == "utility_manager" and current_user.utility_id == utility.id:
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have access to this utility",
    )


def _build_utility_response(utility: Utility) -> UtilityResponse:
    pipe_network = utility.pipe_network_file
    return UtilityResponse(
        id=utility.id,
        name=utility.name,
        description=utility.description,
        status=utility.status,
        pipe_network_file_name=pipe_network.file_name if pipe_network else None,
        pipe_network_file_size=pipe_network.file_size if pipe_network else None,
        pipe_network_mime_type=pipe_network.mime_type if pipe_network else None,
        pipe_network_download_url=f"/api/utilities/{utility.id}/pipe-network/download" if pipe_network else None,
        pipe_network_preview_url=f"/api/utilities/{utility.id}/pipe-network/geojson" if pipe_network else None,
        pipe_network_uploaded_at=pipe_network.updated_at if pipe_network else None,
        created_at=utility.created_at,
        updated_at=utility.updated_at,
    )


def _coerce_geojson(payload):
    if isinstance(payload, dict) and payload.get("type") == "FeatureCollection":
        return payload

    if isinstance(payload, dict) and payload.get("type") in {
        "Feature",
        "LineString",
        "MultiLineString",
        "Polygon",
        "MultiPolygon",
        "Point",
        "MultiPoint",
        "GeometryCollection",
    }:
        return {
            "type": "FeatureCollection",
            "features": [
                payload if payload.get("type") == "Feature" else {"type": "Feature", "properties": {}, "geometry": payload}
            ],
        }

    if isinstance(payload, list):
        features = []
        for item in payload:
            if not isinstance(item, dict):
                continue
            if item.get("type") == "Feature":
                features.append(item)
            elif item.get("type"):
                features.append({"type": "Feature", "properties": {}, "geometry": item})
        if features:
            return {"type": "FeatureCollection", "features": features}

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Pipe network preview currently supports GeoJSON / JSON uploads only.",
    )


def _load_pipe_network_geojson(pipe_network: UtilityPipeNetwork):
    try:
        payload = json.loads(pipe_network.file_data.decode("utf-8"))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipe network file could not be parsed as GeoJSON/JSON for map preview.",
        ) from exc

    return _coerce_geojson(payload)


@utilities_router.get("", response_model=UtilityListResponse)
async def list_utilities(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    List all utilities with pagination
    Requires authentication
    """
    query = db.query(Utility)
    if current_user.user_type == "utility_manager" and current_user.utility_id:
        query = query.filter(Utility.id == current_user.utility_id)

    total = query.count()
    utilities = query.offset(skip).limit(limit).all()
    
    return UtilityListResponse(
        total=total,
        items=[_build_utility_response(u) for u in utilities],
    )


@utilities_router.get("/{utility_id}", response_model=UtilityResponse)
async def get_utility(
    utility_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get utility by ID
    Requires authentication
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user)
    return _build_utility_response(utility)


@utilities_router.post("", response_model=UtilityResponse, status_code=status.HTTP_201_CREATED)
async def create_utility(
    utility_data: UtilityCreate,
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Create a new utility
    Requires admin role
    """
    new_utility = Utility(
        name=utility_data.name,
        description=utility_data.description,
        status=utility_data.status,
    )
    
    db.add(new_utility)
    db.commit()
    db.refresh(new_utility)
    
    return _build_utility_response(new_utility)


@utilities_router.put("/{utility_id}", response_model=UtilityResponse)
async def update_utility(
    utility_id: str,
    utility_data: UtilityUpdate,
    current_user: CurrentUser = Depends(require_utility_manager),
    db: Session = Depends(get_db),
):
    """
    Update utility details
    Requires admin role
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user)
    update_data = utility_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(utility, field, value)
    
    db.commit()
    db.refresh(utility)
    
    return _build_utility_response(utility)


@utilities_router.patch("/{utility_id}", response_model=UtilityResponse)
async def patch_utility(
    utility_id: str,
    utility_data: UtilityUpdate,
    current_user: CurrentUser = Depends(require_utility_manager),
    db: Session = Depends(get_db),
):
    """
    Partially update utility
    Requires admin role
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user)
    update_data = utility_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(utility, field, value)
    
    db.commit()
    db.refresh(utility)
    
    return _build_utility_response(utility)


@utilities_router.delete("/{utility_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_utility(
    utility_id: str,
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """
    Delete utility by ID
    Requires admin role
    """
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )
    
    db.delete(utility)
    db.commit()


@utilities_router.post("/{utility_id}/pipe-network", response_model=UtilityResponse, status_code=status.HTTP_201_CREATED)
async def upload_pipe_network(
    utility_id: str,
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(require_utility_manager),
    db: Session = Depends(get_db),
):
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user)

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded pipe network file must have a filename",
        )

    extension = Path(file.filename).suffix.lower()
    if extension not in ALLOWED_PIPE_NETWORK_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported pipe network file type",
        )

    file_data = await file.read()
    if not file_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded pipe network file is empty",
        )

    if len(file_data) > MAX_PIPE_NETWORK_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pipe network file is too large",
        )

    pipe_network = db.query(UtilityPipeNetwork).filter(UtilityPipeNetwork.utility_id == utility.id).first()
    if not pipe_network:
        pipe_network = UtilityPipeNetwork(
            utility_id=utility.id,
        )
        db.add(pipe_network)

    pipe_network.file_data = file_data
    pipe_network.file_name = file.filename
    pipe_network.mime_type = file.content_type or "application/octet-stream"
    pipe_network.file_size = len(file_data)
    pipe_network.uploaded_by_manager_id = current_user.id if current_user.user_type == "utility_manager" else None

    db.commit()
    db.refresh(utility)
    return _build_utility_response(utility)


@utilities_router.get("/{utility_id}/pipe-network/download")
async def download_pipe_network(
    utility_id: str,
    current_user: CurrentUser = Depends(require_utility_manager),
    db: Session = Depends(get_db),
):
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user)

    pipe_network = db.query(UtilityPipeNetwork).filter(UtilityPipeNetwork.utility_id == utility.id).first()
    if not pipe_network:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pipe network file not found",
        )

    headers = {
        "Content-Disposition": f'attachment; filename="{pipe_network.file_name}"',
    }
    return Response(content=pipe_network.file_data, media_type=pipe_network.mime_type, headers=headers)


@utilities_router.get("/{utility_id}/pipe-network/geojson")
async def preview_pipe_network_geojson(
    utility_id: str,
    current_user: CurrentUser = Depends(require_utility_manager),
    db: Session = Depends(get_db),
):
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user)

    pipe_network = db.query(UtilityPipeNetwork).filter(UtilityPipeNetwork.utility_id == utility.id).first()
    if not pipe_network:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pipe network file not found",
        )

    return _load_pipe_network_geojson(pipe_network)


@utilities_router.delete("/{utility_id}/pipe-network", response_model=UtilityResponse)
async def delete_pipe_network(
    utility_id: str,
    current_user: CurrentUser = Depends(require_utility_manager),
    db: Session = Depends(get_db),
):
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user)

    pipe_network = db.query(UtilityPipeNetwork).filter(UtilityPipeNetwork.utility_id == utility.id).first()
    if not pipe_network:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pipe network file not found",
        )

    db.delete(pipe_network)
    db.commit()
    db.refresh(utility)
    return _build_utility_response(utility)
