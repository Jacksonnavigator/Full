/**
 * HydraNet Push Notifications Service
 * Handles device token registration, push delivery, and in-app notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User } from './types';

interface DeviceToken {
  userId: string;
  userRole: string;
  deviceToken: string;
  deviceModel?: string;
  osType: string;
  isActive: boolean;
  registeredAt: string;
  lastUsedAt: string;
}

interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: string;
  badge?: number;
}

/**
 * Register device token for push notifications
 * Call this during login / app startup
 */
export async function registerDeviceToken(user: User): Promise<string | null> {
  try {
    // Check if notifications are available
    if (!Device.isDevice) {
      console.log('Push notifications not available on simulator/web');
      return null;
    }

    // Request permission
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Push notification permission denied:', status);
      return null;
    }

    // Get the push token from Expo
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Store token in Firestore
    const tokenDoc: DeviceToken = {
      userId: user.id,
      userRole: user.role,
      deviceToken: token,
      deviceModel: Device.modelName || 'Unknown',
      osType: Device.osName || 'Unknown',
      isActive: true,
      registeredAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'deviceTokens'), tokenDoc);
    console.log('Device token registered:', docRef.id);

    // Set up notification handler
    setupNotificationHandlers();

    return token;
  } catch (error) {
    console.error('Error registering device token:', error);
    return null;
  }
}

/**
 * Unregister device token on logout
 */
export async function unregisterDeviceToken(userId: string): Promise<void> {
  try {
    const q = query(collection(db, 'deviceTokens'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    snapshot.docs.forEach(async (doc) => {
      await updateDoc(doc.ref, { isActive: false });
    });
  } catch (error) {
    console.error('Error unregistering device token:', error);
  }
}

/**
 * Setup handlers for incoming notifications
 */
function setupNotificationHandlers(): void {
  // Handle notification received while app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      // Log to audit
      if (notification.request.content.data?.reportId) {
        try {
          const reportId = notification.request.content.data.reportId as string;
          // You can log this to auditService if needed
        } catch (e) {
          console.error('Error logging notification:', e);
        }
      }

      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    },
  });

  // Handle notification tapped
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    console.log('Notification tapped:', data);

    // Navigate to relevant screen based on data
    // This would require access to navigation (handle in Nav layer)
  });

  return () => subscription.remove();
}

/**
 * Send a local test notification (for debugging)
 */
export async function sendLocalNotification(payload: PushPayload): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        sound: payload.sound || 'default',
        badge: payload.badge,
      },
      trigger: { seconds: 2 },
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
}

/**
 * Get registered tokens for a user (for server-side push)
 * Server will call this endpoint to get all active tokens
 */
export async function getActiveTokensForUser(userId: string): Promise<string[]> {
  try {
    const q = query(
      collection(db, 'deviceTokens'),
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data().deviceToken);
  } catch (error) {
    console.error('Error getting active tokens:', error);
    return [];
  }
}

/**
 * Log notification delivery (called by backend via Cloud Function)
 * Tracks delivery success/failure for debugging
 */
export async function logNotificationDelivery(
  userId: string,
  message: string,
  success: boolean,
  error?: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'notificationLogs'), {
      userId,
      message,
      success,
      error: error || null,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Error logging notification:', e);
  }
}
