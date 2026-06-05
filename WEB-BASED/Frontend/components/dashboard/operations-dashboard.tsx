"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Loader2,
  Siren,
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { OperationsMap } from "@/components/maps/operations-map"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  computeLeakKpis,
  hasUsableCoordinates,
} from "@/lib/report-metrics"

function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  icon: typeof Droplets
  tone: "neutral" | "green" | "amber" | "red"
}) {
  const styles = {
    neutral: {
      card: "bg-white border-slate-300 text-slate-950",
      value: "text-slate-950",
      icon: "bg-slate-100 text-slate-600",
    },
    green: {
      card: "bg-white border-emerald-300 text-emerald-950",
      value: "text-emerald-600",
      icon: "bg-emerald-50 text-emerald-600",
    },
    amber: {
      card: "bg-white border-amber-300 text-amber-950",
      value: "text-amber-600",
      icon: "bg-amber-50 text-amber-600",
    },
    red: {
      card: "bg-white border-rose-300 text-rose-950",
      value: "text-rose-600",
      icon: "bg-rose-50 text-rose-600",
    },
  } as const

  const palette = styles[tone]

  return (
    <div
      className={cn(
        "flex min-h-[92px] flex-1 flex-col justify-between rounded-md border px-3 py-3 shadow-sm",
        palette.card
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-slate-500">
          {label}
        </p>
        <div className={cn("rounded-md p-1.5", palette.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className={cn("text-[2rem] font-bold leading-none tracking-tight", palette.value)}>
        {value.toLocaleString()}
      </p>
    </div>
  )
}

export function OperationsDashboard() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const {
    utilities,
    dmas,
    reports,
    reportsListTotal,
    fetchUtilities,
    fetchDMAs,
    fetchReportsForMap,
  } = useDataStore()

  const [loading, setLoading] = useState(true)
  const [selectedUtilityId, setSelectedUtilityId] = useState("all")
  const [selectedDMAId, setSelectedDMAId] = useState("all")

  const isAdmin = currentUser?.role === "admin"
  const isUtility = currentUser?.role === "utility_manager"
  const isDMA = currentUser?.role === "dma_manager"

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return

      setLoading(true)
      try {
        await Promise.all([
          fetchUtilities(),
          fetchDMAs(isUtility ? currentUser.utilityId ?? undefined : undefined),
          fetchReportsForMap(
            isDMA
              ? { dmaId: currentUser.dmaId ?? "" }
              : isUtility
                ? { utilityId: currentUser.utilityId ?? "" }
                : undefined
          ),
        ])
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [currentUser, fetchDMAs, fetchReportsForMap, fetchUtilities, isDMA, isUtility])

  const currentDMA = useMemo(
    () => dmas.find((dma) => dma.id === currentUser?.dmaId) ?? null,
    [currentUser?.dmaId, dmas]
  )

  useEffect(() => {
    if (isUtility && currentUser?.utilityId) {
      setSelectedUtilityId(currentUser.utilityId)
    }
  }, [currentUser?.utilityId, isUtility])

  useEffect(() => {
    if (isDMA && currentUser?.dmaId) {
      setSelectedDMAId(currentUser.dmaId)
      if (currentDMA?.utilityId) {
        setSelectedUtilityId(currentDMA.utilityId)
      }
    }
  }, [currentDMA?.utilityId, currentUser?.dmaId, isDMA])

  const visibleUtilities = useMemo(() => {
    if (isUtility && currentUser?.utilityId) {
      return utilities.filter((utility) => utility.id === currentUser.utilityId)
    }
    if (isDMA && currentDMA?.utilityId) {
      return utilities.filter((utility) => utility.id === currentDMA.utilityId)
    }
    return utilities
  }, [currentDMA?.utilityId, currentUser?.utilityId, isDMA, isUtility, utilities])

  const visibleDMAs = useMemo(() => {
    const base =
      isDMA && currentUser?.dmaId
        ? dmas.filter((dma) => dma.id === currentUser.dmaId)
        : dmas

    if (selectedUtilityId === "all") return base
    return base.filter((dma) => dma.utilityId === selectedUtilityId)
  }, [currentUser?.dmaId, dmas, isDMA, selectedUtilityId])

  useEffect(() => {
    if (selectedDMAId !== "all" && !visibleDMAs.some((dma) => dma.id === selectedDMAId)) {
      setSelectedDMAId("all")
    }
  }, [selectedDMAId, visibleDMAs])

  const scopedReports = useMemo(() => {
    if (!currentUser) return []
    if (isAdmin) return reports
    if (isUtility && currentUser.utilityId) {
      return reports.filter((report) => report.utilityId === currentUser.utilityId)
    }
    if (isDMA && currentUser.dmaId) {
      return reports.filter((report) => report.dmaId === currentUser.dmaId)
    }
    return []
  }, [currentUser, isAdmin, isDMA, isUtility, reports])

  const filteredReports = useMemo(() => {
    return scopedReports.filter((report) => {
      const matchesUtility = selectedUtilityId === "all" ? true : report.utilityId === selectedUtilityId
      const matchesDMA = selectedDMAId === "all" ? true : report.dmaId === selectedDMAId
      return matchesUtility && matchesDMA
    })
  }, [scopedReports, selectedDMAId, selectedUtilityId])

  const mapReports = useMemo(
    () => filteredReports.filter(hasUsableCoordinates),
    [filteredReports]
  )

  const kpis = useMemo(() => computeLeakKpis(filteredReports), [filteredReports])

  const activeUtility = useMemo(
    () => utilities.find((utility) => utility.id === selectedUtilityId) ?? null,
    [selectedUtilityId, utilities]
  )

  const activeDMA = useMemo(
    () => dmas.find((dma) => dma.id === selectedDMAId) ?? null,
    [dmas, selectedDMAId]
  )

  const activeNetworkPreviewUrl = useMemo(() => {
    const utility = activeUtility ?? visibleUtilities[0] ?? null
    if (!utility?.pipeNetworkPreviewUrl) return null
    if (!activeDMA?.id || !activeDMA.boundaryGeojson) return utility.pipeNetworkPreviewUrl

    const params = new URLSearchParams()
    params.set("dma_id", activeDMA.id)
    return `${utility.pipeNetworkPreviewUrl}?${params}`
  }, [activeDMA, activeUtility, visibleUtilities])

  const mapCenter = useMemo<[number, number] | null>(() => {
    if (activeDMA?.centerLatitude != null && activeDMA?.centerLongitude != null) {
      return [activeDMA.centerLatitude, activeDMA.centerLongitude]
    }
    if (activeUtility?.centerLatitude != null && activeUtility?.centerLongitude != null) {
      return [activeUtility.centerLatitude, activeUtility.centerLongitude]
    }
    if (mapReports.length) {
      const lat = mapReports.reduce((sum, report) => sum + report.latitude, 0) / mapReports.length
      const lng = mapReports.reduce((sum, report) => sum + report.longitude, 0) / mapReports.length
      return [lat, lng]
    }
    return null
  }, [activeDMA, activeUtility, mapReports])

  const scopeTitle = activeDMA?.name || activeUtility?.name || "National Leak Monitoring"
  const orgLabel =
    activeUtility?.name ||
    (isAdmin ? "All utilities and DMAs" : currentUser?.name || "Operations view")

  const allMapReportsLoaded = reportsListTotal === null || reports.length >= reportsListTotal

  const mapFitKey = useMemo(
    () => [selectedUtilityId, selectedDMAId, mapReports.length, activeDMA?.id ?? "none"].join("|"),
    [activeDMA?.id, mapReports.length, selectedDMAId, selectedUtilityId]
  )

  if (loading && !reports.length) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center bg-slate-200">
        <div className="flex items-center gap-3 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading leakage dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-200">
      {/* ArcGIS-style title bar */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-300 bg-slate-100 px-4 py-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-slate-900">{scopeTitle}</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            {orgLabel} · {mapReports.length.toLocaleString()} leaks with GPS on the map
            {!allMapReportsLoaded ? ` · loading ${reports.length.toLocaleString()} records` : ""}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Select
            value={selectedUtilityId}
            onValueChange={setSelectedUtilityId}
            disabled={!isAdmin || !visibleUtilities.length}
          >
            <SelectTrigger className="h-9 w-[168px] rounded-md border-slate-300 bg-white text-sm shadow-sm">
              <SelectValue placeholder="Utility" />
            </SelectTrigger>
            <SelectContent className="z-[5000]">
              {isAdmin ? <SelectItem value="all">All utilities</SelectItem> : null}
              {visibleUtilities.map((utility) => (
                <SelectItem key={utility.id} value={utility.id}>
                  {utility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDMAId}
            onValueChange={setSelectedDMAId}
            disabled={isDMA || !visibleDMAs.length}
          >
            <SelectTrigger className="h-9 w-[168px] rounded-md border-slate-300 bg-white text-sm shadow-sm">
              <SelectValue placeholder="DMA" />
            </SelectTrigger>
            <SelectContent className="z-[5000]">
              {!isDMA ? <SelectItem value="all">All DMAs</SelectItem> : null}
              {visibleDMAs.map((dma) => (
                <SelectItem key={dma.id} value={dma.id}>
                  {dma.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* ArcGIS-style body: narrow KPI rail + dominant map */}
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[15%] min-w-[200px] max-w-[240px] shrink-0 flex-col gap-2 border-r border-slate-300 bg-slate-200 p-2">
          <KpiCard label="Total Leak Reports" value={kpis.total} icon={Droplets} tone="neutral" />
          <KpiCard label="Leaks Repaired" value={kpis.repaired} icon={CheckCircle2} tone="green" />
          <KpiCard label="Urgent Leaks" value={kpis.urgent} icon={Siren} tone="amber" />
          <KpiCard label="Unattended Leaks" value={kpis.unattended} icon={AlertTriangle} tone="red" />

          <div className="mt-auto rounded-md border border-slate-300 bg-white px-3 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Map legend</p>
            <div className="mt-2 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Open / rejected
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                Pending approval
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Repaired
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Pipe network
              </div>
            </div>
          </div>
        </aside>

        <section className="relative min-h-0 min-w-0 flex-1">
          <OperationsMap
            reports={mapReports.map((report) => ({
              id: report.id,
              trackingId: report.trackingId,
              description: report.description,
              latitude: report.latitude,
              longitude: report.longitude,
              status: report.status,
              priority: report.priority,
              dmaName: report.dmaName,
              utilityName: report.utilityName,
              regionName: report.regionName,
              districtName: report.districtName,
              address: report.address,
              reporterName: report.reporterName,
            }))}
            center={mapCenter}
            boundaryGeojson={activeDMA?.boundaryGeojson ?? null}
            networkPreviewUrl={activeNetworkPreviewUrl}
            networkFileName={activeUtility?.pipeNetworkFileName ?? visibleUtilities[0]?.pipeNetworkFileName}
            title={scopeTitle}
            description={`${kpis.total.toLocaleString()} reports in scope`}
            basemap="satellite"
            chromeMode="command-center"
            boundsFitKey={mapFitKey}
            fillHeight
            showLegend={false}
            onReportSelect={(reportId) => router.push(`/dashboard/reports/${reportId}`)}
          />
        </section>
      </div>
    </div>
  )
}
