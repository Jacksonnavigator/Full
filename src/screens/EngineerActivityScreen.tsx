import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaskStore } from '../store/taskStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Filter = 'all' | 'my' | 'rejections';

interface ActivityItem {
  id: string;
  taskId: string;
  title: string;
  status: string;
  actorRole: string;
  actorName?: string;
  note?: string;
  timestamp: string;
}

const FILTERS: { key: Filter; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '⚡' },
  { key: 'my', label: 'My Actions', icon: 'MA' },
  { key: 'rejections', label: 'Rejections', icon: 'RJ' },
];

// Derive status styling
const getStatusStyle = (status: string): { color: string; bg: string; icon: string } => {
  if (status.includes('Rejected'))   return { color: '#ef4444', bg: '#fef2f2', icon: '❌' };
  if (status.includes('Approved'))   return { color: '#10b981', bg: '#ecfdf5', icon: '✅' };
  if (status.includes('Closed'))     return { color: '#6366f1', bg: '#eef2ff', icon: '🔒' };
  if (status.includes('Submitted'))  return { color: '#8b5cf6', bg: '#f5f3ff', icon: '📤' };
  if (status.includes('In Progress')) return { color: '#f59e0b', bg: '#fffbeb', icon: '⚙️' };
  if (status.includes('Assigned'))   return { color: '#3b82f6', bg: '#eff6ff', icon: '📋' };
  return { color: '#64748b', bg: '#f8fafc', icon: '📌' };
};

const getActorIcon = (role: string): string => {
  if (role === 'Team Leader') return '👷';
  if (role === 'Engineer') return 'E';
  if (role === 'Manager') return '💼';
  return '👤';
};

