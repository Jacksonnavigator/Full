import type { Report } from "@/store/data-store"
import { LEAKAGE_TYPE_CONFIG } from "@/lib/constants"
import type { LeakageType } from "@/lib/types"

const LEAKAGE_TYPE_KEYS = Object.keys(LEAKAGE_TYPE_CONFIG) as LeakageType[]

export type LeakageTypeDistributionRow = {
  type: LeakageType
  name: string
  count: number
  percentage: number
  fill: string
}

export function hasUsableCoordinates(report: Pick<Report, "latitude" | "longitude">) {
  return (
    Number.isFinite(report.latitude) &&
    Number.isFinite(report.longitude) &&
    !(report.latitude === 0 && report.longitude === 0)
  )
}

export function isResolvedReport(status: string) {
  return status === "approved" || status === "closed"
}

export function isUnattendedReport(status: string) {
  return status === "new" || status === "assigned" || status === "in_progress"
}

export function isUrgentReport(priority: string) {
  return priority === "critical" || priority === "high"
}

export function getSimpleMapStatusMeta(status: string) {
  if (status === "pending_approval") {
    return {
      label: "Awaiting approval",
      fill: "#a855f7",
      stroke: "#6d28d9",
    }
  }

  if (isResolvedReport(status)) {
    return {
      label: status === "closed" ? "Closed" : "Repaired",
      fill: "#22c55e",
      stroke: "#15803d",
    }
  }

  return {
    label: "Open",
    fill: "#ef4444",
    stroke: "#991b1b",
  }
}

export function computeLeakKpis(reports: Report[]) {
  return {
    total: reports.length,
    repaired: reports.filter((report) => isResolvedReport(report.status)).length,
    urgent: reports.filter((report) => isUrgentReport(report.priority)).length,
    unattended: reports.filter((report) => isUnattendedReport(report.status)).length,
    withCoordinates: reports.filter(hasUsableCoordinates).length,
  }
}

export function normalizeLeakageType(value: string | null | undefined): LeakageType {
  const normalized = String(value || "").trim().toLowerCase() as LeakageType
  return LEAKAGE_TYPE_KEYS.includes(normalized) ? normalized : "unknown"
}

export function computeLeakageTypeDistribution(reports: Report[]): LeakageTypeDistributionRow[] {
  const counts = new Map<LeakageType, number>(LEAKAGE_TYPE_KEYS.map((type) => [type, 0]))

  reports.forEach((report) => {
    const type = normalizeLeakageType(report.leakageType)
    counts.set(type, (counts.get(type) || 0) + 1)
  })

  const total = Math.max(reports.length, 1)

  return LEAKAGE_TYPE_KEYS
    .map((type) => {
      const count = counts.get(type) || 0
      const config = LEAKAGE_TYPE_CONFIG[type]
      return {
        type,
        name: config.label,
        count,
        percentage: Math.round((count / total) * 1000) / 10,
        fill: config.color,
      }
    })
    .filter((row) => row.count > 0)
}
