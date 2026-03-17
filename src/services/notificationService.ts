/**
 * HydraNet Notification Service
 * Handles push notifications and in-app notifications
 */

import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { Notification, LeakageReport, User } from './types';
import * as Notifications from 'expo-notifications';

export interface NotificationData {
  reportId?: string;
  submissionId?: string;
  taskId?: string;
  action: string;
  details: Record<string, any>;
}

/**
 * Notify relevant managers of a new report
 */
export async function notifyRelevantManagers(
  notificationType: string,
  report: LeakageReport,
  targetRole: 'Administrator' | 'UtilityManager' | 'DMAManager' | 'TeamLeader',
  utilityId?: string,
  dmaId?: string
): Promise<void> {
  try {
    let recipients: User[] = [];

    if (targetRole === 'Administrator') {
      // Notify all administrators
      const q = query(collection(db, 'users'), where('role', '==', 'Administrator'));
      const snapshot = await getDocs(q);
      recipients = snapshot.docs.map((doc) => doc.data() as User);
    } else if (targetRole === 'UtilityManager' && utilityId) {
      // Notify utility managers
      const q = query(collection(db, 'users'), where('utilityId', '==', utilityId), where('role', '==', 'UtilityManager'));
      const snapshot = await getDocs(q);
      recipients = snapshot.docs.map((doc) => doc.data() as User);
    } else if (targetRole === 'DMAManager' && dmaId) {
      // Notify DMA managers
      const q = query(collection(db, 'users'), where('dmaId', '==', dmaId), where('role', '==', 'DMAManager'));
      const snapshot = await getDocs(q);
      recipients = snapshot.docs.map((doc) => doc.data() as User);
    } else if (targetRole === 'TeamLeader' && report.assignedTeamId) {
      // Notify team leaders
      const q = query(
        collection(db, 'users'),
        where('teamId', '==', report.assignedTeamId),
        where('role', '==', 'TeamLeader')
      );
      const snapshot = await getDocs(q);
      recipients = snapshot.docs.map((doc) => doc.data() as User);
    }

    // Send notifications to all recipients
    for (const recipient of recipients) {
      await createNotification(recipient.id, recipient.role, notificationType, report);
    }
  } catch (error) {
    console.error('Error notifying managers:', error);
  }
}

/**
 * Create a notification in Firestore
 */
async function createNotification(
  recipientId: string,
  recipientRole: any,
  type: string,
  report: LeakageReport
): Promise<void> {
  try {
    const notification: Notification = {
      id: '', // Set by Firestore
      recipientId,
      recipientRole,
      type: type as any,
      title: getNotificationTitle(type),
      message: getNotificationMessage(type, report),
      reportId: report.id,
      data: {
        reportId: report.id,
        status: report.status,
        priority: report.priority,
        trackingId: report.trackingId,
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);

    // Send push notification
    await sendPushNotification(recipientId, notification.title, notification.message);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Send push notification to user
 */
async function sendPushNotification(userId: string, title: string, message: string): Promise<void> {
  try {
    // Get user's push tokens (requires separate storage)
    // For now, this is a placeholder for integration with expo-notifications

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        sound: true,
        badge: 1,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.warn('Could not send push notification:', error);
  }
}

/**
 * Get notification title based on type
 */
function getNotificationTitle(type: string): string {
  const titles: Record<string, string> = {
    NEW_REPORT: 'New Leakage Report',
    TASK_ASSIGNED: 'Task Assigned',
    SUBMISSION_APPROVED: 'Repair Approved',
    SUBMISSION_REJECTED: 'Repair Rejected',
    TASK_COMPLETED: 'Task Completed',
    USER_APPROVED: 'Account Approved',
    ESCALATION: 'Report Escalated',
  };
  return titles[type] || 'New Notification';
}

/**
 * Get notification message based on type and report
 */
function getNotificationMessage(type: string, report: LeakageReport): string {
  const messages: Record<string, string> = {
    NEW_REPORT: `New ${report.priority} priority leakage report at ${report.location.address || 'reported location'}`,
    TASK_ASSIGNED: `You have been assigned to resolve report ${report.trackingId}`,
    SUBMISSION_APPROVED: `Your repair submission for ${report.trackingId} has been approved`,
    SUBMISSION_REJECTED: `Your repair submission for ${report.trackingId} was rejected. Please review and resubmit.`,
    TASK_COMPLETED: `Report ${report.trackingId} has been completed`,
    USER_APPROVED: 'Your account has been approved. You can now log in.',
    ESCALATION: `Report ${report.trackingId} has been escalated`,
  };
  return messages[type] || 'You have a new notification';
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      isRead: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

/**
 * Get unread notifications for user
 */
export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as Notification);
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    return [];
  }
}

/**
 * Subscribe to real-time notifications for user
 */
export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: Notification) => void
): () => void {
  // This would use Firestore real-time listeners
  // Return unsubscribe function
  return () => {};
}
