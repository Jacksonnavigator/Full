"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { CONFIG } from "@/lib/config"
import { EntityStatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  UserCog,
  Users,
  GitBranch,
  FileText,
  Crown,
  Settings,
  Loader2,
  CheckCircle2,
  XCircle,
  Plus,
  Building2,
  Sparkles,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { EntityStatus } from "@/lib/types"

// Types
interface Branch {
  id: string
  name: string
  dmaId: string
  utilityId: string
}

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
  status: "active" | "inactive"
  memberCount: number
  activeReports: number
  engineerIds: string[]
  createdAt: string
  updatedAt: string
}

export default function TeamsPage() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  
  // Data states
  const [teams, setTeams] = useState<Team[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  
  // DMA/Utility info
  const [dmaName, setDmaName] = useState<string>("")
  const [utilityName, setUtilityName] = useState<string>("")
  
  // UI states
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [branchFilter, setBranchFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Form states
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formBranchId, setFormBranchId] = useState("")
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")

  // Only DMA managers and utility managers can access this page
  const isDMAManager = currentUser?.role === "dma_manager"
  const isUtilityManager = currentUser?.role === "utility_manager"
  const canAccess = isDMAManager || isUtilityManager

  if (!canAccess) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only DMA and Utility Managers can manage teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const dmaId = isDMAManager ? currentUser?.dmaId ?? "" : null
  const utilityId = currentUser?.utilityId ?? ""

  // Fetch teams and branches on mount
  useEffect(() => {
    if (!canAccess) return
    if (isDMAManager && !dmaId) return
    if (isUtilityManager && !utilityId) return
    
    async function fetchData() {
      try {
        setLoading(true)
        
        // Build query parameters based on role
        let teamsUrl = `${CONFIG.backend.fullUrl}/teams`
        let branchesUrl = `${CONFIG.backend.fullUrl}/branches`
        
        if (isDMAManager && dmaId) {
          teamsUrl += `?dma_id=${dmaId}`
          branchesUrl += `?dma_id=${dmaId}`
        } else if (isUtilityManager && utilityId) {
          teamsUrl += `?utility_id=${utilityId}`
          branchesUrl += `?utility_id=${utilityId}`
        }
        
        // Fetch teams
        const teamsRes = await fetch(teamsUrl, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json()
          // Handle paginated response with {total, items} structure
          // Transform snake_case to camelCase for frontend
          const rawTeams = Array.isArray(teamsData) ? teamsData : (teamsData.items || [])
          const transformedTeams = rawTeams.map((t: Record<string, unknown>) => ({
            id: t.id as string,
            name: t.name as string,
            description: t.description as string | null,
            branchId: t.branch_id as string,
            branchName: t.branch_name as string,
            dmaId: t.dma_id as string,
            dmaName: t.dma_name as string,
            leaderId: t.leader_id as string | null,
            leaderName: t.leader_name as string | undefined,
            status: t.status as "active" | "inactive",
            memberCount: t.member_count as number,
            activeReports: t.active_reports as number,
            engineerIds: t.engineer_ids as string[] || [],
            createdAt: t.created_at as string,
            updatedAt: t.updated_at as string,
          }))
          setTeams(transformedTeams)
          
          // Get DMA/Utility name from first team if available
          if (transformedTeams.length > 0 && isDMAManager && transformedTeams[0].dmaName) {
            setDmaName(transformedTeams[0].dmaName)
          }
        }
        
        // Fetch branches
        const branchesRes = await fetch(branchesUrl, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
        if (branchesRes.ok) {
          const branchesData = await branchesRes.json()
          // Handle paginated response with {total, items} structure
          const rawBranches = Array.isArray(branchesData) ? branchesData : (branchesData.items || [])
          const transformedBranches = rawBranches.map((b: Record<string, unknown>) => ({
            id: b.id as string,
            name: b.name as string,
            dmaId: b.dma_id as string,
            utilityId: b.utility_id as string,
          }))
          setBranches(transformedBranches)
        }
        
        // Fetch DMA/Utility details if DMA manager
        if (isDMAManager && dmaId) {
          const dmaRes = await fetch(`${CONFIG.backend.fullUrl}/dmas/${dmaId}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
          if (dmaRes.ok) {
            const dmaData = await dmaRes.json()
            setDmaName(dmaData.name || "")
            // Get utility name from utility_id
            if (dmaData.utility_id) {
              const utilityRes = await fetch(`${CONFIG.backend.fullUrl}/utilities/${dmaData.utility_id}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('access_token')}` } })
              if (utilityRes.ok) {
                const utilityData = await utilityRes.json()
                setUtilityName(utilityData.name || "")
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [canAccess, isDMAManager, isUtilityManager, dmaId, utilityId])

  // Redirect non-DMA managers
  if (!isDMAManager) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <UserCog className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only DMA Managers can manage teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filter teams by search, status, and branch
  const filteredTeams = teams.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.branchName.toLowerCase().includes(search.toLowerCase()) ||
      (t.leaderName?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    const matchesBranch = branchFilter === "all" || t.branchId === branchFilter
    return matchesSearch && matchesStatus && matchesBranch
  })

  // Stats
  const totalTeams = teams.length
  const activeTeams = teams.filter(t => t.status === "active").length
  const totalMembers = teams.reduce((acc, t) => acc + t.memberCount, 0)
  const totalReports = teams.reduce((acc, t) => acc + t.activeReports, 0)

  function openCreateDialog() {
    setEditingTeam(null)
    setFormName("")
    setFormDescription("")
    setFormBranchId("")
    setFormStatus("active")
    setDialogOpen(true)
  }

  function openEditDialog(team: Team) {
    setEditingTeam(team)
    setFormName(team.name)
    setFormDescription(team.description || "")
    setFormBranchId(team.branchId)
    setFormStatus(team.status as EntityStatus)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formName.trim()) {
      toast.error("Team name is required")
      return
    }
    if (!formBranchId) {
      toast.error("Please select a branch")
      return
    }

    setSaving(true)
    
    try {
      // Use snake_case for backend
      const payload = {
        name: formName.trim(),
        description: formDescription.trim() || null,
        branch_id: formBranchId,
        dma_id: dmaId,
        status: formStatus,
      }

      let response: Response
      
      if (editingTeam) {
        response = await fetch(`${CONFIG.backend.fullUrl}/teams/${editingTeam.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        response = await fetch(`${CONFIG.backend.fullUrl}/teams`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (response.ok) {
        const savedTeam = await response.json()
        
        // Transform response to frontend format
        const transformedTeam: Team = {
          id: savedTeam.id,
          name: savedTeam.name,
          description: savedTeam.description,
          branchId: savedTeam.branch_id,
          branchName: savedTeam.branch_name || "",
          dmaId: savedTeam.dma_id,
          dmaName: savedTeam.dma_name || "",
          leaderId: savedTeam.leader_id,
          leaderName: savedTeam.leader_name,
          status: savedTeam.status,
          memberCount: savedTeam.member_count || 0,
          activeReports: savedTeam.active_reports || 0,
          engineerIds: [],
          createdAt: savedTeam.created_at,
          updatedAt: savedTeam.updated_at,
          utilityId: "",
        }
        
        if (editingTeam) {
          setTeams((prev) => prev.map((t) => (t.id === transformedTeam.id ? transformedTeam : t)))
          toast.success("Team updated successfully")
        } else {
          setTeams((prev) => [...prev, transformedTeam])
          toast.success("Team created successfully")
        }
        
        setDialogOpen(false)
      } else {
        const error = await response.json()
        toast.error(error.detail || error.error || "Failed to save team")
      }
    } catch (error) {
      console.error("Error saving team:", error)
      toast.error("Failed to save team")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/teams/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (response.ok) {
        setTeams((prev) => prev.filter((t) => t.id !== deleteId))
        toast.success("Team deleted successfully")
        setDeleteId(null)
      } else {
        const error = await response.json()
        toast.error(error.detail || error.error || "Failed to delete team")
      }
    } catch (error) {
      console.error("Error deleting team:", error)
      toast.error("Failed to delete team")
    }
  }

  function navigateToManageTeam(teamId: string) {
    router.push(`/teams/${teamId}`)
  }

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
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <UserCog className="h-5 w-5 text-white" />
              </div>
              Team Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage teams for {dmaName || "your DMA"}
            </p>
          </div>
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 rounded-xl h-11 px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 bg-gradient-to-br from-purple-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UserCog className="h-6 w-6 text-white" />
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

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Members</p>
                  <p className="text-2xl font-bold text-slate-800">{totalMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 bg-gradient-to-br from-amber-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Reports</p>
                  <p className="text-2xl font-bold text-slate-800">{totalReports}</p>
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
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/10 to-indigo-500/10 blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-purple-400 focus:ring-purple-400/20 shadow-sm"
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
          <UserCog className="h-4 w-4" />
          <span>{filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Team cards grid */}
      {filteredTeams.length === 0 ? (
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <UserCog className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">No teams found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {search || statusFilter !== "all" || branchFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Create your first team to get started"}
                </p>
              </div>
              {!search && statusFilter === "all" && branchFilter === "all" && (
                <Button 
                  onClick={openCreateDialog}
                  className="mt-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTeams.map((team) => {
            const hasMembers = team.memberCount > 0
            
            return (
              <Card 
                key={team.id} 
                className={cn(
                  "border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group transition-all duration-300 hover:-translate-y-1",
                  team.status === "active" 
                    ? "hover:shadow-xl hover:shadow-purple-500/10" 
                    : "hover:shadow-xl hover:shadow-red-500/10 bg-gradient-to-br from-red-50/20 to-white"
                )}
              >
                {/* Gradient accent line */}
                <div className={cn(
                  "h-1",
                  team.status === "active" 
                    ? "bg-gradient-to-r from-purple-400 via-violet-500 to-purple-400" 
                    : "bg-gradient-to-r from-red-400 via-rose-500 to-red-400"
                )} />
                
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110",
                        team.status === "active"
                          ? "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/20"
                          : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20"
                      )}>
                        <UserCog className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{team.name}</h3>
                        <EntityStatusBadge status={team.status as EntityStatus} />
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-lg shadow-slate-200/50">
                        <DropdownMenuItem onClick={() => navigateToManageTeam(team.id)} className="rounded-lg">
                          <Settings className="mr-2 h-4 w-4" />
                          Manage Team
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(team)} className="rounded-lg">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Info
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(team.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {team.description && (
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{team.description}</p>
                  )}

                  {/* Info Row */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <GitBranch className="h-4 w-4 text-cyan-500" />
                      <span className="font-medium">{team.branchName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {team.leaderName ? (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Crown className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">{team.leaderName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No leader assigned</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{team.memberCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <span className="font-medium">{team.activeReports}</span>
                      </div>
                    </div>
                  </div>

                  {/* Manage Team Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => navigateToManageTeam(team.id)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Team Members
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                {editingTeam ? (
                  <Pencil className="h-4 w-4 text-white" />
                ) : (
                  <Plus className="h-4 w-4 text-white" />
                )}
              </div>
              {editingTeam ? "Edit Team" : "Create Team"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            {/* DMA & Utility Info */}
            <div className="rounded-xl border border-purple-200/80 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-700">{dmaName || "Your DMA"}</span>
                <span className="text-purple-400">•</span>
                <span className="text-purple-600 text-xs">{utilityName}</span>
              </div>
              <p className="text-xs text-purple-500/80 mt-2">
                Teams are automatically assigned to your DMA and utility
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="team-name" className="text-sm font-medium text-slate-700">Team Name</Label>
              <Input
                id="team-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Team Alpha"
                className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-purple-400 focus:ring-purple-400/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="team-description" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description (Optional)
              </Label>
              <Textarea
                id="team-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g., Main team handling leak reports in Zone A..."
                className="min-h-[80px] bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-purple-400 focus:ring-purple-400/20 resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Branch</Label>
              <Select
                value={formBranchId}
                onValueChange={setFormBranchId}
              >
                <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="rounded-lg">
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Status</Label>
              <Select
                value={formStatus}
                onValueChange={(v) => setFormStatus(v as EntityStatus)}
              >
                <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
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
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={saving}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 rounded-xl"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingTeam ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Team"
        description="Are you sure you want to delete this team? All team members will be unassigned. This action cannot be undone."
        confirmLabel="Delete Team"
        onConfirm={handleDelete}
      />
    </div>
  )
}