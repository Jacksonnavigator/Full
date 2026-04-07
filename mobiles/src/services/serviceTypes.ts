/**
 * Compatibility types for older service modules that are still part of the live app.
 * Backend-first screens use `src/lib/types`, while a few compatibility helpers still expect this shape.
 * The live mobile workflow itself only supports engineers and team leaders.
 */

export type UserRole = 'Administrator' | 'Engineer' | 'TeamLeader';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  utilityId?: string;
  dmaId?: string;
  dmaName?: string;
  dma_name?: string;
  teamId?: string;
  teamName?: string;
  team_name?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  profilePhotoUrl?: string;
}

export type ReportStatus = 'New' | 'Assigned' | 'InProgress' | 'RepairSubmitted' | 'Approved' | 'Rejected' | 'Closed';

export interface LeakageReport {
  id: string;
  utilityId: string;
  dmaId: string;
  status: ReportStatus;
  priority: string;
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
