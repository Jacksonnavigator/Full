"use client"

import { useState, useEffect } from "react"
import { useDataStore, type DMAManager, type DMA } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { usePageAccess } from "@/hooks/use-page-access"
import { PageHeader } from "@/components/shared/page-header"
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
  UserCog,
  CheckCircle2,
  XCircle,
  Users,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Unlink,
  Building2,
  Lock,
  Eye,
  EyeOff,
  User,
  Layers,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function DMAManagersPage() {
  usePageAccess()

  const { currentUser } = useAuthStore()
  const {
    dmaManagers,
    dmas,
    utilities,
    fetchDMAManagers,
    fetchDMAs,
    fetchUtilities,
    addDMAManager,
    updateDMAManager,
    deleteDMAManager,
  } = useDataStore()

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingManager, setEditingManager] = useState<DMAManager | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [unassignId, setUnassignId] = useState<string | null>(null)
  const [viewingManager, setViewingManager] = useState<DMAManager | null>(null)

  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formConfirmPassword, setFormConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formDMAId, setFormDMAId] = useState("unassigned")
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")

  useEffect(() => {
    fetchDMAManagers()
    fetchDMAs()
    fetchUtilities()
  }, [fetchDMAManagers, fetchDMAs, fetchUtilities])

  const isAdmin = currentUser?.role === "admin"
  const isUtilityManager = currentUser?.role === "utility_manager"
  const myUtilityId = currentUser?.utilityId
  const myUtility = isUtilityManager ? utilities.find((u) => u.id === myUtilityId) : null
  const myUtilityDisplayName = myUtility?.name || currentUser?.utilityName || "Your Utility"

  let visibleManagers = dmaManagers
  if (isUtilityManager && myUtilityId) {
    visibleManagers = dmaManagers.filter((m) => {
      if (m.utilityId === myUtilityId) return true
      const dma = dmas.find((d) => d.id === m.dmaId)
      return dma?.utilityId === myUtilityId
    })
  }

  const availableDMAs = dmas.filter((d) => {
    if (d.utilityId !== myUtilityId) return false
    if (d.status !== "active") return false
    if (editingManager) {
      return !d.managerId || d.managerId === editingManager.id
    }
    return !d.managerId
  })

  const filteredManagers = visibleManagers.filter((m) => {
    const searchLower = search.toLowerCase().trim()
    if (!searchLower) return true
    return (
      m.name?.toLowerCase().includes(searchLower) ||
      m.email?.toLowerCase().includes(searchLower) ||
      m.phone?.toLowerCase().includes(searchLower) ||
      m.dmaName?.toLowerCase().includes(searchLower) ||
      m.utilityName?.toLowerCase().includes(searchLower)
    )
  })

  const stats = {
    total: visibleManagers.length,
    active: visibleManagers.filter((m) => m.status === "active").length,
    assigned: visibleManagers.filter((m) => m.dmaId).length,
    unassigned: visibleManagers.filter((m) => !m.dmaId).length,
  }

  function openCreateDialog() {
    setEditingManager(null)
    setFormName("")
    setFormEmail("")
    setFormPhone("")
    setFormPassword("")
    setFormConfirmPassword("")
    setFormDMAId("unassigned")
    setFormStatus("active")
    setShowPassword(false)
    setDialogOpen(true)
  }

  function openEditDialog(manager: DMAManager) {
    setEditingManager(manager)
    setFormName(manager.name)
    setFormEmail(manager.email)
    setFormPhone(manager.phone || "")
    setFormPassword("")
    setFormConfirmPassword("")
    setFormDMAId(manager.dmaId || "unassigned")
    setFormStatus(manager.status)
    setShowPassword(false)
    setDialogOpen(true)
  }

  async function handleSubmit() {
    if (!formName.trim()) { toast.error("Manager name is required"); return }
    if (!formEmail.trim()) { toast.error("Email is required"); return }
    if (!editingManager && !formPassword.trim()) { toast.error("Password is required for new managers"); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) { toast.error("Invalid email format"); return }
    if (formPassword.trim() && formPassword.length < 6) { toast.error("Password must be at least 6 characters"); return }
    if (formPassword.trim() && formPassword !== formConfirmPassword) { toast.error("Passwords do not match"); return }

    try {
      if (editingManager) {
        const updateData: Record<string, any> = {
          name: formName,
          email: formEmail,
          phone: formPhone || null,
          status: formStatus,
          dmaId: formDMAId === "unassigned" ? null : formDMAId,
        }
        if (formPassword) updateData.password = formPassword
        await updateDMAManager(editingManager.id, updateData)
        toast.success("DMA Manager updated successfully")
      } else {
        await addDMAManager({
          name: formName,
          email: formEmail,
          phone: formPhone || null,
          password: formPassword,
          status: formStatus,
          utilityId: myUtilityId || "",
          dmaId: formDMAId === "unassigned" ? null : formDMAId,
        })
        toast.success("DMA Manager created successfully")
      }
      setDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed")
    }
  }

  async function handleDelete() {
    if (deleteId) {
      try {
        await deleteDMAManager(deleteId)
        toast.success("DMA Manager deleted successfully")
        setDeleteId(null)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete manager")
      }
    }
  }

  async function handleUnassignDMA() {
    if (unassignId) {
      try {
        await updateDMAManager(unassignId, { dmaId: null })
        toast.success("DMA unassigned successfully")
        setUnassignId(null)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to unassign DMA")
      }
    }
  }

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  if (!isAdmin && !isUtilityManager) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="DMA Manager Management" description="Only Admins and Utility Managers can manage DMA Managers" />
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <UserCog className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only Admins and Utility Managers can manage DMA Managers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <UserCog className="h-5 w-5 text-white" />
              </div>
              DMA Managers
            </h1>
            <p className="text-slate-500 mt-1">
              {isUtilityManager ? `Manage DMA Managers for ${myUtilityDisplayName}` : "Manage all DMA Managers in the system"}
            </p>
          </div>
          <Button onClick={openCreateDialog} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 rounded-xl h-11 px-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Manager
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 bg-gradient-to-br from-violet-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                  <UserCog className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Managers</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 bg-gradient-to-br from-emerald-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Managers</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">With DMAs</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.assigned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 bg-gradient-to-br from-amber-50/30 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Unlink className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Unassigned</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.unassigned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-400/10 to-purple-500/10 blur-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input placeholder="Search by name, email, DMA..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-11 h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-violet-400 focus:ring-violet-400/20 shadow-sm" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="h-4 w-4" />
          <span>{filteredManagers.length} manager{filteredManagers.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/80 hover:from-slate-50 hover:to-slate-100/80 border-b border-slate-200/60">
                  <TableHead className="font-semibold text-slate-600 py-4 px-6"><div className="flex items-center gap-2"><User className="h-4 w-4" />Manager</div></TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6"><div className="flex items-center gap-2"><Mail className="h-4 w-4" />Contact</div></TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6"><div className="flex items-center gap-2"><MapPin className="h-4 w-4" />Assigned DMA</div></TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Status</div></TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"><UserCog className="h-8 w-8 text-slate-400" /></div>
                        <div>
                          <p className="text-lg font-semibold text-slate-800">No managers found</p>
                          <p className="text-sm text-slate-500 mt-1">{search ? "Try adjusting your search terms" : "Get started by creating your first DMA manager"}</p>
                        </div>
                        {!search && <Button onClick={openCreateDialog} className="mt-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 rounded-xl"><Plus className="h-4 w-4 mr-2" />Add DMA Manager</Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredManagers.map((manager) => {
                    const dma = dmas.find((d) => d.id === manager.dmaId)
                    const isInactive = manager.status === "inactive"
                    return (
                      <TableRow key={manager.id} className={cn("border-b border-slate-100 transition-all duration-200", isInactive ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-violet-50/50")}>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className={cn("h-10 w-10 shadow-lg transition-all duration-300", isInactive ? "ring-2 ring-red-200" : "ring-2 ring-violet-200")}>
                              <AvatarFallback className={cn("text-sm font-semibold", isInactive ? "bg-gradient-to-br from-red-400 to-rose-500 text-white" : "bg-gradient-to-br from-violet-500 to-purple-600 text-white")}>{getInitials(manager.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800">{manager.name}</p>
                              <p className="text-xs text-slate-500">DMA Manager</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-3.5 w-3.5 text-slate-400" /><span className="truncate max-w-[200px]">{manager.email}</span></div>
                            {manager.phone && <div className="flex items-center gap-2 text-sm text-slate-500"><Phone className="h-3.5 w-3.5 text-slate-400" /><span>{manager.phone}</span></div>}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          {dma ? (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center"><MapPin className="h-4 w-4 text-cyan-600" /></div>
                              <span className="font-medium text-slate-700">{dma.name}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100"><MapPin className="h-3 w-3 mr-1" />Unassigned</Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-4 px-6"><EntityStatusBadge status={manager.status} /></TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"><MoreHorizontal className="h-4 w-4 text-slate-500" /><span className="sr-only">Actions</span></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg shadow-slate-200/50 border-slate-200/60">
                              <DropdownMenuItem onClick={() => setViewingManager(manager)} className="rounded-lg gap-2 cursor-pointer"><Eye className="h-4 w-4 text-blue-500" />View Details</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(manager)} className="rounded-lg gap-2 cursor-pointer"><Pencil className="h-4 w-4 text-violet-500" />Edit Manager</DropdownMenuItem>
                              {manager.dmaId && <DropdownMenuItem onClick={() => setUnassignId(manager.id)} className="text-orange-600 focus:text-orange-600 focus:bg-orange-50 rounded-lg gap-2 cursor-pointer"><Unlink className="h-4 w-4" />Unassign from DMA</DropdownMenuItem>}
                              <DropdownMenuItem onClick={() => setDeleteId(manager.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg gap-2 cursor-pointer"><Trash2 className="h-4 w-4" />Delete Manager</DropdownMenuItem>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">{editingManager ? <Pencil className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}</div>
              {editingManager ? "Edit DMA Manager" : "Add DMA Manager"}
            </DialogTitle>
            {editingManager && <DialogDescription>Currently assigned to: <span className="font-semibold">{dmas.find(d => d.id === editingManager.dmaId)?.name || editingManager?.dmaName || "Unassigned"}</span></DialogDescription>}
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4 max-h-[60vh] overflow-y-auto">
            <div className="rounded-xl border border-violet-200/80 bg-gradient-to-r from-violet-50/50 to-purple-50/50 p-4">
              <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-violet-600" /><span className="font-semibold text-violet-700">{myUtilityDisplayName}</span></div>
              <p className="text-xs text-violet-500/80 mt-2">This DMA manager will be associated with above utility.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manager-name" className="text-sm font-medium text-slate-700">Manager Name <span className="text-red-500">*</span></Label>
              <Input id="manager-name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g., John Mwangi" className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-violet-400 focus:ring-violet-400/20" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manager-email" className="text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></Label>
              <Input id="manager-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="john@example.com" className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-violet-400 focus:ring-violet-400/20" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="manager-phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
              <Input id="manager-phone" type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+254 712 345 678" className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-violet-400 focus:ring-violet-400/20" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Assign DMA</Label>
              <Select value={formDMAId} onValueChange={setFormDMAId}>
                <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl"><SelectValue placeholder="Select a DMA (optional)" /></SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                  <SelectItem value="unassigned" className="rounded-lg"><span className="text-slate-500">None (Unassigned)</span></SelectItem>
                  {availableDMAs.map((dma) => (<SelectItem key={dma.id} value={dma.id} className="rounded-lg"><span>{dma.name}</span>{dma.managerId && dma.managerId === editingManager?.id && <span className="text-slate-400 ml-2">(currently assigned)</span>}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Status <span className="text-red-500">*</span></Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as EntityStatus)}>
                <SelectTrigger className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                  <SelectItem value="active" className="rounded-lg"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Active</div></SelectItem>
                  <SelectItem value="inactive" className="rounded-lg"><div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-slate-400" />Inactive</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-t border-slate-200 pt-4 flex flex-col gap-3">
              <Label className="flex items-center gap-2 text-sm font-medium text-slate-700"><Lock className="h-4 w-4" />{editingManager ? "Change Password (optional)" : "Account Password"}</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder={editingManager ? "Enter new password (optional)" : "Min 6 characters"} className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl pr-10 focus:border-violet-400 focus:ring-violet-400/20" />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
              </div>
              <Input type={showPassword ? "text" : "password"} value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)} placeholder="Confirm password" className="h-11 bg-slate-50/80 border-slate-200/80 rounded-xl focus:border-violet-400 focus:ring-violet-400/20" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 rounded-xl">
              {editingManager ? <><Sparkles className="h-4 w-4 mr-2" />Save Changes</> : <><Plus className="h-4 w-4 mr-2" />Create Manager</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete DMA Manager" description="Are you sure you want to delete this DMA Manager? This action cannot be undone." confirmLabel="Delete Manager" onConfirm={handleDelete} />
      <ConfirmDialog open={!!unassignId} onOpenChange={() => setUnassignId(null)} title="Unassign DMA" description="Are you sure you want to unassign the DMA from this manager? They will no longer manage this DMA." confirmLabel="Unassign DMA" onConfirm={handleUnassignDMA} variant="default" />

      {/* View Details Modal */}
      <Dialog open={!!viewingManager} onOpenChange={() => setViewingManager(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-slate-200/50 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              DMA Manager Details
            </DialogTitle>
          </DialogHeader>
          {viewingManager && (() => {
            const utility = utilities.find(u => u.id === viewingManager.utilityId)
            const dma = dmas.find(d => d.id === viewingManager.dmaId)
            
            return (
              <div className="flex flex-col gap-6 py-4">
                {/* Manager Profile Card */}
                <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 shadow-lg ring-2 ring-violet-200">
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                          {getInitials(viewingManager.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800">{viewingManager.name}</h3>
                        <p className="text-sm text-slate-500">DMA Manager</p>
                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                          <EntityStatusBadge status={viewingManager.status} />
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-4 w-4" />
                            {viewingManager.email}
                          </div>
                          {viewingManager.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-4 w-4" />
                              {viewingManager.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Associated Utility Card */}
                {utility && (
                  <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{utility.name}</h4>
                          <p className="text-xs text-slate-500">Associated Utility</p>
                        </div>
                        <EntityStatusBadge status={utility.status} className="ml-auto" />
                      </div>
                      {utility.description && (
                        <p className="text-sm text-slate-600 mb-4">{utility.description}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Assigned DMA Card */}
                {dma && (
                  <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{dma.name}</h4>
                          <p className="text-xs text-slate-500">Assigned DMA</p>
                        </div>
                        <EntityStatusBadge status={dma.status} className="ml-auto" />
                      </div>
                      {dma.description && (
                        <p className="text-sm text-slate-600 mb-4">{dma.description}</p>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <Building2 className="h-3.5 w-3.5" />
                            Utility
                          </div>
                          <p className="text-sm font-medium text-slate-800">{utility?.name || "N/A"}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <Layers className="h-3.5 w-3.5" />
                            Branches
                          </div>
                          <p className="text-lg font-bold text-slate-800">{dma.branchesCount || 0}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                            <Users className="h-3.5 w-3.5" />
                            Engineers
                          </div>
                          <p className="text-lg font-bold text-slate-800">{dma.engineersCount || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* No DMA assigned message */}
                {!dma && (
                  <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
                    <CardContent className="p-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                          <Unlink className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">No DMA Assigned</p>
                          <p className="text-sm text-slate-500">This manager is not currently assigned to any DMA</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
