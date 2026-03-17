import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../data/mockTasks';
import { StatusBadge } from '../components/StatusBadge';
import { showSuccessToast } from '../utils/toast';

const PRIORITY_FILTERS = ['All', 'High', 'Medium', 'Low'] as const;
type PriorityFilter = (typeof PRIORITY_FILTERS)[number];

const PRIORITY_COLOR: Record<string, string> = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
};

const PRIORITY_BG: Record<string, string> = {
  High: '#fef2f2',
  Medium: '#fffbeb',
  Low: '#f0fdf4',
};

const PRIORITY_ICON: Record<string, string> = {
  High: '🔴',
  Medium: '🟡',
  Low: '🟢',
  All: '⚡',
};

export const LeaderReviewScreen: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const leaderApprove = useTaskStore((state) => state.leaderApprove);
  const leaderReject = useTaskStore((state) => state.leaderReject);

  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [highFirst, setHighFirst] = useState(true);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(listAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  const submittedTasks = useMemo(() => {
    const base = tasks.filter((t) => t.status === 'Submitted by Engineer');
    const filtered =
      priorityFilter === 'All' ? base : base.filter((t) => t.priority === priorityFilter);
    const rank: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    return [...filtered].sort((a, b) => {
      const diff = rank[a.priority] - rank[b.priority];
      return highFirst ? diff : -diff;
    });
  }, [tasks, priorityFilter, highFirst]);

  const allSubmitted = tasks.filter((t) => t.status === 'Submitted by Engineer');
  const countByPriority = {
    High: allSubmitted.filter((t) => t.priority === 'High').length,
    Medium: allSubmitted.filter((t) => t.priority === 'Medium').length,
    Low: allSubmitted.filter((t) => t.priority === 'Low').length,
  };

  const handleApprove = (taskId: string) => {
    leaderApprove(taskId);
    showSuccessToast('Repair approved and sent for manager closure.');
  };

  const handleReject = (taskId: string) => {
    Alert.prompt?.(
      'Reject repair',
      'Provide a reason so the engineer can fix it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: (reason?: string) => {
            leaderReject(taskId, reason || 'Repair rejected by Team Leader.');
            showSuccessToast('Repair rejected and sent back to engineer.');
          },
        },
      ],
      'plain-text'
    );
    if (!Alert.prompt) {
      leaderReject(taskId, 'Repair rejected by Team Leader (no reason provided).');
      showSuccessToast('Repair rejected and sent back to engineer.');
    }
  };

  const getSubmittedEntry = (task: Task) => {
    for (let i = task.timeline.length - 1; i >= 0; i--) {
      if (task.timeline[i].status === 'Submitted by Engineer') return task.timeline[i];
    }
    return undefined;
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const report = item.engineerReport;
    const submittedEntry = getSubmittedEntry(item);
    const submittedAt = submittedEntry
      ? new Date(submittedEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '—';

    const priorityColor = PRIORITY_COLOR[item.priority] ?? '#6b7280';
    const priorityBg = PRIORITY_BG[item.priority] ?? '#f9fafb';

    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 320,
      delay: index * 70,
      useNativeDriver: true,
    }).start();

    const photosBefore = report?.beforePhotos ?? [];
    const photosAfter = report?.afterPhotos ?? [];
    const allPhotos = [...photosBefore, ...photosAfter];

    return (
      <Animated.View
        style={{
          opacity: itemAnim,
          transform: [
            { translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
          ],
        }}
      >
        <View style={[styles.card, { borderTopColor: priorityColor }]}>
          {/* ── Card header ── */}
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTaskId}>{item.id}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
            <View style={[styles.priorityBubble, { backgroundColor: priorityBg }]}>
              <Text style={styles.priorityBubbleIcon}>{PRIORITY_ICON[item.priority]}</Text>
              <Text style={[styles.priorityBubbleText, { color: priorityColor }]}>
                {item.priority}
              </Text>
            </View>
          </View>

          {/* ── Meta strip ── */}
          <View style={styles.metaStrip}>
            <MetaChip icon="👤" label={item.assignee ?? 'Unassigned'} />
            <MetaChip icon="🕐" label={`Submitted ${submittedAt}`} />
            <MetaChip icon="" label="Within 200 m" accent />
          </View>

          {/* ── Engineer notes ── */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockLabel}>Engineer Notes</Text>
            <Text style={styles.infoBlockBody}>{report?.notes ?? 'No notes provided.'}</Text>
          </View>

          {/* ── Materials ── */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockLabel}>🔩 Materials Used</Text>
            {report?.materials?.length ? (
              <View style={styles.materialsRow}>
                {report.materials.map((m, i) => (
                  <View key={i} style={styles.materialTag}>
                    <Text style={styles.materialTagText}>{m}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.infoBlockBody}>No materials recorded.</Text>
            )}
          </View>

          {/* ── Photos ── */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockLabel}>
              📷 Repair Photos{allPhotos.length > 0 ? ` · ${allPhotos.length}` : ''}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
              {allPhotos.length > 0 ? (
                allPhotos.map((uri, idx) => (
                  <View key={idx} style={styles.photoWrap}>
                    <Image source={{ uri }} style={styles.photo} />
                    <View style={styles.photoLabel}>
                      <Text style={styles.photoLabelText}>
                        {idx < photosBefore.length ? 'Before' : 'After'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderEmoji}></Text>
                  <Text style={styles.photoPlaceholderText}>No photos attached</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* ── Action buttons ── */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleReject(item.id)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Reject this repair"
            >
              <Text style={styles.rejectBtnIcon}>✕</Text>
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(item.id)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Approve this repair"
            >
              <Text style={styles.approveBtnIcon}>✓</Text>
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={submittedTasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* ══ HERO ══ */}
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
                    <Text style={styles.heroTitle}>Review Queue</Text>
                    <Text style={styles.heroSubtitle}>
                      Approve or reject engineer submissions
                    </Text>
                  </View>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeNumber}>{allSubmitted.length}</Text>
                    <Text style={styles.heroBadgeLabel}>pending</Text>
                  </View>
                </View>

                {/* Priority breakdown row */}
                <View style={styles.breakdownRow}>
                  {(['High', 'Medium', 'Low'] as const).map((p) => (
                    <View key={p} style={styles.breakdownItem}>
                      <Text style={styles.breakdownIcon}>{PRIORITY_ICON[p]}</Text>
                      <Text style={styles.breakdownCount}>{countByPriority[p]}</Text>
                      <Text style={styles.breakdownLabel}>{p}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </Animated.View>

            {/* ══ FILTER BAR ══ */}
            <Animated.View
              style={{
                opacity: listAnim,
                transform: [
                  {
                    translateY: listAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.filterBar}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScroll}
                >
                  {PRIORITY_FILTERS.map((value) => {
                    const selected = priorityFilter === value;
                    const count =
                      value === 'All'
                        ? allSubmitted.length
                        : countByPriority[value as keyof typeof countByPriority];
                    return (
                      <TouchableOpacity
                        key={value}
                        style={[styles.pill, selected && styles.pillSelected]}
                        onPress={() => setPriorityFilter(value)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.pillIcon}>{PRIORITY_ICON[value]}</Text>
                        <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                          {value}
                        </Text>
                        <View style={[styles.pillCount, selected && styles.pillCountSelected]}>
                          <Text
                            style={[
                              styles.pillCountText,
                              selected && styles.pillCountTextSelected,
                            ]}
                          >
                            {count}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Sort toggle */}
                  <TouchableOpacity
                    style={[styles.pill, styles.sortPill, highFirst && styles.sortPillActive]}
                    onPress={() => setHighFirst((v) => !v)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.pillIcon}>{highFirst ? '↑' : '↓'}</Text>
                    <Text style={[styles.pillText, highFirst && styles.pillTextSelected]}>
                      {highFirst ? 'High first' : 'Low first'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Section label */}
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>
                  {priorityFilter === 'All' ? 'All Submissions' : `${priorityFilter} Priority`}
                </Text>
                <Text style={styles.sectionCount}>{submittedTasks.length} tasks</Text>
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
            <Text style={styles.emptyTitle}>All clear!</Text>
            <Text style={styles.emptyBody}>
              No pending submissions right now. Once engineers submit repairs, they'll appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// ── Helper component ──
const MetaChip = ({
  icon,
  label,
  accent,
}: {
  icon: string;
  label: string;
  accent?: boolean;
}) => (
  <View style={[styles.metaChip, accent && styles.metaChipAccent]}>
    <Text style={styles.metaChipIcon}>{icon}</Text>
    <Text style={[styles.metaChipText, accent && styles.metaChipTextAccent]}>{label}</Text>
  </View>
);

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
    gap: 12,
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 10,
    gap: 2,
  },
  breakdownIcon: { fontSize: 16 },
  breakdownCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  breakdownLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // ── Filter bar ──
  filterBar: {
    paddingTop: 14,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
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
  sortPill: {
    borderColor: '#cbd5e1',
  },
  sortPillActive: {
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

  // ── Task card ──
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTaskId: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 17,
  },
  priorityBubble: {
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 3,
    minWidth: 64,
  },
  priorityBubbleIcon: { fontSize: 18 },
  priorityBubbleText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // ── Meta strip ──
  metaStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaChipAccent: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  metaChipIcon: { fontSize: 11 },
  metaChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  metaChipTextAccent: {
    color: '#059669',
  },

  // ── Info blocks ──
  infoBlock: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  infoBlockLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBlockBody: {
    fontSize: 13,
    color: '#1e293b',
    lineHeight: 18,
  },

  // ── Materials ──
  materialsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  materialTag: {
    backgroundColor: '#e0f2fe',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  materialTagText: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
  },

  // ── Photos ──
  photoWrap: {
    position: 'relative',
    marginRight: 10,
  },
  photo: {
    width: 120,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  photoLabel: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  photoLabelText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '700',
  },
  photoPlaceholder: {
    width: 180,
    height: 84,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    gap: 4,
  },
  photoPlaceholderEmoji: { fontSize: 22 },
  photoPlaceholderText: {
    fontSize: 12,
    color: '#94a3b8',
  },

  // ── Action buttons ──
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  rejectBtnIcon: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '800',
  },
  rejectBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  approveBtnIcon: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '800',
  },
  approveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
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