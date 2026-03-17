/**
 * HydraNet Mobile - Reports API Service
 * Centralized reports API calls for DMA managers
 */

import CONFIG from '@/lib/config';
import { apiClient } from '@/lib/api-client';

export interface Report {
  id: string;
  tracking_id: string;
  description: string;
  latitude: number;
  longitude: number;
  priority: string;
  status: string;
  utility_id?: string;
  utility_name?: string;
  dma_id?: string;
  dma_name?: string;
  branch_id?: string;
  branch_name?: string;
  team_id?: string;
  team_name?: string;
  assigned_engineer_id?: string;
  assigned_engineer_name?: string;
  reporter_name: string;
  reporter_phone: string;
  notes?: string;
  sla_deadline?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportListResponse {
  total: number;
  items: Report[];
}

export interface AssignReportRequest {
  team_id: string;
  engineer_id: string;
}

export class ReportService {
  /**
   * Get all reports with optional filters
   */
  static async getReports(filters?: any): Promise<ReportListResponse> {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get<ReportListResponse>(`${CONFIG.ENDPOINTS.REPORTS.LIST}${params}`);
  }

  /**
   * Get single report details
   */
  static async getReportDetail(reportId: string): Promise<Report> {
    return apiClient.get<Report>(
      CONFIG.ENDPOINTS.REPORTS.DETAIL.replace(':id', reportId)
    );
  }

  /**
   * Get report by tracking ID
   */
  static async getReportByTrackingId(trackingId: string): Promise<Report> {
    return apiClient.get<Report>(
      CONFIG.ENDPOINTS.REPORTS.TRACKING.replace(':trackingId', trackingId)
    );
  }

  /**
   * Update report
   */
  static async updateReport(reportId: string, data: Partial<Report>): Promise<Report> {
    return apiClient.put<Report>(
      CONFIG.ENDPOINTS.REPORTS.UPDATE.replace(':id', reportId),
      data
    );
  }

  /**
   * Update report status
   */
  static async updateReportStatus(reportId: string, status: string, notes?: string): Promise<Report> {
    return apiClient.patch<Report>(
      CONFIG.ENDPOINTS.REPORTS.UPDATE.replace(':id', reportId),
      { status, notes }
    );
  }

  /**
   * Assign report to team and engineer
   */
  static async assignReport(reportId: string, assignment: AssignReportRequest): Promise<Report> {
    return apiClient.put<Report>(
      CONFIG.ENDPOINTS.REPORTS.ASSIGN.replace(':id', reportId),
      assignment
    );
  }

  /**
   * Approve completed report
   */
  static async approveReport(reportId: string): Promise<Report> {
    return apiClient.post<Report>(
      CONFIG.ENDPOINTS.REPORTS.APPROVE.replace(':id', reportId)
    );
  }

  /**
   * Reject completed report
   */
  static async rejectReport(reportId: string): Promise<Report> {
    return apiClient.post<Report>(
      CONFIG.ENDPOINTS.REPORTS.REJECT.replace(':id', reportId)
    );
  }

  /**
   * Delete report
   */
  static async deleteReport(reportId: string): Promise<void> {
    return apiClient.delete(
      CONFIG.ENDPOINTS.REPORTS.DELETE.replace(':id', reportId)
    );
  }
}