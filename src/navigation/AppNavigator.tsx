import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoginScreen } from '../screens/LoginScreen';
import { TaskListScreen } from '../screens/TaskListScreen';
import { TaskDetailScreen } from '../screens/TaskDetailScreen';
import { SubmitRepairScreen } from '../screens/SubmitRepairScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UnauthorizedScreen } from '../screens/UnauthorizedScreen';
import { useAuth } from '../hooks/useAuth';
import { EngineerActivityScreen } from '../screens/EngineerActivityScreen';
import { LeaderTeamTasksScreen } from '../screens/LeaderTeamTasksScreen';
import { LeaderReviewScreen } from '../screens/LeaderReviewScreen';
import { LeaderResolveScreen } from '../screens/LeaderResolveScreen';
import { LeaderPerformanceScreen } from '../screens/LeaderPerformanceScreen';
import { DMAManagerReportsScreen } from '../screens/DMAManagerReportsScreen';
import { DMAReportAssignmentScreen } from '../screens/DMAReportAssignmentScreen';
import { colors, typography } from '../theme';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  TaskDetail: { taskId: string };
  ReportAssignment: { reportId: string };
  SubmitRepair: { taskId: string };
  AuditLog: { filter?: string };
  SubmissionReview: { reportId?: string };
  NotificationInbox: undefined;
};

export type EngineerTabParamList = {
  Tasks: undefined;
  Activity: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type LeaderTabParamList = {
  TeamTasks: undefined;
  Review: undefined;
  Resolve: undefined;
  Performance: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const EngineerTab = createBottomTabNavigator<EngineerTabParamList>();
const LeaderTab = createBottomTabNavigator<LeaderTabParamList>();
const DMATab = createBottomTabNavigator<DMATabParamList>();

const EngineerTabs: React.FC = () => (
  <EngineerTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.brandPrimary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: Platform.OS === 'ios' ? 0 : 4,
      },
      tabBarStyle: {
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        paddingTop: 8,
        height: Platform.OS === 'ios' ? 88 : 64,
        backgroundColor: colors.cardLight,
        borderRadius: 28,
        borderTopWidth: 0,
        marginHorizontal: 16,
        marginBottom: 12,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      tabBarIcon: ({ color, size, focused }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'list';
        if (route.name === 'Tasks') {
          iconName = focused ? 'clipboard' : 'clipboard-outline';
        } else if (route.name === 'Activity') {
          iconName = focused ? 'pulse' : 'pulse-outline';
        } else if (route.name === 'Notifications') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={focused ? size + 2 : size} color={color} />;
      }
    })}
  >
    <EngineerTab.Screen
      name="Tasks"
      component={TaskListScreen}
      options={{
        title: 'Tasks',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>Tasks</Text>
      }}
    />
    <EngineerTab.Screen
      name="Activity"
      component={EngineerActivityScreen}
      options={{
        title: 'Activity',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>Activity</Text>
      }}
    />
    <EngineerTab.Screen
      name="Notifications"
      component={NotificationInboxScreen}
      options={{
        title: 'Notifications',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>Alerts</Text>
      }}
    />
    <EngineerTab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold }}>Profile</Text>
      }}
    />
  </EngineerTab.Navigator>
);

const LeaderTabs: React.FC = () => (
  <LeaderTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.brandPrimary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        fontSize: typography.fontSize.xs - 1,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: Platform.OS === 'ios' ? 0 : 4,
      },
      tabBarStyle: {
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        paddingTop: 8,
        height: Platform.OS === 'ios' ? 88 : 64,
        backgroundColor: colors.cardLight,
        borderRadius: 28,
        borderTopWidth: 0,
        marginHorizontal: 16,
        marginBottom: 12,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      tabBarIcon: ({ color, size, focused }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'list';
        if (route.name === 'TeamTasks') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Review') {
          iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
        } else if (route.name === 'Resolve') {
          iconName = focused ? 'build' : 'build-outline';
        } else if (route.name === 'Performance') {
          iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        } else if (route.name === 'Notifications') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={focused ? size + 2 : size} color={color} />;
      }
    })}
  >
    <LeaderTab.Screen
      name="TeamTasks"
      component={LeaderTeamTasksScreen}
      options={{
        title: 'Team Tasks',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Tasks</Text>
      }}
    />
    <LeaderTab.Screen
      name="Review"
      component={LeaderReviewScreen}
      options={{
        title: 'Review',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Review</Text>
      }}
    />
    <LeaderTab.Screen
      name="Resolve"
      component={LeaderResolveScreen}
      options={{
        title: 'Resolve',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Resolve</Text>
      }}
    />
    <LeaderTab.Screen
      name="Performance"
      component={LeaderPerformanceScreen}
      options={{
        title: 'Performance',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Stats</Text>
      }}
    />
    <LeaderTab.Screen
      name="Notifications"
      component={NotificationInboxScreen}
      options={{
        title: 'Notifications',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Alerts</Text>
      }}
    />
    <LeaderTab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Profile</Text>
      }}
    />
  </LeaderTab.Navigator>
);

