import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { LoginScreen } from '../screens/LoginScreen';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { SubmitRepairScreen } from '../screens/SubmitRepairScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UnauthorizedScreen } from '../screens/UnauthorizedScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import { useAuth } from '../hooks/useAuth';
import { LeaderTeamTasksScreen } from '../screens/LeaderTeamTasksScreen';
import { LeaderReviewScreen } from '../screens/LeaderReviewScreen';
import { LeaderPerformanceScreen } from '../screens/LeaderPerformanceScreen';
import { NotificationInboxScreen } from '../screens/NotificationInboxScreen';
import { DMADashboardScreen } from '../screens/DMADashboardScreen';
import { DMAReportsScreen } from '../screens/DMAReportsScreen';
import { DMAReportDetailScreen } from '../screens/DMAReportDetailScreen';
import { DMAEngineersScreen } from '../screens/DMAEngineersScreen';
import { DMATeamsScreen } from '../screens/DMATeamsScreen';
import { DMAProfileScreen } from '../screens/DMAProfileScreen';
import { colors, typography } from '../theme';
import EngineerFloatingTabBar from './EngineerFloatingTabBar';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  TaskDetail: { taskId: string };
  SubmitRepair: { taskId: string };
  DMAReportDetail: { reportId: string };
  NotificationInbox: undefined;
  LanguageSelection: undefined;
};

export type EngineerTabParamList = {
  Tasks: undefined;
  Profile: undefined;
};

export type LeaderTabParamList = {
  TeamTasks: undefined;
  Review: undefined;
  Performance: undefined;
  Profile: undefined;
};

export type DMATabParamList = {
  Dashboard: undefined;
  Reports: undefined;
  People: undefined;
  Teams: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootStack = createNativeStackNavigator();
const EngineerTab = createBottomTabNavigator<EngineerTabParamList>();
const LeaderTab = createBottomTabNavigator<LeaderTabParamList>();
const DMATab = createBottomTabNavigator<DMATabParamList>();

function LanguageSelectionPlaceholder() {
  const navigation = useNavigation<any>();
  return (
    <React.Fragment>
      {/* Language selection modal would go here */}
    </React.Fragment>
  );
}

const tabScreenOptions = {
  headerShown: false,
  sceneStyle: {
    backgroundColor: colors.background,
  },
} as const;

const EngineerTabs: React.FC = () => (
  <EngineerTab.Navigator
    tabBar={(props) => <EngineerFloatingTabBar {...props} />}
    screenOptions={tabScreenOptions}
  >
    <EngineerTab.Screen name="Tasks" component={TaskListScreen} options={{ title: 'Tasks' }} />
    <EngineerTab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </EngineerTab.Navigator>
);

const LeaderTabs: React.FC = () => (
  <LeaderTab.Navigator
    tabBar={(props) => <EngineerFloatingTabBar {...props} />}
    screenOptions={tabScreenOptions}
  >
    <LeaderTab.Screen name="TeamTasks" component={LeaderTeamTasksScreen} options={{ title: 'Team Tasks' }} />
    <LeaderTab.Screen name="Review" component={LeaderReviewScreen} options={{ title: 'Review' }} />
    <LeaderTab.Screen name="Performance" component={LeaderPerformanceScreen} options={{ title: 'Performance' }} />
    <LeaderTab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </LeaderTab.Navigator>
);

const DMATabs: React.FC = () => (
  <DMATab.Navigator
    tabBar={(props) => <EngineerFloatingTabBar {...props} />}
    screenOptions={tabScreenOptions}
  >
    <DMATab.Screen name="Dashboard" component={DMADashboardScreen} options={{ title: 'Dashboard' }} />
    <DMATab.Screen name="Reports" component={DMAReportsScreen} options={{ title: 'Reported Leakage' }} />
    <DMATab.Screen name="People" component={DMAEngineersScreen} options={{ title: 'Engineers' }} />
    <DMATab.Screen name="Teams" component={DMATeamsScreen} options={{ title: 'Teams' }} />
    <DMATab.Screen name="Profile" component={DMAProfileScreen} options={{ title: 'Profile' }} />
  </DMATab.Navigator>
);

const normalizeRoleForRouting = (role?: string) => {
  if (!role) return null;
  const normalized = role.trim().toLowerCase().replace(/\s+/g, '');
  if (normalized === 'teamleader' || normalized === 'team_leader') return 'Team Leader';
  if (normalized === 'dmamanager' || normalized === 'dma_manager' || normalized === 'dma') return 'DMA Manager';
  if (normalized === 'engineer') return 'Engineer';
  return null;
};

const MainTabs: React.FC = () => {
  const { currentUser } = useAuth();
  const normalizedRole = normalizeRoleForRouting(currentUser?.role);

  if (normalizedRole === 'Team Leader') {
    return <LeaderTabs />;
  } else if (normalizedRole === 'Engineer') {
    return <EngineerTabs />;
  } else if (normalizedRole === 'DMA Manager') {
    return <DMATabs />;
  }

  return <UnauthorizedScreen />;
};

export const AppNavigator: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.cardLight,
        },
        headerTintColor: colors.brandPrimary,
        headerTitleStyle: {
          fontWeight: typography.fontWeight.bold,
          fontSize: typography.fontSize.lg,
        },
        headerShadowVisible: true,
      }}
    >
      {currentUser ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{ title: 'Task Details' }}
          />
          <Stack.Screen
            name="SubmitRepair"
            component={SubmitRepairScreen}
            options={{ title: 'Submit Repair' }}
          />
          <Stack.Screen
            name="DMAReportDetail"
            component={DMAReportDetailScreen}
            options={{
              title: 'DMA Report',
              headerBackTitle: 'Back',
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
          <Stack.Screen
            name="NotificationInbox"
            component={NotificationInboxScreen}
            options={{ title: 'Notifications' }}
          />
          <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
            <Stack.Screen
              name="LanguageSelection"
              component={LanguageSelectionScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};
