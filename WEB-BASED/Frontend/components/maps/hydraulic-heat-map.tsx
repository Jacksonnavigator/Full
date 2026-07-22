"use client"

import { Fragment, useEffect, useMemo } from "react"
import { CircleMarker, MapContainer, Pane, Popup, Polyline, TileLayer, useMap } from "react-leaflet"
import { useTheme } from "next-themes"
import type { LatLngExpression } from "leaflet"

import {
  type GeoJsonFeature,
  type GeoJsonFeatureCollection,
  type HydraulicHeatMode,
  HYDRAULIC_HEAT_MODE_LABELS,
  getGeoJsonFeatures,
} from "@/lib/hydraulic-heat"

function isPointFeature(feature: GeoJsonFeature) {
  const coords = feature.geometry?.coordinates
  return feature.geometry?.type === "Point" && Array.isArray(coords) && coords.length >= 2
}

function isLineFeature(feature: GeoJsonFeature) {
  const coords = feature.geometry?.coordinates
  return feature.geometry?.type === "LineString" && Array.isArray(coords) && coords.length >= 2
}

function featureLatLng(feature: GeoJsonFeature): LatLngExpression | null {
  if (!isPointFeature(feature)) return null
  const [lng, lat] = feature.geometry!.coordinates as number[]
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return [lat, lng]
}

function featureLineLatLngs(feature: GeoJsonFeature): LatLngExpression[] {
  if (!isLineFeature(feature)) return []
  return ((feature.geometry!.coordinates as number[][]) || [])
    .map((coord) => {
      const [lng, lat] = coord
      return Number.isFinite(lat) && Number.isFinite(lng) ? ([lat, lng] as LatLngExpression) : null
    })
    .filter(Boolean) as LatLngExpression[]
}

function heatColor(mode: HydraulicHeatMode, feature: GeoJsonFeature) {
  const props = feature.properties || {}
  if (mode === "pipe_flow") {
    const flow = Math.abs(Number(props.flow_rate_max_abs ?? props.flow_rate_avg ?? props.flow_rate ?? 0))
    if (flow >= 50) return "#dc2626"
    if (flow >= 20) return "#f97316"
    if (flow >= 5) return "#facc15"
    if (flow > 0) return "#60a5fa"
    return "#6366f1"
  }

  if (mode === "leakage_risk") {
    const score = typeof props.risk_score === "number" ? props.risk_score : 0
    if (score >= 0.8) return "#dc2626"
    if (score >= 0.55) return "#f97316"
    return "#a855f7"
  }

  if (mode === "low_pressure") {
    const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : null
    if (pressure == null) return "#ef4444"
    if (pressure < 5) return "#b91c1c"
    if (pressure < 10) return "#dc2626"
    return "#f97316"
  }

  const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : null
  if (pressure == null) return "#38bdf8"
  if (pressure < 10) return "#ef4444"
  if (pressure < 20) return "#f97316"
  if (pressure < 30) return "#facc15"
  if (pressure < 45) return "#22c55e"
  return "#2563eb"
}

function heatRadius(mode: HydraulicHeatMode, feature: GeoJsonFeature) {
  const props = feature.properties || {}
  if (mode === "leakage_risk") {
    const score = typeof props.risk_score === "number" ? props.risk_score : 0
    return 18 + Math.max(0, Math.min(20, score * 24))
  }

  if (mode === "low_pressure") {
    const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : 7
    const severity = Math.max(0, 15 - Number(pressure))
    return 18 + Math.min(18, severity * 1.3)
  }

  const pressure = typeof props.pressure === "number" ? props.pressure : typeof props.pressure_min === "number" ? props.pressure_min : 20
  if (pressure < 10) return 30
  if (pressure < 20) return 26
  if (pressure < 30) return 22
  if (pressure < 45) return 18
  return 15
}

