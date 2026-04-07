import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { apiPost } from './apiClient';

const PUSH_TOKEN_STORAGE_KEY = 'hydranetPushToken';

let listenersConfigured = false;
let responseSubscription: Notifications.EventSubscription | null = null;
let receiveSubscription: Notifications.EventSubscription | null = null;
let missingProjectIdWarned = false;
let expoGoWarned = false;

const getProjectId = (): string | null =>
  Constants.easConfig?.projectId ??
  (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId ??
  null;

export function configurePushNotifications() {
  if (listenersConfigured) {
    return () => {};
  }

  listenersConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    void Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0ea5e9',
    });
  }

  receiveSubscription = Notifications.addNotificationReceivedListener((notification) => {
    console.log('[PushNotifications] Received notification:', notification.request.identifier);
  });

  responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('[PushNotifications] Notification interaction:', response.notification.request.identifier);
  });

  return () => {
    receiveSubscription?.remove();
    responseSubscription?.remove();
    listenersConfigured = false;
    receiveSubscription = null;
    responseSubscription = null;
  };
}

export async function registerPushNotificationsForCurrentUser(user?: {
  role?: string | null;
}): Promise<string | null> {
  // Expo Go no longer supports remote push notifications in SDK 53+.
  if (Constants.appOwnership === 'expo') {
    if (!expoGoWarned) {
      console.log('[PushNotifications] Skipping remote push token registration in Expo Go.');
      expoGoWarned = true;
    }
    return null;
  }

  if (!Device.isDevice) {
    console.log('[PushNotifications] Skipping registration on simulator/emulator.');
    return null;
  }

  try {
    const projectId = getProjectId();
    if (!projectId) {
      if (!missingProjectIdWarned) {
        console.warn(
          '[PushNotifications] Missing EAS projectId. Set it in app config before enabling remote push tokens.'
        );
        missingProjectIdWarned = true;
      }
      return null;
    }

    const existingPermissions = await Notifications.getPermissionsAsync();
    let finalStatus = existingPermissions.status;

    if (finalStatus !== 'granted') {
      const requestedPermissions = await Notifications.requestPermissionsAsync();
      finalStatus = requestedPermissions.status;
    }

    if (finalStatus !== 'granted') {
      console.log('[PushNotifications] Permission not granted:', finalStatus);
      return null;
    }

    const expoPushToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    const deviceId =
      Device.osInternalBuildId ||
      Device.osBuildId ||
      Device.modelId ||
      Device.deviceName ||
      expoPushToken;

    await apiPost('/api/push-tokens/register', {
      expo_push_token: expoPushToken,
      platform: Platform.OS,
      device_name: Device.deviceName || Device.modelName || 'Unknown device',
      device_id: deviceId,
      app_role: user?.role || null,
    });

    await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, expoPushToken);
    return expoPushToken;
  } catch (error) {
    console.warn('[PushNotifications] Unable to register push token:', error);
    return null;
  }
}

export async function unregisterPushNotificationsForCurrentUser(): Promise<void> {
  try {
    const expoPushToken = await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
    if (!expoPushToken) {
      return;
    }

    await apiPost(
      '/api/push-tokens/deactivate',
      undefined,
      { params: { expo_push_token: expoPushToken } }
    );
  } catch (error) {
    console.warn('[PushNotifications] Unable to deactivate push token:', error);
  } finally {
    await AsyncStorage.removeItem(PUSH_TOKEN_STORAGE_KEY);
  }
}
