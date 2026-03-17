"use client"

import { useDataStore } from "@/store/data-store"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EntityStatusBadge, ReportStatusBadge } from "@/components/shared/status-badge"
import {
  Globe,
  MapPin,
  FileText,
  AlertTriangle,
  Users,
  CheckCircle2,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#6b7280"]

export function AdminDashboard() {
  const { utilities, dmas, reports, engineers } = useDataStore()

  const totalReports = reports.length
  const pendingReports = reports.filter(
    (r) => r.status === "new" || r.status === "pending_approval"
  ).length
  const activeEngineers = engineers.filter((e) => e.status === "active").length
  const resolvedReports = reports.filter(
    (r) => r.status === "approved" || r.status === "closed"
  ).length
  const slaCompliance = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0

  // Reports by utility for bar chart
  const reportsByUtility = utilities.map((utility) => ({
    name: utility.name,
    reports: reports.filter((r) => r.utilityId === utility.id).length,
    resolved: reports.filter(
      (r) =>
        r.utilityId === utility.id &&
        (r.status === "approved" || r.status === "closed")
    ).length,
  }))

  // Reports by status for pie chart
  const statusCounts = [
    { name: "New", value: reports.filter((r) => r.status === "new").length },
    { name: "Assigned", value: reports.filter((r) => r.status === "assigned").length },
    { name: "In Progress", value: reports.filter((r) => r.status === "in_progress").length },
    { name: "Pending Approval", value: reports.filter((r) => r.status === "pending_approval").length },
    { name: "Approved", value: reports.filter((r) => r.status === "approved").length },
    { name: "Rejected", value: reports.filter((r) => r.status === "rejected").length },
    { name: "Closed", value: reports.filter((r) => r.status === "closed").length },
  ].filter((s) => s.value > 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>
        <p className="text-sm text-muted-foreground">
          National water leakage management dashboard
        </p>
      </div>

      {/* Stat cards */}
      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Utilities"
          value={utilities.length}
          icon={Globe}
          gradient="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total DMAs"
          value={dmas.length}
          icon={MapPin}
          gradient="cyan"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Reports"
          value={totalReports}
          icon={FileText}
          gradient="amber"
          trend={{ value: 24, isPositive: true }}
        />
        <StatCard
          title="Pending Reports"
          value={pendingReports}
          icon={AlertTriangle}
          gradient="red"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Active Engineers"
          value={activeEngineers}
          icon={Users}
          gradient="emerald"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="SLA Compliance"
          value={slaCompliance}
          suffix="%"
          icon={CheckCircle2}
          gradient="blue"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar chart - reports by utility */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Reports by Utility</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsByUtility}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="reports" name="Total Reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart - report status distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusCounts.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Utility performance table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Utility Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Utility</th>
                  <th className="pb-3 pr-4 font-medium">Manager</th>
                  <th className="pb-3 pr-4 font-medium text-center">DMAs</th>
                  <th className="pb-3 pr-4 font-medium text-center">Reports</th>
                  <th className="pb-3 pr-4 font-medium text-center">Resolved</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {utilities.map((utility) => {
                  const utilityReports = reports.filter((r) => r.utilityId === utility.id)
                  const utilityResolved = utilityReports.filter(
                    (r) => r.status === "approved" || r.status === "closed"
                  ).length
                  return (
                    <tr key={utility.id} className="hover:bg-muted/50">
                      <td className="py-3 pr-4 font-medium">{utility.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{utility.managerName}</td>
                      <td className="py-3 pr-4 text-center">{utility.dmasCount}</td>
                      <td className="py-3 pr-4 text-center">{utilityReports.length}</td>
                      <td className="py-3 pr-4 text-center">{utilityResolved}</td>
                      <td className="py-3">
                        <EntityStatusBadge status={utility.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
