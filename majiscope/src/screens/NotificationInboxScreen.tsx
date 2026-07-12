import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {
  Notification,
  getNotificationsPage,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../services/notificationService';
import { PaginationBar } from '../components/shared/PaginationBar';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { formatTanzaniaDate } from '../lib/dateTime';
import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AppHeader from '../components/AppHeader';

const TYPE_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  info: 'notifications-outline',
  warning: 'alert-circle-outline',
  success: 'checkmark-circle-outline',
  error: 'close-circle-outline',
  ASSIGNMENT: 'clipboard-outline',
  SUBMISSION: 'document-text-outline',
  APPROVAL: 'checkmark-circle-outline',
  REJECTION: 'close-circle-outline',
  STATUS_CHANGE: 'swap-horizontal-outline',
  OTHER: 'notifications-outline',
};

const TYPE_COLOR: Record<string, string> = {
  info: '#3b82f6',
  warning: '#f59e0b',
  success: '#10b981',
  error: '#ef4444',
  ASSIGNMENT: '#3b82f6',
  SUBMISSION: '#ec4899',
  APPROVAL: '#10b981',
  REJECTION: '#ef4444',
  STATUS_CHANGE: '#f59e0b',
  OTHER: '#64748b',
};

const PAGE_SIZE = 12;

