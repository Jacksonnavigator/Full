"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { Loader2, MapPinned } from "lucide-react"

type DateFilter = "all" | "today" | "7d" | "30d" | "90d"

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
]

function passesDateFilter(dateValue: string | undefined, filter: DateFilter) {
  if (filter === "all") return true
  if (!dateValue) return false

  const created = new Date(dateValue)
  if (Number.isNaN(created.getTime())) return false

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffMs = now.getTime() - created.getTime()
  const diffDays = diffMs / 86_400_000

  switch (filter) {
    case "today":
      return created >= startOfToday
    case "7d":
      return diffDays <= 7
    case "30d":
      return diffDays <= 30
    case "90d":
      return diffDays <= 90
    default:
      return true
  }
}

export default function MapPage() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const { utilities, dmas, reports, fetchUtilities, fetchDMAs, fetchReports } = useDataStore()

  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d")
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
          fetchReports(
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
  }, [currentUser, fetchDMAs, fetchReports, fetchUtilities, isDMA, isUtility])

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
    const base = isDMA && currentUser?.dmaId
      ? dmas.filter((dma) => dma.id === currentUser.dmaId)
      : dmas

    if (selectedUtilityId === "all") {
      return base
    }

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
      const matchesDate = passesDateFilter(report.createdAt, dateFilter)
      const matchesUtility = selectedUtilityId === "all" ? true : report.utilityId === selectedUtilityId
      const matchesDMA = selectedDMAId === "all" ? true : report.dmaId === selectedDMAId
      return matchesDate && matchesUtility && matchesDMA
    })
  }, [dateFilter, scopedReports, selectedDMAId, selectedUtilityId])

  const reportsWithCoordinates = useMemo(
    () =>
      filteredReports.filter(
        (report) =>
          Number.isFinite(report.latitude) &&
          Number.isFinite(report.longitude) &&
          !(report.latitude === 0 && report.longitude === 0)
      ),
    [filteredReports]
  )

  const activeUtilityId = useMemo(() => {
    if (selectedUtilityId !== "all") return selectedUtilityId
    if (isUtility) return currentUser?.utilityId ?? null
    return currentDMA?.utilityId ?? null
  }, [currentDMA?.utilityId, currentUser?.utilityId, isUtility, selectedUtilityId])

  const activeUtility = useMemo(
    () => utilities.find((utility) => utility.id === activeUtilityId) ?? null,
    [activeUtilityId, utilities]
  )

  const activeDMA = useMemo(
    () => dmas.find((dma) => dma.id === selectedDMAId) ?? null,
    [dmas, selectedDMAId]
  )

  const mapCenter = useMemo<[number, number] | null>(() => {
    if (
      activeDMA &&
      Number.isFinite(activeDMA.centerLatitude) &&
      Number.isFinite(activeDMA.centerLongitude)
    ) {
      return [Number(activeDMA.centerLatitude), Number(activeDMA.centerLongitude)]
    }

    if (
      activeUtility &&
      Number.isFinite(activeUtility.centerLatitude) &&
      Number.isFinite(activeUtility.centerLongitude)
    ) {
      return [Number(activeUtility.centerLatitude), Number(activeUtility.centerLongitude)]
    }

    return null
  }, [activeDMA, activeUtility])

  if (loading && !reports.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading live map...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                <MapPinned className="h-4 w-4" />
                Live map
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Leak Monitoring Map
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {activeDMA?.name || activeUtility?.name || "National operations view"} •{" "}
                {reportsWithCoordinates.length} plotted leak points
                {activeUtility?.pipeNetworkFileName ? ` • ${activeUtility.pipeNetworkFileName}` : ""}
              </p>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[140px_170px_170px_auto] xl:items-center">
            <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
              <SelectTrigger className="h-9 rounded-xl px-3 text-sm">
                <SelectValue placeholder="Date filter" />
              </SelectTrigger>
              <SelectContent>
                {DATE_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedUtilityId}
              onValueChange={setSelectedUtilityId}
              disabled={!isAdmin || !visibleUtilities.length}
            >
              <SelectTrigger className="h-9 rounded-xl px-3 text-sm">
                <SelectValue placeholder="Utility / Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All utilities</SelectItem>
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
              <SelectTrigger className="h-9 rounded-xl px-3 text-sm">
                <SelectValue placeholder="DMA / District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All DMAs</SelectItem>
                {visibleDMAs.map((dma) => (
                  <SelectItem key={dma.id} value={dma.id}>
                    {dma.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              className="h-9 justify-self-start rounded-xl px-3 text-sm xl:justify-self-end"
              onClick={() => {
                setDateFilter("30d")
                setSelectedUtilityId(
                  isUtility
                    ? currentUser?.utilityId ?? "all"
                    : isDMA
                      ? currentDMA?.utilityId ?? "all"
                      : "all"
                )
                setSelectedDMAId(isDMA ? currentUser?.dmaId ?? "all" : "all")
              }}
            >
              Reset view
            </Button>
          </div>
        </div>
      </section>

      <OperationsMap
        reports={reportsWithCoordinates.map((report) => ({
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
        networkPreviewUrl={activeUtility?.pipeNetworkPreviewUrl}
        networkFileName={activeUtility?.pipeNetworkFileName}
        title={activeDMA?.name || activeUtility?.name || "National leak monitoring map"}
        description="Switch between street and satellite, then turn the utility pipe network on only when you need it."
        onReportSelect={(reportId) => router.push(`/dashboard/reports/${reportId}`)}
      />
    </div>
  )
}
