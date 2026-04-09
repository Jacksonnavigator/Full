/**
 * Report Service for the public HydraNet app.
 *
 * The live user flow is anonymous, so report history is tracked locally and
 * refreshed from the backend's public report listing when possible.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPost } from './apiClient';
import { getEndpointUrl, getReportsEndpoint } from './backendConfig';
import { ImageResult } from '../types';
import { encodeMediaAsDataUri, uploadAnonymousMedia } from './imageUploadService_v2';

const LOCAL_HISTORY_KEY = 'hydranet_public_report_history_v1';

export interface ReportPayload {
  description: string;
  latitude: number;
  longitude: number;
  priority: 'urgent' | 'moderate' | 'low';
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
  photos: string[];
  report_photos?: string[];
  priority: string;
  status: string;
  utility_id: string;
  utility_name?: string | null;
  dma_id?: string | null;
  dma_name?: string | null;
  notes?: string | null;
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
    const response = normalizeReport(
      await apiPost<ReportResponse>(`${getReportsEndpoint()}/anonymous`, {
        description: payload.description,
        latitude: payload.latitude,
        longitude: payload.longitude,
        priority: mapPriority(payload.priority),
        images,
        reported_by: payload.reported_by,
      }, {
        requiresAuth: false,
      })
    );

    if (payload.image?.mediaType) {
      response.primary_media_type = payload.image.mediaType;
    }

    await storeSubmittedReport(response);
    console.log('[ReportService] Report submitted successfully:', response.tracking_id);
    return response;
  } catch (error) {
    console.error('[ReportService] Error submitting report:', error);
    throw error;
  }
}

export async function getReportHistory(limit: number = 50): Promise<ReportResponse[]> {
  try {
    const storedReports = await loadStoredReports();
    if (storedReports.length === 0) {
      return [];
    }

    const refreshedReports = await refreshStoredReports(storedReports);
    return refreshedReports
      .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('[ReportService] Error fetching report history:', error);
    return [];
  }
}

export async function getReportById(reportId: string): Promise<ReportResponse | null> {
  const history = await getReportHistory();
  return history.find((report) => report.id === reportId) || null;
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
  } catch (error) {
    console.warn('[ReportService] Anonymous media upload failed, falling back to data URI payload:', error);
  }

  return encodeMediaAsDataUri(image.uri, image.type);
}

function isPortableMediaReference(value: string): boolean {
  return value.startsWith('data:image/') || value.startsWith('data:video/') || value.startsWith('http://') || value.startsWith('https://');
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

function normalizeReport(report: Partial<ReportResponse> & Record<string, any>): ReportResponse {
  const normalizedPhotos = Array.isArray(report.report_photos)
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
    latitude: Number(report.latitude ?? report.location?.latitude ?? 0),
    longitude: Number(report.longitude ?? report.location?.longitude ?? 0),
    address: report.address ?? null,
    photos: normalizedPhotos.map(toAbsoluteMediaReference),
    report_photos: normalizedPhotos.map(toAbsoluteMediaReference),
    priority: String(report.priority || 'Medium'),
    status: String(report.status || 'new'),
    utility_id: report.utility_id ? String(report.utility_id) : '',
    utility_name: report.utility_name ?? null,
    dma_id: report.dma_id ?? null,
    dma_name: report.dma_name ?? null,
    notes: report.notes ?? null,
    reporter_name: report.reporter_name ?? undefined,
    reporter_phone: report.reporter_phone ?? undefined,
    created_at: String(report.created_at || new Date().toISOString()),
    updated_at: String(report.updated_at || report.created_at || new Date().toISOString()),
    resolved_at: report.resolved_at ?? null,
    primary_media_type: report.primary_media_type === 'video' ? 'video' : report.primary_media_type === 'photo' ? 'photo' : undefined,
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

  await AsyncStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(nextReports.slice(0, 100)));
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

  const refreshedReports = Array.from(refreshedMap.values());
  await AsyncStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(
    refreshedReports.map((report) => ({
      id: report.id,
      tracking_id: report.tracking_id,
      utility_id: report.utility_id,
      dma_id: report.dma_id,
      created_at: report.created_at,
      snapshot: report,
    }))
  ));

  return refreshedReports;
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
