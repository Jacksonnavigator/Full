"""
Utility Routes
CRUD operations for utilities
"""

import csv
import io
import json
from pathlib import Path
from typing import Any, List, Optional
import xml.etree.ElementTree as ET
import zipfile
from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Utility, UtilityPipeNetwork, DMA
from app.schemas.user import (
    UtilityCreate,
    UtilityUpdate,
    UtilityResponse,
    UtilityListResponse,
    UtilityPublicContactResponse,
)
from app.security.dependencies import get_current_user, require_admin, require_utility_manager, CurrentUser
from app.services.hierarchy import (
    find_nearest_dma_within_utility,
    find_nearest_utility,
    find_utility_by_region_name,
    resolve_region_name_hint,
)

utilities_router = APIRouter(prefix="/api/utilities", tags=["utilities"])

MAX_PIPE_NETWORK_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_PIPE_NETWORK_EXTENSIONS = {
    ".geojson",
    ".json",
    ".kml",
    ".kmz",
    ".zip",
    ".csv",
    ".txt",
}


def _resolve_current_user_utility_id(current_user: CurrentUser, db: Session) -> Optional[str]:
    if current_user.user_type == "utility_manager":
        return current_user.utility_id

    if current_user.user_type in {"dma_manager", "engineer"} and current_user.dma_id:
        dma = db.query(DMA).filter(DMA.id == current_user.dma_id).first()
        return dma.utility_id if dma else None

    return None


def _ensure_utility_access(utility: Utility, current_user: CurrentUser, db: Session) -> None:
    if current_user.user_type == "user":
        return

    if _resolve_current_user_utility_id(current_user, db) == utility.id:
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
        region_name=utility.region_name,
        description=utility.description,
        contact_phone=utility.contact_phone,
        contact_email=utility.contact_email,
        contact_address=utility.contact_address,
        center_latitude=utility.center_latitude,
        center_longitude=utility.center_longitude,
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


@utilities_router.get("/public/resolve", response_model=UtilityPublicContactResponse)
async def resolve_public_utility_for_location(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    db: Session = Depends(get_db),
):
    """
    Resolve the responsible utility for a public mobile user based on location.
    """
    resolved_region_name = resolve_region_name_hint(None, latitude, longitude)
    utility = find_utility_by_region_name(resolved_region_name, db) if resolved_region_name else None
    if not utility:
        utility, _distance = find_nearest_utility(latitude, longitude, db)
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No utility coverage is configured for this location",
        )

    dma, _dma_distance = find_nearest_dma_within_utility(latitude, longitude, utility, db)

    return UtilityPublicContactResponse(
        utility_id=utility.id,
        utility_name=utility.name,
        region_name=resolved_region_name or utility.region_name,
        dma_id=dma.id if dma else None,
        dma_name=dma.name if dma else None,
        contact_phone=utility.contact_phone,
        contact_email=utility.contact_email,
        contact_address=utility.contact_address,
    )


def _coerce_geojson(payload: Any):
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
        detail="Pipe network file could not be converted into previewable map features.",
    )


def _decode_text_bytes(data: bytes) -> str:
    for encoding in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Pipe network text file could not be decoded.",
    )


def _parse_coordinate_sequence(raw: str) -> list[list[float]]:
    coordinates: list[list[float]] = []
    for chunk in raw.replace("\n", " ").split():
        parts = [part for part in chunk.split(",") if part]
        if len(parts) < 2:
            continue
        try:
            coordinates.append([float(parts[0]), float(parts[1])])
        except ValueError:
            continue
    return coordinates


def _strip_namespace(tag: str) -> str:
    return tag.split("}", 1)[-1] if "}" in tag else tag


