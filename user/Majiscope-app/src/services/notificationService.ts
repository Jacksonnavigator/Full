import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiDelete, apiGet, apiPost } from './apiClient';
import { getEndpointUrl } from './backendConfig';

export interface NotificationItem {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  data?: Record<string, unknown> | null;
  link?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationListResponse {
  total: number;
  items: NotificationItem[];
}

const NOTIFICATION_CACHE_KEY = 'majiscope_notifications_v1';

export async function fetchNotifications(limit = 20): Promise<NotificationItem[]> {
  try {
    const response = await apiGet<NotificationListResponse>(getEndpointUrl('/api/notifications'), {
      requiresAuth: true,
      params: {
        limit,
        skip: 0,
      },
    });

    const items = response.items || [];
    await AsyncStorage.setItem(NOTIFICATION_CACHE_KEY, JSON.stringify(items));
    return items;
  } catch (error) {
    console.warn('[NotificationService] Failed to fetch notifications:', error);
    const cached = await AsyncStorage.getItem(NOTIFICATION_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as NotificationItem[];
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const response = await apiGet<{ unread: number }>(getEndpointUrl('/api/notifications/unread-count'), {
      requiresAuth: true,
    });
    return response.unread || 0;
  } catch (error) {
    console.warn('[NotificationService] Failed to get unread count:', error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<NotificationItem | null> {
  try {
    return await apiPost<NotificationItem>(getEndpointUrl(`/api/notifications/${notificationId}/mark-as-read`), undefined, {
      requiresAuth: true,
    });
  } catch (error) {
    console.warn('[NotificationService] Failed to mark notification as read:', error);
    return null;
  }
}

export async function registerPushToken(
  token: string,
  options?: { platform?: string; deviceName?: string; deviceId?: string; appRole?: string }
): Promise<void> {
  // Anonymous citizen app users are not authenticated; backend push registration requires auth.
  if (!token || token === 'local-placeholder-token') {
    return;
  }

  try {
    await apiPost(
      getEndpointUrl('/api/push-tokens/register'),
      {
        expo_push_token: token,
        platform: options?.platform || 'expo',
        device_name: options?.deviceName || 'mobile-device',
        device_id: options?.deviceId || undefined,
        app_role: options?.appRole || 'anonymous_user',
      },
      {
        requiresAuth: true,
      }
    );
  } catch (error) {
    console.warn('[NotificationService] Failed to register push token:', error);
  }
}

export async function deactivatePushToken(token: string): Promise<void> {
  try {
    await apiDelete(getEndpointUrl('/api/push-tokens/deactivate'), {
      requiresAuth: false,
      params: {
        expo_push_token: token,
      },
    });
  } catch (error) {
    console.warn('[NotificationService] Failed to deactivate push token:', error);
  }
}
