"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { ReportStatusBadge, PriorityBadge } from "@/components/shared/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Filter,
  MapPin,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatTanzaniaDateTime } from "@/lib/date-time"

type ReportStatus = "new" | "assigned" | "in_progress" | "pending_approval" | "approved" | "rejected" | "closed"
type ReportPriority = "low" | "medium" | "high" | "critical"

const STATUS_FILTERS: { value: "all" | ReportStatus; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending_approval", label: "Awaiting DMA Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
]

const PRIORITY_FILTERS: { value: "all" | ReportPriority; label: string }[] = [
  { value: "all", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

const getReportLocationLabel = (report: {
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  districtName?: string | null
  regionName?: string | null
  dmaName?: string | null
}) => {
  if (report.address?.trim()) {
    return report.address
  }

  if (report.districtName?.trim() && report.regionName?.trim()) {
    return `${report.districtName}, ${report.regionName}`
  }

  if (report.districtName?.trim()) {
    return report.districtName
  }

  if (Number.isFinite(report.latitude) && Number.isFinite(report.longitude)) {
    return `${report.latitude!.toFixed(5)}, ${report.longitude!.toFixed(5)}`
  }

  if (report.dmaName?.trim()) {
    return report.dmaName
  }

  return "Location not available"
}

const formatReportTime = (dateString: string | undefined): string => {
  if (!dateString) return "-"
  
  try {
    const date = new Date(dateString)
    // Tanzania time is UTC+3 (East Africa Time)
    const tanzaniaTime = new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Dar_es_Salaam' }))
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Dar_es_Salaam' }))
    
    const diffMs = now.getTime() - tanzaniaTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    // Show relative time for recent items
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    // Show full Tanzania date for older items
    return formatTanzaniaDateTime(date)
  } catch {
    return "-"
  }
}

const formatReportDateLabel = (dateString: string | undefined): string => {
  if (!dateString) return "-"

  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      timeZone: "Africa/Dar_es_Salaam",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "-"
  }
}

export default function ReportsPage() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const { 
    reports, 
    fetchReports, 
    fetchTeams, 
    fetchEngineers,
  } = useDataStore()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | ReportPriority>("all")
  const [loading, setLoading] = useState(true)

  const isAdmin = currentUser?.role === "admin"
  const isUtility = currentUser?.role === "utility_manager"
  const isDMA = currentUser?.role === "dma_manager"

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const dmaId = isDMA ? currentUser?.dmaId ?? "" : undefined
      const utilityId = isUtility ? currentUser?.utilityId ?? "" : undefined
      
      await Promise.all([
        fetchReports(isDMA ? { dmaId } : isUtility ? { utilityId } : undefined),
        fetchTeams(dmaId),
        fetchEngineers(dmaId),
      ])
      setLoading(false)
    }
    loadData()
  }, [fetchReports, fetchTeams, fetchEngineers, currentUser, isDMA, isUtility])

  // Scope reports based on role
  const scopedReports = useMemo(() => {
    if (!currentUser) return []
    if (isAdmin) return reports
    if (isUtility) {
      return reports.filter((r) => r.utilityId === currentUser.utilityId)
    }
    if (isDMA) {
      return reports.filter((r) => r.dmaId === currentUser.dmaId)
    }
    return []
  }, [currentUser, isAdmin, isUtility, isDMA, reports])

  const filteredReports = useMemo(
    () => {
      const filtered = scopedReports.filter((r) => {
        const query = search.toLowerCase()
        const matchesSearch =
          !query ||
          r.trackingId.toLowerCase().includes(query) ||
          (r.description?.toLowerCase() || "").includes(query) ||
          (r.address?.toLowerCase() || "").includes(query) ||
          (r.dmaName?.toLowerCase() || "").includes(query) ||
          (r.utilityName?.toLowerCase() || "").includes(query) ||
          (r.regionName?.toLowerCase() || "").includes(query) ||
          (r.districtName?.toLowerCase() || "").includes(query)

        const matchesStatus =
          statusFilter === "all" ? true : r.status === statusFilter

        const matchesPriority =
          priorityFilter === "all" ? true : r.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
      })

      // Sort by createdAt (most recent first)
      return filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })
    },
    [scopedReports, search, statusFilter, priorityFilter]
  )

  function openDetail(report: { id: string }) {
    router.push(`/dashboard/reports/${report.id}`)
  }

  // Stats
  const totalReports = scopedReports.length
  const newReports = scopedReports.filter(r => r.status === "new").length
  const inProgressReports = scopedReports.filter(r => ["assigned", "in_progress"].includes(r.status)).length
  const pendingApproval = scopedReports.filter(r => r.status === "pending_approval").length

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Reported Leakage
            </h1>
            <p className="text-slate-500 mt-1">
              {isDMA
                ? "Assign and manage reported leakage items in your DMA"
                : isUtility
                  ? "Monitor reported leakage items across your utility"
                  : "National view of all reported leakage items"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 bg-gradient-to-br from-rose-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Reported Leakage</p>
                  <p className="text-2xl font-bold text-slate-800">{totalReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">New Reported Leakage</p>
                  <p className="text-2xl font-bold text-slate-800">{newReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 bg-gradient-to-br from-amber-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">In Progress</p>
                  <p className="text-2xl font-bold text-slate-800">{inProgressReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 bg-gradient-to-br from-violet-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Awaiting DMA Approval</p>
                  <p className="text-2xl font-bold text-slate-800">{pendingApproval}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modern Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-400/10 to-pink-500/10 blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search by tracking ID, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-rose-400 focus:ring-rose-400/20 shadow-sm"
            />
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-full sm:w-44 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
              <Filter className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
              {STATUS_FILTERS.map((s) => (
                <SelectItem key={s.value} value={s.value} className="rounded-lg">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}>
            <SelectTrigger className="w-full sm:w-36 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
              {PRIORITY_FILTERS.map((p) => (
                <SelectItem key={p.value} value={p.value} className="rounded-lg">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FileText className="h-4 w-4" />
          <span>{filteredReports.length} reported leakage item{filteredReports.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Modern Table */}
      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Live Report Queue</p>
                <p className="text-xs text-slate-500">
                  Newest reported leakage items appear first. Select any report row to open the full report page.
                </p>
              </div>
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                {filteredReports.length} visible
              </div>
            </div>
          </div>
          <div>
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/80 hover:from-slate-50 hover:to-slate-100/80 border-b border-slate-200/60">
                  <TableHead className="px-4 py-4 font-semibold text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Tracking ID
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-4 font-semibold text-slate-600 whitespace-nowrap">
                    Description
                  </TableHead>
                  <TableHead className="px-4 py-4 font-semibold text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-4 font-semibold text-slate-600 whitespace-nowrap">Status</TableHead>
                  <TableHead className="px-4 py-4 font-semibold text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Created
                    </div>
                  </TableHead>
                  <TableHead className="px-4 py-4 text-right font-semibold text-slate-600 whitespace-nowrap">Open</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800">No reported leakage found</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {search || statusFilter !== "all" || priorityFilter !== "all" 
                              ? "Try adjusting your filters" 
                              : "Reported leakage items will appear here when available"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => {
                    const isPending = report.status === "pending_approval"
                    const isNew = report.status === "new"
                    
                    return (
                      <TableRow
                        key={report.id}
                        onClick={() => openDetail(report)}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition-all duration-200",
                          isNew
                            ? "bg-blue-50/30 hover:bg-blue-50/60"
                            : isPending
                              ? "bg-violet-50/30 hover:bg-violet-50/60"
                              : "hover:bg-rose-50/60"
                        )}
                      >
                        {/* Tracking ID */}
                        <TableCell className="px-4 py-4 align-top">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg",
                              isNew
                                ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                                : isPending
                                  ? "bg-gradient-to-br from-violet-500 to-purple-600"
                                  : "bg-gradient-to-br from-rose-500 to-pink-600"
                            )}>
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div className="space-y-1">
                              <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold tracking-wide text-slate-700 whitespace-nowrap">
                                {report.trackingId}
                              </span>
                              {!isDMA && report.dmaName ? (
                                <p className="text-xs text-slate-500">{report.dmaName}</p>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell className="px-4 py-4 align-top">
                          <div className="space-y-1.5">
                            <p className="line-clamp-2 text-sm font-medium leading-6 text-slate-800">
                              {report.description || "No description"}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <PriorityBadge priority={report.priority} />
                              <span className="text-xs text-slate-500">Updated {formatReportTime(report.updatedAt)}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="px-4 py-4 align-top">
                          <div className="flex items-start gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-snug text-slate-700">
                                {getReportLocationLabel(report)}
                              </p>
                              {report.address && Number.isFinite(report.latitude) && Number.isFinite(report.longitude) ? (
                                <p className="font-mono text-xs text-slate-400">
                                  {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
                                </p>
                              ) : report.utilityName ? (
                                <p className="text-xs text-slate-400">
                                  {report.utilityName}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-4 py-4 align-top">
                          <ReportStatusBadge status={report.status} />
                        </TableCell>

                        {/* Created Time */}
                        <TableCell className="px-4 py-4 align-top">
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                            <div className="space-y-1">
                              <p className="whitespace-nowrap text-sm font-medium text-slate-700" title={formatTanzaniaDateTime(report.createdAt)}>
                                {formatReportDateLabel(report.createdAt)}
                              </p>
                              <p className="whitespace-nowrap text-xs text-slate-500">
                                {formatReportTime(report.createdAt)}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-4 align-top text-right">
                          <div className="inline-flex items-center gap-1 text-sm font-medium text-slate-400">
                            Open
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
