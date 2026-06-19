"use client"

import { useEffect, useMemo, useState } from "react"
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet"
import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import type { LatLngBoundsExpression } from "leaflet"
import * as L from "leaflet"
import { AlertTriangle, Network } from "lucide-react"
import CONFIG from "@/lib/config"

const DEFAULT_CENTER: [number, number] = [-6.7924, 39.2083]

function describePreviewIssue(error: string | null, fileName?: string | null) {
  if (!error) {
    return {
      title: "Pipe network preview ready when uploaded",
      detail: "Upload a supported utility pipe network file to preview it on the map.",
    }
  }

  const normalized = error.toLowerCase()
  const fileLabel = fileName ? `Saved file: ${fileName}. ` : ""

  if (normalized.includes("decoded")) {
    return {
      title: "Saved file could not be read",
      detail: `${fileLabel}Re-export it as UTF-8 GeoJSON, KML, CSV, or TXT, then upload it again.`,
    }
  }

  if (normalized.includes("parsed")) {
    return {
      title: "Saved file structure is invalid",
      detail: `${fileLabel}The uploaded network file could not be parsed. Re-export the map file from the source GIS tool and replace it here.`,
    }
  }

  if (normalized.includes("did not contain previewable geometry")) {
    return {
      title: "No map geometry was found",
      detail: `${fileLabel}The file is saved, but it does not contain previewable pipe lines or points. Confirm the export includes actual network geometry before uploading again.`,
    }
  }

  if (normalized.includes("converted into previewable map features")) {
    return {
      title: "Saved file is not map-ready yet",
      detail: `${fileLabel}The file format was accepted for storage, but its contents could not be turned into map features. Download it to inspect the export or replace it with a cleaner GIS file.`,
    }
  }

  return {
    title: "Uploaded pipe network could not be previewed",
    detail: `${fileLabel}${error} Download the saved file to inspect it or replace it with a cleaner GIS export.`,
  }
}

type GeometryCoordinates =
  | [number, number]
  | number[]
  | GeometryCoordinates[]

