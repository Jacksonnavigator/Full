// ============================================================
// Majiscope - Constants & Configuration
// Navigation config, role permissions, status mappings
// ============================================================

import {
  LayoutDashboard,
  Globe,
  MapPin,
  Users,
  UserCog,
  FileText,
  Bell,
  BarChart3,
  ScrollText,
  Route,
} from "lucide-react"
import type { UserRole, ReportStatus, ReportPriority, EntityStatus, LeakageType } from "./types"

// ---------- Navigation ----------

export interface NavItem {
  title: string
  href: string
  icon: typeof LayoutDashboard
  roles: UserRole[] // which roles can see this item
  badge?: number
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "utility_manager", "dma_manager"],
  },
  {
    title: "Utilities",
    href: "/dashboard/utilities",
    icon: Globe,
    roles: ["admin"],
  },
  {
    title: "Utility Managers",
    href: "/dashboard/managers",
    icon: UserCog,
    roles: ["admin"],
  },
  {
    title: "DMAs",
    href: "/dashboard/dmas",
    icon: MapPin,
    roles: ["admin", "utility_manager"],
  },
  {
    title: "DMA Managers",
    href: "/dashboard/dma-managers",
    icon: UserCog,
    roles: ["admin", "utility_manager"],
  },
  {
    title: "Engineers",
    href: "/dashboard/engineers",
    icon: Users,
    roles: ["dma_manager", "utility_manager"],
  },
  {
    title: "Teams",
    href: "/dashboard/teams",
    icon: UserCog,
    roles: ["dma_manager"],
  },
  {
    title: "Team Leaders",
    href: "/dashboard/team-leaders",
    icon: UserCog,
    roles: ["dma_manager"],
  },
  {
    title: "Reported Leakage",
    href: "/dashboard/reports",
    icon: FileText,
    roles: ["admin", "utility_manager", "dma_manager"],
  },
  {
    title: "Location Routing",
    href: "/dashboard/location-routing",
    icon: Route,
    roles: ["admin"],
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    roles: ["admin", "utility_manager", "dma_manager"],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["admin", "utility_manager"],
  },
  {
    title: "Activity Logs",
    href: "/dashboard/logs",
    icon: ScrollText,
    roles: ["admin", "utility_manager"],
  },
]

// ---------- Role Labels ----------

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "System Administrator",
  utility_manager: "Utility Manager",
  dma_manager: "DMA Manager",
  user: "Administrator",
}

export const ROLE_SHORT_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  utility_manager: "Utility Mgr",
  dma_manager: "DMA Mgr",
  user: "Admin",
}

// ---------- Status Configurations ----------

export const REPORT_STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; color: string; bgColor: string }
> = {
  new: { label: "New", color: "text-sky-700", bgColor: "bg-sky-50 border-sky-200" },
  assigned: { label: "Assigned", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  in_progress: {
    label: "In Progress",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  pending_approval: {
    label: "Awaiting DMA Approval",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
  },
  approved: {
    label: "Approved",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  rejected: { label: "Rejected", color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
  closed: { label: "Closed", color: "text-gray-700", bgColor: "bg-gray-50 border-gray-200" },
}

export const PRIORITY_CONFIG: Record<
  ReportPriority,
  { label: string; color: string; bgColor: string }
> = {
  low: { label: "Low", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  medium: { label: "Moderate", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  high: { label: "High", color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
  critical: {
    label: "Critical",
    color: "text-red-900",
    bgColor: "bg-red-100 border-red-300",
  },
}

export const LEAKAGE_TYPE_CONFIG: Record<
  LeakageType,
  { label: string; color: string }
> = {
  ground_leakage: { label: "Ground Leakage", color: "#0891b2" },
  pipe_burst: { label: "Pipe Burst", color: "#dc2626" },
  meter_leakage: { label: "Meter Leakage", color: "#7c3aed" },
  valve_leakage: { label: "Valve Leakage", color: "#f59e0b" },
  overflow: { label: "Overflow", color: "#2563eb" },
  unknown: { label: "I don't know", color: "#64748b" },
}

export const ENTITY_STATUS_CONFIG: Record<
  EntityStatus,
  { label: string; color: string; bgColor: string }
> = {
  active: {
    label: "Active",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  inactive: { label: "Inactive", color: "text-gray-700", bgColor: "bg-gray-100 border-gray-300" },
}
