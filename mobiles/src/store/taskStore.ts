import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { Task, TaskStatus, TaskTimelineEntry } from '../types/task';
import { apiGet, apiPost, apiPut } from '../services/apiClient';
import { getEndpointUrl } from '../services/backendConfig';
import { uploadImages } from '../services/imageUploadService';
import { getSlaState } from '../utils/sla';

export type UserRole = 'Engineer' | 'Team Leader';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  team?: string;
  teamId?: string;
  dmaName?: string;
  dmaId?: string;
}

export type OfflineUpdateType =
  | 'STATUS_CHANGE'
  | 'ENGINEER_SUBMISSION'
  | 'LEADER_APPROVE'
  | 'LEADER_REJECT'
  | 'LEADER_DIRECT_RESOLVE';

export interface QueuedUpdate {
  id: string;
  taskId: string;
  type: OfflineUpdateType;
  payload: any;
  createdAt: string;
}

interface TaskStoreState {
  currentUser?: User | null;
  tasks: Task[];
  isOffline: boolean;
  offlineQueue: QueuedUpdate[];
  _hasHydrated: boolean;
  setHasHydrated: () => void;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  setOffline: (offline: boolean) => void;
  fetchTasks: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  startTaskAsEngineer: (taskId: string) => Promise<void>;
  submitEngineerReport: (params: {
    taskId: string;
    notes: string;
    materials: string[];
    beforePhotos: string[];
    afterPhotos: string[];
  }) => Promise<void>;
  assignEngineer: (taskId: string, engineerName: string) => void;
  startTaskAsLeader: (taskId: string) => Promise<void>;
  leaderApprove: (taskId: string, note?: string) => Promise<void>;
  leaderReject: (taskId: string, reason: string) => Promise<void>;
  leaderDirectResolve: (params: {
    taskId: string;
    notes: string;
    photos: string[];
  }) => Promise<void>;
  syncOfflineQueue: () => Promise<{ processed: number; failed: number }>;
  clearOfflineQueue: () => void;
}

type BackendReport = {
  id: string;
  tracking_id?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  priority?: string;
  status?: string;
  dma_id?: string;
  dma_name?: string;
  reporter_name?: string;
  reporter_phone?: string;
  team_id?: string;
  team_name?: string;
  assigned_engineer_id?: string;
  assigned_engineer_name?: string;
  photos?: string[];
  report_photos?: string[];
  submission_before_photos?: string[];
  submission_after_photos?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
  sla_deadline?: string;
};

const getNetworkAvailable = async () => {
  try {
    const state = await Network.getNetworkStateAsync();
    return Boolean(state.isConnected && (state.isInternetReachable ?? true));
  } catch (error) {
    console.warn('Unable to determine network state:', error);
    return false;
  }
};

const isUploadedPhoto = (photo: string) =>
  photo.startsWith('http://') ||
  photo.startsWith('https://') ||
  photo.startsWith('/api/uploads/');

const normalizeReportPhotoUrl = (photo: string) => {
  if (!photo) return photo;
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  if (photo.startsWith('/')) {
    return getEndpointUrl(photo);
  }
  return photo;
};

const shouldUseBackendPhotos = (existingPhotos: string[] | undefined, backendPhotos: string[] | undefined) =>
  Boolean(
    (backendPhotos?.length ?? 0) > 0 &&
      ((existingPhotos?.length ?? 0) === 0 ||
        (existingPhotos ?? []).every((photo) => !isUploadedPhoto(photo)))
  );

const looksLikeLeaderApprovalNote = (notes?: string | null) => {
  const normalized = (notes || '').toLowerCase();
  return (
    normalized.includes('approved and sent for dma review') ||
    normalized.includes('approved by team leader') ||
    normalized.includes('resolved directly by team leader')
  );
};

