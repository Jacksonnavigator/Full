"use client"

import { useMemo } from "react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  MapPin,
  Download,
  ShieldAlert,
  Trophy,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" })

export default function AnalyticsPage() {
  const { currentUser } = useAuthStore()
  const { utilities, dmas, reports } = useDataStore()

  const isAdmin = currentUser?.role === "admin"
  const utilityId = currentUser?.utilityId

  const scopedUtilities = useMemo(
    () => (isAdmin ? utilities : utilities.filter((r) => r.id === utilityId)),
    [isAdmin, utilities, utilityId]
  )

  const scopedDMAs = useMemo(
    () =>
      isAdmin
        ? dmas
        : dmas.filter((d) => d.utilityId === utilityId),
    [isAdmin, dmas, utilityId]
  )

  const scopedReports = useMemo(
    () =>
      isAdmin
        ? reports
        : reports.filter((r) => r.utilityId === utilityId),
    [isAdmin, reports, utilityId]
  )

  const totalReports = scopedReports.length
  const criticalReports = scopedReports.filter(
    (r) => r.priority === "critical"
  ).length
  const openReports = scopedReports.filter(
    (r) =>
      r.status === "new" ||
      r.status === "assigned" ||
      r.status === "in_progress" ||
      r.status === "pending_approval"
  ).length
  const resolvedReports = scopedReports.filter(
    (r) => r.status === "approved" || r.status === "closed"
  ).length
  const slaCompliance =
    totalReports > 0
      ? Math.round((resolvedReports / totalReports) * 100)
      : 0

  // Utility-level SLA summary
  const utilitySlaData = scopedUtilities.map((utility) => {
    const utilityReports = scopedReports.filter(
      (r) => r.utilityId === utility.id
    )
    const utilityResolved = utilityReports.filter(
      (r) => r.status === "approved" || r.status === "closed"
    ).length
    return {
      name: utility.name,
      total: utilityReports.length,
      resolved: utilityResolved,
      sla:
        utilityReports.length > 0
          ? Math.round((utilityResolved / utilityReports.length) * 100)
          : 0,
    }
  })

  // DMA volume chart
  const districtVolume = scopedDMAs.map((d) => {
    const dReports = scopedReports.filter(
      (r) => r.dmaId === d.id
    )
    const critical = dReports.filter(
      (r) => r.priority === "critical" || r.priority === "high"
    ).length
    return {
      name: d.name.replace("Johannesburg ", "JHB "),
      total: dReports.length,
      critical,
    }
  })

  const slaTrend = useMemo(() => {
    const now = new Date()
    const buckets = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: monthFormatter.format(date),
        total: 0,
        resolved: 0,
      }
    })

    const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]))

    scopedReports.forEach((report) => {
      const reportDate = new Date(report.createdAt)
      if (Number.isNaN(reportDate.getTime())) return

      const key = `${reportDate.getFullYear()}-${reportDate.getMonth()}`
      const bucket = bucketMap.get(key)
      if (!bucket) return

      bucket.total += 1
      if (report.status === "approved" || report.status === "closed") {
        bucket.resolved += 1
      }
    })

    return buckets.map((bucket) => ({
      month: bucket.month,
      value: bucket.total > 0 ? Math.round((bucket.resolved / bucket.total) * 100) : 0,
    }))
  }, [scopedReports])

  const now = Date.now()
  const isResolved = (status: string) => status === "approved" || status === "closed"

  const dmaPerformanceRanking = useMemo(() => {
    return scopedDMAs
      .map((dma) => {
        const dmaReports = scopedReports.filter((report) => report.dmaId === dma.id)
        const resolved = dmaReports.filter((report) => isResolved(report.status)).length
        const overdue = dmaReports.filter(
          (report) => !isResolved(report.status) && new Date(report.slaDeadline).getTime() < now
        ).length
        const compliance = dmaReports.length > 0 ? Math.round((resolved / dmaReports.length) * 100) : 0
        return {
          id: dma.id,
          name: dma.name,
          total: dmaReports.length,
          overdue,
          compliance,
        }
      })
      .sort((left, right) => {
        if (right.compliance !== left.compliance) return right.compliance - left.compliance
        if (left.overdue !== right.overdue) return left.overdue - right.overdue
        return right.total - left.total
      })
      .slice(0, 5)
  }, [scopedDMAs, scopedReports, now])

  const riskQueue = useMemo(() => {
    return [...scopedReports]
      .filter((report) => !isResolved(report.status))
      .map((report) => {
        const deadlineMs = new Date(report.slaDeadline).getTime()
        const msRemaining = deadlineMs - now
        let risk: "Critical" | "High" | "Medium" = "Medium"
        if (msRemaining < 0) risk = "Critical"
        else if (msRemaining < 12 * 60 * 60 * 1000 || report.priority === "critical") risk = "High"

        return {
          id: report.id,
          trackingId: report.trackingId,
          dmaName: report.dmaName,
          teamName: report.teamName || "Unassigned",
          risk,
          dueText:
            msRemaining < 0
              ? `${Math.abs(Math.round(msRemaining / (1000 * 60 * 60)))}h overdue`
              : `${Math.max(1, Math.round(msRemaining / (1000 * 60 * 60)))}h left`,
        }
      })
      .sort((left, right) => {
        const riskOrder = { Critical: 0, High: 1, Medium: 2 }
        return riskOrder[left.risk] - riskOrder[right.risk]
      })
      .slice(0, 6)
  }, [scopedReports, now])

  const exportOperationalCsv = () => {
    const rows = [
      ["tracking_id", "description", "utility", "dma", "team", "priority", "status", "sla_deadline", "created_at"],
      ...scopedReports.map((report) => [
        report.trackingId,
        report.description,
        report.utilityName,
        report.dmaName,
        report.teamName || "",
        report.priority,
        report.status,
        report.slaDeadline,
        report.createdAt,
      ]),
    ]

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = isAdmin ? "hydranet-national-analytics.csv" : "hydranet-regional-analytics.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description={
          isAdmin
            ? "National performance analytics for water leakage operations"
            : "Regional analytics for leakage response and SLA compliance"
        }
      />

      <div className="flex justify-end">
        <Button onClick={exportOperationalCsv} className="gap-2">
          <Download className="h-4 w-4" />
          Export Operations CSV
        </Button>
      </div>

      {/* Stat cards */}
      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={totalReports}
          icon={FileText}
          gradient="blue"
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Open Reports"
          value={openReports}
          icon={AlertTriangle}
          gradient="amber"
          trend={{ value: 6, isPositive: false }}
        />
        <StatCard
          title="Critical Incidents"
          value={criticalReports}
          icon={BarChart3}
          gradient="red"
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard
          title="SLA Compliance"
          value={slaCompliance}
          suffix="%"
          icon={CheckCircle2}
          gradient="emerald"
          trend={{ value: 4, isPositive: true }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Utility SLA chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              {isAdmin ? "Utility SLA Compliance" : "DMA SLA Compliance"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={utilitySlaData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="total"
                  name="Total Reports"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="left"
                  dataKey="resolved"
                  name="Resolved"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SLA trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SLA Trend (Last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={slaTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="SLA %"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                  dot={{ fill: "#1d4ed8", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* DMA volume card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">DMA Incident Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={districtVolume}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
              <YAxis
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="total"
                name="Total Reports"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="critical"
                name="High/Critical"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-4 w-4 text-amber-500" />
              Best Performing DMAs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dmaPerformanceRanking.map((dma, index) => (
              <div key={dma.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {index + 1}. {dma.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {dma.total} reports handled · {dma.overdue} overdue
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    {dma.compliance}% resolved
                  </span>
                </div>
              </div>
            ))}
            {dmaPerformanceRanking.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                DMA rankings will appear here once reports start flowing through the system.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              SLA Risk Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskQueue.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.trackingId}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.dmaName} · {item.teamName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      item.risk === "Critical"
                        ? "bg-rose-50 text-rose-700"
                        : item.risk === "High"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {item.risk}
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{item.dueText}</p>
              </div>
            ))}
            {riskQueue.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No open reports are currently sitting in the SLA risk queue.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

