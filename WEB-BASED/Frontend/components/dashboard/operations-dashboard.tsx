"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Loader2,
  MapPinned,
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
  tone: "slate" | "green" | "red" | "amber"
}) {
  const toneClasses = {
    slate: "border-slate-200 bg-white text-slate-950",
    green: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
    red: "border-rose-200 bg-rose-50/70 text-rose-950",
    amber: "border-amber-200 bg-amber-50/70 text-amber-950",
  } as const

  const iconClasses = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    amber: "bg-amber-100 text-amber-700",
  } as const

  return (
    <div className={cn("rounded-[24px] border px-4 py-4 shadow-sm", toneClasses[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value.toLocaleString()}</p>
        </div>
        <div className={cn("rounded-2xl p-2.5", iconClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
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

  // Refetch reports when admin changes filters
  useEffect(() => {
    if (!isAdmin) return
    if (selectedUtilityId === "all" && selectedDMAId === "all") return

    const filters = {
      utilityId: selectedUtilityId === "all" ? undefined : selectedUtilityId,
      dmaId: selectedDMAId === "all" ? undefined : selectedDMAId,
    }

    setLoading(true)
    void fetchReportsForMap(
      Object.values(filters).some((v) => v !== undefined) ? (filters as any) : undefined
    ).finally(() => setLoading(false))
  }, [isAdmin, selectedUtilityId, selectedDMAId, fetchReportsForMap])

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
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading leakage dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
              <MapPinned className="h-4 w-4" />
              Leakage reporting dashboard
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{scopeTitle}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {orgLabel} · {mapReports.length.toLocaleString()} leak
              {mapReports.length === 1 ? "" : "s"} with GPS on the map
              {!allMapReportsLoaded ? ` · loading ${reports.length.toLocaleString()} records` : ""}
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[180px_180px]">
            <Select
              value={selectedUtilityId}
              onValueChange={setSelectedUtilityId}
              disabled={!isAdmin || !visibleUtilities.length}
            >
              <SelectTrigger className="h-10 rounded-2xl border-slate-200 bg-white px-3 text-sm">
                <SelectValue placeholder="Utility / Region" />
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

            <Select value={selectedDMAId} onValueChange={setSelectedDMAId} disabled={isDMA || !visibleDMAs.length}>
              <SelectTrigger className="h-10 rounded-2xl border-slate-200 bg-white px-3 text-sm">
                <SelectValue placeholder="DMA / District" />
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
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <KpiCard label="Total Leak Reports" value={kpis.total} icon={Droplets} tone="slate" />
          <KpiCard label="Leaks Repaired" value={kpis.repaired} icon={CheckCircle2} tone="green" />
          <KpiCard label="Urgent Leaks" value={kpis.urgent} icon={Siren} tone="amber" />
          <KpiCard label="Unattended Leaks" value={kpis.unattended} icon={AlertTriangle} tone="red" />

          <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:col-span-2 xl:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Map legend</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                Open / rejected
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-500" />
                Pending approval
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                Repaired (approved / closed)
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                Pipe network
              </div>
            </div>
          </div>
        </aside>

        <section className="min-h-[520px]">
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
<<<<<<< HEAD
            description={`${kpis.total.toLocaleString()} reports in scope`}
            basemap="street"
=======
            description={`${kpis.total.toLocaleString()} reports in current scope`}
            basemap="satellite"
>>>>>>> parent of 5ba0136 (new)
            chromeMode="command-center"
            boundsFitKey={mapFitKey}
            onReportSelect={(reportId) => router.push(`/dashboard/reports/${reportId}`)}
          />
        </section>
      </div>
    </div>
  )
}
