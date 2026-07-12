import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@/hooks/useAuth';
import { useTaskStore } from '@/store/taskStore';
import AppHeader from '../components/AppHeader';
import { TaskCard } from '../components/TaskCard';
import { NotificationBellButton } from '../components/shared/NotificationBellButton';
import { PaginationBar } from '../components/shared/PaginationBar';
import { usePagination } from '../hooks/usePagination';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatTanzaniaWeekdayDate } from '../lib/dateTime';
import { colors, typography, borderRadius, spacing, fontWeight } from '../theme';
import { getSlaState } from '../utils/sla';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import {
  isActiveTaskStatus,
  isAssignedTaskStatus,
  isSubmittedWorkStatus,
} from '../utils/taskStatus';

type Filter = 'All' | 'Assigned' | 'In Progress' | 'Submitted by Engineer';

const FILTERS: Filter[] = ['All', 'Assigned', 'In Progress', 'Submitted by Engineer'];

const FILTER_ICONS: Record<Filter, keyof typeof Ionicons.glyphMap> = {
  All: 'albums-outline',
  Assigned: 'clipboard-outline',
  'In Progress': 'construct-outline',
  'Submitted by Engineer': 'checkmark-done-outline',
};

const FILTER_SHORT: Record<Filter, { en: string; sw: string }> = {
  All: { en: 'All', sw: 'Zote' },
  Assigned: { en: 'Assigned', sw: 'Imepewa' },
  'In Progress': { en: 'In Progress', sw: 'Inaendelea' },
  'Submitted by Engineer': { en: 'Submitted', sw: 'Imetumwa' },
};

const FILTER_TO_STATUS: Record<Exclude<Filter, 'All'>, string[]> = {
  Assigned: ['Assigned', 'Rejected by Team Leader'],
  'In Progress': ['In Progress', 'In Progress (Leader)'],
  'Submitted by Engineer': ['Submitted by Engineer', 'Pending Approval', 'Approved by Team Leader'],
};

