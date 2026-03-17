/**
 * HydraNet Notification Service (Real Implementation)
 * Sends actual push notifications to registered devices
 * Integrated with Expo Push API and in-app notification system
 */

import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { LeakageReport, RepairSubmission, UserRole } from './types';
import { getActiveTokensForUser } from './pushNotificationService';

interface NotificationQueue {
  id: string;
  userId: string;
  userRole: UserRole;
  title: string;
  body: string;
  type: 'ASSIGNMENT' | 'SUBMISSION' | 'APPROVAL' | 'REJECTION' | 'STATUS_CHANGE' | 'OTHER';
  resourceId: string;
  resourceType: 'Report' | 'Submission' | 'Task';
  status: 'Pending' | 'Sent' | 'Failed';
  attempt: number;
  maxAttempts: number;
  createdAt: string;
  sentAt?: string;
  error?: string;
}

const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send';
const MAX_RETRIES = 3;

/**
 * Send push notification to a user
 * Handles both token-based push (mobile) and in-app notification queue
 */
export async function sendPushNotification(
  userId: string,
  userRole: UserRole,
  title: string,
  body: string,
  type: NotificationQueue['type'],
  resourceId: string,
  resourceType: NotificationQueue['resourceType'],
  data?: Record<string, string>
): Promise<void> {
  try {
    // 1. Queue the notification for retry logic
    const notifQueue: NotificationQueue = {
      id: '',
      userId,
      userRole,
      title,
      body,
      type,
      resourceId,
      resourceType,
      status: 'Pending',
      attempt: 0,
      maxAttempts: MAX_RETRIES,
      createdAt: new Date().toISOString(),
    };

    const queueRef = await addDoc(collection(db, 'notificationQueue'), notifQueue);
    notifQueue.id = queueRef.id;

    // 2. Get active device tokens for this user
    const tokens = await getActiveTokensForUser(userId);

    if (tokens.length === 0) {
      console.log(`No active tokens for user ${userId}; will retry later`);
      return;
    }

    // 3. Send push via Expo if tokens exist
    for (const token of tokens) {
      await sendExpoNotification(token, title, body, {
        ...data,
        resourceId,
        resourceType,
        type,
      });
    }

    // 4. Mark as sent
    await updateNotificationQueueStatus(notifQueue.id, 'Sent', undefined);

    // 5. Log delivery
    await logNotificationEvent(userId, title, 'sent', type);
  } catch (error) {
    console.error('Error sending push notification:', error);
    // Will be retried by background job
  }
}

/**
 * Send notification via Expo Push API
 */
