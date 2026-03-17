"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { CONFIG } from "@/lib/config"
import { PageHeader } from "@/components/shared/page-header"
import { EntityStatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Crown,
  Users,
  UserPlus,
  UserMinus,
  Loader2,
  Trash2,
  Settings,
} from "lucide-react"
import { toast } from "sonner"

// Types
interface Engineer {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  team_id?: string | null
}

interface Team {
  id: string
  name: string
  description: string | null
  branch_id: string
  branch_name: string
  dma_id: string
  dma_name: string
  utility_id: string
  leader_id: string | null
  leader?: Engineer | null
  status: "active" | "inactive"
  engineers: Engineer[]
  created_at: string
  updated_at: string
}

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.id as string
  const { currentUser } = useAuthStore()
  
  // Data states
  const [team, setTeam] = useState<Team | null>(null)
  const [eligibleEngineers, setEligibleEngineers] = useState<Engineer[]>([])
  const [eligibleLeaders, setEligibleLeaders] = useState<Engineer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // UI states
  const [addMembersOpen, setAddMembersOpen] = useState(false)
  const [assignLeaderOpen, setAssignLeaderOpen] = useState(false)
  const [removeMemberId, setRemoveMemberId] = useState<string | null>(null)
  const [removeLeaderOpen, setRemoveLeaderOpen] = useState(false)
  
  // Form states
  const [selectedEngineerIds, setSelectedEngineerIds] = useState<string[]>([])
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>("")

  // Only DMA managers can access this page
  const isDMAManager = currentUser?.role === "dma_manager"

  // Fetch team data
  useEffect(() => {
    if (!isDMAManager || !teamId) return
    
    async function fetchTeamData() {
      try {
        setLoading(true)
        
        // Fetch team with members
        const membersRes = await fetch(`${CONFIG.backend.fullUrl}/teams/${teamId}/members`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (membersRes.ok) {
          const data = await membersRes.json()
          setTeam(data.team)
          setEligibleEngineers(data.eligibleEngineers || [])
        } else {
          toast.error("Failed to load team data")
          router.push("/teams")
        }
        
        // Fetch eligible leaders
        const leaderRes = await fetch(`${CONFIG.backend.fullUrl}/teams/${teamId}/leader`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (leaderRes.ok) {
          const leaderData = await leaderRes.json()
          setEligibleLeaders(leaderData.eligibleLeaders || [])
        }
      } catch (error) {
        console.error("Error fetching team:", error)
        toast.error("Failed to load team data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeamData()
  }, [isDMAManager, teamId, router])

  // Refresh team data
  async function refreshTeamData() {
    try {
      const membersRes = await fetch(`${CONFIG.backend.fullUrl}/teams/${teamId}/members`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
      if (membersRes.ok) {
        const data = await membersRes.json()
        setTeam(data.team)
        setEligibleEngineers(data.eligibleEngineers || [])
      }
      
      const leaderRes = await fetch(`${CONFIG.backend.fullUrl}/teams/${teamId}/leader`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
      if (leaderRes.ok) {
        const leaderData = await leaderRes.json()
        setEligibleLeaders(leaderData.eligibleLeaders || [])
      }
    } catch (error) {
      console.error("Error refreshing team:", error)
    }
  }

  // Add members to team
  async function handleAddMembers() {
    if (selectedEngineerIds.length === 0) {
      toast.error("Please select at least one engineer")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/teams/${teamId}/members`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
        body: JSON.stringify({ engineerIds: selectedEngineerIds }),
      })

      if (response.ok) {
        toast.success(`Added ${selectedEngineerIds.length} member(s) to team`)
        setSelectedEngineerIds([])
        setAddMembersOpen(false)
        await refreshTeamData()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to add members")
      }
    } catch (error) {
      console.error("Error adding members:", error)
      toast.error("Failed to add members")
    } finally {
      setSaving(false)
    }
  }

  // Remove member from team
  async function handleRemoveMember() {
    if (!removeMemberId) return

    setSaving(true)
    try {
      const response = await fetch(
        `${CONFIG.backend.fullUrl}/teams/${teamId}/members?engineerIds=${removeMemberId}`,
        { method: "DELETE", headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } }
      )

      if (response.ok) {
        toast.success("Member removed from team")
        setRemoveMemberId(null)
        await refreshTeamData()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to remove member")
      }
    } catch (error) {
      console.error("Error removing member:", error)
      toast.error("Failed to remove member")
    } finally {
      setSaving(false)
    }
  }

  // Assign team leader
  async function handleAssignLeader() {
    if (!selectedLeaderId) {
      toast.error("Please select a team leader")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/teams/${teamId}/leader`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
        body: JSON.stringify({ engineerId: selectedLeaderId }),
      })

      if (response.ok) {
        toast.success("Team leader assigned successfully")
        setSelectedLeaderId("")
        setAssignLeaderOpen(false)
        await refreshTeamData()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to assign leader")
      }
    } catch (error) {
      console.error("Error assigning leader:", error)
      toast.error("Failed to assign leader")
    } finally {
      setSaving(false)
    }
  }

  // Remove team leader
  async function handleRemoveLeader() {
    setSaving(true)
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/teams/${teamId}/leader`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Team leader removed")
        setRemoveLeaderOpen(false)
        await refreshTeamData()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to remove leader")
      }
    } catch (error) {
      console.error("Error removing leader:", error)
      toast.error("Failed to remove leader")
    } finally {
      setSaving(false)
    }
  }

  function toggleEngineerSelection(engId: string) {
    setSelectedEngineerIds((prev) =>
      prev.includes(engId) ? prev.filter((id) => id !== engId) : [...prev, engId]
    )
  }

  // Redirect non-DMA managers
  if (!isDMAManager) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Access Denied"
          description="Only DMA Managers can manage team members"
        />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            You do not have permission to access this page.
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Team Details" description="Loading..." />
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Team Not Found" description="The team could not be loaded" />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Team not found.{" "}
            <Button variant="link" onClick={() => router.push("/teams")}>
              Go back to teams
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const leader = team.leader
  const members = team.engineers || []
  const regularMembers = members.filter((m) => m.id !== leader?.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/teams")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <EntityStatusBadge status={team.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {team.dma_name} • {team.branch_name}
          </p>
        </div>
      </div>

      {team.description && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">{team.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Team Leader Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Team Leader
          </CardTitle>
          {leader ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignLeaderOpen(true)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Change Leader
            </Button>
          ) : (
            <Button size="sm" onClick={() => setAssignLeaderOpen(true)}>
              <Crown className="mr-2 h-4 w-4" />
              Assign Leader
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {leader ? (
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {leader.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{leader.name}</p>
                  <p className="text-xs text-muted-foreground">{leader.email}</p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  Team Leader
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setRemoveLeaderOpen(true)}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Crown className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No team leader assigned yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Assign a team leader to manage the team
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Members Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({members.length})
          </CardTitle>
          <Button size="sm" onClick={() => setAddMembersOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Members
          </Button>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No members in this team yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add engineers from the same branch to form the team
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {leader && (
                <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {leader.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{leader.name}</p>
                      <p className="text-xs text-muted-foreground">{leader.email}</p>
                    </div>
                    <Badge className="bg-amber-500">Leader</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setRemoveMemberId(leader.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {regularMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <EntityStatusBadge status={member.status as "active" | "inactive"} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setRemoveMemberId(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <CardContent className="py-4">
          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
            Team Requirements
          </h4>
          <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Engineers must have the same branch and DMA as the team</li>
            <li>• Engineers must be active and not in another team</li>
            <li>• Team leader role is automatically updated when assigned/removed</li>
          </ul>
        </CardContent>
      </Card>

      {/* Add Members Dialog */}
      <Dialog open={addMembersOpen} onOpenChange={setAddMembersOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Members</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select engineers from the same branch and DMA to add to this team.
            </p>
            
            {eligibleEngineers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No eligible engineers available</p>
                <p className="text-xs mt-1">
                  Engineers must be active and from the same branch/DMA
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {selectedEngineerIds.length} engineer(s) selected
                </p>
                <div className="max-h-64 overflow-y-auto rounded-lg border">
                  {eligibleEngineers
                    .filter((e) => !team.engineers?.some((m) => m.id === e.id))
                    .map((eng) => (
                      <button
                        key={eng.id}
                        type="button"
                        onClick={() => toggleEngineerSelection(eng.id)}
                        className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                          selectedEngineerIds.includes(eng.id)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div>
                            <p>{eng.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {eng.email}
                            </p>
                          </div>
                        </div>
                        {selectedEngineerIds.includes(eng.id) && (
                          <Badge variant="default">Selected</Badge>
                        )}
                      </button>
                    ))}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMembersOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={saving || selectedEngineerIds.length === 0}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Leader Dialog */}
      <Dialog open={assignLeaderOpen} onOpenChange={setAssignLeaderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{leader ? "Change Team Leader" : "Assign Team Leader"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              {leader
                ? "Select a new team leader. The current leader will become a regular member."
                : "Select a team leader from the available engineers."}
            </p>
            
            {eligibleLeaders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Crown className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No eligible engineers available</p>
                <p className="text-xs mt-1">
                  Add engineers to the team first to assign a leader
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label>Select Team Leader</Label>
                <Select
                  value={selectedLeaderId}
                  onValueChange={setSelectedLeaderId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleLeaders.map((eng) => (
                      <SelectItem key={eng.id} value={eng.id}>
                        {eng.name} {eng.role === "team_leader" && "(Current Leader)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignLeaderOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignLeader}
              disabled={saving || !selectedLeaderId}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {leader ? "Change Leader" : "Assign Leader"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <ConfirmDialog
        open={!!removeMemberId}
        onOpenChange={() => setRemoveMemberId(null)}
        title="Remove Team Member"
        description="Are you sure you want to remove this engineer from the team? They can be added back later."
        confirmLabel="Remove"
        onConfirm={handleRemoveMember}
      />

      {/* Remove Leader Confirmation */}
      <ConfirmDialog
        open={removeLeaderOpen}
        onOpenChange={() => setRemoveLeaderOpen(false)}
        title="Remove Team Leader"
        description="Are you sure you want to remove the team leader? They will remain in the team as a regular member and their role will change back to engineer."
        confirmLabel="Remove Leader"
        onConfirm={handleRemoveLeader}
      />
    </div>
  )
}