"use client"

import { useState, useEffect } from "react"
import { useDataStore, type Utility } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { usePageAccess } from "@/hooks/use-page-access"
import { CONFIG } from "@/lib/config"
import { PageHeader } from "@/components/shared/page-header"
import { EntityStatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  Building2,
  MapPin,
  Users,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { EntityStatus } from "@/lib/types"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function UtilitiesPage() {
  usePageAccess() // Check if user has access to this page

  const { currentUser } = useAuthStore()
  const { utilities, dmas, fetchUtilities, fetchDMAs, addUtility, updateUtility } = useDataStore()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUtility, setEditingUtility] = useState<Utility | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [utilityManagers, setUtilityManagers] = useState<User[]>([])

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")

  const isAdmin = currentUser?.role === "admin"

  // Fetch data on mount
  useEffect(() => {
    fetchUtilities()
    fetchManagers()
  }, [fetchUtilities])

  async function fetchManagers() {
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/utility-managers`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.ok) {
        const users = await response.json()
        setUtilityManagers(users)
      }
    } catch (error) {
      console.error("Error fetching managers:", error)
    }
  }

  // Only Admins can create and manage utilities
  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Utility Management"
          description="Only Admins can manage utilities"
        />
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only Admins can manage utilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredUtilities = utilities.filter((u) => {
    const searchLower = search.toLowerCase().trim()
    if (!searchLower) return true
    
    // Search in multiple fields
    const matchesName = u.name?.toLowerCase().includes(searchLower)
    const matchesManager = u.managerName?.toLowerCase().includes(searchLower)
    const matchesDescription = u.description?.toLowerCase().includes(searchLower)
    const matchesStatus = u.status?.toLowerCase().includes(searchLower)
    const matchesDmasCount = u.dmasCount?.toString().includes(searchLower)
    
    return matchesName || matchesManager || matchesDescription || matchesStatus || matchesDmasCount
  })

  function openCreateDialog() {
    setEditingUtility(null)
    setFormName("")
    setFormDescription("")
    setFormStatus("active")
    setDialogOpen(true)
  }

  function openEditDialog(utility: Utility) {
    setEditingUtility(utility)
    setFormName(utility.name)
    setFormDescription(utility.description || "")
    setFormStatus(utility.status)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formName.trim()) {
      toast.error("Utility name is required")
      return
    }

    try {
      if (editingUtility) {
        await updateUtility(editingUtility.id, {
          name: formName,
          description: formDescription,
          status: formStatus,
        })
        toast.success("Utility updated successfully")
      } else {
        await addUtility({
          name: formName,
          description: formDescription,
          status: formStatus,
        })
        toast.success("Utility created successfully")
      }
      setDialogOpen(false)
    } catch {
      toast.error("Operation failed")
    }
  }

  async function handleDelete() {
    if (deleteId) {
      try {
        const response = await fetch(`${CONFIG.backend.fullUrl}/utilities/${deleteId}`, {
          method: "DELETE",
        })
        const data = await response.json()
        
        if (!response.ok) {
          if (data.message) {
            toast.error(data.message, { duration: 5000 })
          } else {
            toast.error(data.error || "Failed to delete utility")
          }
          return
        }
        
        toast.success("Utility deleted successfully")
        setDeleteId(null)
        await fetchUtilities()
      } catch (error) {
        console.error("Error deleting utility:", error)
        toast.error("Failed to delete utility")
      }
    }
  }

  // Stats
  const totalUtilities = utilities?.length || 0
  const activeUtilities = utilities?.filter(u => u.status === "active").length || 0
  const totalDmas = dmas?.length || 0

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              Utility Management
            </h1>
            <p className="text-slate-500 mt-1">Manage all utilities in the water infrastructure system</p>
          </div>
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 rounded-xl h-11 px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Utility
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 bg-gradient-to-br from-cyan-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Utilities</p>
                  <p className="text-2xl font-bold text-slate-800">{totalUtilities}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 bg-gradient-to-br from-emerald-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Utilities</p>
                  <p className="text-2xl font-bold text-slate-800">{activeUtilities}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total DMAs</p>
                  <p className="text-2xl font-bold text-slate-800">{totalDmas}</p>
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
            placeholder="Search by name, manager, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Building2 className="h-4 w-4" />
          <span>{filteredUtilities.length} utilit{filteredUtilities.length !== 1 ? 'ies' : 'y'}</span>
        </div>
      </div>

      {/* Modern Cards Grid */}
      {filteredUtilities.length === 0 ? (
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">No utilities found</p>
                <p className="text-sm text-slate-500 mt-1">Get started by creating your first utility</p>
              </div>
              <Button 
                onClick={openCreateDialog}
                className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Utility
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUtilities.map((utility) => (
            <Card 
              key={utility.id} 
              className={cn(
                "border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group transition-all duration-300 hover:-translate-y-1",
                utility.status === "active" 
                  ? "hover:shadow-xl hover:shadow-cyan-500/10" 
                  : "hover:shadow-xl hover:shadow-red-500/10 bg-gradient-to-br from-red-50/20 to-white"
              )}
            >
              {/* Gradient accent line */}
              <div className={cn(
                "h-1",
                utility.status === "active" 
                  ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400" 
                  : "bg-gradient-to-r from-red-400 via-rose-500 to-red-400"
              )} />
              
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110",
                      utility.status === "active"
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
                        : "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/20"
                    )}>
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{utility.name}</h3>
                      <EntityStatusBadge status={utility.status} />
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
                      <DropdownMenuItem onClick={() => openEditDialog(utility)} className="rounded-lg">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(utility.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {utility.description && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{utility.description}</p>
                )}

                {/* Stats Row */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Users className="h-4 w-4 text-cyan-500" />
                    <span className="font-medium">{utility.managerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{utility.dmasCount} DMAs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <span className="font-medium">{utility.reportsCount}</span>
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
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                {editingUtility ? (
                  <Pencil className="h-4 w-4 text-white" />
                ) : (
                  <Plus className="h-4 w-4 text-white" />
                )}
              </div>
              {editingUtility ? "Edit Utility" : "Add Utility"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="utility-name" className="text-sm font-medium text-slate-700">Utility Name</Label>
              <Input
                id="utility-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., DAWASA"
                className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="utility-desc" className="text-sm font-medium text-slate-700">Description</Label>
              <Textarea
                id="utility-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of the utility"
                rows={3}
                className="bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-cyan-400 focus:ring-cyan-400/20 resize-none"
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
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25 rounded-xl"
            >
              {editingUtility ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Utility
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
        title="Delete Utility"
        description="Are you sure you want to delete this utility? This action cannot be undone."
        confirmLabel="Delete Utility"
        onConfirm={handleDelete}
      />
    </div>
  )
}