export const NotificationInboxScreen: React.FC = () => {
  const { language } = useAppLanguage();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentUser } = useAuth();
  const authUser = useAuthStore((state) => state.currentUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [listTotal, setListTotal] = useState(0);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, [contentAnim, headerAnim]);

  useEffect(() => {
    setPage(0);
  }, [unreadOnly]);

  const loadNotifications = React.useCallback(
    async (showRefresh = false) => {
      if (!currentUser?.id) {
        setNotifications([]);
        setListTotal(0);
        setUnreadTotal(0);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (showRefresh) {
        setRefreshing(true);
      }

      try {
        const [{ items, total }, unread] = await Promise.all([
          getNotificationsPage({
            read: unreadOnly ? false : undefined,
            skip: page * PAGE_SIZE,
            limit: PAGE_SIZE,
          }),
          getUnreadCount(),
        ]);
        setNotifications(items);
        setListTotal(total);
        setUnreadTotal(unread);
      } catch (error) {
        console.warn(
          '[NotificationInbox] Notifications unavailable:',
          error instanceof Error ? error.message : error
        );
        setNotifications([]);
        setListTotal(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentUser?.id, page, unreadOnly]
  );

  useFocusEffect(
    React.useCallback(() => {
      void loadNotifications();
      const interval = setInterval(() => {
        void loadNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }, [loadNotifications])
  );

  const totalPages = Math.max(1, Math.ceil(listTotal / PAGE_SIZE));
  const filteredNotifications = notifications;
  const normalizedRole = String(authUser?.role || '').toLowerCase().replace(/\s+/g, '_');
  const isDMA = normalizedRole === 'dma_manager';
  const dmaName =
    String(authUser?.dma_name || (authUser as any)?.dmaName || '').trim() || 'Assigned DMA';
  const utilityName =
    String(authUser?.utility_name || (authUser as any)?.utilityName || '').trim() || 'Assigned Utility';

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('[NotificationInbox] Error marking notification as read:', error);
    }
  };

  const openNotificationTarget = (notification: Notification) => {
    const reportId = notification.data?.reportId;
    if (typeof reportId === 'string' && reportId.length > 0) {
      const normalizedRole = String(authUser?.role || '').toLowerCase().replace(/\s+/g, '_');
      if (normalizedRole === 'dma_manager') {
        navigation.navigate('DMAReportDetail', { reportId });
      } else {
        navigation.navigate('TaskDetail', { taskId: reportId });
      }
      return;
    }

    if (notification.link) {
      const match = notification.link.match(/\/reports\/([^/?#]+)/i);
      const linkedReportId = match?.[1];
      if (linkedReportId) {
        const normalizedRole = String(authUser?.role || '').toLowerCase().replace(/\s+/g, '_');
        if (normalizedRole === 'dma_manager') {
          navigation.navigate('DMAReportDetail', { reportId: linkedReportId });
        } else {
          navigation.navigate('TaskDetail', { taskId: linkedReportId });
        }
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(notifications);
      setUnreadTotal(0);
      await loadNotifications();
    } catch (error) {
      console.error('[NotificationInbox] Error marking all as read:', error);
    }
  };

  const renderNotification = ({
    item,
    index,
  }: {
    item: Notification;
    index: number;
  }) => {
    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 45,
      useNativeDriver: true,
    }).start();

    const timestamp = new Date(item.created_at);
    const timeAgo = formatTimeAgo(timestamp);
    const iconName = TYPE_ICON[item.type] || TYPE_ICON.OTHER;
    const color = TYPE_COLOR[item.type] || TYPE_COLOR.OTHER;

    return (
      <Animated.View
        style={{
          opacity: itemAnim,
          transform: [
            { translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
          ],
        }}
      >
        <Pressable
          style={[styles.notificationItem, !item.read && styles.notificationItemUnread]}
          onPress={async () => {
            await handleMarkAsRead(item.id);
            openNotificationTarget(item);
          }}
        >
          <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
            <Ionicons name={iconName} size={20} color={color} />
          </View>

          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.time}>{timeAgo}</Text>
            </View>
            <Text style={styles.body} numberOfLines={2}>
              {item.message}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const isEmptyState = !loading && filteredNotifications.length === 0;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        style={styles.listSurface}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, isEmptyState && styles.listContentEmpty]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadNotifications(true)}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <Animated.View
              style={{
                opacity: headerAnim,
                transform: [
                  {
                    translateY: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              }}
            >
              <AppHeader
                title={getText(language, isDMA ? 'Alerts Center' : 'Notifications', isDMA ? 'Kituo cha Arifa' : 'Arifa')}
                subtitle={
                  isDMA
                    ? getText(language, 'DMA manager alerts and routing', 'Arifa za meneja wa DMA na maelekezo')
                    : unreadTotal > 0
                    ? getText(language, `${unreadTotal} unread`, `${unreadTotal} haijasomwa`)
                    : getText(language, 'All caught up', 'Zote zimekamilika')
                }
              />
            </Animated.View>

            <Animated.View
              style={{
                opacity: contentAnim,
                transform: [
                  {
                    translateY: contentAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.controlsRow}>
                <TouchableOpacity
                  style={[styles.filterButton, !unreadOnly && styles.filterButtonActive]}
                  onPress={() => setUnreadOnly(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterButtonText, !unreadOnly && styles.filterButtonTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterButton, unreadOnly && styles.filterButtonActive]}
                  onPress={() => setUnreadOnly(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterButtonText, unreadOnly && styles.filterButtonTextActive]}>
                    Unread
                  </Text>
                </TouchableOpacity>

                {unreadTotal > 0 && (
                  <TouchableOpacity
                    style={styles.markAllButton}
                    onPress={() => void handleMarkAllAsRead()}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark-done-outline" size={15} color={colors.primary} />
                    <Text style={styles.markAllButtonText}>Mark all read</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderNotification}
        ListFooterComponent={
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={listTotal}
            pageSize={PAGE_SIZE}
            onPrev={() => setPage((current) => Math.max(0, current - 1))}
            onNext={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={loading || refreshing}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name={loading ? 'sync-outline' : 'notifications-off-outline'} size={34} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{loading ? 'Loading notifications' : 'No notifications'}</Text>
            <Text style={styles.emptyBody}>
              {loading
                ? 'Fetching the latest alerts from the backend.'
                : unreadOnly
                ? 'You are caught up. No unread alerts remain.'
                : 'New assignments and review updates will appear here.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatTanzaniaDate(date);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  listSurface: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 40,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  decorationLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  decorationSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -36,
    left: -10,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  heroCopy: {
    flex: 1,
  },
  heroEyebrow: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.76)',
    marginTop: 2,
    fontWeight: '500',
  },
  badge: {
    minWidth: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  badgeNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 22,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.68)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 6,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.68)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  markAllButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#e0f2fe',
  },
  markAllButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  notificationItem: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#eef2f7',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  notificationItemUnread: {
    backgroundColor: '#f8fbff',
    borderColor: '#bfdbfe',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  body: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  type: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  time: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 28,
    paddingBottom: 48,
    paddingHorizontal: 32,
    flex: 1,
  },
  emptyIconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
