"use client"

import dynamic from "next/dynamic"
import type { GeoJsonObject } from "geojson"

const OperationsMapInner = dynamic(
  () => import("./operations-map-impl").then((module) => module.OperationsMapImpl),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[640px] items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 text-sm text-slate-500">
        Loading operations map...
      </div>
    ),
  }
)

export interface OperationsMapReport {
  id: string
  trackingId: string
  description: string
  latitude: number
  longitude: number
  status: string
  priority?: string | null
  dmaName?: string | null
  utilityName?: string | null
  regionName?: string | null
  districtName?: string | null
  address?: string | null
  reporterName?: string | null
}

export function OperationsMap(props: {
  reports: OperationsMapReport[]
  center?: [number, number] | null
  boundaryGeojson?: GeoJsonObject | null
  networkPreviewUrl?: string | null
  networkFileName?: string | null
  title?: string
  description?: string
  basemap?: "street" | "satellite"
  onBasemapChange?: (basemap: "street" | "satellite") => void
  onReportSelect?: (reportId: string) => void
  chromeMode?: "standard" | "command-center"
}) {
  return <OperationsMapInner {...props} />
}
