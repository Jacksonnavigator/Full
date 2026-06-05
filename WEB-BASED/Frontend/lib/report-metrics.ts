import type { Report } from "@/store/data-store"

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
