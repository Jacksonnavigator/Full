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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

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
    slate: "border-slate-300/80 bg-slate-100/85 text-slate-950",
    green: "border-emerald-200/80 bg-emerald-50/55 text-emerald-950",
    red: "border-rose-200/80 bg-rose-50/55 text-rose-950",
    amber: "border-amber-200/80 bg-amber-50/55 text-amber-950",
  } as const

  const iconClasses = {
    slate: "bg-slate-300/65 text-slate-700",
    green: "bg-emerald-100/75 text-emerald-700",
    red: "bg-rose-100/75 text-rose-700",
    amber: "bg-amber-100/75 text-amber-700",
  } as const

  return (
    <div className={cn("rounded-[20px] border px-3 py-3 shadow-sm shadow-slate-900/[0.03]", toneClasses[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value.toLocaleString()}</p>
        </div>
        <div className={cn("rounded-xl p-2", iconClasses[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

type ComparisonBarRow = {
  label: string
  reported: number
  resolved: number
}

function ComparisonBarChartCard({
  title,
  subtitle,
  rows,
}: {
  title: string
  subtitle: string
  rows: ComparisonBarRow[]
}) {
  const maxValue = Math.max(...rows.flatMap((row) => [row.reported, row.resolved]), 1)
  const formatAxisLabel = (value: string) => (value.length > 18 ? `${value.slice(0, 17)}…` : value)
  const chartData = rows.map((row) => ({
    name: row.label,
    reported: row.reported,
    resolved: row.resolved,
  }))
  const chartHeight = Math.max(270, Math.min(560, rows.length * 52 + 98))

  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-300/80 bg-slate-100/85 shadow-sm shadow-slate-900/[0.025]">
      <div className="border-b border-slate-200 px-3 py-2.5">
        <div>
          <p className="text-xs font-semibold text-slate-900">{title}</p>
          <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto px-2 py-3">
        {rows.length ? (
          <div style={{ height: chartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 8, left: -10, bottom: 8 }}
                barCategoryGap={12}
                barGap={2}
              >
                <CartesianGrid stroke="#dbe3ee" horizontal vertical />
                <XAxis
                  type="number"
                  domain={[0, Math.ceil(maxValue * 1.05)]}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={108}
                  tick={{ fontSize: 10, fill: "#334155" }}
                  tickFormatter={formatAxisLabel}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                  contentStyle={{
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    borderRadius: 10,
                    color: "#0f172a",
                  }}
                  formatter={(value: number, name: string) => [
                    value.toLocaleString(),
                    name === "reported" ? "Reported" : "Resolved",
                  ]}
                  labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, color: "#475569", paddingTop: 8 }}
                  formatter={(value) => (value === "reported" ? "Reported" : "Resolved")}
                />
                <Bar dataKey="reported" fill="#7c3aed" radius={0} barSize={8} />
                <Bar dataKey="resolved" fill="#15803d" radius={0} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
            No reports available for this scope yet.
          </div>
        )}
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
    initialized,
    fetchUtilities,
    fetchDMAs,
    fetchReportsForMap,
  } = useDataStore()

  const [loading, setLoading] = useState(true)
  const [selectedUtilityId, setSelectedUtilityId] = useState("all")
  const [selectedDMAId, setSelectedDMAId] = useState("all")
  const [basemap, setBasemap] = useState<"street" | "satellite">("street")

  const isAdmin = currentUser?.role === "admin"
  const isUtility = currentUser?.role === "utility_manager"
  const isDMA = currentUser?.role === "dma_manager"

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return

      setLoading(true)
      try {
        await fetchUtilities()
        await Promise.all([
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

  const comparisonRows = useMemo<ComparisonBarRow[]>(() => {
    const isResolved = (status: string) => status === "approved" || status === "closed"

    if (isAdmin) {
      const rows = new Map<string, ComparisonBarRow>()

      utilities.forEach((utility) => {
        rows.set(utility.id, {
          label: utility.name,
          reported: 0,
          resolved: 0,
        })
      })

      scopedReports.forEach((report) => {
        const key = report.utilityId || `utility:${report.utilityName || "Unassigned utility"}`
        const current =
          rows.get(key) ??
          {
            label: report.utilityName || "Unassigned utility",
            reported: 0,
            resolved: 0,
          }

        current.reported += 1
        if (isResolved(report.status)) current.resolved += 1
        rows.set(key, current)
      })

      return Array.from(rows.values()).sort((left, right) => right.reported - left.reported)
    }

    if (isUtility && currentUser?.utilityId) {
      const rows = new Map<string, ComparisonBarRow>()

      dmas
        .filter((dma) => dma.utilityId === currentUser.utilityId)
        .forEach((dma) => {
          rows.set(dma.id, {
            label: dma.name,
            reported: 0,
            resolved: 0,
          })
        })

      scopedReports.forEach((report) => {
        const key = report.dmaId || `dma:${report.dmaName || "Unassigned DMA"}`
        const current =
          rows.get(key) ??
          {
            label: report.dmaName || "Unassigned DMA",
            reported: 0,
            resolved: 0,
          }

        current.reported += 1
        if (isResolved(report.status)) current.resolved += 1
        rows.set(key, current)
      })

      return Array.from(rows.values()).sort((left, right) => right.reported - left.reported)
    }

    if (isDMA) {
      return [
        {
          label: currentDMA?.name || "Current DMA",
          reported: scopedReports.length,
          resolved: scopedReports.filter((report) => isResolved(report.status)).length,
        },
      ]
    }

    return []
  }, [currentDMA?.name, currentUser?.utilityId, dmas, isAdmin, isDMA, isUtility, scopedReports, utilities])

  const comparisonSubtitle = isAdmin
    ? "Reported vs resolved per utility"
    : isUtility
      ? "Reported vs resolved per DMA"
      : "Reported vs resolved"

  const activeDMA = useMemo(
    () => dmas.find((dma) => dma.id === selectedDMAId) ?? null,
    [dmas, selectedDMAId]
  )

  const visibleBoundaryGeojsons = useMemo(() => {
    if (selectedDMAId !== "all") return []
    return visibleDMAs
      .map((dma) => dma.boundaryGeojson)
      .filter((geojson): geojson is NonNullable<typeof geojson> => Boolean(geojson))
  }, [selectedDMAId, visibleDMAs])

  const activeUtilityId = useMemo(() => {
    if (selectedUtilityId !== "all") return selectedUtilityId
    if (activeDMA?.utilityId) return activeDMA.utilityId
    if (isUtility) return currentUser?.utilityId ?? null
    if (isDMA) return currentDMA?.utilityId ?? null
    return visibleUtilities.length === 1 ? visibleUtilities[0].id : null
  }, [
    activeDMA?.utilityId,
    currentDMA?.utilityId,
    currentUser?.utilityId,
    isDMA,
    isUtility,
    selectedUtilityId,
    visibleUtilities,
  ])

  const activeUtility = useMemo(
    () => utilities.find((utility) => utility.id === activeUtilityId) ?? null,
    [activeUtilityId, utilities]
  )

  const activeNetworkPreviewUrl = useMemo(() => {
    if (!activeUtility?.pipeNetworkPreviewUrl) return null
    if (!activeDMA?.id || !activeDMA.boundaryGeojson) return activeUtility.pipeNetworkPreviewUrl

    const separator = activeUtility.pipeNetworkPreviewUrl.includes("?") ? "&" : "?"
    return `${activeUtility.pipeNetworkPreviewUrl}${separator}dma_id=${encodeURIComponent(activeDMA.id)}`
  }, [activeDMA?.boundaryGeojson, activeDMA?.id, activeUtility?.pipeNetworkPreviewUrl])

  const networkPreviewUrls = useMemo(() => {
    if (activeNetworkPreviewUrl) return [activeNetworkPreviewUrl]
    if (!isAdmin || selectedUtilityId !== "all" || selectedDMAId !== "all") return []

    return utilities
      .map((utility) => utility.pipeNetworkPreviewUrl)
      .filter((url): url is string => Boolean(url))
  }, [activeNetworkPreviewUrl, isAdmin, selectedDMAId, selectedUtilityId, utilities])

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

    const filters = {
      utilityId: selectedUtilityId === "all" ? undefined : selectedUtilityId,
      dmaId: selectedDMAId === "all" ? undefined : selectedDMAId,
    }

    setLoading(true)
    void fetchReportsForMap(
      Object.values(filters).some((v) => v !== undefined) ? (filters as any) : undefined
    ).finally(() => setLoading(false))
  }, [fetchReportsForMap, initialized, isAdmin, selectedDMAId, selectedUtilityId])

  const scopeTitle = activeDMA?.name || activeUtility?.name || "National Leak Monitoring"
  const orgLabel =
    activeUtility?.name ||
    (isAdmin ? "All utilities and DMAs" : currentUser?.name || "Operations view")

  const allMapReportsLoaded = reportsListTotal === null || reports.length >= reportsListTotal

  const mapFitKey = useMemo(
    () => [selectedUtilityId, selectedDMAId, mapReports.length, activeDMA?.id ?? "none", visibleBoundaryGeojsons.length].join("|"),
    [activeDMA?.id, mapReports.length, selectedDMAId, selectedUtilityId, visibleBoundaryGeojsons.length]
  )

  if (loading && !reports.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-card px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading leakage dashboard...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[28px] border border-slate-300/80 bg-slate-100/85 px-4 py-4 shadow-sm shadow-slate-900/[0.025] backdrop-blur">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
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
              <SelectTrigger className="h-10 rounded-2xl border-slate-300 bg-slate-100 px-3 text-sm">
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
              <SelectTrigger className="h-10 rounded-2xl border-slate-300 bg-slate-100 px-3 text-sm">
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

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[168px_minmax(0,1fr)_260px]">
        <aside className="grid gap-3 sm:grid-cols-2 xl:w-[168px] xl:grid-cols-1">
          <KpiCard label="Total Leak Reports" value={kpis.total} icon={Droplets} tone="slate" />
          <KpiCard label="Leaks Repaired" value={kpis.repaired} icon={CheckCircle2} tone="green" />
          <KpiCard label="Urgent Leaks" value={kpis.urgent} icon={Siren} tone="amber" />
          <KpiCard label="Unattended Leaks" value={kpis.unattended} icon={AlertTriangle} tone="red" />

          <div className="rounded-[20px] border border-slate-300/80 bg-slate-100/85 px-3 py-3 shadow-sm shadow-slate-900/[0.025] sm:col-span-2 xl:col-span-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Map legend</p>
            <div className="mt-3 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                Open / rejected
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                Pending approval
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Repaired (approved / closed)
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
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
            boundaryGeojsons={visibleBoundaryGeojsons}
            networkPreviewUrl={activeNetworkPreviewUrl}
            networkPreviewUrls={networkPreviewUrls}
            networkFileName={activeUtility?.pipeNetworkFileName}
            title={scopeTitle}
            description={`${kpis.total.toLocaleString()} reports in current scope`}
            basemap={basemap}
            onBasemapChange={setBasemap}
            chromeMode="command-center"
            boundsFitKey={mapFitKey}
            onReportSelect={(reportId) => router.push(`/dashboard/reports/${reportId}`)}
          />
        </section>

        <aside className="grid gap-3">
          <ComparisonBarChartCard
            title="Reported vs resolved"
            subtitle={comparisonSubtitle}
            rows={comparisonRows}
          />
        </aside>
      </div>
    </div>
  )
}
