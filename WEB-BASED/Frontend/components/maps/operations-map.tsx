"use client"

import dynamic from "next/dynamic"
import type { GeoJsonObject } from "geojson"

const OperationsMapInner = dynamic(
  () => import("./operations-map-impl").then((module) => module.OperationsMapImpl),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-slate-300 text-sm text-slate-600">
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
  boundsFitKey?: string
  fillHeight?: boolean
  showLegend?: boolean
}) {
  return <OperationsMapInner {...props} />
}
