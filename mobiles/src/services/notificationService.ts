/**
 * HydraNet Notification Service
 * Normalizes backend notifications for the mobile app.
 */

import { apiDelete, apiGet, apiPost } from './apiClient';

interface BackendNotification {
  id: string;
  user_id?: string | null;
  engineer_id?: string | null;
  notification_type?: string;
  title: string;
  message: string;
  is_read?: boolean;
  created_at: string;
  updated_at?: string;
  data?: Record<string, any> | null;
  link?: string | null;
}

interface NotificationListResponse {
  total: number;
  items: BackendNotification[];
}

export interface Notification {
  id: string;
  user_id?: string | null;
  engineer_id?: string | null;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at?: string;
  data?: Record<string, any>;
  link?: string | null;
}

const normalizeNotification = (notification: BackendNotification): Notification => ({
  id: notification.id,
  user_id: notification.user_id ?? null,
  engineer_id: notification.engineer_id ?? null,
  type: notification.notification_type || 'OTHER',
  title: notification.title,
  message: notification.message,
  read: Boolean(notification.is_read),
  created_at: notification.created_at,
  updated_at: notification.updated_at,
  data: notification.data ?? undefined,
  link: notification.link ?? null,
});

/**
 * Get notifications relevant to the signed-in mobile user.
 */
export async function getNotifications(
  filters?: {
    read?: boolean;
    skip?: number;
    limit?: number;
  }
): Promise<Notification[]> {
  try {
    const response = await apiGet<NotificationListResponse>('/api/notifications', {
      params: {
        is_read: filters?.read,
        skip: filters?.skip,
        limit: filters?.limit ?? 100,
      },
    });

    const items = Array.isArray(response?.items) ? response.items : [];
    return items
      .map(normalizeNotification)
      .sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

/**
 * Get unread notification count for the signed-in user.
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const response = await apiGet<{ unread: number }>('/api/notifications/unread-count');
    return typeof response?.unread === 'number' ? response.unread : 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    const notifications = await getNotifications({ read: false, limit: 100 });
    return notifications.filter((notification) => !notification.read).length;
  }
}

/**
 * Mark a notification as read.
 */
export async function markAsRead(notificationId: string): Promise<Notification> {
  try {
    const response = await apiPost<BackendNotification>(`/api/notifications/${notificationId}/mark-as-read`);
    return normalizeNotification(response);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark a list of notifications as read.
 */
export async function markAllAsRead(notifications: Notification[]): Promise<void> {
  if (notifications.every((notification) => notification.read)) {
    return;
  }

  try {
    await apiPost('/api/notifications/mark-all-read');
    return;
  } catch (error) {
    console.error('Error marking all notifications as read via bulk endpoint:', error);
  }

  const unread = notifications.filter((notification) => !notification.read);
  await Promise.all(unread.map((notification) => markAsRead(notification.id)));
}

/**
 * Delete a notification.
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await apiDelete(`/api/notifications/${notificationId}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}
