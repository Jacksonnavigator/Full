"use client"

import { useAuthStore } from "@/store/auth-store"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { UtilityDashboard } from "@/components/dashboard/utility-dashboard"
import { DMADashboard } from "@/components/dashboard/dma-dashboard"

export default function DashboardPage() {
  const { currentUser } = useAuthStore()

  if (!currentUser) return null

  switch (currentUser.role) {
    case "admin":
      return <AdminDashboard />
    case "utility_manager":
      return <UtilityDashboard />
    case "dma_manager":
      return <DMADashboard />
    default:
      return null
  }
}
