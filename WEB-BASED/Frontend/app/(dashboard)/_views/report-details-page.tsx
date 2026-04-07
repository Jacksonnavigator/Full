"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Expand,
  FileText,
  ImageIcon,
  Loader2,
  MapPin,
  PlayCircle,
  Sparkles,
  UserCog,
  Users,
  X,
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore, type Report } from "@/store/data-store"
import { PriorityBadge, ReportStatusBadge } from "@/components/shared/status-badge"
import { ResolvedImage } from "@/components/shared/resolved-image"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import { transformKeys } from "@/lib/transform-data"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const getOriginalReportPhotos = (report: Report) =>
  report.reportPhotos !== undefined ? report.reportPhotos : report.photos

const getRepairPhotos = (report: Report) => [
  ...(report.submissionBeforePhotos ?? []).map((uri) => ({ uri, label: "Before Repair" })),
  ...(report.submissionAfterPhotos ?? []).map((uri) => ({ uri, label: "After Repair" })),
]

const isVideoMedia = (uri: string) => {
  const normalized = uri.toLowerCase()
  return (
    normalized.startsWith("data:video/") ||
    normalized.endsWith(".mp4") ||
    normalized.endsWith(".mov") ||
    normalized.endsWith(".webm") ||
    normalized.endsWith(".m4v")
  )
}

interface MediaItem {
  key: string
  uri: string
  alt: string
  label: string | null
}

interface ReportActivityLog {
  id: string
  action: string
  userName: string
  userRole: string
  entity: string
  entityId: string
  details?: string | null
  timestamp: string
}

type SlaState = "critical_overdue" | "overdue" | "due_soon" | "on_track" | "resolved" | "unknown"

const getSlaState = (report: Report): SlaState => {
  if (report.status === "approved" || report.status === "closed") return "resolved"
  if (!report.slaDeadline) return "unknown"
  const deadline = new Date(report.slaDeadline).getTime()
  if (Number.isNaN(deadline)) return "unknown"
  const hoursRemaining = (deadline - Date.now()) / (1000 * 60 * 60)
  if (hoursRemaining < -24) return "critical_overdue"
  if (hoursRemaining < 0) return "overdue"
  if (hoursRemaining <= 24) return "due_soon"
  return "on_track"
}

const getSlaMeta = (report: Report) => {
  const state = getSlaState(report)
  switch (state) {
    case "critical_overdue":
      return {
        label: "Critical overdue",
        tone: "border-red-200 bg-red-50 text-red-700",
        icon: <AlertTriangle className="h-4 w-4" />,
      }
    case "overdue":
      return {
        label: "Overdue",
        tone: "border-orange-200 bg-orange-50 text-orange-700",
        icon: <AlertTriangle className="h-4 w-4" />,
      }
    case "due_soon":
      return {
        label: "Due soon",
        tone: "border-amber-200 bg-amber-50 text-amber-700",
        icon: <Clock className="h-4 w-4" />,
      }
    case "resolved":
      return {
        label: "Resolved",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: <CheckCircle2 className="h-4 w-4" />,
      }
    case "on_track":
      return {
        label: "On track",
        tone: "border-blue-200 bg-blue-50 text-blue-700",
        icon: <Clock className="h-4 w-4" />,
      }
    default:
      return {
        label: "SLA pending",
        tone: "border-slate-200 bg-slate-50 text-slate-600",
        icon: <Clock className="h-4 w-4" />,
      }
  }
}

