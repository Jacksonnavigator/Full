export type ReportType = 'leakage' | 'non_leakage';

export type LeakageType =
  | 'ground_leakage'
  | 'pipe_burst'
  | 'meter_leakage'
  | 'valve_leakage'
  | 'overflow'
  | 'unknown';

export type ReportStatus =
  | 'New'
  | 'Assigned'
  | 'InProgress'
  | 'RepairSubmitted'
  | 'Approved'
  | 'Rejected'
  | 'Closed';

export interface LeakageReport {
  id: string;
  utilityId: string;
  dmaId: string;
  status: ReportStatus;
  priority: string;
  reportType: ReportType;
  leakageType?: LeakageType | null;
  /** @deprecated Use reportType and leakageType instead */
  type: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images: {
    url: string;
    storagePath: string;
    uploadedAt?: string;
  }[];
  reportedBy: 'Anonymous' | string;
  assignedTeamId?: string;
  assignedTeamLeaderId?: string;
  trackingId: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface RepairSubmission {
  id: string;
  reportId: string;
  teamLeaderId: string;
  teamId: string;
  submittedAt: string;
  submittedBy: string;
  beforeImages: {
    url: string;
    storagePath: string;
  }[];
  afterImages: {
    url: string;
    storagePath: string;
  }[];
  repairNotes: string;
  materialsUsed: string[];
  estimatedCost?: number;
  actualCost?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface SubmitLeakageReportParams {
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  priority: string;
  imageUrls: string[];
  reportType?: ReportType;
  leakageType?: LeakageType | null;
  reportedByUserId?: string;
  requiresAuth?: boolean;
  dmaId?: string;
  address?: string;
  reporterPhone?: string;
  trackingId?: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  priority?: string;
  report_type?: ReportType;
  utility_id?: string;
  dma_id?: string;
  skip?: number;
  limit?: number;
}

const LEAKAGE_TYPE_LABELS: Record<LeakageType, string> = {
  ground_leakage: 'Ground Leakage',
  pipe_burst: 'Pipe Burst',
  meter_leakage: 'Meter Leakage',
  valve_leakage: 'Valve Leakage',
  overflow: 'Overflow',
  unknown: "I don't know",
};

export function getReportTypeLabel(type?: ReportType | string | null): string {
  return type === 'non_leakage' ? 'Non-leakage' : 'Leakage';
}

export function getLeakageTypeLabel(type?: LeakageType | string | null): string {
  if (!type) return 'Not applicable';
  return LEAKAGE_TYPE_LABELS[type as LeakageType] || "I don't know";
}

export function isLeakageReport(type?: ReportType | string | null): boolean {
  return type !== 'non_leakage';
}

export function normalizeReportType(value?: string | null): ReportType {
  return value === 'non_leakage' ? 'non_leakage' : 'leakage';
}

export function normalizeLeakageType(
  reportType: ReportType | string | null | undefined,
  value?: string | null
): LeakageType | null {
  if (reportType === 'non_leakage') {
    return null;
  }
  if (value && value in LEAKAGE_TYPE_LABELS) {
    return value as LeakageType;
  }
  return 'unknown';
}
