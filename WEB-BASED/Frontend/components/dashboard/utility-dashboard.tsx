"use client"

import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EntityStatusBadge, PriorityBadge, ReportStatusBadge } from "@/components/shared/status-badge"
import {
  MapPin,
  FileText,
  Users,
  CheckCircle2,
  GitBranch,
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

export function UtilityDashboard() {
  const { currentUser } = useAuthStore()
  const { getDMAsByUtility, getReportsByUtility, teams, engineers, utilities } =
    useDataStore()

  const utilityId = currentUser?.utilityId ?? ""
  const utility = utilities.find((u) => u.id === utilityId)
  const myDMAs = getDMAsByUtility(utilityId)
  const myReports = getReportsByUtility(utilityId)
  const activeTeams = teams.filter(
    (t) =>
      myDMAs.some((d) => d.id === t.dmaId) && t.status === "active"
  ).length
  const resolvedReports = myReports.filter(
    (r) => r.status === "approved" || r.status === "closed"
  ).length
  const slaCompliance =
    myReports.length > 0
      ? Math.round((resolvedReports / myReports.length) * 100)
      : 0

  // DMA performance comparison
  const dmaPerformance = myDMAs.map((d) => {
    const dReports = myReports.filter((r) => r.dmaId === d.id)
    const dResolved = dReports.filter(
      (r) => r.status === "approved" || r.status === "closed"
    ).length
    return {
      name: d.name.replace("Johannesburg ", "JHB "),
      reports: dReports.length,
      resolved: dResolved,
    }
  })

  // SLA trend (mock monthly data)
  const slaTrend = [
    { month: "Jan", compliance: 78 },
    { month: "Feb", compliance: 82 },
    { month: "Mar", compliance: 75 },
    { month: "Apr", compliance: 88 },
    { month: "May", compliance: 91 },
    { month: "Jun", compliance: slaCompliance },
  ]

  // Recent reports
  const recentReports = [...myReports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {utility?.name ?? "Utility"} Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Utility water leakage management dashboard
        </p>
      </div>

      {/* Stat cards */}
      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total DMAs"
          value={myDMAs.length}
          icon={MapPin}
          gradient="blue"
          trend={{ value: 10, isPositive: true }}
        />
        <StatCard
          title="Utility Reports"
          value={myReports.length}
          icon={FileText}
          gradient="amber"
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Active Teams"
          value={activeTeams}
          icon={Users}
          gradient="emerald"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="SLA Compliance"
          value={slaCompliance}
          suffix="%"
          icon={CheckCircle2}
          gradient="cyan"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* DMA performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">DMA Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dmaPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="reports" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SLA trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">SLA Compliance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={slaTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis domain={[60, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
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
                  dataKey="compliance"
                  name="SLA %"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Tracking ID</th>
                  <th className="pb-3 pr-4 font-medium">Description</th>
                  <th className="pb-3 pr-4 font-medium">DMA</th>
                  <th className="pb-3 pr-4 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/50">
                    <td className="py-3 pr-4 font-mono text-xs font-medium">
                      {report.trackingId}
                    </td>
                    <td className="max-w-xs truncate py-3 pr-4 text-muted-foreground">
                      {report.description}
                    </td>
                    <td className="py-3 pr-4">{report.dmaName}</td>
                    <td className="py-3 pr-4">
                      <PriorityBadge priority={report.priority} />
                    </td>
                    <td className="py-3">
                      <ReportStatusBadge status={report.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
