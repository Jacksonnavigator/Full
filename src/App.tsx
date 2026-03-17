import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppNavigator } from './navigation/AppNavigator';
import { useTaskStore } from './store/taskStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const RootApp: React.FC = () => {
  const hasHydrated = useTaskStore((state) => state._hasHydrated);

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

