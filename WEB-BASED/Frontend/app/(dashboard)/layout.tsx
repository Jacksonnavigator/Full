"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { TopNavbar } from "@/components/layout/top-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, currentUser } = useAuthStore()
  const { initialize, initialized } = useDataStore()
  const [hydrated, setHydrated] = useState(false)

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Initialize mock data on first load
  useEffect(() => {
    if (hydrated && !initialized) {
      initialize()
    }
  }, [hydrated, initialized, initialize])

  // Auth guard
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hydrated, isAuthenticated, router])

  // Show nothing while hydrating or if not authenticated
  if (!hydrated || !isAuthenticated || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading HydraNet...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <TopNavbar />
          <SidebarInset className="relative m-0 min-h-[calc(100svh-3.5rem)] rounded-none">
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
