"use client"

import { useState, useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { CONFIG } from "@/lib/config"
import { EntityStatusBadge } from "@/components/shared/status-badge"
import type { EntityStatus } from "@/lib/types"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
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
  DialogDescription,
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
  Trash2,
  Search,
  Plus,
  Users,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  UserCog,
  Lock,
  Building2,
  CheckCircle2,
  Sparkles,
  User,
  GitBranch,
  Layers,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Engineer {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: EntityStatus
  branchId: string
  branchName: string
  dmaId: string
  dmaName?: string
  teamId?: string | null
  teamName?: string | null
  assignedReports?: number
}

export default function EngineersPage() {
  const { currentUser } = useAuthStore()
  const { branches, dmas, fetchBranches, fetchDMAs } = useDataStore()
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [viewingEngineer, setViewingEngineer] = useState<Engineer | null>(null)
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formBranchId, setFormBranchId] = useState("")
  const [formStatus, setFormStatus] = useState<string>("active")
  const [formPassword, setFormPassword] = useState("")
  const [formConfirmPassword, setFormConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)

  // Fetch data on mount
  useEffect(() => {
    fetchBranches()
    fetchDMAs()
    fetchEngineers()
  }, [fetchBranches, fetchDMAs])

  async function fetchEngineers() {
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/engineers`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Handle paginated response with {total, items} structure
        // Transform snake_case to camelCase for frontend
        const rawEngineers = Array.isArray(data) ? data : (data.items || [])
        const transformedEngineers = rawEngineers.map((e: Record<string, unknown>) => ({
          id: e.id as string,
          name: e.name as string,
          email: e.email as string,
          phone: e.phone as string | null,
          role: e.role as string,
          status: e.status as EntityStatus,
          branchId: e.branch_id as string,
          branchName: e.branch_name as string,
          dmaId: e.dma_id as string,
          dmaName: e.dma_name as string,
          teamId: e.team_id as string | null,
          teamName: e.team_name as string | null,
          assignedReports: e.assigned_reports as number,
        }))
        setEngineers(transformedEngineers)
      }
    } catch (error) {
      console.error("Error fetching engineers:", error)
    }
  }

  // Only DMA managers and utility managers can access this page
  const isDMAManager = currentUser?.role === "dma_manager"
  const isUtilityManager = currentUser?.role === "utility_manager"
  const canAccess = isDMAManager || isUtilityManager
  const canManage = isDMAManager // Only DMA managers can create/edit/delete engineers

  if (!canAccess) {
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
                <p className="text-sm text-slate-500 mt-1">Only DMA and Utility Managers can manage engineers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dmaId = isDMAManager ? currentUser?.dmaId ?? "" : null
  const utilityId = currentUser?.utilityId ?? null
  const myDMA = dmaId ? dmas.find((d) => d.id === dmaId) : null
  const myDMAName = myDMA?.name || "Your DMA"

  // Filter branches: by DMA for DMA managers, by utility for utility managers
  const myBranches = isDMAManager
    ? branches.filter((b) => b.dmaId === dmaId)
    : branches.filter((b) => b.utilityId === utilityId)

  // Filter engineers: by DMA for DMA managers, by utility for utility managers
  const scopedEngineers = isDMAManager
    ? engineers.filter((e) => e.dmaId === dmaId)
    : engineers.filter((e) => {
        // For utility managers, include engineers from any DMA in their utility
        const dmaInUtility = dmas.find((d) => d.id === e.dmaId)
        return dmaInUtility?.utilityId === utilityId
      })

  const filteredEngineers = scopedEngineers.filter((e) => {
    const searchLower = search.toLowerCase().trim()
    if (!searchLower) return true
    const matchSearch =
      e.name.toLowerCase().includes(searchLower) ||
      e.email.toLowerCase().includes(searchLower) ||
      e.branchName.toLowerCase().includes(searchLower)
    const matchStatus = statusFilter === "all" || e.status === statusFilter
    return matchSearch && matchStatus
  })

  function openCreateDialog() {
    setEditingEngineer(null)
    setFormName("")
    setFormEmail("")
    setFormPhone("")
    setFormBranchId("")
    setFormStatus("active")
    setFormPassword("")
    setFormConfirmPassword("")
    setGeneratedPassword(null)
    setDialogOpen(true)
  }

  function openEditDialog(engineer: Engineer) {
    setEditingEngineer(engineer)
    setFormName(engineer.name)
    setFormEmail(engineer.email)
    setFormPhone(engineer.phone ?? "")
    setFormBranchId(engineer.branchId)
    setFormStatus(engineer.status ?? "active")
    setFormPassword("")
    setFormConfirmPassword("")
    setGeneratedPassword(null)
    setDialogOpen(true)
  }

  function openViewDialog(engineer: Engineer) {
    setViewingEngineer(engineer)
    setViewDialogOpen(true)
  }

  // Generate a random password
  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormPassword(password)
    setFormConfirmPassword(password) // Auto-fill confirm password
    setGeneratedPassword(password)
  }

  // Copy password to clipboard
  function copyPasswordToClipboard() {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword)
      toast.success("Password copied to clipboard")
    }
  }

  async function handleSubmit() {
    if (!formName.trim()) {
      toast.error("Engineer name is required")
      return
    }
    if (!formEmail.trim()) {
      toast.error("Email is required")
      return
    }
    if (!formBranchId) {
      toast.error("Please select a branch")
      return
    }
    // Password required for new engineers
    if (!editingEngineer && !formPassword.trim()) {
      toast.error("Password is required for new engineers")
      return
    }
    // Validate password confirmation when password is provided
    if (formPassword.trim() && formPassword !== formConfirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const branch = myBranches.find((b) => b.id === formBranchId)

    try {
      if (editingEngineer) {
        const updateData: Record<string, unknown> = {
          id: editingEngineer.id,
          name: formName,
          email: formEmail,
          phone: formPhone || null,
          branch_id: formBranchId,
          status: formStatus,
        }
        // Only include password if provided
        if (formPassword.trim()) {
          updateData.password = formPassword
        }
        const response = await fetch(`${CONFIG.backend.fullUrl}/engineers`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        })
        if (!response.ok) {
          const error = await response.json()
          toast.error(error.detail || error.error || "Failed to update engineer")
          return
        }
        toast.success("Engineer updated successfully")
      } else {
        const response = await fetch(`${CONFIG.backend.fullUrl}/engineers`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            phone: formPhone || null,
            branch_id: formBranchId,
            dma_id: dmaId,
            status: formStatus,
            password: formPassword,
          }),
        })
        if (!response.ok) {
          const error = await response.json()
          toast.error(error.detail || error.error || "Failed to create engineer")
          return
        }
        toast.success("Engineer added successfully")
      }

      setDialogOpen(false)
      await fetchEngineers()
    } catch (error) {
      console.error("Error saving engineer:", error)
      toast.error("An unexpected error occurred. Please try again.")
    }
  }

  async function handleDelete() {
    if (!deleteId) return

    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/engineers?id=${deleteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete engineer")
      }

      toast.success("Engineer removed successfully")
      setDeleteId(null)
      await fetchEngineers()
    } catch (error) {
      console.error("Error deleting engineer:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete engineer")
    }
  }

  // Stats
  const totalEngineers = scopedEngineers.length
  const activeEngineers = scopedEngineers.filter((e) => e.status === "active").length
  const teamLeadersCount = scopedEngineers.filter((e) => e.role === "team_leader").length
  const teamMembersCount = scopedEngineers.filter((e) => e.role === "engineer").length

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header with Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              Engineers
            </h1>
            <p className="text-slate-500 mt-1">
              {canManage ? `Manage engineers for ${myDMAName}` : `View engineers in your utility`}
            </p>
          </div>
          {canManage && (
            <Button
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 rounded-xl h-11 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Engineer
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 bg-gradient-to-br from-teal-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Engineers</p>
                  <p className="text-2xl font-bold text-slate-800">{totalEngineers}</p>
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
                  <p className="text-sm font-medium text-slate-500">Active</p>
                  <p className="text-2xl font-bold text-slate-800">{activeEngineers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 bg-gradient-to-br from-violet-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UserCog className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Team Leaders</p>
                  <p className="text-2xl font-bold text-slate-800">{teamLeadersCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Team Members</p>
                  <p className="text-2xl font-bold text-slate-800">{teamMembersCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modern Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400/10 to-cyan-500/10 blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name, email, or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-teal-400 focus:ring-teal-400/20 shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
              <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
              <SelectItem value="active" className="rounded-lg">Active</SelectItem>
              <SelectItem value="inactive" className="rounded-lg">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="h-4 w-4" />
            <span>{filteredEngineers.length} engineer{filteredEngineers.length !== 1 ? 's' : ''}</span>
          </div>
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
                      <User className="h-4 w-4" />
                      Engineer
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact
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
                      <Layers className="h-4 w-4" />
                      Team
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      Role
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
                {filteredEngineers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800">No engineers found</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {search || statusFilter !== "all" ? "Try adjusting your search terms" : "Get started by creating your first engineer"}
                          </p>
                        </div>
                        {!search && statusFilter === "all" && canManage && (
                          <Button
                            onClick={openCreateDialog}
                            className="mt-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 rounded-xl"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Engineer
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEngineers.map((engineer) => {
                    const isInactive = engineer.status === "inactive"
                    const isTeamLeader = engineer.role === "team_leader"

                    return (
                      <TableRow
                        key={engineer.id}
                        className={cn(
                          "border-b border-slate-100 transition-all duration-200",
                          isInactive
                            ? "bg-red-50/30 hover:bg-red-50/50"
                            : "hover:bg-teal-50/50"
                        )}
                      >
                        {/* Engineer Info with Avatar */}
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className={cn(
                              "h-10 w-10 shadow-lg transition-all duration-300",
                              isInactive
                                ? "ring-2 ring-red-200"
                                : isTeamLeader
                                  ? "ring-2 ring-violet-200"
                                  : "ring-2 ring-teal-200"
                            )}>
                              <AvatarFallback className={cn(
                                "text-sm font-semibold",
                                isInactive
                                  ? "bg-gradient-to-br from-red-400 to-rose-500 text-white"
                                  : isTeamLeader
                                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                                    : "bg-gradient-to-br from-teal-500 to-cyan-600 text-white"
                              )}>
                                {getInitials(engineer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800">{engineer.name}</p>
                              <p className="text-xs text-slate-500">
                                {engineer.assignedReports ?? 0} reports
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact Info */}
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              <span className="truncate max-w-[180px]">{engineer.email}</span>
                            </div>
                            {engineer.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                <span>{engineer.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Branch */}
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                              <GitBranch className="h-4 w-4 text-cyan-600" />
                            </div>
                            <span className="font-medium text-slate-700">{engineer.branchName}</span>
                          </div>
                        </TableCell>

                        {/* Team */}
                        <TableCell className="py-4 px-6">
                          {engineer.teamName ? (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                                <Layers className="h-4 w-4 text-violet-600" />
                              </div>
                              <span className="font-medium text-slate-700">{engineer.teamName}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100">
                              <Layers className="h-3 w-3 mr-1" />
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>

                        {/* Role */}
                        <TableCell className="py-4 px-6">
                          <Badge
                            variant={isTeamLeader ? "default" : "secondary"}
                            className={cn(
                              "text-[11px] font-medium",
                              isTeamLeader
                                ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                          >
                            {isTeamLeader ? "Team Leader" : "Engineer"}
                          </Badge>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-4 px-6">
                          <EntityStatusBadge status={engineer.status} />
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
                                onClick={() => openViewDialog(engineer)}
                                className="rounded-lg gap-2 cursor-pointer"
                              >
                                <Eye className="h-4 w-4 text-blue-500" />
                                View Details
                              </DropdownMenuItem>
                              {canManage && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => openEditDialog(engineer)}
                                    className="rounded-lg gap-2 cursor-pointer"
                                  >
                                    <Pencil className="h-4 w-4 text-teal-500" />
                                    Edit Engineer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(engineer.id)}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg gap-2 cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Remove Engineer
                                  </DropdownMenuItem>
                                </>
                              )}
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

      {/* Modern Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                {editingEngineer ? (
                  <Pencil className="h-4 w-4 text-white" />
                ) : (
                  <Plus className="h-4 w-4 text-white" />
                )}
              </div>
              {editingEngineer ? "Edit Engineer" : "Add Engineer"}
            </DialogTitle>
            <DialogDescription>
              {editingEngineer
                ? "Update the engineer details below."
                : `Create a new engineer for ${myDMAName}. Team assignment is done in Teams Management.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4 overflow-y-auto flex-1 min-h-0">
            <div className="flex flex-col gap-2">
              <Label htmlFor="eng-name" className="text-sm font-medium text-slate-700">Full Name</Label>
              <Input
                id="eng-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., John Smith"
                className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-teal-400 focus:ring-teal-400/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="eng-email" className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  id="eng-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-teal-400 focus:ring-teal-400/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="eng-phone" className="text-sm font-medium text-slate-700">Phone</Label>
                <Input
                  id="eng-phone"
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+27 XX XXX XXXX"
                  className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-teal-400 focus:ring-teal-400/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="eng-password" className="text-sm font-medium text-slate-700">
                  Password {!editingEngineer && <span className="text-red-500">*</span>}
                </Label>
                {!editingEngineer && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generatePassword}
                    className="h-7 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="eng-password"
                  type={showPassword ? "text" : "password"}
                  value={formPassword}
                  onChange={(e) => {
                    setFormPassword(e.target.value)
                    setGeneratedPassword(null)
                  }}
                  placeholder={editingEngineer ? "Leave blank to keep current password" : "Enter password"}
                  className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-teal-400 focus:ring-teal-400/20 pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {generatedPassword && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={copyPasswordToClipboard}
                      className="h-7 w-7 text-slate-400 hover:text-slate-600"
                    >
                      <Lock className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="h-7 w-7 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
              {generatedPassword && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Password generated! Copy it now - it won't be shown again.
                </p>
              )}
              {editingEngineer && (
                <p className="text-xs text-slate-500">
                  Leave blank to keep the current password unchanged.
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            {formPassword && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="eng-confirm-password" className="text-sm font-medium text-slate-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="eng-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formConfirmPassword}
                    onChange={(e) => setFormConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-teal-400 focus:ring-teal-400/20 pr-10"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="h-7 w-7 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
                {formConfirmPassword && formPassword && formConfirmPassword !== formPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* DMA Info */}
            <div className="rounded-xl border border-teal-200/80 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-teal-600" />
                <span className="font-semibold text-teal-700">{myDMAName}</span>
                <span className="text-teal-400">•</span>
                <span className="text-teal-600 text-xs">Your DMA</span>
              </div>
              <p className="text-xs text-teal-500/80 mt-2">
                The engineer will belong to this DMA
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Assign to Branch</Label>
              <Select value={formBranchId} onValueChange={setFormBranchId}>
                <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                  {myBranches.length === 0 ? (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      No branches available in your DMA
                    </div>
                  ) : (
                    myBranches.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-cyan-500" />
                          {b.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {myBranches.length === 0 && (
                <p className="text-xs text-amber-600">
                  No branches found in your DMA. Please contact your utility manager.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
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
                      <div className="h-4 w-4 rounded-full bg-slate-400" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info Note */}
            <div className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4">
              <div className="flex items-start gap-3">
                <Layers className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Team Assignment</p>
                  <p className="text-xs text-blue-600/80 mt-1">
                    Team assignment and Team Leader designation are done in Teams Management. 
                    All engineers are created with the "Engineer" role by default.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 rounded-xl"
            >
              {editingEngineer ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Engineer
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
        title="Remove Engineer"
        description="Are you sure you want to remove this engineer? This action cannot be undone."
        confirmLabel="Remove Engineer"
        onConfirm={handleDelete}
      />

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              Engineer Details
            </DialogTitle>
          </DialogHeader>
          {viewingEngineer && (
            <div className="flex flex-col gap-6 py-4">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-teal-50/50 to-cyan-50/50 border border-teal-200/50">
                <Avatar className="h-16 w-16 shadow-lg ring-2 ring-teal-200">
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                    {getInitials(viewingEngineer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{viewingEngineer.name}</h3>
                  <p className="text-sm text-slate-500">
                    {viewingEngineer.role === "team_leader" ? "Team Leader" : "Engineer"}
                  </p>
                  <EntityStatusBadge status={viewingEngineer.status} />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-700">{viewingEngineer.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-700">{viewingEngineer.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <GitBranch className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Branch</p>
                    <p className="text-sm font-medium text-slate-700">{viewingEngineer.branchName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Team</p>
                    {viewingEngineer.teamName ? (
                      <p className="text-sm font-medium text-slate-700">{viewingEngineer.teamName}</p>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                        Unassigned
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">DMA</p>
                    <p className="text-sm font-medium text-slate-700">{viewingEngineer.dmaName || myDMAName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Assigned Reports</p>
                    <p className="text-sm font-medium text-slate-700">{viewingEngineer.assignedReports ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="rounded-xl">
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false)
                if (viewingEngineer) openEditDialog(viewingEngineer)
              }}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 rounded-xl"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Engineer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}