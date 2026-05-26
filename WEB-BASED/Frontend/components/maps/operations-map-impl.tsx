"use client"

import { useEffect, useMemo, useState } from "react"
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
  switch (status) {
    case "new":
      return {
        label: "New intake",
        fill: "#ef4444",
        stroke: "#991b1b",
      }
    case "assigned":
      return {
        label: "Assigned",
        fill: "#f59e0b",
        stroke: "#b45309",
      }
    case "in_progress":
      return {
        label: "In progress",
        fill: "#0ea5e9",
        stroke: "#0369a1",
      }
    case "pending_approval":
      return {
        label: "Awaiting DMA approval",
        fill: "#8b5cf6",
        stroke: "#6d28d9",
      }
    case "approved":
      return {
        label: "Approved",
        fill: "#10b981",
        stroke: "#047857",
      }
    case "closed":
      return {
        label: "Closed",
        fill: "#334155",
        stroke: "#0f172a",
      }
    case "rejected":
      return {
        label: "Rework required",
        fill: "#f97316",
        stroke: "#c2410c",
      }
    default:
      return {
        label: "Reported leakage",
        fill: "#64748b",
        stroke: "#334155",
      }
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

function FitMapToData({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap()

  useEffect(() => {
    if (!bounds) return
    map.fitBounds(bounds, { padding: [28, 28] })
  }, [bounds, map])

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
  networkFileName,
  title = "Leak operations map",
  description = "Monitor leak points, routing status, and pipe coverage from one field view.",
  basemap: controlledBasemap,
  onBasemapChange,
  onReportSelect,
  chromeMode = "standard",
}: {
  reports: OperationsMapReport[]
  center?: [number, number] | null
  boundaryGeojson?: GeoJsonObject | null
  networkPreviewUrl?: string | null
  networkFileName?: string | null
  title?: string
  description?: string
  basemap?: BasemapKey
  onBasemapChange?: (basemap: BasemapKey) => void
  onReportSelect?: (reportId: string) => void
  chromeMode?: "standard" | "command-center"
}) {
  const [showNetwork, setShowNetwork] = useState(Boolean(networkPreviewUrl))
  const [localBasemap, setLocalBasemap] = useState<BasemapKey>("satellite")
  const [networkData, setNetworkData] = useState<GeoJsonObject | null>(null)
  const [networkLoading, setNetworkLoading] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const basemap = controlledBasemap ?? localBasemap
  const isCommandCenter = chromeMode === "command-center"
  const isSatellite = basemap === "satellite"

  useEffect(() => {
    setShowNetwork(Boolean(networkPreviewUrl))
  }, [networkPreviewUrl])

  useEffect(() => {
    let cancelled = false

    async function loadNetworkPreview() {
      if (!showNetwork || !networkPreviewUrl) {
        if (!cancelled) {
          setNetworkData(null)
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
        const response = await fetch(`${CONFIG.backend.baseUrl}${networkPreviewUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          if (!cancelled) {
            setNetworkData(null)
            setNetworkError(payload?.detail || "The utility pipe network preview could not be loaded.")
          }
          return
        }

        if (!cancelled) {
          setNetworkData(payload as GeoJsonObject)
        }
      } catch (error) {
        if (!cancelled) {
          setNetworkData(null)
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
  }, [networkPreviewUrl, showNetwork])

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

    const networkPoints = collectGeoJsonCoordinates(networkData)
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
  }, [center, networkData, validReports])

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    const points: Array<[number, number]> = [
      ...validReports.map((report) => [report.latitude, report.longitude] as [number, number]),
      ...collectGeoJsonCoordinates(boundaryGeojson ?? null),
      ...collectGeoJsonCoordinates(networkData),
    ]

    if (!points.length) return null
    if (points.length === 1) {
      const [lat, lng] = points[0]
      return [
        [lat - 0.01, lng - 0.01],
        [lat + 0.01, lng + 0.01],
      ]
    }

    return points
  }, [boundaryGeojson, networkData, validReports])

  const legend = useMemo(
    () => [
      getStatusMeta("new"),
      getStatusMeta("assigned"),
      getStatusMeta("in_progress"),
      getStatusMeta("pending_approval"),
      getStatusMeta("approved"),
    ],
    []
  )

  return (
    <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_32px_90px_-48px_rgba(15,23,42,0.45)]">
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
          `}</style>
        ) : null}

        <MapContainer
          center={mapCenter}
          zoom={13}
          className={cn("w-full", isCommandCenter && "majiscope-map--command-center")}
          style={{ height: "80vh", minHeight: "760px", maxHeight: "980px", width: "100%" }}
        >
          <SyncMapSize />
          <FitMapToData bounds={bounds} />
          <TileLayer
            attribution={BASEMAPS[basemap].attribution}
            url={BASEMAPS[basemap].url}
          />

          {boundaryGeojson ? (
            <GeoJSON
              data={boundaryGeojson}
              style={() => ({
                color: "#0f766e",
                weight: 3,
                opacity: 0.95,
                dashArray: "8 6",
                fillColor: "#2dd4bf",
                fillOpacity: 0.08,
              })}
            />
          ) : null}

          {showNetwork && networkData ? (
            <GeoJSON
              data={networkData}
              style={() => ({
                color: "#2563eb",
                weight: 3,
                opacity: 0.8,
              })}
              onEachFeature={(feature, layer) => {
                if (!feature) return
                const popupHtml = buildNetworkPopupHtml(feature as Feature)
                if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                  layer.bindPopup(popupHtml)
                }
              }}
            />
          ) : null}

          {validReports.map((report) => {
            const meta = getStatusMeta(report.status)
            return (
              <CircleMarker
                key={report.id}
                center={[report.latitude, report.longitude]}
                radius={7}
                pathOptions={{
                  fillColor: meta.fill,
                  color: meta.stroke,
                  fillOpacity: 0.9,
                  weight: 2,
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
            isCommandCenter ? "right-4 inset-x-auto" : "inset-x-4 justify-between"
          )}
        >
          {!isCommandCenter ? (
            <div className="pointer-events-auto rounded-xl border border-white/80 bg-white/92 px-3 py-2 shadow-lg shadow-slate-900/10 backdrop-blur">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {title}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {description}
              </div>
            </div>
          ) : null}

          <div
            className={cn(
              "pointer-events-auto rounded-2xl border px-3 py-2 shadow-lg backdrop-blur-xl",
              isSatellite
                ? "border-white/14 bg-slate-950/80 text-white shadow-slate-950/30"
                : "border-white/80 bg-white/92 text-slate-900 shadow-slate-900/10"
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
                      ? "h-8 rounded-xl bg-cyan-600 px-3 text-white hover:bg-cyan-500"
                      : isSatellite
                        ? "h-8 rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12"
                        : "h-8 rounded-xl border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50"
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
                    ? "h-8 rounded-xl bg-cyan-600 px-3 text-white hover:bg-cyan-500"
                    : isSatellite
                      ? "h-8 rounded-xl border-white/14 bg-white/8 px-3 text-white hover:bg-white/12"
                      : "h-8 rounded-xl border-slate-200 bg-white px-3 text-slate-700 hover:bg-slate-50"
                }
                onClick={() => setShowNetwork((current) => !current)}
                disabled={!networkPreviewUrl}
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
            {!networkLoading && !networkError && networkFileName ? (
              <div className={cn("mt-2 text-right text-[11px]", isSatellite ? "text-white/72" : "text-slate-500")}>
                {networkFileName}
              </div>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[1000] flex flex-wrap justify-center gap-2">
          {legend.map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur-xl",
                isSatellite
                  ? "border-white/14 bg-slate-950/76 text-white shadow-slate-950/30"
                  : "border-white/80 bg-white/92 text-slate-700 shadow-slate-900/10"
              )}
            >
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                style={{ backgroundColor: item.fill, boxShadow: `0 0 0 2px ${item.stroke}` }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
