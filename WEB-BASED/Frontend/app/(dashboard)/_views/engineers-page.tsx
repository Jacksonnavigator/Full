"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useAuthStore } from "@/store/auth-store"
import { CONFIG } from "@/lib/config"
import { EntityStatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building2,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  Layers,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  UserCog,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import type { EntityStatus } from "@/lib/types"

interface TeamOption {
  id: string
  name: string
  dmaId: string
  dmaName?: string
  utilityId?: string
  status: EntityStatus
}

interface Engineer {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: EntityStatus
  teamId: string | null
  teamName: string | null
  dmaId: string
  dmaName?: string
  assignedReports?: number
}

interface EngineerTemplateRow {
  name: string
  email: string
  phone: string
  role: string
  team_name: string
  status: string
  temporary_password: string
}

const ENGINEER_TEMPLATE_HEADERS = [
  "name",
  "email",
  "phone",
  "role",
  "team_name",
  "status",
  "temporary_password",
] as const

const ENGINEER_TEMPLATE_ROW_COUNT = 25

const escapeCsvValue = (value: string) => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const buildEngineerTemplateCsv = () => {
  const headerRow = ENGINEER_TEMPLATE_HEADERS.map((header) => escapeCsvValue(header)).join(",")
  const templateRows = Array.from({ length: ENGINEER_TEMPLATE_ROW_COUNT }, () =>
    ["", "", "", "", "", "active", ""].map((value) => escapeCsvValue(value)).join(",")
  )
  return `${headerRow}\n${templateRows.join("\n")}\n`
}

const parseCsvLine = (line: string) => {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

const parseEngineerTemplate = (csvText: string): EngineerTemplateRow[] => {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    return []
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase())

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const record = headers.reduce<Record<string, string>>((accumulator, header, index) => {
      accumulator[header] = values[index] ?? ""
      return accumulator
    }, {})

    return {
      name: record.name ?? "",
      email: record.email ?? "",
      phone: record.phone ?? "",
      role: record.role ?? "",
      team_name: record.team_name ?? record.teamname ?? "",
      status: record.status ?? "",
      temporary_password: record.temporary_password ?? record.password ?? "",
    }
  })
}

const normalizeTemplateRole = (value: string) => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return "engineer"
  if (normalized === "team leader") return "team_leader"
  return normalized
}

const normalizeTemplateStatus = (value: string): EntityStatus => "active"

const isEmptyTemplateRow = (row: EngineerTemplateRow) =>
  !row.name.trim() &&
  !row.email.trim() &&
  !row.phone.trim() &&
  !row.role.trim() &&
  !row.team_name.trim() &&
  !row.temporary_password.trim()

const mapEngineer = (raw: Record<string, unknown>): Engineer => ({
  id: raw.id as string,
  name: raw.name as string,
  email: raw.email as string,
  phone: (raw.phone as string | null) ?? null,
  role: (raw.role as string) || "engineer",
  status: (raw.status as EntityStatus) || "active",
  teamId: (raw.team_id as string | null) ?? null,
  teamName: (raw.team_name as string | null) ?? null,
  dmaId: raw.dma_id as string,
  dmaName: raw.dma_name as string | undefined,
  assignedReports: (raw.assigned_reports as number) || 0,
})

const mapTeam = (raw: Record<string, unknown>): TeamOption => ({
  id: raw.id as string,
  name: raw.name as string,
  dmaId: raw.dma_id as string,
  dmaName: raw.dma_name as string | undefined,
  utilityId: raw.utility_id as string | undefined,
  status: (raw.status as EntityStatus) || "active",
})

