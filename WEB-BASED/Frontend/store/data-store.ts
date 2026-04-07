// ============================================================
// HydraNet - Data Store (Zustand)
// Fetches data from API - No mock data
// Uses global API client for backend communication
// ============================================================

import { create } from "zustand"
import { apiClient } from "@/lib/api-client"
import { transformKeys } from "@/lib/transform-data"

// Type imports for proper typing
import type { ReportStatus, ReportPriority, EntityStatus } from "@/lib/types"

// Types
export interface Utility {
  id: string
  name: string
  description: string | null
  managerId?: string | null
  managerName?: string
  status: EntityStatus
  dmasCount?: number
  reportsCount?: number
  createdAt: string
  updatedAt: string
}

export interface DMA {
  id: string
  name: string
  description: string | null
  utilityId: string
  utilityName?: string
  centerLatitude?: number | null
  centerLongitude?: number | null
  managerId?: string | null
  managerName?: string
  status: EntityStatus
  teamsCount?: number
  reportsCount?: number
  engineersCount?: number
  createdAt: string
  updatedAt: string
}

export interface Engineer {
  id: string
  name: string
  email: string
  phone: string | null
  dmaId: string
  dmaName: string
  teamId: string | null
  teamName: string | null
  status: EntityStatus
  role: string
  assignedReports: number
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  name: string
  dmaId: string
  dmaName: string
  utilityId?: string
  utilityName?: string
  leaderId: string | null
  leaderName: string | null
  status: EntityStatus
  memberCount: number
  activeReports: number
  createdAt: string
  updatedAt: string
}

export interface Report {
  id: string
  trackingId: string
  description: string
  latitude: number
  longitude: number
  address: string | null
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
  teamId: string | null
  teamName: string | null
  assignedEngineerId: string | null
  assignedEngineerName: string | null
  reporterName: string
  reporterPhone: string
  notes: string | null
  slaDeadline: string
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: string
  action: string
  userId: string
  userName: string
  userRole: string
  entity: string
  entityId: string
  details: string | null
  utilityId: string | null
  dmaId: string | null
  timestamp: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  userId: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  phone: string | null
  status: string
}

export interface DMAManager {
  id: string
  name: string
  email: string
  phone: string | null
  status: EntityStatus
  role: string
  utilityId: string
  utilityName?: string
  dmaId?: string | null
  dmaName?: string | null
  password?: string // Used when creating a new manager
  createdAt: string
  updatedAt: string
}

interface DataState {
  // Data
  utilities: Utility[]
  dmas: DMA[]
  dmaManagers: DMAManager[]
  engineers: Engineer[]
  teams: Team[]
  reports: Report[]
  logs: ActivityLog[]
  notifications: Notification[]
  
  // Loading states
  isLoading: boolean
  initialized: boolean
  error: string | null

  // Fetch Actions
  initialize: () => Promise<void>
  fetchUtilities: () => Promise<void>
  fetchDMAs: (utilityId?: string) => Promise<void>
  fetchEngineers: (dmaId?: string) => Promise<void>
  fetchTeams: (dmaId?: string) => Promise<void>
  fetchReports: (filters?: { utilityId?: string; dmaId?: string; status?: string }) => Promise<void>
  fetchLogs: (utilityId?: string, dmaId?: string) => Promise<void>
  fetchNotifications: (userId: string) => Promise<void>
  getUnreadNotificationCount: () => number
  
  // CRUD: Utilities
  addUtility: (data: Partial<Utility>) => Promise<void>
  updateUtility: (id: string, data: Partial<Utility>) => Promise<void>
  deleteUtility: (id: string) => Promise<void>
  
  // CRUD: DMAs
  addDMA: (data: Partial<DMA>) => Promise<void>
  updateDMA: (id: string, data: Partial<DMA>) => Promise<void>
  deleteDMA: (id: string) => Promise<void>
  
  // CRUD: DMA Managers
  fetchDMAManagers: () => Promise<void>
  addDMAManager: (data: Partial<DMAManager>) => Promise<void>
  updateDMAManager: (id: string, data: Partial<DMAManager>) => Promise<void>
  deleteDMAManager: (id: string) => Promise<void>
  
  // CRUD: Reports
  addReport: (data: Partial<Report>) => Promise<void>
  updateReport: (id: string, data: Partial<Report>) => Promise<void>
  deleteReport: (id: string) => Promise<void>
  
