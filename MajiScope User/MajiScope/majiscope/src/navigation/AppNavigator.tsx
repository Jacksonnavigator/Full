import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme, useNavigation } from '@react-navigation/native';
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

const RootStack = createNativeStackNavigator();
const InternalStack = createNativeStackNavigator();
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
    headerBackground: () => <GradientHeaderBackground />,
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: '700' as const, fontSize: 17 },
    headerShadowVisible: false,
  };
}

function LanguageSelectionModal() {
  const navigation = useNavigation<any>();

  const handleComplete = () => {
    navigation.goBack();
  };

  return <LanguageSelectionScreen onComplete={handleComplete} />;
}

function ReportStackNavigator() {
  const { colors } = useTheme();
  return (
    <InternalStack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <InternalStack.Screen name="ReportForm" component={ReportScreen} options={{ headerShown: false }} />
      <InternalStack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ title: 'Report Details' }} />
    </InternalStack.Navigator>
  );
}

function HistoryStackNavigator() {
  const { colors } = useTheme();
  return (
    <InternalStack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <InternalStack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
      <InternalStack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ title: 'Report Details' }} />
    </InternalStack.Navigator>
  );
}

function EmergencyContactStackNavigator() {
  const { colors } = useTheme();
  return (
    <InternalStack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <InternalStack.Screen name="EmergencyContactScreenTab" component={EmergencyContactScreen} options={{ headerShown: false }} />
    </InternalStack.Navigator>
  );
}

function TermsStackNavigator() {
  const { colors } = useTheme();
  return (
    <InternalStack.Navigator screenOptions={{ ...stackScreenOptions(), contentStyle: { backgroundColor: colors.background } }}>
      <InternalStack.Screen name="TermsScreenTab" component={TermsScreen} options={{ headerShown: false }} />
    </InternalStack.Navigator>
  );
}

function MainTabsNavigator() {
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

export default function AppNavigator() {
  const { colors, theme } = useTheme();
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
      <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <RootStack.Screen name="MainTabs" component={MainTabsNavigator} />
        <RootStack.Screen name="LanguageSelection" component={LanguageSelectionModal} options={{ presentation: 'modal', headerShown: false }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
