"use client"

import { Fragment, useEffect, useMemo } from "react"
import { CircleMarker, MapContainer, Pane, Popup, TileLayer, useMap } from "react-leaflet"
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

function featureLatLng(feature: GeoJsonFeature): LatLngExpression | null {
  if (!isPointFeature(feature)) return null
  const [lng, lat] = feature.geometry!.coordinates as number[]
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return [lat, lng]
}

function heatColor(mode: HydraulicHeatMode, feature: GeoJsonFeature) {
  const props = feature.properties || {}
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
  leakage_risk: [
    { color: "#a855f7", label: "Elevated · below 55%" },
    { color: "#f97316", label: "High · 55-79%" },
    { color: "#dc2626", label: "Critical · 80% and above" },
  ],
}

function tooltipRows(mode: HydraulicHeatMode, feature: GeoJsonFeature) {
  const props = feature.properties || {}
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
    const points = features.map(featureLatLng).filter(Boolean) as [number, number][]
    if (!points.length) return
    map.fitBounds(points, { padding: [24, 24] })
  }, [features, map])

  return null
}

export function HydraulicHeatMap({
  mode,
  nodesGeojson,
  hotspotsGeojson,
}: {
  mode: HydraulicHeatMode
  nodesGeojson?: GeoJsonFeatureCollection
  hotspotsGeojson?: GeoJsonFeatureCollection
}) {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  const features = useMemo(() => {
    if (mode === "leakage_risk") {
      return getGeoJsonFeatures(hotspotsGeojson).filter(isPointFeature)
    }

    const nodeFeatures = getGeoJsonFeatures(nodesGeojson).filter(isPointFeature)
    if (mode === "low_pressure") {
      return nodeFeatures.filter((feature) => {
        const props = feature.properties || {}
        return props.is_low_pressure === true || (typeof props.low_pressure_hits === "number" && Number(props.low_pressure_hits) > 0)
      })
    }
    return nodeFeatures
  }, [hotspotsGeojson, mode, nodesGeojson])

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
        <Pane name="hydraulic-heat-halo" className="hydraulic-heat-halo-pane" />
        <Pane name="hydraulic-heat-hit" className="hydraulic-heat-hit-pane" />
        <MapBounds features={features} />

        {features.map((feature, index) => {
          const latLng = featureLatLng(feature)
          if (!latLng) return null
          const color = heatColor(mode, feature)
          const radius = heatRadius(mode, feature)
          const rows = tooltipRows(mode, feature)

          return (
            <Fragment key={`${mode}-${index}`}>
              <CircleMarker
                center={latLng}
                pane="hydraulic-heat-halo"
                radius={radius}
                pathOptions={{
                  stroke: false,
                  fillColor: color,
                  fillOpacity: mode === "pressure" ? 0.32 : 0.4,
                }}
              />
              <CircleMarker
                center={latLng}
                pane="hydraulic-heat-hit"
                radius={Math.max(6, Math.min(10, radius / 2.8))}
                pathOptions={{
                  color,
                  weight: 1.5,
                  fillColor: color,
                  fillOpacity: 0.9,
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
