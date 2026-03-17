/**
 * HydraNet Firestore Data Models
 * Defines all collection structures and interfaces
 */

// ============ ADMIN/GOVERNANCE MODELS ============

export interface WaterUtility {
  id: string;
  name: string;
  code: string;
  country: string;
  state: string;
  region: string;
  geoBoundary: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON format
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface DMA {
  id: string;
  utilityId: string;
  name: string;
  code: string;
  geoBoundary: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON format
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Branch {
  id: string;
  utilityId: string;
  dmaId: string;
  name: string;
  code: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// ============ USER MODELS ============

export type UserRole = 'Administrator' | 'UtilityManager' | 'DMAManager' | 'Engineer' | 'TeamLeader';

export interface User {
  id: string;
  email: string;
  password?: string; // Only stored during registration
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  utilityId?: string;
  dmaId?: string;
  branchId?: string;
  teamId?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  profilePhotoUrl?: string;
}

export interface Team {
  id: string;
  utilityId: string;
  dmaId: string;
  branchId: string;
  name: string;
  code: string;
  teamLeaderId: string;
  members: string[]; // Array of engineer IDs
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// ============ REPORT & TASK MODELS ============

export type ReportStatus = 'New' | 'Assigned' | 'InProgress' | 'RepairSubmitted' | 'Approved' | 'Rejected' | 'Closed';
export type ReportPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ReportType = 'BurstPipeline' | 'DistributionFailure' | 'SurfaceDamage' | 'Other';

export interface LeakageReport {
  id: string;
  utilityId: string;
  dmaId: string;
  branchId?: string;
  status: ReportStatus;
  priority: ReportPriority;
  type: ReportType;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  images: {
    url: string;
    storagePath: string;
    uploadedAt: string;
  }[];
  reportedBy: 'Anonymous' | string; // Empty string for public reports
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

// ============ AUDIT & ACTIVITY MODELS ============

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'REPORT_CREATED'
  | 'REPORT_ASSIGNED'
  | 'REPORT_STATUS_CHANGED'
  | 'SUBMISSION_CREATED'
  | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REJECTED'
  | 'USER_CREATED'
  | 'USER_APPROVED'
  | 'TEAM_CREATED'
  | 'TASK_UPDATED';

export interface AuditLog {
  id: string;
  action: AuditAction;
  userId: string;
  userName: string;
  userRole: UserRole;
  resourceType: 'Report' | 'Submission' | 'User' | 'Team' | 'Task';
  resourceId: string;
  details: Record<string, any>;
  timestamp: string;
  utilityId: string;
  dmaId?: string;
}

export interface ActivityLog {
  id: string;
  reportId: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  description: string;
  timestamp: string;
}

// ============ PERFORMANCE & ANALYTICS MODELS ============

export interface TeamPerformanceMetrics {
  id: string;
  teamId: string;
  branchId: string;
  dmaId: string;
  utilityId: string;
  period: string; // YYYY-MM
  totalTasksAssigned: number;
  totalTasksCompleted: number;
  totalTasksRejected: number;
  averageCompletionTime: number; // in hours
  performanceScore: number; // 0-100
  responseTimeAverage: number; // in minutes
  approvalRate: number; // percentage
  updatedAt: string;
}

export interface DMAPerformanceMetrics {
  id: string;
  dmaId: string;
  utilityId: string;
  period: string; // YYYY-MM
  totalReportsReceived: number;
  totalReportsResolved: number;
  averageResolutionTime: number; // in hours
  totalTeams: number;
  totalEngineers: number;
  performanceScore: number; // 0-100
  updatedAt: string;
}

// ============ NOTIFICATION MODEL ============

export interface Notification {
  id: string;
  recipientId: string;
  recipientRole: UserRole;
  type:
    | 'NEW_REPORT'
    | 'TASK_ASSIGNED'
    | 'SUBMISSION_APPROVED'
    | 'SUBMISSION_REJECTED'
    | 'TASK_COMPLETED'
    | 'USER_APPROVED'
    | 'ESCALATION';
  title: string;
  message: string;
  reportId?: string;
  submissionId?: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}
