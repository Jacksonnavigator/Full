import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockTasks, Task, TaskStatus, TaskTimelineEntry } from '../data/mockTasks';

export type UserRole = 'Engineer' | 'Team Leader';

export interface User {
  name: string;
  role: UserRole;
  team?: string;
  branch?: string;
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

  // Engineer actions
  startTaskAsEngineer: (taskId: string) => void;
  submitEngineerReport: (params: {
    taskId: string;
    notes: string;
    materials: string[];
    beforePhotos: string[];
    afterPhotos: string[];
  }) => void;

  // Team leader actions
  assignEngineer: (taskId: string, engineerName: string) => void;
  startTaskAsLeader: (taskId: string) => void;
  leaderApprove: (taskId: string, note?: string) => void;
  leaderReject: (taskId: string, reason: string) => void;
  leaderDirectResolve: (params: {
    taskId: string;
    notes: string;
    photos: string[];
  }) => void;

  // Manager simulation
  managerCloseTask: (taskId: string, note?: string) => void;

  clearOfflineQueue: () => void;
}

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => {
      const pushTimeline = (
        task: Task,
        status: TaskStatus,
        note: string | undefined,
        actorRole: TaskTimelineEntry['actorRole']
      ): TaskTimelineEntry[] => {
        const actorName = get().currentUser?.name ?? 'System';
        const timestamp = new Date().toISOString();
        return [
          ...task.timeline,
          {
            status,
            timestamp,
            note,
            actorRole,
            actorName
          }
        ];
      };

      const enqueueOffline = (update: Omit<QueuedUpdate, 'id'>) => {
        const { offlineQueue, isOffline } = get();
        if (!isOffline) return offlineQueue;

        return [
          ...offlineQueue,
          {
            ...update,
            id: `queued-${Date.now()}`
          }
        ];
      };

      return {
        currentUser: undefined,
        tasks: mockTasks,
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
          set({ currentUser: undefined });
        },

        setOffline: (offline) => {
          set({ isOffline: offline });
        },

        // Engineer: Assigned/Rejected -> In Progress
        startTaskAsEngineer: (taskId) => {
          const { tasks, currentUser, isOffline } = get();
          if (!currentUser || currentUser.role !== 'Engineer') {
            return;
          }
          const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) return task;
            if (
              task.status !== 'Assigned' &&
              task.status !== 'Rejected by Team Leader'
            ) {
              return task;
            }
            const timeline = pushTimeline(
              task,
              'In Progress',
              'Engineer started work from mobile app.',
              'Engineer'
            );
            return {
              ...task,
              status: 'In Progress',
              assignee: currentUser.name,
              timeline
            };
          });

          const timestamp = new Date().toISOString();
          const newQueue = enqueueOffline({
            taskId,
            type: 'STATUS_CHANGE',
            payload: {
              status: 'In Progress',
              actorRole: 'Engineer',
              createdAt: timestamp
            },
            createdAt: timestamp
          });

          set({ tasks: updatedTasks, offlineQueue: isOffline ? newQueue : get().offlineQueue });
        },

        submitEngineerReport: ({ taskId, notes, materials, beforePhotos, afterPhotos }) => {
          const { tasks, currentUser, isOffline } = get();
          if (!currentUser || currentUser.role !== 'Engineer') {
            return;
          }
          const submittedAt = new Date().toISOString();

          const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) return task;
            if (task.status !== 'In Progress') return task;

            const timeline = pushTimeline(
              task,
              'Submitted by Engineer',
              'Repair submitted for Team Leader review.',
              'Engineer'
            );

            return {
              ...task,
              status: 'Submitted by Engineer',
              engineerReport: {
                notes,
                materials,
                beforePhotos,
                afterPhotos,
                submittedAt
              },
              assignee: currentUser.name,
              timeline
            };
          });

          const newQueue = enqueueOffline({
            taskId,
            type: 'ENGINEER_SUBMISSION',
            payload: {
              notes,
              materials,
              beforePhotos,
              afterPhotos,
              submittedAt
            },
            createdAt: submittedAt
          });

          set({ tasks: updatedTasks, offlineQueue: isOffline ? newQueue : get().offlineQueue });
        },

        assignEngineer: (taskId, engineerName) => {
          const { tasks, currentUser } = get();
          if (!currentUser || currentUser.role !== 'Team Leader') {
            return;
          }
          const updatedTasks = tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  assignee: engineerName
                }
              : task
          );
          set({ tasks: updatedTasks });
        },

        startTaskAsLeader: (taskId) => {
          const { tasks, currentUser, isOffline } = get();
          if (!currentUser || currentUser.role !== 'Team Leader') {
            return;
          }
          const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) return task;
            if (task.status !== 'Assigned') return task;
            const timeline = pushTimeline(
              task,
              'In Progress (Leader)',
              'Team Leader started work directly.',
              'Team Leader'
            );
            return {
              ...task,
              status: 'In Progress (Leader)',
              assignee: currentUser.name,
              timeline
            };
          });

          const timestamp = new Date().toISOString();
          const newQueue = enqueueOffline({
            taskId,
            type: 'STATUS_CHANGE',
            payload: {
              status: 'In Progress (Leader)',
              actorRole: 'Team Leader',
              createdAt: timestamp
            },
            createdAt: timestamp
          });

          set({ tasks: updatedTasks, offlineQueue: isOffline ? newQueue : get().offlineQueue });
        },

        leaderApprove: (taskId, note) => {
          const { tasks, currentUser, isOffline } = get();
          if (!currentUser || currentUser.role !== 'Team Leader') {
            return;
          }
          const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) return task;
            if (
              task.status !== 'Submitted by Engineer' &&
              task.status !== 'In Progress (Leader)'
            ) {
              return task;
            }

            const timeline = pushTimeline(
              task,
              'Approved by Team Leader',
              note ?? 'Approved by Team Leader.',
              'Team Leader'
            );
            return {
              ...task,
              status: 'Approved by Team Leader',
              timeline
            };
          });

          const timestamp = new Date().toISOString();
          const newQueue = enqueueOffline({
            taskId,
            type: 'LEADER_APPROVE',
            payload: { note, createdAt: timestamp },
            createdAt: timestamp
          });

          set({ tasks: updatedTasks, offlineQueue: isOffline ? newQueue : get().offlineQueue });
        },

        leaderReject: (taskId, reason) => {
          const { tasks, currentUser, isOffline } = get();
          if (!currentUser || currentUser.role !== 'Team Leader') {
            return;
          }

          const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) return task;
            if (task.status !== 'Submitted by Engineer') return task;

            const timeline = pushTimeline(
              task,
              'Rejected by Team Leader',
              reason,
              'Team Leader'
            );
            return {
              ...task,
              status: 'Rejected by Team Leader',
              timeline
            };
          });

          const timestamp = new Date().toISOString();
          const newQueue = enqueueOffline({
            taskId,
            type: 'LEADER_REJECT',
            payload: { reason, createdAt: timestamp },
            createdAt: timestamp
          });

          set({ tasks: updatedTasks, offlineQueue: isOffline ? newQueue : get().offlineQueue });
        },

        leaderDirectResolve: ({ taskId, notes, photos }) => {
          const { tasks, currentUser, isOffline } = get();
          if (!currentUser || currentUser.role !== 'Team Leader') {
            return;
          }
          const createdAt = new Date().toISOString();

          const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId) return task;

            const timeline = pushTimeline(
              task,
              'Approved by Team Leader',
              'Resolved directly by Team Leader from the field.',
              'Team Leader'
            );

            return {
              ...task,
              status: 'Approved by Team Leader',
              assignee: currentUser.name,
              leaderResolution: {
                resolvedByLeader: true,
                notes,
                photos,
                createdAt
              },
              timeline
            };
          });

          const newQueue = enqueueOffline({
            taskId,
            type: 'LEADER_DIRECT_RESOLVE',
            payload: { notes, photos, createdAt },
            createdAt
          });

          set({ tasks: updatedTasks, offlineQueue: isOffline ? newQueue : get().offlineQueue });
        },

        managerCloseTask: (taskId, note) => {
          const { tasks } = get();
          const updatedTasks = tasks.map((task) => {
            if (task.id !== taskId || task.status !== 'Approved by Team Leader') return task;
            const timeline = pushTimeline(
              task,
              'Closed by Manager',
              note ?? 'Closed by Manager (simulated).',
              'Manager'
            );
            return {
              ...task,
              status: 'Closed by Manager',
              timeline
            };
          });
          set({ tasks: updatedTasks });
        },

        clearOfflineQueue: () => {
          set({ offlineQueue: [] });
        }
      };
    },
    {
      name: 'hydranet-task-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated();
      }
    }
  )
);

