import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NotificationBellButton } from '../components/shared/NotificationBellButton';
import { useTaskStore } from '../store/taskStore';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { Task } from '../types/task';
import { colors } from '../theme';

type AttentionItem = {
  task: Task;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  bg: string;
};

type EngineerSnapshot = {
  name: string;
  active: number;
  awaitingReview: number;
  completed: number;
  rejected: number;
};

const ACTIVE_STATUSES = ['Assigned', 'In Progress', 'In Progress (Leader)'] as const;

export const LeaderPerformanceScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tasks = useTaskStore((state) => state.tasks);
  const currentUser = useTaskStore((state) => state.currentUser);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, [contentAnim, headerAnim]);

  const teamTasks = useMemo(
    () => tasks.filter((task) => !currentUser?.team || task.assignedTeam === currentUser.team),
    [tasks, currentUser?.team]
  );

  const awaitingReview = useMemo(
    () => teamTasks.filter((task) => task.status === 'Submitted by Engineer'),
    [teamTasks]
  );

  const awaitingDmaApproval = useMemo(
    () => teamTasks.filter((task) => task.status === 'Approved by Team Leader'),
    [teamTasks]
  );

  const rejectedTasks = useMemo(
    () => teamTasks.filter((task) => task.status === 'Rejected by Team Leader' || task.status === 'Rejected'),
    [teamTasks]
  );

  const criticalActive = useMemo(
    () =>
      teamTasks.filter(
        (task) =>
          (task.priority === 'High' || task.priority === 'Critical') &&
          ACTIVE_STATUSES.includes(task.status as (typeof ACTIVE_STATUSES)[number])
      ),
    [teamTasks]
  );

  const closedTasks = useMemo(
    () => teamTasks.filter((task) => task.status === 'Closed by Manager' || task.status === 'Closed'),
    [teamTasks]
  );

  const directFixes = useMemo(
    () => teamTasks.filter((task) => task.leaderResolution?.resolvedByLeader).length,
    [teamTasks]
  );

  const completionRate = teamTasks.length === 0 ? 0 : Math.round((closedTasks.length / teamTasks.length) * 100);

  const attentionItems = useMemo<AttentionItem[]>(() => {
    const reviewItems = awaitingReview.map((task) => ({
      task,
      title: 'Needs review',
      subtitle: `${task.title} is waiting for a team leader decision.`,
      icon: 'checkmark-done-outline' as const,
      accent: '#0f5fff',
      bg: '#eff6ff',
    }));

    const rejectItems = rejectedTasks.map((task) => ({
      task,
      title: 'Returned for rework',
      subtitle: `${task.title} was rejected and needs field follow-up.`,
      icon: 'refresh-outline' as const,
      accent: '#ef4444',
      bg: '#fef2f2',
    }));

    const urgentItems = criticalActive.map((task) => ({
      task,
      title: task.priority === 'Critical' ? 'Critical task active' : 'High-priority work',
      subtitle: `${task.title} is active in the field and needs close monitoring.`,
      icon: 'alert-circle-outline' as const,
      accent: '#f97316',
      bg: '#fff7ed',
    }));

    const deduped = new Map<string, AttentionItem>();
    [...reviewItems, ...rejectItems, ...urgentItems].forEach((item) => {
      if (!deduped.has(item.task.id)) {
        deduped.set(item.task.id, item);
      }
    });

    return Array.from(deduped.values()).sort((a, b) => {
      const aTime = new Date(a.task.updatedAt || a.task.createdAt || 0).getTime();
      const bTime = new Date(b.task.updatedAt || b.task.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [awaitingReview, rejectedTasks, criticalActive]);

  const engineerSnapshots = useMemo<EngineerSnapshot[]>(() => {
    const grouped = new Map<string, EngineerSnapshot>();

    const ensure = (name: string) => {
      if (!grouped.has(name)) {
        grouped.set(name, { name, active: 0, awaitingReview: 0, completed: 0, rejected: 0 });
      }
      return grouped.get(name)!;
    };

    teamTasks.forEach((task) => {
      const name = task.assignedEngineer || task.assignee;
      if (!name || name === 'Unassigned') return;

      const snapshot = ensure(name);

      if (ACTIVE_STATUSES.includes(task.status as (typeof ACTIVE_STATUSES)[number])) {
        snapshot.active += 1;
      }
      if (task.status === 'Submitted by Engineer') {
        snapshot.awaitingReview += 1;
      }
      if (task.status === 'Closed by Manager' || task.status === 'Closed') {
        snapshot.completed += 1;
      }
      if (task.status === 'Rejected by Team Leader' || task.status === 'Rejected') {
        snapshot.rejected += 1;
      }
    });

    return Array.from(grouped.values()).sort((a, b) => {
      const scoreA = a.completed * 3 + a.awaitingReview * 2 - a.rejected;
      const scoreB = b.completed * 3 + b.awaitingReview * 2 - b.rejected;
      return scoreB - scoreA || a.name.localeCompare(b.name);
    });
  }, [teamTasks]);

  const summaryTiles = [
    {
      label: 'Needs Review',
      value: awaitingReview.length,
      icon: 'checkmark-done-outline' as const,
      tone: '#0f5fff',
      bg: '#eff6ff',
    },
    {
      label: 'Sent to DMA',
      value: awaitingDmaApproval.length,
      icon: 'send-outline' as const,
      tone: '#7c3aed',
      bg: '#f5f3ff',
    },
    {
      label: 'High Priority',
      value: criticalActive.length,
      icon: 'alert-circle-outline' as const,
      tone: '#f97316',
      bg: '#fff7ed',
    },
    {
      label: 'Returned',
      value: rejectedTasks.length,
      icon: 'refresh-outline' as const,
      tone: '#ef4444',
      bg: '#fef2f2',
    },
  ];

  const openTask = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }}
        >
          <LinearGradient
            colors={['#0f172a', '#155e75', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroGlowLarge} />
            <View style={styles.heroGlowSmall} />

            <View style={styles.heroTop}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroEyebrow}>Team Leader</Text>
                <Text style={styles.heroTitle}>Performance</Text>
                <Text style={styles.heroSubtitle}>
                  {`${currentUser?.team ?? 'Your team'} | action queue, team health, and field follow-up`}
                </Text>
              </View>
              <View style={styles.heroAside}>
                <NotificationBellButton />
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeNumber}>{attentionItems.length}</Text>
                  <Text style={styles.heroBadgeLabel}>attention</Text>
                </View>
              </View>
            </View>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>{teamTasks.length}</Text>
                <Text style={styles.heroStatLabel}>Team Tasks</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>{completionRate}%</Text>
                <Text style={styles.heroStatLabel}>Completion</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>{closedTasks.length}</Text>
                <Text style={styles.heroStatLabel}>Closed</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Today&apos;s Priorities</Text>
            <View style={styles.tileRow}>
              {summaryTiles.map((tile) => (
                <View key={tile.label} style={styles.tile}>
                  <View style={[styles.tileIconWrap, { backgroundColor: tile.bg }]}>
                    <Ionicons name={tile.icon} size={18} color={tile.tone} />
                  </View>
                  <Text style={[styles.tileValue, { color: tile.tone }]}>{tile.value}</Text>
                  <Text style={styles.tileLabel}>{tile.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Attention Queue</Text>
              <Text style={styles.sectionHint}>Replaces passive notifications with actionable work.</Text>
            </View>

            {attentionItems.length > 0 ? (
              attentionItems.slice(0, 6).map((item) => (
                <TouchableOpacity
                  key={item.task.id}
                  style={styles.attentionCard}
                  activeOpacity={0.85}
                  onPress={() => openTask(item.task.id)}
                >
                  <View style={[styles.attentionIconWrap, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={18} color={item.accent} />
                  </View>
                  <View style={styles.attentionCopy}>
                    <Text style={styles.attentionTitle}>{item.title}</Text>
                    <Text style={styles.attentionTask}>{item.task.title}</Text>
                    <Text style={styles.attentionBody}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.attentionMeta}>
                    <Text style={[styles.attentionPriority, { color: item.accent }]}>{item.task.priority}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="checkmark-circle-outline" size={28} color={colors.brandSuccess} />
                <Text style={styles.emptyTitle}>Nothing urgent right now</Text>
                <Text style={styles.emptyBody}>
                  No items are waiting for review, rework, or high-priority follow-up.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Engineer Snapshot</Text>
              <Text style={styles.sectionHint}>Use this to balance work instead of opening a separate alert tab.</Text>
            </View>

            {engineerSnapshots.length > 0 ? (
              engineerSnapshots.map((engineer, index) => (
                <View key={engineer.name} style={styles.engineerCard}>
                  <View style={styles.engineerHeader}>
                    <View style={styles.rankChip}>
                      <Text style={styles.rankChipText}>{`#${index + 1}`}</Text>
                    </View>
                    <View style={styles.engineerCopy}>
                      <Text style={styles.engineerName}>{engineer.name}</Text>
                      <Text style={styles.engineerSubtitle}>
                        {engineer.awaitingReview > 0
                          ? `${engineer.awaitingReview} item${engineer.awaitingReview === 1 ? '' : 's'} waiting for review`
                          : 'No pending review items'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.engineerStatsRow}>
                    <MiniStat label="Active" value={engineer.active} tone="#0f5fff" bg="#eff6ff" />
                    <MiniStat label="Review" value={engineer.awaitingReview} tone="#f97316" bg="#fff7ed" />
                    <MiniStat label="Closed" value={engineer.completed} tone="#10b981" bg="#ecfdf5" />
                    <MiniStat label="Rejected" value={engineer.rejected} tone="#ef4444" bg="#fef2f2" />
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="people-outline" size={28} color={colors.brandPrimary} />
                <Text style={styles.emptyTitle}>No engineer data yet</Text>
                <Text style={styles.emptyBody}>
                  Once tasks are assigned and updated, team member performance will appear here.
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MiniStat = ({
  label,
  value,
  tone,
  bg,
}: {
  label: string;
  value: number;
  tone: string;
  bg: string;
}) => (
  <View style={[styles.miniStat, { backgroundColor: bg }]}>
    <Text style={[styles.miniStatValue, { color: tone }]}>{value}</Text>
    <Text style={styles.miniStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    paddingBottom: 34,
  },
  heroCard: {
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 8 : 12,
    paddingBottom: 12,
  },
  heroGlowLarge: {
    position: 'absolute',
    top: -72,
    right: -48,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroGlowSmall: {
    position: 'absolute',
    bottom: -20,
    left: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
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
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroSubtitle: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
  },
  heroBadge: {
    minWidth: 66,
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 7,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroBadgeNumber: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroBadgeLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroStatsRow: {
    marginTop: 8,
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  heroStatNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroStatLabel: {
    marginTop: 3,
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionHint: {
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    lineHeight: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  tileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  tileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  tileLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  attentionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  attentionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionCopy: {
    flex: 1,
  },
  attentionTitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  attentionTask: {
    marginTop: 4,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '800',
  },
  attentionBody: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  attentionMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  attentionPriority: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  engineerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  engineerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankChip: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
  },
  rankChipText: {
    color: colors.brandPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  engineerCopy: {
    flex: 1,
  },
  engineerName: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '800',
  },
  engineerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  engineerStatsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  miniStat: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 10,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  miniStatLabel: {
    marginTop: 2,
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '800',
  },
  emptyBody: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
  },
});
