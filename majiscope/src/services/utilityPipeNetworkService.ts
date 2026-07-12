import { apiGet } from './apiClient';

type GeoJsonGeometry =
  | {
      type: 'Point';
      coordinates: [number, number];
    }
  | {
      type: 'MultiPoint';
      coordinates: [number, number][];
    }
  | {
      type: 'LineString';
      coordinates: [number, number][];
    }
  | {
      type: 'MultiLineString';
      coordinates: [number, number][][];
    }
  | {
      type: 'Polygon';
      coordinates: [number, number][][];
    }
  | {
      type: 'MultiPolygon';
      coordinates: [number, number][][][];
    }
  | {
      type: 'GeometryCollection';
      geometries: GeoJsonGeometry[];
    };

type GeoJsonFeature = {
  type: 'Feature';
  geometry: GeoJsonGeometry | null;
  properties?: Record<string, unknown>;
};

type GeoJsonFeatureCollection = {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
};

export type UtilityPipeNetworkPreview = GeoJsonFeatureCollection;

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type UtilityPipeNetworkOverlay = {
  lines: MapCoordinate[][];
  polygons: MapCoordinate[][];
  points: MapCoordinate[];
  bounds: MapCoordinate[];
};

const toMapCoordinate = (coordinate: [number, number]): MapCoordinate => ({
  latitude: coordinate[1],
  longitude: coordinate[0],
});

const collectOverlayGeometry = (
  geometry: GeoJsonGeometry | null | undefined,
  overlay: UtilityPipeNetworkOverlay
) => {
  if (!geometry) return;

  switch (geometry.type) {
    case 'Point': {
      const point = toMapCoordinate(geometry.coordinates);
      overlay.points.push(point);
      overlay.bounds.push(point);
      return;
    }
    case 'MultiPoint': {
      geometry.coordinates.forEach((coordinate) => {
        const point = toMapCoordinate(coordinate);
        overlay.points.push(point);
        overlay.bounds.push(point);
      });
      return;
    }
    case 'LineString': {
      const line = geometry.coordinates.map(toMapCoordinate);
      if (line.length > 0) {
        overlay.lines.push(line);
        overlay.bounds.push(...line);
      }
      return;
    }
    case 'MultiLineString': {
      geometry.coordinates.forEach((segment) => {
        const line = segment.map(toMapCoordinate);
        if (line.length > 0) {
          overlay.lines.push(line);
          overlay.bounds.push(...line);
        }
      });
      return;
    }
    case 'Polygon': {
      geometry.coordinates.forEach((ring) => {
        const polygon = ring.map(toMapCoordinate);
        if (polygon.length > 0) {
          overlay.polygons.push(polygon);
          overlay.bounds.push(...polygon);
        }
      });
      return;
    }
    case 'MultiPolygon': {
      geometry.coordinates.forEach((polygonGroup) => {
        polygonGroup.forEach((ring) => {
          const polygon = ring.map(toMapCoordinate);
          if (polygon.length > 0) {
            overlay.polygons.push(polygon);
            overlay.bounds.push(...polygon);
          }
        });
      });
      return;
    }
    case 'GeometryCollection': {
      geometry.geometries.forEach((item) => collectOverlayGeometry(item, overlay));
      return;
    }
  }
};

export const toUtilityPipeNetworkOverlay = (
  preview: UtilityPipeNetworkPreview | null
): UtilityPipeNetworkOverlay => {
  const overlay: UtilityPipeNetworkOverlay = {
    lines: [],
    polygons: [],
    points: [],
    bounds: [],
  };

  if (!preview) {
    return overlay;
  }

  preview.features.forEach((feature) => collectOverlayGeometry(feature.geometry, overlay));
  return overlay;
};

export async function fetchUtilityPipeNetworkPreview(
  utilityId: string
): Promise<UtilityPipeNetworkPreview | null> {
  try {
    return await apiGet<UtilityPipeNetworkPreview>(`/api/utilities/${utilityId}/pipe-network/geojson`);
  } catch (error: any) {
    const message = String(error?.message || '');
    if (
      message.includes('404') ||
      message.toLowerCase().includes('not found') ||
      message.includes('422') ||
      message.toLowerCase().includes('previewable geometry') ||
      message.toLowerCase().includes('pipe network')
    ) {
      return null;
    }
    throw error;
  }
}
