/**
 * HydraNet - Access Control Utilities
 * Defines which roles can access which pages
 */

import type { UserRole } from './types'

/**
 * Map each page to the roles that can access it
 * Page paths are relative to /dashboard
 */
export const PAGE_ACCESS_MAP: Record<string, UserRole[]> = {
  // Dashboard - accessible to all authenticated users
  '': ['admin', 'utility_manager', 'dma_manager'],
  '/': ['admin', 'utility_manager', 'dma_manager'],

  // Utilities - admin only (admin can create/edit)
  '/utilities': ['admin'],

  // Utility Managers - admin only (admin can create/edit)
  '/managers': ['admin'],

  // DMAs - admin and utility managers (limited to their utility)
  '/dmas': ['admin', 'utility_manager'],

  // DMA Managers - admin and utility managers (limited to their utility)
  '/dma-managers': ['admin', 'utility_manager'],

  // Engineers - DMA managers only (limited to their DMA)
  '/engineers': ['dma_manager'],

  // Teams - DMA managers only (limited to their DMA)
  '/teams': ['dma_manager'],

  // Team Leaders - DMA managers only
  '/team-leaders': ['dma_manager'],

  // Reports - all can access (filtered by role)
  '/reports': ['admin', 'utility_manager', 'dma_manager'],

  // Analytics - admin and utility managers
  '/analytics': ['admin', 'utility_manager'],

  // Activity Logs - admin and utility managers
  '/logs': ['admin', 'utility_manager'],

  // Settings - all authenticated users
  '/settings': ['admin', 'utility_manager', 'dma_manager'],
}

/**
 * Check if a user with given role can access a page
 * @param pagePath - The page path (e.g., '/utilities')
 * @param userRole - The user's role
 * @returns true if user can access the page
 */
export function canAccessPage(pagePath: string, userRole: UserRole): boolean {
  const allowedRoles = PAGE_ACCESS_MAP[pagePath] || PAGE_ACCESS_MAP['']
  return allowedRoles.includes(userRole)
}

/**
 * Get the default dashboard page for a user role
 * @param userRole - The user's role
 * @returns The dashboard page path for this role
 */
export function getDefaultDashboardPage(userRole: UserRole): string {
  switch (userRole) {
    case 'admin':
      return '/dashboard'
    case 'utility_manager':
      return '/dashboard'
    case 'dma_manager':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}

/**
 * Allowed actions/operations for each role
 */
export const ROLE_PERMISSIONS = {
  admin: {
    canCreateUtility: true,
    canEditUtility: true,
    canDeleteUtility: true,
    canCreateUtilityManager: true,
    canEditUtilityManager: true,
    canDeleteUtilityManager: true,
    canCreateDMA: true,
    canEditDMA: true,
    canDeleteDMA: true,
    canCreateDMAManager: true,
    canEditDMAManager: true,
    canDeleteDMAManager: true,
    canCreateEngineer: true,
    canEditEngineer: true,
    canDeleteEngineer: true,
    canCreateTeam: true,
    canEditTeam: true,
    canDeleteTeam: true,
    canCreateTeamLeader: true,
    canEditTeamLeader: true,
    canDeleteTeamLeader: true,
    canCreateReport: true,
    canEditReport: true,
    canDeleteReport: true,
    canAssignReport: true,
    canApproveReport: true,
  },
  utility_manager: {
    canCreateUtility: false,
    canEditUtility: false,
    canDeleteUtility: false,
    canCreateUtilityManager: false,
    canEditUtilityManager: false,
    canDeleteUtilityManager: false,
    canCreateDMA: false,
    canEditDMA: false,
    canDeleteDMA: false,
    canCreateDMAManager: false,
    canEditDMAManager: false,
    canDeleteDMAManager: false,
    canCreateEngineer: false,
    canEditEngineer: false,
    canDeleteEngineer: false,
    canCreateTeam: false,
    canEditTeam: false,
    canDeleteTeam: false,
    canCreateTeamLeader: false,
    canEditTeamLeader: false,
    canDeleteTeamLeader: false,
    canCreateReport: true,
    canEditReport: true,
    canDeleteReport: true,
    canAssignReport: true,
    canApproveReport: true,
  },
  dma_manager: {
    canCreateUtility: false,
    canEditUtility: false,
    canDeleteUtility: false,
    canCreateUtilityManager: false,
    canEditUtilityManager: false,
    canDeleteUtilityManager: false,
    canCreateDMA: false,
    canEditDMA: false,
    canDeleteDMA: false,
    canCreateDMAManager: false,
    canEditDMAManager: false,
    canDeleteDMAManager: false,
    canCreateEngineer: false,
    canEditEngineer: false,
    canDeleteEngineer: false,
    canCreateTeam: false,
    canEditTeam: false,
    canDeleteTeam: false,
    canCreateTeamLeader: false,
    canEditTeamLeader: false,
    canDeleteTeamLeader: false,
    canCreateReport: true,
    canEditReport: true,
    canDeleteReport: true,
    canAssignReport: true,
    canApproveReport: false,
  },
}

/**
 * Get permissions for a user role
 * @param role - The user's role
 * @returns Object with permission flags
 */
export function getRolePermissions(role: UserRole) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.dma_manager
}
