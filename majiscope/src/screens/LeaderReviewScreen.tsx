import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import AppHeader from '../components/AppHeader';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';
import { ResolvedImage } from '../components/ResolvedImage';
import { ImageLightboxModal } from '../components/shared/ImageLightboxModal';
import { NotificationBellButton } from '../components/shared/NotificationBellButton';
import { PaginationBar } from '../components/shared/PaginationBar';
import { usePagination } from '../hooks/usePagination';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { StatusBadge } from '../components/StatusBadge';
import { formatTanzaniaShortDateTime } from '../lib/dateTime';
import { showSuccessToast } from '../utils/toast';
import { colors } from '../theme';
import { isAwaitingLeaderActionTask, isAwaitingLeaderReviewStatus } from '../utils/taskStatus';
import { taskMatchesLeaderScope } from '../utils/taskScope';

const PRIORITY_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'] as const;
type PriorityFilter = (typeof PRIORITY_FILTERS)[number];
const REJECTION_PRESETS = [
  {
    id: 'evidence',
    label: 'Evidence unclear',
    message: 'Resolved images do not clearly show the repaired leakage point.',
  },
  {
    id: 'location',
    label: 'Wrong location',
    message: 'The submission does not match the reported site and needs field recheck.',
  },
  {
    id: 'notes',
    label: 'Notes incomplete',
    message: 'Repair notes are incomplete and need a clearer explanation of the work done.',
  },
  {
    id: 'quality',
    label: 'Repair not complete',
    message: 'The leakage appears not fully resolved and needs additional field work.',
  },
] as const;

const PRIORITY_COLOR: Record<string, string> = {
  Critical: '#b91c1c',
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#22c55e',
};

const PRIORITY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Critical: 'flame-outline',
  High: 'alert-circle-outline',
  Medium: 'warning-outline',
  Low: 'checkmark-circle-outline',
  All: 'layers-outline',
};

const getPriorityDisplayLabel = (value: string) => (value === 'Medium' ? 'Moderate' : value);