def _parse_kml_features(root: ET.Element) -> dict[str, Any]:
    features: list[dict[str, Any]] = []

    for placemark in root.iter():
        if _strip_namespace(placemark.tag) != "Placemark":
            continue

        properties: dict[str, Any] = {}
        name_node = next((child for child in placemark.iter() if _strip_namespace(child.tag) == "name"), None)
        if name_node is not None and name_node.text:
            properties["name"] = name_node.text.strip()

        for node in placemark.iter():
            tag = _strip_namespace(node.tag)
            if tag not in {"Point", "LineString", "Polygon"}:
                continue

            coord_node = next((child for child in node.iter() if _strip_namespace(child.tag) == "coordinates"), None)
            if coord_node is None or not coord_node.text:
                continue

            coordinates = _parse_coordinate_sequence(coord_node.text)
            if not coordinates:
                continue

            geometry: Optional[dict[str, Any]] = None
            if tag == "Point":
                geometry = {"type": "Point", "coordinates": coordinates[0]}
            elif tag == "LineString":
                geometry = {"type": "LineString", "coordinates": coordinates}
            elif tag == "Polygon":
                geometry = {"type": "Polygon", "coordinates": [coordinates]}

            if geometry:
                features.append({
                    "type": "Feature",
                    "properties": properties.copy(),
                    "geometry": geometry,
                })

    return {"type": "FeatureCollection", "features": features}


def _merge_feature_collections(collections: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "type": "FeatureCollection",
        "features": [
            feature
            for collection in collections
            for feature in collection.get("features", [])
            if isinstance(feature, dict)
        ],
    }


def _tag_feature_collection_source(collection: dict[str, Any], source_name: str) -> dict[str, Any]:
    tagged_features: list[dict[str, Any]] = []
    for feature in collection.get("features", []):
        if not isinstance(feature, dict):
            continue
        properties = feature.get("properties")
        if not isinstance(properties, dict):
            properties = {}
        tagged_features.append({
            **feature,
            "properties": {
                **properties,
                "source_file": source_name,
            },
        })

    return {
        **collection,
        "features": tagged_features,
    }


def _load_kml_geojson(data: bytes) -> dict[str, Any]:
    try:
        root = ET.fromstring(_decode_text_bytes(data))
    except ET.ParseError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipe network KML file could not be parsed.",
        ) from exc

    feature_collection = _parse_kml_features(root)
    if feature_collection["features"]:
        return feature_collection

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Pipe network KML file did not contain previewable geometry.",
    )


def _split_wkt_groups(raw: str) -> list[str]:
    groups: list[str] = []
    depth = 0
    start: Optional[int] = None

    for index, character in enumerate(raw):
        if character == "(":
            depth += 1
            if depth == 1:
                start = index + 1
        elif character == ")":
            if depth == 1 and start is not None:
                groups.append(raw[start:index])
                start = None
            depth -= 1

    return groups


def _parse_wkt_coordinate_list(raw: str) -> list[list[float]]:
    coordinates: list[list[float]] = []
    for point_text in raw.split(","):
        parts = [part for part in point_text.strip().split() if part]
        if len(parts) < 2:
            continue
        try:
            coordinates.append([float(parts[0]), float(parts[1])])
        except ValueError:
            continue
    return coordinates


def _parse_wkt_geometry(raw: str) -> Optional[dict[str, Any]]:
    text = raw.strip()
    if not text:
        return None

    geometry_type, _, remainder = text.partition("(")
    normalized_type = geometry_type.strip().upper()
    if not remainder:
        return None

    body = text[len(geometry_type):].strip()
    while body.startswith("(") and body.endswith(")"):
        inner = body[1:-1].strip()
        if not inner:
            break
        body = inner
        if normalized_type in {"POINT", "LINESTRING"}:
            break

    if normalized_type == "POINT":
        coordinates = _parse_wkt_coordinate_list(body)
        return {"type": "Point", "coordinates": coordinates[0]} if coordinates else None

    if normalized_type == "LINESTRING":
        coordinates = _parse_wkt_coordinate_list(body)
        return {"type": "LineString", "coordinates": coordinates} if coordinates else None

    if normalized_type == "POLYGON":
        rings = [_parse_wkt_coordinate_list(group) for group in _split_wkt_groups(f"({body})")]
        rings = [ring for ring in rings if ring]
        return {"type": "Polygon", "coordinates": rings} if rings else None

    if normalized_type == "MULTILINESTRING":
        lines = [_parse_wkt_coordinate_list(group) for group in _split_wkt_groups(f"({body})")]
        lines = [line for line in lines if line]
        return {"type": "MultiLineString", "coordinates": lines} if lines else None

    if normalized_type == "MULTIPOLYGON":
        polygons: list[list[list[float]]] = []
        for polygon_group in _split_wkt_groups(f"({body})"):
            rings = [_parse_wkt_coordinate_list(group) for group in _split_wkt_groups(f"({polygon_group})")]
            rings = [ring for ring in rings if ring]
            if rings:
                polygons.append(rings)
        return {"type": "MultiPolygon", "coordinates": polygons} if polygons else None

    return None