export default function EngineersPage() {
  const { currentUser } = useAuthStore()
  const isDMAManager = currentUser?.role === "dma_manager"
  const isUtilityManager = currentUser?.role === "utility_manager"
  const canAccess = isDMAManager || isUtilityManager
  const canManage = isDMAManager

  const [loading, setLoading] = useState(true)
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [teams, setTeams] = useState<TeamOption[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null)
  const [viewingEngineer, setViewingEngineer] = useState<Engineer | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formTeamId, setFormTeamId] = useState("")
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")
  const [formPassword, setFormPassword] = useState("")
  const [formConfirmPassword, setFormConfirmPassword] = useState("")

  const dmaId = currentUser?.dmaId ?? ""
  const utilityId = currentUser?.utilityId ?? ""

  const loadData = async () => {
    if (!canAccess) return
    try {
      setLoading(true)
      const teamUrl = isDMAManager && dmaId
        ? `${CONFIG.backend.fullUrl}/teams?dma_id=${dmaId}`
        : `${CONFIG.backend.fullUrl}/teams?utility_id=${utilityId}`
      const engineerUrl = isDMAManager && dmaId
        ? `${CONFIG.backend.fullUrl}/engineers?dma_id=${dmaId}`
        : `${CONFIG.backend.fullUrl}/engineers`

      const headers = { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      const [teamsRes, engineersRes] = await Promise.all([
        fetch(teamUrl, { headers }),
        fetch(engineerUrl, { headers }),
      ])

      const teamPayload = teamsRes.ok ? await teamsRes.json() : { items: [] }
      const engineerPayload = engineersRes.ok ? await engineersRes.json() : { items: [] }

      const rawTeams = (Array.isArray(teamPayload) ? teamPayload : teamPayload.items || []) as Record<string, unknown>[]
      const rawEngineers = (Array.isArray(engineerPayload) ? engineerPayload : engineerPayload.items || []) as Record<string, unknown>[]
      const nextTeams = rawTeams.map(mapTeam).filter((team: TeamOption) => team.status === "active")

      const scopedDmaIds = new Set(nextTeams.map((team) => team.dmaId))
      const nextEngineers = rawEngineers
        .map(mapEngineer)
        .filter((engineer: Engineer) => isDMAManager || scopedDmaIds.has(engineer.dmaId))

      setTeams(nextTeams)
      setEngineers(nextEngineers)
    } catch (error) {
      console.error("Error fetching engineers page data:", error)
      toast.error("Failed to load engineers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [canAccess, dmaId, utilityId, isDMAManager])

  const availableTeams = useMemo(() => {
    if (isDMAManager) return teams.filter((team) => team.dmaId === dmaId)
    return teams
  }, [teams, isDMAManager, dmaId])

  const filteredEngineers = engineers.filter((engineer) => {
    const searchLower = search.trim().toLowerCase()
    const matchesSearch =
      !searchLower ||
      engineer.name.toLowerCase().includes(searchLower) ||
      engineer.email.toLowerCase().includes(searchLower) ||
      (engineer.teamName || "").toLowerCase().includes(searchLower) ||
      (engineer.dmaName || "").toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === "all" || engineer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalEngineers = engineers.length
  const activeEngineers = engineers.filter((engineer) => engineer.status === "active").length
  const teamLeadersCount = engineers.filter((engineer) => engineer.role === "team_leader").length
  const assignedToTeamsCount = engineers.filter((engineer) => engineer.teamId).length

  const resetForm = () => {
    setFormName("")
    setFormEmail("")
    setFormPhone("")
    setFormTeamId("")
    setFormStatus("active")
    setFormPassword("")
    setFormConfirmPassword("")
  }

  const openCreateDialog = () => {
    setEditingEngineer(null)
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (engineer: Engineer) => {
    setEditingEngineer(engineer)
    setFormName(engineer.name)
    setFormEmail(engineer.email)
    setFormPhone(engineer.phone || "")
    setFormTeamId(engineer.teamId || "")
    setFormStatus(engineer.status)
    setFormPassword("")
    setFormConfirmPassword("")
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formName.trim()) return toast.error("Engineer name is required")
    if (!formEmail.trim()) return toast.error("Email is required")
    if (!formTeamId) return toast.error("Please select a team")
    if (!editingEngineer && !formPassword.trim()) return toast.error("Password is required")
    if (formPassword && formPassword !== formConfirmPassword) return toast.error("Passwords do not match")

    const payload: Record<string, unknown> = {
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || null,
      team_id: formTeamId,
      status: formStatus,
    }
    if (formPassword.trim()) payload.password = formPassword.trim()
    if (editingEngineer) payload.id = editingEngineer.id

    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/engineers`, {
        method: editingEngineer ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        toast.error((data as any).detail || (data as any).error || "Failed to save engineer")
        return
      }

      toast.success(editingEngineer ? "Engineer updated successfully" : "Engineer created successfully")
      setDialogOpen(false)
      await loadData()
    } catch (error) {
      console.error("Error saving engineer:", error)
      toast.error("Failed to save engineer")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const response = await fetch(`${CONFIG.backend.fullUrl}/engineers?id=${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        toast.error((data as any).detail || (data as any).error || "Failed to delete engineer")
        return
      }
      toast.success("Engineer removed successfully")
      setDeleteId(null)
      await loadData()
    } catch (error) {
      console.error("Error deleting engineer:", error)
      toast.error("Failed to delete engineer")
    }
  }

  const downloadTemplate = () => {
    const blob = new Blob([buildEngineerTemplateCsv()], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "engineers-template.csv"
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    toast.success("Engineer template downloaded")
  }

  const resolveTeamIdForImport = (row: EngineerTemplateRow) => {
    const teamName = row.team_name.trim().toLowerCase()

    if (!teamName) {
      return null
    }

    const exactMatches = availableTeams.filter((team) => {
      const matchesTeam = team.name.trim().toLowerCase() === teamName
      return matchesTeam
    })

    if (exactMatches.length === 1) {
      return exactMatches[0].id
    }

    return null
  }

  const handleTemplateUpload = async (file: File) => {
    if (!availableTeams.length) {
      toast.error("No active teams are available for engineer import")
      return
    }

    try {
      setImporting(true)
      const csvText = await file.text()
      const rows = parseEngineerTemplate(csvText).filter((row) => !isEmptyTemplateRow(row))

      if (!rows.length) {
        toast.error("The uploaded template is empty")
        return
      }

      const validationErrors: string[] = []
      const validRows = rows.flatMap((row, index) => {
        const rowNumber = index + 2
        const teamId = resolveTeamIdForImport(row)
        const role = normalizeTemplateRole(row.role)
        const status = normalizeTemplateStatus(row.status)

        if (!row.name.trim()) validationErrors.push(`Row ${rowNumber}: name is required`)
        if (!row.email.trim()) validationErrors.push(`Row ${rowNumber}: email is required`)
        if (!row.team_name.trim()) validationErrors.push(`Row ${rowNumber}: team_name is required`)
        if (!row.temporary_password.trim()) validationErrors.push(`Row ${rowNumber}: temporary_password is required`)
        if (row.temporary_password.trim() && row.temporary_password.trim().length < 8) {
          validationErrors.push(`Row ${rowNumber}: temporary_password must be at least 8 characters`)
        }
        if (row.status.trim() && row.status.trim().toLowerCase() !== "active") {
          validationErrors.push(`Row ${rowNumber}: status must remain active in this template`)
        }
        if (!teamId) {
          validationErrors.push(`Row ${rowNumber}: team_name does not match an active team in your DMA`)
        }
        if (!["engineer", "team_leader"].includes(role)) {
          validationErrors.push(`Row ${rowNumber}: role must be engineer or team_leader`)
        }

        if (
          !row.name.trim() ||
          !row.email.trim() ||
          !row.team_name.trim() ||
          !row.temporary_password.trim() ||
          row.temporary_password.trim().length < 8 ||
          !teamId ||
          !["engineer", "team_leader"].includes(role)
        ) {
          return []
        }

        return [{
          name: row.name.trim(),
          email: row.email.trim(),
          phone: row.phone.trim() || null,
          role,
          team_id: teamId,
          status,
          password: row.temporary_password.trim(),
        }]
      })

      if (validationErrors.length) {
        toast.error(validationErrors.slice(0, 3).join(" | "))
        if (validationErrors.length > 3) {
          toast.error(`${validationErrors.length - 3} more row errors found in the template`)
        }
        return
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      }

      const results = await Promise.all(
        validRows.map(async (payload) => {
          const response = await fetch(`${CONFIG.backend.fullUrl}/engineers`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          })
          const data = await response.json().catch(() => ({}))
          return {
            ok: response.ok,
            detail: (data as { detail?: string; error?: string }).detail || (data as { detail?: string; error?: string }).error,
            email: payload.email,
          }
        })
      )

      const successes = results.filter((result) => result.ok)
      const failures = results.filter((result) => !result.ok)

      if (successes.length) {
        toast.success(`Imported ${successes.length} engineer${successes.length === 1 ? "" : "s"}`)
      }

      if (failures.length) {
        const failurePreview = failures
          .slice(0, 3)
          .map((failure) => `${failure.email}: ${failure.detail || "Failed to import"}`)
          .join(" | ")
        toast.error(failurePreview)
        if (failures.length > 3) {
          toast.error(`${failures.length - 3} more import errors occurred`)
        }
      }

      if (successes.length) {
        await loadData()
      }
    } catch (error) {
      console.error("Error importing engineer template:", error)
      toast.error("Failed to import engineer template")
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

  if (!canAccess) {
    return (
      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
        <CardContent className="py-16 text-center">
          <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
          <p className="mt-1 text-sm text-slate-500">Only DMA and Utility Managers can view engineers.</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg shadow-teal-500/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              Engineers
            </h1>
            <p className="mt-1 text-slate-500">
              Engineers now belong directly to teams inside a DMA.
            </p>
          </div>
          {canManage && (
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    void handleTemplateUpload(file)
                  }
                }}
              />
              <Button variant="outline" onClick={downloadTemplate} className="h-11 rounded-xl border-slate-200 bg-white">
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="h-11 rounded-xl border-slate-200 bg-white"
              >
                {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload Filled Template
              </Button>
              <Button onClick={openCreateDialog} className="h-11 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Engineer
              </Button>
            </div>
          )}
        </div>

        {canManage && (
          <Card className="border-dashed border-teal-200 bg-teal-50/60 shadow-none">
            <CardContent className="flex flex-col gap-3 p-4 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-slate-800">Bulk engineer template</p>
                <p className="mt-1">
                  Use the CSV template to register many engineers at once. Fill <span className="font-medium">name</span>, <span className="font-medium">email</span>, <span className="font-medium">phone</span>, <span className="font-medium">role</span>, <span className="font-medium">team_name</span>, <span className="font-medium">status</span>, and <span className="font-medium">temporary_password</span>. Status stays <span className="font-medium">active</span>, and the import only matches active teams inside your current DMA.
                </p>
              </div>
              <div className="rounded-xl bg-white px-4 py-3 text-xs text-slate-500">
                Active teams available for import: <span className="font-semibold text-slate-800">{availableTeams.length}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard icon={<Users className="h-6 w-6 text-white" />} label="Total Engineers" value={totalEngineers} gradient="from-teal-500 to-cyan-600" />
          <StatCard icon={<CheckCircle2 className="h-6 w-6 text-white" />} label="Active" value={activeEngineers} gradient="from-green-500 to-emerald-600" />
          <StatCard icon={<UserCog className="h-6 w-6 text-white" />} label="Team Leaders" value={teamLeadersCount} gradient="from-violet-500 to-purple-600" />
          <StatCard icon={<Layers className="h-6 w-6 text-white" />} label="Assigned To Teams" value={assignedToTeamsCount} gradient="from-blue-500 to-indigo-600" />
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, team, or DMA..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 rounded-xl border-slate-200/80 bg-slate-50/80 pl-11"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-36 rounded-xl border-slate-200/80 bg-slate-50/80">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-500">{filteredEngineers.length} engineers</span>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="px-6 py-4">Engineer</TableHead>
                  <TableHead className="px-6 py-4">Team</TableHead>
                  <TableHead className="px-6 py-4">DMA</TableHead>
                  <TableHead className="px-6 py-4">Role</TableHead>
                  <TableHead className="px-6 py-4">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEngineers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center">
                      <p className="text-lg font-semibold text-slate-800">No engineers found</p>
                      <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or create a new engineer.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEngineers.map((engineer) => (
                    <TableRow key={engineer.id} className="border-b border-slate-100">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                              {initials(engineer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-800">{engineer.name}</p>
                            <p className="text-xs text-slate-500">{engineer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {engineer.teamName ? <span className="font-medium text-slate-700">{engineer.teamName}</span> : <Badge variant="outline">Unassigned</Badge>}
                      </TableCell>
                      <TableCell className="px-6 py-4">{engineer.dmaName || "Not set"}</TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {engineer.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <EntityStatusBadge status={engineer.status} />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setViewingEngineer(engineer); setViewDialogOpen(true) }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {canManage && (
                              <>
                                <DropdownMenuItem onClick={() => openEditDialog(engineer)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleteId(engineer.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingEngineer ? "Edit Engineer" : "Add Engineer"}</DialogTitle>
            <DialogDescription>
              Engineers are now created directly under a team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="engineer-name">Full Name</Label>
              <Input id="engineer-name" value={formName} onChange={(event) => setFormName(event.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="engineer-email">Email</Label>
                <Input id="engineer-email" type="email" value={formEmail} onChange={(event) => setFormEmail(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="engineer-phone">Phone</Label>
                <Input id="engineer-phone" value={formPhone} onChange={(event) => setFormPhone(event.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Team</Label>
              <Select value={formTeamId} onValueChange={setFormTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} {team.dmaName ? `- ${team.dmaName}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={formStatus} onValueChange={(value) => setFormStatus(value as EntityStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="engineer-password">{editingEngineer ? "New Password" : "Password"}</Label>
                <div className="relative">
                  <Input
                    id="engineer-password"
                    type={showPassword ? "text" : "password"}
                    value={formPassword}
                    onChange={(event) => setFormPassword(event.target.value)}
                    placeholder={editingEngineer ? "Leave blank to keep current password" : "Enter password"}
                    className="pr-10"
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="engineer-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="engineer-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formConfirmPassword}
                    onChange={(event) => setFormConfirmPassword(event.target.value)}
                    className="pr-10"
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2" onClick={() => setShowConfirmPassword((value) => !value)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700">
              {editingEngineer ? "Save Changes" : "Create Engineer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Engineer Details</DialogTitle>
          </DialogHeader>
          {viewingEngineer && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                    {initials(viewingEngineer.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{viewingEngineer.name}</h3>
                  <p className="text-sm text-slate-500">{viewingEngineer.role.replace("_", " ")}</p>
                  <EntityStatusBadge status={viewingEngineer.status} />
                </div>
              </div>
              <DetailRow icon={<Mail className="h-4 w-4 text-blue-600" />} label="Email" value={viewingEngineer.email} />
              <DetailRow icon={<Phone className="h-4 w-4 text-green-600" />} label="Phone" value={viewingEngineer.phone || "Not provided"} />
              <DetailRow icon={<Layers className="h-4 w-4 text-violet-600" />} label="Team" value={viewingEngineer.teamName || "Unassigned"} />
              <DetailRow icon={<Building2 className="h-4 w-4 text-teal-600" />} label="DMA" value={viewingEngineer.dmaName || "Not assigned"} />
              <DetailRow icon={<User className="h-4 w-4 text-amber-600" />} label="Assigned Reports" value={String(viewingEngineer.assignedReports || 0)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Remove Engineer"
        description="Are you sure you want to remove this engineer? This action cannot be undone."
        confirmLabel="Remove Engineer"
        onConfirm={handleDelete}
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: ReactNode
  label: string
  value: number
  gradient: string
}) {
  return (
    <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}