const HEAT_LEGENDS: Record<HydraulicHeatMode, Array<{ color: string; label: string }>> = {
  pressure: [
    { color: "#ef4444", label: "Critically low · below 10 m" },
    { color: "#f97316", label: "Low · 10-20 m" },
    { color: "#facc15", label: "Moderate · 20-30 m" },
    { color: "#22c55e", label: "Normal · 30-45 m" },
    { color: "#2563eb", label: "High · 45 m and above" },
  ],
  low_pressure: [
    { color: "#b91c1c", label: "Critical · below 5 m" },
    { color: "#dc2626", label: "Low · 5-7 m" },
  ],
  pipe_flow: [
    { color: "#6366f1", label: "No or very low flow" },
    { color: "#60a5fa", label: "Low flow" },
    { color: "#facc15", label: "Moderate flow" },
    { color: "#f97316", label: "High flow" },
    { color: "#dc2626", label: "Very high flow" },
  ],
  leakage_risk: [
    { color: "#a855f7", label: "Elevated · below 55%" },
    { color: "#f97316", label: "High · 55-79%" },
    { color: "#dc2626", label: "Critical · 80% and above" },
  ],
}

const HEAT_GRADIENTS: Record<HydraulicHeatMode, string> = {
  pressure: "linear-gradient(90deg, #ef4444, #f97316, #facc15, #22c55e, #2563eb)",
  low_pressure: "linear-gradient(90deg, #b91c1c, #dc2626, #f97316)",
  pipe_flow: "linear-gradient(90deg, #6366f1, #60a5fa, #facc15, #f97316, #dc2626)",
  leakage_risk: "linear-gradient(90deg, #a855f7, #f97316, #dc2626)",
}

function tooltipRows(mode: HydraulicHeatMode, feature: GeoJsonFeature) {
  const props = feature.properties || {}
  if (mode === "pipe_flow") {
    return [
      ["Pipe", String(props.element_id || "Unknown")],
      ["Mean flow", typeof props.flow_rate_avg === "number" ? `${props.flow_rate_avg.toFixed(3)} m³/h` : "Not available"],
      ["Peak flow", typeof props.flow_rate_max_abs === "number" ? `${props.flow_rate_max_abs.toFixed(3)} m³/h` : "Not available"],
    ]
  }

  if (mode === "leakage_risk") {
    return [
      ["Pipe", String(props.pipe_id || props.element_id || "Unknown")],
      ["Risk", String(props.risk_level || "Not specified").replaceAll("_", " ")],
      ["Score", typeof props.risk_score === "number" ? `${(props.risk_score * 100).toFixed(0)}%` : "Not available"],
    ]
  }

  if (mode === "low_pressure") {
    return [
      ["Node", String(props.element_id || "Unknown")],
      ["Pressure", typeof props.pressure === "number" ? `${props.pressure.toFixed(2)} m` : typeof props.pressure_min === "number" ? `${props.pressure_min.toFixed(2)} m` : "Not available"],
      ["Low-pressure hits", typeof props.low_pressure_hits === "number" ? String(props.low_pressure_hits) : props.is_low_pressure === true ? "1" : "0"],
    ]
  }

  return [
    ["Node", String(props.element_id || "Unknown")],
    ["Pressure", typeof props.pressure === "number" ? `${props.pressure.toFixed(2)} m` : typeof props.pressure_min === "number" ? `${props.pressure_min.toFixed(2)} m` : "Not available"],
    ["Average", typeof props.pressure_avg === "number" ? `${props.pressure_avg.toFixed(2)} m` : "Not available"],
  ]
}

function MapBounds({ features }: { features: GeoJsonFeature[] }) {
  const map = useMap()

  useEffect(() => {
    const points = features.flatMap((feature) => {
      const point = featureLatLng(feature)
      if (point) return [point]
      return featureLineLatLngs(feature)
    }).filter(Boolean) as [number, number][]
    if (!points.length) return
    map.fitBounds(points, { padding: [24, 24] })
  }, [features, map])

  return null
}

