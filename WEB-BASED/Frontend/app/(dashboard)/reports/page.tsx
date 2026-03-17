"use client"

import { useMemo, useState, useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore, type Report, type Team, type Engineer } from "@/store/data-store"
import { ReportStatusBadge, PriorityBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  MoreHorizontal,
  ClipboardCheck,
  UserCog,
  Users,
  MapPin,
  AlertTriangle,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Eye,
  Pencil,
  CheckCheck,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"

type ReportStatus = "new" | "assigned" | "in_progress" | "pending_approval" | "approved" | "rejected" | "closed"
type ReportPriority = "low" | "medium" | "high" | "critical"

const STATUS_FILTERS: { value: "all" | ReportStatus; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
]

const PRIORITY_FILTERS: { value: "all" | ReportPriority; label: string }[] = [
  { value: "all", label: "All Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

export default function ReportsPage() {
  const { currentUser } = useAuthStore()
  const { 
    reports, 
    teams, 
    engineers, 
    fetchReports, 
    fetchTeams, 
    fetchEngineers,
  } = useDataStore()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | ReportPriority>("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      await Promise.all([
        fetchReports(),
        fetchTeams(),
        fetchEngineers(),
      ])
      setLoading(false)
    }
    loadData()
  }, [fetchReports, fetchTeams, fetchEngineers])

  const isAdmin = currentUser?.role === "admin"
  const isUtility = currentUser?.role === "utility_manager"
  const isDMA = currentUser?.role === "dma_manager"

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
    () =>
      scopedReports.filter((r) => {
        const query = search.toLowerCase()
        const matchesSearch =
          !query ||
          r.trackingId.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          (r.address?.toLowerCase() || "").includes(query) ||
          r.dmaName.toLowerCase().includes(query)

        const matchesStatus =
          statusFilter === "all" ? true : r.status === statusFilter

        const matchesPriority =
          priorityFilter === "all" ? true : r.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
      }),
    [scopedReports, search, statusFilter, priorityFilter]
  )

  const canAssign = isDMA
  const canApproveReject = isDMA

  // Get teams and engineers for DMA manager
  const dmaId = isDMA ? currentUser?.dmaId ?? "" : null
  const utilityId = isUtility ? currentUser?.utilityId ?? "" : null
  
  const districtTeams = useMemo(() => {
    if (isDMA && dmaId) {
      return teams.filter((t) => t.dmaId === dmaId)
    }
    if (isUtility && utilityId) {
      return teams.filter((t) => t.utilityId === utilityId)
    }
    return []
  }, [teams, isDMA, dmaId, isUtility, utilityId])
  
  const districtEngineers = useMemo(() => {
    if (isDMA && dmaId) {
      return engineers.filter((e) => e.dmaId === dmaId)
    }
    if (isUtility && utilityId) {
      return engineers.filter((e) => {
        return districtTeams.some(t => t.id === e.teamId)
      })
    }
    return []
  }, [engineers, isDMA, dmaId, isUtility, utilityId, districtTeams])

  // Assignment form state
  const [assignTeamId, setAssignTeamId] = useState("")
  const [assignEngineerId, setAssignEngineerId] = useState("")

  function openDetail(report: Report) {
    setSelectedReport(report)
    setDetailOpen(true)
  }

  function openAssign(report: Report) {
    setSelectedReport(report)
    setAssignTeamId(report.teamId ?? "")
    setAssignEngineerId(report.assignedEngineerId ?? "")
    setAssignOpen(true)
  }

  function openApprove(report: Report) {
    setSelectedReport(report)
    setApproveDialogOpen(true)
  }

  function openReject(report: Report) {
    setSelectedReport(report)
    setRejectDialogOpen(true)
  }

  // Filter engineers by selected team
  const availableEngineers = useMemo(() => {
    if (!assignTeamId) return []
    return districtEngineers.filter((e) => e.teamId === assignTeamId)
  }, [districtEngineers, assignTeamId])

  async function handleAssign() {
    if (!selectedReport) return
    if (!assignTeamId || !assignEngineerId) {
      toast.error("Please select both team and engineer.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiClient.put(`/reports/${selectedReport.id}/assign`, {
        team_id: assignTeamId,
        engineer_id: assignEngineerId,
      })
      
      if (response.success) {
        toast.success("Report assigned successfully")
        setAssignOpen(false)
        await fetchReports()
      } else {
        toast.error(response.error || "Failed to assign report")
      }
    } catch (error) {
      console.error("Error assigning report:", error)
      toast.error("Failed to assign report")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleApprove() {
    if (!selectedReport) return
    setIsSubmitting(true)
    try {
      const response = await apiClient.post(`/reports/${selectedReport.id}/approve`, {})
      if (response.success) {
        toast.success("Report approved and marked as resolved")
        setApproveDialogOpen(false)
        await fetchReports()
      } else {
        toast.error(response.error || "Failed to approve report")
      }
    } catch (error) {
      console.error("Error approving report:", error)
      toast.error("Failed to approve report")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReject() {
    if (!selectedReport) return
    setIsSubmitting(true)
    try {
      const response = await apiClient.post(`/reports/${selectedReport.id}/reject`, {})
      if (response.success) {
        toast.success("Report rejected")
        setRejectDialogOpen(false)
        await fetchReports()
      } else {
        toast.error(response.error || "Failed to reject report")
      }
    } catch (error) {
      console.error("Error rejecting report:", error)
      toast.error("Failed to reject report")
    } finally {
      setIsSubmitting(false)
    }
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
              Reports
            </h1>
            <p className="text-slate-500 mt-1">
              {isDMA
                ? "Assign and manage leakage reports in your DMA"
                : isUtility
                  ? "Monitor reports across your utility"
                  : "National view of all leakage reports"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 bg-gradient-to-br from-rose-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Reports</p>
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
                  <p className="text-sm font-medium text-slate-500">New Reports</p>
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
                  <p className="text-sm font-medium text-slate-500">Pending Approval</p>
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
          <span>{filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Modern Table */}
      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/80 hover:from-slate-50 hover:to-slate-100/80 border-b border-slate-200/60">
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Tracking ID
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    Description
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                  </TableHead>
                  {!isDMA && (
                    <TableHead className="font-semibold text-slate-600 py-4 px-6">DMA</TableHead>
                  )}
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">Priority</TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">Status</TableHead>
                  {isDMA && (
                    <TableHead className="font-semibold text-slate-600 py-4 px-6">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4" />
                        Assigned To
                      </div>
                    </TableHead>
                  )}
                  <TableHead className="font-semibold text-slate-600 py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isDMA ? 8 : 7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800">No reports found</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {search || statusFilter !== "all" || priorityFilter !== "all" 
                              ? "Try adjusting your filters" 
                              : "Reports will appear here when available"}
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
                        className={cn(
                          "border-b border-slate-100 transition-all duration-200",
                          isNew
                            ? "bg-blue-50/30 hover:bg-blue-50/50"
                            : isPending
                              ? "bg-violet-50/30 hover:bg-violet-50/50"
                              : "hover:bg-rose-50/50"
                        )}
                      >
                        {/* Tracking ID */}
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg",
                              isNew
                                ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                                : isPending
                                  ? "bg-gradient-to-br from-violet-500 to-purple-600"
                                  : "bg-gradient-to-br from-rose-500 to-pink-600"
                            )}>
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-mono text-xs font-semibold text-slate-700">
                              {report.trackingId}
                            </span>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell className="py-4 px-6 max-w-xs">
                          <p className="text-sm text-slate-600 truncate">{report.description || "No description"}</p>
                        </TableCell>

                        {/* Location */}
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-sm text-slate-600 truncate max-w-[180px]">
                              {report.address || "No address"}
                            </span>
                          </div>
                        </TableCell>

                        {/* DMA (for non-DMA users) */}
                        {!isDMA && (
                          <TableCell className="py-4 px-6">
                            <span className="text-sm font-medium text-slate-700">{report.dmaName || "-"}</span>
                          </TableCell>
                        )}

                        {/* Priority */}
                        <TableCell className="py-4 px-6">
                          <PriorityBadge priority={report.priority} />
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-4 px-6">
                          <ReportStatusBadge status={report.status} />
                        </TableCell>

                        {/* Assigned To (for DMA managers) */}
                        {isDMA && (
                          <TableCell className="py-4 px-6">
                            {report.teamName ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                                    <UserCog className="h-3 w-3 text-indigo-600" />
                                  </div>
                                  <span className="text-xs font-medium text-slate-700">{report.teamName}</span>
                                </div>
                                {report.assignedEngineerName && (
                                  <div className="flex items-center gap-2 ml-8">
                                    <Users className="h-3 w-3 text-slate-400" />
                                    <span className="text-xs text-slate-500">{report.assignedEngineerName}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                                <AlertTriangle className="h-3 w-3" />
                                Unassigned
                              </span>
                            )}
                          </TableCell>
                        )}

                        {/* Actions */}
                        <TableCell className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl shadow-lg shadow-slate-200/50 border-slate-200/60"
                            >
                              <DropdownMenuItem
                                onClick={() => openDetail(report)}
                                className="rounded-lg gap-2 cursor-pointer"
                              >
                                <Eye className="h-4 w-4 text-blue-500" />
                                View Details
                              </DropdownMenuItem>
                              {canAssign && (
                                <DropdownMenuItem
                                  onClick={() => openAssign(report)}
                                  className="rounded-lg gap-2 cursor-pointer"
                                >
                                  <ClipboardCheck className="h-4 w-4 text-amber-500" />
                                  Assign to Team
                                </DropdownMenuItem>
                              )}
                              {canApproveReject && report.status === "pending_approval" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => openApprove(report)}
                                    className="rounded-lg gap-2 cursor-pointer text-emerald-600 focus:text-emerald-600"
                                  >
                                    <CheckCheck className="h-4 w-4" />
                                    Approve Repair
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openReject(report)}
                                    className="rounded-lg gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                    Reject Repair
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              Report Details
            </DialogTitle>
            <DialogDescription>
              View complete information about this leakage report.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="flex flex-col gap-6 py-4">
              {/* Report Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-50/50 to-pink-50/50 border border-rose-200/50">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-sm font-semibold text-slate-800">{selectedReport.trackingId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <PriorityBadge priority={selectedReport.priority} />
                    <ReportStatusBadge status={selectedReport.status} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <p className="text-xs text-slate-500 mb-2 font-medium">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedReport.description || "No description provided"}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="text-sm font-medium text-slate-700">{selectedReport.address || "No address"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">DMA</p>
                    <p className="text-sm font-medium text-slate-700">{selectedReport.dmaName || "N/A"}</p>
                  </div>
                </div>

                {selectedReport.teamName && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                      <UserCog className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Assigned Team</p>
                      <p className="text-sm font-medium text-slate-700">{selectedReport.teamName}</p>
                    </div>
                  </div>
                )}

                {selectedReport.assignedEngineerName && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Lead Engineer</p>
                      <p className="text-sm font-medium text-slate-700">{selectedReport.assignedEngineerName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleString("en-ZA") : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">SLA Deadline</p>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedReport.slaDeadline ? new Date(selectedReport.slaDeadline).toLocaleString("en-ZA") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50/80 to-slate-100/50 border border-slate-200/60">
                <p className="text-xs text-slate-500 mb-2 font-medium">Reporter</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                    <span className="text-sm text-white font-semibold">
                      {(selectedReport.reporterName || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{selectedReport.reporterName || "Unknown"}</p>
                    <p className="text-xs text-slate-500">{selectedReport.reporterPhone || "N/A"}</p>
                  </div>
                </div>
              </div>

              {selectedReport.notes && (
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/50">
                  <p className="text-xs text-amber-600 mb-1 font-medium">Notes</p>
                  <p className="text-sm text-slate-700">{selectedReport.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)} className="rounded-xl">
              Close
            </Button>
            {canAssign && selectedReport && !selectedReport.teamName && (
              <Button
                onClick={() => {
                  setDetailOpen(false)
                  openAssign(selectedReport)
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 rounded-xl"
              >
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Assign Report
              </Button>
            )}
            {canApproveReject && selectedReport?.status === "pending_approval" && (
              <>
                <Button
                  onClick={() => {
                    setDetailOpen(false)
                    openApprove(selectedReport)
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setDetailOpen(false)
                    openReject(selectedReport)
                  }}
                  variant="destructive"
                  className="rounded-xl"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <ClipboardCheck className="h-4 w-4 text-white" />
              </div>
              Assign Report to Team
            </DialogTitle>
            <DialogDescription>
              Select a team and lead engineer to handle this leakage report.
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="flex flex-col gap-5 py-4">
              <div className="rounded-xl border border-rose-200/80 bg-gradient-to-r from-rose-50/50 to-pink-50/50 p-4">
                <p className="font-mono text-xs font-semibold text-slate-700">
                  {selectedReport.trackingId}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {selectedReport.description || "No description"}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-slate-700">Select Team</Label>
                <Select
                  value={assignTeamId}
                  onValueChange={(v) => {
                    setAssignTeamId(v)
                    setAssignEngineerId("")
                  }}
                >
                  <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                    {districtTeams.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <UserCog className="h-3 w-3 text-white" />
                          </div>
                          {t.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-slate-700">Select Lead Engineer</Label>
                <Select
                  value={assignEngineerId}
                  onValueChange={setAssignEngineerId}
                  disabled={!assignTeamId}
                >
                  <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
                    <SelectValue placeholder="Select engineer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                    {availableEngineers.map((e) => (
                      <SelectItem key={e.id} value={e.id} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                            <span className="text-xs text-white font-semibold">
                              {e.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {e.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {assignTeamId && availableEngineers.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No engineers available in this team. Add engineers first.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setAssignOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={isSubmitting || !assignTeamId || !assignEngineerId}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Assign Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation */}
      <ConfirmDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        title="Approve Repair"
        description="Approve this repair and mark the report as resolved? This will mark the work as complete."
        confirmLabel="Approve Report"
        onConfirm={handleApprove}
        variant="default"
      />

      {/* Reject Confirmation */}
      <ConfirmDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="Reject Repair"
        description="Reject this repair submission? The report will be returned to the team for rework."
        confirmLabel="Reject Report"
        onConfirm={handleReject}
        variant="destructive"
      />
    </div>
  )
}