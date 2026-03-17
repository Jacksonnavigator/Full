/**
 * HydraNet Geospatial Service
 * Handles location-based routing of reports to correct DMA
 * Uses point-in-polygon logic to determine jurisdiction
 */

import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from './firebase';
import { WaterUtility, DMA } from './types';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Determine which Utility a location belongs to
 */
export async function findUtilityByLocation(point: GeoPoint): Promise<WaterUtility | null> {
  try {
    const q = query(collection(db, 'utilities'), where('isActive', '==', true));
    const snapshot = await getDocs(q);

    for (const doc of snapshot.docs) {
      const utility = doc.data() as WaterUtility;
      if (isPointInPolygon(point, utility.geoBoundary.coordinates[0])) {
        return utility;
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding utility by location:', error);
    throw error;
  }
}

/**
 * Determine which DMA a location belongs to (within a utility)
 */
export async function findDMAByLocation(point: GeoPoint, utilityId: string): Promise<DMA | null> {
  try {
    const q = query(
      collection(db, 'dmas'),
      where('utilityId', '==', utilityId),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);

    for (const doc of snapshot.docs) {
      const dma = doc.data() as DMA;
      if (isPointInPolygon(point, dma.geoBoundary.coordinates[0])) {
        return dma;
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding DMA by location:', error);
    throw error;
  }
}

/**
 * Ray Casting Algorithm - Determine if a point is inside a polygon
 * Uses GeoJSON coordinate format [longitude, latitude]
 */
export function isPointInPolygon(point: GeoPoint, polygonCoordinates: number[][]): boolean {
  const { latitude, longitude } = point;
  let isInside = false;

  for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
    const xi = polygonCoordinates[i][0];
    const yi = polygonCoordinates[i][1];
    const xj = polygonCoordinates[j][0];
    const yj = polygonCoordinates[j][1];

    const intersect = yi > latitude !== yj > latitude && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi;

    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
}

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
export function calculateDistanceMeters(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.latitude)) *
      Math.cos(toRad(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Get rough DMA coverage area in square kilometers
 */
export function calculatePolygonArea(coordinates: number[][]): number {
  // Shoelace formula for polygon area in degrees, then convert to approximate km²
  let area = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];
    area += (lon2 - lon1) * (lat2 + lat1);
  }
  area = Math.abs(area / 2);

  // Approximate conversion to km² (varies by latitude)
  const metersPerDegreeLat = 111000;
  const metersPerDegreeLon = 111000 * Math.cos(((coordinates[0][1] + coordinates[1][1]) / 2) * (Math.PI / 180));

  return (area * metersPerDegreeLat * metersPerDegreeLon) / 1000000;
}

/**
 * Get center point of a polygon (centroid)
 */
export function getPolygonCentroid(coordinates: number[][]): GeoPoint {
  let latitude = 0;
  let longitude = 0;

  for (const [lon, lat] of coordinates) {
    longitude += lon;
    latitude += lat;
  }

  return {
    longitude: longitude / coordinates.length,
    latitude: latitude / coordinates.length,
  };
}

/**
 * Validate if a GeoJSON polygon is valid
 */
export function isValidPolygon(coordinates: number[][]): boolean {
  if (coordinates.length < 4) return false; // At least 3 points + closing point

  // Check if first and last point are the same (closed polygon)
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  return first[0] === last[0] && first[1] === last[1];
}

/**
 * Calculate DMA coverage for analytics
 */
export interface DMACoverage {
  dmaId: string;
  dmaName: string;
  utilityId: string;
  areaSqKm: number;
  population?: number;
  centroid: GeoPoint;
}

export async function calculateDMACoverages(utilityId: string): Promise<DMACoverage[]> {
  try {
    const q = query(collection(db, 'dmas'), where('utilityId', '==', utilityId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const dma = doc.data() as DMA;
      const coordinates = dma.geoBoundary.coordinates[0];
      return {
        dmaId: dma.id,
        dmaName: dma.name,
        utilityId: dma.utilityId,
        areaSqKm: calculatePolygonArea(coordinates),
        centroid: getPolygonCentroid(coordinates),
      };
    });
  } catch (error) {
    console.error('Error calculating DMA coverages:', error);
    throw error;
  }
}
