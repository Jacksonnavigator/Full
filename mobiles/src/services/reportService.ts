/**
 * HydraNet Report Service
 * Handles leakage report submission, retrieval, and status updates
 * Uses HydraNet Backend API (FastAPI)
 */

import {
  apiPost,
  apiGet,
  apiPut,
  apiDelete,
} from './apiClient';
import { LeakageReport, RepairSubmission, ReportStatus } from './serviceTypes';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Submit a new leakage report
 */
export async function submitLeakageReport(
  description: string,
  location: GeoPoint,
  priority: string,
  type: string,
  imageUrls: string[],
  reportedByUserId?: string,
  requiresAuth: boolean = true
): Promise<LeakageReport> {
  try {
    const response = await apiPost<LeakageReport>(
      '/api/reports',
      {
        description,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        priority,
        type,
        images: imageUrls,
        reported_by: reportedByUserId,
        status: 'New',
      },
      { requiresAuth }
    );

    return response;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

/**
 * Get all reports (with optional filtering)
 */
export async function getReports(filters?: {
  status?: ReportStatus;
  priority?: string;
  utility_id?: string;
  dma_id?: string;
  skip?: number;
  limit?: number;
}): Promise<LeakageReport[]> {
  try {
    const response = await apiGet<LeakageReport[]>('/api/reports', {
      params: filters,
    });

    return response;
  } catch (error) {
    console.error('Error getting reports:', error);
    throw error;
  }
}

/**
 * Get a single report by ID
 */
export async function getReportById(reportId: string): Promise<LeakageReport> {
  try {
    const response = await apiGet<LeakageReport>(`/api/reports/${reportId}`);
    return response;
  } catch (error) {
    console.error('Error getting report:', error);
    throw error;
  }
}

/**
 * Update report status
 */
export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  notes?: string
): Promise<LeakageReport> {
  try {
    const response = await apiPut<LeakageReport>(
      `/api/reports/${reportId}`,
      {
        status: newStatus,
        notes,
      }
    );

    return response;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}

/**
 * Assign report to engineer/team
 */
export async function assignReport(
  reportId: string,
  assignTo: {
    team_id?: string;
    engineer_id?: string;
  },
  notes?: string
): Promise<LeakageReport> {
  try {
    const response = await apiPut<LeakageReport>(
      `/api/reports/${reportId}`,
      {
        ...assignTo,
        notes,
      }
    );

    return response;
  } catch (error) {
    console.error('Error assigning report:', error);
    throw error;
  }
}

/**
 * Submit repair work on a report
 */
export async function submitRepairWork(
  reportId: string,
  submissionData: {
    engineer_id: string;
    description: string;
    materials_used?: string[];
    before_photos?: string[];
    after_photos?: string[];
    time_spent_minutes?: number;
    notes?: string;
  }
): Promise<RepairSubmission> {
  try {
    const response = await apiPost<RepairSubmission>(
      `/api/reports/${reportId}/submissions`,
      submissionData
    );

    return response;
  } catch (error) {
    console.error('Error submitting repair work:', error);
    throw error;
  }
}

/**
 * Get submissions for a report
 */
export async function getReportSubmissions(reportId: string): Promise<RepairSubmission[]> {
  try {
    const response = await apiGet<RepairSubmission[]>(
      `/api/reports/${reportId}/submissions`
    );

    return response;
  } catch (error) {
    console.error('Error getting submissions:', error);
    throw error;
  }
}

/**
 * Approve a submission
 */
export async function approveSubmission(
  reportId: string,
  submissionId: string,
  notes?: string
): Promise<RepairSubmission> {
  try {
    const response = await apiPut<RepairSubmission>(
      `/api/reports/${reportId}/submissions/${submissionId}`,
      {
        status: 'Approved',
        notes,
      }
    );

    return response;
  } catch (error) {
    console.error('Error approving submission:', error);
    throw error;
  }
}

/**
 * Reject a submission
 */
export async function rejectSubmission(
  reportId: string,
  submissionId: string,
  reason: string
): Promise<RepairSubmission> {
  try {
    const response = await apiPut<RepairSubmission>(
      `/api/reports/${reportId}/submissions/${submissionId}`,
      {
        status: 'Rejected',
        rejection_reason: reason,
      }
    );

    return response;
  } catch (error) {
    console.error('Error rejecting submission:', error);
    throw error;
  }
}

/**
 * Close/resolve a report
 */
export async function closeReport(
  reportId: string,
  notes?: string
): Promise<LeakageReport> {
  try {
    const response = await apiPut<LeakageReport>(
      `/api/reports/${reportId}`,
      {
        status: 'Resolved',
        resolution_notes: notes,
      }
    );

    return response;
  } catch (error) {
    console.error('Error closing report:', error);
    throw error;
  }
}

/**
 * Delete a report (admin only)
 */
export async function deleteReport(reportId: string): Promise<void> {
  try {
    await apiDelete(`/api/reports/${reportId}`);
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

/**
 * Approve repair submission (wrapper for compatibility with old API)
 * @deprecated Use approveSubmission instead
 */
export async function approveRepairSubmission(
  submissionId: string,
  approvalNotes: string,
  approvedByUserId: string
): Promise<RepairSubmission> {
  try {
    // Backend will handle report closing and notifications
    const response = await apiPut<RepairSubmission>(
      `/api/submissions/${submissionId}/approve`,
      {
        approval_notes: approvalNotes,
        approved_by: approvedByUserId,
      }
    );
    return response;
  } catch (error) {
    console.error('Error approving repair submission:', error);
    throw error;
  }
}

/**
 * Reject repair submission (wrapper for compatibility with old API)
 * @deprecated Use rejectSubmission instead
 */
export async function rejectRepairSubmission(
  submissionId: string,
  rejectionNotes: string,
  rejectedByUserId: string
): Promise<RepairSubmission> {
  try {
    // Backend will handle report status revert and notifications
    const response = await apiPut<RepairSubmission>(
      `/api/submissions/${submissionId}/reject`,
      {
        rejection_reason: rejectionNotes,
        rejected_by: rejectedByUserId,
      }
    );
    return response;
  } catch (error) {
    console.error('Error rejecting repair submission:', error);
    throw error;
  }
}