def _load_delimited_geojson(data: bytes) -> dict[str, Any]:
    text = _decode_text_bytes(data)
    reader = csv.DictReader(io.StringIO(text))
    if not reader.fieldnames:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipe network table file needs column headers for preview.",
        )

    headers = {header.lower().strip(): header for header in reader.fieldnames if header}
    geometry_header = next((headers[key] for key in ("wkt", "geometry", "geom", "the_geom", "shape") if key in headers), None)
    lon_header = next((headers[key] for key in ("longitude", "lon", "lng", "x") if key in headers), None)
    lat_header = next((headers[key] for key in ("latitude", "lat", "y") if key in headers), None)
    start_lon_header = next((headers[key] for key in ("start_lon", "from_lon", "x1") if key in headers), None)
    start_lat_header = next((headers[key] for key in ("start_lat", "from_lat", "y1") if key in headers), None)
    end_lon_header = next((headers[key] for key in ("end_lon", "to_lon", "x2") if key in headers), None)
    end_lat_header = next((headers[key] for key in ("end_lat", "to_lat", "y2") if key in headers), None)

    features: list[dict[str, Any]] = []
    for row in reader:
        geometry: Optional[dict[str, Any]] = None

        if geometry_header and row.get(geometry_header):
            geometry = _parse_wkt_geometry(row[geometry_header] or "")
        elif lon_header and lat_header and row.get(lon_header) and row.get(lat_header):
            try:
                geometry = {
                    "type": "Point",
                    "coordinates": [float(row[lon_header]), float(row[lat_header])],
                }
            except ValueError:
                geometry = None
        elif all((start_lon_header, start_lat_header, end_lon_header, end_lat_header)):
            try:
                geometry = {
                    "type": "LineString",
                    "coordinates": [
                        [float(row[start_lon_header]), float(row[start_lat_header])],
                        [float(row[end_lon_header]), float(row[end_lat_header])],
                    ],
                }
            except (TypeError, ValueError):
                geometry = None

        if not geometry:
            continue

        properties = {
            key: value
            for key, value in row.items()
            if value not in (None, "") and key not in {geometry_header, lon_header, lat_header, start_lon_header, start_lat_header, end_lon_header, end_lat_header}
        }
        features.append({
            "type": "Feature",
            "properties": properties,
            "geometry": geometry,
        })

    if not features:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipe network table file did not contain previewable geometry columns.",
        )

    return {"type": "FeatureCollection", "features": features}


def _load_plain_text_geojson(data: bytes) -> dict[str, Any]:
    text = _decode_text_bytes(data).strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipe network text file is empty.",
        )

    try:
        return _coerce_geojson(json.loads(text))
    except Exception:
        pass

    geometry = _parse_wkt_geometry(text)
    if geometry:
        return {"type": "FeatureCollection", "features": [{"type": "Feature", "properties": {}, "geometry": geometry}]}

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    coordinates: list[list[float]] = []
    for line in lines:
        parts = [part.strip() for part in line.split(",")]
        if len(parts) < 2:
            continue
        try:
            coordinates.append([float(parts[0]), float(parts[1])])
        except ValueError:
            continue

    if len(coordinates) >= 2:
        return {
            "type": "FeatureCollection",
            "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "LineString", "coordinates": coordinates}}],
        }
    if len(coordinates) == 1:
        return {
            "type": "FeatureCollection",
            "features": [{"type": "Feature", "properties": {}, "geometry": {"type": "Point", "coordinates": coordinates[0]}}],
        }

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Pipe network text file could not be converted into map geometry.",
    )


