import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import SplashScreen from './src/screens/SplashScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { getStoredLanguage, AppLanguage } from './src/services/languageService';
import { registerPushToken } from './src/services/notificationService';

function AppContent() {
  const { colors } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial before
    const checkFirstLaunch = async () => {
      try {
        const hasSeenTutorial = await AsyncStorage.getItem('hydranet_tutorial_seen');
        const language = await getStoredLanguage();
        if (language === null) {
          setShowLanguageSelection(true);
          return;
        }
        if (hasSeenTutorial === null) {
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      }
    };

    // Wait for splash screen to finish
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      checkFirstLaunch();
      setAppReady(true);
    }, 3500); // 500ms fade in + 3000ms display + 500ms fade out = 4000ms total, but we check at 3500ms

    return () => clearTimeout(splashTimer);
  }, []);

  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem('hydranet_tutorial_seen', 'true');
      setShowTutorial(false);
    } catch (error) {
      console.error('Error saving tutorial status:', error);
      setShowTutorial(false);
    }
  };

  const handleLanguageSelected = async (_language: AppLanguage) => {
    setShowLanguageSelection(false);
    try {
      await registerPushToken('local-placeholder-token', {
        platform: Platform.OS,
        deviceName: 'mobile-device',
        appRole: 'anonymous_user',
      });
    } catch (error) {
      console.warn('Unable to register push token during onboarding:', error);
    }
    const hasSeenTutorial = await AsyncStorage.getItem('hydranet_tutorial_seen');
    if (hasSeenTutorial === null) {
      setShowTutorial(true);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (showLanguageSelection) {
    return <LanguageSelectionScreen onComplete={handleLanguageSelected} />;
  }

  if (showTutorial) {
    return <TutorialScreen onComplete={handleTutorialComplete} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});