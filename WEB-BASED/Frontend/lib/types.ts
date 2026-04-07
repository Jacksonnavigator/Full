// ============================================================
// HydraNet - TypeScript Type Definitions
// All entity interfaces and enums for the system
// ============================================================

// ---------- Enums ----------

export type UserRole = "admin" | "utility_manager" | "dma_manager"

export type EntityStatus = "active" | "inactive"

export type ReportStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "closed"

export type ReportPriority = "low" | "medium" | "high" | "critical"

export type NotificationType = "info" | "warning" | "success" | "error"

// ---------- Core Entities ----------

export interface User {
  id: string
  email: string
  password: string // Mock only - never store plaintext in production
  name: string
  role: UserRole
  utilityId?: string
  dmaId?: string
  avatar?: string
  phone?: string
  status: EntityStatus
  createdAt: string
}

export interface Utility {
  id: string
  name: string
  description: string
  managerId: string
  managerName: string
  status: EntityStatus
  dmasCount: number
  createdAt: string
}

export interface DMA {
  id: string
  name: string
  utilityId: string
  utilityName: string
  centerLatitude?: number
  centerLongitude?: number
  managerId: string
  managerName: string
  status: EntityStatus
  teamsCount: number
  createdAt: string
}

export interface Engineer {
  id: string
  name: string
  email: string
  phone: string
  dmaId: string
  teamId?: string
  teamName?: string
  status: EntityStatus
  role: "engineer" | "team_leader"
  assignedReports: number
  createdAt: string
}

export interface Team {
  id: string
  name: string
  dmaId: string
  leaderId: string
  leaderName: string
  engineerIds: string[]
  memberCount: number
  status: EntityStatus
  activeReports: number
  createdAt: string
}

export interface Report {
  id: string
  trackingId: string
  description: string
  latitude: number
  longitude: number
  address: string
  photos: string[]
  reportPhotos?: string[]
  submissionBeforePhotos?: string[]
  submissionAfterPhotos?: string[]
  priority: ReportPriority
  status: ReportStatus
  utilityId: string
  utilityName: string
  dmaId: string
  dmaName: string
  teamId?: string
  teamName?: string
  assignedEngineerId?: string
  assignedEngineerName?: string
  reporterName: string
  reporterPhone: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  slaDeadline: string
  notes?: string
}

export interface ActivityLog {
  id: string
  action: string
  userId: string
  userName: string
  userRole: UserRole
  entity: string
  entityId: string
  timestamp: string
  details: string
  utilityId?: string
  dmaId?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  link?: string
}

// ---------- Store Types ----------

export interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
  clearError: () => void
}

export interface DataState {
  utilities: Utility[]
  dmas: DMA[]
  engineers: Engineer[]
  teams: Team[]
  reports: Report[]
  logs: ActivityLog[]
  notifications: Notification[]

  // Utility CRUD
  addUtility: (utility: Omit<Utility, "id" | "createdAt" | "dmasCount">) => void
  updateUtility: (id: string, data: Partial<Utility>) => void
  deleteUtility: (id: string) => void

  // DMA CRUD
  addDMA: (dma: Omit<DMA, "id" | "createdAt" | "teamsCount">) => void
  updateDMA: (id: string, data: Partial<DMA>) => void
  deleteDMA: (id: string) => void

  // Engineer CRUD
  addEngineer: (engineer: Omit<Engineer, "id" | "createdAt" | "assignedReports">) => void
  updateEngineer: (id: string, data: Partial<Engineer>) => void
  deleteEngineer: (id: string) => void

  // Team CRUD
  addTeam: (team: Omit<Team, "id" | "createdAt" | "activeReports" | "memberCount">) => void
  updateTeam: (id: string, data: Partial<Team>) => void
  deleteTeam: (id: string) => void

  // Report actions
  updateReportStatus: (id: string, status: ReportStatus) => void
  assignReport: (reportId: string, teamId: string, engineerId: string) => void

  // Notification actions
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void

  // Filtered getters
  getDMAsByUtility: (utilityId: string) => DMA[]
  getEngineersByDMA: (dmaId: string) => Engineer[]
  getTeamsByDMA: (dmaId: string) => Team[]
  getReportsByUtility: (utilityId: string) => Report[]
  getReportsByDMA: (dmaId: string) => Report[]
  getLogsByUtility: (utilityId: string) => ActivityLog[]
  getUnreadNotificationCount: () => number
}