async function sendExpoNotification(
  token: string,
  title: string,
  body: string,
  data: Record<string, string>
): Promise<boolean> {
  try {
    const payload = {
      to: token,
      sound: 'default',
      title,
      body,
      data,
      _displayInForeground: true,
      badge: 1,
      ttl: 86400, // 24 hours
    };

    const response = await fetch(EXPO_PUSH_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Expo push error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('Expo notification sent:', result);
    return true;
  } catch (error) {
    console.error('Error calling Expo API:', error);
    return false;
  }
}

/**
 * Notify DMA Manager of new assignment
 */
export async function notifyDMAManagerOfNewReport(
  dmaManagerUserId: string,
  report: LeakageReport
): Promise<void> {
  await sendPushNotification(
    dmaManagerUserId,
    'DMAManager',
    `📍 New Report: ${report.description.substring(0, 50)}...`,
    `Priority: ${report.priority} | Location: ${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`,
    'ASSIGNMENT',
    report.id,
    'Report',
    {
      reportId: report.id,
      priority: report.priority,
      util: report.utilityId,
      dma: report.dmaId,
    }
  );
}

/**
 * Notify Team Leader of task assignment
 */
export async function notifyTeamLeaderOfAssignment(
  teamLeaderId: string,
  report: LeakageReport,
  teamName: string
): Promise<void> {
  await sendPushNotification(
    teamLeaderId,
    'TeamLeader',
    `👷 Task Assigned: ${report.description.substring(0, 40)}...`,
    `Team: ${teamName} | Priority: ${report.priority} | Report ID: ${report.id}`,
    'ASSIGNMENT',
    report.id,
    'Report',
    {
      reportId: report.id,
      teamName,
      priority: report.priority,
    }
  );
}

/**
 * Notify Engineers of new team task
 */
export async function notifyEngineersOfTeamTask(
  engineerIds: string[],
  report: LeakageReport,
  teamName: string
): Promise<void> {
  for (const engineerId of engineerIds) {
    await sendPushNotification(
      engineerId,
      'Engineer',
      `🔧 New Task: ${report.description.substring(0, 40)}...`,
      `Team: ${teamName} | Priority: ${report.priority}`,
      'ASSIGNMENT',
      report.id,
      'Report',
      {
        reportId: report.id,
        teamName,
      }
    );
  }
}

/**
 * Notify DMA Manager of repair submission
 */
export async function notifyDMAManagerOfSubmission(
  dmaManagerUserId: string,
  submission: RepairSubmission,
  reportId: string
): Promise<void> {
  await sendPushNotification(
    dmaManagerUserId,
    'DMAManager',
    `📤 Repair Submission Awaiting Review`,
    `Report ${reportId} | Team Leader has submitted repair for approval`,
    'SUBMISSION',
    submission.id,
    'Submission',
    {
      submissionId: submission.id,
      reportId,
    }
  );
}

/**
 * Notify Team Leader of approval
 */
export async function notifyTeamLeaderOfApproval(
  teamLeaderId: string,
  submission: RepairSubmission,
  reportId: string
): Promise<void> {
  await sendPushNotification(
    teamLeaderId,
    'TeamLeader',
    `✅ Repair Approved`,
    `Report ${reportId} has been approved and marked as closed`,
    'APPROVAL',
    submission.id,
    'Submission',
    {
      submissionId: submission.id,
      reportId,
    }
  );
}

/**
 * Notify Team Leader of rejection
 */
export async function notifyTeamLeaderOfRejection(
  teamLeaderId: string,
  submission: RepairSubmission,
  reportId: string,
  reason: string
): Promise<void> {
  await sendPushNotification(
    teamLeaderId,
    'TeamLeader',
    `❌ Repair Rejected`,
    `Report ${reportId} needs additional work. Reason: ${reason.substring(0, 50)}...`,
    'REJECTION',
    submission.id,
    'Submission',
    {
      submissionId: submission.id,
      reportId,
      reason: reason.substring(0, 100),
    }
  );
}

/**
 * Notify Engineers of submission rejection
 */
export async function notifyEngineersOfRejection(
  engineerIds: string[],
  reportId: string,
  reason: string
): Promise<void> {
  for (const engineerId of engineerIds) {
    await sendPushNotification(
      engineerId,
      'Engineer',
      `❌ Your Submission Was Rejected`,
      `Reason: ${reason.substring(0, 50)}...`,
      'REJECTION',
      reportId,
      'Report',
      {
        reportId,
        reason: reason.substring(0, 100),
      }
    );
  }
}

/**
 * Update notification queue status
 */
async function updateNotificationQueueStatus(
  queueId: string,
  status: 'Sent' | 'Failed' | 'Pending',
  error?: string
): Promise<void> {
  try {
    const ref = collection(db, 'notificationQueue');
    const q = query(ref);
    const doc = (await getDocs(q)).docs.find((d) => d.id === queueId);
    if (doc) {
      await doc.ref.update({
        status,
        error: error || null,
        ...(status === 'Sent' && { sentAt: new Date().toISOString() }),
      });
    }
  } catch (error) {
    console.error('Error updating queue status:', error);
  }
}

/**
 * Log notification event for audit
 */
async function logNotificationEvent(
  userId: string,
  message: string,
  event: 'sent' | 'failed' | 'clicked',
  type: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'notificationLogs'), {
      userId,
      message,
      event,
      type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging notification event:', error);
  }
}

/**
 * Retry failed notifications (called by Cloud Function on schedule)
 * Cloud Function should call this periodically
 */
export async function retryFailedNotifications(): Promise<void> {
  try {
    const q = query(
      collection(db, 'notificationQueue'),
      where('status', '==', 'Failed'),
      where('attempt', '<', MAX_RETRIES)
    );

    const snapshot = await getDocs(q);
    for (const doc of snapshot.docs) {
      const notif = doc.data() as NotificationQueue;
      const tokens = await getActiveTokensForUser(notif.userId);

      if (tokens.length > 0) {
        for (const token of tokens) {
          const success = await sendExpoNotification(token, notif.title, notif.body, {
            resourceId: notif.resourceId,
            resourceType: notif.resourceType,
            type: notif.type,
          });

          if (success) {
            await updateNotificationQueueStatus(notif.id, 'Sent');
            break; // One success is enough
          }
        }
      }

      // Increment attempt
      await doc.ref.update({
        attempt: notif.attempt + 1,
      });
    }
  } catch (error) {
    console.error('Error retrying failed notifications:', error);
  }
}
