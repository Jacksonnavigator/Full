import { ClipboardList, Droplets } from "lucide-react"
import type { ReportType } from "@/lib/types"

const REPORT_TYPE_META = {
  leakage: {
    label: "Leakage",
    Icon: Droplets,
    className: "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200",
  },
  non_leakage: {
    label: "Non-leakage",
    Icon: ClipboardList,
    className: "border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200",
  },
} as const

export function ReportTypeBadge({ type }: { type?: ReportType | string | null }) {
  const normalized = type === "non_leakage" ? "non_leakage" : "leakage"
  const { label, Icon, className } = REPORT_TYPE_META[normalized]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