  // CRUD: Engineers
  addEngineer: (data: Partial<Engineer>) => Promise<void>
  updateEngineer: (id: string, data: Partial<Engineer>) => Promise<void>
  deleteEngineer: (id: string) => Promise<void>
  
  // CRUD: Teams
  addTeam: (data: Partial<Team>) => Promise<void>
  updateTeam: (id: string, data: Partial<Team>) => Promise<void>
  deleteTeam: (id: string) => Promise<void>
  
  // Helper functions
  getDMAsByUtility: (utilityId: string) => DMA[]
  getReportsByUtility: (utilityId: string) => Report[]
  getReportsByDMA: (dmaId: string) => Report[]
  getTeamsByDMA: (dmaId: string) => Team[]
  getEngineersByDMA: (dmaId: string) => Engineer[]
  updateReportStatus: (id: string, status: string) => Promise<void>
  assignReport: (id: string, teamId: string, engineerId: string) => Promise<void>
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  utilities: [],
  dmas: [],
  dmaManagers: [],
  engineers: [],
  teams: [],
  reports: [],
  logs: [],
  notifications: [],
  isLoading: false,
  initialized: false,
  error: null,

  // Initialize all data
  initialize: async () => {
    if (get().initialized) return
    set({ isLoading: true, error: null })

    try {
      await Promise.all([
        get().fetchUtilities(),
        get().fetchDMAs(),
        get().fetchEngineers(),
        get().fetchTeams(),
        get().fetchReports(),
        get().fetchLogs(),
      ])
      set({ isLoading: false, initialized: true })
    } catch (error) {
      set({ isLoading: false, error: "Failed to initialize data" })
      console.error("Initialization error:", error)
    }
  },

