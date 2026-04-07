import { Task } from '../types/task';

export type SlaState =
  | 'resolved'
  | 'critical_overdue'
  | 'overdue'
  | 'due_soon'
  | 'on_track'
  | 'unknown';

const CLOSED_BACKEND_STATUSES = new Set(['approved', 'closed']);

export const getSlaState = (task: Pick<Task, 'slaDeadline' | 'backendStatus'>): SlaState => {
  if (!task.slaDeadline) return 'unknown';
  if (task.backendStatus && CLOSED_BACKEND_STATUSES.has(task.backendStatus.toLowerCase())) {
    return 'resolved';
  }

  const deadline = new Date(task.slaDeadline).getTime();
  if (Number.isNaN(deadline)) return 'unknown';

  const hoursRemaining = (deadline - Date.now()) / (1000 * 60 * 60);
  if (hoursRemaining < -24) return 'critical_overdue';
  if (hoursRemaining < 0) return 'overdue';
  if (hoursRemaining <= 24) return 'due_soon';
  return 'on_track';
};

export const getSlaLabel = (state: SlaState) => {
  switch (state) {
    case 'critical_overdue':
      return 'Critical overdue';
    case 'overdue':
      return 'Overdue';
    case 'due_soon':
      return 'Due soon';
    case 'resolved':
      return 'Resolved';
    case 'on_track':
      return 'On track';
    default:
      return null;
  }
};

export const getSlaTone = (state: SlaState) => {
  switch (state) {
    case 'critical_overdue':
      return {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
        textColor: '#b91c1c',
      };
    case 'overdue':
      return {
        backgroundColor: '#fff7ed',
        borderColor: '#fdba74',
        textColor: '#c2410c',
      };
    case 'due_soon':
      return {
        backgroundColor: '#fffbeb',
        borderColor: '#fde68a',
        textColor: '#b45309',
      };
    case 'resolved':
      return {
        backgroundColor: '#ecfdf5',
        borderColor: '#a7f3d0',
        textColor: '#047857',
      };
    case 'on_track':
      return {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
        textColor: '#1d4ed8',
      };
    default:
      return {
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0',
        textColor: '#64748b',
      };
  }
};