export const TaskListScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language } = useAppLanguage();
  const { currentUser } = useAuth();
  const tasks = useTaskStore((state) => state.tasks);
  const refreshTasks = useTaskStore((state) => state.refreshTasks);
  const [filter, setFilter] = useState<Filter>('All');
  const [refreshing, setRefreshing] = useState(false);
  const bottomPadding = useBottomTabPadding();

  useEffect(() => {
    if (!currentUser) return;
    console.log('[TaskList] Refreshing store-backed tasks for user:', currentUser?.name, currentUser?.id, currentUser?.role);
    void refreshTasks();
  }, [currentUser, refreshTasks]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('[TaskList] Screen focused - refreshing tasks');
      void refreshTasks();
    }, [refreshTasks])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  const roleKey = `${currentUser?.role || ''}`.toLowerCase();
  const isEngineer = roleKey.includes('engineer') && !roleKey.includes('leader');
  const isLeader = roleKey.includes('leader');

  const filteredTasks = useMemo(() => {
    if (!tasks || !currentUser) return [];
    if (filter === 'All') return tasks;
    return tasks.filter((task) =>
      FILTER_TO_STATUS[filter as Exclude<Filter, 'All'>].includes(task.status)
    );
  }, [tasks, filter, currentUser]);

  const cardTasks = useMemo(
    () =>
      filteredTasks.map((task) => ({
        id: task.id,
        trackingId: task.trackingId,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignedTeam: task.assignedTeam || 'Unassigned',
        assignedEngineer: task.assignedEngineer,
        backendStatus: task.backendStatus,
        slaDeadline: task.slaDeadline,
        reportType: task.reportType,
        leakageType: task.leakageType,
      })),
    [filteredTasks]
  );

  const {
    paginatedItems,
    page,
    totalPages,
    totalItems,
    pageSize,
    resetPage,
    prevPage,
    nextPage,
  } = usePagination(cardTasks, 8);

  useEffect(() => {
    resetPage();
  }, [filter, resetPage]);

  const counts = useMemo(() => {
    if (!tasks) return { assigned: 0, in_progress: 0, pending_approval: 0 };

    return tasks.reduce(
      (acc, task) => {
        if (isAssignedTaskStatus(task.status)) {
          acc.assigned += 1;
        }
        if (isActiveTaskStatus(task.status)) {
          acc.in_progress += 1;
        }
        if (isSubmittedWorkStatus(task.status)) {
          acc.pending_approval += 1;
        }
        return acc;
      },
      { assigned: 0, in_progress: 0, pending_approval: 0 }
    );
  }, [tasks]);

  const totalTasks = tasks?.length || 0;
  const overdueCount = useMemo(
    () =>
      (tasks ?? []).filter((task) => {
        const state = getSlaState(task);
        return state === 'overdue' || state === 'critical_overdue';
      }).length,
    [tasks]
  );

  const roleLabel = isLeader ? 'Team Leader' : 'Field Engineer';
  const heroTitle = isEngineer
    ? getText(language, 'My Tasks', 'Kazi Zangu')
    : getText(language, 'Team Workload', 'Mzigo wa Timu');
  const heroSubtitle =
    overdueCount > 0
      ? getText(
          language,
          `${overdueCount} overdue · ${totalTasks} total`,
          `${overdueCount} zilizochelewa · jumla ${totalTasks}`
        )
      : getText(
          language,
          `${totalTasks} task${totalTasks === 1 ? '' : 's'} · ${formatTanzaniaWeekdayDate(new Date(), 'Today')}`,
          `${totalTasks} kazi · ${formatTanzaniaWeekdayDate(new Date(), 'Today')}`
        );

  const heroColors = isEngineer
    ? (['#0f172a', '#0f766e', '#06b6d4'] as const)
    : (['#0f172a', '#155e75', '#2563eb'] as const);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={paginatedItems}
        keyExtractor={(item) => item.id}
        style={styles.listSurface}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <AppHeader title={heroTitle} subtitle={heroSubtitle} />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {FILTERS.map((value) => {
                const selected = filter === value;
                const count =
                  value === 'All'
                    ? totalTasks
                    : value === 'Assigned'
                    ? counts.assigned
                    : value === 'In Progress'
                    ? counts.in_progress
                    : counts.pending_approval;
                return (
                  <TouchableOpacity
                    key={value}
                    style={[styles.pill, selected && styles.pillSelected]}
                    onPress={() => setFilter(value)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={FILTER_ICONS[value]}
                      size={14}
                      color={selected ? colors.primaryForeground : colors.mutedForeground}
                    />
                    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                      {language === 'sw' ? FILTER_SHORT[value].sw : FILTER_SHORT[value].en}
                    </Text>
                    <View style={[styles.pillCount, selected && styles.pillCountSelected]}>
                      <Text style={[styles.pillCountText, selected && styles.pillCountTextSelected]}>
                        {count ?? 0}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TaskCard
              task={item}
              onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            />
          </View>
        )}
        ListFooterComponent={
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPrev={prevPage}
            onNext={nextPage}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Ionicons name="file-tray-outline" size={34} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{getText(language, 'Nothing here', 'Hakuna kitu hapa')}</Text>
            <Text style={styles.emptyBody}>
              No tasks match this filter. Switch status or reset the view.
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
    backgroundColor: '#0f172a',
  },
  listSurface: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 40,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -70,
    right: -40,
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30,
    left: 0,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
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
    letterSpacing: -0.6,
  },
  heroSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.76)',
    marginTop: 2,
    fontWeight: '500',
    lineHeight: 15,
  },
  heroId: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 4,
  },
  heroBadge: {
    minWidth: 62,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    color: 'rgba(255,255,255,0.68)',
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
    color: 'rgba(255,255,255,0.66)',
    fontWeight: '600',
  },
  progressPct: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '800',
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 999,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontWeight: fontWeight.bold,
    fontSize: typography.fontSize.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 26,
    fontWeight: fontWeight.bold,
    lineHeight: 30,
    color: colors.foreground,
  },
  statLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
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
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: fontWeight.semibold,
  },
  pillTextSelected: {
    color: colors.primaryForeground,
    fontWeight: fontWeight.bold,
  },
  pillCount: {
    backgroundColor: colors.secondary,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCountSelected: {
    backgroundColor: colors.primary + '40',
  },
  pillCountText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
    color: colors.mutedForeground,
  },
  pillCountTextSelected: {
    color: colors.primaryForeground,
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
  taskRow: {
    marginHorizontal: 16,
    marginBottom: spacing.sm,
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