  // Fetch utilities
  fetchUtilities: async () => {
    try {
      const response = await apiClient.get("/utilities")
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ utilities: transformed })
      } else {
        console.error("Error fetching utilities:", response.error)
      }
    } catch (error) {
      console.error("Error fetching utilities:", error)
    }
  },

  // Fetch DMAs
  fetchDMAs: async (utilityId?: string) => {
    try {
      const endpoint = utilityId ? `/dmas?utilityId=${utilityId}` : "/dmas"
      const response = await apiClient.get(endpoint)
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ dmas: transformed })
      } else {
        console.error("Error fetching DMAs:", response.error)
      }
    } catch (error) {
      console.error("Error fetching DMAs:", error)
    }
  },

  // Fetch engineers
  fetchEngineers: async (dmaId?: string) => {
    try {
      const endpoint = dmaId ? `/engineers?dma_id=${dmaId}` : "/engineers"
      const response = await apiClient.get(endpoint)
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ engineers: transformed })
      } else {
        console.error("Error fetching engineers:", response.error)
      }
    } catch (error) {
      console.error("Error fetching engineers:", error)
    }
  },

  // Fetch teams
  fetchTeams: async (dmaId?: string) => {
    try {
      const endpoint = dmaId ? `/teams?dma_id=${dmaId}` : "/teams"
      const response = await apiClient.get(endpoint)
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ teams: transformed })
      } else {
        console.error("Error fetching teams:", response.error)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    }
  },

  // Fetch reports
  fetchReports: async (filters?: { utilityId?: string; dmaId?: string; status?: string }) => {
    try {
      const params = new URLSearchParams()
      if (filters?.utilityId) params.set("utility_id", filters.utilityId)
      if (filters?.dmaId) params.set("dma_id", filters.dmaId)
      if (filters?.status) params.set("status", filters.status)

      const endpoint = `/reports${params.toString() ? `?${params}` : ""}`
      const response = await apiClient.get(endpoint)
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ reports: transformed })
      } else {
        console.error("Error fetching reports:", response.error)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
  },

  // Fetch logs
  fetchLogs: async (utilityId?: string, dmaId?: string) => {
    try {
      const params = new URLSearchParams()
      if (utilityId) params.set("utility_id", utilityId)
      if (dmaId) params.set("dma_id", dmaId)

      const endpoint = `/logs${params.toString() ? `?${params}` : ""}`
      const response = await apiClient.get(endpoint)
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ logs: transformed })
      } else {
        console.error("Error fetching logs:", response.error)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
  },

  // Fetch notifications
  fetchNotifications: async (userId: string) => {
    try {
      const response = await apiClient.get(`/notifications?userId=${userId}`)
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ notifications: transformed })
      } else {
        console.error("Error fetching notifications:", response.error)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  },

  // Get unread notification count
  getUnreadNotificationCount: () => {
    return get().notifications.filter((n) => !n.read).length
  },

  // CRUD: Utilities
  addUtility: async (data: Partial<Utility>) => {
    try {
      const response = await apiClient.post("/utilities", data)
      if (!response.success) throw new Error(response.error || "Failed to create utility")
      await get().fetchUtilities()
    } catch (error) {
      console.error("Error creating utility:", error)
      throw error
    }
  },

  updateUtility: async (id: string, data: Partial<Utility>) => {
    try {
      const response = await apiClient.put(`/utilities/${id}`, data)
      if (!response.success) throw new Error(response.error || "Failed to update utility")
      await get().fetchUtilities()
    } catch (error) {
      console.error("Error updating utility:", error)
      throw error
    }
  },

  deleteUtility: async (id: string) => {
    try {
      const response = await apiClient.delete(`/utilities/${id}`)
      if (!response.success) throw new Error(response.error || "Failed to delete utility")
      await get().fetchUtilities()
    } catch (error) {
      console.error("Error deleting utility:", error)
      throw error
    }
  },

  // CRUD: DMAs
  addDMA: async (data: Partial<DMA>) => {
    try {
      const response = await apiClient.post("/dmas", data)
      if (!response.success) throw new Error(response.error || "Failed to create DMA")
      await get().fetchDMAs()
    } catch (error) {
      console.error("Error creating DMA:", error)
      throw error
    }
  },

  updateDMA: async (id: string, data: Partial<DMA>) => {
    try {
      const response = await apiClient.put(`/dmas/${id}`, data)
      if (!response.success) throw new Error(response.error || "Failed to update DMA")
      await get().fetchDMAs()
    } catch (error) {
      console.error("Error updating DMA:", error)
      throw error
    }
  },

  deleteDMA: async (id: string) => {
    try {
      const response = await apiClient.delete(`/dmas/${id}`)
      if (!response.success) throw new Error(response.error || "Failed to delete DMA")
      await get().fetchDMAs()
    } catch (error) {
      console.error("Error deleting DMA:", error)
      throw error
    }
  },

  // Fetch DMA Managers
  fetchDMAManagers: async () => {
    try {
      const response = await apiClient.get("/dma-managers")
      if (response.success && response.data) {
        const transformed = (response.data.items || []).map(transformKeys)
        set({ dmaManagers: transformed })
      } else {
        console.error("Error fetching DMA managers:", response.error)
      }
    } catch (error) {
      console.error("Error fetching DMA managers:", error)
    }
  },

  // CRUD: DMA Managers
  addDMAManager: async (data: Partial<DMAManager>) => {
    try {
      const response = await apiClient.post("/dma-managers", data)
      if (!response.success) throw new Error(response.error || "Failed to create DMA manager")
      // Refetch both managers and DMAs to keep everything in sync
      await Promise.all([get().fetchDMAManagers(), get().fetchDMAs()])
    } catch (error) {
      console.error("Error creating DMA manager:", error)
      throw error
    }
  },

  updateDMAManager: async (id: string, data: Partial<DMAManager>) => {
    try {
      const response = await apiClient.put(`/dma-managers/${id}`, data)
      if (!response.success) {
        throw new Error(response.error || "Failed to update DMA manager")
      }
      // Refetch both DMA managers and DMAs to ensure everything stays in sync
      // This is important when unassigning managers from DMAs
      await Promise.all([get().fetchDMAManagers(), get().fetchDMAs()])
    } catch (error) {
      console.error("Error updating DMA manager:", error)
      throw error
    }
  },

  deleteDMAManager: async (id: string) => {
    try {
      const response = await apiClient.delete(`/dma-managers/${id}`)
      if (!response.success) throw new Error(response.error || "Failed to delete DMA manager")
      // Refetch both managers and DMAs to keep everything in sync
      await Promise.all([get().fetchDMAManagers(), get().fetchDMAs()])
    } catch (error) {
      console.error("Error deleting DMA manager:", error)
      throw error
    }
  },

  // CRUD: Reports
  addReport: async (data: Partial<Report>) => {
    try {
      const response = await apiClient.post("/reports", data)
      if (!response.success) throw new Error(response.error || "Failed to create report")
      await get().fetchReports()
    } catch (error) {
      console.error("Error creating report:", error)
      throw error
    }
  },

  updateReport: async (id: string, data: Partial<Report>) => {
    try {
      const response = await apiClient.put(`/reports/${id}`, data)
      if (!response.success) throw new Error(response.error || "Failed to update report")
      await get().fetchReports()
    } catch (error) {
      console.error("Error updating report:", error)
      throw error
    }
  },

  deleteReport: async (id: string) => {
    try {
      const response = await apiClient.delete(`/reports/${id}`)
      if (!response.success) throw new Error(response.error || "Failed to delete report")
      await get().fetchReports()
    } catch (error) {
      console.error("Error deleting report:", error)
      throw error
    }
  },

  // CRUD: Engineers
  addEngineer: async (data: Partial<Engineer>) => {
    try {
      const response = await apiClient.post("/engineers", data)
      if (!response.success) throw new Error(response.error || "Failed to create engineer")
      await get().fetchEngineers()
    } catch (error) {
      console.error("Error creating engineer:", error)
      throw error
    }
  },

  updateEngineer: async (id: string, data: Partial<Engineer>) => {
    try {
      const response = await apiClient.put(`/engineers/${id}`, data)
      if (!response.success) throw new Error(response.error || "Failed to update engineer")
      await get().fetchEngineers()
    } catch (error) {
      console.error("Error updating engineer:", error)
      throw error
    }
  },

  deleteEngineer: async (id: string) => {
    try {
      const response = await apiClient.delete(`/engineers/${id}`)
      if (!response.success) throw new Error(response.error || "Failed to delete engineer")
      await get().fetchEngineers()
    } catch (error) {
      console.error("Error deleting engineer:", error)
      throw error
    }
  },

  // CRUD: Teams
  addTeam: async (data: Partial<Team>) => {
    try {
      const response = await apiClient.post("/teams", data)
      if (!response.success) throw new Error(response.error || "Failed to create team")
      await get().fetchTeams()
    } catch (error) {
      console.error("Error creating team:", error)
      throw error
    }
  },

  updateTeam: async (id: string, data: Partial<Team>) => {
    try {
      const response = await apiClient.put(`/teams/${id}`, data)
      if (!response.success) throw new Error(response.error || "Failed to update team")
      await get().fetchTeams()
    } catch (error) {
      console.error("Error updating team:", error)
      throw error
    }
  },

  deleteTeam: async (id: string) => {
    try {
      const response = await apiClient.delete(`/teams/${id}`)
      if (!response.success) throw new Error(response.error || "Failed to delete team")
      await get().fetchTeams()
    } catch (error) {
      console.error("Error deleting team:", error)
      throw error
    }
  },

  // Helper functions
  getDMAsByUtility: (utilityId: string) => {
    return get().dmas.filter((d) => d.utilityId === utilityId)
  },

  getReportsByUtility: (utilityId: string) => {
    return get().reports.filter((r) => r.utilityId === utilityId)
  },

  getReportsByDMA: (dmaId: string) => {
    return get().reports.filter((r) => r.dmaId === dmaId)
  },

  getTeamsByDMA: (dmaId: string) => {
    return get().teams.filter((t) => t.dmaId === dmaId)
  },

  getEngineersByDMA: (dmaId: string) => {
    return get().engineers.filter((e) => e.dmaId === dmaId)
  },

  updateReportStatus: async (id: string, status: string) => {
    try {
      const response = await apiClient.put(`/reports/${id}`, { status })
      if (!response.success) throw new Error(response.error || "Failed to update report status")
      await get().fetchReports()
    } catch (error) {
      console.error("Error updating report status:", error)
      throw error
    }
  },

  assignReport: async (id: string, teamId: string, engineerId: string) => {
    try {
      const teams = get().teams
      const engineers = get().engineers
      const team = teams.find((t) => t.id === teamId)
      const engineer = engineers.find((e) => e.id === engineerId)
      
      const response = await apiClient.put(`/reports/${id}`, {
        teamId,
        assignedEngineerId: engineerId,
        teamName: team?.name,
        assignedEngineerName: engineer?.name,
        status: "assigned",
      })
      if (!response.success) throw new Error(response.error || "Failed to assign report")
      await get().fetchReports()
    } catch (error) {
      console.error("Error assigning report:", error)
      throw error
    }
  },
}))
