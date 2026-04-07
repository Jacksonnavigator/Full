/**
 * Mobile task model used by the engineer/team-leader app.
 *
 * The backend speaks in report statuses such as `assigned` and `pending_approval`,
 * while much of the existing mobile UI expects richer field-work labels.
 * This type keeps the UI-compatible shape in one place.
 */

export type TaskStatus =
  | 'New'
  | 'Assigned'
  | 'Rejected by Team Leader'
  | 'Rejected'
  | 'In Progress'
  | 'In Progress (Leader)'
  | 'Submitted by Engineer'
  | 'Pending Approval'
  | 'Approved by Team Leader'
  | 'Approved'
  | 'Closed by Manager'
  | 'Closed';

export type TaskTimelineActorRole = 'Manager' | 'Team Leader' | 'Engineer' | 'System';

export interface TaskTimelineEntry {
  status: TaskStatus;
  timestamp: string;
  note?: string;
  actorRole: TaskTimelineActorRole;
  actorName: string;
}

export interface EngineerSubmission {
  notes: string;
  materials: string[];
  beforePhotos: string[];
  afterPhotos: string[];
  submittedAt: string;
}

export interface LeaderResolution {
  resolvedByLeader: boolean;
  notes: string;
  photos: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  trackingId: string;
  title: string;
  status: TaskStatus;
  backendStatus?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  assignedTeam?: string;
  teamId?: string;
  teamLeader?: string;
  assignedEngineer?: string;
  assignedEngineerId?: string;
  assignee?: string;
  dmaId?: string;
  dmaName?: string;
  reporterPhotos: string[];
  photos: string[];
  materials: string[];
  beforePhotos: string[];
  afterPhotos: string[];
  engineerReport?: EngineerSubmission;
  leaderResolution?: LeaderResolution;
  timeline: TaskTimelineEntry[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  slaDeadline?: string;
}
