import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import SplashScreen from './src/screens/SplashScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { getStoredLanguage, AppLanguage } from './src/services/languageService';
import { recoverPendingMediaResult } from './src/services/ImageService';
import { saveReportDraftImage } from './src/services/reportDraftService';

function AppContent() {
  const { colors } = useTheme();
  const [bootState, setBootState] = useState<'loading' | 'splash' | 'language' | 'tutorial' | 'ready'>('loading');

  useEffect(() => {
    let splashTimer: ReturnType<typeof setTimeout> | undefined;

    const initialize = async () => {
      try {
        const pendingMedia = await recoverPendingMediaResult();
        if (pendingMedia) {
          await saveReportDraftImage(pendingMedia);
        }

        const hasSeenTutorial = await AsyncStorage.getItem('majiscope_tutorial_seen');
        const language = await getStoredLanguage();

        if (language === null) {
          setBootState('language');
          return;
        }

        if (hasSeenTutorial === null) {
          setBootState('splash');
          splashTimer = setTimeout(() => {
            setBootState('tutorial');
          }, 3500);
          return;
        }

        // Returning users should not see the splash again after Android restarts the app.
        setBootState('ready');
      } catch (error) {
        console.error('Error initializing app:', error);
        setBootState('ready');
      }
    };

    initialize();

    return () => {
      if (splashTimer) {
        clearTimeout(splashTimer);
      }
    };
  }, []);

  const handleTutorialComplete = async () => {
    try {
      await AsyncStorage.setItem('majiscope_tutorial_seen', 'true');
      setBootState('ready');
    } catch (error) {
      console.error('Error saving tutorial status:', error);
      setBootState('ready');
    }
  };

  const handleLanguageSelected = async (_language: AppLanguage) => {
    const hasSeenTutorial = await AsyncStorage.getItem('majiscope_tutorial_seen');
    if (hasSeenTutorial === null) {
      setBootState('splash');
      setTimeout(() => {
        setBootState('tutorial');
      }, 3500);
      return;
    }
    setBootState('ready');
  };

  if (bootState === 'loading') {
    return null;
  }

  if (bootState === 'splash') {
    return <SplashScreen onFinish={() => setBootState('tutorial')} />;
  }

  if (bootState === 'language') {
    return <LanguageSelectionScreen onComplete={handleLanguageSelected} />;
  }

  if (bootState === 'tutorial') {
    return <TutorialScreen onComplete={handleTutorialComplete} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <AppNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});