export const EngineerActivityScreen: React.FC = () => {
  const currentUser = useTaskStore((state) => state.currentUser);
  const tasks = useTaskStore((state) => state.tasks);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('all');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  const data: ActivityItem[] = useMemo(() => {
    if (!currentUser) return [];
    const items: ActivityItem[] = [];
    tasks.forEach((task) => {
      task.timeline.forEach((entry, idx) => {
        const isEngineerEntry = entry.actorRole === 'Engineer';
        const isAssignee = task.assignee === currentUser.name;
        if (!isEngineerEntry && !isAssignee) return;
        items.push({
          id: `${task.id}-${idx}`,
          taskId: task.id,
          title: task.title,
          status: entry.status,
          actorRole: entry.actorRole,
          actorName: entry.actorName,
          note: entry.note,
          timestamp: entry.timestamp,
        });
      });
    });
    return items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [tasks, currentUser?.id]);

  const filteredData: ActivityItem[] = useMemo(() => {
    switch (filter) {
      case 'my':          return data.filter((i) => i.actorRole === 'Engineer');
      case 'rejections':  return data.filter((i) => i.status.includes('Rejected'));
      default:            return data;
    }
  }, [data, filter]);

  // Summary counts
  const totalCount = data.length;
  const myCount = data.filter((i) => i.actorRole === 'Engineer').length;
  const rejectionsCount = data.filter((i) => i.status.includes('Rejected')).length;

  const renderItem = ({ item, index }: { item: ActivityItem; index: number }) => {
    const statusStyle = getStatusStyle(item.status);
    const actorIcon = getActorIcon(item.actorRole);
    const isRejection = item.status.includes('Rejected');

    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    const timeStr = new Date(item.timestamp).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <Animated.View
        style={{
          opacity: itemAnim,
          transform: [
            { translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) },
          ],
        }}
      >
        <TouchableOpacity
          style={[styles.card, isRejection && styles.cardRejection]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('TaskDetail', { taskId: item.taskId })}
          accessibilityRole="button"
        >
          {/* ── Left accent bar ── */}
          <View style={[styles.accentBar, { backgroundColor: statusStyle.color }]} />

          <View style={styles.cardBody}>
            {/* ── Top row ── */}
            <View style={styles.cardTopRow}>
              <Text style={styles.cardTaskId}>{item.taskId}</Text>
              <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                <Text style={styles.statusPillIcon}>{statusStyle.icon}</Text>
                <Text style={[styles.statusPillText, { color: statusStyle.color }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            {/* ── Title ── */}
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

            {/* ── Note ── */}
            {item.note ? (
              <View style={styles.noteBox}>
                <Text style={styles.noteText} numberOfLines={2}>{item.note}</Text>
              </View>
            ) : null}

            {/* ── Footer ── */}
            <View style={styles.cardFooter}>
              <View style={styles.actorChip}>
                <Text style={styles.actorChipIcon}>{actorIcon}</Text>
                <Text style={styles.actorChipText}>
                  {item.actorRole}{item.actorName ? ` · ${item.actorName}` : ''}
                </Text>
              </View>
              <Text style={styles.timeText}>{timeStr}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* ══ HERO HEADER ══ */}
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
                colors={['#0f172a', '#1a2b40', '#0b3558']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />

                <View style={styles.heroTop}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.heroEyebrow}>Field Engineer</Text>
                    <Text style={styles.heroTitle}>Activity Log</Text>
                    <Text style={styles.heroSubtitle}>
                      Your work history and leader decisions
                    </Text>
                  </View>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeNumber}>{totalCount}</Text>
                    <Text style={styles.heroBadgeLabel}>events</Text>
                  </View>
                </View>

                {/* Breakdown strip */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}>⚡</Text>
                    <Text style={styles.breakdownCount}>{totalCount}</Text>
                    <Text style={styles.breakdownLabel}>Total</Text>
                  </View>
                  <View style={styles.breakdownDivider} />
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}></Text>
                    <Text style={styles.breakdownCount}>{myCount}</Text>
                    <Text style={styles.breakdownLabel}>My Actions</Text>
                  </View>
                  <View style={styles.breakdownDivider} />
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}></Text>
                    <Text style={styles.breakdownCount}>{rejectionsCount}</Text>
                    <Text style={styles.breakdownLabel}>Rejections</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* ══ FILTER PILLS ══ */}
            <Animated.View
              style={{
                opacity: contentAnim,
                transform: [
                  {
                    translateY: contentAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.filterRow}>
                {FILTERS.map(({ key, label, icon }) => {
                  const selected = filter === key;
                  const count =
                    key === 'all' ? totalCount : key === 'my' ? myCount : rejectionsCount;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.pill, selected && styles.pillSelected]}
                      onPress={() => setFilter(key)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pillIcon}>{icon}</Text>
                      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                        {label}
                      </Text>
                      <View style={[styles.pillCount, selected && styles.pillCountSelected]}>
                        <Text
                          style={[styles.pillCountText, selected && styles.pillCountTextSelected]}
                        >
                          {count}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Section label */}
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>
                  {filter === 'all' ? 'All Events' : filter === 'my' ? 'My Actions' : 'Rejections'}
                </Text>
                <Text style={styles.sectionCount}>{filteredData.length} events</Text>
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Text style={styles.emptyEmoji}>📋</Text>
            </View>
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptyBody}>
              Start or submit a task and your activity will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  listContent: {
    paddingBottom: 40,
  },

  // ── Hero ──
  heroCard: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 20 : 20,
    paddingBottom: 26,
    overflow: 'hidden',
  },
  decCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -70,
    right: -60,
  },
  decCircle2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30,
    left: 10,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  heroEyebrow: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
    textTransform: 'uppercase',
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
    marginTop: 5,
    fontWeight: '500',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBadgeNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 34,
  },
  heroBadgeLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breakdownRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  breakdownDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 4,
  },
  breakdownIcon: { fontSize: 18 },
  breakdownCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  breakdownLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // ── Filter pills ──
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  pillSelected: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  pillIcon: { fontSize: 13 },
  pillText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  pillTextSelected: { color: '#ffffff', fontWeight: '700' },
  pillCount: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCountSelected: { backgroundColor: 'rgba(255,255,255,0.15)' },
  pillCountText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  pillCountTextSelected: { color: '#ffffff' },

  // ── Section label ──
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sectionCount: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },

  // ── Activity card ──
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardRejection: {
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTaskId: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: 180,
  },
  statusPillIcon: { fontSize: 11 },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  noteBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#cbd5e1',
  },
  noteText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  actorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  actorChipIcon: { fontSize: 11 },
  actorChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },

  // ── Empty state ──
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 6,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  emptyBody: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 19,
  },
});