const mapBackendStatusToTaskStatus = (
  status?: string,
  existingTask?: Task,
  currentUserRole?: UserRole,
  notes?: string | null
): TaskStatus => {
  switch ((status || '').toLowerCase()) {
    case 'assigned':
      return existingTask?.status === 'Rejected by Team Leader'
        ? 'Rejected by Team Leader'
        : 'Assigned';
    case 'in_progress':
      return existingTask?.status === 'In Progress (Leader)' ? 'In Progress (Leader)' : 'In Progress';
    case 'pending_approval':
      return existingTask?.status === 'Approved by Team Leader' || looksLikeLeaderApprovalNote(notes)
        ? 'Approved by Team Leader'
        : 'Submitted by Engineer';
    case 'approved':
      return 'Closed by Manager';
    case 'closed':
      return 'Closed';
    case 'rejected':
      return existingTask?.status === 'Rejected by Team Leader'
        ? 'Rejected by Team Leader'
        : 'Rejected';
    default:
      return 'New';
  }
};

const toBackendStatus = (status: TaskStatus): string => {
  switch (status) {
    case 'Assigned':
    case 'Rejected by Team Leader':
      return 'assigned';
    case 'In Progress':
    case 'In Progress (Leader)':
      return 'in_progress';
    case 'Submitted by Engineer':
    case 'Pending Approval':
    case 'Approved by Team Leader':
      return 'pending_approval';
    case 'Rejected':
      return 'rejected';
    case 'Closed':
    case 'Closed by Manager':
    case 'Approved':
      return 'approved';
    case 'New':
    default:
      return 'new';
  }
};

const mapPriority = (priority?: string): Task['priority'] => {
  switch ((priority || '').toLowerCase()) {
    case 'low':
      return 'Low';
    case 'high':
      return 'High';
    case 'critical':
      return 'Critical';
    default:
      return 'Medium';
  }
};

const toTaskTitle = (report: BackendReport): string => {
  const preferred = report.address?.trim() || report.dma_name?.trim() || report.tracking_id?.trim();
  if (preferred) return preferred;
  if (report.description?.trim()) return report.description.trim().slice(0, 48);
  return 'Leakage Report';
};

const uniquePhotos = (...groups: Array<string[] | undefined>) =>
  Array.from(
    new Set(
      groups.flatMap((group) => group ?? []).filter((item): item is string => Boolean(item))
    )
  );

const sortTimeline = (timeline: TaskTimelineEntry[]) =>
  [...timeline].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

const ensureTimelineStatus = (
  existing: TaskTimelineEntry[],
  status: TaskStatus,
  timestamp: string,
  note?: string,
  actorRole: TaskTimelineEntry['actorRole'] = 'System',
  actorName: string = 'HydraNet'
) => {
  const found = existing.find((entry) => entry.status === status);
  if (found) {
    return sortTimeline(existing);
  }

  return sortTimeline([
    ...existing,
    {
      status,
      timestamp,
      note,
      actorRole,
      actorName,
    },
  ]);
};

const upsertTimelineStatus = (
  existing: TaskTimelineEntry[],
  status: TaskStatus,
  timestamp: string,
  note?: string,
  actorRole: TaskTimelineEntry['actorRole'] = 'System',
  actorName: string = 'HydraNet'
) => {
  const timeline = [...existing];
  const lastEntry = timeline[timeline.length - 1];

  if (!lastEntry || lastEntry.status !== status || lastEntry.note !== note) {
    timeline.push({
      status,
      timestamp,
      note,
      actorRole,
      actorName,
    });
  }

  return sortTimeline(timeline);
};

const inferTimelineActor = (
  status: TaskStatus,
  report: BackendReport,
  existingTask?: Task
): Pick<TaskTimelineEntry, 'actorRole' | 'actorName'> => {
  switch (status) {
    case 'Assigned':
      return {
        actorRole: 'Manager',
        actorName: existingTask?.dmaName || report.dma_name || 'Operations Desk',
      };
    case 'In Progress':
    case 'Submitted by Engineer':
    case 'Rejected':
      return {
        actorRole: 'Engineer',
        actorName:
          existingTask?.assignedEngineer ||
          report.assigned_engineer_name ||
          existingTask?.assignee ||
          'Engineer',
      };
    case 'In Progress (Leader)':
    case 'Approved by Team Leader':
    case 'Rejected by Team Leader':
      return {
        actorRole: 'Team Leader',
        actorName: existingTask?.teamLeader || report.team_name || 'Team Leader',
      };
    case 'Closed':
    case 'Closed by Manager':
      return {
        actorRole: 'Manager',
        actorName: existingTask?.dmaName || report.dma_name || 'Operations Desk',
      };
    default:
      return {
        actorRole: 'System',
        actorName: report.reporter_name || 'HydraNet',
      };
  }
};