export default function ReportDetailPage() {
  const router = useRouter()
  const params = useParams<{ reportId: string }>()
  const reportId = Array.isArray(params?.reportId) ? params.reportId[0] : params?.reportId

  const { currentUser } = useAuthStore()
  const { reports, teams, engineers, fetchReports, fetchTeams, fetchEngineers } = useDataStore()
  const [loading, setLoading] = useState(true)
  const [assignOpen, setAssignOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [assignTeamId, setAssignTeamId] = useState("")
  const [assignEngineerId, setAssignEngineerId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null)
  const [activityLogs, setActivityLogs] = useState<ReportActivityLog[]>([])
  const [logsLoading, setLogsLoading] = useState(false)

  const isAdmin = currentUser?.role === "admin"
  const isUtility = currentUser?.role === "utility_manager"
  const isDMA = currentUser?.role === "dma_manager"

  useEffect(() => {
    async function loadData() {
      if (!currentUser) {
        setLoading(false)
        return
      }

      setLoading(true)
      const dmaId = isDMA ? currentUser.dmaId ?? "" : undefined
      const utilityId = isUtility ? currentUser.utilityId ?? "" : undefined
      await Promise.all([
        fetchReports(isDMA ? { dmaId } : isUtility ? { utilityId } : undefined),
        fetchTeams(dmaId),
        fetchEngineers(dmaId),
      ])
      setLoading(false)
    }

    void loadData()
  }, [currentUser, fetchReports, fetchTeams, fetchEngineers, isDMA, isUtility])

  const scopedReports = useMemo(() => {
    if (!currentUser) return []
    if (isAdmin) return reports
    if (isUtility) return reports.filter((report) => report.utilityId === currentUser.utilityId)
    if (isDMA) return reports.filter((report) => report.dmaId === currentUser.dmaId)
    return []
  }, [currentUser, isAdmin, isUtility, isDMA, reports])

  const report = scopedReports.find((item) => item.id === reportId)
  const slaMeta = report ? getSlaMeta(report) : null

  const districtTeams = useMemo(() => {
    if (isDMA && currentUser?.dmaId) {
      return teams.filter((team) => team.dmaId === currentUser.dmaId)
    }
    if (isUtility && currentUser?.utilityId) {
      return teams.filter((team) => team.utilityId === currentUser.utilityId)
    }
    return []
  }, [teams, isDMA, isUtility, currentUser])

  const districtEngineers = useMemo(() => {
    if (isDMA && currentUser?.dmaId) {
      return engineers.filter((engineer) => engineer.dmaId === currentUser.dmaId)
    }
    if (isUtility && currentUser?.utilityId) {
      return engineers.filter((engineer) => districtTeams.some((team) => team.id === engineer.teamId))
    }
    return []
  }, [engineers, districtTeams, isDMA, isUtility, currentUser])

  const availableEngineers = useMemo(() => {
    if (!assignTeamId) return []
    return districtEngineers.filter((engineer) => engineer.teamId === assignTeamId)
  }, [districtEngineers, assignTeamId])

  const loadActivityLogs = async () => {
    if (!currentUser || !reportId) {
      setActivityLogs([])
      return
    }

    setLogsLoading(true)
    try {
      const response = await apiClient.get<{ total: number; items: ReportActivityLog[] }>(
        `/logs/report/${reportId}`
      )
      if (!response.success || !response.data) {
        setActivityLogs([])
        return
      }
      const items = Array.isArray(response.data.items) ? response.data.items.map(transformKeys) : []
      setActivityLogs(items)
    } catch (error) {
      console.error("Error loading report activity logs:", error)
      setActivityLogs([])
    } finally {
      setLogsLoading(false)
    }
  }

  useEffect(() => {
    void loadActivityLogs()
  }, [currentUser, reportId])

  const openAssign = () => {
    if (!report) return
    setAssignTeamId(report.teamId ?? "")
    setAssignEngineerId(report.assignedEngineerId ?? "")
    setAssignOpen(true)
  }

  const openMediaViewer = (media: MediaItem) => {
    setActiveMedia(media)
    setViewerOpen(true)
  }

  const handleAssign = async () => {
    if (!report || !assignTeamId || !assignEngineerId) {
      toast.error("Please select both team and engineer.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await apiClient.put(`/reports/${report.id}/assign`, {
        team_id: assignTeamId,
        engineer_id: assignEngineerId,
      })

      if (!response.success) {
        toast.error(response.error || "Failed to assign report")
        return
      }

      toast.success("Report assigned successfully")
      setAssignOpen(false)
      await fetchReports({ dmaId: currentUser?.dmaId ?? undefined, utilityId: currentUser?.utilityId ?? undefined })
      await loadActivityLogs()
    } catch (error) {
      console.error("Error assigning report:", error)
      toast.error("Failed to assign report")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApprove = async () => {
    if (!report) return
    setIsSubmitting(true)
    try {
      const response = await apiClient.post(`/reports/${report.id}/approve`, {})
      if (!response.success) {
        toast.error(response.error || "Failed to approve report")
        return
      }

      toast.success("Report approved and marked as resolved")
      setApproveDialogOpen(false)
      await fetchReports({ dmaId: currentUser?.dmaId ?? undefined, utilityId: currentUser?.utilityId ?? undefined })
      await loadActivityLogs()
    } catch (error) {
      console.error("Error approving report:", error)
      toast.error("Failed to approve report")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!report) return
    setIsSubmitting(true)
    try {
      const response = await apiClient.post(`/reports/${report.id}/reject`, {})
      if (!response.success) {
        toast.error(response.error || "Failed to reject report")
        return
      }

      toast.success("Report rejected")
      setRejectDialogOpen(false)
      await fetchReports({ dmaId: currentUser?.dmaId ?? undefined, utilityId: currentUser?.utilityId ?? undefined })
      await loadActivityLogs()
    } catch (error) {
      console.error("Error rejecting report:", error)
      toast.error("Failed to reject report")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="outline" onClick={() => router.push("/dashboard/reports")} className="w-fit rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">Report not found</p>
            <p className="mt-1 text-sm text-slate-500">This report may be outside your current access scope.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const originalPhotos = getOriginalReportPhotos(report)
  const repairPhotos = getRepairPhotos(report)
  const originalMediaItems: MediaItem[] = originalPhotos.map((uri, index) => ({
    key: `${uri}-${index}`,
    uri,
    alt: `Original report media ${index + 1}`,
    label: null,
  }))
  const repairMediaItems: MediaItem[] = repairPhotos.map(({ uri, label }, index) => ({
    key: `${uri}-${index}`,
    uri,
    alt: `${label} ${index + 1}`,
    label,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-rose-50/30 to-cyan-50/30 p-6 shadow-xl shadow-slate-200/30">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Button variant="outline" onClick={() => router.push("/dashboard/reports")} className="mb-4 w-fit rounded-xl border-white/80 bg-white/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">DMA Report Review</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-800">Report Details</h1>
                <p className="mt-2 text-slate-500">Full report context, richer media handling, and working field actions on one page.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <PriorityBadge priority={report.priority} />
            <ReportStatusBadge status={report.status} />
            {slaMeta ? (
              <div className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold", slaMeta.tone)}>
                {slaMeta.icon}
                <span>{slaMeta.label}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <HeroMetric label="Tracking ID" value={report.trackingId} accent="from-rose-500 to-pink-600" />
          <HeroMetric label="Reporter" value={report.reporterName || "Unknown"} accent="from-teal-500 to-cyan-600" />
          <HeroMetric label="Leak Location" value={report.dmaName || report.address || "Unmapped"} accent="from-indigo-500 to-violet-600" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isDMA && !report.teamName && (
          <Button
            onClick={openAssign}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Assign Report
          </Button>
        )}
        {isDMA && report.status === "pending_approval" && (
          <>
            <Button
              onClick={() => setApproveDialogOpen(true)}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-green-700"
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Approve Repair
            </Button>
            <Button variant="destructive" onClick={() => setRejectDialogOpen(true)} className="rounded-xl">
              <X className="mr-2 h-4 w-4" />
              Reject Repair
            </Button>
          </>
        )}
      </div>

      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
        <CardContent className="flex flex-col gap-6 p-6">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="flex items-center gap-4 rounded-2xl border border-rose-200/50 bg-gradient-to-r from-rose-50/60 to-pink-50/50 p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-sm font-semibold text-slate-800">{report.trackingId}</p>
                <p className="mt-2 text-base text-slate-600">{report.description || "No description provided"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Workflow</p>
              <div className="mt-4 space-y-3">
                <TimelineStep title="Reported" active />
                <TimelineStep title={report.teamName ? "Assigned" : "Awaiting assignment"} active={Boolean(report.teamName)} />
                <TimelineStep title={report.status === "pending_approval" ? "Awaiting DMA approval" : "Resolution review"} active={report.status !== "new" && report.status !== "assigned"} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailCard icon={<MapPin className="h-5 w-5 text-emerald-600" />} label="Location" value={report.address || "No address"} tone="bg-emerald-100" />
            <DetailCard icon={<Users className="h-5 w-5 text-indigo-600" />} label="DMA" value={report.dmaName || "N/A"} tone="bg-indigo-100" />
            <DetailCard icon={<UserCog className="h-5 w-5 text-violet-600" />} label="Assigned Team" value={report.teamName || "Not assigned"} tone="bg-violet-100" />
            <DetailCard icon={<Users className="h-5 w-5 text-amber-600" />} label="Lead Engineer" value={report.assignedEngineerName || "Not assigned"} tone="bg-amber-100" />
            <DetailCard icon={<Clock className="h-5 w-5 text-blue-600" />} label="Created" value={report.createdAt ? new Date(report.createdAt).toLocaleString("en-ZA") : "N/A"} tone="bg-blue-100" />
            <DetailCard icon={<CheckCircle2 className="h-5 w-5 text-cyan-600" />} label="SLA Deadline" value={report.slaDeadline ? new Date(report.slaDeadline).toLocaleString("en-ZA") : "N/A"} tone="bg-cyan-100" />
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-slate-100/50 p-4">
            <p className="mb-2 text-xs font-medium text-slate-500">Reporter</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600">
                <span className="text-sm font-semibold text-white">
                  {(report.reporterName || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{report.reporterName || "Unknown"}</p>
                <p className="text-xs text-slate-500">{report.reporterPhone || "N/A"}</p>
              </div>
            </div>
          </div>

          {report.notes && (
            <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 p-4">
              <p className="mb-1 text-xs font-medium text-amber-600">Notes</p>
              <p className="text-sm text-slate-700">{report.notes}</p>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
                <Clock className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Activity Timeline</p>
                <p className="text-xs text-slate-500">Every assignment, review, and approval event for this report.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {logsLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading activity history...
                </div>
              ) : activityLogs.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="mt-1 h-3 w-3 rounded-full bg-violet-500 shadow-sm shadow-violet-500/30" />
                      <div className="mt-2 h-full w-px bg-slate-200" />
                    </div>
                    <div className="pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{log.action.replace(/_/g, " ")}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          {new Date(log.timestamp).toLocaleString("en-ZA")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {log.userName} • {log.userRole}
                      </p>
                      {log.details ? <p className="mt-2 text-sm text-slate-600">{log.details}</p> : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                  No activity history has been recorded for this report yet.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <MediaSection
              title="Original Report Photos"
              description="Reporter evidence from the first submission. Click any tile to open it."
              icon={<ImageIcon className="h-4 w-4 text-blue-600" />}
              iconTone="bg-blue-100"
              emptyMessage={
                repairMediaItems.length > 0
                  ? "No original reporter media is currently stored for this report. Only repair evidence is available on this record."
                  : "No original report photos are currently stored for this report."
              }
              items={originalMediaItems}
              onOpen={openMediaViewer}
            />

            <MediaSection
              title="Resolved Images"
              description="Field evidence submitted during repair resolution. Click any tile to inspect it."
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              iconTone="bg-emerald-100"
              emptyMessage="No resolved images have been attached yet."
              items={repairMediaItems}
              onOpen={openMediaViewer}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-slate-200/50 bg-white/95 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                <ClipboardCheck className="h-4 w-4 text-white" />
              </div>
              Assign Report to Team
            </DialogTitle>
            <DialogDescription>Select a team and lead engineer to handle this leakage report.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <div className="rounded-xl border border-rose-200/80 bg-gradient-to-r from-rose-50/50 to-pink-50/50 p-4">
              <p className="font-mono text-xs font-semibold text-slate-700">{report.trackingId}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{report.description || "No description"}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Select Team</Label>
              <Select
                value={assignTeamId}
                onValueChange={(value) => {
                  setAssignTeamId(value)
                  setAssignEngineerId("")
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200/80 bg-slate-50/80">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                  {districtTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id} className="rounded-lg">
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Select Lead Engineer</Label>
              <Select value={assignEngineerId} onValueChange={setAssignEngineerId} disabled={!assignTeamId}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200/80 bg-slate-50/80">
                  <SelectValue placeholder="Select engineer" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                  {availableEngineers.map((engineer) => (
                    <SelectItem key={engineer.id} value={engineer.id} className="rounded-lg">
                      {engineer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {assignTeamId && availableEngineers.length === 0 ? (
                <p className="text-xs text-amber-600">No engineers available in this team. Add engineers first.</p>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleAssign}
              disabled={isSubmitting || !assignTeamId || !assignEngineerId}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Assign Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        title="Approve Repair"
        description="Approve this repair and mark the report as resolved? This will mark the work as complete."
        confirmLabel="Approve Report"
        onConfirm={handleApprove}
        variant="default"
      />

      <ConfirmDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="Reject Repair"
        description="Reject this repair submission? The report will be returned to the team for rework."
        confirmLabel="Reject Report"
        onConfirm={handleReject}
        variant="destructive"
      />

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-5xl rounded-3xl border-slate-200/60 bg-slate-950/95 p-3 text-white shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Media Viewer</DialogTitle>
          </DialogHeader>
          {activeMedia ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{activeMedia.label || "Report Media"}</p>
                  <p className="text-xs text-slate-300">{activeMedia.alt}</p>
                </div>
                <Button variant="ghost" onClick={() => setViewerOpen(false)} className="rounded-xl text-slate-200 hover:bg-white/10 hover:text-white">
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
              <div className="flex min-h-[70vh] items-center justify-center rounded-2xl bg-black/40 p-4">
                {isVideoMedia(activeMedia.uri) ? (
                  <video src={activeMedia.uri} controls className="max-h-[68vh] w-full rounded-2xl bg-black" />
                ) : (
                  <ResolvedImage
                    uri={activeMedia.uri}
                    alt={activeMedia.alt}
                    className="max-h-[68vh] w-auto max-w-full rounded-2xl object-contain"
                    fallbackClassName="h-[50vh] w-full"
                  />
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function HeroMetric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <div className={cn("h-1.5 w-20 rounded-full bg-gradient-to-r", accent)} />
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function TimelineStep({ title, active }: { title: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-3.5 w-3.5 rounded-full", active ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-slate-200")} />
      <span className={cn("text-sm", active ? "font-medium text-slate-700" : "text-slate-400")}>{title}</span>
    </div>
  )
}

function DetailCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}

function MediaSection({
  title,
  description,
  icon,
  iconTone,
  emptyMessage,
  items,
  onOpen,
}: {
  title: string
  description: string
  icon: React.ReactNode
  iconTone: string
  emptyMessage: string
  items: MediaItem[]
  onOpen: (item: MediaItem) => void
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-slate-50/70 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconTone}`}>{icon}</div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <button type="button" onClick={() => onOpen(item)} className="group block w-full text-left">
                <div className="relative">
                  {isVideoMedia(item.uri) ? (
                    <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-t-2xl bg-slate-950">
                      <video src={item.uri} className="h-full w-full object-cover opacity-70" muted />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                          <PlayCircle className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ResolvedImage
                      uri={item.uri}
                      alt={item.alt}
                      className="h-40 w-full rounded-t-2xl object-cover"
                      fallbackClassName="h-40 w-full rounded-t-2xl"
                    />
                  )}
                  <div className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-700">{item.label || "Reporter Media"}</p>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      {isVideoMedia(item.uri) ? "Video" : "Image"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Click to open full view</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-sm text-slate-500">
          {emptyMessage}
        </div>
      )}
    </div>
  )
}
