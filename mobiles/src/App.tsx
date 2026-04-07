import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Network from 'expo-network';
import { AppNavigator } from './navigation/AppNavigator';
import { useTaskStore } from './store/taskStore';
import { configurePushNotifications } from './services/pushNotificationService';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootApp: React.FC = () => {
  const hasHydrated = useTaskStore((state) => state._hasHydrated);
  const isOffline = useTaskStore((state) => state.isOffline);
  const syncOfflineQueue = useTaskStore((state) => state.syncOfflineQueue);

  useEffect(() => {
    const cleanup = configurePushNotifications();
    return cleanup;
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isOffline) {
      void syncOfflineQueue();
    }

    const subscription = Network.addNetworkStateListener((state) => {
      const isBackOnline = Boolean(state.isConnected && (state.isInternetReachable ?? true));
      if (!isBackOnline || useTaskStore.getState().isOffline) {
        return;
      }

      void useTaskStore.getState().syncOfflineQueue();
      void useTaskStore.getState().refreshTasks();
    });

    return () => {
      subscription.remove();
    };
  }, [hasHydrated, isOffline, syncOfflineQueue]);

  const onLayoutRootView = useCallback(async () => {
    if (hasHydrated) {
      // This tells the splash screen to hide immediately! If we do this sooner,
      // the user might see a blank screen while the app is loading its initial state.
      await SplashScreen.hideAsync();
    }
  }, [hasHydrated]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  // No longer needed as we rely on native splash screen
});