const buildTaskFromReport = (
  report: BackendReport,
  existingTask?: Task,
  currentUserRole?: UserRole
): Task => {
  const status = mapBackendStatusToTaskStatus(report.status, existingTask, currentUserRole, report.notes);
  const createdAt = report.created_at || existingTask?.createdAt || new Date().toISOString();
  const timestamp = report.updated_at || createdAt;
  const normalizedReportPhotos = (report.report_photos ?? report.photos ?? []).map(normalizeReportPhotoUrl);
  const normalizedBeforePhotos = (report.submission_before_photos ?? []).map(normalizeReportPhotoUrl);
  const normalizedAfterPhotos = (report.submission_after_photos ?? []).map(normalizeReportPhotoUrl);
  const shouldReplaceReporterPhotos = shouldUseBackendPhotos(existingTask?.reporterPhotos, normalizedReportPhotos);
  const shouldReplaceBeforePhotos = shouldUseBackendPhotos(existingTask?.beforePhotos, normalizedBeforePhotos);
  const shouldReplaceAfterPhotos = shouldUseBackendPhotos(existingTask?.afterPhotos, normalizedAfterPhotos);
  const backendProvidesSeparatedReportPhotos = report.report_photos !== undefined;
  const backendProvidesBeforePhotos = report.submission_before_photos !== undefined;
  const backendProvidesAfterPhotos = report.submission_after_photos !== undefined;
  const reporterPhotos =
    backendProvidesSeparatedReportPhotos
      ? normalizedReportPhotos
      : shouldReplaceReporterPhotos
      ? normalizedReportPhotos
      : existingTask?.reporterPhotos?.length
      ? existingTask.reporterPhotos
      : ['new', 'assigned', 'in_progress'].includes((report.status || '').toLowerCase())
      ? normalizedReportPhotos
      : [];
  const beforePhotos =
    backendProvidesBeforePhotos
      ? normalizedBeforePhotos
      : shouldReplaceBeforePhotos
      ? normalizedBeforePhotos
      : existingTask?.beforePhotos ?? [];
  const afterPhotos =
    backendProvidesAfterPhotos
      ? normalizedAfterPhotos
      : shouldReplaceAfterPhotos
      ? normalizedAfterPhotos
      : existingTask?.afterPhotos ?? [];
  const photos = uniquePhotos(reporterPhotos, beforePhotos, afterPhotos, existingTask?.photos);
  const engineerReport =
    existingTask?.engineerReport ||
    report.notes ||
    afterPhotos.length > 0
      ? {
          notes: report.notes || existingTask?.engineerReport?.notes || '',
          materials: existingTask?.materials ?? [],
          beforePhotos,
          afterPhotos,
          submittedAt:
            existingTask?.engineerReport?.submittedAt || report.updated_at || report.created_at || timestamp,
        }
      : undefined;
  const actor = inferTimelineActor(status, report, existingTask);
  let timeline = existingTask?.timeline ?? [];
  timeline = ensureTimelineStatus(timeline, 'New', createdAt, 'Leak report created.');
  if (
    (report.team_name || report.assigned_engineer_name || existingTask?.assignedEngineer) &&
    status !== 'New'
  ) {
    timeline = ensureTimelineStatus(
      timeline,
      'Assigned',
      existingTask?.createdAt || createdAt,
      report.assigned_engineer_name
        ? `Assigned to ${report.assigned_engineer_name}.`
        : 'Assigned to field team.',
      'Manager',
      report.dma_name || existingTask?.dmaName || 'Operations Desk'
    );
  }
  timeline = upsertTimelineStatus(
    timeline,
    status,
    timestamp,
    report.notes || existingTask?.notes,
    actor.actorRole,
    actor.actorName
  );

  return {
    id: report.id,
    trackingId: report.tracking_id || existingTask?.trackingId || report.id,
    title: toTaskTitle(report),
    status,
    backendStatus: report.status || existingTask?.backendStatus || toBackendStatus(status),
    priority: mapPriority(report.priority),
    description: report.description || existingTask?.description || 'No description provided.',
    latitude: report.latitude ?? existingTask?.latitude ?? 0,
    longitude: report.longitude ?? existingTask?.longitude ?? 0,
    address: report.address || existingTask?.address,
    location: {
      latitude: report.latitude ?? existingTask?.latitude ?? 0,
      longitude: report.longitude ?? existingTask?.longitude ?? 0,
      address: report.address || existingTask?.address,
    },
    assignedTeam: report.team_name || existingTask?.assignedTeam || 'Unassigned',
    teamId: report.team_id || existingTask?.teamId,
    teamLeader: existingTask?.teamLeader || report.team_name || 'Team Lead',
    assignedEngineer: report.assigned_engineer_name || existingTask?.assignedEngineer || 'Unassigned',
    assignedEngineerId: report.assigned_engineer_id || existingTask?.assignedEngineerId,
    assignee: report.assigned_engineer_name || existingTask?.assignee,
    dmaId: report.dma_id || existingTask?.dmaId,
    dmaName: report.dma_name || existingTask?.dmaName,
    reporterPhotos,
    photos,
    materials: existingTask?.materials ?? [],
    beforePhotos,
    afterPhotos,
    engineerReport,
    leaderResolution: existingTask?.leaderResolution,
    timeline,
    notes: report.notes || existingTask?.notes,
    createdAt,
    updatedAt: report.updated_at || existingTask?.updatedAt,
    slaDeadline: report.sla_deadline || existingTask?.slaDeadline,
  };
};

