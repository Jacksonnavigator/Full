"use client"

import { useState, useEffect } from "react"
import { useDataStore, type DMA } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { PageHeader } from "@/components/shared/page-header"
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
  DialogDescription,
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
  MapPin,
  Users,
  FileText,
  Building2,
  Sparkles,
  CheckCircle2,
  XCircle,
  GitBranch
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { EntityStatus } from "@/lib/types"

export default function DMAsPage() {
  const { currentUser } = useAuthStore()
  const { dmas, utilities, branches, fetchDMAs, fetchUtilities, fetchBranches, addDMA, updateDMA, deleteDMA } = useDataStore()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDMA, setEditingDMA] = useState<DMA | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formUtilityId, setFormUtilityId] = useState("")
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")

  // Fetch data on mount
  useEffect(() => {
    fetchDMAs()
    fetchUtilities()
    fetchBranches()
  }, [fetchDMAs, fetchUtilities, fetchBranches])

  const isAdmin = currentUser?.role === "admin"
  const isUtility = currentUser?.role === "utility_manager"
  const isDMA = currentUser?.role === "dma_manager"
  
  // Only Utility Managers can create and manage DMAs
  // Admin can only view DMAs
  const canEdit = isUtility

  // DMA Managers cannot access this page
  if (isDMA) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="DMA Management"
          description="Only Utility Managers can manage DMAs"
        />
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only Utility Managers can manage DMAs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get the utility info for the current utility manager
  const myUtilityId = currentUser?.utilityId || null
  const utilityFromList = myUtilityId ? utilities.find((u) => u.id === myUtilityId) : null
  const utilityByManager = isUtility ? utilities.find((u) => u.managerId === currentUser?.id) : null
  
  // Priority: currentUser.utilityName > utilities list > utilities by manager > empty
  const myUtilityName = currentUser?.utilityName || utilityFromList?.name || utilityByManager?.name || ""
  const resolvedUtilityId = myUtilityId || utilityByManager?.id || null

  // Scope dmas based on role
  const scopedDMAs = isAdmin
    ? dmas
    : isUtility
      ? dmas.filter((d) => d.utilityId === resolvedUtilityId)
      : dmas

  const filteredDMAs = scopedDMAs.filter((d) => {
    const searchLower = search.toLowerCase().trim()
    if (!searchLower) return true
    
    const matchesName = d.name?.toLowerCase().includes(searchLower)
    const matchesUtility = d.utilityName?.toLowerCase().includes(searchLower)
    const matchesManager = d.managerName?.toLowerCase().includes(searchLower)
    const matchesStatus = d.status?.toLowerCase().includes(searchLower)
    
    return matchesName || matchesUtility || matchesManager || matchesStatus
  })

  function openCreateDialog() {
    setEditingDMA(null)
    setFormName("")
    setFormDescription("")
    setFormUtilityId(resolvedUtilityId || "")
    setFormStatus("active")
    setDialogOpen(true)
  }

  function openEditDialog(dma: DMA) {
    setEditingDMA(dma)
    setFormName(dma.name)
    setFormDescription(dma.description || "")
    setFormUtilityId(dma.utilityId)
    setFormStatus(dma.status)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formName.trim()) {
      toast.error("DMA name is required")
      return
    }
    if (!formUtilityId) {
      toast.error("Please select a utility")
      return
    }

    const utility = utilities.find((r) => r.id === formUtilityId)

    try {
      if (editingDMA) {
        await updateDMA(editingDMA.id, {
          name: formName,
          description: formDescription || null,
          utilityId: formUtilityId,
          utilityName: utility?.name ?? "",
          status: formStatus,
        })
        toast.success("DMA updated successfully")
      } else {
        await addDMA({
          name: formName,
          description: formDescription || null,
          utilityId: formUtilityId,
          utilityName: utility?.name ?? "",
          status: formStatus,
        })
        toast.success("DMA created successfully")
      }
      setDialogOpen(false)
    } catch {
      toast.error("Operation failed")
    }
  }

  async function handleDelete() {
    if (deleteId) {
      try {
        await deleteDMA(deleteId)
        toast.success("DMA deleted successfully")
        setDeleteId(null)
      } catch {
        toast.error("Failed to delete DMA")
      }
    }
  }

  // Stats
  const totalDMAs = scopedDMAs?.length || 0
  const activeDMAs = scopedDMAs?.filter(d => d.status === "active").length || 0
  // For utility managers, count only branches in their utility's DMAs. For admins, count all branches.
  const totalBranches = isAdmin 
    ? branches?.length || 0
    : branches?.filter(b => scopedDMAs?.some(d => d.id === b.dmaId)).length || 0
  const totalReports = scopedDMAs?.reduce((acc, d) => acc + (d.reportsCount || 0), 0) || 0

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              DMA Management
            </h1>
            <p className="text-slate-500 mt-1">
              {isUtility 
                ? `Manage District Meter Areas for ${myUtilityName}`
                : "Manage all District Meter Areas in the system"
              }
            </p>
          </div>
          {canEdit && (
            <Button 
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 rounded-xl h-11 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add DMA
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 bg-gradient-to-br from-emerald-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total DMAs</p>
                  <p className="text-2xl font-bold text-slate-800">{totalDMAs}</p>
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
                  <p className="text-sm font-medium text-slate-500">Active DMAs</p>
                  <p className="text-2xl font-bold text-slate-800">{activeDMAs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <GitBranch className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Branches</p>
                  <p className="text-2xl font-bold text-slate-800">{totalBranches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 bg-gradient-to-br from-purple-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Reports</p>
                  <p className="text-2xl font-bold text-slate-800">{totalReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modern Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/10 to-teal-500/10 blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name, utility, manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span>{filteredDMAs.length} DMA{filteredDMAs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Modern Cards Grid */}
      {filteredDMAs.length === 0 ? (
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">No DMAs found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {canEdit ? "Get started by creating your first DMA" : "No DMAs match your search criteria"}
                </p>
              </div>
              {canEdit && (
                <Button 
                  onClick={openCreateDialog}
                  className="mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add DMA
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDMAs.map((dma) => (
            <Card 
              key={dma.id} 
              className={cn(
                "border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group transition-all duration-300 hover:-translate-y-1",
                dma.status === "active" 
                  ? "hover:shadow-xl hover:shadow-emerald-500/10" 
                  : "hover:shadow-xl hover:shadow-red-500/10 bg-gradient-to-br from-red-50/20 to-white"
              )}
            >
              {/* Gradient accent line */}
              <div className={cn(
                "h-1",
                dma.status === "active" 
                  ? "bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400" 
                  : "bg-gradient-to-r from-red-400 via-rose-500 to-red-400"
              )} />
              
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110",
                      dma.status === "active"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
                        : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20"
                    )}>
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{dma.name}</h3>
                      <EntityStatusBadge status={dma.status} />
                    </div>
                  </div>
                  
                  {canEdit && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-lg shadow-slate-200/50">
                        <DropdownMenuItem onClick={() => openEditDialog(dma)} className="rounded-lg">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(dma.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {dma.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{dma.description}</p>
                )}

                {/* Info Row */}
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Building2 className="h-4 w-4 text-cyan-500" />
                    <span className="font-medium">{dma.utilityName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{dma.managerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <GitBranch className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium">{dma.branchesCount} branches</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{dma.reportsCount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modern Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                {editingDMA ? (
                  <Pencil className="h-4 w-4 text-white" />
                ) : (
                  <Plus className="h-4 w-4 text-white" />
                )}
              </div>
              {editingDMA ? "Edit DMA" : "Add DMA"}
            </DialogTitle>
            <DialogDescription>
              {editingDMA 
                ? "Update the DMA details below."
                : "Create a new District Meter Area for your utility."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="dma-name" className="text-sm font-medium text-slate-700">DMA Name</Label>
              <Input
                id="dma-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Ilala DMA"
                className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>
            
            {/* Utility is auto-assigned - show as read-only */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Utility</Label>
              <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">{myUtilityName}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="dma-description" className="text-sm font-medium text-slate-700">Description</Label>
              <Textarea
                id="dma-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter a description for this DMA (optional)"
                rows={3}
                className="bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-emerald-400 focus:ring-emerald-400/20 resize-none"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Status</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as EntityStatus)}>
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
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl"
            >
              {editingDMA ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create DMA
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
        title="Delete DMA"
        description="Are you sure you want to delete this DMA? This will also remove all associated branches. This action cannot be undone."
        confirmLabel="Delete DMA"
        onConfirm={handleDelete}
      />
    </div>
  )
}