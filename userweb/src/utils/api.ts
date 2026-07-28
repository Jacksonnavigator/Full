export type AppLanguage = 'en' | 'sw'
export type ReportPriority = 'urgent' | 'moderate' | 'low'
export type ReportType = 'leakage' | 'non_leakage'
export type LeakageType = 'ground_leakage' | 'pipe_burst' | 'meter_leakage' | 'valve_leakage' | 'overflow' | 'unknown'

export interface PublicReport {
  id: string
  tracking_id: string
  description: string
  latitude: number
  longitude: number
  address?: string | null
  region_name?: string | null
  district_name?: string | null
  photos: string[]
  report_photos?: string[]
  priority: string
  report_type: ReportType
  leakage_type?: LeakageType | null
  status: string
  utility_id?: string | null
  utility_name?: string | null
  utility_contact_phone?: string | null
  utility_contact_email?: string | null
  utility_contact_address?: string | null
  dma_id?: string | null
  dma_name?: string | null
  notes?: string | null
  engineer_submission_notes?: string | null
  team_leader_review_notes?: string | null
  dma_review_notes?: string | null
  created_at: string
  updated_at: string
  resolved_at?: string | null
  primary_media_type?: 'photo' | 'video'
}

export interface UtilityContact {
  utility_id: string
  utility_name: string
  region_name?: string | null
  dma_id?: string | null
  dma_name?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  contact_address?: string | null
}

export interface NewReportPayload {
  description: string
  latitude: number
  longitude: number
  address?: string
  region_name?: string
  district_name?: string
  priority: ReportPriority
  report_type: ReportType
  leakage_type?: LeakageType | null
  files: File[]
}

const BASE = (import.meta.env.VITE_BACKEND_URL || 'https://majiscope.onrender.com').replace(/\/$/, '')
const HISTORY_KEY_STORAGE = 'majiscope_public_history_id_v1'
const REPORTS_STORAGE = 'majiscope_public_report_history_v1'
const MAX_REPORTS = 100

function endpoint(path: string) {
  return `${BASE}${path}`
}

async function request<T>(path: string, init?: RequestInit, timeoutMs = 40000): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(endpoint(path), {
      ...init,
      signal: controller.signal,
      headers: { Accept: 'application/json', ...(init?.headers || {}) },
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.detail || body?.message || body?.error || `Request failed with status ${response.status}.`)
    }
    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The service is taking longer than expected. Please try again in a moment.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

function getHistoryKey() {
  const existing = localStorage.getItem(HISTORY_KEY_STORAGE)
  if (existing) return existing
  const generated = `public-${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`
  localStorage.setItem(HISTORY_KEY_STORAGE, generated)
  return generated
}

export function getHistorySyncKey() {
  return getHistoryKey()
}

export function setHistorySyncKey(historyKey: string) {
  const cleaned = historyKey.trim()
  if (!cleaned) throw new Error('A history key is required.')
  localStorage.setItem(HISTORY_KEY_STORAGE, cleaned)
  localStorage.removeItem(REPORTS_STORAGE)
}