const ASSET_SYMBOLS: Record<string, { color: string; svg: string }> = {
  valves: {
    color: "#e11d48",
    svg: '<path d="M5 8.5h3.2l2.3 2.1 2.3-2.1H16v7h-3.2l-2.3-2.1-2.3 2.1H5v-7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10.5 6.2v3.6M8.5 6.2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
  water_sources: {
    color: "#0284c7",
    svg: '<path d="M10.5 3.8c2.8 3.1 4.2 5.3 4.2 7.3a4.2 4.2 0 1 1-8.4 0c0-2 1.4-4.2 4.2-7.3Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  },
  storage_facilities: {
    color: "#d97706",
    svg: '<path d="M5.5 7.2c0-1.2 2.2-2.2 5-2.2s5 1 5 2.2v7.6c0 1.2-2.2 2.2-5 2.2s-5-1-5-2.2V7.2Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M15.5 7.2c0 1.2-2.2 2.2-5 2.2s-5-1-5-2.2" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  },
  bulk_meters: {
    color: "#7c3aed",
    svg: '<path d="M5 13a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10.5 12.8 13 9.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7.2 15.6h6.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  },
}

function getAssetColor(assetType?: string | null) {
  return ASSET_SYMBOLS[assetType || ""]?.color || "#0f766e"
}

function createAssetDivIcon(assetType?: string | null) {
  const symbol = ASSET_SYMBOLS[assetType || ""] || ASSET_SYMBOLS.valves
  return L.divIcon({
    className: "majiscope-asset-div-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
    html: `<span style="--asset-color:${symbol.color}" class="majiscope-asset-marker"><svg viewBox="0 0 21 21" aria-hidden="true">${symbol.svg}</svg></span>`,
  })
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
  const aliases: Record<string, string> = {
    assetid: "Asset ID",
    asset_id: "Asset ID",
    source_file: "Source file",
    source_table: "Layer",
    asset_type: "Asset type",
    asset_label: "Asset",
  }
  return aliases[key.toLowerCase()] || key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function buildFeaturePopupHtml(feature: Feature, title: string) {
  const rawProperties = feature.properties
  const entries = Object.entries(
    rawProperties && typeof rawProperties === "object" ? rawProperties : {}
  ).filter(([, value]) => value !== null && value !== "")

  const rows = entries.slice(0, 18).map(([key, value]) => (
    `<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;border-bottom:1px solid #e2e8f0;padding:5px 0;">
      <span style="font-size:11px;color:#64748b;">${escapeHtml(formatPropertyLabel(key))}</span>
      <span style="font-size:11px;color:#0f172a;font-weight:700;text-align:right;max-width:220px;word-break:break-word;">${escapeHtml(String(value))}</span>
    </div>`
  ))

  return `<div style="width:300px;max-height:260px;overflow:auto;font-family:Inter,ui-sans-serif,system-ui;">
    <div style="position:sticky;top:0;background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:9px 10px;margin:-4px -4px 8px;">
      <div style="font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#0f172a;">${escapeHtml(title)}</div>
      <div style="font-size:11px;color:#64748b;margin-top:2px;">Attributes from uploaded GIS file</div>
    </div>
    ${rows.length ? `<div style="display:grid;gap:2px;">${rows.join("")}</div>` : '<div style="font-size:12px;color:#64748b;">No attribute data was included for this feature.</div>'}
  </div>`
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

function FitPreviewToData({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap()

  useEffect(() => {
    if (!bounds) return
    map.fitBounds(bounds, {
      padding: [34, 34],
      maxZoom: 15,
      animate: false,
    })
  }, [bounds, map])

  return null
}

export function UtilityPipeNetworkMapImpl({
  utilityId,
  previewUrl,
  fallbackCenter,
  fileName,
  assetType = "pipe_network",
  mapHeightClassName = "h-[320px]",
  title = "Utility Pipe Network",
  emptyMessage = "Upload a supported utility pipe network file to preview it on the map.",
}: {
  utilityId: string
  previewUrl?: string | null
  fallbackCenter?: [number, number] | null
  fileName?: string | null
  assetType?: string
  mapHeightClassName?: string
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
        const response = await fetch(`${CONFIG.backend.baseUrl}${previewUrl}`, {
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

  const previewMessage = useMemo(() => {
    if (error) {
      return describePreviewIssue(error, fileName)
    }

    return {
      title: "Pipe network preview ready when uploaded",
      detail: emptyMessage,
    }
  }, [emptyMessage, error, fileName])

  const fitBounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (!previewCoordinates.length) return null
    if (previewCoordinates.length === 1) {
      const [lat, lng] = previewCoordinates[0]
      return [
        [lat - 0.01, lng - 0.01],
        [lat + 0.01, lng + 0.01],
      ]
    }
    return previewCoordinates
  }, [previewCoordinates])

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
        <div className={`flex ${mapHeightClassName} items-center justify-center bg-slate-50 text-sm text-slate-500`}>
          Loading utility pipe network...
        </div>
      ) : previewUrl && geojson ? (
        <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className={`${mapHeightClassName} w-full`}>
          <FitPreviewToData bounds={fitBounds} />
          <style jsx global>{`
            .majiscope-asset-div-icon {
              background: transparent;
              border: 0;
            }

            .majiscope-asset-marker {
              display: flex;
              height: 28px;
              width: 28px;
              align-items: center;
              justify-content: center;
              border-radius: 9999px;
              background: color-mix(in srgb, var(--asset-color) 92%, white);
              color: white;
              border: 2px solid rgba(255, 255, 255, 0.96);
              box-shadow: 0 10px 22px -12px rgba(15, 23, 42, 0.82);
            }

            .majiscope-asset-marker svg {
              height: 19px;
              width: 19px;
              filter: drop-shadow(0 1px 0 rgba(15, 23, 42, 0.18));
            }
          `}</style>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxNativeZoom={18}
            maxZoom={19}
            keepBuffer={6}
            updateWhenIdle={false}
            detectRetina
          />
          <GeoJSON
            data={geojson}
            pointToLayer={(_, latlng) =>
              assetType === "pipe_network"
                ? L.circleMarker(latlng, {
                    radius: 3,
                    fillColor: "#0f766e",
                    color: "#ffffff",
                    weight: 1.5,
                    fillOpacity: 0.9,
                  })
                : L.marker(latlng, { icon: createAssetDivIcon(assetType) })
            }
            style={() => ({
              color: getAssetColor(assetType),
              weight: assetType === "pipe_network" ? 3 : 2,
              opacity: 0.9,
              fillColor: getAssetColor(assetType),
              fillOpacity: assetType === "pipe_network" ? 0.08 : 0.16,
            })}
            onEachFeature={(feature, layer) => {
              if (!feature) return
              if ("bindPopup" in layer && typeof layer.bindPopup === "function") {
                layer.bindPopup(buildFeaturePopupHtml(feature as Feature, title))
              }
            }}
          />
        </MapContainer>
      ) : (
        <div className={`flex ${mapHeightClassName} flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {previewMessage.title}
            </p>
            <p className="mt-1 text-sm text-slate-500">{previewMessage.detail}</p>
          </div>
        </div>
      )}
    </div>
  )
}