const DMATabs: React.FC = () => (
  <DMATab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.brandPrimary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        fontSize: typography.fontSize.xs - 1,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: Platform.OS === 'ios' ? 0 : 4,
      },
      tabBarStyle: {
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        paddingTop: 8,
        height: Platform.OS === 'ios' ? 88 : 64,
        backgroundColor: colors.cardLight,
        borderRadius: 28,
        borderTopWidth: 0,
        marginHorizontal: 16,
        marginBottom: 12,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      tabBarIcon: ({ color, size, focused }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'list';
        if (route.name === 'Reports') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'Assignments') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Notifications') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={focused ? size + 2 : size} color={color} />;
      }
    })}
  >
    <DMATab.Screen
      name="Reports"
      component={DMAManagerReportsScreen}
      options={{
        title: 'Reports',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Reports</Text>
      }}
    />
    <DMATab.Screen
      name="Assignments"
      component={LeaderTeamTasksScreen} // TODO: Create DMAAssignmentsScreen
      options={{
        title: 'Assignments',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Assignments</Text>
      }}
    />
    <DMATab.Screen
      name="Notifications"
      component={NotificationInboxScreen}
      options={{
        title: 'Notifications',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Alerts</Text>
      }}
    />
    <DMATab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarLabel: ({ color }) => <Text style={{ color, fontSize: typography.fontSize.xs - 1, fontWeight: typography.fontWeight.semibold }}>Profile</Text>
      }}
    />
  </DMATab.Navigator>
);

const normalizeRoleForRouting = (role?: string) => {
  if (!role) return null;
  const normalized = role.trim().toLowerCase().replace(/\s+/g, '');
  if (normalized === 'teamleader' || normalized === 'team_leader') return 'Team Leader';
  if (normalized === 'engineer') return 'Engineer';
  if (normalized === 'dmamanager' || normalized === 'dma_manager' || normalized === 'dma') return 'DMA Manager';
  return null;
};

const MainTabs: React.FC = () => {
  const { currentUser } = useAuth();
  const normalizedRole = normalizeRoleForRouting(currentUser?.role);

  // Support different user roles
  if (normalizedRole === 'Team Leader') {
    return <LeaderTabs />;
  } else if (normalizedRole === 'Engineer') {
    return <EngineerTabs />;
  } else if (normalizedRole === 'DMA Manager') {
    return <DMATabs />;
  }

  // All other roles are not authorized for the mobile app
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
            name="ReportAssignment"
            component={DMAReportAssignmentScreen}
            options={{ title: 'Assign Report' }}
          />
          <Stack.Screen
            name="SubmitRepair"
            component={SubmitRepairScreen}
            options={{ title: 'Submit Repair' }}
          />
          <Stack.Group
            screenOptions={{
              presentation: 'modal',
              cardOverlayEnabled: true,
              cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            }}
          >
            <Stack.Screen
              name="NotificationInbox"
              component={NotificationInboxScreen}
              options={{ title: 'Notifications' }}
            />
            <Stack.Screen
              name="SubmissionReview"
              component={SubmissionReviewScreen}
              options={{ title: 'Review Submissions' }}
            />
            <Stack.Screen
              name="AuditLog"
              component={AuditLogScreen}
              options={{ title: 'Audit Log' }}
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