export const LeaderReviewScreen: React.FC = () => {
  const { language } = useAppLanguage();
  const tasks = useTaskStore((state) => state.tasks);
  const currentUser = useTaskStore((state) => state.currentUser);
  const refreshTasks = useTaskStore((state) => state.refreshTasks);
  const leaderApprove = useTaskStore((state) => state.leaderApprove);
  const leaderReject = useTaskStore((state) => state.leaderReject);

  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [highFirst, setHighFirst] = useState(true);
  const bottomPadding = useBottomTabPadding();
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [approveTaskId, setApproveTaskId] = useState<string | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectCategory, setRejectCategory] = useState<(typeof REJECTION_PRESETS)[number]['id'] | null>(null);
  const [rejectTaskId, setRejectTaskId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ uri: string; label: string } | null>(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(listAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      void refreshTasks();
    }, [refreshTasks])
  );

  const leaderScopedTasks = useMemo(() => {
    const scopedTasks = tasks.filter((task) => taskMatchesLeaderScope(task, currentUser));
    return scopedTasks.length > 0 ? scopedTasks : tasks;
  }, [tasks, currentUser]);

  const submittedTasks = useMemo(() => {
    const base = leaderScopedTasks.filter((task) => isAwaitingLeaderActionTask(task));
    const filtered = priorityFilter === 'All' ? base : base.filter((t) => t.priority === priorityFilter);
    const rank: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return [...filtered].sort((a, b) => {
      const diff = (rank[a.priority] ?? 99) - (rank[b.priority] ?? 99);
      return highFirst ? diff : -diff;
    });
  }, [leaderScopedTasks, priorityFilter, highFirst]);

  const {
    paginatedItems,
    page,
    totalPages,
    totalItems,
    pageSize,
    resetPage,
    prevPage,
    nextPage,
  } = usePagination(submittedTasks, 6);

  useEffect(() => {
    resetPage();
  }, [priorityFilter, highFirst, resetPage]);

  const allSubmitted = leaderScopedTasks.filter((task) => isAwaitingLeaderActionTask(task));
  const countByPriority = {
    Critical: allSubmitted.filter((t) => t.priority === 'Critical').length,
    High: allSubmitted.filter((t) => t.priority === 'High').length,
    Medium: allSubmitted.filter((t) => t.priority === 'Medium').length,
    Low: allSubmitted.filter((t) => t.priority === 'Low').length,
  };

  const handleApprove = (taskId: string) => {
    setApproveTaskId(taskId);
    setApproveComment('');
    setApproveModalVisible(true);
  };

  const handleConfirmApprove = () => {
    if (!approveTaskId) return;

    const trimmedComment = approveComment.trim();
    if (!trimmedComment) {
      return;
    }

    leaderApprove(approveTaskId, trimmedComment);
    setApproveModalVisible(false);
    setApproveTaskId(null);
    setApproveComment('');
    showSuccessToast('Repair approved and sent for DMA approval.');
  };

  const handleReject = (taskId: string) => {
    setRejectTaskId(taskId);
    setRejectReason('');
    setRejectCategory(null);
    setRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!rejectTaskId) return;

    const selectedPreset = REJECTION_PRESETS.find((preset) => preset.id === rejectCategory);
    const composedReason = [selectedPreset?.message, rejectReason.trim()].filter(Boolean).join(' ');
    leaderReject(rejectTaskId, composedReason || 'Repair rejected by Team Leader.');
    setRejectModalVisible(false);
    setRejectTaskId(null);
    setRejectReason('');
    setRejectCategory(null);
    showSuccessToast('Repair rejected and sent back to engineer.');
  };

  const getSubmittedEntry = (task: Task) => {
    for (let i = task.timeline.length - 1; i >= 0; i--) {
      if (isAwaitingLeaderReviewStatus(task.timeline[i].status)) return task.timeline[i];
    }
    return undefined;
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const report = item.engineerReport;
    const submittedEntry = getSubmittedEntry(item);
    const submittedAt = submittedEntry
      ? formatTanzaniaShortDateTime(submittedEntry.timestamp, '--')
      : '--';

    const priorityColor = PRIORITY_COLOR[item.priority] ?? '#6b7280';
    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 320,
      delay: index * 70,
      useNativeDriver: true,
    }).start();

    const photosBefore = report?.beforePhotos ?? [];
    const photosAfter = report?.afterPhotos ?? [];
    const previewPhotos = (photosAfter.length > 0 ? photosAfter : photosBefore).slice(0, 3);
    const evidenceSummary = [
      previewPhotos.length > 0 ? `${previewPhotos.length} photo${previewPhotos.length > 1 ? 's' : ''}` : 'No photos',
      report?.notes?.trim() ? 'Has notes' : 'No notes',
    ].join(' · ');

    return (
      <Animated.View
        style={{
          opacity: itemAnim,
          transform: [{ translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }}
      >
        <View style={[styles.card, { borderTopColor: priorityColor }]}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTaskId}>{item.trackingId || item.id}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title || item.description}
              </Text>
              <Text style={styles.cardMeta} numberOfLines={1}>
                {item.assignee ?? 'Unassigned'} · Submitted {submittedAt}
              </Text>
              <Text style={styles.cardMetaMuted} numberOfLines={1}>
                {evidenceSummary}
              </Text>
            </View>
            <StatusBadge label={item.priority} variant="priority" />
          </View>

          {previewPhotos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoScroll}>
              {previewPhotos.map((uri, idx) => (
                <TouchableOpacity
                  key={`${uri}-${idx}`}
                  style={styles.photoWrap}
                  onPress={() =>
                    setLightboxImage({
                      uri,
                      label: `Evidence ${idx + 1}`,
                    })
                  }
                  activeOpacity={0.9}
                >
                  <ResolvedImage uri={uri} style={styles.photo} fallbackContainerStyle={styles.photoFallback} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => handleReject(item.id)}
              activeOpacity={0.85}
            >
              <Ionicons name="close-outline" size={18} color="#ef4444" />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => handleApprove(item.id)}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-outline" size={18} color="#ffffff" />
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={paginatedItems}
        keyExtractor={(item) => item.id}
        style={styles.listSurface}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        ListHeaderComponent={
          <>
            <Animated.View
              style={{
                opacity: headerAnim,
                transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
              }}
            >
              <AppHeader
                title={getText(language, 'Review Queue', 'Foleni ya Mapitio')}
                subtitle={getText(
                  language,
                  `${allSubmitted.length} pending submission${allSubmitted.length === 1 ? '' : 's'}`,
                  `${allSubmitted.length} uwasilishaji unaosubiri`
                )}
              />
            </Animated.View>

            <Animated.View
              style={{
                opacity: listAnim,
                transform: [{ translateY: listAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
              }}
            >
              <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
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
                        <Ionicons
                          name={PRIORITY_ICON[value]}
                          size={14}
                          color={selected ? '#ffffff' : '#475569'}
                        />
                        <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                          {getPriorityDisplayLabel(value)}
                        </Text>
                        <View style={[styles.pillCount, selected && styles.pillCountSelected]}>
                          <Text style={[styles.pillCountText, selected && styles.pillCountTextSelected]}>
                            {count}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={[styles.pill, styles.sortPill, highFirst && styles.sortPillActive]}
                    onPress={() => setHighFirst((v) => !v)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={highFirst ? 'arrow-down-outline' : 'arrow-up-outline'} size={14} color={highFirst ? '#ffffff' : '#475569'} />
                    <Text style={[styles.pillText, highFirst && styles.pillTextSelected]}>
                      {highFirst ? 'High first' : 'Low first'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderTask}
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
              <Ionicons name="shield-checkmark-outline" size={34} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>All clear</Text>
            <Text style={styles.emptyBody}>
              No pending submissions right now. Once engineers submit repairs, they will appear here.
            </Text>
          </View>
        }
      />
      <Modal
        visible={approveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setApproveModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Approve Repair</Text>
            <Text style={styles.modalSubtitle}>
              Add the team leader review comment that should travel with this repair to the DMA manager.
            </Text>
            <TextInput
              value={approveComment}
              onChangeText={setApproveComment}
              placeholder="Example: Verified repaired joint on site and evidence matches the reported leakage."
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.modalHint}>A short approval comment is required before submission.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setApproveModalVisible(false);
                  setApproveTaskId(null);
                  setApproveComment('');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalApproveButton,
                  !approveComment.trim() && styles.modalApproveButtonDisabled,
                ]}
                onPress={handleConfirmApprove}
                disabled={!approveComment.trim()}
                activeOpacity={0.85}
              >
                <Text style={styles.modalApproveButtonText}>Approve & Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reject Repair</Text>
            <Text style={styles.modalSubtitle}>
              Add a clear reason so the engineer knows exactly what needs rework.
            </Text>
            <View style={styles.modalPresetWrap}>
              {REJECTION_PRESETS.map((preset) => {
                const selected = rejectCategory === preset.id;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    style={[styles.modalPresetChip, selected && styles.modalPresetChipSelected]}
                    onPress={() => setRejectCategory(selected ? null : preset.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.modalPresetChipText, selected && styles.modalPresetChipTextSelected]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TextInput
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Add extra context for the engineer if needed."
              placeholderTextColor="#94a3b8"
              style={styles.modalInput}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setRejectModalVisible(false);
                  setRejectTaskId(null);
                  setRejectReason('');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalRejectButton}
                onPress={handleConfirmReject}
                activeOpacity={0.85}
              >
                <Text style={styles.modalRejectButtonText}>Reject Repair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ImageLightboxModal
        visible={Boolean(lightboxImage)}
        uri={lightboxImage?.uri}
        label={lightboxImage?.label}
        onClose={() => setLightboxImage(null)}
      />
    </SafeAreaView>
  );
};

const MetaChip = ({
  icon,
  label,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  accent?: boolean;
}) => (
  <View style={[styles.metaChip, accent && styles.metaChipAccent]}>
    <Ionicons name={icon} size={13} color={accent ? '#059669' : '#475569'} />
    <Text style={[styles.metaChipText, accent && styles.metaChipTextAccent]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  listSurface: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  listContent: {
    paddingBottom: 40,
  },
  heroCard: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
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
    marginBottom: 8,
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
    lineHeight: 15,
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
  breakdownRow: {
    flexDirection: 'row',
    gap: 6,
  },
  breakdownItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 13,
    paddingVertical: 7,
    gap: 3,
  },
  breakdownCount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  breakdownLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.62)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
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
  sortPill: {
    borderColor: '#cbd5e1',
  },
  sortPillActive: {
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
    paddingTop: 14,
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
  headerSide: {
    alignItems: 'flex-end',
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
  cardMeta: {
    fontSize: 12,
    color: '#475569',
    marginTop: 6,
    fontWeight: '600',
  },
  cardMetaMuted: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 17,
  },
  classificationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  leakageChip: {
    borderRadius: 999,
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#a5f3fc',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  leakageChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#155e75',
  },
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
  metaChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  metaChipTextAccent: {
    color: '#059669',
  },
  reviewSignalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reviewSignal: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  reviewSignalGood: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  reviewSignalWarn: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  reviewSignalRisk: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  reviewSignalText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reviewSignalTextGood: {
    color: '#059669',
  },
  reviewSignalTextWarn: {
    color: '#b45309',
  },
  reviewSignalTextRisk: {
    color: '#dc2626',
  },
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
  locationMetaList: {
    gap: 8,
  },
  locationMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  locationMetaText: {
    flex: 1,
    fontSize: 13,
    color: '#1e293b',
    lineHeight: 18,
    fontWeight: '600',
  },
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
  photoScroll: {
    paddingTop: 4,
  },
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
  photoFallback: {
    width: 120,
    height: 84,
    borderRadius: 12,
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
    gap: 6,
  },
  photoPlaceholderText: {
    fontSize: 12,
    color: '#94a3b8',
  },
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
  approveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
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
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0f172a',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubtitle: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748b',
  },
  modalHint: {
    marginTop: 10,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  modalPresetWrap: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalPresetChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalPresetChipSelected: {
    borderColor: '#0f172a',
    backgroundColor: '#0f172a',
  },
  modalPresetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  modalPresetChipTextSelected: {
    color: '#ffffff',
  },
  modalInput: {
    marginTop: 14,
    minHeight: 118,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  modalRejectButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#ef4444',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalRejectButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  modalApproveButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#16a34a',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApproveButtonDisabled: {
    backgroundColor: '#86efac',
  },
  modalApproveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