function resolveMediaUrl(value: string) {
  if (!value || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value
  return value.startsWith('/') ? endpoint(value) : value
}

function normalizeReport(raw: any): PublicReport {
  const media: unknown[] = Array.isArray(raw.report_photos)
    ? raw.report_photos
    : Array.isArray(raw.photos)
      ? raw.photos
      : Array.isArray(raw.images)
        ? raw.images
        : []
  return {
    id: String(raw.id || ''),
    tracking_id: String(raw.tracking_id || raw.trackingId || ''),
    description: String(raw.description || ''),
    latitude: Number(raw.latitude ?? 0),
    longitude: Number(raw.longitude ?? 0),
    address: typeof raw.address === 'string' ? raw.address : null,
    region_name: typeof raw.region_name === 'string' ? raw.region_name : null,
    district_name: typeof raw.district_name === 'string' ? raw.district_name : null,
    photos: media.map((value) => resolveMediaUrl(String(value))),
    report_photos: media.map((value) => resolveMediaUrl(String(value))),
    priority: String(raw.priority || 'moderate'),
    report_type: raw.report_type === 'non_leakage' ? 'non_leakage' : 'leakage',
    leakage_type: raw.report_type === 'non_leakage' ? null : (raw.leakage_type as LeakageType) || 'unknown',
    status: String(raw.status || 'new'),
    utility_id: raw.utility_id ? String(raw.utility_id) : null,
    utility_name: typeof raw.utility_name === 'string' ? raw.utility_name : null,
    utility_contact_phone: typeof raw.utility_contact_phone === 'string' ? raw.utility_contact_phone : null,
    utility_contact_email: typeof raw.utility_contact_email === 'string' ? raw.utility_contact_email : null,
    utility_contact_address: typeof raw.utility_contact_address === 'string' ? raw.utility_contact_address : null,
    dma_id: raw.dma_id ? String(raw.dma_id) : null,
    dma_name: typeof raw.dma_name === 'string' ? raw.dma_name : null,
    notes: typeof raw.notes === 'string' ? raw.notes : null,
    engineer_submission_notes: typeof raw.engineer_submission_notes === 'string' ? raw.engineer_submission_notes : null,
    team_leader_review_notes: typeof raw.team_leader_review_notes === 'string' ? raw.team_leader_review_notes : null,
    dma_review_notes: typeof raw.dma_review_notes === 'string' ? raw.dma_review_notes : null,
    created_at: String(raw.created_at || new Date().toISOString()),
    updated_at: String(raw.updated_at || raw.created_at || new Date().toISOString()),
    resolved_at: typeof raw.resolved_at === 'string' ? raw.resolved_at : null,
    primary_media_type: raw.primary_media_type === 'video' ? 'video' : raw.primary_media_type === 'photo' ? 'photo' : undefined,
  }
}

function loadStoredReports(): PublicReport[] {
  try {
    const saved = JSON.parse(localStorage.getItem(REPORTS_STORAGE) || '[]')
    return Array.isArray(saved) ? saved.map(normalizeReport).filter((report) => report.id || report.tracking_id) : []
  } catch {
    return []
  }
}

function storeReports(reports: PublicReport[]) {
  localStorage.setItem(REPORTS_STORAGE, JSON.stringify(reports.slice(0, MAX_REPORTS)))
}

function mergeReports(...groups: PublicReport[][]) {
  const merged = new Map<string, PublicReport>()
  for (const group of groups) {
    for (const report of group) {
      const key = report.id || report.tracking_id
      if (!key) continue
      const previous = merged.get(key)
      merged.set(key, {
        ...previous,
        ...report,
        photos: report.photos.length ? report.photos : previous?.photos || [],
        report_photos: report.report_photos?.length ? report.report_photos : previous?.report_photos || [],
        primary_media_type: report.primary_media_type || previous?.primary_media_type,
      })
    }
  }
  return [...merged.values()].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
}

async function uploadPublicFile(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file, file.name)
  body.append('image_type', 'report')
  const response = await fetch(endpoint('/api/uploads/public'), { method: 'POST', body })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.detail || 'Unable to upload the selected media.')
  }
  const uploaded = await response.json() as { downloadUrl?: string; download_url?: string; url?: string }
  const value = uploaded.downloadUrl || uploaded.download_url || uploaded.url
  if (!value) throw new Error('The media upload did not return a file reference.')
  return resolveMediaUrl(value)
}

export async function submitAnonymousReport(payload: NewReportPayload): Promise<PublicReport> {
  const images = await Promise.all(payload.files.map(uploadPublicFile))
  const report = await request<PublicReport>('/api/reports/anonymous', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: payload.description,
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      region_name: payload.region_name,
      district_name: payload.district_name,
      priority: payload.priority,
      report_type: payload.report_type,
      leakage_type: payload.report_type === 'non_leakage' ? null : payload.leakage_type || 'unknown',
      images,
      history_key: getHistoryKey(),
    }),
  })
  const normalized = normalizeReport(report)
  storeReports(mergeReports([normalized], loadStoredReports()))
  return normalized
}

export async function getReportHistory(): Promise<PublicReport[]> {
  const local = loadStoredReports()
  try {
    const response = await request<{ items?: PublicReport[] }>(`/api/reports/public/history/${encodeURIComponent(getHistoryKey())}?limit=${MAX_REPORTS}`)
    const reports = mergeReports(response.items?.map(normalizeReport) || [], local)
    storeReports(reports)
    return reports
  } catch {
    return local
  }
}

export async function lookupReportByTrackingId(trackingId: string): Promise<PublicReport | null> {
  const cleaned = trackingId.trim()
  if (!cleaned) return null
  try {
    const report = await request<PublicReport>(
      `/api/reports/public/history/${encodeURIComponent(getHistoryKey())}/claim/${encodeURIComponent(cleaned)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' },
    )
    const normalized = normalizeReport(report)
    storeReports(mergeReports([normalized], loadStoredReports()))
    return normalized
  } catch {
    try {
      const report = await request<PublicReport>(`/api/reports/public/tracking/${encodeURIComponent(cleaned)}`)
      const normalized = normalizeReport(report)
      storeReports(mergeReports([normalized], loadStoredReports()))
      return normalized
    } catch {
      return null
    }
  }
}

export async function resolveUtility(latitude: number, longitude: number): Promise<UtilityContact | null> {
  try {
    return await request<UtilityContact>(`/api/utilities/public/resolve?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`)
  } catch {
    return null
  }
}