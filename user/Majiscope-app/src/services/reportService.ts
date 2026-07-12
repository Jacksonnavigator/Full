/**
 * Report Service for the public HydraNet app.
 *
 * Anonymous report history is backed by a public history key and mirrored
 * locally for offline viewing and quick reloads.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPost } from './apiClient';
import { getEndpointUrl, getReportsEndpoint } from './backendConfig';
import { ImageResult } from '../types';
import { encodeMediaAsDataUri, uploadAnonymousMedia } from './imageUploadService_v2';

const LOCAL_HISTORY_KEY = 'majiscope_public_report_history_v1';
const PUBLIC_HISTORY_ID_KEY = 'majiscope_public_history_id_v1';
const MAX_HISTORY_REPORTS = 100;

export interface ReportPayload {
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  region_name?: string;
  district_name?: string;
  priority: 'urgent' | 'moderate' | 'low';
  report_type?: 'leakage' | 'non_leakage';
  leakage_type?: 'ground_leakage' | 'pipe_burst' | 'meter_leakage' | 'valve_leakage' | 'overflow' | 'unknown' | null;
  image?: ImageResult;
  image_url?: string;
  images?: string[];
  reported_by?: string;
}

export interface ReportResponse {
  id: string;
  tracking_id: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  region_name?: string | null;
  district_name?: string | null;
  photos: string[];
  report_photos?: string[];
  priority: string;
  report_type?: 'leakage' | 'non_leakage';
  leakage_type?: 'ground_leakage' | 'pipe_burst' | 'meter_leakage' | 'valve_leakage' | 'overflow' | 'unknown' | null;
  status: string;
  utility_id?: string | null;
  utility_name?: string | null;
  utility_contact_phone?: string | null;
  utility_contact_email?: string | null;
  utility_contact_address?: string | null;
  dma_id?: string | null;
  dma_name?: string | null;
  notes?: string | null;
  engineer_submission_notes?: string | null;
  team_leader_review_notes?: string | null;
  dma_review_notes?: string | null;
  reporter_name?: string;
  reporter_phone?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  primary_media_type?: 'photo' | 'video';
}

interface ReportListResponse {
  total: number;
  items: ReportResponse[];
}

interface StoredReportReference {
  id: string;
  tracking_id: string;
  utility_id?: string | null;
  dma_id?: string | null;
  created_at: string;
  snapshot: ReportResponse;
}

export async function submitWaterProblem(payload: ReportPayload): Promise<ReportResponse> {
  try {
    const images = await resolvePayloadImages(payload);
    const historyKey = await getOrCreatePublicHistoryKey();
    const reportType = payload.report_type || 'leakage';
    const submissionBody: Record<string, unknown> = {
      description: payload.description,
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      region_name: payload.region_name,
      district_name: payload.district_name,
      priority: mapPriority(payload.priority),
      report_type: reportType,
      images,
      reported_by: payload.reported_by,
      history_key: historyKey,
    };

    if (reportType === 'non_leakage') {
      submissionBody.leakage_type = null;
    } else {
      submissionBody.leakage_type = payload.leakage_type || 'unknown';
    }

    const response = normalizeReport(
      await apiPost<ReportResponse>(
        `${getReportsEndpoint()}/anonymous`,
        submissionBody,
        {
          requiresAuth: false,
        }
      )
    );

    if (payload.image?.mediaType) {
      response.primary_media_type = payload.image.mediaType;
    }

    await storeSubmittedReport(response);
    return response;
  } catch (error) {
    console.error('[ReportService] Error submitting report:', error);
    throw error;
  }
}

export async function getReportHistory(limit = 50): Promise<ReportResponse[]> {
  try {
    const historyKey = await getOrCreatePublicHistoryKey();
    const storedReports = await loadStoredReports();
    const backendHistory = await fetchPublicHistory(historyKey);

    const mergedReports =
      backendHistory.length > 0
        ? mergeReports(storedReports.map((item) => normalizeReport(item.snapshot)), backendHistory)
        : storedReports.length > 0
        ? await refreshStoredReports(storedReports)
        : [];

    await persistNormalizedReports(mergedReports);

    return mergedReports
      .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('[ReportService] Error fetching report history:', error);
    return [];
  }
}

export async function lookupReportByTrackingId(trackingId: string): Promise<ReportResponse | null> {
  const cleanedTrackingId = trackingId.trim();
  if (!cleanedTrackingId) {
    return null;
  }

  try {
    const historyKey = await getOrCreatePublicHistoryKey();
    const report = normalizeReport(
      await apiPost<ReportResponse>(
        `${getReportsEndpoint()}/public/history/${encodeURIComponent(historyKey)}/claim/${encodeURIComponent(cleanedTrackingId)}`,
        {},
        {
          requiresAuth: false,
        }
      )
    );
    await storeSubmittedReport(report);
    return report;
  } catch (error) {
    console.warn('[ReportService] Unable to claim report by tracking ID, falling back to lookup:', error);
  }

  try {
    const report = normalizeReport(
      await apiGet<ReportResponse>(`${getReportsEndpoint()}/public/tracking/${encodeURIComponent(cleanedTrackingId)}`, {
        requiresAuth: false,
      })
    );
    await storeSubmittedReport(report);
    return report;
  } catch (error) {
    console.warn('[ReportService] Unable to look up report by tracking ID:', error);
    return null;
  }
}

export async function getPublicHistorySyncKey(): Promise<string> {
  return getOrCreatePublicHistoryKey();
}

export async function setPublicHistorySyncKey(historyKey: string): Promise<void> {
  const cleanedKey = historyKey.trim();
  if (!cleanedKey) {
    throw new Error('History sync key is required.');
  }

  await AsyncStorage.setItem(PUBLIC_HISTORY_ID_KEY, cleanedKey);
  await AsyncStorage.removeItem(LOCAL_HISTORY_KEY);
}

async function resolvePayloadImages(payload: ReportPayload): Promise<string[]> {
  if (payload.images && payload.images.length > 0) {
    return payload.images;
  }

  if (payload.image) {
    return [await serializeImage(payload.image)];
  }

  if (payload.image_url) {
    if (isPortableMediaReference(payload.image_url)) {
      return [payload.image_url];
    }

    throw new Error('Please attach media from this device before submitting your report.');
  }

  return [];
}

async function serializeImage(image: ImageResult): Promise<string> {
  if (isPortableMediaReference(image.uri)) {
    return image.uri;
  }

  try {
    const uploaded = await uploadAnonymousMedia(image.uri, image.type);
    return uploaded.downloadUrl;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : JSON.stringify(error);

    throw new Error(
      `[ReportService] Anonymous media upload failed: ${errorMessage}`
    );
  }
}

function isPortableMediaReference(value: string): boolean {
  return (
    value.startsWith('data:image/') ||
    value.startsWith('data:video/') ||
    value.startsWith('http://') ||
    value.startsWith('https://')
  );
}

function mapPriority(priority: ReportPayload['priority']): string {
  switch (priority) {
    case 'urgent':
      return 'High';
    case 'moderate':
      return 'Medium';
    default:
      return 'Low';
  }
}

function normalizeReport(report: Record<string, any>): ReportResponse {
  const reportPhotos = Array.isArray(report.report_photos)
    ? report.report_photos
    : Array.isArray(report.photos)
    ? report.photos
    : Array.isArray(report.images)
    ? report.images
    : [];

  return {
    id: String(report.id || ''),
    tracking_id: String(report.tracking_id || report.trackingId || ''),
    description: String(report.description || ''),
    latitude: Number(report.latitude ?? (report.location as { latitude?: number } | undefined)?.latitude ?? 0),
    longitude: Number(report.longitude ?? (report.location as { longitude?: number } | undefined)?.longitude ?? 0),
    address: (report.address as string | null | undefined) ?? null,
    photos: reportPhotos.map((value) => toAbsoluteMediaReference(String(value))),
    report_photos: reportPhotos.map((value) => toAbsoluteMediaReference(String(value))),
    priority: String(report.priority || 'Medium'),
    report_type: report.report_type === 'non_leakage' ? 'non_leakage' : 'leakage',
    leakage_type:
      report.report_type === 'non_leakage'
        ? null
        : (report.leakage_type as ReportResponse['leakage_type']) || 'unknown',
    status: String(report.status || 'new'),
    utility_id: report.utility_id ? String(report.utility_id) : '',
    utility_name: (report.utility_name as string | null | undefined) ?? null,
    utility_contact_phone: (report.utility_contact_phone as string | null | undefined) ?? null,
    utility_contact_email: (report.utility_contact_email as string | null | undefined) ?? null,
    utility_contact_address: (report.utility_contact_address as string | null | undefined) ?? null,
    dma_id: (report.dma_id as string | null | undefined) ?? null,
    dma_name: (report.dma_name as string | null | undefined) ?? null,
    notes: (report.notes as string | null | undefined) ?? null,
    engineer_submission_notes: (report.engineer_submission_notes as string | null | undefined) ?? null,
    team_leader_review_notes: (report.team_leader_review_notes as string | null | undefined) ?? null,
    dma_review_notes: (report.dma_review_notes as string | null | undefined) ?? null,
    reporter_name: report.reporter_name as string | undefined,
    reporter_phone: report.reporter_phone as string | undefined,
    created_at: String(report.created_at || new Date().toISOString()),
    updated_at: String(report.updated_at || report.created_at || new Date().toISOString()),
    resolved_at: (report.resolved_at as string | null | undefined) ?? null,
    primary_media_type:
      report.primary_media_type === 'video'
        ? 'video'
        : report.primary_media_type === 'photo'
        ? 'photo'
        : undefined,
  };
}

async function loadStoredReports(): Promise<StoredReportReference[]> {
  try {
    const stored = await AsyncStorage.getItem(LOCAL_HISTORY_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as StoredReportReference[];
    return parsed.filter((item) => item?.id && item?.snapshot);
  } catch (error) {
    console.error('[ReportService] Failed to load local report history:', error);
    return [];
  }
}

async function getOrCreatePublicHistoryKey(): Promise<string> {
  const existing = await AsyncStorage.getItem(PUBLIC_HISTORY_ID_KEY);
  if (existing && existing.trim().length > 0) {
    return existing.trim();
  }

  const generated = `public-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(PUBLIC_HISTORY_ID_KEY, generated);
  return generated;
}

async function storeSubmittedReport(report: ReportResponse): Promise<void> {
  const storedReports = await loadStoredReports();
  const nextReports = [
    {
      id: report.id,
      tracking_id: report.tracking_id,
      utility_id: report.utility_id,
      dma_id: report.dma_id,
      created_at: report.created_at,
      snapshot: report,
    },
    ...storedReports.filter((item) => item.id !== report.id),
  ];

  await AsyncStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(nextReports.slice(0, MAX_HISTORY_REPORTS)));
}

async function refreshStoredReports(storedReports: StoredReportReference[]): Promise<ReportResponse[]> {
  const refreshedMap = new Map<string, ReportResponse>();
  const groupedRequests = new Map<string, { utilityId?: string | null; dmaId?: string | null; ids: Set<string> }>();

  for (const stored of storedReports) {
    refreshedMap.set(stored.id, normalizeReport(stored.snapshot));
    const key = `${stored.utility_id || ''}::${stored.dma_id || ''}`;
    const group = groupedRequests.get(key) || {
      utilityId: stored.utility_id,
      dmaId: stored.dma_id,
      ids: new Set<string>(),
    };
    group.ids.add(stored.id);
    groupedRequests.set(key, group);
  }

  for (const group of groupedRequests.values()) {
    if (!group.utilityId && !group.dmaId) {
      continue;
    }

    try {
      const response = await apiGet<ReportListResponse>(`${getReportsEndpoint()}/public/by-location`, {
        requiresAuth: false,
        params: {
          utility_id: group.utilityId || undefined,
          dma_id: group.dmaId || undefined,
          limit: 100,
        },
      });

      for (const rawReport of response.items || []) {
        const report = normalizeReport(rawReport);
        if (group.ids.has(report.id)) {
          const existing = refreshedMap.get(report.id);
          if (existing?.primary_media_type && !report.primary_media_type) {
            report.primary_media_type = existing.primary_media_type;
          }
          refreshedMap.set(report.id, report);
        }
      }
    } catch (error) {
      console.warn('[ReportService] Failed to refresh public reports for history group:', error);
    }
  }

  return Array.from(refreshedMap.values());
}

async function fetchPublicHistory(historyKey: string): Promise<ReportResponse[]> {
  try {
    const response = await apiGet<ReportListResponse>(`${getReportsEndpoint()}/public/history/${encodeURIComponent(historyKey)}`, {
      requiresAuth: false,
      params: { limit: MAX_HISTORY_REPORTS },
    });
    return (response.items || []).map((report) => normalizeReport(report));
  } catch (error) {
    console.warn('[ReportService] Failed to fetch backend-backed public history:', error);
    return [];
  }
}

function mergeReports(existing: ReportResponse[], incoming: ReportResponse[]): ReportResponse[] {
  const merged = new Map<string, ReportResponse>();

  for (const report of [...existing, ...incoming]) {
    const key = report.id || report.tracking_id;
    if (!key) continue;

    const previous = merged.get(key);
    merged.set(key, {
      ...(previous || {}),
      ...report,
      primary_media_type: report.primary_media_type || previous?.primary_media_type,
      photos: report.photos?.length ? report.photos : previous?.photos || [],
      report_photos: report.report_photos?.length ? report.report_photos : previous?.report_photos || [],
    });
  }

  return Array.from(merged.values());
}

async function persistNormalizedReports(reports: ReportResponse[]): Promise<void> {
  await AsyncStorage.setItem(
    LOCAL_HISTORY_KEY,
    JSON.stringify(
      reports.slice(0, MAX_HISTORY_REPORTS).map((report) => ({
        id: report.id,
        tracking_id: report.tracking_id,
        utility_id: report.utility_id,
        dma_id: report.dma_id,
        created_at: report.created_at,
        snapshot: report,
      }))
    )
  );
}

function toAbsoluteMediaReference(value: string): string {
  if (!value) return value;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  if (value.startsWith('/')) {
    return getEndpointUrl(value);
  }
  return value;
}
