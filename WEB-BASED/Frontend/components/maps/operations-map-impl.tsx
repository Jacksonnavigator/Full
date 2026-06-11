"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap } from "react-leaflet"
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import type { LatLngBoundsExpression } from "leaflet"
import { Layers3, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CONFIG from "@/lib/config"
import type { OperationsMapReport } from "./operations-map"

const DEFAULT_CENTER: [number, number] = [-6.369, 34.8888]

const BASEMAPS = {
  street: {
    label: "Street",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, HERE, Garmin, FAO, NOAA, USGS, and the GIS User Community",
    maxNativeZoom: 17,
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxNativeZoom: 17,
  },
} as const

type BasemapKey = keyof typeof BASEMAPS

type GeometryCoordinates =
  | [number, number]
  | number[]
  | GeometryCoordinates[]

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

export function OperationsMapImpl({
  reports,
  center,
  boundaryGeojson,
  networkPreviewUrl,
  networkPreviewUrls = [],
  networkFileName,
  title = "Leak operations map",
  description = "Monitor leak points, routing status, and pipe coverage from one field view.",
  basemap: controlledBasemap,
  onBasemapChange,
  onReportSelect,
  chromeMode = "standard",
  boundsFitKey = "initial",
}: {
  reports: OperationsMapReport[]
  center?: [number, number] | null
  boundaryGeojson?: GeoJsonObject | null
  networkPreviewUrl?: string | null
  networkPreviewUrls?: string[]
  networkFileName?: string | null
  title?: string
  description?: string
  basemap?: BasemapKey
  onBasemapChange?: (basemap: BasemapKey) => void
  onReportSelect?: (reportId: string) => void
  chromeMode?: "standard" | "command-center"
  boundsFitKey?: string
}) {
  const networkUrls = useMemo(() => {
    const urls = new Set<string>()
    if (networkPreviewUrl) urls.add(networkPreviewUrl)
    networkPreviewUrls.forEach((url) => {
      if (url) urls.add(url)
    })
    return Array.from(urls)
  }, [networkPreviewUrl, networkPreviewUrls])

  const [showNetwork, setShowNetwork] = useState(networkUrls.length > 0)
  const [localBasemap, setLocalBasemap] = useState<BasemapKey>("street")
  const [networkLayers, setNetworkLayers] = useState<GeoJsonObject[]>([])
  const [networkLoading, setNetworkLoading] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const basemap = controlledBasemap ?? localBasemap
  const isCommandCenter = chromeMode === "command-center"
  const isSatellite = basemap === "satellite"

  useEffect(() => {
    setShowNetwork(networkUrls.length > 0)
  }, [networkUrls])

  useEffect(() => {
    let cancelled = false

    async function loadNetworkPreview() {
      if (!showNetwork || !networkUrls.length) {
        if (!cancelled) {
          setNetworkLayers([])
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
        const loadedLayers: GeoJsonObject[] = []
        const failedLoads: string[] = []

        for (const url of networkUrls) {
          const response = await fetch(`${CONFIG.backend.baseUrl}${url}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const payload = await response.json().catch(() => ({}))
          if (!response.ok) {
            failedLoads.push(payload?.detail || "A utility pipe network preview could not be loaded.")
            continue
          }

          loadedLayers.push(payload as GeoJsonObject)
        }

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
  }, [networkUrls, showNetwork])

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
      return DEFAULT_CENTER
    }

    const averageLatitude = validReports.reduce((sum, report) => sum + report.latitude, 0) / validReports.length
    const averageLongitude = validReports.reduce((sum, report) => sum + report.longitude, 0) / validReports.length
    return [averageLatitude, averageLongitude]
  }, [center, networkLayers, validReports])

  const fitBounds = useMemo<LatLngBoundsExpression | null>(() => {
    const points: Array<[number, number]> = [
      ...validReports.map((report) => [report.latitude, report.longitude] as [number, number]),
      ...collectGeoJsonCoordinates(boundaryGeojson ?? null),
      ...networkLayers.flatMap((layer) => collectGeoJsonCoordinates(layer)),
    ]

    if (!points.length) return null
    if (points.length === 1) {
      const [lat, lng] = points[0]
      return [
        [lat - 0.008, lng - 0.008],
        [lat + 0.008, lng + 0.008],
      ]
    }

    return points
  }, [boundaryGeojson, networkLayers, validReports])

  return (
    <div className="overflow-hidden rounded-[30px] border border-slate-300/85 bg-slate-100 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.4)]">
      <div className="relative">
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
              background: rgba(15, 23, 42, 0.8);
              color: rgba(255, 255, 255, 0.84);
              border-radius: 9999px;
              padding: 0.2rem 0.55rem;
              box-shadow: 0 18px 45px -28px rgba(15, 23, 42, 0.92);
            }

            .majiscope-map--command-center .leaflet-control-attribution a {
              color: rgba(255, 255, 255, 0.96);
            }

            .majiscope-map--command-center .leaflet-tile-pane {
              filter: none;
            }
          `}</style>
        ) : null}

        <MapContainer
          center={mapCenter}
          zoom={13}
          minZoom={10}
          maxZoom={19}
          zoomSnap={0.5}
          zoomDelta={0.5}
          className={cn("w-full", isCommandCenter && "majiscope-map--command-center")}
          style={{ height: "min(72vh, 760px)", minHeight: "520px", maxHeight: "760px", width: "100%" }}
        >
          <SyncMapSize />
          <FitMapToData bounds={fitBounds} fitKey={boundsFitKey} />
          <TileLayer
            key={basemap}
            attribution={BASEMAPS[basemap].attribution}
            url={BASEMAPS[basemap].url}
            maxNativeZoom={BASEMAPS[basemap].maxNativeZoom}
            maxZoom={19}
            keepBuffer={6}
            updateWhenIdle={false}
            detectRetina
          />

          {boundaryGeojson ? (
            <GeoJSON
              data={boundaryGeojson}
              style={() => ({
                color: "#0f766e",
                weight: 3,
                opacity: 0.82,
                dashArray: "8 6",
                fillColor: "#2dd4bf",
                fillOpacity: 0.05,
              })}
            />
          ) : null}

          {showNetwork
            ? networkLayers.map((networkLayer, index) => (
                <GeoJSON
                  key={`network-${index}`}
                  data={networkLayer}
                  style={() => ({
                    color: "#1d4ed8",
                    weight: 3,
                    opacity: 0.68,
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

          {validReports.map((report) => {
            const meta = getStatusMeta(report.status)
            return (
              <CircleMarker
                key={report.id}
                center={[report.latitude, report.longitude]}
                radius={4}
                zIndexOffset={1200}
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
                      <h3 className="text-sm font-semibold text-slate-900">{report.trackingId}</h3>
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
            isCommandCenter ? "left-4 right-4 justify-between" : "inset-x-4 justify-between"
          )}
        >
          {isCommandCenter ? (
            <div
              className={cn(
                "pointer-events-none rounded-xl border px-3 py-2 shadow-lg backdrop-blur",
                isSatellite
                  ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30"
                  : "border-slate-300/80 bg-slate-100/88 text-slate-900 shadow-slate-900/8"
              )}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">
                Leak reports
              </div>
              <div className="mt-1 text-sm font-semibold">
                {validReports.length.toLocaleString()} on map
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto rounded-xl border border-slate-300/80 bg-slate-100/88 px-3 py-2 shadow-lg shadow-slate-900/8 backdrop-blur">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {title}
              </div>
              <div className="mt-1 text-xs text-slate-500">{description}</div>
            </div>
          )}

          <div
            className={cn(
              "pointer-events-auto rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl",
              isSatellite
                ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30"
                : "border-slate-300/80 bg-slate-100/88 text-slate-900 shadow-slate-900/8"
            )}
          >
            <div className="flex flex-nowrap items-center gap-2">
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
              <Button
                type="button"
                size="sm"
                variant={showNetwork ? "default" : "outline"}
                className={
                  showNetwork
                    ? "h-8 rounded-xl bg-slate-800 px-3 text-white hover:bg-slate-900"
                    : isSatellite
                      ? "h-8 rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12"
                      : "h-8 rounded-xl border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200"
                }
                onClick={() => setShowNetwork((current) => !current)}
                disabled={!networkUrls.length}
              >
                <Layers3 className="mr-2 h-3.5 w-3.5" />
                {showNetwork ? "Hide pipe network" : "Show pipe network"}
              </Button>
            </div>
            {networkLoading ? (
              <div className={cn("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500")}>
                Loading network...
              </div>
            ) : null}
            {!networkLoading && showNetwork && networkError ? (
              <div className="mt-2 max-w-[240px] text-right text-[11px] text-rose-600">{networkError}</div>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  )
}
