import type { Task, TaskStatus } from '../types/task';

export const ASSIGNED_TASK_STATUSES = ['Assigned', 'Rejected by Team Leader'] as const;
export const ACTIVE_TASK_STATUSES = ['In Progress', 'In Progress (Leader)'] as const;
export const AWAITING_LEADER_REVIEW_STATUSES = ['Submitted by Engineer', 'Pending Approval'] as const;
export const SUBMITTED_WORK_STATUSES = [
  ...AWAITING_LEADER_REVIEW_STATUSES,
  'Approved by Team Leader',
] as const;
export const TEAM_TASK_ACTIVE_STATUSES = [
  'Assigned',
  ...ACTIVE_TASK_STATUSES,
  ...AWAITING_LEADER_REVIEW_STATUSES,
] as const;
export const CLOSED_TASK_STATUSES = ['Closed by Manager', 'Closed'] as const;
export const REJECTED_TASK_STATUSES = ['Rejected by Team Leader', 'Rejected'] as const;

const hasStatus = (group: readonly TaskStatus[], status: TaskStatus) => group.includes(status);

const looksLikeLeaderApprovalNote = (notes?: string | null) => {
  const normalized = (notes || '').toLowerCase();
  return (
    normalized.includes('approved and sent for dma review') ||
    normalized.includes('approved by team leader') ||
    normalized.includes('resolved directly by team leader')
  );
};

export const isAssignedTaskStatus = (status: TaskStatus) => hasStatus(ASSIGNED_TASK_STATUSES, status);

export const isActiveTaskStatus = (status: TaskStatus) => hasStatus(ACTIVE_TASK_STATUSES, status);

export const isAwaitingLeaderReviewStatus = (status: TaskStatus) =>
  hasStatus(AWAITING_LEADER_REVIEW_STATUSES, status);

export const isSubmittedWorkStatus = (status: TaskStatus) => hasStatus(SUBMITTED_WORK_STATUSES, status);

export const isTeamTaskActiveStatus = (status: TaskStatus) => hasStatus(TEAM_TASK_ACTIVE_STATUSES, status);

export const isClosedTaskStatus = (status: TaskStatus) => hasStatus(CLOSED_TASK_STATUSES, status);

export const isRejectedTaskStatus = (status: TaskStatus) => hasStatus(REJECTED_TASK_STATUSES, status);

export const hasLeaderReviewedTask = (task: Task) =>
  Boolean(task.leaderResolution?.resolvedByLeader) || looksLikeLeaderApprovalNote(task.notes);

export const isAwaitingLeaderActionTask = (task: Task) =>
  isAwaitingLeaderReviewStatus(task.status) ||
  (task.backendStatus === 'pending_approval' && !hasLeaderReviewedTask(task));
