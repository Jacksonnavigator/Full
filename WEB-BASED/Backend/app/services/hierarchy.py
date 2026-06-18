"""
Hierarchy helpers for the simplified operational model.

The live hierarchy is:
    Admin -> Utility -> DMA -> Team -> Engineer
"""

from __future__ import annotations

import json
import math
import re
from typing import Optional, Tuple

from sqlalchemy.orm import Session
from shapely.geometry import Point, shape
from shapely.geometry.base import BaseGeometry
from shapely.errors import GEOSException

from app.models import DMA, Utility, EntityStatusEnum

TANZANIA_LATITUDE_RANGE = (-12.5, -0.5)
TANZANIA_LONGITUDE_RANGE = (29.0, 40.8)
TANZANIA_REGION_CENTERS = (
    ("Arusha", -3.3869, 36.6830),
    ("Dar es Salaam", -6.7924, 39.2083),
    ("Dodoma", -6.1630, 35.7516),
    ("Geita", -2.8725, 32.2325),
    ("Iringa", -7.7700, 35.6900),
    ("Kagera", -1.3317, 31.8122),
    ("Katavi", -6.3677, 31.0419),
    ("Kigoma", -4.8769, 29.6267),
    ("Kilimanjaro", -3.3349, 37.3404),
    ("Lindi", -9.9971, 39.7165),
    ("Manyara", -4.3150, 36.8540),
    ("Mara", -1.4996, 33.8020),
    ("Mbeya", -8.9094, 33.4608),
    ("Morogoro", -6.8235, 37.6611),
    ("Mtwara", -10.2696, 40.1836),
    ("Mwanza", -2.5164, 32.9175),
    ("Njombe", -9.3497, 34.7703),
    ("Pemba North", -5.0559, 39.7294),
    ("Pemba South", -5.2459, 39.7660),
    ("Pwani", -6.7667, 38.9167),
    ("Rukwa", -7.0345, 31.4453),
    ("Ruvuma", -10.6830, 35.6500),
    ("Shinyanga", -3.6619, 33.4212),
    ("Simiyu", -2.8309, 34.1532),
    ("Singida", -4.8163, 34.7436),
    ("Songwe", -9.1050, 32.9349),
    ("Tabora", -5.0162, 32.8266),
    ("Tanga", -5.0689, 39.0988),
    ("Unguja North", -5.7282, 39.2982),
    ("Unguja South", -6.1630, 39.1979),
)

UTILITY_MATCH_MAX_DISTANCE_KM = 180.0
DMA_MATCH_MAX_DISTANCE_KM = 60.0


def normalize_geo_label(value: Optional[str]) -> Optional[str]:
    cleaned = re.sub(r"[^a-z0-9]+", " ", (value or "").strip().lower()).strip()
    if not cleaned:
        return None
    for suffix in (" region", " district", " city", " municipal council", " municipality", " dma"):
        if cleaned.endswith(suffix):
            cleaned = cleaned[: -len(suffix)].strip()
    return cleaned or None


def _is_inside_tanzania_bounds(latitude: float, longitude: float) -> bool:
    return TANZANIA_LATITUDE_RANGE[0] <= latitude <= TANZANIA_LATITUDE_RANGE[1] and TANZANIA_LONGITUDE_RANGE[0] <= longitude <= TANZANIA_LONGITUDE_RANGE[1]


def canonicalize_tanzania_region_name(region_name: Optional[str]) -> Optional[str]:
    normalized_region = normalize_geo_label(region_name)
    if not normalized_region:
        return None

    scored_matches: list[tuple[int, str]] = []
    for region, _latitude, _longitude in TANZANIA_REGION_CENTERS:
        normalized_reference = normalize_geo_label(region)
        if not normalized_reference:
            continue
        if normalized_region == normalized_reference:
            return region
        if normalized_region in normalized_reference or normalized_reference in normalized_region:
            score = abs(len(normalized_region) - len(normalized_reference))
            scored_matches.append((score, region))

    if scored_matches:
        scored_matches.sort(key=lambda item: item[0])
        return scored_matches[0][1]
    return None


def infer_tanzania_region_from_coordinates(latitude: float, longitude: float) -> Tuple[Optional[str], float]:
    """
    Infer the nearest Tanzania region name for raw coordinates.

    This is a pragmatic fallback for mobile submissions that only provide bare
    coordinates. It is not a true polygon lookup, but it gives the backend a
    stable region hint before utility matching.
    """
    if not _is_inside_tanzania_bounds(latitude, longitude):
        return None, float("inf")

    nearest_region: Optional[str] = None
    min_distance = float("inf")
    for region_name, region_latitude, region_longitude in TANZANIA_REGION_CENTERS:
        distance = haversine_distance(latitude, longitude, region_latitude, region_longitude)
        if distance < min_distance:
            min_distance = distance
            nearest_region = region_name

    return nearest_region, min_distance