export function HydraulicHeatMap({
  mode,
  nodesGeojson,
  pipesGeojson,
  hotspotsGeojson,
}: {
  mode: HydraulicHeatMode
  nodesGeojson?: GeoJsonFeatureCollection
  pipesGeojson?: GeoJsonFeatureCollection
  hotspotsGeojson?: GeoJsonFeatureCollection
}) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  const features = useMemo(() => {
    if (mode === "leakage_risk") {
      return getGeoJsonFeatures(hotspotsGeojson).filter(isPointFeature)
    }

    if (mode === "pipe_flow") {
      return getGeoJsonFeatures(pipesGeojson).filter((feature) => isPointFeature(feature) || isLineFeature(feature))
    }

    const nodeFeatures = getGeoJsonFeatures(nodesGeojson).filter(isPointFeature)
    if (mode === "low_pressure") {
      return nodeFeatures.filter((feature) => {
        const props = feature.properties || {}
        return props.is_low_pressure === true || (typeof props.low_pressure_hits === "number" && Number(props.low_pressure_hits) > 0)
      })
    }
    return nodeFeatures
  }, [hotspotsGeojson, mode, nodesGeojson, pipesGeojson])

  const mapCenter = useMemo<LatLngExpression>(() => {
    const firstPoint = features.map(featureLatLng).find(Boolean)
    return firstPoint || [-6.8, 39.28]
  }, [features])

  const tileUrl = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="h-[25rem] w-full bg-slate-100 dark:bg-slate-950">
        <TileLayer
          url={tileUrl}
          attribution={theme === "dark" ? "&copy; OSM &copy; CARTO" : "&copy; OpenStreetMap contributors"}
        />
        <Pane name="hydraulic-heat-hit" className="hydraulic-heat-hit-pane" />
        <MapBounds features={features} />

        {features.map((feature, index) => {
          const latLng = featureLatLng(feature)
          const color = heatColor(mode, feature)
          const radius = heatRadius(mode, feature)
          const rows = tooltipRows(mode, feature)

          if (mode === "pipe_flow" && isLineFeature(feature)) {
            const line = featureLineLatLngs(feature)
            if (!line.length) return null
            return (
              <Polyline
                key={`${mode}-${index}`}
                positions={line}
                pathOptions={{ color, weight: 4, opacity: 0.92 }}
              >
                <Popup>
                  <div className="min-w-40 text-sm">
                    <p className="mb-2 font-semibold">{HYDRAULIC_HEAT_MODE_LABELS[mode]}</p>
                    <div className="space-y-1">
                      {rows.map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-3">
                          <span className="text-slate-500">{label}</span>
                          <span className="font-medium text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Polyline>
            )
          }

          if (!latLng) return null

          return (
            <Fragment key={`${mode}-${index}`}>
              <CircleMarker
                center={latLng}
                pane="hydraulic-heat-hit"
                radius={mode === "pipe_flow" ? 6 : Math.max(5, Math.min(8, radius / 3.5))}
                pathOptions={{
                  color: "#0f172a",
                  weight: 1.2,
                  fillColor: color,
                  fillOpacity: 0.92,
                }}
              >
                <Popup>
                  <div className="min-w-40 text-sm">
                    <p className="mb-2 font-semibold">{HYDRAULIC_HEAT_MODE_LABELS[mode]}</p>
                    <div className="space-y-1">
                      {rows.map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-3">
                          <span className="text-slate-500">{label}</span>
                          <span className="font-medium text-slate-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          )
        })}
      </MapContainer>
      <div className="pointer-events-none absolute bottom-4 left-4 z-[900] min-w-52 rounded-md border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/95">
        <p className="mb-2 text-xs font-semibold text-slate-950 dark:text-white">
          {HYDRAULIC_HEAT_MODE_LABELS[mode]}
        </p>
        <div className="mb-2 h-2 w-full rounded-full ring-1 ring-slate-900/10" style={{ background: HEAT_GRADIENTS[mode] }} />
        <div className="space-y-1.5">
          {HEAT_LEGENDS[mode].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
              <span className="h-3 w-3 shrink-0 rounded-full border border-white/70 shadow-sm" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
