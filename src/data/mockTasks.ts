export type TaskPriority = 'High' | 'Medium' | 'Low';

export type TaskStatus =
  | 'New'
  | 'Assigned'
  | 'In Progress'
  | 'In Progress (Leader)'
  | 'Submitted by Engineer'
  | 'Rejected by Team Leader'
  | 'Approved by Team Leader'
  | 'Closed by Manager';

export type ActorRole = 'System' | 'Engineer' | 'Team Leader' | 'Manager';

export interface TaskTimelineEntry {
  status: TaskStatus;
  timestamp: string;
  actorRole: ActorRole;
  actorName?: string;
  note?: string;
}

export interface EngineerReport {
  notes: string;
  materials: string[];
  beforePhotos: string[];
  afterPhotos: string[];
  submittedAt?: string;
}

export interface LeaderResolution {
  resolvedByLeader: boolean;
  notes: string;
  photos: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  latitude: number;
  longitude: number;
  reporterPhotos: string[];
  assignedTeam: string;
  teamLeader: string;
  branch: string;
  assignee?: string; // engineer working on the task
  engineerReport?: EngineerReport;
  leaderResolution?: LeaderResolution;
  timeline: TaskTimelineEntry[];
}

const now = Date.now();

export const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    title: 'Burst Pipe at Main Street',
    description:
      'Water leaking near the school junction. Significant flow across the road surface.',
    priority: 'High',
    status: 'Assigned',
    latitude: -3.366,
    longitude: 36.683,
    reporterPhotos: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
    assignedTeam: 'team-1',
    teamLeader: 'Test Team Leader',
    branch: 'Central',
    assignee: 'Engineer One',
    timeline: [
      {
        status: 'New',
        timestamp: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
        actorRole: 'System',
        actorName: 'System',
        note: 'Task created in back-office.'
      },
      {
        status: 'Assigned',
        timestamp: new Date(now - 1000 * 60 * 60 * 7).toISOString(),
        actorRole: 'Team Leader',
        actorName: 'Test Team Leader',
        note: 'Assigned to team-1 / Engineer One.'
      }
    ]
  },
  {
    id: 'TASK-002',
    title: 'Low Pressure in Residential Block B',
    description: 'Residents reporting low water pressure during peak hours.',
    priority: 'Medium',
    status: 'In Progress',
    latitude: -3.365,
    longitude: 36.681,
    reporterPhotos: ['https://via.placeholder.com/300'],
    assignedTeam: 'team-1',
    teamLeader: 'Test Team Leader',
    branch: 'East',
    assignee: 'Engineer Two',
    timeline: [
      {
        status: 'New',
        timestamp: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
        actorRole: 'System',
        actorName: 'System',
        note: 'Task registered from call center.'
      },
      {
        status: 'Assigned',
        timestamp: new Date(now - 1000 * 60 * 60 * 9).toISOString(),
        actorRole: 'Team Leader',
        actorName: 'Test Team Leader',
        note: 'Assigned to team-1 for investigation.'
      }
    ]
  },
  {
    id: 'TASK-003',
    title: 'Valve Leak at Industrial Zone',
    description:
      'Visible leak around main valve chamber near factory entrance. High priority industrial consumer.',
    priority: 'High',
    status: 'In Progress',
    latitude: -3.368,
    longitude: 36.686,
    reporterPhotos: ['https://via.placeholder.com/300'],
    assignedTeam: 'team-1',
    teamLeader: 'Test Team Leader',
    branch: 'Industrial',
    assignee: 'Engineer Three',
    engineerReport: {
      notes: 'Leak located at flange, excavation in progress.',
      materials: ['100mm gasket', '8x M16 bolts'],
      beforePhotos: ['https://via.placeholder.com/300'],
      afterPhotos: [],
      submittedAt: undefined
    },
    leaderResolution: undefined,
    timeline: [
      {
        status: 'New',
        timestamp: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
        actorRole: 'System',
        actorName: 'System',
        note: 'Task created from SCADA alert.'
      },
      {
        status: 'Assigned',
        timestamp: new Date(now - 1000 * 60 * 60 * 10).toISOString(),
        actorRole: 'Team Leader',
        actorName: 'Test Team Leader',
        note: 'Assigned to team-1 / Engineer Three.'
      },
      {
        status: 'In Progress',
        timestamp: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
        actorRole: 'Engineer',
        actorName: 'Engineer Three',
        note: 'On site, isolation in progress.'
      }
    ]
  }
];

