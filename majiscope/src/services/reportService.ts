/**
 * Shared report service helpers aligned to the live backend workflow.
 */

import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';
import {
  LeakageReport,
  RepairSubmission,
  ReportFilters,
  ReportStatus,
  SubmitLeakageReportParams,
  normalizeLeakageType,
  normalizeReportType,
} from './reportTypes';

type BackendReport = {
  id: string;
  tracking_id: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  address?: string | null;
  report_photos?: string[];
  submission_before_photos?: string[];
  submission_after_photos?: string[];
  photos?: string[];
  report_type?: string;
  leakage_type?: string | null;
  priority?: string;
  status?: string;
  utility_id?: string;
  dma_id?: string | null;
  team_id?: string | null;
  team_leader_id?: string | null;
  assigned_engineer_id?: string | null;
  reporter_name?: string;
  reporter_phone?: string;
  notes?: string | null;
  engineer_submission_notes?: string | null;
  team_leader_review_notes?: string | null;
  dma_review_notes?: string | null;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
};

type ReportListResponse = {
  total: number;
  items: BackendReport[];
};

const mapPriorityForBackend = (priority: string) => {
  const normalized = priority.trim().toLowerCase();
  switch (normalized) {
    case 'critical':
      return 'Critical';
    case 'high':
    case 'urgent':
      return 'High';
    case 'low':
      return 'Low';
    default:
      return 'Medium';
  }
};

const mapBackendStatus = (status?: string | null): ReportStatus => {
  switch ((status || '').toLowerCase()) {
    case 'assigned':
      return 'Assigned';
    case 'in_progress':
      return 'InProgress';
    case 'pending_approval':
      return 'RepairSubmitted';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'closed':
      return 'Closed';
    default:
      return 'New';
  }
};

const toBackendStatusFilter = (status?: ReportStatus) => {
  switch (status) {
    case 'Assigned':
      return 'assigned';
    case 'InProgress':
      return 'in_progress';
    case 'RepairSubmitted':
      return 'pending_approval';
    case 'Approved':
      return 'approved';
    case 'Rejected':
      return 'rejected';
    case 'Closed':
      return 'closed';
    case 'New':
      return 'new';
    default:
      return undefined;
  }
};

const toLeakageReport = (report: BackendReport): LeakageReport => {
  const reportType = normalizeReportType(report.report_type);
  const leakageType = normalizeLeakageType(reportType, report.leakage_type);

  return {
  id: report.id,
  utilityId: report.utility_id || '',
  dmaId: report.dma_id || '',
  status: mapBackendStatus(report.status),
  priority: report.priority || 'Medium',
  reportType,
  leakageType,
  type: reportType === 'non_leakage' ? 'Non-leakage' : 'Leakage',
  description: report.description || '',
  location: {
    latitude: Number(report.latitude ?? 0),
    longitude: Number(report.longitude ?? 0),
    address: report.address || undefined,
  },
  images: (report.report_photos || report.photos || []).map((url) => ({
    url,
    storagePath: url,
    uploadedAt: report.updated_at,
  })),
  reportedBy: report.reporter_name || 'Anonymous',
  assignedTeamId: report.team_id || undefined,
  assignedTeamLeaderId: report.team_leader_id || undefined,
  trackingId: report.tracking_id,
  createdAt: report.created_at || new Date().toISOString(),
  updatedAt: report.updated_at || report.created_at || new Date().toISOString(),
  closedAt: report.resolved_at || undefined,
  };
};

const toRepairSubmission = (report: BackendReport): RepairSubmission => ({
  id: report.id,
  reportId: report.id,
  teamLeaderId: report.team_leader_id || '',
  teamId: report.team_id || '',
  submittedAt: report.updated_at || report.created_at || new Date().toISOString(),
  submittedBy: report.assigned_engineer_id || report.reporter_name || 'Engineer',
  beforeImages: (report.submission_before_photos || []).map((url) => ({ url, storagePath: url })),
  afterImages: (report.submission_after_photos || []).map((url) => ({ url, storagePath: url })),
  repairNotes: report.engineer_submission_notes || report.notes || '',
  materialsUsed: [],
  status:
    (report.status || '').toLowerCase() === 'approved' || (report.status || '').toLowerCase() === 'closed'
      ? 'Approved'
      : (report.status || '').toLowerCase() === 'assigned'
      ? 'Rejected'
      : 'Pending',
  approvalNotes: report.dma_review_notes || report.team_leader_review_notes || undefined,
  approvedBy: report.dma_review_notes ? 'DMA Manager' : report.team_leader_review_notes ? 'Team Leader' : undefined,
  approvedAt: report.resolved_at || undefined,
});

const normalizeList = (response: ReportListResponse | BackendReport[]): BackendReport[] => {
  if (Array.isArray(response)) {
    return response;
  }
  return response.items || [];
};

