"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/auth-store"
import { CONFIG } from "@/lib/config"
import { EntityStatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MoreHorizontal,
  Pencil,
  Eye,
  EyeOff,
  Search,
  Plus,
  Users,
  Phone,
  Mail,
  GitBranch,
  Crown,
  CheckCircle2,
  XCircle,
  Filter,
  UserCog,
  Loader2,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Team {
  id: string
  name: string
  description: string | null
  branchId: string
  branchName: string
  dmaId: string
  dmaName: string
  utilityId: string
  leaderId: string | null
  leaderName?: string
  leaderEmail?: string
  leaderPhone?: string
  status: "active" | "inactive"
  memberCount: number
  activeReports: number
  engineerIds: string[]
  createdAt: string
  updatedAt: string
}

interface Engineer {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  branchId: string
  branchName: string
  dmaId: string
  dmaName?: string
  teamId?: string | null
  teamName?: string | null
}

export default function TeamLeadersPage() {
  const { currentUser } = useAuthStore()
  const [teams, setTeams] = useState<Team[]>([])
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [branchFilter, setBranchFilter] = useState<string>("all")
  const [branches, setBranches] = useState<{id: string, name: string}[]>([])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null)
  const [formLeaderId, setFormLeaderId] = useState("")
  const [saving, setSaving] = useState(false)

  // DMA info
  const [dmaName, setDmaName] = useState<string>("")

  // Only DMA managers can access this page
  const isDMAManager = currentUser?.role === "dma_manager"
  const dmaId = currentUser?.dmaId ?? ""

  // Fetch data on mount
  useEffect(() => {
    if (!isDMAManager || !dmaId) return
    
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch teams for this DMA
        const teamsRes = await fetch(`${CONFIG.backend.fullUrl}/teams?dma_id=${dmaId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json()
          // Handle paginated response with {total, items} structure and transform snake_case to camelCase
          const rawTeams = Array.isArray(teamsData) ? teamsData : (teamsData.items || [])
          const transformedTeams = rawTeams.map((t: Record<string, unknown>) => ({
            id: t.id as string,
            name: t.name as string,
            description: t.description as string | null,
            branchId: t.branch_id as string,
            branchName: t.branch_name as string,
            dmaId: t.dma_id as string,
            dmaName: t.dma_name as string,
            utilityId: (t.utility_id as string) || "",
            leaderId: t.leader_id as string | null,
            leaderName: t.leader_name as string | undefined,
            leaderEmail: t.leader_email as string | undefined,
            leaderPhone: t.leader_phone as string | undefined,
            status: t.status as "active" | "inactive",
            memberCount: t.member_count as number,
            activeReports: t.active_reports as number,
            engineerIds: (t.engineer_ids as string[]) || [],
            createdAt: t.created_at as string,
            updatedAt: t.updated_at as string,
          }))
          setTeams(transformedTeams)
        }
        
        // Fetch engineers for this DMA
        const engineersRes = await fetch(`${CONFIG.backend.fullUrl}/engineers?dma_id=${dmaId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (engineersRes.ok) {
          const engineersData = await engineersRes.json()
          // Handle paginated response with {total, items} structure and transform snake_case to camelCase
          const rawEngineers = Array.isArray(engineersData) ? engineersData : (engineersData.items || [])
          const transformedEngineers = rawEngineers.map((e: Record<string, unknown>) => ({
            id: e.id as string,
            name: e.name as string,
            email: e.email as string,
            phone: e.phone as string | null,
            role: e.role as string,
            status: e.status as string,
            branchId: e.branch_id as string,
            branchName: e.branch_name as string,
            dmaId: e.dma_id as string,
            dmaName: e.dma_name as string | undefined,
            teamId: e.team_id as string | null | undefined,
            teamName: e.team_name as string | null | undefined,
          }))
          setEngineers(transformedEngineers)
        }
        
        // Fetch branches for this DMA
        const branchesRes = await fetch(`${CONFIG.backend.fullUrl}/branches?dma_id=${dmaId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (branchesRes.ok) {
          const branchesData = await branchesRes.json()
          // Handle paginated response with {total, items} structure and transform snake_case to camelCase
          const rawBranches = Array.isArray(branchesData) ? branchesData : (branchesData.items || [])
          const transformedBranches = rawBranches.map((b: Record<string, unknown>) => ({
            id: b.id as string,
            name: b.name as string,
          }))
          setBranches(transformedBranches)
        }
        
        // Fetch DMA details
        const dmaRes = await fetch(`${CONFIG.backend.fullUrl}/dmas/${dmaId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (dmaRes.ok) {
          const dmaData = await dmaRes.json()
          setDmaName(dmaData.name || "")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isDMAManager, dmaId])

  if (!isDMAManager) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Crown className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only DMA Managers can manage Team Leaders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter teams
  const filteredTeams = teams.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.leaderName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      t.branchName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || t.status === statusFilter
    const matchBranch = branchFilter === "all" || t.branchId === branchFilter
    return matchSearch && matchStatus && matchBranch
  })

  // Stats - use leaderName since backend doesn't return leader_id in list response
  const totalTeams = teams.length
  const teamsWithLeaders = teams.filter(t => t.leaderName).length
  const teamsWithoutLeaders = teams.filter(t => !t.leaderName).length
  const activeTeams = teams.filter(t => t.status === "active").length

  function openEditDialog(team: Team) {
    setEditingTeam(team)
    setFormLeaderId(team.leaderId || "")
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!editingTeam) return
    if (!formLeaderId) {
      toast.error("Please select a team leader")
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/teams/${editingTeam.id}/leader`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
        body: JSON.stringify({ engineerId: formLeaderId }),
      })

      if (response.ok) {
        toast.success("Team leader updated successfully")
        setDialogOpen(false)
        // Refresh teams
        const teamsRes = await fetch(`${CONFIG.backend.fullUrl}/teams?dma_id=${dmaId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json()
          // Handle paginated response with {total, items} structure and transform snake_case to camelCase
          const rawTeams = Array.isArray(teamsData) ? teamsData : (teamsData.items || [])
          const transformedTeams = rawTeams.map((t: Record<string, unknown>) => ({
            id: t.id as string,
            name: t.name as string,
            description: t.description as string | null,
            branchId: t.branch_id as string,
            branchName: t.branch_name as string,
            dmaId: t.dma_id as string,
            dmaName: t.dma_name as string,
            utilityId: (t.utility_id as string) || "",
            leaderId: t.leader_id as string | null,
            leaderName: t.leader_name as string | undefined,
            leaderEmail: t.leader_email as string | undefined,
            leaderPhone: t.leader_phone as string | undefined,
            status: t.status as "active" | "inactive",
            memberCount: t.member_count as number,
            activeReports: t.active_reports as number,
            engineerIds: (t.engineer_ids as string[]) || [],
            createdAt: t.created_at as string,
            updatedAt: t.updated_at as string,
          }))
          setTeams(transformedTeams)
        }
      } else {
        const error = await response.json()
        toast.error(error.detail || error.error || "Failed to update team leader")
      }
    } catch (error) {
      console.error("Error updating team leader:", error)
      toast.error("Failed to update team leader")
    } finally {
      setSaving(false)
    }
  }

  // Get engineers that can be leaders (from the same branch)
  const availableLeaders = editingTeam
    ? engineers.filter(e => 
        e.branchId === editingTeam.branchId && 
        e.status === "active"
      )
    : []

  const currentLeader = editingTeam 
    ? engineers.find((e) => e.id === formLeaderId)
    : null

  const viewingLeader = viewingTeam 
    ? engineers.find((e) => e.id === viewingTeam.leaderId)
    : null

  // Get leader info from engineers list for additional details
  const leaderInfo = viewingTeam?.leaderId 
    ? engineers.find(e => e.id === viewingTeam.leaderId)
    : null

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Crown className="h-5 w-5 text-white" />
              </div>
              Team Leaders
            </h1>
            <p className="text-slate-500 mt-1">
              Manage team leaders for {dmaName || "your DMA"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 bg-gradient-to-br from-amber-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Teams</p>
                  <p className="text-2xl font-bold text-slate-800">{totalTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 bg-gradient-to-br from-green-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Teams</p>
                  <p className="text-2xl font-bold text-slate-800">{activeTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 bg-gradient-to-br from-violet-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">With Leaders</p>
                  <p className="text-2xl font-bold text-slate-800">{teamsWithLeaders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 bg-gradient-to-br from-red-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Without Leaders</p>
                  <p className="text-2xl font-bold text-slate-800">{teamsWithoutLeaders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modern Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/10 to-orange-500/10 blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-amber-400 focus:ring-amber-400/20 shadow-sm"
            />
          </div>
          
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
              <Filter className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
              <SelectItem value="all" className="rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                  All Status
                </div>
              </SelectItem>
              <SelectItem value="active" className="rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Active
                </div>
              </SelectItem>
              <SelectItem value="inactive" className="rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-slate-400" />
                  Inactive
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Branch Filter */}
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full sm:w-48 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
              <GitBranch className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
              <SelectItem value="all" className="rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                  All Branches
                </div>
              </SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id} className="rounded-lg">
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Crown className="h-4 w-4" />
          <span>{filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Modern Table */}
      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/80 hover:from-slate-50 hover:to-slate-100/80 border-b border-slate-200/60">
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Branch
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Team Leader
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      Members
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Status
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <Crown className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800">No teams found</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {search || statusFilter !== "all" || branchFilter !== "all" 
                              ? "Try adjusting your filters" 
                              : "Create teams in the Teams page first"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeams.map((team) => {
                    const isInactive = team.status === "inactive"
                    
                    return (
                      <TableRow
                        key={team.id}
                        className={cn(
                          "border-b border-slate-100 transition-all duration-200",
                          isInactive
                            ? "bg-red-50/30 hover:bg-red-50/50"
                            : "hover:bg-amber-50/50"
                        )}
                      >
                        {/* Team */}
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg",
                              isInactive
                                ? "bg-gradient-to-br from-red-400 to-rose-500"
                                : "bg-gradient-to-br from-amber-500 to-orange-600"
                            )}>
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{team.name}</p>
                              <p className="text-xs text-slate-500">{team.memberCount} members</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Branch */}
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                              <GitBranch className="h-4 w-4 text-cyan-600" />
                            </div>
                            <span className="font-medium text-slate-700">{team.branchName}</span>
                          </div>
                        </TableCell>

                        {/* Team Leader */}
                        <TableCell className="py-4 px-6">
                          {team.leaderName ? (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <Crown className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-700">{team.leaderName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic bg-slate-100 px-3 py-1 rounded-full">No leader assigned</span>
                          )}
                        </TableCell>

                        {/* Members */}
                        <TableCell className="py-4 px-6">
                          <span className="font-medium text-slate-700">{team.memberCount}</span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-4 px-6">
                          <EntityStatusBadge status={team.status} />
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl shadow-lg shadow-slate-200/50 border-slate-200/60"
                            >
                              <DropdownMenuItem
                                onClick={() => {
                                  setViewingTeam(team)
                                  setDetailOpen(true)
                                }}
                                className="rounded-lg gap-2 cursor-pointer"
                              >
                                <Eye className="h-4 w-4 text-blue-500" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(team)}
                                className="rounded-lg gap-2 cursor-pointer"
                              >
                                <Pencil className="h-4 w-4 text-amber-500" />
                                Change Leader
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Team Leader Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Crown className="h-4 w-4 text-white" />
              </div>
              Assign Team Leader
            </DialogTitle>
          </DialogHeader>
          {editingTeam && (
            <div className="flex flex-col gap-5 py-4">
              <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{editingTeam.name}</p>
                    <p className="text-xs text-slate-500">Branch: {editingTeam.branchName}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-slate-700">Select Team Leader</Label>
                <Select value={formLeaderId} onValueChange={setFormLeaderId}>
                  <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
                    <SelectValue placeholder="Select an engineer as team leader" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                    {availableLeaders.length === 0 ? (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No active engineers in this branch
                      </div>
                    ) : (
                      availableLeaders.map((e) => (
                        <SelectItem key={e.id} value={e.id} className="rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                              <span className="text-xs text-white font-semibold">
                                {e.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {e.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {availableLeaders.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No active engineers available in this branch. Add engineers first.
                  </p>
                )}
              </div>
              
              {currentLeader && (
                <div className="rounded-xl border border-violet-200/80 bg-gradient-to-r from-violet-50/50 to-purple-50/50 p-4">
                  <p className="text-xs text-slate-500 mb-1">New Team Leader</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{currentLeader.name}</p>
                      <p className="text-xs text-slate-500">{currentLeader.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !formLeaderId}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 rounded-xl"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              Team Details
            </DialogTitle>
          </DialogHeader>
          {viewingTeam && (
            <div className="flex flex-col gap-6 py-4">
              {/* Team Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/50">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800">{viewingTeam.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <EntityStatusBadge status={viewingTeam.status} />
                  </div>
                </div>
              </div>

              {/* Description */}
              {viewingTeam.description && (
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-sm text-slate-700">{viewingTeam.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <GitBranch className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Branch</p>
                    <p className="text-sm font-medium text-slate-700">{viewingTeam.branchName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">DMA</p>
                    <p className="text-sm font-medium text-slate-700">{viewingTeam.dmaName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Team Leader</p>
                    {viewingTeam.leaderName ? (
                      <p className="text-sm font-medium text-slate-700">{viewingTeam.leaderName}</p>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unassigned</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <UserCog className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Members</p>
                    <p className="text-sm font-medium text-slate-700">{viewingTeam.memberCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Leader Email</p>
                    <p className="text-sm font-medium text-slate-700">{viewingTeam.leaderEmail || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Leader Phone</p>
                    <p className="text-sm font-medium text-slate-700">{viewingTeam.leaderPhone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)} className="rounded-xl">
              Close
            </Button>
            {viewingTeam && (
              <Button
                onClick={() => {
                  setDetailOpen(false)
                  openEditDialog(viewingTeam)
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25 rounded-xl"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Change Leader
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}