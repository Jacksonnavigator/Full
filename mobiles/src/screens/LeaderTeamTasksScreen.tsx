import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../store/taskStore';
import { Task, TaskStatus } from '../types/task';
import { TaskCard } from '../components/TaskCard';
import { NotificationBellButton } from '../components/shared/NotificationBellButton';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';

type StatusFilter = TaskStatus | 'All';

const FILTERS: StatusFilter[] = [
  'All',
  'Assigned',
  'In Progress',
  'Submitted by Engineer',
  'Approved by Team Leader',
  'Rejected by Team Leader',
  'Closed by Manager',
];

const FILTER_SHORT: Partial<Record<StatusFilter, string>> = {
  All: 'All',
  Assigned: 'Assigned',
  'In Progress': 'In Progress',
  'Submitted by Engineer': 'Submitted',
  'Approved by Team Leader': 'Approved',
  'Rejected by Team Leader': 'Rejected',
  'Closed by Manager': 'Closed',
};

const FILTER_ICON: Partial<Record<StatusFilter, keyof typeof Ionicons.glyphMap>> = {
  All: 'albums-outline',
  Assigned: 'clipboard-outline',
  'In Progress': 'construct-outline',
  'Submitted by Engineer': 'checkmark-done-outline',
  'Approved by Team Leader': 'shield-checkmark-outline',
  'Rejected by Team Leader': 'close-circle-outline',
  'Closed by Manager': 'checkmark-circle-outline',
};

const STAT_CONFIG = [
  { key: 'Assigned', label: 'Assigned', icon: 'clipboard-outline' as const, accent: '#3b82f6', bg: '#eff6ff' },
  { key: 'In Progress', label: 'In Progress', icon: 'construct-outline' as const, accent: '#f59e0b', bg: '#fffbeb' },
  { key: 'Submitted by Engineer', label: 'Submitted', icon: 'checkmark-done-outline' as const, accent: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'Closed by Manager', label: 'Closed', icon: 'checkmark-circle-outline' as const, accent: '#10b981', bg: '#ecfdf5' },
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
    [tasks, currentUser?.team]
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

  const handleOpenPriorityTask = () => {
    const target = filteredTasks[0] ?? teamTasks[0];
    if (!target) return;
    navigation.navigate('TaskDetail', { taskId: target.id });
  };

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
          transform: [{ translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [36, 0] }) }],
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
                colors={['#0f172a', '#155e75', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />

                <View style={styles.heroTop}>
                  <View style={styles.heroCopy}>
                    <Text style={styles.heroEyebrow}>Team Leader</Text>
                    <Text style={styles.heroTitle}>Team Tasks</Text>
                    <Text style={styles.heroSubtitle}>
                      {(currentUser?.team ?? 'Your team') + ' | ' + totalCount + ' total tasks'}
                    </Text>
                  </View>
                  <View style={styles.heroAside}>
                    <NotificationBellButton />
                    <View style={styles.heroBadge}>
                      <Text style={styles.heroBadgeNumber}>{activeCount}</Text>
                      <Text style={styles.heroBadgeLabel}>active</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>Tasks closed</Text>
                    <Text style={styles.progressPct}>{completionPct}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${completionPct}%` as const }]} />
                  </View>
                </View>

                <View style={styles.quickActionsRow}>
                  <TouchableOpacity style={styles.quickAction} onPress={() => setFilter('Assigned')} activeOpacity={0.85}>
                    <Ionicons name="clipboard-outline" size={16} color="#ffffff" />
                    <Text style={styles.quickActionText}>Assigned</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction} onPress={() => setFilter('Submitted by Engineer')} activeOpacity={0.85}>
                    <Ionicons name="checkmark-done-outline" size={16} color="#ffffff" />
                    <Text style={styles.quickActionText}>Review</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickAction} onPress={handleOpenPriorityTask} activeOpacity={0.85}>
                    <Ionicons name="arrow-forward-outline" size={16} color="#ffffff" />
                    <Text style={styles.quickActionText}>Open task</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
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
                        <Ionicons name={icon} size={18} color={accent} />
                      </View>
                      <Text style={[styles.statCount, { color: accent }]}>{count}</Text>
                      <Text style={styles.statLabel}>{label}</Text>
                      <View style={styles.statBarTrack}>
                        <View style={[styles.statBarFill, { width: `${pct}%` as const, backgroundColor: accent }]} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

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
                      <Ionicons
                        name={FILTER_ICON[value] || 'ellipse-outline'}
                        size={14}
                        color={selected ? '#ffffff' : '#475569'}
                      />
                      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                        {FILTER_SHORT[value]}
                      </Text>
                      <View style={[styles.pillCount, selected && styles.pillCountSelected]}>
                        <Text style={[styles.pillCountText, selected && styles.pillCountTextSelected]}>
                          {count}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

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
              <Ionicons name="file-tray-outline" size={34} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No tasks here</Text>
            <Text style={styles.emptyBody}>
              No team tasks match this status filter. Try a different one or reset to All.
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
  heroCard: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 12,
    paddingBottom: 12,
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
    marginBottom: 8,
    gap: 12,
  },
  heroCopy: {
    flex: 1,
  },
  heroAside: {
    alignItems: 'flex-end',
    gap: 8,
  },
  heroEyebrow: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.62)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 2,
    fontWeight: '500',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 7,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBadgeNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 22,
  },
  heroBadgeLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.62)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressSection: {
    gap: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  progressPct: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '800',
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34d399',
    borderRadius: 999,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    paddingVertical: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
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
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statCount: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 9,
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
  statBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  pillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  pillCount: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCountSelected: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  pillCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  pillCountTextSelected: {
    color: '#ffffff',
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionCount: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
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
  emptyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
