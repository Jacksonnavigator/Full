"use client"

import { useEffect, useMemo, useState } from "react"
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet"
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import { AlertTriangle, Network } from "lucide-react"
import CONFIG from "@/lib/config"

const DEFAULT_CENTER: [number, number] = [-6.7924, 39.2083]

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

export function UtilityPipeNetworkMapImpl({
  utilityId,
  previewUrl,
  fallbackCenter,
  title = "Utility Pipe Network",
  emptyMessage = "Upload a GeoJSON utility pipe network to preview it on the map.",
}: {
  utilityId: string
  previewUrl?: string | null
  fallbackCenter?: [number, number] | null
  title?: string
  emptyMessage?: string
}) {
  const [geojson, setGeojson] = useState<GeoJsonObject | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadPreview() {
      if (!utilityId || !previewUrl) {
        setGeojson(null)
        setError(null)
        return
      }

      const token = localStorage.getItem(CONFIG.storage.tokenKey)
      if (!token) {
        setError("Authentication is required to preview the utility pipe network.")
        return
      }

      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${CONFIG.backend.fullUrl}${previewUrl}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          if (!cancelled) {
            setGeojson(null)
            setError(payload.detail || payload.error || "Unable to load the utility pipe network preview.")
          }
          return
        }

        if (!cancelled) {
          setGeojson(payload as GeoJsonObject)
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading utility pipe network preview:", err)
          setGeojson(null)
          setError("Unable to load the utility pipe network preview.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadPreview()
    return () => {
      cancelled = true
    }
  }, [utilityId, previewUrl])

  const previewCoordinates = useMemo(() => collectGeoJsonCoordinates(geojson), [geojson])

  const mapCenter = useMemo<[number, number]>(() => {
    if (previewCoordinates.length > 0) {
      const latitudeAverage =
        previewCoordinates.reduce((sum, point) => sum + point[0], 0) / previewCoordinates.length
      const longitudeAverage =
        previewCoordinates.reduce((sum, point) => sum + point[1], 0) / previewCoordinates.length
      return [latitudeAverage, longitudeAverage]
    }
    if (fallbackCenter && Number.isFinite(fallbackCenter[0]) && Number.isFinite(fallbackCenter[1])) {
      return fallbackCenter
    }
    return DEFAULT_CENTER
  }, [fallbackCenter, previewCoordinates])

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 shadow-sm shadow-sky-500/20">
            <Network className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Preview the uploaded utility pipe network against the live dashboard map.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[320px] items-center justify-center bg-slate-50 text-sm text-slate-500">
          Loading utility pipe network...
        </div>
      ) : previewUrl && geojson ? (
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="h-[320px] w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={geojson}
            style={() => ({
              color: "#0f766e",
              weight: 3,
              opacity: 0.9,
            })}
          />
        </MapContainer>
      ) : (
        <div className="flex h-[320px] flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {error ? "Pipe network preview unavailable" : "Pipe network preview ready when uploaded"}
            </p>
            <p className="mt-1 text-sm text-slate-500">{error || emptyMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}
