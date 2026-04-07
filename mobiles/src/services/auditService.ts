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
  entity_type: string;
  entity_id: string;
  description?: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface ActivityLogListResponse {
  total: number;
  items: Array<{
    id: string;
    action: string;
    user_id: string;
    entity_type: string;
    entity_id: string;
    description?: string;
    timestamp: string;
  }>;
}

const hydrateActivityLog = (log: ActivityLogListResponse['items'][number]): ActivityLog => ({
  id: log.id,
  action: log.action,
  user_id: log.user_id,
  user_name: log.user_id,
  user_role: 'Unknown',
  entity_type: log.entity_type,
  entity_id: log.entity_id,
  description: log.description,
  timestamp: log.timestamp,
});

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: {
  action: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  resourceType?: string;
  resourceId?: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  description?: string;
}): Promise<ActivityLog> {
  try {
    const response = await apiPost<ActivityLog>('/api/logs', {
      action: data.action,
      user_id: data.userId,
      entity_type: data.entityType || data.resourceType,
      entity_id: data.entityId || data.resourceId,
      description:
        data.description ||
        data.details?.description ||
        `${data.action} on ${data.entityType || data.resourceType || 'resource'}`,
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
  entity_type?: string;
  skip?: number;
  limit?: number;
}): Promise<ActivityLog[]> {
  try {
    const response = await apiGet<ActivityLogListResponse>('/api/logs', {
      params: filters,
    });

    return response.items.map(hydrateActivityLog);
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
    const response = await apiGet<ActivityLogListResponse>('/api/logs', {
      params: {
        entity_type: resourceType,
      },
    });

    return response.items
      .map(hydrateActivityLog)
      .filter((log) => log.entity_id === resourceId);
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
    entityType: 'Report',
    entityId: reportId,
    description: details?.description || 'Report created',
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
    entityType: 'Report',
    entityId: reportId,
    description: `Status changed from ${oldStatus} to ${newStatus}`,
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
    entityType: 'Submission',
    entityId: submissionId,
    description: details?.description || `Submission created for report ${reportId}`,
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
    entityType: 'Submission',
    entityId: submissionId,
    description: details?.description || 'Submission approved',
  });
}

export async function logUserApproved(userId: string, approvedById: string) {
  return createAuditLog({
    action: 'USER_APPROVED',
    userId: approvedById,
    entityType: 'User',
    entityId: userId,
    description: 'User approved',
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
