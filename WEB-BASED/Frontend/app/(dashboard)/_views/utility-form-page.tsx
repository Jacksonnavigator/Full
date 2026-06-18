"use client"

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react"
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
import { UtilityLocationPicker } from "@/components/maps/utility-location-picker"
import type { EntityStatus, GeoJsonPolygon } from "@/lib/types"
import { toast } from "sonner"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react"

interface UtilityFormPageProps {
  mode: "create" | "edit"
  utilityId?: string
}

type BoundaryPointFormValue = {
  id: string
  latitude: string
  longitude: string
}

type BoundaryPointCoordinate = {
  latitude: number
  longitude: number
}

type BoundaryExtractionResponse = {
  center?: BoundaryPointCoordinate
  boundaryPoints?: BoundaryPointCoordinate[]
  source?: {
    fileName?: string
    layerName?: string
    geometryType?: string
    pointCount?: number
  }
  error?: string
}

const TANZANIA_REGIONS = [
  "Arusha",
  "Dar es Salaam",
  "Dodoma",
  "Geita",
  "Iringa",
  "Kagera",
  "Katavi",
  "Kigoma",
  "Kilimanjaro",
  "Lindi",
  "Manyara",
  "Mara",
  "Mbeya",
  "Morogoro",
  "Mtwara",
  "Mwanza",
  "Njombe",
  "Pemba North",
  "Pemba South",
  "Pwani",
  "Rukwa",
  "Ruvuma",
  "Shinyanga",
  "Simiyu",
  "Singida",
  "Songwe",
  "Tabora",
  "Tanga",
  "Unguja North",
  "Unguja South",
]

function createBoundaryPoint(latitude = "", longitude = ""): BoundaryPointFormValue {
  const fallbackId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : fallbackId,
    latitude,
    longitude,
  }
}

function extractBoundaryPoints(boundaryGeojson?: GeoJsonPolygon | null): BoundaryPointFormValue[] {
  const ring = boundaryGeojson?.coordinates?.[0]
  if (!Array.isArray(ring) || !ring.length) return []

  const normalizedRing =
    ring.length > 1 &&
    ring[0]?.[0] === ring[ring.length - 1]?.[0] &&
    ring[0]?.[1] === ring[ring.length - 1]?.[1]
      ? ring.slice(0, -1)
      : ring

  return normalizedRing
    .filter((point): point is number[] => Array.isArray(point) && point.length >= 2)
    .map((point) => createBoundaryPoint(String(point[1]), String(point[0])))
}

function parseBoundaryPointsForMap(points: BoundaryPointFormValue[]): BoundaryPointCoordinate[] {
  return points.flatMap((point) => {
    const latitude = Number(point.latitude)
    const longitude = Number(point.longitude)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return []
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return []

    return [{ latitude, longitude }]
  })
}