def _load_zip_geojson(data: bytes, allow_kml: bool = True) -> dict[str, Any]:
    try:
        archive = zipfile.ZipFile(io.BytesIO(data))
    except zipfile.BadZipFile as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipe network archive could not be opened.",
        ) from exc

    supported_extensions = [".geojson", ".json", ".kml", ".csv", ".txt"] if allow_kml else [".geojson", ".json", ".csv", ".txt"]
    collections: list[dict[str, Any]] = []
    for name in archive.namelist():
        if name.endswith("/"):
            continue
        extension = Path(name).suffix.lower()
        if extension not in supported_extensions:
            continue
        with archive.open(name) as member:
            member_bytes = member.read()
        try:
            if extension in {".geojson", ".json"}:
                collections.append(
                    _tag_feature_collection_source(
                        _coerce_geojson(json.loads(_decode_text_bytes(member_bytes))),
                        name,
                    )
                )
            elif extension == ".kml":
                collections.append(_tag_feature_collection_source(_load_kml_geojson(member_bytes), name))
            elif extension == ".csv":
                collections.append(_tag_feature_collection_source(_load_delimited_geojson(member_bytes), name))
            elif extension == ".txt":
                collections.append(_tag_feature_collection_source(_load_plain_text_geojson(member_bytes), name))
        except HTTPException:
            continue

    merged = _merge_feature_collections(collections)
    if merged["features"]:
        return merged

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Pipe network archive did not contain any supported previewable geometry.",
    )


def _load_pipe_network_geojson(pipe_network: UtilityPipeNetwork):
    extension = Path(pipe_network.file_name).suffix.lower()
    try:
        if extension in {".geojson", ".json"}:
            return _coerce_geojson(json.loads(_decode_text_bytes(pipe_network.file_data)))
        if extension == ".kml":
            return _load_kml_geojson(pipe_network.file_data)
        if extension == ".kmz":
            return _load_zip_geojson(pipe_network.file_data, allow_kml=True)
        if extension == ".zip":
            return _load_zip_geojson(pipe_network.file_data, allow_kml=True)
        if extension == ".csv":
            return _load_delimited_geojson(pipe_network.file_data)
        if extension == ".txt":
            return _load_plain_text_geojson(pipe_network.file_data)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Pipe network file could not be parsed for map preview.",
        ) from exc

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Pipe network file type is not previewable on the map.",
    )


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
    elif current_user.user_type in {"dma_manager", "engineer"}:
        scoped_utility_id = _resolve_current_user_utility_id(current_user, db)
        if scoped_utility_id:
            query = query.filter(Utility.id == scoped_utility_id)
        else:
            query = query.filter(Utility.id == "__no_access__")

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

    _ensure_utility_access(utility, current_user, db)
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
        region_name=utility_data.region_name,
        description=utility_data.description,
        contact_phone=utility_data.contact_phone,
        contact_email=utility_data.contact_email,
        contact_address=utility_data.contact_address,
        center_latitude=utility_data.center_latitude,
        center_longitude=utility_data.center_longitude,
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

    _ensure_utility_access(utility, current_user, db)
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

    _ensure_utility_access(utility, current_user, db)
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

    _ensure_utility_access(utility, current_user, db)

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
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user, db)

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
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    utility = db.query(Utility).filter(Utility.id == utility_id).first()
    if not utility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utility not found",
        )

    _ensure_utility_access(utility, current_user, db)

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

    _ensure_utility_access(utility, current_user, db)

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
