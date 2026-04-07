"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { CONFIG } from "@/lib/config"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROLE_LABELS } from "@/lib/constants"
import { transformKeys } from "@/lib/transform-data"
import { Loader2, ShieldCheck, Server, KeyRound, TriangleAlert } from "lucide-react"

interface UserRecord {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  role?: string
  utilityId?: string
  utilityName?: string
  dmaId?: string
  dmaName?: string
  createdAt?: string
}

export default function SettingsPage() {
  const { currentUser } = useAuthStore()
  const { utilities, dmas } = useDataStore()
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const hasToken = typeof window !== "undefined" ? Boolean(localStorage.getItem(CONFIG.storage.tokenKey)) : false
  const accessScopeSummary = useMemo(() => {
    if (currentUser?.role === "admin") return "Full national access across utilities, DMAs, teams, and reports."
    if (currentUser?.role === "utility_manager") return "Scoped to one utility and the DMAs, teams, and reports inside it."
    if (currentUser?.role === "dma_manager") return "Scoped to one DMA and the operational teams and reports inside it."
    return "Current session scope unavailable."
  }, [currentUser?.role])

  useEffect(() => {
    fetchUserRecord()
  }, [currentUser?.id, currentUser?.role])

  async function fetchUserRecord() {
    if (!currentUser?.id) return
    
    setLoading(true)
    try {
      let endpoint = ""
      
      // Determine which endpoint to use based on role
      if (currentUser.role === "utility_manager") {
        endpoint = `${CONFIG.backend.fullUrl}/utility-managers/${currentUser.id}`
      } else if (currentUser.role === "dma_manager") {
        endpoint = `${CONFIG.backend.fullUrl}/dma-managers/${currentUser.id}`
      } else if (currentUser.role === "admin") {
        endpoint = `${CONFIG.backend.fullUrl}/users/${currentUser.id}`
      }

      if (!endpoint) {
        setLoading(false)
        return
      }

      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        const transformed = transformKeys(data)
        setUserRecord(transformed)
      }
    } catch (error) {
      console.error("Error fetching user record:", error)
    } finally {
      setLoading(false)
    }
  }

  const getUtilityName = (utilityId: string) => {
    return utilities.find(u => u.id === utilityId)?.name || utilityId
  }

  const getDMAName = (dmaId: string) => {
    return dmas.find(d => d.id === dmaId)?.name || dmaId
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Profile information and environment details for your HydraNet session"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription className="text-xs">
              Your account details from {currentUser?.role === "admin" ? "users" : currentUser?.role === "utility_manager" ? "utility managers" : "DMA managers"} table
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            ) : userRecord ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Full Name</Label>
                    <Input value={userRecord.name ?? ""} readOnly />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input value={userRecord.email ?? ""} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Phone</Label>
                    <Input value={userRecord.phone ?? "N/A"} readOnly />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <Badge variant={userRecord.status === "active" ? "default" : "secondary"} className="w-fit text-xs">
                      {userRecord.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Role</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {currentUser ? ROLE_LABELS[currentUser.role] : "N/A"}
                      </Badge>
                    </div>
                  </div>
                  {userRecord.utilityId && (
                    <div className="flex flex-col gap-2">
                      <Label>Assigned Utility</Label>
                      <Input value={getUtilityName(userRecord.utilityId)} readOnly />
                    </div>
                  )}
                </div>
                {userRecord.dmaId && (
                  <div className="flex flex-col gap-2">
                    <Label>Assigned DMA</Label>
                    <Input value={getDMAName(userRecord.dmaId)} readOnly />
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No profile data available</div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Session Security
              </CardTitle>
              <CardDescription className="text-xs">
                Current access scope and session health for this browser login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="text-sm font-semibold text-foreground">Access Scope</p>
                <p className="mt-2 text-sm text-muted-foreground">{accessScopeSummary}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/70 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">JWT token</p>
                  <Badge variant={hasToken ? "default" : "secondary"} className="mt-2 w-fit text-xs">
                    {hasToken ? "Present" : "Missing"}
                  </Badge>
                </div>
                <div className="rounded-2xl border border-border/70 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Role scope</p>
                  <Badge variant="secondary" className="mt-2 w-fit text-xs">
                    {currentUser ? ROLE_LABELS[currentUser.role] : "Unknown"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Server className="h-4 w-4 text-blue-600" />
                Environment Readiness
              </CardTitle>
              <CardDescription className="text-xs">
                Backend connectivity and deployment configuration checks for this frontend session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-border/70 p-4">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Backend API URL</p>
                <p className="mt-2 text-sm font-medium text-foreground break-all">{CONFIG.backend.fullUrl}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={CONFIG.backend.usingFallbackBaseUrl ? "secondary" : "default"} className="text-xs">
                  {CONFIG.backend.usingFallbackBaseUrl ? "Using fallback backend URL" : "Environment URL configured"}
                </Badge>
                <Badge variant={CONFIG.backend.isLoopbackBaseUrl ? "secondary" : "default"} className="text-xs">
                  {CONFIG.backend.isLoopbackBaseUrl ? "Loopback / localhost" : "LAN / deployed backend"}
                </Badge>
              </div>
              {(CONFIG.backend.usingFallbackBaseUrl || CONFIG.backend.isLoopbackBaseUrl) && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <p className="text-sm text-amber-900">
                    This frontend session is still using a local-style backend target. That is fine for development, but production and LAN users should point to a shared backend URL.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <KeyRound className="h-4 w-4 text-violet-600" />
                Access Governance Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>HydraNet uses role-scoped access: one utility should not interact with another, and one DMA should not operate outside its assigned utility hierarchy.</p>
              <p>Use admin and manager assignment pages to correct inactive accounts, unassigned DMAs, and missing leaders before they become operational gaps.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

