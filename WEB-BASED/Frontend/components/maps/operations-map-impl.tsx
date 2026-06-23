"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet"
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import type { LatLngBoundsExpression } from "leaflet"
import * as L from "leaflet"
import { ChevronDown, CircleDot, Database, Gauge, Layers3, MapPinned, Route, SlidersHorizontal, Warehouse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import CONFIG from "@/lib/config"
import type {
  OperationsMapAggregateMarker,
  OperationsMapBoundaryOverlay,
  OperationsMapInfrastructureLayer,
  OperationsMapReport,
  OperationsMapViewState,
} from "./operations-map"

const DEFAULT_CENTER: [number, number] = [-6.369, 34.8888]
const NATIONAL_BOUNDARY_ZOOM = 8

const DMA_BOUNDARY_STYLE = {
  color: "#f04e23",
  fillColor: "#f97316",
} as const

const DEFAULT_BOUNDARY_STYLE = {
  utility: {
    color: "#0284c7",
    fillColor: "#0ea5e9",
  },
  dma: DMA_BOUNDARY_STYLE,
} as const

const INFRASTRUCTURE_SYMBOLS: Record<string, { svg: string }> = {
  valves: {
    svg: '<path d="M5 8.5h3.2l2.3 2.1 2.3-2.1H16v7h-3.2l-2.3-2.1-2.3 2.1H5v-7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10.5 6.2v3.6M8.5 6.2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
  water_sources: {
    svg: '<path d="M10.5 3.8c2.8 3.1 4.2 5.3 4.2 7.3a4.2 4.2 0 1 1-8.4 0c0-2 1.4-4.2 4.2-7.3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  },
  storage_facilities: {
    svg: '<path d="M5.5 7.2c0-1.2 2.2-2.2 5-2.2s5 1 5 2.2v7.6c0 1.2-2.2 2.2-5 2.2s-5-1-5-2.2V7.2Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M15.5 7.2c0 1.2-2.2 2.2-5 2.2s-5-1-5-2.2" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  },
  bulk_meters: {
    svg: '<path d="M5 13a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 12.8 13 9.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.2 15.6h6.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
}

const networkLayerCache = new Map<string, GeoJsonObject>()
const pendingNetworkLayerLoads = new Map<string, Promise<GeoJsonObject>>()

const BASEMAPS = {
  street: {
    label: "Street",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
} as const

type BasemapKey = keyof typeof BASEMAPS

type GeometryCoordinates =
  | [number, number]
  | number[]
  | GeometryCoordinates[]

async function loadNetworkLayer(url: string, token: string) {
  const cachedLayer = networkLayerCache.get(url)
  if (cachedLayer) return cachedLayer

  const pendingLoad = pendingNetworkLayerLoads.get(url)
  if (pendingLoad) return pendingLoad

  const loadPromise = fetch(`${CONFIG.backend.baseUrl}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.detail || payload?.error || "A utility pipe network preview could not be loaded.")
      }

      const layer = payload as GeoJsonObject
      networkLayerCache.set(url, layer)
      return layer
    })
    .finally(() => {
      pendingNetworkLayerLoads.delete(url)
    })

  pendingNetworkLayerLoads.set(url, loadPromise)
  return loadPromise
}

function flattenCoordinates(input: GeometryCoordinates | undefined, target: Array<[number, number]>) {
  if (!input) return
  if (
    Array.isArray(input) &&
    input.length >= 2 &&
    typeof input[0] === "number" &&
    typeof input[1] === "number"
  ) {
    target.push([Number(input[1]), Number(input[0])])
    return
  }

  if (Array.isArray(input)) {
    input.forEach((item) => flattenCoordinates(item as GeometryCoordinates, target))
  }
}

function collectGeoJsonCoordinates(geojson: GeoJsonObject | null): Array<[number, number]> {
  const points: Array<[number, number]> = []
  if (!geojson) return points

  const visitGeometry = (geometry: Geometry | null | undefined) => {
    if (!geometry) return
    if (geometry.type === "GeometryCollection" && Array.isArray(geometry.geometries)) {
      geometry.geometries.forEach(visitGeometry)
      return
    }
    if ("coordinates" in geometry) {
      flattenCoordinates(geometry.coordinates as GeometryCoordinates, points)
    }
  }

  if (geojson.type === "FeatureCollection") {
    ;(geojson as FeatureCollection).features.forEach((feature) => visitGeometry(feature?.geometry))
  } else if (geojson.type === "Feature") {
    visitGeometry((geojson as Feature).geometry)
  } else {
    visitGeometry(geojson as Geometry)
  }

  return points
}

function getStatusMeta(status: string) {
  if (status === "pending_approval") {
    return {
      label: "Awaiting approval",
      fill: "#7c3aed",
      stroke: "#5b21b6",
    }
  }

  if (status === "approved" || status === "closed") {
    return {
      label: status === "closed" ? "Closed" : "Repaired",
      fill: "#15803d",
      stroke: "#166534",
    }
  }

  return {
    label: "Open",
    fill: "#be123c",
    stroke: "#881337",
  }
}

function getLocationLabel(report: OperationsMapReport) {
  if (report.address?.trim()) return report.address
  if (report.districtName?.trim() && report.regionName?.trim()) {
    return `${report.districtName}, ${report.regionName}`
  }
  if (report.districtName?.trim()) return report.districtName
  if (report.dmaName?.trim()) return report.dmaName
  return `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatPropertyLabel(key: string) {
  const normalized = key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  const aliases: Record<string, string> = {
    intdiammm: "Internal Diameter (mm)",
    nomdiaminc: "Nominal Diameter (in)",
    pipepurpos: "Pipe Purpose",
    pipelength: "Pipe Length",
    zonelocati: "Zone",
    source_table: "Layer",
  }
  return aliases[key] || normalized
}

function collectGeometryCoordinates(geometry: Geometry | null | undefined): Array<[number, number]> {
  const points: Array<[number, number]> = []
  if (!geometry) return points

  const visit = (coordinates: GeometryCoordinates | undefined) => {
    if (!coordinates) return
    if (
      Array.isArray(coordinates) &&
      coordinates.length >= 2 &&
      typeof coordinates[0] === "number" &&
      typeof coordinates[1] === "number"
    ) {
      points.push([Number(coordinates[1]), Number(coordinates[0])])
      return
    }
    if (Array.isArray(coordinates)) {
      coordinates.forEach((item) => visit(item as GeometryCoordinates))
    }
  }

  if (geometry.type === "GeometryCollection") {
    geometry.geometries?.forEach((item) => {
      if ("coordinates" in item) visit(item.coordinates as GeometryCoordinates)
    })
  } else if ("coordinates" in geometry) {
    visit(geometry.coordinates as GeometryCoordinates)
  }

  return points
}

function buildNetworkPopupHtml(feature: Feature) {
  const geometryPoints = collectGeometryCoordinates(feature.geometry)
  const startPoint = geometryPoints[0]
  const endPoint = geometryPoints[geometryPoints.length - 1]

  const rawProperties = feature.properties
  const entries = Object.entries(
    rawProperties && typeof rawProperties === "object" ? rawProperties : {}
  ).filter(
    ([key, value]) =>
      value !== null &&
      value !== "" &&
      key !== "style"
  )

  const prioritizedKeys = [
    "assetid",
    "name",
    "material",
    "condition",
    "intdiammm",
    "nomdiaminc",
    "pipepurpos",
    "status",
    "location",
    "zonelocati",
    "source_table",
  ]

  entries.sort((left, right) => {
    const leftRank = prioritizedKeys.indexOf(left[0].toLowerCase())
    const rightRank = prioritizedKeys.indexOf(right[0].toLowerCase())
    if (leftRank === -1 && rightRank === -1) return left[0].localeCompare(right[0])
    if (leftRank === -1) return 1
    if (rightRank === -1) return -1
    return leftRank - rightRank
  })

  const renderedRows = entries.slice(0, 14).map(([key, value]) => {
    return `<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;border-bottom:1px solid #e2e8f0;padding:4px 0;">
      <span style="font-size:11px;color:#64748b;">${escapeHtml(formatPropertyLabel(key))}</span>
      <span style="font-size:11px;color:#0f172a;font-weight:600;text-align:right;max-width:220px;word-break:break-word;">${escapeHtml(String(value))}</span>
    </div>`
  })

  const startEndRows: string[] = []
  if (startPoint) {
    startEndRows.push(
      `<div style="display:flex;justify-content:space-between;gap:10px;"><span style="font-size:11px;color:#64748b;">Start Point</span><span style="font-size:11px;color:#0f172a;font-weight:600;">${startPoint[0].toFixed(5)}, ${startPoint[1].toFixed(5)}</span></div>`
    )
  }
  if (endPoint) {
    startEndRows.push(
      `<div style="display:flex;justify-content:space-between;gap:10px;"><span style="font-size:11px;color:#64748b;">End Point</span><span style="font-size:11px;color:#0f172a;font-weight:600;">${endPoint[0].toFixed(5)}, ${endPoint[1].toFixed(5)}</span></div>`
    )
  }

  return `<div style="width:300px;max-height:240px;overflow:auto;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="position:sticky;top:0;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:8px 10px;margin:-4px -4px 8px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0f172a;">Pipe Segment</div>
      <div style="font-size:11px;color:#64748b;margin-top:2px;">Network attributes from uploaded utility dataset</div>
    </div>
    <div style="display:grid;gap:2px;">${renderedRows.join("")}</div>
    ${startEndRows.length ? `<div style="margin-top:8px;border-top:1px solid #e2e8f0;padding-top:6px;display:grid;gap:4px;">${startEndRows.join("")}</div>` : ""}
  </div>`
}

function getInfrastructureIcon(assetType: string) {
  if (assetType === "valves") return Gauge
  if (assetType === "storage_facilities") return Warehouse
  if (assetType === "bulk_meters") return Database
  return CircleDot
}

function createInfrastructureDivIcon(assetType: string, color: string) {
  const symbol = INFRASTRUCTURE_SYMBOLS[assetType] || INFRASTRUCTURE_SYMBOLS.valves
  return L.divIcon({
    className: "majiscope-infrastructure-div-icon",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
    html: `<span style="display:flex;height:26px;width:26px;align-items:center;justify-content:center;border-radius:9999px;background:${color};color:white;border:2px solid rgba(255,255,255,.96);box-shadow:0 10px 22px -13px rgba(15,23,42,.85);"><svg viewBox="0 0 21 21" aria-hidden="true" style="height:18px;width:18px;filter:drop-shadow(0 1px 0 rgba(15,23,42,.18));">${symbol.svg}</svg></span>`,
  })
}

function buildBoundaryPopupHtml(overlay: OperationsMapBoundaryOverlay) {
  const reported = overlay.reported ?? 0
  const resolved = overlay.resolved ?? 0
  const efficiency = reported > 0 ? Math.round((resolved / reported) * 1000) / 10 : 0
  const label = overlay.level === "utility" ? "Utility boundary" : "DMA boundary"

  return `<div style="width:220px;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#64748b;">${label}</div>
    <div style="margin-top:4px;font-size:14px;font-weight:700;color:#0f172a;">${escapeHtml(overlay.label)}</div>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px;text-align:center;">
      <div style="border-radius:10px;background:#f1f5f9;padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:#0f172a;">${reported.toLocaleString()}</div>
        <div style="font-size:10px;color:#64748b;">Reported</div>
      </div>
      <div style="border-radius:10px;background:#ecfdf5;padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:#047857;">${resolved.toLocaleString()}</div>
        <div style="font-size:10px;color:#64748b;">Resolved</div>
      </div>
      <div style="border-radius:10px;background:#eff6ff;padding:7px 6px;">
        <div style="font-size:12px;font-weight:700;color:#0369a1;">${efficiency}%</div>
        <div style="font-size:10px;color:#64748b;">Efficiency</div>
      </div>
    </div>
  </div>`
}

function FitMapToData({
  bounds,
  fitKey,
}: {
  bounds: LatLngBoundsExpression | null
  fitKey: string
}) {
  const map = useMap()
  const lastAppliedFitKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!bounds) return
    if (lastAppliedFitKeyRef.current === fitKey) return
    lastAppliedFitKeyRef.current = fitKey
    map.fitBounds(bounds, {
      padding: [36, 36],
      maxZoom: 15,
      animate: false,
    })
  }, [bounds, fitKey, map])

  return null
}

function SyncMapSize() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    const refresh = () => {
      window.requestAnimationFrame(() => {
        map.invalidateSize()
      })
    }

    refresh()

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            refresh()
          })
        : null

    observer?.observe(container)
    window.addEventListener("resize", refresh)

    return () => {
      observer?.disconnect()
      window.removeEventListener("resize", refresh)
    }
  }, [map])

  return null
}

