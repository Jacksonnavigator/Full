/**
 * HydraNet Mobile - TypeScript Type Definitions
 * All entity interfaces and enums for the system
 */

// ---------- Enums ----------

export type UserRole = 'admin' | 'utility_manager' | 'dma_manager' | 'engineer' | 'team_leader' | 'user';

export type EntityStatus = 'active' | 'inactive';

export type ReportStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'closed';

export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

// ---------- Core Entities ----------

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  utility_id?: string;
  utility_name?: string;
  dma_id?: string;
  dma_name?: string;
  team_id?: string;
  team_name?: string;
  avatar?: string;
  phone?: string;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
  user_type?: string;
}

export interface Utility {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  manager_name?: string;
  status: EntityStatus;
  dmas_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DMA {
  id: string;
  name: string;
  utility_id: string;
  utility_name?: string;
  manager_id?: string;
  manager_name?: string;
  status: EntityStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Engineer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dma_id: string;
  team_id?: string;
  team_name?: string;
  status: EntityStatus;
  role: 'engineer' | 'team_leader';
  assigned_reports?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Team {
  id: string;
  name: string;
  dma_id: string;
  leader_id: string;
  leader_name?: string;
  engineer_ids?: string[];
  member_count?: number;
  status: EntityStatus;
  active_reports?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: string;
  tracking_id: string;
  description: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  photos?: string[];
  priority: ReportPriority;
  status: ReportStatus;
  utility_id: string;
  utility_name?: string;
  dma_id: string;
  dma_name?: string;
  team_id?: string;
  team_name?: string;
  assigned_engineer_id?: string;
  assigned_engineer_name?: string;
  reporter_name?: string;
  reporter_phone?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  sla_deadline?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  entity: string;
  entity_id: string;
  timestamp: string;
  details?: string;
  utility_id?: string;
  dma_id?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  link?: string;
}

// ---------- Auth Types ----------

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  user: User;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
