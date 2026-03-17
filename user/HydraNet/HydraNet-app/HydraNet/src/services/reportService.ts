/**
 * Report Service for HydraNet
 * Handles report submission to backend API
 */

import { apiPost, apiGet, apiPut } from './apiClient';

export interface ReportPayload {
  description: string;
  latitude: number;
  longitude: number;
  priority: 'urgent' | 'moderate' | 'low';
  image_url?: string;
  images?: string[];
  reported_by?: string;
}

export interface ReportResponse {
  id: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  priority: string;
  status: string;
  created_at: string;
  images?: string[];
}

/**
 * Submit a water problem report to backend
 */
export async function submitWaterProblem(payload: ReportPayload): Promise<ReportResponse> {
  try {
    const response = await apiPost<ReportResponse>('/api/reports/anonymous', {
      description: payload.description,
      latitude: payload.latitude,
      longitude: payload.longitude,
      priority: payload.priority === 'urgent' ? 'High' : payload.priority === 'moderate' ? 'Medium' : 'Low',
      images: payload.images || (payload.image_url ? [payload.image_url] : []),
      reported_by: payload.reported_by,
    });

    console.log('✅ Report submitted successfully');
    return response;
  } catch (error) {
    console.error('❌ Error submitting report:', error);
    throw error;
  }
}

/**
 * Get report history for current user
 */
export async function getReportHistory(limit: number = 50): Promise<ReportResponse[]> {
  try {
    const reports = await apiGet<ReportResponse[]>('/api/reports', {
      params: { limit },
    });

    console.log('📋 Fetched reports from backend:', reports.length);
    return reports;
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    return [];
  }
}

/**
 * Get a single report by ID
 */
export async function getReportById(reportId: string): Promise<ReportResponse> {
  try {
    const report = await apiGet<ReportResponse>(`/api/reports/${reportId}`);
    return report;
  } catch (error) {
    console.error('❌ Error fetching report:', error);
    throw error;
  }
}

/**
 * Update report status
 */
export async function updateReportStatus(
  reportId: string,
  status: string,
  notes?: string
): Promise<ReportResponse> {
  try {
    const response = await apiPut<ReportResponse>(`/api/reports/${reportId}`, {
      status,
      notes,
    });

    return response;
  } catch (error) {
    console.error('❌ Error updating report status:', error);
    throw error;
  }
}
