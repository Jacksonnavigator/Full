"use client"

import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  EntityStatusBadge,
  PriorityBadge,
  ReportStatusBadge,
} from "@/components/shared/status-badge"
import {
  FileText,
  Users,
  CheckCircle2,
  GitBranch,
  ClipboardCheck,
  UserCog,
  AlertTriangle,
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

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function DMADashboard() {
  const { currentUser } = useAuthStore()
  const {
    getBranchesByDMA,
    getReportsByDMA,
    getTeamsByDMA,
    getEngineersByDMA,
    dmas,
  } = useDataStore()

  const dmaId = currentUser?.dmaId ?? ""
  const dma = dmas.find((d) => d.id === dmaId)
  const myBranches = getBranchesByDMA(dmaId)
  const myReports = getReportsByDMA(dmaId)
  const myTeams = getTeamsByDMA(dmaId)
  const myEngineers = getEngineersByDMA(dmaId)

  const activeReports = myReports.filter(
    (r) => r.status !== "closed" && r.status !== "approved" && r.status !== "rejected"
  ).length
  const assignedReports = myReports.filter((r) => r.status === "assigned").length
  const pendingApprovals = myReports.filter(
    (r) => r.status === "pending_approval"
  ).length
  const activeEngineers = myEngineers.filter((e) => e.status === "active").length

  // Engineer role distribution for pie chart
  const engineerRoles = [
    {
      name: "Engineers",
      value: myEngineers.filter((e) => e.role === "engineer" && e.status === "active").length,
    },
    {
      name: "Team Leaders",
      value: myEngineers.filter((e) => e.role === "team_leader" && e.status === "active").length,
    },
    {
      name: "Inactive",
      value: myEngineers.filter((e) => e.status === "inactive").length,
    },
  ].filter((r) => r.value > 0)

  // Branch overview data - calculate engineers and teams per branch
  const branchData = myBranches.map((b) => ({
    name: b.name.replace(" Branch", ""),
    engineers: myEngineers.filter((e) => e.branchId === b.id).length,
    teams: myTeams.filter((t) => t.branchId === b.id).length,
  }))

  // Recent reports
  const recentReports = [...myReports]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-balance">
          {dma?.name ?? "DMA"} Operations
        </h2>
        <p className="text-sm text-muted-foreground">
          Operational control dashboard for your DMA
        </p>
      </div>

      {/* Stat cards */}
      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Reports"
          value={activeReports}
          icon={FileText}
          gradient="amber"
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals}
          icon={ClipboardCheck}
          gradient="red"
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Active Engineers"
          value={activeEngineers}
          icon={Users}
          gradient="emerald"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Branches"
          value={myBranches.length}
          icon={GitBranch}
          gradient="blue"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Branch overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Branch Overview</CardTitle>
            <CardDescription className="text-xs">
              Engineers and teams per branch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={branchData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
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
                  dataKey="engineers"
                  name="Engineers"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="teams"
                  name="Teams"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engineer distribution pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engineer Status</CardTitle>
            <CardDescription className="text-xs">
              Active role distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={engineerRoles}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {engineerRoles.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
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
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Teams summary cards */}
      <div>
        <h3 className="mb-3 text-base font-semibold">Teams Summary</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {myTeams.map((team) => (
            <Card
              key={team.id}
              className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <UserCog className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{team.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {team.branchName}
                      </p>
                    </div>
                  </div>
                  <EntityStatusBadge status={team.status} />
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{team.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{team.activeReports} active</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Leader: {team.leaderName}
                </p>
              </CardContent>
            </Card>
          ))}
          {myTeams.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <UserCog className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No teams found in this DMA
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Reports</CardTitle>
          <CardDescription className="text-xs">
            Latest report activity in your DMA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Tracking ID</th>
                  <th className="pb-3 pr-4 font-medium">Description</th>
                  <th className="pb-3 pr-4 font-medium">Team</th>
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
                    <td className="py-3 pr-4 text-muted-foreground">
                      {report.teamName ?? "Unassigned"}
                    </td>
                    <td className="py-3 pr-4">
                      <PriorityBadge priority={report.priority} />
                    </td>
                    <td className="py-3">
                      <ReportStatusBadge status={report.status} />
                    </td>
                  </tr>
                ))}
                {recentReports.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No reports found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
