"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  const pathname = usePathname()
  const { isAuthenticated, currentUser } = useAuthStore()
  const isOperationsDashboard = pathname === "/dashboard"
  const { initialize, initialized } = useDataStore()
  const [hydrated, setHydrated] = useState(false)

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Initialize live API-backed store state on first load
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
          <p className="text-sm text-muted-foreground">Loading MajiScope...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        <AppSidebar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <TopNavbar />
          <SidebarInset className="relative m-0 min-h-0 flex-1 overflow-hidden rounded-none">
            <main
              className={
                isOperationsDashboard
                  ? "flex h-[calc(100svh-3.5rem)] min-h-0 flex-col overflow-hidden"
                  : "flex-1 overflow-y-auto overflow-x-hidden p-6"
              }
            >
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