export default function UtilityFormPage({ mode, utilityId }: UtilityFormPageProps) {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const { utilities, fetchUtilities, addUtility, updateUtility } = useDataStore()
  const hydratedFormKeyRef = useRef<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formRegionName, setFormRegionName] = useState("")
  const [formContactPhone, setFormContactPhone] = useState("")
  const [formContactEmail, setFormContactEmail] = useState("")
  const [formContactAddress, setFormContactAddress] = useState("")
  const [formCenterLatitude, setFormCenterLatitude] = useState("")
  const [formCenterLongitude, setFormCenterLongitude] = useState("")
  const [formBoundaryPoints, setFormBoundaryPoints] = useState<BoundaryPointFormValue[]>([])
  const [formStatus, setFormStatus] = useState<EntityStatus>("active")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExtractingBoundary, setIsExtractingBoundary] = useState(false)

  const isAdmin = currentUser?.role === "admin"
  const isUtilityManager = currentUser?.role === "utility_manager"

  const editingUtility = useMemo(
    () => (mode === "edit" && utilityId ? utilities.find((utility) => utility.id === utilityId) ?? null : null),
    [mode, utilities, utilityId]
  )

  useEffect(() => {
    async function load() {
      setLoading(true)
      await fetchUtilities()
      setLoading(false)
    }

    void load()
  }, [fetchUtilities])

  useEffect(() => {
    if (mode === "edit") {
      if (!editingUtility) return
      const formKey = `edit:${editingUtility.id}`
      if (hydratedFormKeyRef.current === formKey) return
      hydratedFormKeyRef.current = formKey

      setFormName(editingUtility.name)
      setFormDescription(editingUtility.description || "")
      setFormRegionName(editingUtility.regionName || "")
      setFormContactPhone(editingUtility.contactPhone || "")
      setFormContactEmail(editingUtility.contactEmail || "")
      setFormContactAddress(editingUtility.contactAddress || "")
      setFormCenterLatitude(editingUtility.centerLatitude != null ? String(editingUtility.centerLatitude) : "")
      setFormCenterLongitude(editingUtility.centerLongitude != null ? String(editingUtility.centerLongitude) : "")
      setFormBoundaryPoints(extractBoundaryPoints(editingUtility.boundaryGeojson))
      setFormStatus(editingUtility.status)
      return
    }

    if (hydratedFormKeyRef.current === "create") return
    hydratedFormKeyRef.current = "create"

    setFormName("")
    setFormDescription("")
    setFormRegionName("")
    setFormContactPhone("")
    setFormContactEmail("")
    setFormContactAddress("")
    setFormCenterLatitude("")
    setFormCenterLongitude("")
    setFormBoundaryPoints([])
    setFormStatus("active")
  }, [editingUtility, mode])

  const boundaryPointsForMap = useMemo(
    () => parseBoundaryPointsForMap(formBoundaryPoints),
    [formBoundaryPoints]
  )

  async function handleSubmit() {
    if (!formName.trim()) {
      toast.error("Utility name is required")
      return
    }

    if (mode === "create" && !isAdmin) {
      toast.error("Only admins can create utilities")
      return
    }

    const hasLatitude = formCenterLatitude.trim() !== ""
    const hasLongitude = formCenterLongitude.trim() !== ""

    if (hasLatitude !== hasLongitude) {
      toast.error("Please provide both latitude and longitude for the utility center")
      return
    }

    const parsedLatitude = hasLatitude ? Number(formCenterLatitude) : null
    const parsedLongitude = hasLongitude ? Number(formCenterLongitude) : null

    if (parsedLatitude !== null && (!Number.isFinite(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90)) {
      toast.error("Utility center latitude must be a valid number between -90 and 90")
      return
    }

    if (parsedLongitude !== null && (!Number.isFinite(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180)) {
      toast.error("Utility center longitude must be a valid number between -180 and 180")
      return
    }

    const hasAnyBoundaryInput = formBoundaryPoints.some(
      (point) => point.latitude.trim() !== "" || point.longitude.trim() !== ""
    )
    const normalizedBoundaryPoints: BoundaryPointCoordinate[] = []

    for (const point of formBoundaryPoints) {
      const hasPointLatitude = point.latitude.trim() !== ""
      const hasPointLongitude = point.longitude.trim() !== ""

      if (!hasPointLatitude && !hasPointLongitude) continue

      if (hasPointLatitude !== hasPointLongitude) {
        toast.error("Each utility boundary point requires both latitude and longitude")
        return
      }

      const latitude = Number(point.latitude)
      const longitude = Number(point.longitude)

      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        toast.error("Each utility boundary latitude must be a valid number between -90 and 90")
        return
      }

      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        toast.error("Each utility boundary longitude must be a valid number between -180 and 180")
        return
      }

      normalizedBoundaryPoints.push({ latitude, longitude })
    }

    if (hasAnyBoundaryInput && normalizedBoundaryPoints.length < 3) {
      toast.error("Utility boundary requires at least three complete coordinate points")
      return
    }

    const boundaryGeojson =
      normalizedBoundaryPoints.length > 0
        ? {
            type: "Polygon" as const,
            coordinates: [
              [
                ...normalizedBoundaryPoints.map((point) => [point.longitude, point.latitude]),
                [normalizedBoundaryPoints[0].longitude, normalizedBoundaryPoints[0].latitude],
              ],
            ],
          }
        : null

    const payload = {
      name: formName.trim(),
      regionName: formRegionName.trim() || undefined,
      description: formDescription.trim() || null,
      contactPhone: formContactPhone.trim() || undefined,
      contactEmail: formContactEmail.trim() || undefined,
      contactAddress: formContactAddress.trim() || undefined,
      centerLatitude: parsedLatitude,
      centerLongitude: parsedLongitude,
      boundaryGeojson,
      status: formStatus,
    }

    setIsSubmitting(true)
    try {
      const savedUtility =
        mode === "edit" && editingUtility
          ? await updateUtility(editingUtility.id, payload)
          : await addUtility(payload)

      if (boundaryGeojson && !savedUtility.boundaryGeojson) {
        throw new Error("The utility was saved, but the backend did not persist the uploaded boundary geometry.")
      }

      if (
        parsedLatitude !== null &&
        parsedLongitude !== null &&
        (savedUtility.centerLatitude == null || savedUtility.centerLongitude == null)
      ) {
        throw new Error("The utility was saved, but the backend did not persist the utility center point.")
      }

      if (mode === "edit" && editingUtility) {
        toast.success("Utility updated successfully")
      } else {
        toast.success("Utility created successfully")
      }

      router.push("/dashboard/utilities")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "Failed to update utility"
            : "Failed to create utility"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleBoundaryFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    setIsExtractingBoundary(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/utility-boundary/extract", {
        method: "POST",
        body: formData,
      })
      const payload = (await response.json().catch(() => ({}))) as BoundaryExtractionResponse

      if (!response.ok) {
        throw new Error(payload.error || "Failed to extract utility boundary geometry")
      }

      if (!payload.center || !Array.isArray(payload.boundaryPoints) || payload.boundaryPoints.length < 3) {
        throw new Error("The uploaded file did not contain enough boundary points.")
      }

      setFormCenterLatitude(payload.center.latitude.toFixed(6))
      setFormCenterLongitude(payload.center.longitude.toFixed(6))
      setFormBoundaryPoints(
        payload.boundaryPoints.map((point) =>
          createBoundaryPoint(point.latitude.toFixed(6), point.longitude.toFixed(6))
        )
      )

      const pointCount = payload.source?.pointCount ?? payload.boundaryPoints.length
      toast.success(`Utility boundary extracted from ${file.name} with ${pointCount.toLocaleString()} points.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to extract utility boundary geometry")
    } finally {
      setIsExtractingBoundary(false)
    }
  }

  if (!isAdmin && !isUtilityManager) {
    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/dashboard/utilities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Utilities
          </Link>
        </Button>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">Access Restricted</p>
            <p className="mt-2 text-sm text-slate-500">Only admins and utility managers can edit utility details.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "create" && !isAdmin) {
    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/dashboard/utilities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Utilities
          </Link>
        </Button>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">Admin Action Required</p>
            <p className="mt-2 text-sm text-slate-500">Only admins can create a new utility.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/dashboard/utilities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Utilities
          </Link>
        </Button>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center text-slate-500">Loading utility form...</CardContent>
        </Card>
      </div>
    )
  }

  if (mode === "edit" && !editingUtility) {
    return (
      <div className="flex flex-col gap-6">
        <Button asChild variant="outline" className="w-fit rounded-xl">
          <Link href="/dashboard/utilities">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Utilities
          </Link>
        </Button>
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">Utility not found</p>
            <p className="mt-2 text-sm text-slate-500">The utility you are trying to edit could not be loaded.</p>
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
            <Link href="/dashboard/utilities">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Utilities
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                {mode === "edit" ? <Pencil className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              {mode === "edit" ? "Edit Utility" : "Create Utility"}
            </h1>
            <p className="mt-1 text-slate-500">
              {mode === "edit"
                ? "Update utility details, public contacts, service center, and boundary geometry."
                : "Create a utility with public contacts, a service center, and a reusable boundary geometry."}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/utilities">Cancel</Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-700"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : mode === "edit" ? (
              <Sparkles className="mr-2 h-4 w-4" />
            ) : null}
            {mode === "edit" ? "Save Changes" : "Create Utility"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="utility-name" className="text-sm font-medium text-slate-700">Utility Name</Label>
              <Input
                id="utility-name"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder="e.g., DAWASA"
                className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700">Region Authority</Label>
              <Select value={formRegionName || "__none__"} onValueChange={(value) => setFormRegionName(value === "__none__" ? "" : value)}>
                <SelectTrigger className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80">
                  <SelectValue placeholder="Select utility region" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg shadow-slate-200/50">
                  <SelectItem value="__none__" className="rounded-lg">No region selected yet</SelectItem>
                  {TANZANIA_REGIONS.map((region) => (
                    <SelectItem key={region} value={region} className="rounded-lg">
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="utility-description" className="text-sm font-medium text-slate-700">Description</Label>
              <Textarea
                id="utility-description"
                value={formDescription}
                onChange={(event) => setFormDescription(event.target.value)}
                placeholder="Briefly describe this utility and its service area."
                rows={4}
                className="resize-none rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="utility-phone" className="text-sm font-medium text-slate-700">Public Contact Phone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="utility-phone"
                    value={formContactPhone}
                    onChange={(event) => setFormContactPhone(event.target.value)}
                    placeholder="e.g. +255712345678"
                    className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 pl-10 focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="utility-email" className="text-sm font-medium text-slate-700">Public Contact Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="utility-email"
                    type="email"
                    value={formContactEmail}
                    onChange={(event) => setFormContactEmail(event.target.value)}
                    placeholder="e.g. support@utility.co.tz"
                    className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 pl-10 focus:border-cyan-400 focus:ring-cyan-400/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="utility-contact-address" className="text-sm font-medium text-slate-700">Public Contact Address</Label>
              <Textarea
                id="utility-contact-address"
                value={formContactAddress}
                onChange={(event) => setFormContactAddress(event.target.value)}
                placeholder="Office address to show in public emergency contacts."
                rows={3}
                className="resize-none rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-cyan-400 focus:ring-cyan-400/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="utility-center-latitude" className="text-sm font-medium text-slate-700">Center Latitude</Label>
                <Input
                  id="utility-center-latitude"
                  type="number"
                  step="0.000001"
                  value={formCenterLatitude}
                  onChange={(event) => setFormCenterLatitude(event.target.value)}
                  placeholder="-6.173056"
                  className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="utility-center-longitude" className="text-sm font-medium text-slate-700">Center Longitude</Label>
                <Input
                  id="utility-center-longitude"
                  type="number"
                  step="0.000001"
                  value={formCenterLongitude}
                  onChange={(event) => setFormCenterLongitude(event.target.value)}
                  placeholder="35.741944"
                  className="h-12 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Utility Boundary Geometry</Label>
                  <p className="text-xs text-slate-500">
                    If you already have a boundary file, upload it here and the system will extract the boundary points and center automatically.
                  </p>
                  <p className="text-xs text-slate-500">
                    If you do not have a file, use the map controls on the top right to set the utility center and capture boundary points manually.
                  </p>
                  <p className="text-xs text-slate-500">
                    Supported upload formats: GeoPackage (.gpkg), GeoJSON (.geojson), or JSON (.json).
                  </p>
                </div>
                <Input
                  id="utility-boundary-file"
                  type="file"
                  accept=".gpkg,.geojson,.json"
                  className="hidden"
                  onChange={handleBoundaryFileUpload}
                  disabled={isExtractingBoundary}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  disabled={isExtractingBoundary}
                  onClick={() => document.getElementById("utility-boundary-file")?.click()}
                >
                  {isExtractingBoundary ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {isExtractingBoundary ? "Extracting..." : "Upload Boundary File"}
                </Button>
              </div>

              {formBoundaryPoints.length ? (
                <div className="space-y-3">
                  {formBoundaryPoints.map((point, index) => (
                    <div
                      key={point.id}
                      className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 md:grid-cols-[minmax(0,0.85fr)_minmax(0,0.85fr)_auto]"
                    >
                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`utility-boundary-latitude-${point.id}`} className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Point {index + 1} Latitude
                        </Label>
                        <Input
                          id={`utility-boundary-latitude-${point.id}`}
                          type="number"
                          step="0.000001"
                          value={point.latitude}
                          onChange={(event) =>
                            setFormBoundaryPoints((current) =>
                              current.map((entry) =>
                                entry.id === point.id ? { ...entry, latitude: event.target.value } : entry
                              )
                            )
                          }
                          placeholder="-6.812345"
                          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor={`utility-boundary-longitude-${point.id}`} className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Point {index + 1} Longitude
                        </Label>
                        <Input
                          id={`utility-boundary-longitude-${point.id}`}
                          type="number"
                          step="0.000001"
                          value={point.longitude}
                          onChange={(event) =>
                            setFormBoundaryPoints((current) =>
                              current.map((entry) =>
                                entry.id === point.id ? { ...entry, longitude: event.target.value } : entry
                              )
                            )
                          }
                          placeholder="39.287654"
                          className="h-11 rounded-xl border-slate-200/80 bg-slate-50/80 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          onClick={() =>
                            setFormBoundaryPoints((current) => current.filter((entry) => entry.id !== point.id))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-5 text-sm text-slate-500">
                  No utility boundary points added yet. Upload a boundary file or click directly on the map in boundary mode.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
            <CardContent className="p-5">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-slate-700">Utility Status</Label>
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

          <Card className="border-slate-200/60 shadow-lg shadow-slate-200/20">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Utility Spatial Preview</p>
                  <p className="text-xs text-slate-500">Use the map controls to set the center and capture boundary points manually.</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <UtilityLocationPicker
                  centerValue={{
                    latitude: formCenterLatitude.trim() ? Number(formCenterLatitude) : null,
                    longitude: formCenterLongitude.trim() ? Number(formCenterLongitude) : null,
                  }}
                  boundaryPoints={boundaryPointsForMap}
                  onCenterChange={({ latitude, longitude }) => {
                    setFormCenterLatitude(latitude.toFixed(6))
                    setFormCenterLongitude(longitude.toFixed(6))
                  }}
                  onBoundaryChange={(next) =>
                    setFormBoundaryPoints(
                      next.map((point) =>
                        createBoundaryPoint(point.latitude.toFixed(6), point.longitude.toFixed(6))
                      )
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
