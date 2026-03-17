"use client"

import { useState, useEffect } from "react"
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
import { Loader2 } from "lucide-react"

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
      </div>
    </div>
  )
}

