import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaskStore } from '../store/taskStore';
import { Task, TaskStatus } from '../data/mockTasks';
import { TaskCard } from '../components/TaskCard';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type StatusFilter = TaskStatus | 'All';

const FILTERS: StatusFilter[] = [
  'All',
  'New',
  'Assigned',
  'In Progress',
  'Submitted by Engineer',
  'Approved by Team Leader',
  'Rejected by Team Leader',
  'Closed by Manager',
];

const FILTER_SHORT: Record<StatusFilter, string> = {
  All: 'All',
  New: 'New',
  Assigned: 'Assigned',
  'In Progress': 'In Progress',
  'Submitted by Engineer': 'Submitted',
  'Approved by Team Leader': 'Approved',
  'Rejected by Team Leader': 'Rejected',
  'Closed by Manager': 'Closed',
};

const FILTER_ICON: Record<StatusFilter, string> = {
  All: '',
  New: '',
  Assigned: '',
  'In Progress': '',
  'Submitted by Engineer': '',
  'Approved by Team Leader': '',
  'Rejected by Team Leader': '',
  'Closed by Manager': '',
};

// Stat card config — key statuses worth highlighting at a glance
const STAT_CONFIG = [
  { key: 'Assigned', label: 'Assigned', icon: '', accent: '#3b82f6', bg: '#eff6ff' },
  { key: 'In Progress', label: 'In Progress', icon: '', accent: '#f59e0b', bg: '#fffbeb' },
  { key: 'Submitted by Engineer', label: 'Submitted', icon: '', accent: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'Closed by Manager', label: 'Closed', icon: '', accent: '#10b981', bg: '#ecfdf5' },
] as const;

export const LeaderTeamTasksScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentUser = useTaskStore((state) => state.currentUser);
  const tasks = useTaskStore((state) => state.tasks);
  const [filter, setFilter] = useState<StatusFilter>('All');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  const teamTasks = useMemo(
    () => tasks.filter((t) => !currentUser?.team || t.assignedTeam === currentUser.team),
    [tasks, currentUser?.id]
  );

  const filteredTasks = useMemo(
    () => (filter === 'All' ? teamTasks : teamTasks.filter((t) => t.status === filter)),
    [teamTasks, filter]
  );

  const activeCount = teamTasks.filter((t) =>
    ['Assigned', 'In Progress', 'In Progress (Leader)', 'Submitted by Engineer'].includes(t.status)
  ).length;

  const totalCount = teamTasks.length;
  const closedCount = teamTasks.filter((t) => t.status === 'Closed by Manager').length;
  const completionPct = totalCount === 0 ? 0 : Math.round((closedCount / totalCount) * 100);

  const countFor = (status: string) => teamTasks.filter((t) => t.status === status).length;

  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 55,
      useNativeDriver: true,
    }).start();
    return (
      <Animated.View
        style={{
          opacity: itemAnim,
          transform: [
            { translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) },
          ],
        }}
      >
        <TaskCard
          task={item}
          onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={filteredTasks}
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
                colors={['#06b6d4', '#2564eb', '#0c3566']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />

                <View style={styles.heroTop}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.heroEyebrow}>👷 Team Leader</Text>
                    <Text style={styles.heroTitle}>Team Tasks</Text>
                    <Text style={styles.heroSubtitle}>
                      {currentUser?.team ?? 'Your team'} · {totalCount} total tasks
                    </Text>
                  </View>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeNumber}>{activeCount}</Text>
                    <Text style={styles.heroBadgeLabel}>active</Text>
                  </View>
                </View>

                {/* Completion progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>Tasks closed</Text>
                    <Text style={styles.progressPct}>{completionPct}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${completionPct}%` }]} />
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* ══ STAT CARDS ══ */}
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
              <View style={styles.statsRow}>
                {STAT_CONFIG.map(({ key, label, icon, accent, bg }) => {
                  const count = countFor(key);
                  const pct = totalCount === 0 ? 0 : (count / totalCount) * 100;
                  const isActive = filter === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.statCard, isActive && { borderColor: accent }]}
                      onPress={() => setFilter(isActive ? 'All' : (key as StatusFilter))}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.statIconWrap, { backgroundColor: bg }]}>
                        <Text style={styles.statIcon}>{icon}</Text>
                      </View>
                      <Text style={[styles.statCount, { color: accent }]}>{count}</Text>
                      <Text style={styles.statLabel}>{label}</Text>
                      <View style={styles.statBarTrack}>
                        <View
                          style={[styles.statBarFill, { width: `${pct}%`, backgroundColor: accent }]}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ══ FILTER PILLS ══ */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
              >
                {FILTERS.map((value) => {
                  const selected = filter === value;
                  const count = value === 'All' ? teamTasks.length : countFor(value);
                  return (
                    <TouchableOpacity
                      key={value}
                      style={[styles.pill, selected && styles.pillSelected]}
                      onPress={() => setFilter(value)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pillIcon}>{FILTER_ICON[value]}</Text>
                      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                        {FILTER_SHORT[value]}
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
              </ScrollView>

              {/* Section label */}
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>
                  {filter === 'All' ? 'All Tasks' : FILTER_SHORT[filter]}
                </Text>
                <Text style={styles.sectionCount}>{filteredTasks.length} tasks</Text>
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderTask}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Text style={styles.emptyEmoji}></Text>
            </View>
            <Text style={styles.emptyTitle}>No tasks here</Text>
            <Text style={styles.emptyBody}>
              No tasks match this status filter. Try a different one or reset to All.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => setFilter('All')}
              activeOpacity={0.85}
            >
              <Text style={styles.emptyBtnText}>Show all tasks</Text>
            </TouchableOpacity>
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
    paddingBottom: 28,
    overflow: 'hidden',
  },
  decCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
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
    marginBottom: 24,
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
  progressSection: { gap: 8 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
  progressPct: { fontSize: 12, color: '#ffffff', fontWeight: '800' },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34d399',
    borderRadius: 999,
  },

  // ── Stat cards ──
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    gap: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statIcon: { fontSize: 17 },
  statCount: { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  statLabel: {
    fontSize: 8,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  statBarTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    marginTop: 5,
    overflow: 'hidden',
  },
  statBarFill: { height: '100%', borderRadius: 999 },

  // ── Filter pills ──
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
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
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sectionCount: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },

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
  emptyBtn: {
    marginTop: 8,
    backgroundColor: '#0f172a',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  emptyBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});