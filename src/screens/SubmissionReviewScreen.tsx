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
  TextInput,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../data/mockTasks';
import { StatusBadge } from '../components/StatusBadge';
import { showSuccessToast } from '../utils/toast';
import { approveRepairSubmission, rejectRepairSubmission } from '../services/reportService_v2';

type ReviewFilter = 'pending' | 'approved' | 'rejected';

export const SubmissionReviewScreen: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<ReviewFilter>('pending');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [rejectionReasonMap, setRejectionReasonMap] = useState<Record<string, string>>({});

  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(listAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  // Filter submissions by status
  const submissionTasks = useMemo(() => {
    const allSubmitted = tasks.filter((t) => t.status === 'Submitted by Engineer');

    switch (filter) {
      case 'approved':
        return allSubmitted.filter((t) => t.status === 'Approved by Team Leader');
      case 'rejected':
        return allSubmitted.filter((t) => t.status === 'Rejected by Team Leader');
      case 'pending':
      default:
        return allSubmitted.filter((t) => t.status === 'Submitted by Engineer');
    }
  }, [tasks, filter]);

  const countByStatus = {
    pending: tasks.filter((t) => t.status === 'Submitted by Engineer').length,
    approved: tasks.filter((t) => t.status === 'Approved by Team Leader').length,
    rejected: tasks.filter((t) => t.status === 'Rejected by Team Leader').length,
  };

  const handleApprove = (task: Task) => {
    Alert.alert(
      'Approve Repair?',
      `Confirm approval of repair for task ${task.id}. This will mark the issue as closed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            try {
              // Call backend approval
              await approveRepairSubmission(
                task.id, // Use task ID as submission reference
                'Repair approved by DMA Manager',
                currentUser?.id || 'manager'
              );
              showSuccessToast('Repair approved. Task closed.');
            } catch (error) {
              Alert.alert('Error', 'Failed to approve repair');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleReject = (task: Task) => {
    setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
  };

  const submitRejection = (task: Task) => {
    const reason = rejectionReasonMap[task.id] || 'Quality check failed';

    if (!reason.trim()) {
      Alert.alert('Error', 'Please enter a rejection reason');
      return;
    }

    Alert.alert(
      'Reject Repair?',
      `Reason: ${reason}\n\nThis will send the repair back to the Team Leader for fixes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectRepairSubmission(
                task.id,
                reason,
                currentUser?.id || 'manager'
              );
              setRejectionReasonMap((prev) => ({ ...prev, [task.id]: '' }));
              setExpandedTaskId(null);
              showSuccessToast('Repair rejected and sent back to Team Leader.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reject repair');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const isExpanded = expandedTaskId === item.id;
    const hasBeforePhotos = item.timeline.some((t) => t.note?.includes('Before'));
    const hasAfterPhotos = item.timeline.some((t) => t.note?.includes('After'));

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
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleReject(item)}
          activeOpacity={0.8}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.taskId}>{item.id}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc} numberOfLines={1}>
                {item.description}
              </Text>
            </View>
            <View style={styles.headerMeta}>
              <StatusBadge label={item.priority} variant="priority" />
              <Text style={styles.teamLeader}>👷 {item.teamLeader}</Text>
            </View>
          </View>

          {/* Submission Details */}
          {!isExpanded && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>📋</Text>
                <Text style={styles.summaryText}>
                  {item.timeline.reduce((acc, t) => {
                    if (t.note?.includes('material') || t.note?.includes('Material')) acc++;
                    return acc;
                  }, 0)} materials logged
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>{hasBeforePhotos ? '📷' : '⚪'}</Text>
                <Text style={styles.summaryText}>
                  {hasBeforePhotos ? 'Before photos' : 'No before photos'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryIcon}>{hasAfterPhotos ? '📷' : '⚪'}</Text>
                <Text style={styles.summaryText}>
                  {hasAfterPhotos ? 'After photos' : 'No after photos'}
                </Text>
              </View>
            </View>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <View style={styles.expandedSection}>
              <ScrollView style={styles.detailsScroll} showsVerticalScrollIndicator={false}>
                {/* Repair Notes */}
                <View style={styles.detailsBlock}>
                  <Text style={styles.detailsTitle}>Repair Notes</Text>
                  <View style={styles.notesBox}>
                    <Text style={styles.notesText}>
                      {item.timeline
                        .filter((t) => t.note && t.note.length > 20)
                        .map((t) => t.note)
                        .join('\n\n') ||
                        'No detailed notes provided.'}
                    </Text>
                  </View>
                </View>

                {/* Photos */}
                {item.reporterPhotos.length > 0 && (
                  <View style={styles.detailsBlock}>
                    <Text style={styles.detailsTitle}>Submission Photos</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.photoScroll}
                    >
                      {item.reporterPhotos.map((uri, idx) => (
                        <Image
                          key={idx}
                          source={{ uri }}
                          style={styles.photoThumbnail}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* Rejection Reason Input */}
                <View style={styles.detailsBlock}>
                  <Text style={styles.detailsTitle}>Rejection Reason (if needed)</Text>
                  <TextInput
                    style={styles.rejectionInput}
                    placeholder="Enter reason for rejection..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={4}
                    value={rejectionReasonMap[item.id] || ''}
                    onChangeText={(text) =>
                      setRejectionReasonMap((prev) => ({
                        ...prev,
                        [item.id]: text,
                      }))
                    }
                  />
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.rejectBtn, !rejectionReasonMap[item.id] && styles.rejectBtnDisabled]}
                  onPress={() => submitRejection(item)}
                  disabled={!rejectionReasonMap[item.id]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.rejectBtnText}>Reject & Return</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprove(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.approveBtnText}>Approve & Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={submissionTasks}
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
                <Text style={styles.heroEyebrow}>💼 DMA Manager</Text>
                <Text style={styles.heroTitle}>Review Submissions</Text>
                <Text style={styles.heroSubtitle}>
                  Approve or reject repair submissions from team leaders
                </Text>
              </LinearGradient>
            </Animated.View>

            {/* Status Cards */}
            <Animated.View
              style={{
                opacity: listAnim,
                transform: [
                  {
                    translateY: listAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.statusRow}>
                <TouchableOpacity
                  style={[styles.statusCard, filter === 'pending' && styles.statusCardActive]}
                  onPress={() => setFilter('pending')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.statusIcon}>⏳</Text>
                  <Text style={styles.statusCount}>{countByStatus.pending}</Text>
                  <Text style={[styles.statusLabel, filter === 'pending' && styles.statusLabelActive]}>
                    Pending
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusCard, filter === 'approved' && styles.statusCardActive]}
                  onPress={() => setFilter('approved')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.statusIcon}></Text>
                  <Text style={styles.statusCount}>{countByStatus.approved}</Text>
                  <Text style={[styles.statusLabel, filter === 'approved' && styles.statusLabelActive]}>
                    Approved
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusCard, filter === 'rejected' && styles.statusCardActive]}
                  onPress={() => setFilter('rejected')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.statusIcon}></Text>
                  <Text style={styles.statusCount}>{countByStatus.rejected}</Text>
                  <Text style={[styles.statusLabel, filter === 'rejected' && styles.statusLabelActive]}>
                    Rejected
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        }
        renderItem={renderTask}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}></Text>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyBody}>
              {filter === 'pending'
                ? 'No pending submissions to review.'
                : `No ${filter} submissions yet.`}
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
  heroCard: {
    paddingHorizontal: 22,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 20 : 20,
    paddingBottom: 28,
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
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  statusCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusCardActive: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },
  statusIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statusCount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusLabelActive: {
    color: '#ffffff',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  taskId: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  teamLeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0077b6',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
  },
  summaryIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  expandedSection: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    maxHeight: 500,
  },
  detailsScroll: {
    marginBottom: 12,
  },
  detailsBlock: {
    marginBottom: 14,
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  notesBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0077b6',
  },
  notesText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  photoScroll: {
    gap: 8,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#e5e7eb',
  },
  rejectionInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#374151',
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  rejectBtn: {
    backgroundColor: '#fee2e2',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectBtnDisabled: {
    opacity: 0.5,
  },
  rejectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  approveBtn: {
    backgroundColor: '#dcfce7',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
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
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
