import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import ReportScreen from '../screens/ReportScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import TermsScreen from '../screens/TermsScreen';
import EmergencyContactScreen from '../screens/EmergencyContactScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import FloatingTabBar from './FloatingTabBar';
import { gradients } from '../theme/tokens';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function GradientHeaderBackground() {
  return (
    <LinearGradient
      colors={[...gradients.hero]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    />
  );
}

function stackScreenOptions() {
  return {
    headerShown: false,
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: '700' as const, fontSize: 17 },
    headerShadowVisible: false,
  };
}

function ReportStackNavigator() {
  const { colors } = useTheme();
  const { language } = useAppLanguage();
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="ReportForm" component={ReportScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ title: getText(language, 'Report Details', 'Maelezo ya Ripoti') }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Report"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: 'absolute', backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0 },
      }}
    >
      <Tab.Screen name="Report" component={ReportStackNavigator} />
      <Tab.Screen name="ViewReport" component={HistoryStackNavigator} />
      <Tab.Screen name="Emergency" component={EmergencyContactStackNavigator} />
      <Tab.Screen name="Terms" component={TermsStackNavigator} />
    </Tab.Navigator>
  );
}

function HistoryStackNavigator() {
  const { colors } = useTheme();
  const { language } = useAppLanguage();
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ title: getText(language, 'Report Details', 'Maelezo ya Ripoti') }} />
    </Stack.Navigator>
  );
}

function EmergencyContactStackNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="EmergencyContactScreenTab" component={EmergencyContactScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function TermsStackNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="TermsScreenTab" component={TermsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { colors, theme } = useTheme();
  const { language } = useAppLanguage();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;
  const customTheme = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
  };
  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="LanguageSelection" options={{ title: getText(language, 'Choose Language', 'Chagua Lugha'), presentation: 'modal' }}>
          {(props: any) => <LanguageSelectionScreen {...props} onComplete={async () => props.navigation.goBack()} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
