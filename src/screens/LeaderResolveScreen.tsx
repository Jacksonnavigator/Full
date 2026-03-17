import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../data/mockTasks';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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
};

export const LeaderResolveScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tasks = useTaskStore((state) => state.tasks);
  const startTaskAsLeader = useTaskStore((state) => state.startTaskAsLeader);

  const candidates = tasks.filter(
    (t) => t.status === 'Assigned' || t.status === 'In Progress (Leader)'
  );

  const assignedCount = candidates.filter((t) => t.status === 'Assigned').length;
  const inProgressCount = candidates.filter((t) => t.status === 'In Progress (Leader)').length;

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  const handleStartOrOpen = (task: Task) => {
    if (task.status === 'Assigned') {
      startTaskAsLeader(task.id);
      Alert.alert('Task started', 'You have taken this task as Team Leader.');
    }
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const renderItem = ({ item, index }: { item: Task; index: number }) => {
    const isInProgress = item.status === 'In Progress (Leader)';
    const priorityColor = PRIORITY_COLOR[item.priority] ?? '#6b7280';
    const priorityBg = PRIORITY_BG[item.priority] ?? '#f9fafb';

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
        <View style={[styles.card, { borderTopColor: priorityColor }]}>
          {/* ── Card header ── */}
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTaskId}>{item.id}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
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
            <View style={styles.metaChip}>
              <Text style={styles.metaIcon}></Text>
              <Text style={styles.metaText}>{item.assignedTeam}</Text>
            </View>
            <View style={[styles.metaChip, isInProgress && styles.metaChipActive]}>
              <Text style={styles.metaIcon}>{isInProgress ? 'IP' : 'SU'}</Text>
              <Text style={[styles.metaText, isInProgress && styles.metaTextActive]}>
                {isInProgress ? 'In Progress (You)' : 'Assigned'}
              </Text>
            </View>
            {item.teamLeader && (
              <View style={styles.metaChip}>
                <Text style={styles.metaIcon}></Text>
                <Text style={styles.metaText}>{item.teamLeader}</Text>
              </View>
            )}
          </View>

          {/* ── CTA button ── */}
          {isInProgress ? (
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => handleStartOrOpen(item)}
              activeOpacity={0.85}
            >
              <Text style={styles.openBtnIcon}>↗</Text>
              <Text style={styles.openBtnText}>Open Task</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => handleStartOrOpen(item)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#1d4ed8', '#0f5fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtnGradient}
              >
                <Text style={styles.startBtnIcon}>▶</Text>
                <Text style={styles.startBtnText}>Start as Leader</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={candidates}
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
                    <Text style={styles.heroTitle}>Resolve Directly</Text>
                    <Text style={styles.heroSubtitle}>
                      Take over a task yourself and submit evidence
                    </Text>
                  </View>
                  <View style={styles.heroBadge}>
                    <Text style={styles.heroBadgeNumber}>{candidates.length}</Text>
                    <Text style={styles.heroBadgeLabel}>available</Text>
                  </View>
                </View>

                {/* Breakdown strip */}
                <View style={styles.breakdownRow}>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}>📋</Text>
                    <Text style={styles.breakdownCount}>{assignedCount}</Text>
                    <Text style={styles.breakdownLabel}>Assigned</Text>
                  </View>
                  <View style={styles.breakdownDivider} />
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}></Text>
                    <Text style={styles.breakdownCount}>{inProgressCount}</Text>
                    <Text style={styles.breakdownLabel}>In Progress</Text>
                  </View>
                  <View style={styles.breakdownDivider} />
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownIcon}>📌</Text>
                    <Text style={styles.breakdownCount}>{candidates.length}</Text>
                    <Text style={styles.breakdownLabel}>Total</Text>
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
                <Text style={styles.sectionLabel}>Open Tasks</Text>
                <Text style={styles.sectionCount}>{candidates.length} tasks</Text>
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Text style={styles.emptyEmoji}></Text>
            </View>
            <Text style={styles.emptyTitle}>All handled!</Text>
            <Text style={styles.emptyBody}>
              No tasks are currently available for direct resolution. Assigned tasks will appear here when ready.
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
    gap: 12,
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
  metaChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  metaIcon: { fontSize: 11 },
  metaText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  metaTextActive: {
    color: '#1d4ed8',
  },

  // ── Buttons ──
  startBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  startBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  startBtnIcon: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '800',
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  openBtnIcon: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '800',
  },
  openBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
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