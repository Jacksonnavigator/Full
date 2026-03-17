"use client"

import { useState, useEffect } from "react"
import { useDataStore } from "@/store/data-store"
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
  Plus,
  GitBranch,
  Users,
  UserCog,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  XCircle,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { EntityStatus } from "@/lib/types"

interface Branch {
  id: string
  name: string
  description: string | null
  dma_id: string
  dma_name: string
  utility_id: string
  utility_name: string
  status: string
  engineer_count: number
  team_count: number
  report_count: number
  created_at: string
  updated_at: string
}

export default function BranchesPage() {
  const { currentUser } = useAuthStore()
  const { dmas, fetchDMAs } = useDataStore()
  const [branches, setBranches] = useState<Branch[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [deleteBranch, setDeleteBranch] = useState<Branch | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")

  // Fetch data on mount
  useEffect(() => {
    fetchDMAs()
    fetchBranches()
  }, [fetchDMAs])

  async function fetchBranches() {
    try {
      const { dmaId, utilityId } = currentUser || {}
      const isDMAManager = currentUser?.role === "dma_manager"
      const isUtilityManager = currentUser?.role === "utility_manager"
      const isAdmin = currentUser?.role === "admin"
      
      let url = `${CONFIG.backend.fullUrl}/branches?limit=100`
      
      if (isDMAManager && dmaId) {
        url += `&dmaId=${dmaId}`
      } else if (isUtilityManager && utilityId) {
        url += `&utilityId=${utilityId}`
      }
      // Admins see all branches (no filter)
      
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Handle paginated response with {total, items} structure
        setBranches(Array.isArray(data) ? data : (data.items || []))
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
    }
  }

  // Only DMA managers and admins can access this page
  // Utility managers can view branches of their utility
  // Admins can view all branches (read-only)
  // Utility managers can view branches of their utility (read-only)
  const isDMAManager = currentUser?.role === "dma_manager"
  const isUtilityManager = currentUser?.role === "utility_manager"
  const isAdmin = currentUser?.role === "admin"
  const canAccess = isDMAManager || isUtilityManager || isAdmin
  const canManage = isDMAManager // Only DMA managers can create/edit/delete
  
  // Get DMA info
  const dmaId = isDMAManager ? currentUser?.dmaId ?? "" : null
  const dma = dmaId ? dmas.find((d) => d.id === dmaId) : null
  const utilityId = currentUser?.utilityId ?? ""
  const utilityName = currentUser?.utilityName ?? "Your Utility"

  if (!canAccess) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only DMA and Utility Managers can view branches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

  // Stats
  const totalBranches = branches.length
  const activeBranches = branches.filter(b => b.status === "active").length
  const totalEngineers = branches.reduce((acc, b) => acc + b.engineer_count, 0)
  const totalTeams = branches.reduce((acc, b) => acc + b.team_count, 0)

  function openCreateDialog() {
    setEditingBranch(null)
    setFormName("")
    setFormDescription("")
    setFormStatus("active")
    setDialogOpen(true)
  }

  function openEditDialog(branch: Branch) {
    setEditingBranch(branch)
    setFormName(branch.name)
    setFormDescription(branch.description || "")
    setFormStatus(branch.status as EntityStatus)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formName.trim()) {
      toast.error("Branch name is required")
      return
    }

    // For new branches, ensure DMA manager has a DMA assigned
    if (!editingBranch && isDMAManager && !dmaId) {
      toast.error("You must be assigned to a DMA to create branches")
      return
    }

    try {
      if (editingBranch) {
        // Update existing branch
        const response = await fetch(`${CONFIG.backend.fullUrl}/branches/${editingBranch.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            description: formDescription || null,
            status: formStatus,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update branch")
        }

        toast.success("Branch updated successfully")
      } else {
        // Create new branch - only for DMA managers with assigned DMA
        const response = await fetch(`${CONFIG.backend.fullUrl}/branches`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            description: formDescription || null,
            dma_id: dmaId,
            status: formStatus,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create branch")
        }

        toast.success("Branch created successfully")
      }

      setDialogOpen(false)
      await fetchBranches()
    } catch (error) {
      console.error("Error saving branch:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save branch")
    }
  }

  async function handleDelete() {
    if (!deleteBranch) return

    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/branches/${deleteBranch.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete branch")
      }

      toast.success("Branch deleted successfully")
      setDeleteBranch(null)
      await fetchBranches()
    } catch (error) {
      console.error("Error deleting branch:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete branch")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <GitBranch className="h-5 w-5 text-white" />
              </div>
              Branch Management
            </h1>
            <p className="text-slate-500 mt-1">
              {isAdmin || isUtilityManager ? "View all branches in the system" : `Manage branches for ${dma?.name || "your DMA"}`}
            </p>
          </div>
          {canManage && (
            <Button 
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-xl h-11 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 bg-gradient-to-br from-cyan-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <GitBranch className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Branches</p>
                  <p className="text-2xl font-bold text-slate-800">{totalBranches}</p>
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
                  <p className="text-sm font-medium text-slate-500">Active Branches</p>
                  <p className="text-2xl font-bold text-slate-800">{activeBranches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UserCog className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Engineers</p>
                  <p className="text-2xl font-bold text-slate-800">{totalEngineers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 bg-gradient-to-br from-purple-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Teams</p>
                  <p className="text-2xl font-bold text-slate-800">{totalTeams}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modern Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-blue-500/10 blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search branches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <GitBranch className="h-4 w-4" />
          <span>{filteredBranches.length} branch{filteredBranches.length !== 1 ? 'es' : ''}</span>
        </div>
      </div>

      {/* Modern Cards Grid */}
      {filteredBranches.length === 0 ? (
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <GitBranch className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">No branches found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {search ? "Try adjusting your search terms" : "Get started by creating your first branch"}
                </p>
              </div>
              {!search && canManage && (
                <Button 
                  onClick={openCreateDialog}
                  className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBranches.map((branch) => {
            const isInactive = branch.status === "inactive"
            const hasData = branch.engineer_count > 0 || branch.team_count > 0 || branch.report_count > 0
            
            return (
              <Card 
                key={branch.id} 
                className={cn(
                  "border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group transition-all duration-300 hover:-translate-y-1",
                  branch.status === "active" 
                    ? "hover:shadow-xl hover:shadow-cyan-500/10" 
                    : "hover:shadow-xl hover:shadow-red-500/10 bg-gradient-to-br from-red-50/20 to-white"
                )}
              >
                {/* Gradient accent line */}
                <div className={cn(
                  "h-1",
                  branch.status === "active" 
                    ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400" 
                    : "bg-gradient-to-r from-red-400 via-rose-500 to-red-400"
                )} />
                
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110",
                        branch.status === "active"
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
                          : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20"
                      )}>
                        <GitBranch className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{branch.name}</h3>
                        <EntityStatusBadge status={branch.status as EntityStatus} />
                      </div>
                    </div>
                    
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100">
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl shadow-lg shadow-slate-200/50">
                          <DropdownMenuItem onClick={() => openEditDialog(branch)} className="rounded-lg">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => !hasData && setDeleteBranch(branch)}
                            className={cn(
                              "rounded-lg",
                              hasData 
                                ? "text-slate-400 cursor-not-allowed" 
                                : "text-red-600 focus:text-red-600 focus:bg-red-50"
                            )}
                            disabled={hasData}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          {hasData && (
                            <div className="px-2 py-1.5 text-xs text-slate-500 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Has associated data
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {branch.description && (
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{branch.description}</p>
                  )}

                  {/* Info Row */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Building2 className="h-4 w-4 text-cyan-500" />
                      <span className="font-medium">{branch.dma_name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <UserCog className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{branch.engineer_count} engineers</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Users className="h-4 w-4 text-indigo-500" />
                        <span className="font-medium">{branch.team_count} teams</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <FileText className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{branch.report_count}</span>
                      </div>
                    </div>
                  </div>
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
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                {editingBranch ? (
                  <Pencil className="h-4 w-4 text-white" />
                ) : (
                  <Plus className="h-4 w-4 text-white" />
                )}
              </div>
              {editingBranch ? "Edit Branch" : "Add Branch"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            {/* DMA & Utility Info */}
            <div className="rounded-xl border border-cyan-200/80 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">Utility:</span>
                  <span className="font-semibold text-cyan-700">{editingBranch?.utility_name || dma?.utilityName || utilityName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500">DMA:</span>
                  <span className="font-semibold text-cyan-700">{editingBranch?.dma_name || dma?.name || "Not assigned"}</span>
                </div>
              </div>
              {!editingBranch && (
                <p className="text-xs text-cyan-500/80 mt-3">
                  Branches are automatically assigned to the DMA shown above
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="branch-name" className="text-sm font-medium text-slate-700">Branch Name</Label>
              <Input
                id="branch-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Sandton Branch"
                className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="branch-description" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description (Optional)
              </Label>
              <Textarea
                id="branch-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g., Main branch serving the northern area..."
                className="min-h-[80px] bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20 resize-none"
              />
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
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 rounded-xl"
            >
              {editingBranch ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Branch
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteBranch}
        onOpenChange={() => setDeleteBranch(null)}
        title="Delete Branch"
        description={
          deleteBranch && (deleteBranch.engineer_count > 0 || deleteBranch.team_count > 0 || deleteBranch.report_count > 0)
            ? `Cannot delete "${deleteBranch.name}" because it has associated data (${deleteBranch.engineer_count} engineers, ${deleteBranch.team_count} teams, ${deleteBranch.report_count} reports).`
            : `Are you sure you want to delete "${deleteBranch?.name}"? This action cannot be undone.`
        }
        confirmLabel={deleteBranch && (deleteBranch.engineer_count > 0 || deleteBranch.team_count > 0 || deleteBranch.report_count > 0) ? undefined : "Delete Branch"}
        onConfirm={deleteBranch && (deleteBranch.engineer_count > 0 || deleteBranch.team_count > 0 || deleteBranch.report_count > 0) ? () => setDeleteBranch(null) : handleDelete}
      />
    </div>
  )
}