function MapViewObserver({
  onZoomChange,
  onViewChange,
}: {
  onZoomChange: (zoom: number) => void
  onViewChange?: (view: OperationsMapViewState) => void
}) {
  const emitViewState = useCallback(
    (map: L.Map) => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      onZoomChange(zoom)
      onViewChange?.({
        zoom,
        center: [center.lat, center.lng],
      })
    },
    [onViewChange, onZoomChange]
  )

  const map = useMapEvents({
    moveend: () => emitViewState(map),
    zoomend: () => emitViewState(map),
  })

  useEffect(() => {
    emitViewState(map)
  }, [emitViewState, map])

  return null
}

export function OperationsMapImpl({
  reports,
  aggregateMarkers = [],
  boundaryOverlays = [],
  center,
  boundaryGeojson,
  boundaryGeojsons = [],
  networkPreviewUrl,
  networkPreviewUrls = [],
  infrastructureLayers = [],
  networkFileName,
  title = "Leak operations map",
  description = "Monitor leak points, routing status, and pipe coverage from one field view.",
  basemap: controlledBasemap,
  onBasemapChange,
  onZoomChange,
  onViewChange,
  onReportSelect,
  chromeMode = "standard",
  boundsFitKey = "initial",
  initialBounds = null,
  preferInitialBounds = false,
}: {
  reports: OperationsMapReport[]
  aggregateMarkers?: OperationsMapAggregateMarker[]
  boundaryOverlays?: OperationsMapBoundaryOverlay[]
  center?: [number, number] | null
  boundaryGeojson?: GeoJsonObject | null
  boundaryGeojsons?: GeoJsonObject[]
  networkPreviewUrl?: string | null
  networkPreviewUrls?: string[]
  infrastructureLayers?: OperationsMapInfrastructureLayer[]
  networkFileName?: string | null
  title?: string
  description?: string
  basemap?: BasemapKey
  onBasemapChange?: (basemap: BasemapKey) => void
  onZoomChange?: (zoom: number) => void
  onViewChange?: (view: OperationsMapViewState) => void
  onReportSelect?: (reportId: string) => void
  chromeMode?: "standard" | "command-center"
  boundsFitKey?: string
  initialBounds?: LatLngBoundsExpression | null
  preferInitialBounds?: boolean
}) {
  const networkUrls = useMemo(() => {
    const urls = new Set<string>()
    if (networkPreviewUrl) urls.add(networkPreviewUrl)
    networkPreviewUrls.forEach((url) => {
      if (url) urls.add(url)
    })
    return Array.from(urls)
  }, [networkPreviewUrl, networkPreviewUrls])

  const [showNetwork, setShowNetwork] = useState(false)
  const [showBoundaries, setShowBoundaries] = useState(false)
  const [localBasemap, setLocalBasemap] = useState<BasemapKey>("street")
  const [networkLayers, setNetworkLayers] = useState<GeoJsonObject[]>([])
  const [assetLayers, setAssetLayers] = useState<Record<string, GeoJsonObject[]>>({})
  const [visibleAssetTypes, setVisibleAssetTypes] = useState<Record<string, boolean>>({})
  const [networkLoading, setNetworkLoading] = useState(false)
  const [assetLoadingTypes, setAssetLoadingTypes] = useState<Record<string, boolean>>({})
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [assetErrors, setAssetErrors] = useState<Record<string, string | null>>({})
  const [controlsOpen, setControlsOpen] = useState(false)
  const [mapZoom, setMapZoom] = useState(13)
  const basemap = controlledBasemap ?? localBasemap
  const isCommandCenter = chromeMode === "command-center"
  const isSatellite = basemap === "satellite"
  const isInfrastructureZoomSupported = mapZoom > 10
  const shouldRenderNetwork = showNetwork && networkUrls.length > 0 && isInfrastructureZoomSupported
  const isNationalBoundaryView = mapZoom <= NATIONAL_BOUNDARY_ZOOM
  const fallbackBoundaryLevel: OperationsMapBoundaryOverlay["level"] = isNationalBoundaryView ? "utility" : "dma"
  const boundaryLayers = useMemo<OperationsMapBoundaryOverlay[]>(() => {
    if (boundaryOverlays.length) return boundaryOverlays

    const fallbackLayers = boundaryGeojson ? [boundaryGeojson] : boundaryGeojsons
    return fallbackLayers.map((geojson, index) => ({
      id: `boundary-${index}`,
      label: fallbackBoundaryLevel === "utility" ? `Utility boundary ${index + 1}` : `DMA boundary ${index + 1}`,
      level: fallbackBoundaryLevel,
      geojson,
    }))
  }, [boundaryGeojson, boundaryGeojsons, boundaryOverlays, fallbackBoundaryLevel])
  const activeBoundaryLevel = boundaryLayers[0]?.level ?? fallbackBoundaryLevel
  const boundaryLayerLabel = activeBoundaryLevel === "utility" ? "utility boundaries" : "DMA boundaries"
  const hasBoundaryOverlays = boundaryLayers.length > 0
  const visibleAggregateMarkers = useMemo(
    () => (mapZoom < 5 ? [] : aggregateMarkers),
    [aggregateMarkers, mapZoom]
  )
  const handleZoomChange = useCallback(
    (zoom: number) => {
      setMapZoom(zoom)
      onZoomChange?.(zoom)
    },
    [onZoomChange]
  )

  useEffect(() => {
    setVisibleAssetTypes((current) => {
      const availableTypes = new Set(infrastructureLayers.map((layer) => layer.assetType))
      const next: Record<string, boolean> = {}
      Object.entries(current).forEach(([assetType, visible]) => {
        if (availableTypes.has(assetType)) next[assetType] = visible
      })
      const currentKeys = Object.keys(current)
      const nextKeys = Object.keys(next)
      if (
        currentKeys.length === nextKeys.length &&
        nextKeys.every((key) => current[key] === next[key])
      ) {
        return current
      }
      return next
    })
  }, [infrastructureLayers])

  useEffect(() => {
    setShowBoundaries(hasBoundaryOverlays)
  }, [hasBoundaryOverlays])

  useEffect(() => {
    let cancelled = false

    async function loadNetworkPreview() {
      if (!shouldRenderNetwork) {
        if (!cancelled) {
          setNetworkLayers((current) => (current.length ? [] : current))
          setNetworkError(null)
          setNetworkLoading(false)
        }
        return
      }

      const token = localStorage.getItem(CONFIG.storage.tokenKey)
      if (!token) {
        setNetworkError("Authentication is required to load the pipe network overlay.")
        return
      }

      setNetworkLoading(true)
      setNetworkError(null)

      try {
        const results = await Promise.allSettled(
          networkUrls.map((url) => loadNetworkLayer(url, token))
        )
        const loadedLayers = results
          .filter((result): result is PromiseFulfilledResult<GeoJsonObject> => result.status === "fulfilled")
          .map((result) => result.value)
        const failedLoads = results
          .filter((result): result is PromiseRejectedResult => result.status === "rejected")
          .map((result) => result.reason instanceof Error ? result.reason.message : "A utility pipe network preview could not be loaded.")

        if (!cancelled) {
          setNetworkLayers(loadedLayers)
          setNetworkError(
            loadedLayers.length
              ? failedLoads.length
                ? `${failedLoads.length} pipe network${failedLoads.length === 1 ? "" : "s"} could not be loaded.`
                : null
              : failedLoads[0] || "The utility pipe network preview could not be loaded."
          )
        }
      } catch (error) {
        if (!cancelled) {
          setNetworkLayers([])
          setNetworkError(error instanceof Error ? error.message : "The pipe network preview could not be loaded.")
        }
      } finally {
        if (!cancelled) {
          setNetworkLoading(false)
        }
      }
    }

    void loadNetworkPreview()

    return () => {
      cancelled = true
    }
  }, [networkUrls, shouldRenderNetwork])

  useEffect(() => {
    let cancelled = false

    async function loadVisibleAssetLayers() {
      const visibleLayers = infrastructureLayers.filter(
        (layer) => isInfrastructureZoomSupported && visibleAssetTypes[layer.assetType] && layer.previewUrls.length
      )

      if (!visibleLayers.length) {
        if (!cancelled) {
          setAssetLayers((current) => (Object.keys(current).length ? {} : current))
          setAssetErrors((current) => (Object.keys(current).length ? {} : current))
          setAssetLoadingTypes((current) => (Object.keys(current).length ? {} : current))
        }
        return
      }

      const token = localStorage.getItem(CONFIG.storage.tokenKey)
      if (!token) {
        if (!cancelled) {
          setAssetErrors(
            Object.fromEntries(
              visibleLayers.map((layer) => [layer.assetType, "Authentication is required to load this infrastructure layer."])
            )
          )
        }
        return
      }

      setAssetLoadingTypes(
        Object.fromEntries(visibleLayers.map((layer) => [layer.assetType, true]))
      )

      const nextLayers: Record<string, GeoJsonObject[]> = {}
      const nextErrors: Record<string, string | null> = {}

      await Promise.all(
        visibleLayers.map(async (layer) => {
          const results = await Promise.allSettled(layer.previewUrls.map((url) => loadNetworkLayer(url, token)))
          const loadedLayers = results
            .filter((result): result is PromiseFulfilledResult<GeoJsonObject> => result.status === "fulfilled")
            .map((result) => result.value)
          const failedLoads = results.filter((result) => result.status === "rejected")
          nextLayers[layer.assetType] = loadedLayers
          nextErrors[layer.assetType] =
            loadedLayers.length && failedLoads.length
              ? `${failedLoads.length} ${layer.label.toLowerCase()} layer${failedLoads.length === 1 ? "" : "s"} could not be loaded.`
              : loadedLayers.length
                ? null
                : `${layer.label} could not be loaded.`
        })
      )

      if (!cancelled) {
        setAssetLayers(nextLayers)
        setAssetErrors(nextErrors)
        setAssetLoadingTypes({})
      }
    }

    void loadVisibleAssetLayers()

    return () => {
      cancelled = true
    }
  }, [infrastructureLayers, isInfrastructureZoomSupported, visibleAssetTypes])

  const validReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          Number.isFinite(report.latitude) &&
          Number.isFinite(report.longitude) &&
          !(report.latitude === 0 && report.longitude === 0)
      ),
    [reports]
  )

  const mapCenter = useMemo<[number, number]>(() => {
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      return center
    }

    const networkPoints = networkLayers.flatMap((layer) => collectGeoJsonCoordinates(layer))
    if (!validReports.length && networkPoints.length) {
      const averageLatitude = networkPoints.reduce((sum, point) => sum + point[0], 0) / networkPoints.length
      const averageLongitude = networkPoints.reduce((sum, point) => sum + point[1], 0) / networkPoints.length
      return [averageLatitude, averageLongitude]
    }

    if (!validReports.length) {
      const validAggregateMarkers = aggregateMarkers.filter(
        (marker) =>
          Number.isFinite(marker.latitude) &&
          Number.isFinite(marker.longitude) &&
          !(marker.latitude === 0 && marker.longitude === 0)
      )
      if (validAggregateMarkers.length) {
        const averageLatitude =
          validAggregateMarkers.reduce((sum, marker) => sum + marker.latitude, 0) / validAggregateMarkers.length
        const averageLongitude =
          validAggregateMarkers.reduce((sum, marker) => sum + marker.longitude, 0) / validAggregateMarkers.length
        return [averageLatitude, averageLongitude]
      }
      return DEFAULT_CENTER
    }

    const averageLatitude = validReports.reduce((sum, report) => sum + report.latitude, 0) / validReports.length
    const averageLongitude = validReports.reduce((sum, report) => sum + report.longitude, 0) / validReports.length
    return [averageLatitude, averageLongitude]
  }, [aggregateMarkers, center, networkLayers, validReports])

  const fitBounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (preferInitialBounds && initialBounds) return initialBounds

    const points: Array<[number, number]> = [
      ...validReports.map((report) => [report.latitude, report.longitude] as [number, number]),
      ...aggregateMarkers
        .filter((marker) => Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude))
        .map((marker) => [marker.latitude, marker.longitude] as [number, number]),
      ...(showBoundaries ? boundaryLayers.flatMap((overlay) => collectGeoJsonCoordinates(overlay.geojson)) : []),
      ...networkLayers.flatMap((layer) => collectGeoJsonCoordinates(layer)),
      ...Object.values(assetLayers).flatMap((layers) =>
        layers.flatMap((layer) => collectGeoJsonCoordinates(layer))
      ),
    ]

    if (!points.length) return initialBounds
    if (points.length === 1) {
      const [lat, lng] = points[0]
      return [
        [lat - 0.008, lng - 0.008],
        [lat + 0.008, lng + 0.008],
      ]
    }

    return points
  }, [aggregateMarkers, assetLayers, boundaryLayers, initialBounds, networkLayers, preferInitialBounds, showBoundaries, validReports])

  return (
    <div className="h-full overflow-hidden rounded-[30px] border border-slate-300/85 bg-slate-100 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.4)]">
      <div className="relative h-full">
        {isCommandCenter ? (
          <style jsx global>{`
            .majiscope-map--command-center .leaflet-top.leaflet-left {
              top: 5.5rem;
              left: 0.5rem;
            }

            .majiscope-map--command-center .leaflet-control-zoom a {
              background: rgba(15, 23, 42, 0.82);
              color: rgba(255, 255, 255, 0.96);
              border-color: rgba(255, 255, 255, 0.14);
              box-shadow: 0 14px 34px -22px rgba(15, 23, 42, 0.9);
            }

            .majiscope-map--command-center .leaflet-control-zoom a:hover {
              background: rgba(30, 41, 59, 0.92);
            }

            .majiscope-map--command-center .leaflet-bottom.leaflet-right {
              bottom: 0.85rem;
              right: 0.75rem;
            }

            .majiscope-map--command-center .leaflet-control-attribution {
              max-width: min(32vw, 300px);
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              background: rgba(15, 23, 42, 0.68);
              color: rgba(255, 255, 255, 0.78);
              border-radius: 9999px;
              padding: 0.12rem 0.42rem;
              font-size: 9.5px;
              line-height: 1.25;
              box-shadow: 0 18px 45px -28px rgba(15, 23, 42, 0.92);
              opacity: 0.72;
              transition:
                max-width 180ms ease,
                opacity 180ms ease,
                background-color 180ms ease;
            }

            .majiscope-map--command-center .leaflet-control-attribution:hover,
            .majiscope-map--command-center .leaflet-control-attribution:focus-within {
              max-width: min(64vw, 720px);
              background: rgba(15, 23, 42, 0.82);
              opacity: 0.96;
            }

            .majiscope-map--command-center .leaflet-control-attribution a {
              color: rgba(255, 255, 255, 0.9);
            }

            .majiscope-map--command-center .leaflet-tile-pane {
              filter: contrast(1.08) saturate(1.04);
              opacity: 1;
            }

            .majiscope-boundary-tooltip {
              border: 0;
              background: rgba(255, 255, 255, 0.9);
              color: rgba(15, 23, 42, 0.96);
              border-radius: 9999px;
              padding: 0.18rem 0.55rem;
              font-size: 15px;
              font-weight: 900;
              letter-spacing: 0;
              line-height: 1.1;
              text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
              box-shadow: 0 10px 22px -14px rgba(15, 23, 42, 0.55);
            }

            .majiscope-boundary-tooltip::before {
              display: none;
            }
          `}</style>
        ) : null}

        <MapContainer
          center={mapCenter}
          zoom={13}
          className={cn("w-full", isCommandCenter && "majiscope-map--command-center")}
          style={{
            height: isCommandCenter ? "100%" : "min(72vh, 760px)",
            minHeight: isCommandCenter ? "0" : "520px",
            maxHeight: isCommandCenter ? "none" : "760px",
            width: "100%",
          }}
        >
          <SyncMapSize />
          <MapViewObserver onZoomChange={handleZoomChange} onViewChange={onViewChange} />
          <FitMapToData bounds={fitBounds} fitKey={boundsFitKey} />
          <TileLayer
            key={basemap}
            attribution={BASEMAPS[basemap].attribution}
            url={BASEMAPS[basemap].url}
          />

          {showBoundaries
            ? boundaryLayers.map((overlay, index) => {
                const defaultStyle = DEFAULT_BOUNDARY_STYLE[overlay.level]
                const color = overlay.color ?? defaultStyle.color
                const fillColor = overlay.color ?? defaultStyle.fillColor

                return (
                <GeoJSON
                  key={`boundary-${overlay.level}-${overlay.id}-${index}`}
                  data={overlay.geojson}
                  style={() => ({
                    color,
                    weight: overlay.level === "utility" ? 3.2 : 2.6,
                    opacity: overlay.level === "utility" ? 0.88 : 0.78,
                    fillColor,
                    fillOpacity: overlay.level === "utility" ? 0.055 : 0.025,
                  })}
                  onEachFeature={(_, layer) => {
                    if ("bindTooltip" in layer && typeof layer.bindTooltip === "function") {
                      layer.bindTooltip(overlay.label, {
                        sticky: true,
                        direction: "top",
                        className: "majiscope-boundary-tooltip",
                      })
                    }
                    if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                      layer.bindPopup(buildBoundaryPopupHtml(overlay))
                    }
                  }}
                />
              )
              })
            : null}

          {shouldRenderNetwork
            ? networkLayers.map((networkLayer, index) => (
                <GeoJSON
                  key={`network-${index}`}
                  data={networkLayer}
                  style={() => ({
                    color: "#2563eb",
                    weight: 2.25,
                    opacity: 0.64,
                  })}
                  onEachFeature={(feature, layer) => {
                    if (!feature) return
                    const popupHtml = buildNetworkPopupHtml(feature as Feature)
                    if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                      layer.bindPopup(popupHtml)
                    }
                  }}
                />
              ))
            : null}

          {infrastructureLayers.map((asset) =>
            isInfrastructureZoomSupported && visibleAssetTypes[asset.assetType]
              ? (assetLayers[asset.assetType] || []).map((assetLayer, index) => (
                  <GeoJSON
                    key={`asset-${asset.assetType}-${index}`}
                    data={assetLayer}
                    pointToLayer={(_, latlng) =>
                      L.marker(latlng, { icon: createInfrastructureDivIcon(asset.assetType, asset.color) })
                    }
                    style={() => ({
                      color: asset.color,
                      weight: 2,
                      opacity: 0.76,
                      fillColor: asset.color,
                      fillOpacity: 0.16,
                    })}
                    onEachFeature={(feature, layer) => {
                      if (!feature) return
                      const popupHtml = buildNetworkPopupHtml(feature as Feature)
                      if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                        layer.bindPopup(popupHtml.replace("Pipe Segment", escapeHtml(asset.label)))
                      }
                    }}
                  />
                ))
              : null
          )}

          {visibleAggregateMarkers.map((marker) => {
              const efficiency = marker.reported > 0 ? Math.round((marker.resolved / marker.reported) * 1000) / 10 : 0
              const radius = marker.level === "utility" ? 5 : 6

              return (
                <CircleMarker
                  key={`aggregate-${marker.level}-${marker.id}`}
                  center={[marker.latitude, marker.longitude]}
                  radius={radius}
                  pathOptions={{
                    fillColor: marker.level === "utility" ? "#0284c7" : "#7c3aed",
                    color: "#ffffff",
                    fillOpacity: 0.82,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="w-[230px] space-y-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {marker.level === "utility" ? "Utility summary" : "DMA summary"}
                        </div>
                        <h3 className="mt-1 text-sm font-semibold text-slate-900">{marker.label}</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-xl bg-slate-100 px-2 py-2">
                          <p className="font-semibold text-slate-900">{marker.reported.toLocaleString()}</p>
                          <p className="mt-0.5 text-slate-500">Reported</p>
                        </div>
                        <div className="rounded-xl bg-emerald-50 px-2 py-2">
                          <p className="font-semibold text-emerald-700">{marker.resolved.toLocaleString()}</p>
                          <p className="mt-0.5 text-slate-500">Resolved</p>
                        </div>
                        <div className="rounded-xl bg-sky-50 px-2 py-2">
                          <p className="font-semibold text-sky-700">{efficiency}%</p>
                          <p className="mt-0.5 text-slate-500">Efficiency</p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}

          {validReports.map((report) => {
              const meta = getStatusMeta(report.status)
              return (
                <CircleMarker
                  key={report.id}
                  center={[report.latitude, report.longitude]}
                  radius={4}
                  pathOptions={{
                    fillColor: meta.fill,
                    color: meta.stroke,
                    fillOpacity: 0.88,
                    weight: 1.25,
                  }}
                >
                  <Popup>
                    <div className="w-[250px] space-y-3">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {meta.label}
                        </div>
                        <h3 className="font-sans text-sm font-extrabold tracking-[0.04em] text-slate-900">{report.trackingId}</h3>
                        <p className="line-clamp-3 text-sm text-slate-600">{report.description}</p>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                          <Route className="mt-0.5 h-3.5 w-3.5 text-slate-400" />
                          <span>{getLocationLabel(report)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {report.utilityName ? (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                              {report.utilityName}
                            </span>
                          ) : null}
                          {report.dmaName ? (
                            <span className="rounded-full bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800">
                              {report.dmaName}
                            </span>
                          ) : null}
                          {report.priority ? (
                            <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium capitalize text-amber-800">
                              {report.priority}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <Button type="button" className="w-full" onClick={() => onReportSelect?.(report.id)}>
                        Open report
                      </Button>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}
        </MapContainer>

        <div
          className={cn(
            "pointer-events-none absolute top-4 z-[1000] flex items-start gap-3",
            isCommandCenter ? "right-4 justify-end" : "inset-x-4 justify-between"
          )}
        >
          {!isCommandCenter ? (
            <div className="pointer-events-auto rounded-xl border border-slate-300/80 bg-slate-100/88 px-3 py-2 shadow-lg shadow-slate-900/8 backdrop-blur">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {title}
              </div>
              <div className="mt-1 text-xs text-slate-500">{description}</div>
            </div>
          ) : null}

          <div className="pointer-events-auto ml-auto flex flex-col items-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className={cn(
                    "h-10 w-10 rounded-2xl shadow-lg backdrop-blur-xl",
                    isSatellite
                      ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30 hover:bg-slate-900"
                      : "border-slate-300/80 bg-slate-100/90 text-slate-900 shadow-slate-900/8 hover:bg-slate-200 dark:border-slate-500/80 dark:bg-black/90 dark:text-white dark:shadow-black/45 dark:hover:bg-black"
                  )}
                  aria-label={controlsOpen ? "Collapse map controls" : "Expand map controls"}
                  onClick={() => setControlsOpen((current) => !current)}
                >
                  {controlsOpen ? <ChevronDown className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">
                {controlsOpen ? "Collapse map controls" : "Expand map controls"}
              </TooltipContent>
            </Tooltip>

            {controlsOpen ? (
              <div
                className={cn(
                  "rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl",
                  isSatellite
                    ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30"
                    : "border-slate-300/80 bg-slate-100/88 text-slate-900 shadow-slate-900/8 dark:border-slate-600/80 dark:bg-slate-900/88 dark:text-white dark:shadow-slate-950/35"
                )}
              >
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(BASEMAPS).map(([key, value]) => (
                      <Button
                        key={key}
                        type="button"
                        size="sm"
                        variant={basemap === key ? "default" : "outline"}
                        className={
                          basemap === key
                            ? "h-8 rounded-xl bg-slate-800 px-3 text-white hover:bg-slate-900"
                            : isSatellite
                              ? "h-8 rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12"
                              : "h-8 rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200"
                        }
                        onClick={() => {
                          const nextBasemap = key as BasemapKey
                          setLocalBasemap(nextBasemap)
                          onBasemapChange?.(nextBasemap)
                        }}
                      >
                        {value.label}
                      </Button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={showNetwork ? "default" : "outline"}
                    className={
                      showNetwork
                        ? "h-8 justify-start rounded-xl bg-slate-800 px-3 text-white hover:bg-slate-900"
                        : isSatellite
                          ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12"
                          : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200"
                    }
                    onClick={() => setShowNetwork((current) => !current)}
                    disabled={(!networkUrls.length || !isInfrastructureZoomSupported) && !showNetwork}
                  >
                    <Layers3 className="mr-2 h-3.5 w-3.5" />
                    {showNetwork ? "Hide pipe network" : "Show pipe network"}
                  </Button>
                  {infrastructureLayers.map((asset) => {
                    const visible = Boolean(visibleAssetTypes[asset.assetType])
                    const Icon = getInfrastructureIcon(asset.assetType)

                    return (
                      <Button
                        key={asset.assetType}
                        type="button"
                        size="sm"
                        variant={visible ? "default" : "outline"}
                        className={
                          visible
                            ? "h-8 justify-start rounded-xl px-3 text-white hover:brightness-95"
                            : isSatellite
                              ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12"
                              : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200"
                        }
                        style={visible ? { backgroundColor: asset.color } : undefined}
                        onClick={() =>
                          setVisibleAssetTypes((current) => ({
                            ...current,
                            [asset.assetType]: !current[asset.assetType],
                          }))
                        }
                        disabled={(!asset.previewUrls.length || !isInfrastructureZoomSupported) && !visible}
                      >
                        <Icon className="mr-2 h-3.5 w-3.5" />
                        {visible ? `Hide ${asset.label}` : `Show ${asset.label}`}
                      </Button>
                    )
                  })}
                  <Button
                    type="button"
                    size="sm"
                    variant={showBoundaries ? "default" : "outline"}
                    className={
                      showBoundaries
                        ? "h-8 justify-start rounded-xl bg-orange-600 px-3 text-white hover:bg-orange-700"
                        : isSatellite
                          ? "h-8 justify-start rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12"
                          : "h-8 justify-start rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200"
                    }
                    onClick={() => setShowBoundaries((current) => !current)}
                    disabled={!hasBoundaryOverlays}
                  >
                    <MapPinned className="mr-2 h-3.5 w-3.5" />
                    {showBoundaries ? `Hide ${boundaryLayerLabel}` : `Show ${boundaryLayerLabel}`}
                  </Button>
                </div>
                {showBoundaries && boundaryOverlays.length ? (
                  <div
                    className={cn(
                      "mt-2 max-w-[240px] rounded-xl border px-2 py-2 text-left",
                      isSatellite
                        ? "border-white/12 bg-white/8 text-white/86"
                        : "border-slate-300/70 bg-white/55 text-slate-700 dark:border-slate-700 dark:bg-slate-950/45 dark:text-slate-200"
                    )}
                  >
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-75">
                      Boundary legend
                    </div>
                    <div className="grid max-h-32 gap-1 overflow-y-auto pr-1">
                      {boundaryOverlays.map((overlay) => (
                        <div key={`legend-${overlay.level}-${overlay.id}`} className="flex items-center justify-between gap-3 text-[11px]">
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: overlay.color ?? DEFAULT_BOUNDARY_STYLE[overlay.level].color }}
                            />
                            <span className="truncate">{overlay.label}</span>
                          </span>
                          <span className="shrink-0 font-semibold">{(overlay.reported ?? 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {networkLoading ? (
                  <div className={cn("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500")}>
                    Loading network...
                  </div>
                ) : null}
                {!networkLoading && shouldRenderNetwork && networkError ? (
                  <div className="mt-2 max-w-[240px] text-right text-[11px] text-rose-600">{networkError}</div>
                ) : null}
                {infrastructureLayers.some((asset) => assetLoadingTypes[asset.assetType]) ? (
                  <div className={cn("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500")}>
                    Loading infrastructure...
                  </div>
                ) : null}
                {infrastructureLayers.map((asset) =>
                  visibleAssetTypes[asset.assetType] && assetErrors[asset.assetType] ? (
                    <div key={`asset-error-${asset.assetType}`} className="mt-2 max-w-[240px] text-right text-[11px] text-rose-600">
                      {assetErrors[asset.assetType]}
                    </div>
                  ) : null
                )}
              </div>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  )
}
