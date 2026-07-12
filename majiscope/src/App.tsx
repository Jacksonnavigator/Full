import React, { useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, AppState, type AppStateStatus, Image, Text } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Network from 'expo-network';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigator';
import { flushPendingNavigation, navigationRef } from './navigation/navigationRef';
import { useTaskStore } from './store/taskStore';
import { useAuthStore } from './store/authStore';
import { useDMAStore } from './store/dmaStore';
import { LanguageProvider } from './context/LanguageContext';
import { configurePushNotifications } from './services/pushNotificationService';
import { BrandWordmark } from './components/shared/BrandWordmark';
import { colors } from './theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootApp: React.FC = () => {
  const hasHydrated = useTaskStore((state) => state._hasHydrated);
  const isOffline = useTaskStore((state) => state.isOffline);
  const syncOfflineQueue = useTaskStore((state) => state.syncOfflineQueue);
  const refreshTasks = useTaskStore((state) => state.refreshTasks);
  const refreshDMAData = useDMAStore((state) => state.refreshAllData);
  const currentUser = useAuthStore((state) => state.currentUser);
  const lastAutoRefreshAt = useRef(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const splashHiddenRef = useRef(false);

  useEffect(() => {
    const cleanup = configurePushNotifications();
    return cleanup;
  }, []);

  const refreshLiveData = useCallback(
    async (force = false) => {
      if (!hasHydrated || !currentUser?.id || useTaskStore.getState().isOffline) {
        return;
      }

      const now = Date.now();
      if (!force && now - lastAutoRefreshAt.current < 10000) {
        return;
      }

      lastAutoRefreshAt.current = now;
      const normalizedRole = String(currentUser.role || '').toLowerCase().replace(/\s+/g, '_');
      if (normalizedRole === 'dma_manager') {
        await refreshDMAData();
        return;
      }

      await syncOfflineQueue();
      await refreshTasks();
    },
    [currentUser?.id, currentUser?.role, hasHydrated, refreshDMAData, refreshTasks, syncOfflineQueue]
  );

  useEffect(() => {
    if (!hasHydrated || !currentUser?.id) {
      return;
    }

    void refreshLiveData(true);
  }, [currentUser?.id, hasHydrated, refreshLiveData]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isOffline) {
      void syncOfflineQueue();
    }

    const subscription = Network.addNetworkStateListener((state) => {
      const isBackOnline = Boolean(state.isConnected && (state.isInternetReachable ?? true));
      if (!isBackOnline || useTaskStore.getState().isOffline || !useAuthStore.getState().currentUser?.id) {
        return;
      }

      void refreshLiveData(true);
    });

    return () => {
      subscription.remove();
    };
  }, [hasHydrated, isOffline, refreshLiveData, syncOfflineQueue]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const wasBackgrounded =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';

      appStateRef.current = nextAppState;

      if (nextAppState === 'active' && wasBackgrounded) {
        void refreshLiveData(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshLiveData]);

  const onLayoutRootView = useCallback(async () => {
    if (!splashHiddenRef.current) {
      splashHiddenRef.current = true;
      await SplashScreen.hideAsync();
    }
  }, []);

  if (!hasHydrated) {
    return (
      <View style={styles.root} onLayout={onLayoutRootView}>
        <View style={styles.loadingSurface}>
          <View style={styles.loadingGlowLarge} />
          <View style={styles.loadingGlowSmall} />
          <View style={styles.loadingLogoWrap}>
            <Image source={require('../assets/icon.png')} style={styles.loadingLogo} resizeMode="contain" />
          </View>
          <BrandWordmark size="lg" surface="light" />
          <Text style={styles.loadingTagline}>Water Infrastructure Intelligence</Text>
          <Text style={styles.loadingCopy}>Preparing your workspace and syncing live field data.</Text>
        </View>
      </View>
    );
  }

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.cardLight,
      text: colors.foreground,
      border: colors.border,
      primary: colors.primary,
      notification: colors.destructive,
    },
  };

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <LanguageProvider>
          <NavigationContainer
            ref={navigationRef}
            theme={navigationTheme}
            onReady={flushPendingNavigation}
          >
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </LanguageProvider>
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingSurface: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff8ff',
    paddingHorizontal: 28,
  },
  loadingGlowLarge: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(14, 165, 233, 0.10)',
    top: 84,
    right: -46,
  },
  loadingGlowSmall: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(45, 212, 191, 0.10)',
    bottom: 52,
    left: -30,
  },
  loadingLogoWrap: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  loadingLogo: {
    width: 64,
    height: 64,
  },
  loadingTagline: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#4f96b8',
    textAlign: 'center',
  },
  loadingCopy: {
    marginTop: 14,
    fontSize: 14,
    lineHeight: 21,
    color: '#5b7083',
    textAlign: 'center',
    maxWidth: 280,
  },
});

