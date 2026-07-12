import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from './AppNavigator';
import { useAuthStore } from '../store/authStore';

type PendingRoute =
  | { name: 'TaskDetail'; params: RootStackParamList['TaskDetail'] }
  | { name: 'DMAReportDetail'; params: RootStackParamList['DMAReportDetail'] }
  | { name: 'NotificationInbox'; params: undefined };

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

let pendingRoute: PendingRoute | null = null;

const extractTaskId = (data?: Record<string, unknown> | null, link?: string | null) => {
  const directReportId = data?.reportId;
  if (typeof directReportId === 'string' && directReportId.trim().length > 0) {
    return directReportId;
  }

  if (typeof link === 'string') {
    const match = link.match(/\/reports\/([^/?#]+)/i);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const navigateOrQueue = (route: PendingRoute) => {
  if (navigationRef.isReady()) {
    if (route.name === 'TaskDetail') {
      navigationRef.navigate('TaskDetail', route.params);
      return;
    }
    if (route.name === 'DMAReportDetail') {
      navigationRef.navigate('DMAReportDetail', route.params);
      return;
    }

    navigationRef.navigate('NotificationInbox');
    return;
  }

  pendingRoute = route;
};

export const openNotificationTarget = (data?: Record<string, unknown> | null, link?: string | null) => {
  const taskId = extractTaskId(data, link);
  if (taskId) {
    const currentUser = useAuthStore.getState().currentUser as Record<string, unknown> | null;
    const normalizedRole = String(currentUser?.role || '').toLowerCase().replace(/\s+/g, '_');
    if (normalizedRole === 'dma_manager') {
      navigateOrQueue({ name: 'DMAReportDetail', params: { reportId: taskId } });
      return;
    }
    navigateOrQueue({ name: 'TaskDetail', params: { taskId } });
    return;
  }

  navigateOrQueue({ name: 'NotificationInbox', params: undefined });
};

export const flushPendingNavigation = () => {
  if (!pendingRoute || !navigationRef.isReady()) {
    return;
  }

  const route = pendingRoute;
  pendingRoute = null;
  navigateOrQueue(route);
};
