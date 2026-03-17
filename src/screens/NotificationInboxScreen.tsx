import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notificationService_v2';
import { useAuth } from '../hooks/useAuth';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  resource_id?: string;
  resource_type?: string;
  read: boolean;
  created_at: string;
  data?: Record<string, string>;
}

const TYPE_ICON: Record<string, string> = {
  ASSIGNMENT: '→',
  SUBMISSION: '↑',
  APPROVAL: 'A',
  REJECTION: 'R',
  STATUS_CHANGE: '↻',
  OTHER: '◦',
};

const TYPE_COLOR: Record<string, string> = {
  ASSIGNMENT: '#3b82f6',
  SUBMISSION: '#ec4899',
  APPROVAL: '#10b981',
  REJECTION: '#ef4444',
  STATUS_CHANGE: '#f59e0b',
  OTHER: '#8b5cf6',
};

export const NotificationInboxScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  // Fetch notifications from backend API
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchNotifications = async () => {
      try {
        // Fetch from backend API
        const notifs = await getNotifications();
        setNotifications(notifs);
        console.log('✅ Fetched notifications from backend:', notifs.length);
      } catch (error) {
        console.warn('⚠️ Notifications unavailable:', error instanceof Error ? error.message : error);
        // Don't crash if notifications fail - set empty list
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Refresh every 30 seconds (polling)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = unreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
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
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    const timestamp = new Date(item.created_at);
    const timeAgo = formatTimeAgo(timestamp);
    const icon = TYPE_ICON[item.type] || '';
    const color = TYPE_COLOR[item.type] || '#8b5cf6';

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
          style={[
            styles.notificationItem,
            !item.read && styles.notificationItemUnread,
          ]}
          onPress={() => handleMarkAsRead(item.id)}
        >
          <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          <View style={styles.notificationContent}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.body} numberOfLines={2}>
              {item.message}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.type}>{item.type.replace(/_/g, ' ')}</Text>
              <Text style={styles.time}>{timeAgo}</Text>
            </View>
          </View>

          {!item.read && <View style={[styles.unreadDot, { backgroundColor: color }]} />}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Hero Header */}
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
              <LinearGradient
                colors={['#06b6d4', '#2563eb', '#0c3566']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.heroTop}>
                  <View>
                    <Text style={styles.heroTitle}>🔔 Notifications</Text>
                    <Text style={styles.heroSubtitle}>
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : 'All caught up'}
                    </Text>
                  </View>
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Controls */}
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
                  style={[styles.filterButton, unreadOnly && styles.filterButtonActive]}
                  onPress={() => setUnreadOnly(!unreadOnly)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterButtonText, unreadOnly && styles.filterButtonTextActive]}>
                    {unreadOnly ? '✓ Unread Only' : 'All'}
                  </Text>
                </TouchableOpacity>

                {unreadCount > 0 && (
                  <TouchableOpacity
                    style={styles.markAllButton}
                    onPress={handleMarkAllAsRead}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.markAllButtonText}>Mark all as read</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderNotification}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}></Text>
            <Text style={styles.emptyTitle}>
              {loading ? 'Loading...' : 'No notifications'}
            </Text>
            <Text style={styles.emptyBody}>
              {loading
                ? 'Fetching your notifications...'
                : unreadOnly
                  ? 'You are all caught up! No new notifications.'
                  : 'Check back later for updates.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

/**
 * Format timestamp to "X ago" format
 */
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
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  listContent: {
    paddingBottom: 40,
  },
  heroCard: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 20 : 20,
    paddingBottom: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 20,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  controlsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  markAllButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
  },
  markAllButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0077b6',
  },
  notificationItem: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'flex-start',
  },
  notificationItemUnread: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bfdbfe',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  body: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  time: {
    fontSize: 10,
    color: '#d1d5db',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
