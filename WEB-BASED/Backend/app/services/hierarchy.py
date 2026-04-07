"""
Hierarchy helpers for the simplified operational model.

The live hierarchy is:
    Admin -> Utility -> DMA -> Team -> Engineer
"""

from __future__ import annotations

import math
from typing import Optional, Tuple

from sqlalchemy.orm import Session

from app.models import DMA, EntityStatusEnum


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


def find_nearest_dma(latitude: float, longitude: float, db: Session) -> Tuple[Optional[DMA], float]:
    """
    Find the nearest active DMA to the given coordinates.

    If no DMA has coordinates, fall back to the first active DMA so public
    report creation remains operational.
    """
    dmas = db.query(DMA).filter(DMA.status == EntityStatusEnum.ACTIVE).all()
    if not dmas:
        return None, float("inf")

    dmas_with_coords = [dma for dma in dmas if dma.center_latitude is not None and dma.center_longitude is not None]
    if dmas_with_coords:
        min_distance = float("inf")
        nearest_dma: Optional[DMA] = None
        for dma in dmas_with_coords:
            distance = haversine_distance(
                latitude,
                longitude,
                dma.center_latitude,
                dma.center_longitude,
            )
            if distance < min_distance:
                min_distance = distance
                nearest_dma = dma
        if nearest_dma:
            return nearest_dma, min_distance

    return dmas[0], 0.0
