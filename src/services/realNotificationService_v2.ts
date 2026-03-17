/**
 * HydraNet Real Notification Service
 * Handles sending notifications via backend API
 * Uses polling for real-time updates (WebSocket support can be added later)
 */

import { apiPost } from './apiClient';

interface NotificationPayload {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Send notification to user via backend
 */
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  try {
    await apiPost('/api/notifications', payload);
    console.log('📬 Notification sent:', payload.title);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    // Don't throw - notifications shouldn't break the app
  }
}

/**
 * Notify DMA Manager of new report
 */
export async function notifyDMAManagerOfNewReport(
  reportId: string,
  managerId: string,
  reportDetails: string
): Promise<void> {
  await sendNotification({
    user_id: managerId,
    type: 'NEW_REPORT',
    title: 'New Leakage Report',
    message: reportDetails,
    data: { reportId },
  });
}

/**
 * Notify Team Leader of assignment
 */
export async function notifyTeamLeaderOfAssignment(
  reportId: string,
  teamLeaderId: string,
  reportTitle: string
): Promise<void> {
  await sendNotification({
    user_id: teamLeaderId,
    type: 'ASSIGNMENT',
    title: 'New Task Assignment',
    message: `Report assigned: ${reportTitle}`,
    data: { reportId },
  });
}

/**
 * Notify engineers of team task
 */
export async function notifyEngineersOfTeamTask(
  reportId: string,
  engineerIds: string[],
  taskDetails: string
): Promise<void> {
  for (const engineerId of engineerIds) {
    await sendNotification({
      user_id: engineerId,
      type: 'ASSIGNMENT',
      title: 'Team Task',
      message: taskDetails,
      data: { reportId },
    });
  }
}

/**
 * Notify DMA Manager of submission
 */
export async function notifyDMAManagerOfSubmission(
  reportId: string,
  managerId: string,
  submissionDetails: string
): Promise<void> {
  await sendNotification({
    user_id: managerId,
    type: 'SUBMISSION',
    title: 'Repair Submission',
    message: submissionDetails,
    data: { reportId },
  });
}

/**
 * Notify Team Leader of approval
 */
export async function notifyTeamLeaderOfApproval(
  reportId: string,
  teamLeaderId: string,
  message: string
): Promise<void> {
  await sendNotification({
    user_id: teamLeaderId,
    type: 'APPROVAL',
    title: 'Submission Approved',
    message,
    data: { reportId },
  });
}

/**
 * Notify Team Leader of rejection
 */
export async function notifyTeamLeaderOfRejection(
  reportId: string,
  teamLeaderId: string,
  reason: string
): Promise<void> {
  await sendNotification({
    user_id: teamLeaderId,
    type: 'REJECTION',
    title: 'Submission Rejected',
    message: reason,
    data: { reportId },
  });
}

/**
 * Notify engineers of rejection
 */
export async function notifyEngineersOfRejection(
  reportId: string,
  engineerIds: string[],
  reason: string
): Promise<void> {
  for (const engineerId of engineerIds) {
    await sendNotification({
      user_id: engineerId,
      type: 'REJECTION',
      title: 'Work Rejected',
      message: reason,
      data: { reportId },
    });
  }
}
