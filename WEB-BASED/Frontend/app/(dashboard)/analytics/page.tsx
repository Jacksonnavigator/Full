"use client"

import { useMemo } from "react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/shared/stat-card"
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  MapPin,
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

  // Simple SLA trend (mocked against current compliance)
  const slaTrend = [
    { month: "Jan", value: Math.max(60, slaCompliance - 8) },
    { month: "Feb", value: Math.max(60, slaCompliance - 4) },
    { month: "Mar", value: Math.max(60, slaCompliance - 2) },
    { month: "Apr", value: slaCompliance },
    { month: "May", value: slaCompliance + 2 },
    { month: "Jun", value: slaCompliance },
  ]

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
    </div>
  )
}