def resolve_region_name_hint(
    region_name: Optional[str],
    latitude: Optional[float],
    longitude: Optional[float],
) -> Optional[str]:
    canonical_region = canonicalize_tanzania_region_name(region_name)
    if canonical_region:
        return canonical_region

    if latitude is None or longitude is None:
        return region_name.strip() if region_name else None

    inferred_region, _distance = infer_tanzania_region_from_coordinates(latitude, longitude)
    if inferred_region:
        return inferred_region

    return region_name.strip() if region_name else None


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Return the distance between two coordinates in kilometers."""
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    return 6371 * c


def _load_boundary_shape(raw_boundary: Optional[str]) -> Optional[BaseGeometry]:
    if not raw_boundary:
        return None

    try:
        boundary_geojson = json.loads(raw_boundary)
        boundary_shape = shape(boundary_geojson)
    except (TypeError, ValueError, GEOSException):
        return None

    if boundary_shape.is_empty or not boundary_shape.is_valid:
        return None

    return boundary_shape


def _boundary_match_score(boundary_shape: BaseGeometry) -> float:
    """
    Prefer the smallest containing polygon when boundaries overlap.

    GeoJSON is stored in WGS84 degrees, so area is not a true square-meter
    measure, but it is stable enough for choosing the more specific polygon.
    """
    return float(boundary_shape.area)


def find_utility_by_boundary(latitude: float, longitude: float, db: Session) -> Optional[Utility]:
    report_point = Point(longitude, latitude)
    matches: list[tuple[float, Utility]] = []

    utilities = db.query(Utility).filter(Utility.status == EntityStatusEnum.ACTIVE).all()
    for utility in utilities:
        boundary_shape = _load_boundary_shape(getattr(utility, "boundary_geojson", None))
        if not boundary_shape:
            continue
        if boundary_shape.covers(report_point):
            matches.append((_boundary_match_score(boundary_shape), utility))

    if not matches:
        return None

    matches.sort(key=lambda item: item[0])
    return matches[0][1]


def has_complete_active_utility_boundaries(db: Session) -> bool:
    utilities = db.query(Utility).filter(Utility.status == EntityStatusEnum.ACTIVE).all()
    if not utilities:
        return False
    return all(_load_boundary_shape(getattr(utility, "boundary_geojson", None)) for utility in utilities)


def find_dma_within_utility_by_boundary(
    latitude: float,
    longitude: float,
    utility: Optional[Utility],
    db: Session,
) -> Optional[DMA]:
    if not utility:
        return None

    report_point = Point(longitude, latitude)
    matches: list[tuple[float, DMA]] = []

    dmas = (
        db.query(DMA)
        .filter(DMA.utility_id == utility.id, DMA.status == EntityStatusEnum.ACTIVE)
        .all()
    )
    for dma in dmas:
        boundary_shape = _load_boundary_shape(getattr(dma, "boundary_geojson", None))
        if not boundary_shape:
            continue
        if boundary_shape.covers(report_point):
            matches.append((_boundary_match_score(boundary_shape), dma))

    if not matches:
        return None

    matches.sort(key=lambda item: item[0])
    return matches[0][1]


def has_complete_active_dma_boundaries_within_utility(utility: Optional[Utility], db: Session) -> bool:
    if not utility:
        return False

    dmas = (
        db.query(DMA)
        .filter(DMA.utility_id == utility.id, DMA.status == EntityStatusEnum.ACTIVE)
        .all()
    )
    if not dmas:
        return False
    return all(_load_boundary_shape(getattr(dma, "boundary_geojson", None)) for dma in dmas)


def _utility_anchor(utility: Utility) -> Tuple[Optional[float], Optional[float]]:
    """
    Return the best available center point for a utility.

    Prefer the utility's own center coordinates. If they are not configured,
    derive a rough anchor from the average of its DMA centers so older data can
    still resolve at the utility level.
    """
    if utility.center_latitude is not None and utility.center_longitude is not None:
        return utility.center_latitude, utility.center_longitude

    dmas = [
        dma
        for dma in (utility.dmas or [])
        if dma.status == EntityStatusEnum.ACTIVE and dma.center_latitude is not None and dma.center_longitude is not None
    ]
    if not dmas:
        return None, None

    latitude = sum(dma.center_latitude for dma in dmas) / len(dmas)
    longitude = sum(dma.center_longitude for dma in dmas) / len(dmas)
    return latitude, longitude


def find_nearest_utility(latitude: float, longitude: float, db: Session) -> Tuple[Optional[Utility], float]:
    """
    Find the nearest active utility (region authority) for the given coordinates.

    Returns no match when every utility anchor is too far away so reports can
    stay unassigned instead of being forced into the wrong region.
    """
    utilities = (
        db.query(Utility)
        .filter(Utility.status == EntityStatusEnum.ACTIVE)
        .all()
    )
    if not utilities:
        return None, float("inf")

    min_distance = float("inf")
    nearest_utility: Optional[Utility] = None
    for utility in utilities:
        anchor_latitude, anchor_longitude = _utility_anchor(utility)
        if anchor_latitude is None or anchor_longitude is None:
            continue

        distance = haversine_distance(latitude, longitude, anchor_latitude, anchor_longitude)
        if distance < min_distance:
            min_distance = distance
            nearest_utility = utility

    if nearest_utility and min_distance <= UTILITY_MATCH_MAX_DISTANCE_KM:
        return nearest_utility, min_distance

    return None, float("inf")


def find_utility_by_region_name(region_name: Optional[str], db: Session) -> Optional[Utility]:
    normalized_region = normalize_geo_label(canonicalize_tanzania_region_name(region_name) or region_name)
    if not normalized_region:
        return None

    utilities = db.query(Utility).filter(Utility.status == EntityStatusEnum.ACTIVE).all()
    scored_matches: list[tuple[int, Utility]] = []
    for utility in utilities:
        normalized_utility_region = normalize_geo_label(getattr(utility, "region_name", None))
        if not normalized_utility_region:
            continue
        if normalized_region == normalized_utility_region:
            return utility
        if normalized_region in normalized_utility_region or normalized_utility_region in normalized_region:
            score = abs(len(normalized_region) - len(normalized_utility_region))
            scored_matches.append((score, utility))

    if scored_matches:
        scored_matches.sort(key=lambda item: item[0])
        return scored_matches[0][1]
    return None


def find_nearest_dma_within_utility(
    latitude: float,
    longitude: float,
    utility: Optional[Utility],
    db: Session,
) -> Tuple[Optional[DMA], float]:
    """
    Find the nearest active DMA inside the given utility.

    Returns no match when:
    - no utility is resolved
    - the utility has no DMAs with configured centers
    - the nearest DMA is still too far away
    """
    if not utility:
        return None, float("inf")

    dmas = (
        db.query(DMA)
        .filter(DMA.utility_id == utility.id, DMA.status == EntityStatusEnum.ACTIVE)
        .all()
    )
    if not dmas:
        return None, float("inf")

    min_distance = float("inf")
    nearest_dma: Optional[DMA] = None
    for dma in dmas:
        if dma.center_latitude is None or dma.center_longitude is None:
            continue
        distance = haversine_distance(latitude, longitude, dma.center_latitude, dma.center_longitude)
        if distance < min_distance:
            min_distance = distance
            nearest_dma = dma

    if nearest_dma and min_distance <= DMA_MATCH_MAX_DISTANCE_KM:
        return nearest_dma, min_distance

    return None, float("inf")


def find_dma_within_utility_by_district_name(
    district_name: Optional[str],
    utility: Optional[Utility],
    db: Session,
) -> Optional[DMA]:
    normalized_district = normalize_geo_label(district_name)
    if not normalized_district or not utility:
        return None

    dmas = (
        db.query(DMA)
        .filter(DMA.utility_id == utility.id, DMA.status == EntityStatusEnum.ACTIVE)
        .all()
    )

    scored_matches: list[tuple[int, DMA]] = []
    for dma in dmas:
        normalized_dma_name = normalize_geo_label(dma.name)
        if not normalized_dma_name:
            continue
        if normalized_district == normalized_dma_name:
            return dma
        if normalized_district in normalized_dma_name or normalized_dma_name in normalized_district:
            score = abs(len(normalized_district) - len(normalized_dma_name))
            scored_matches.append((score, dma))

    if scored_matches:
        scored_matches.sort(key=lambda item: item[0])
        return scored_matches[0][1]
    return None


def find_nearest_dma(latitude: float, longitude: float, db: Session) -> Tuple[Optional[DMA], float]:
    """
    Backward-compatible DMA resolution helper.

    Utility is resolved first, then DMA inside that utility.
    """
    utility, _utility_distance = find_nearest_utility(latitude, longitude, db)
    return find_nearest_dma_within_utility(latitude, longitude, utility, db)
