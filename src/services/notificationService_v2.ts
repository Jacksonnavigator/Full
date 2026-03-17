/**
 * HydraNet Notification Service
 * Handles notifications using backend API
 * Uses HydraNet Backend API (FastAPI)
 */

import { apiGet, apiPost, apiPut } from './apiClient';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

/**
 * Get user notifications
 */
export async function getNotifications(filters?: {
  read?: boolean;
  skip?: number;
  limit?: number;
}): Promise<Notification[]> {
  try {
    const response = await apiGet<any>('/api/notifications', {
      params: filters,
    });
    // Support both { success, data } and array responses
    if (Array.isArray(response)) {
      return response;
    }
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const response = await apiGet<{ count: number }>('/api/notifications/unread/count');
    return response.count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<Notification> {
  try {
    const response = await apiPut<Notification>(
      `/api/notifications/${notificationId}`,
      { read: true }
    );

    return response;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
  try {
    await apiPut('/api/notifications/mark-all-read', {});
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await apiPost(`/api/notifications/${notificationId}/delete`, {});
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

/**
 * Subscribe to notifications (polling-based)
 * Call this periodically to check for new notifications
 */
export async function pollNotifications(
  onNewNotifications?: (notifications: Notification[]) => void
): Promise<Notification[]> {
  try {
    const notifications = await getNotifications();
    if (onNewNotifications) {
      onNewNotifications(notifications);
    }
    return notifications;
  } catch (error) {
    console.error('Error polling notifications:', error);
    return [];
  }
}
