import { create } from 'zustand';

import { apiDelete, apiGet, apiPost, apiPut } from '../services/apiClient';
import { useAuthStore } from './authStore';
import { normalizeLeakageType, normalizeReportType } from '../services/reportTypes';

export type DMAEntityStatus = 'active' | 'inactive';
export type DMAReportStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'closed';
export type DMAReportPriority = 'low' | 'medium' | 'high' | 'critical';
export type DMAEngineerRole = 'engineer' | 'team_leader';

export interface DMAReport {
  id: string;
  trackingId: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string | null;
  photos: string[];
  reportPhotos: string[];
  submissionBeforePhotos: string[];
  submissionAfterPhotos: string[];
  priority: DMAReportPriority;
  reportType: 'leakage' | 'non_leakage';
  leakageType?: 'ground_leakage' | 'pipe_burst' | 'meter_leakage' | 'valve_leakage' | 'overflow' | 'unknown' | null;
  status: DMAReportStatus;
  utilityId: string;
  utilityName: string;
  dmaId: string;
  dmaName: string;
  teamId: string | null;
  teamName: string | null;
  teamLeaderId?: string | null;
  teamLeaderName?: string | null;
  assignedEngineerId: string | null;
  assignedEngineerName: string | null;
  reporterName: string;
  reporterPhone: string;
  notes: string | null;
  engineerSubmissionNotes?: string | null;
  teamLeaderReviewNotes?: string | null;
  dmaReviewNotes?: string | null;
  slaDeadline?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DMAEngineer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dmaId: string;
  dmaName: string;
  teamId: string | null;
  teamName: string | null;
  status: DMAEntityStatus;
  role: DMAEngineerRole;
  assignedReports: number;
  onboardingStatus?: 'completed' | 'pending_setup' | 'expired';
  inviteExpiresAt?: string | null;
  setupCompletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DMATeam {
  id: string;
  name: string;
  description: string | null;
  dmaId: string;
  dmaName: string;
  utilityId?: string | null;
  utilityName?: string | null;
  leaderId: string | null;
  leaderName: string | null;
  leaderEmail?: string | null;
  leaderPhone?: string | null;
  status: DMAEntityStatus;
  memberCount: number;
  activeReports: number;
  engineerIds: string[];
  createdAt: string;
  updatedAt: string;
}

type ReportListResponse = { total?: number; items?: Record<string, unknown>[] };
type EngineerListResponse = { total?: number; items?: Record<string, unknown>[] };
type TeamListResponse = { total?: number; items?: Record<string, unknown>[] };

interface DMAStoreState {
  reports: DMAReport[];
  engineers: DMAEngineer[];
  teams: DMATeam[];
  isLoading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
  reset: () => void;
  fetchReports: () => Promise<void>;
  fetchEngineers: () => Promise<void>;
  fetchTeams: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  fetchReportById: (reportId: string) => Promise<DMAReport | null>;
  assignReport: (reportId: string, teamId: string) => Promise<DMAReport>;
  approveReport: (reportId: string, notes: string) => Promise<DMAReport>;
  rejectReport: (reportId: string, notes: string) => Promise<DMAReport>;
  inviteEngineer: (payload: {
    email: string;
    teamId: string;
    role: DMAEngineerRole;
    status: DMAEntityStatus;
  }) => Promise<void>;
  updateEngineer: (payload: {
    id: string;
    name?: string;
    email: string;
    phone?: string | null;
    teamId?: string | null;
    role: DMAEngineerRole;
    status: DMAEntityStatus;
  }) => Promise<void>;
  deleteEngineer: (engineerId: string) => Promise<void>;
  createTeam: (payload: {
    name: string;
    description?: string | null;
    status: DMAEntityStatus;
  }) => Promise<void>;
  updateTeam: (payload: {
    id: string;
    name: string;
    description?: string | null;
    status: DMAEntityStatus;
  }) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  assignTeamLeader: (teamId: string, engineerId: string) => Promise<void>;
  removeTeamLeader: (teamId: string) => Promise<void>;
}

const normalizeString = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const currentScope = () => {
  const currentUser = useAuthStore.getState().currentUser as Record<string, unknown> | null;
  const dmaId =
    normalizeString(currentUser?.dma_id) ||
    normalizeString(currentUser?.dmaId) ||
    '';
  const utilityId =
    normalizeString(currentUser?.utility_id) ||
    normalizeString(currentUser?.utilityId) ||
    '';
  return { currentUser, dmaId, utilityId };
};

const mapReport = (raw: Record<string, unknown>): DMAReport => ({
  id: String(raw.id || ''),
  trackingId: String(raw.tracking_id || raw.trackingId || raw.id || ''),
  description: String(raw.description || 'No description provided.'),
  latitude: Number(raw.latitude || 0),
  longitude: Number(raw.longitude || 0),
  address: normalizeString(raw.address),
  photos: Array.isArray(raw.photos) ? raw.photos.map(String) : [],
  reportPhotos: Array.isArray(raw.report_photos)
    ? raw.report_photos.map(String)
    : Array.isArray(raw.reportPhotos)
    ? (raw.reportPhotos as unknown[]).map(String)
    : Array.isArray(raw.photos)
    ? raw.photos.map(String)
    : [],
  submissionBeforePhotos: Array.isArray(raw.submission_before_photos)
    ? raw.submission_before_photos.map(String)
    : Array.isArray(raw.submissionBeforePhotos)
    ? (raw.submissionBeforePhotos as unknown[]).map(String)
    : [],
  submissionAfterPhotos: Array.isArray(raw.submission_after_photos)
    ? raw.submission_after_photos.map(String)
    : Array.isArray(raw.submissionAfterPhotos)
    ? (raw.submissionAfterPhotos as unknown[]).map(String)
    : [],
  priority: String(raw.priority || 'medium').toLowerCase() as DMAReportPriority,
  reportType: normalizeReportType(String(raw.report_type || raw.reportType || '')),
  leakageType: normalizeLeakageType(
    String(raw.report_type || raw.reportType || ''),
    normalizeString(raw.leakage_type || raw.leakageType)
  ),
  status: String(raw.status || 'new').toLowerCase() as DMAReportStatus,
  utilityId: String(raw.utility_id || raw.utilityId || ''),
  utilityName: String(raw.utility_name || raw.utilityName || ''),
  dmaId: String(raw.dma_id || raw.dmaId || ''),
  dmaName: String(raw.dma_name || raw.dmaName || ''),
  teamId: normalizeString(raw.team_id || raw.teamId),
  teamName: normalizeString(raw.team_name || raw.teamName),
  teamLeaderId: normalizeString(raw.team_leader_id || raw.teamLeaderId),
  teamLeaderName: normalizeString(raw.team_leader_name || raw.teamLeaderName),
  assignedEngineerId: normalizeString(raw.assigned_engineer_id || raw.assignedEngineerId),
  assignedEngineerName: normalizeString(raw.assigned_engineer_name || raw.assignedEngineerName),
  reporterName: String(raw.reporter_name || raw.reporterName || 'Anonymous'),
  reporterPhone: String(raw.reporter_phone || raw.reporterPhone || 'N/A'),
  notes: normalizeString(raw.notes),
  engineerSubmissionNotes: normalizeString(raw.engineer_submission_notes || raw.engineerSubmissionNotes),
  teamLeaderReviewNotes: normalizeString(raw.team_leader_review_notes || raw.teamLeaderReviewNotes),
  dmaReviewNotes: normalizeString(raw.dma_review_notes || raw.dmaReviewNotes),
  slaDeadline: normalizeString(raw.sla_deadline || raw.slaDeadline),
  resolvedAt: normalizeString(raw.resolved_at || raw.resolvedAt),
  createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
  updatedAt: String(raw.updated_at || raw.updatedAt || raw.created_at || new Date().toISOString()),
});

const mapEngineer = (raw: Record<string, unknown>): DMAEngineer => ({
  id: String(raw.id || ''),
  name: String(raw.name || 'Pending Setup'),
  email: String(raw.email || ''),
  phone: normalizeString(raw.phone),
  dmaId: String(raw.dma_id || raw.dmaId || ''),
  dmaName: String(raw.dma_name || raw.dmaName || ''),
  teamId: normalizeString(raw.team_id || raw.teamId),
  teamName: normalizeString(raw.team_name || raw.teamName),
  status: String(raw.status || 'active').toLowerCase() as DMAEntityStatus,
  role: String(raw.role || 'engineer').toLowerCase() as DMAEngineerRole,
  assignedReports: Number(raw.assigned_reports || raw.assignedReports || 0),
  onboardingStatus:
    (normalizeString(raw.onboarding_status || raw.onboardingStatus) as
      | 'completed'
      | 'pending_setup'
      | 'expired'
      | null) || undefined,
  inviteExpiresAt: normalizeString(raw.invite_expires_at || raw.inviteExpiresAt),
  setupCompletedAt: normalizeString(raw.setup_completed_at || raw.setupCompletedAt),
  createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
  updatedAt: String(raw.updated_at || raw.updatedAt || raw.created_at || new Date().toISOString()),
});

const mapTeam = (raw: Record<string, unknown>): DMATeam => ({
  id: String(raw.id || ''),
  name: String(raw.name || ''),
  description: normalizeString(raw.description),
  dmaId: String(raw.dma_id || raw.dmaId || ''),
  dmaName: String(raw.dma_name || raw.dmaName || ''),
  utilityId: normalizeString(raw.utility_id || raw.utilityId),
  utilityName: normalizeString(raw.utility_name || raw.utilityName),
  leaderId: normalizeString(raw.leader_id || raw.leaderId),
  leaderName: normalizeString(raw.leader_name || raw.leaderName),
  leaderEmail: normalizeString(raw.leader_email || raw.leaderEmail),
  leaderPhone: normalizeString(raw.leader_phone || raw.leaderPhone),
  status: String(raw.status || 'active').toLowerCase() as DMAEntityStatus,
  memberCount: Number(raw.member_count || raw.memberCount || 0),
  activeReports: Number(raw.active_reports || raw.activeReports || 0),
  engineerIds: Array.isArray(raw.engineer_ids)
    ? raw.engineer_ids.map(String)
    : Array.isArray(raw.engineerIds)
    ? (raw.engineerIds as unknown[]).map(String)
    : [],
  createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
  updatedAt: String(raw.updated_at || raw.updatedAt || raw.created_at || new Date().toISOString()),
});

const sortReports = (reports: DMAReport[]) =>
  [...reports].sort((left, right) => {
    const statusWeight: Record<DMAReportStatus, number> = {
      pending_approval: 0,
      new: 1,
      assigned: 2,
      in_progress: 3,
      rejected: 4,
      approved: 5,
      closed: 6,
    };
    const priorityWeight: Record<DMAReportPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    const statusDelta = statusWeight[left.status] - statusWeight[right.status];
    if (statusDelta !== 0) return statusDelta;
    const priorityDelta = priorityWeight[left.priority] - priorityWeight[right.priority];
    if (priorityDelta !== 0) return priorityDelta;
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });

const sortTeams = (teams: DMATeam[]) =>
  [...teams].sort((left, right) => left.name.localeCompare(right.name));

const sortEngineers = (engineers: DMAEngineer[]) =>
  [...engineers].sort((left, right) => left.name.localeCompare(right.name));

export const useDMAStore = create<DMAStoreState>((set, get) => ({
  reports: [],
  engineers: [],
  teams: [],
  isLoading: false,
  refreshing: false,
  error: null,
  lastUpdatedAt: null,

  reset: () => {
    set({
      reports: [],
      engineers: [],
      teams: [],
      isLoading: false,
      refreshing: false,
      error: null,
      lastUpdatedAt: null,
    });
  },

  fetchReports: async () => {
    const { dmaId } = currentScope();
    if (!dmaId) {
      set({ reports: [] });
      return;
    }

    const response = await apiGet<ReportListResponse>(`/api/reports?dma_id=${encodeURIComponent(dmaId)}`);
    const items = Array.isArray(response?.items) ? response.items.map(mapReport) : [];
    set({ reports: sortReports(items) });
  },

  fetchEngineers: async () => {
    const { dmaId } = currentScope();
    if (!dmaId) {
      set({ engineers: [] });
      return;
    }

    const response = await apiGet<EngineerListResponse>(`/api/engineers?dma_id=${encodeURIComponent(dmaId)}`);
    const items = Array.isArray(response?.items) ? response.items.map(mapEngineer) : [];
    set({ engineers: sortEngineers(items) });
  },

  fetchTeams: async () => {
    const { dmaId } = currentScope();
    if (!dmaId) {
      set({ teams: [] });
      return;
    }

    const response = await apiGet<TeamListResponse>(`/api/teams?dma_id=${encodeURIComponent(dmaId)}`);
    const items = Array.isArray(response?.items) ? response.items.map(mapTeam) : [];
    set({ teams: sortTeams(items) });
  },

  refreshAllData: async () => {
    const { dmaId } = currentScope();
    if (!dmaId) {
      get().reset();
      return;
    }

    const firstLoad = get().reports.length === 0 && get().engineers.length === 0 && get().teams.length === 0;
    set(firstLoad ? { isLoading: true, error: null } : { refreshing: true, error: null });
    try {
      await Promise.all([get().fetchReports(), get().fetchEngineers(), get().fetchTeams()]);
      set({
        isLoading: false,
        refreshing: false,
        error: null,
        lastUpdatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      set({
        isLoading: false,
        refreshing: false,
        error: error?.message || 'Unable to refresh DMA data.',
      });
      throw error;
    }
  },

  fetchReportById: async (reportId) => {
    const response = await apiGet<Record<string, unknown>>(`/api/reports/${reportId}`);
    const report = mapReport(response || {});
    set((state) => ({
      reports: sortReports([
        report,
        ...state.reports.filter((existingReport) => existingReport.id !== report.id),
      ]),
    }));
    return report;
  },

  assignReport: async (reportId, teamId) => {
    const response = await apiPut<Record<string, unknown>>(`/api/reports/${reportId}/assign`, {
      team_id: teamId,
    });
    const report = mapReport(response || {});
    set((state) => ({
      reports: sortReports([
        report,
        ...state.reports.filter((existingReport) => existingReport.id !== report.id),
      ]),
    }));
    await Promise.all([get().fetchTeams(), get().fetchEngineers()]);
    return report;
  },

  approveReport: async (reportId, notes) => {
    const response = await apiPost<Record<string, unknown>>(`/api/reports/${reportId}/approve`, {
      notes,
    });
    const report = mapReport(response || {});
    set((state) => ({
      reports: sortReports([
        report,
        ...state.reports.filter((existingReport) => existingReport.id !== report.id),
      ]),
    }));
    await get().fetchTeams();
    return report;
  },

  rejectReport: async (reportId, notes) => {
    const response = await apiPost<Record<string, unknown>>(`/api/reports/${reportId}/reject`, {
      notes,
    });
    const report = mapReport(response || {});
    set((state) => ({
      reports: sortReports([
        report,
        ...state.reports.filter((existingReport) => existingReport.id !== report.id),
      ]),
    }));
    await get().fetchTeams();
    return report;
  },

  inviteEngineer: async ({ email, teamId, role, status }) => {
    await apiPost('/api/engineers/invitations', {
      email: email.trim().toLowerCase(),
      team_id: teamId,
      role,
      status,
    });
    await Promise.all([get().fetchEngineers(), get().fetchTeams()]);
  },

  updateEngineer: async ({ id, name, email, phone, teamId, role, status }) => {
    await apiPut('/api/engineers', {
      id,
      name,
      email: email.trim().toLowerCase(),
      phone: phone || null,
      team_id: teamId ?? '',
      role,
      status,
    });
    await Promise.all([get().fetchEngineers(), get().fetchTeams(), get().fetchReports()]);
  },

  deleteEngineer: async (engineerId) => {
    await apiDelete('/api/engineers', { params: { id: engineerId } });
    await Promise.all([get().fetchEngineers(), get().fetchTeams(), get().fetchReports()]);
  },

  createTeam: async ({ name, description, status }) => {
    const { dmaId } = currentScope();
    if (!dmaId) {
      throw new Error('DMA is not available for the signed-in user.');
    }

    await apiPost('/api/teams', {
      name: name.trim(),
      description: description?.trim() || null,
      dma_id: dmaId,
      status,
    });
    await get().fetchTeams();
  },

  updateTeam: async ({ id, name, description, status }) => {
    await apiPut(`/api/teams/${id}`, {
      name: name.trim(),
      description: description?.trim() || null,
      status,
    });
    await get().fetchTeams();
  },

  deleteTeam: async (teamId) => {
    await apiDelete(`/api/teams/${teamId}`);
    await Promise.all([get().fetchTeams(), get().fetchEngineers(), get().fetchReports()]);
  },

  assignTeamLeader: async (teamId, engineerId) => {
    await apiPut(`/api/teams/${teamId}/leader`, { engineerId });
    await Promise.all([get().fetchTeams(), get().fetchEngineers(), get().fetchReports()]);
  },

  removeTeamLeader: async (teamId) => {
    await apiDelete(`/api/teams/${teamId}/leader`);
    await Promise.all([get().fetchTeams(), get().fetchEngineers(), get().fetchReports()]);
  },
}));