const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
  'Submitted by Engineer': 0,
  'Approved by Team Leader': 1,
  'Rejected by Team Leader': 2,
  'In Progress': 3,
  'In Progress (Leader)': 3,
  Assigned: 4,
  New: 5,
  Rejected: 6,
  'Pending Approval': 6,
  Approved: 7,
  'Closed by Manager': 8,
  Closed: 9,
};

const TASK_PRIORITY_ORDER: Record<Task['priority'], number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

const sortTasks = (tasks: Task[]) =>
  [...tasks].sort((a, b) => {
    const slaOrder: Record<string, number> = {
      critical_overdue: 0,
      overdue: 1,
      due_soon: 2,
      on_track: 3,
      resolved: 4,
      unknown: 5,
    };
    const slaDelta = (slaOrder[getSlaState(a)] ?? 99) - (slaOrder[getSlaState(b)] ?? 99);
    if (slaDelta !== 0) return slaDelta;

    const statusDelta = (TASK_STATUS_ORDER[a.status] ?? 99) - (TASK_STATUS_ORDER[b.status] ?? 99);
    if (statusDelta !== 0) return statusDelta;

    const priorityDelta =
      (TASK_PRIORITY_ORDER[a.priority] ?? 99) - (TASK_PRIORITY_ORDER[b.priority] ?? 99);
    if (priorityDelta !== 0) return priorityDelta;

    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => {
      const updateTask = (taskId: string, updater: (task: Task) => Task) => {
        const updatedTasks = get().tasks.map((task) => (task.id === taskId ? updater(task) : task));
        set({ tasks: sortTasks(updatedTasks) });
      };

      const queueOffline = (update: Omit<QueuedUpdate, 'id'>) => {
        set((state) => ({
          offlineQueue: [
            ...state.offlineQueue,
            {
              ...update,
              id: `queued-${Date.now()}`,
            },
          ],
        }));
      };

      const shouldQueueUpdate = async () => get().isOffline || !(await getNetworkAvailable());

      const syncStatus = async (taskId: string, status: string, notes?: string) => {
        await apiPost(`/api/reports/${taskId}/status`, { status, notes });
      };

      const syncReport = async (taskId: string, payload: Record<string, any>) => {
        await apiPut(`/api/reports/${taskId}`, payload);
      };

      const syncTaskPhotos = async (
        taskId: string,
        params: {
          beforePhotos?: string[];
          afterPhotos?: string[];
          photos?: string[];
        }
      ) => {
        const uploadGroup = async (
          photos: string[] | undefined,
          imageType: 'submission_before' | 'submission_after'
        ) => {
          const sourcePhotos = photos ?? [];
          const remotePhotos = sourcePhotos.filter(isUploadedPhoto);
          const localPhotos = sourcePhotos.filter((photo) => !isUploadedPhoto(photo));

          if (localPhotos.length === 0) {
            return remotePhotos;
          }

          const uploaded = await uploadImages(localPhotos, imageType, taskId);
          return uniquePhotos(remotePhotos, uploaded.map((image) => image.downloadUrl));
        };

        const beforePhotos = await uploadGroup(params.beforePhotos, 'submission_before');
        const afterSource =
          params.afterPhotos ?? (params.photos && params.photos.length > 0 ? params.photos : []);
        const afterPhotos = await uploadGroup(afterSource, 'submission_after');

        return {
          beforePhotos,
          afterPhotos,
          combinedPhotos: uniquePhotos(beforePhotos, afterPhotos),
        };
      };

      const applySyncedEngineerSubmission = (
        taskId: string,
        payload: {
          notes: string;
          materials: string[];
          beforePhotos: string[];
          afterPhotos: string[];
        }
      ) => {
        updateTask(taskId, (task) => ({
          ...task,
          beforePhotos: payload.beforePhotos,
          afterPhotos: payload.afterPhotos,
          photos: payload.afterPhotos.length > 0 ? uniquePhotos(payload.beforePhotos, payload.afterPhotos) : task.photos,
          engineerReport: {
            notes: payload.notes,
            materials: payload.materials,
            beforePhotos: payload.beforePhotos,
            afterPhotos: payload.afterPhotos,
            submittedAt: task.engineerReport?.submittedAt || new Date().toISOString(),
          },
        }));
      };

      const applySyncedLeaderResolution = (
        taskId: string,
        payload: {
          notes: string;
          photos: string[];
        }
      ) => {
        updateTask(taskId, (task) => ({
          ...task,
          photos: payload.photos.length > 0 ? payload.photos : task.photos,
          leaderResolution: task.leaderResolution
            ? {
                ...task.leaderResolution,
                notes: payload.notes,
                photos: payload.photos,
              }
            : {
                resolvedByLeader: true,
                notes: payload.notes,
                photos: payload.photos,
                createdAt: new Date().toISOString(),
              },
        }));
      };

      const syncQueuedUpdate = async (update: QueuedUpdate) => {
        switch (update.type) {
          case 'STATUS_CHANGE':
            await syncStatus(update.taskId, update.payload.status, update.payload.notes);
            return;
          case 'ENGINEER_SUBMISSION': {
            const uploadedPhotos = await syncTaskPhotos(update.taskId, {
              beforePhotos: update.payload.beforePhotos,
              afterPhotos: update.payload.afterPhotos,
            });
            applySyncedEngineerSubmission(update.taskId, {
              notes: update.payload.notes,
              materials: update.payload.materials ?? [],
              beforePhotos: uploadedPhotos.beforePhotos,
              afterPhotos: uploadedPhotos.afterPhotos,
            });
            await syncReport(update.taskId, {
              status: 'pending_approval',
              notes: update.payload.notes,
            });
            return;
          }
          case 'LEADER_APPROVE':
            await syncStatus(
              update.taskId,
              'pending_approval',
              update.payload.note ?? 'Approved and sent for DMA review.'
            );
            return;
          case 'LEADER_REJECT':
            await syncStatus(update.taskId, 'assigned', update.payload.reason);
            return;
          case 'LEADER_DIRECT_RESOLVE': {
            const uploadedPhotos = await syncTaskPhotos(update.taskId, {
              photos: update.payload.photos,
            });
            applySyncedLeaderResolution(update.taskId, {
              notes: update.payload.notes,
              photos: uploadedPhotos.afterPhotos,
            });
            await syncReport(update.taskId, {
              status: 'pending_approval',
              notes: update.payload.notes,
            });
            return;
          }
          default:
            return;
        }
      };

      const refreshSingleTask = async (taskId: string) => {
        try {
          const report = await apiGet<BackendReport>(`/api/reports/${taskId}`);
          const existingTask = get().tasks.find((task) => task.id === taskId);
          if (!existingTask || !report) return;
          updateTask(taskId, () => buildTaskFromReport(report, existingTask, get().currentUser?.role));
        } catch (error) {
          console.warn('Unable to refresh task after update:', error);
        }
      };

      return {
        currentUser: undefined,
        tasks: [],
        isOffline: false,
        offlineQueue: [],
        _hasHydrated: false,

        setHasHydrated: () => {
          set({ _hasHydrated: true });
        },

        setCurrentUser: (user) => {
          set({ currentUser: user });
        },

        logout: () => {
          set({ currentUser: undefined, tasks: [], offlineQueue: [], isOffline: false });
        },

        setOffline: (offline) => {
          set({ isOffline: offline });
        },

        fetchTasks: async () => {
          try {
            const response = await apiGet<{ total?: number; items?: BackendReport[] }>('/api/reports');
            const existingTasks = new Map(get().tasks.map((task) => [task.id, task]));
            const reports = response?.items ?? [];
            const tasks = reports.map((report) =>
              buildTaskFromReport(report, existingTasks.get(report.id), get().currentUser?.role)
            );
            set({ tasks: sortTasks(tasks) });
          } catch (error) {
            console.error('Error fetching tasks:', error);
          }
        },

        refreshTasks: async () => {
          await get().fetchTasks();
        },

        startTaskAsEngineer: async (taskId) => {
          const currentUser = get().currentUser;
          if (!currentUser || currentUser.role !== 'Engineer') return;

          const timestamp = new Date().toISOString();
          updateTask(taskId, (task) => ({
            ...task,
            status: 'In Progress',
            backendStatus: 'in_progress',
            assignee: currentUser.name,
            assignedEngineer: currentUser.name,
            timeline: upsertTimelineStatus(
              task.timeline,
              'In Progress',
              timestamp,
              'Engineer started work from mobile app.',
              'Engineer',
              currentUser.name
            ),
            updatedAt: timestamp,
          }));

          if (await shouldQueueUpdate()) {
            queueOffline({
              taskId,
              type: 'STATUS_CHANGE',
              payload: { status: 'in_progress', notes: 'Engineer started work from mobile app.' },
              createdAt: timestamp,
            });
            return;
          }

          try {
            await syncStatus(taskId, 'in_progress', 'Engineer started work from mobile app.');
            await refreshSingleTask(taskId);
          } catch (error) {
            queueOffline({
              taskId,
              type: 'STATUS_CHANGE',
              payload: { status: 'in_progress' },
              createdAt: timestamp,
            });
            console.warn('Unable to sync engineer start; queued locally.', error);
          }
        },

        submitEngineerReport: async ({ taskId, notes, materials, beforePhotos, afterPhotos }) => {
          const currentUser = get().currentUser;
          if (!currentUser || currentUser.role !== 'Engineer') return;

          const submittedAt = new Date().toISOString();
          const combinedPhotos = [...beforePhotos, ...afterPhotos];
          updateTask(taskId, (task) => ({
            ...task,
            status: 'Submitted by Engineer',
            backendStatus: 'pending_approval',
            materials,
            beforePhotos,
            afterPhotos,
            photos: combinedPhotos.length > 0 ? combinedPhotos : task.photos,
            engineerReport: {
              notes,
              materials,
              beforePhotos,
              afterPhotos,
              submittedAt,
            },
            timeline: upsertTimelineStatus(
              task.timeline,
              'Submitted by Engineer',
              submittedAt,
              notes,
              'Engineer',
              currentUser.name
            ),
            updatedAt: submittedAt,
          }));

          if (await shouldQueueUpdate()) {
            queueOffline({
              taskId,
              type: 'ENGINEER_SUBMISSION',
              payload: { notes, materials, beforePhotos, afterPhotos },
              createdAt: submittedAt,
            });
            return;
          }

          try {
            const uploadedPhotos = await syncTaskPhotos(taskId, {
              beforePhotos,
              afterPhotos,
            });
            applySyncedEngineerSubmission(taskId, {
              notes,
              materials,
              beforePhotos: uploadedPhotos.beforePhotos,
              afterPhotos: uploadedPhotos.afterPhotos,
            });
            await syncReport(taskId, {
              status: 'pending_approval',
              notes,
            });
            await refreshSingleTask(taskId);
          } catch (error) {
            queueOffline({
              taskId,
              type: 'ENGINEER_SUBMISSION',
              payload: { notes, materials, beforePhotos, afterPhotos },
              createdAt: submittedAt,
            });
            console.warn('Unable to sync engineer submission; queued locally.', error);
          }
        },

        assignEngineer: (taskId, engineerName) => {
          updateTask(taskId, (task) => ({
            ...task,
            assignedEngineer: engineerName,
            assignee: engineerName,
          }));
        },

        startTaskAsLeader: async (taskId) => {
          const currentUser = get().currentUser;
          if (!currentUser || currentUser.role !== 'Team Leader') return;

          const timestamp = new Date().toISOString();
          updateTask(taskId, (task) => ({
            ...task,
            status: 'In Progress (Leader)',
            backendStatus: 'in_progress',
            assignee: currentUser.name,
            assignedEngineer: currentUser.name,
            timeline: upsertTimelineStatus(
              task.timeline,
              'In Progress (Leader)',
              timestamp,
              'Team Leader started work directly.',
              'Team Leader',
              currentUser.name
            ),
            updatedAt: timestamp,
          }));

          if (await shouldQueueUpdate()) {
            queueOffline({
              taskId,
              type: 'STATUS_CHANGE',
              payload: { status: 'in_progress', notes: 'Team Leader started work directly.' },
              createdAt: timestamp,
            });
            return;
          }

          try {
            await syncStatus(taskId, 'in_progress', 'Team Leader started work directly.');
            await refreshSingleTask(taskId);
          } catch (error) {
            queueOffline({
              taskId,
              type: 'STATUS_CHANGE',
              payload: { status: 'in_progress' },
              createdAt: timestamp,
            });
            console.warn('Unable to sync leader start; queued locally.', error);
          }
        },

        leaderApprove: async (taskId, note) => {
          const currentUser = get().currentUser;
          if (!currentUser || currentUser.role !== 'Team Leader') return;

          const timestamp = new Date().toISOString();
          updateTask(taskId, (task) => ({
            ...task,
            status: 'Approved by Team Leader',
            backendStatus: 'pending_approval',
            timeline: upsertTimelineStatus(
              task.timeline,
              'Approved by Team Leader',
              timestamp,
              note ?? 'Approved and sent for DMA review.',
              'Team Leader',
              currentUser.name
            ),
            updatedAt: timestamp,
          }));

          if (await shouldQueueUpdate()) {
            queueOffline({
              taskId,
              type: 'LEADER_APPROVE',
              payload: { note },
              createdAt: timestamp,
            });
            return;
          }

          try {
            await syncStatus(taskId, 'pending_approval', note ?? 'Approved and sent for DMA review.');
            await refreshSingleTask(taskId);
          } catch (error) {
            queueOffline({
              taskId,
              type: 'LEADER_APPROVE',
              payload: { note },
              createdAt: timestamp,
            });
            console.warn('Unable to sync leader approval; queued locally.', error);
          }
        },

        leaderReject: async (taskId, reason) => {
          const currentUser = get().currentUser;
          if (!currentUser || currentUser.role !== 'Team Leader') return;

          const timestamp = new Date().toISOString();
          updateTask(taskId, (task) => ({
            ...task,
            status: 'Rejected by Team Leader',
            backendStatus: 'assigned',
            timeline: upsertTimelineStatus(
              task.timeline,
              'Rejected by Team Leader',
              timestamp,
              reason,
              'Team Leader',
              currentUser.name
            ),
            updatedAt: timestamp,
          }));

          if (await shouldQueueUpdate()) {
            queueOffline({
              taskId,
              type: 'LEADER_REJECT',
              payload: { reason },
              createdAt: timestamp,
            });
            return;
          }

          try {
            await syncStatus(taskId, 'assigned', reason);
            await refreshSingleTask(taskId);
          } catch (error) {
            queueOffline({
              taskId,
              type: 'LEADER_REJECT',
              payload: { reason },
              createdAt: timestamp,
            });
            console.warn('Unable to sync leader rejection; queued locally.', error);
          }
        },

        leaderDirectResolve: async ({ taskId, notes, photos }) => {
          const currentUser = get().currentUser;
          if (!currentUser || currentUser.role !== 'Team Leader') return;

          const createdAt = new Date().toISOString();
          updateTask(taskId, (task) => ({
            ...task,
            status: 'Approved by Team Leader',
            backendStatus: 'pending_approval',
            assignee: currentUser.name,
            assignedEngineer: currentUser.name,
            photos: photos.length > 0 ? photos : task.photos,
            leaderResolution: {
              resolvedByLeader: true,
              notes,
              photos,
              createdAt,
            },
            timeline: upsertTimelineStatus(
              task.timeline,
              'Approved by Team Leader',
              createdAt,
              notes || 'Resolved directly by Team Leader from the field.',
              'Team Leader',
              currentUser.name
            ),
            updatedAt: createdAt,
          }));

          if (await shouldQueueUpdate()) {
            queueOffline({
              taskId,
              type: 'LEADER_DIRECT_RESOLVE',
              payload: { notes, photos },
              createdAt,
            });
            return;
          }

          try {
            const uploadedPhotos = await syncTaskPhotos(taskId, {
              photos,
            });
            applySyncedLeaderResolution(taskId, {
              notes,
              photos: uploadedPhotos.afterPhotos,
            });
            await syncReport(taskId, {
              status: 'pending_approval',
              notes,
            });
            await refreshSingleTask(taskId);
          } catch (error) {
            queueOffline({
              taskId,
              type: 'LEADER_DIRECT_RESOLVE',
              payload: { notes, photos },
              createdAt,
            });
            console.warn('Unable to sync leader resolution; queued locally.', error);
          }
        },

        syncOfflineQueue: async () => {
          if (get().isOffline) {
            return { processed: 0, failed: get().offlineQueue.length };
          }

          const networkAvailable = await getNetworkAvailable();
          if (!networkAvailable) {
            return { processed: 0, failed: get().offlineQueue.length };
          }

          const queue = [...get().offlineQueue];
          if (queue.length === 0) {
            return { processed: 0, failed: 0 };
          }

          const remaining: QueuedUpdate[] = [];
          let processed = 0;

          for (const update of queue) {
            try {
              await syncQueuedUpdate(update);
              processed += 1;
            } catch (error) {
              console.warn(`Unable to replay queued update ${update.id}:`, error);
              remaining.push(update);
            }
          }

          set({ offlineQueue: remaining });

          if (processed > 0) {
            await get().fetchTasks();
          }

          return { processed, failed: remaining.length };
        },

        clearOfflineQueue: () => {
          set({ offlineQueue: [] });
        },
      };
    },
    {
      name: 'hydranet-task-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      },
    }
  )
);
