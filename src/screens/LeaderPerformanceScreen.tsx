import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../data/mockTasks';

interface EngineerStats {
  engineer: string;
  completed: number;
  active: number;
  rejections: number;
  averageRepairHours: number | null;
}

// Score out of 100 for a simple performance indicator
const getScore = (s: EngineerStats): number => {
  const base = Math.min(s.completed * 20, 60);
  const activeBonus = Math.min(s.active * 5, 20);
  const rejectionPenalty = Math.min(s.rejections * 10, 30);
  return Math.max(0, Math.min(100, base + activeBonus - rejectionPenalty));
};

const getScoreColor = (score: number): string => {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
};

const getScoreLabel = (score: number): string => {
  if (score >= 70) return 'Excellent';
  if (score >= 40) return 'On Track';
  return 'Needs Attention';
};

const getRankLabel = (index: number): string => {
  if (index === 0) return '#1';
  if (index === 1) return '#2';
  if (index === 2) return '#3';
  return `#${index + 1}`;
};

export const LeaderPerformanceScreen: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const currentUser = useTaskStore((state) => state.currentUser);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  const engineerStats: EngineerStats[] = useMemo(() => {
    const byEngineer: Record<string, EngineerStats> = {};

    const ensure = (name: string): EngineerStats => {
      if (!byEngineer[name]) {
        byEngineer[name] = {
          engineer: name,
          completed: 0,
          active: 0,
          rejections: 0,
          averageRepairHours: null,
        };
      }
      return byEngineer[name];
    };

    const teamTasks = tasks.filter(
      (t) => !currentUser?.team || t.assignedTeam === currentUser.team
    );

    teamTasks.forEach((task: Task) => {
      const engineer = task.assignee;
      if (!engineer) return;
      const stats = ensure(engineer);

      if (task.status === 'Closed by Manager') {
        stats.completed += 1;
        const startEntry = task.timeline.find((e) => e.status === 'In Progress');
        const endEntry = task.timeline.find(
          (e) =>
            e.status === 'Approved by Team Leader' || e.status === 'Closed by Manager'
        );
        if (startEntry && endEntry) {
          const hours =
            (new Date(endEntry.timestamp).getTime() -
              new Date(startEntry.timestamp).getTime()) /
            (1000 * 60 * 60);
          stats.averageRepairHours =
            stats.averageRepairHours == null
              ? hours
              : (stats.averageRepairHours + hours) / 2;
        }
      } else if (
        ['Assigned', 'In Progress', 'In Progress (Leader)', 'Submitted by Engineer'].includes(
          task.status
        )
      ) {
        stats.active += 1;
      }

      stats.rejections += task.timeline.filter(
        (e) => e.status === 'Rejected by Team Leader'
      ).length;
    });

    return Object.values(byEngineer).sort(
      (a, b) => b.completed - a.completed || a.engineer.localeCompare(b.engineer)
    );
  }, [tasks, currentUser?.id]);

  const teamTasks = tasks.filter(
    (t) => !currentUser?.team || t.assignedTeam === currentUser.team
  );

  const teamActive = teamTasks.filter((t) =>
    ['Assigned', 'In Progress', 'In Progress (Leader)', 'Submitted by Engineer'].includes(
      t.status
    )
  ).length;

  const teamClosed = teamTasks.filter((t) => t.status === 'Closed by Manager').length;
  const totalRejections = engineerStats.reduce((sum, s) => sum + s.rejections, 0);
  const totalEngineers = engineerStats.length;

  const renderItem = ({ item, index }: { item: EngineerStats; index: number }) => {
    const score = getScore(item);
    const scoreColor = getScoreColor(score);
    const scoreLabel = getScoreLabel(score);
    const rankLabel = getRankLabel(index);
    const isTopPerformer = index === 0 && item.completed > 0;

    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 320,
      delay: index * 65,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View
        style={{
          opacity: itemAnim,
          transform: [
            { translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
          ],
        }}
      >
        <View style={[styles.card, isTopPerformer && styles.cardTop]}>
          {/* ── Card header ── */}
          <View style={styles.cardHeader}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{rankLabel}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.engineerName}>{item.engineer}</Text>
              <View style={[styles.scorePill, { backgroundColor: `${scoreColor}18` }]}>
                <View style={[styles.scoreDot, { backgroundColor: scoreColor }]} />
                <Text style={[styles.scorePillText, { color: scoreColor }]}>{scoreLabel}</Text>
              </View>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
          </View>

          {/* ── Score bar ── */}
          <View style={styles.scoreBarTrack}>
            <View style={[styles.scoreBarFill, { width: `${score}%`, backgroundColor: scoreColor }]} />
          </View>

          {/* ── Stat grid ── */}
          <View style={styles.statGrid}>
            <StatTile
              icon=""
              label="Completed"
              value={String(item.completed)}
              accent="#10b981"
              bg="#ecfdf5"
            />
            <StatTile
              icon=""
              label="Active"
              value={String(item.active)}
              accent="#3b82f6"
              bg="#eff6ff"
            />
            <StatTile
              icon=""
              label="Rejections"
              value={String(item.rejections)}
              accent={item.rejections > 0 ? '#ef4444' : '#10b981'}
              bg={item.rejections > 0 ? '#fef2f2' : '#ecfdf5'}
            />
            <StatTile
              icon=""
              label="Avg hrs"
              value={item.averageRepairHours == null ? '—' : item.averageRepairHours.toFixed(1)}
              accent="#8b5cf6"
              bg="#f5f3ff"
            />
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={engineerStats}
        keyExtractor={(item) => item.engineer}
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
                colors={['#06b6d4', '#2564eb', '#0b3558']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />

                <View style={styles.heroTop}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.heroEyebrow}>👷 Team Leader</Text>
                    <Text style={styles.heroTitle}>Team Performance</Text>
                    <Text style={styles.heroSubtitle}>
                      {currentUser?.team ?? 'Your team'} · {totalEngineers} engineer
                      {totalEngineers !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeNumber}>{teamActive}</Text>
                    <Text style={styles.heroBadgeLabel}>active</Text>
                  </View>
                </View>

                {/* Team summary strip */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}>👷</Text>
                    <Text style={styles.breakdownCount}>{totalEngineers}</Text>
                    <Text style={styles.breakdownLabel}>Engineers</Text>
                  </View>
                  <View style={styles.breakdownDivider} />
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}></Text>
                    <Text style={styles.breakdownCount}>{teamClosed}</Text>
                    <Text style={styles.breakdownLabel}>Closed</Text>
                  </View>
                  <View style={styles.breakdownDivider} />
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}></Text>
                    <Text style={styles.breakdownCount}>{totalRejections}</Text>
                    <Text style={styles.breakdownLabel}>Rejections</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Section label */}
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
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>Engineer Rankings</Text>
                <Text style={styles.sectionCount}>{totalEngineers} members</Text>
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Text style={styles.emptyEmoji}>—</Text>
            </View>
            <Text style={styles.emptyTitle}>No data yet</Text>
            <Text style={styles.emptyBody}>
              Once engineers start working on tasks, their performance will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ── Stat tile helper ──
const StatTile = ({
  icon,
  label,
  value,
  accent,
  bg,
}: {
  icon: string;
  label: string;
  value: string;
  accent: string;
  bg: string;
}) => (
  <View style={[statTileStyles.tile, { backgroundColor: bg }]}>
    <Text style={statTileStyles.icon}>{icon}</Text>
    <Text style={[statTileStyles.value, { color: accent }]}>{value}</Text>
    <Text style={statTileStyles.label}>{label}</Text>
  </View>
);

const statTileStyles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 3,
  },
  icon: { fontSize: 18 },
  value: { fontSize: 20, fontWeight: '800', lineHeight: 24 },
  label: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});

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

  // ── Section label ──
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
    marginBottom: 10,
  },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sectionCount: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },

  // ── Engineer card ──
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    shadowColor: '#989df8',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 12,
  },
  cardTop: {
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rankText: {
    fontSize: 20,
  },
  engineerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scorePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scoreCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  scoreMax: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // ── Score bar ──
  scoreBarTrack: {
    height: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 999,
  },

  // ── Stat grid ──
  statGrid: {
    flexDirection: 'row',
    gap: 8,
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