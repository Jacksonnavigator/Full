/**
 * HydraNet Audit Service
 * Handles activity logging and audit trails
 * Uses HydraNet Backend API (FastAPI)
 */

import { apiPost, apiGet } from './apiClient';

export interface ActivityLog {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  user_role: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  utility_id?: string;
  created_at: string;
  timestamp: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: {
  action: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
  utilityId?: string;
}): Promise<ActivityLog> {
  try {
    const response = await apiPost<ActivityLog>('/api/logs', {
      action: data.action,
      user_id: data.userId,
      user_name: data.userName,
      user_role: data.userRole,
      resource_type: data.resourceType,
      resource_id: data.resourceId,
      details: data.details || {},
      utility_id: data.utilityId,
    });

    return response;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - logging failures shouldn't break the app
    return {} as ActivityLog;
  }
}

/**
 * Get audit logs with filtering
 */
export async function getAuditLogs(filters?: {
  action?: string;
  user_id?: string;
  resource_type?: string;
  utility_id?: string;
  skip?: number;
  limit?: number;
}): Promise<ActivityLog[]> {
  try {
    const response = await apiGet<ActivityLog[]>('/api/logs', {
      params: filters,
    });

    return response;
  } catch (error) {
    console.error('Error getting audit logs:', error);
    return [];
  }
}

/**
 * Get audit logs for a specific resource
 */
export async function getResourceAuditLog(
  resourceType: string,
  resourceId: string
): Promise<ActivityLog[]> {
  try {
    const response = await apiGet<ActivityLog[]>('/api/logs', {
      params: {
        resource_type: resourceType,
        resource_id: resourceId,
      },
    });

    return response;
  } catch (error) {
    console.error('Error getting resource audit log:', error);
    return [];
  }
}

/**
 * Quick audit log helpers
 */

export async function logReportCreated(reportId: string, userId: string, details?: any) {
  return createAuditLog({
    action: 'REPORT_CREATED',
    userId,
    resourceType: 'Report',
    resourceId: reportId,
    details,
  });
}

export async function logReportStatusChange(
  reportId: string,
  userId: string,
  oldStatus: string,
  newStatus: string,
  details?: any
) {
  return createAuditLog({
    action: 'REPORT_STATUS_CHANGED',
    userId,
    resourceType: 'Report',
    resourceId: reportId,
    details: {
      oldStatus,
      newStatus,
      ...details,
    },
  });
}

export async function logSubmissionCreated(
  submissionId: string,
  reportId: string,
  userId: string,
  details?: any
) {
  return createAuditLog({
    action: 'SUBMISSION_CREATED',
    userId,
    resourceType: 'Submission',
    resourceId: submissionId,
    details: {
      reportId,
      ...details,
    },
  });
}

export async function logSubmissionApproved(
  submissionId: string,
  userId: string,
  details?: any
) {
  return createAuditLog({
    action: 'SUBMISSION_APPROVED',
    userId,
    resourceType: 'Submission',
    resourceId: submissionId,
    details,
  });
}

export async function logUserApproved(userId: string, approvedById: string) {
  return createAuditLog({
    action: 'USER_APPROVED',
    userId: approvedById,
    resourceType: 'User',
    resourceId: userId,
  });
}

/**
 * Get user activity log (wrapper for compatibility with old API)
 * @deprecated Use getAuditLogs instead
 */
export async function getUserActivityLog(userId: string, limit: number = 50): Promise<ActivityLog[]> {
  return getAuditLogs({
    user_id: userId,
    limit,
  });
}

/**
 * Get resource audit history (wrapper for compatibility with old API)
 * @deprecated Use getResourceAuditLog instead
 */
export async function getResourceAuditHistory(
  resourceType: string,
  resourceId: string
): Promise<ActivityLog[]> {
  return getResourceAuditLog(resourceType, resourceId);
}