const createTrackingId = () =>
  `REP-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export async function submitLeakageReport(params: SubmitLeakageReportParams): Promise<LeakageReport> {
  const dmaId = params.dmaId;

  if ((params.requiresAuth ?? true) && dmaId) {
    const backendReport = await apiPost<BackendReport>(
      '/api/reports',
      {
        tracking_id: params.trackingId || createTrackingId(),
        dma_id: dmaId,
        description: params.description,
        latitude: params.location.latitude,
        longitude: params.location.longitude,
        address: params.address || params.location.address,
        priority: mapPriorityForBackend(params.priority),
        photos: params.imageUrls,
        reporter_name: params.reportedByUserId || 'Authenticated User',
        reporter_phone: params.reporterPhone,
      },
      { requiresAuth: true }
    );
    return toLeakageReport(backendReport);
  }

  const backendReport = await apiPost<BackendReport>(
    '/api/reports/anonymous',
    {
      description: params.description,
      latitude: params.location.latitude,
      longitude: params.location.longitude,
      address: params.address || params.location.address,
      priority: mapPriorityForBackend(params.priority),
      images: params.imageUrls,
      reported_by: params.reportedByUserId || 'Anonymous',
    },
    { requiresAuth: false }
  );
  return toLeakageReport(backendReport);
}

export async function getReports(filters?: ReportFilters): Promise<LeakageReport[]> {
  const response = await apiGet<ReportListResponse>('/api/reports', {
    params: {
      ...filters,
      status: toBackendStatusFilter(filters?.status),
      report_type: filters?.report_type,
    },
  });

  return normalizeList(response).map(toLeakageReport);
}

export async function getReportById(reportId: string): Promise<LeakageReport> {
  const response = await apiGet<BackendReport>(`/api/reports/${reportId}`);
  return toLeakageReport(response);
}

export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  notes?: string
): Promise<LeakageReport> {
  const backendStatus =
    newStatus === 'Assigned'
      ? 'assigned'
      : newStatus === 'InProgress'
      ? 'in_progress'
      : newStatus === 'RepairSubmitted'
      ? 'pending_approval'
      : newStatus === 'Approved'
      ? 'approved'
      : newStatus === 'Rejected'
      ? 'rejected'
      : newStatus === 'Closed'
      ? 'closed'
      : 'new';

  const response = await apiPost<BackendReport>(`/api/reports/${reportId}/status`, {
    status: backendStatus,
    notes,
  });

  return toLeakageReport(response);
}

export async function assignReport(
  reportId: string,
  assignTo: {
    team_id?: string;
    engineer_id?: string;
  },
  notes?: string
): Promise<LeakageReport> {
  if (assignTo.team_id) {
    const response = await apiPut<BackendReport>(`/api/reports/${reportId}/assign`, {
      team_id: assignTo.team_id,
      notes,
    });
    return toLeakageReport(response);
  }

  const response = await apiPut<BackendReport>(`/api/reports/${reportId}`, {
    assigned_engineer_id: assignTo.engineer_id,
    notes,
  });
  return toLeakageReport(response);
}

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
  const photos = [
    ...(submissionData.before_photos || []),
    ...(submissionData.after_photos || []),
  ];

  if (photos.length > 0) {
    await apiPut<BackendReport>(`/api/reports/${reportId}`, {
      photos,
    });
  }

  const report = await apiPost<BackendReport>(`/api/reports/${reportId}/status`, {
    status: 'pending_approval',
    notes: submissionData.notes || submissionData.description,
  });

  return toRepairSubmission({
    ...report,
    submission_before_photos: submissionData.before_photos || report.submission_before_photos,
    submission_after_photos: submissionData.after_photos || report.submission_after_photos,
  });
}

export async function getReportSubmissions(reportId: string): Promise<RepairSubmission[]> {
  const report = await apiGet<BackendReport>(`/api/reports/${reportId}`);
  const hasSubmission =
    Boolean(report.engineer_submission_notes) ||
    (report.submission_before_photos?.length ?? 0) > 0 ||
    (report.submission_after_photos?.length ?? 0) > 0 ||
    ['pending_approval', 'approved', 'closed'].includes((report.status || '').toLowerCase());

  return hasSubmission ? [toRepairSubmission(report)] : [];
}

export async function approveSubmission(
  reportId: string,
  submissionId: string,
  notes?: string
): Promise<RepairSubmission> {
  const response = await apiPost<BackendReport>(`/api/reports/${reportId}/approve`, {
    notes,
  });

  return toRepairSubmission(response);
}

export async function rejectSubmission(
  reportId: string,
  submissionId: string,
  reason: string
): Promise<RepairSubmission> {
  const response = await apiPost<BackendReport>(`/api/reports/${reportId}/reject`, {
    notes: reason,
  });

  return toRepairSubmission(response);
}

export async function closeReport(
  reportId: string,
  notes?: string
): Promise<LeakageReport> {
  const response = await apiPost<BackendReport>(`/api/reports/${reportId}/approve`, {
    notes,
  });
  return toLeakageReport(response);
}

export async function deleteReport(reportId: string): Promise<void> {
  await apiDelete(`/api/reports/${reportId}`);
}

/**
 * Backward-compatible wrapper where older callers pass `submissionId`.
 * The live backend now treats the report itself as the review target.
 */
export async function approveRepairSubmission(
  submissionId: string,
  approvalNotes: string,
  approvedByUserId: string
): Promise<RepairSubmission> {
  const response = await apiPost<BackendReport>(`/api/reports/${submissionId}/approve`, {
    notes: approvalNotes,
  });
  return toRepairSubmission(response);
}

/**
 * Backward-compatible wrapper where older callers pass `submissionId`.
 * The live backend now treats the report itself as the review target.
 */
export async function rejectRepairSubmission(
  submissionId: string,
  rejectionNotes: string,
  rejectedByUserId: string
): Promise<RepairSubmission> {
  const response = await apiPost<BackendReport>(`/api/reports/${submissionId}/reject`, {
    notes: rejectionNotes,
  });
  return toRepairSubmission(response);
}
