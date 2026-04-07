"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { useDataStore } from "@/store/data-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DMALocationPicker } from "@/components/maps/dma-location-picker"
import type { EntityStatus } from "@/lib/types"
import { toast } from "sonner"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  XCircle,
} from "lucide-react"

interface DMAFormPageProps {
  mode: "create" | "edit"
  dmaId?: string
}

export default function DMAFormPage({ mode, dmaId }: DMAFormPageProps) {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const { dmas, utilities, fetchDMAs, fetchUtilities, addDMA, updateDMA } = useDataStore()

  const [loading, setLoading] = useState(true)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")
  const [formCenterLatitude, setFormCenterLatitude] = useState("")
  const [formCenterLongitude, setFormCenterLongitude] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUtility = currentUser?.role === "utility_manager"
  const utilityFromList = currentUser?.utilityId ? utilities.find((u) => u.id === currentUser.utilityId) : null
  const utilityByManager = isUtility ? utilities.find((u) => u.managerId === currentUser?.id) : null
  const resolvedUtilityId = currentUser?.utilityId || utilityByManager?.id || null
  const utilityName = currentUser?.utilityName || utilityFromList?.name || utilityByManager?.name || ""

  const editingDMA = useMemo(
    () => (mode === "edit" && dmaId ? dmas.find((dma) => dma.id === dmaId) ?? null : null),
    [dmaId, dmas, mode],
  )

  useEffect(() => {
    async function load() {
      setLoading(true)
      await Promise.all([fetchUtilities(), fetchDMAs()])
      setLoading(false)
    }

    void load()
  }, [fetchDMAs, fetchUtilities])

  useEffect(() => {
    if (mode === "edit") {
      if (!editingDMA) return
      setFormName(editingDMA.name)
      setFormDescription(editingDMA.description || "")
      setFormStatus(editingDMA.status)
      setFormCenterLatitude(editingDMA.centerLatitude != null ? String(editingDMA.centerLatitude) : "")
      setFormCenterLongitude(editingDMA.centerLongitude != null ? String(editingDMA.centerLongitude) : "")
      return
    }

    setFormName("")
    setFormDescription("")
    setFormStatus("active")
    setFormCenterLatitude("")
    setFormCenterLongitude("")
  }, [editingDMA, mode])

  async function handleSubmit() {
    if (!formName.trim()) {
      toast.error("DMA name is required")
      return
    }

    if (!resolvedUtilityId) {
      toast.error("Utility context is missing for this DMA")
      return
    }

    const hasLatitude = formCenterLatitude.trim() !== ""
    const hasLongitude = formCenterLongitude.trim() !== ""

    if (hasLatitude !== hasLongitude) {
      toast.error("Please provide both latitude and longitude for the DMA center")
      return
    }

    const parsedLatitude = hasLatitude ? Number(formCenterLatitude) : null
    const parsedLongitude = hasLongitude ? Number(formCenterLongitude) : null

    if (parsedLatitude !== null && (!Number.isFinite(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90)) {
      toast.error("Latitude must be a valid number between -90 and 90")
      return
    }

    if (parsedLongitude !== null && (!Number.isFinite(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180)) {
      toast.error("Longitude must be a valid number between -180 and 180")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: formName.trim(),
        description: formDescription.trim() || null,
        utilityId: resolvedUtilityId,
        utilityName: utilityName || "",
        centerLatitude: parsedLatitude,
        centerLongitude: parsedLongitude,
        status: formStatus,
      }

      if (mode === "edit" && editingDMA) {
        await updateDMA(editingDMA.id, payload)
        toast.success("DMA updated successfully")
      } else {
        await addDMA(payload)
        toast.success("DMA created successfully")
      }

      router.push("/dashboard/dmas")
    } catch {
      toast.error(mode === "edit" ? "Failed to update DMA" : "Failed to create DMA")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isUtility) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/dmas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DMAs
            </Link>
          </Button>
        </div>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
                <p className="text-sm text-slate-500 mt-1">Only Utility Managers can create or edit DMAs.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/dmas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DMAs
            </Link>
          </Button>
        </div>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center text-slate-500">Loading DMA form...</CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "edit" && !editingDMA) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/dmas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DMAs
            </Link>
          </Button>
        </div>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">DMA not found</p>
            <p className="mt-2 text-sm text-slate-500">The DMA you are trying to edit could not be loaded.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/dmas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DMAs
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                {mode === "edit" ? <Pencil className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              {mode === "edit" ? "Edit DMA" : "Create DMA"}
            </h1>
            <p className="text-slate-500 mt-1">
              {mode === "edit"
                ? "Update the DMA details, map center, and visibility information."
                : "Create a new District Meter Area with a proper dashboard map center."}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/dmas">Cancel</Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700"
          >
            {mode === "edit" ? <Sparkles className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {mode === "edit" ? "Save Changes" : "Create DMA"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="dma-name" className="text-sm font-medium text-slate-700">DMA Name</Label>
              <Input
                id="dma-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Old Moshi Road DMA"
                className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Utility</Label>
              <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">{utilityName}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="dma-description" className="text-sm font-medium text-slate-700">Description</Label>
              <Textarea
                id="dma-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe the service area covered by this DMA."
                rows={4}
                className="resize-none rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="dma-latitude" className="text-sm font-medium text-slate-700">Center Latitude</Label>
                <Input
                  id="dma-latitude"
                  type="number"
                  step="0.000001"
                  value={formCenterLatitude}
                  onChange={(e) => setFormCenterLatitude(e.target.value)}
                  placeholder="-3.386000"
                  className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-emerald-400 focus:ring-emerald-400/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dma-longitude" className="text-sm font-medium text-slate-700">Center Longitude</Label>
                <Input
                  id="dma-longitude"
                  type="number"
                  step="0.000001"
                  value={formCenterLongitude}
                  onChange={(e) => setFormCenterLongitude(e.target.value)}
                  placeholder="36.717000"
                  className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-emerald-400 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Status</Label>
              <Select value={formStatus} onValueChange={(value) => setFormStatus(value as EntityStatus)}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80">
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
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <DMALocationPicker
            value={{
              latitude: formCenterLatitude.trim() ? Number(formCenterLatitude) : null,
              longitude: formCenterLongitude.trim() ? Number(formCenterLongitude) : null,
            }}
            onChange={({ latitude, longitude }) => {
              setFormCenterLatitude(latitude.toFixed(6))
              setFormCenterLongitude(longitude.toFixed(6))
            }}
          />

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
            <CardContent className="space-y-2 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Map Guidance</p>
              <p>Click the map to set the DMA center used by dashboard maps and report visibility.</p>
              <p>After selecting a point, you can still fine-tune the latitude and longitude manually.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
