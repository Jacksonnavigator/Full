import React, { useMemo, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Animated,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../store/taskStore';
import { useAuth } from '../hooks/useAuth';
import { getCurrentUser } from '../services/authService';
import { apiGet } from '../services/apiClient';
import AppHeader from '../components/AppHeader';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { BrandWordmark } from '../components/shared/BrandWordmark';
import { NotificationBellButton } from '../components/shared/NotificationBellButton';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { formatTanzaniaDateTime } from '../lib/dateTime';
import { colors, fontWeight } from '../theme';
import {
  isAwaitingLeaderActionTask,
  isClosedTaskStatus,
  isRejectedTaskStatus,
  isSubmittedWorkStatus,
  isTeamTaskActiveStatus,
} from '../utils/taskStatus';
import { taskMatchesLeaderScope } from '../utils/taskScope';

const normalizeRole = (role?: string | null) =>
  role?.toLowerCase().replace(/\s+/g, '_') ?? 'engineer';

const humanizeRole = (role?: string | null) => {
  const normalized = normalizeRole(role);
  if (normalized === 'team_leader') return 'Team Leader';
  return 'Field Engineer';
};

const describeQueuedUpdateType = (type: string) => {
  switch (type) {
    case 'STATUS_CHANGE':
      return 'Status change';
    case 'ENGINEER_SUBMISSION':
      return 'Engineer submission';
    case 'LEADER_APPROVE':
      return 'Leader approval';
    case 'LEADER_REJECT':
      return 'Leader rejection';
    case 'LEADER_DIRECT_RESOLVE':
      return 'Leader direct resolve';
    default:
      return 'Queued update';
  }
};

const formatBackendStatus = (status?: string) =>
  String(status || 'server')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const toOptionalString = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const resolveUserTeamName = (currentUser: any, storedUser: any) =>
  [
    toOptionalString(currentUser?.teamId),
    toOptionalString(storedUser?.team_id),
    toOptionalString(storedUser?.teamId),
  ].filter(Boolean).includes(toOptionalString(currentUser?.team) || '')
    ? toOptionalString(storedUser?.team_name) || toOptionalString(storedUser?.teamName) || toOptionalString(storedUser?.team)
    : toOptionalString(currentUser?.team) ||
      toOptionalString(storedUser?.team_name) ||
      toOptionalString(storedUser?.teamName) ||
      toOptionalString(storedUser?.team);

const resolveUserTeamId = (currentUser: any, storedUser: any) =>
  currentUser.teamId ||
  storedUser?.team_id ||
  storedUser?.teamId ||
  toOptionalString(currentUser?.team) ||
  null;

const resolveUserDmaName = (currentUser: any, storedUser: any) =>
  currentUser.dmaName ||
  storedUser?.dma_name ||
  storedUser?.dmaName ||
  null;

export const ProfileScreen: React.FC = () => {
  const { language } = useAppLanguage();
  const currentUser = useTaskStore((state) => state.currentUser);
  const tasks = useTaskStore((state) => state.tasks);
  const isOffline = useTaskStore((state) => state.isOffline);
  const offlineQueue = useTaskStore((state) => state.offlineQueue);
  const setOffline = useTaskStore((state) => state.setOffline);
  const syncOfflineQueue = useTaskStore((state) => state.syncOfflineQueue);
  const retryQueuedUpdate = useTaskStore((state) => state.retryQueuedUpdate);
  const acceptServerTaskState = useTaskStore((state) => state.acceptServerTaskState);
  const removeQueuedUpdate = useTaskStore((state) => state.removeQueuedUpdate);
  const clearOfflineQueue = useTaskStore((state) => state.clearOfflineQueue);
  const refreshTasks = useTaskStore((state) => state.refreshTasks);
  const { logout: authLogout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [liveOrg, setLiveOrg] = useState<{
    teamName: string | null;
    teamId: string | null;
    dmaName: string | null;
  }>({
    teamName: null,
    teamId: null,
    dmaName: null,
  });
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [syncingQueue, setSyncingQueue] = useState(false);
  const bottomPadding = useBottomTabPadding();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        if (!fetchedUser) {
          setUser(null);
          return;
        }

        let nextUser = fetchedUser;
        const knownTeamName = resolveUserTeamName(currentUser, fetchedUser);
        const knownTeamId = resolveUserTeamId(currentUser, fetchedUser);

        // If we only have team_id, resolve the team label so profile doesn't show "Not assigned".
        if (!knownTeamName && knownTeamId) {
          try {
            const team = await apiGet<any>(`/api/teams/${knownTeamId}`);
            if (team?.name) {
              nextUser = {
                ...nextUser,
                team_name: team.name,
                teamName: team.name,
              };
            }
          } catch (lookupError) {
            console.warn('Unable to resolve team name from team ID:', lookupError);
          }
        }

        setUser(nextUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    void fetchUser();
  }, [currentUser]);

  useEffect(() => {
    const fetchLiveOrganization = async () => {
      if (!currentUser?.id) return;
      try {
        const engineer = await apiGet<any>(`/api/engineers/${currentUser.id}`);
        setLiveOrg({
          teamName: toOptionalString(engineer?.team_name) || null,
          teamId: toOptionalString(engineer?.team_id) || null,
          dmaName: toOptionalString(engineer?.dma_name) || null,
        });
      } catch (error) {
        console.warn('Unable to refresh live organization details:', error);
        setLiveOrg((prev) => ({
          ...prev,
        }));
      }
    };

    void fetchLiveOrganization();
  }, [currentUser?.id]);

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, [contentAnim, headerAnim]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            setLoadingLogout(true);
            const result = await authLogout();
            if (!result.success) {
              Alert.alert('Logout Failed', result.error || 'Could not logout. Please try again.');
            }
          } catch (error) {
            Alert.alert('Logout Failed', 'Could not logout. Please try again.');
          } finally {
            setLoadingLogout(false);
          }
        },
      },
    ]);
  };

  const handleSyncQueuedWork = async () => {
    try {
      setSyncingQueue(true);
      const result = await syncOfflineQueue();
      await refreshTasks();
      Alert.alert(
        'Sync complete',
        `${result.processed} update${result.processed === 1 ? '' : 's'} synced, ${result.failed} remaining.`
      );
    } catch (error) {
      Alert.alert('Sync failed', 'Queued work could not be synced right now.');
    } finally {
      setSyncingQueue(false);
    }
  };

  const handleToggleOffline = async (value: boolean) => {
    setOffline(value);
    if (!value && offlineQueue.length > 0) {
      await handleSyncQueuedWork();
    }
  };

  const handleRetryQueuedItem = async (queueId: string) => {
    const success = await retryQueuedUpdate(queueId);
    if (!success) {
      Alert.alert('Retry not completed', 'This queued update could not be synced yet. Check the error message shown on the item.');
    }
  };

  const handleRemoveQueuedItem = (queueId: string) => {
    removeQueuedUpdate(queueId);
  };

  const handleUseServerTaskState = async (queueId: string) => {
    await acceptServerTaskState(queueId);
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>No user loaded</Text>
        </View>
      </SafeAreaView>
    );
  }

  const normalizedRole = normalizeRole(currentUser.role);
  const isLeader = normalizedRole === 'team_leader';
  const isEngineer = normalizedRole === 'engineer';
  const explicitTeamName = liveOrg.teamName || resolveUserTeamName(currentUser, user);
  const teamId = liveOrg.teamId || resolveUserTeamId(currentUser, user);

  const myTasks = tasks.filter(
    (task) =>
      task.assignedEngineerId === currentUser.id ||
      task.assignee === currentUser.name ||
      task.assignedEngineer === currentUser.name
  );

  const inferredLeaderTeamName =
    tasks.find((task) => task.teamLeader === currentUser.name && task.assignedTeam)?.assignedTeam || null;
  const inferredEngineerTeamName =
    myTasks.find((task) => task.assignedTeam)?.assignedTeam || null;
  const inferredTeamNameById =
    teamId && typeof teamId === 'string'
      ? tasks.find((task) => task.teamId === teamId && task.assignedTeam && task.assignedTeam !== 'Unassigned')
          ?.assignedTeam || null
      : null;
  const teamName = explicitTeamName || inferredTeamNameById || (isLeader ? inferredLeaderTeamName : inferredEngineerTeamName);

  const inferredDmaName =
    tasks.find((task) => task.dmaName && (task.assignedEngineerId === currentUser.id || task.teamLeader === currentUser.name))
      ?.dmaName || null;
  const dmaName = liveOrg.dmaName || resolveUserDmaName(currentUser, user) || inferredDmaName || 'Not assigned';

  const teamTasks = isLeader
    ? (() => {
        const scopedTasks = tasks.filter((task) => taskMatchesLeaderScope(task, currentUser));
        return scopedTasks.length > 0 ? scopedTasks : tasks;
      })()
    : [];

  const roleTasks = isEngineer ? myTasks : isLeader ? teamTasks : tasks;
  const completedCount = roleTasks.filter((task) => isClosedTaskStatus(task.status)).length;
  const activeCount = roleTasks.filter((task) => isTeamTaskActiveStatus(task.status)).length;
  const pendingReviewCount = isLeader
    ? teamTasks.filter((task) => isAwaitingLeaderActionTask(task)).length
    : myTasks.filter((task) => isSubmittedWorkStatus(task.status)).length;
  const rejectedCount = roleTasks.filter((task) => isRejectedTaskStatus(task.status)).length;
  const directFixes = teamTasks.filter((task) => task.leaderResolution?.resolvedByLeader).length;

  const roleTiles = useMemo(() => {
    if (isLeader) {
      return [
        { label: 'Team Active', value: activeCount, icon: 'people-outline' as const, tone: '#2563eb' },
        { label: 'Team Resolved', value: completedCount, icon: 'checkmark-done-outline' as const, tone: '#16a34a' },
        { label: 'Awaiting Review', value: pendingReviewCount, icon: 'shield-checkmark-outline' as const, tone: '#ea580c' },
      ];
    }

    return [
      { label: 'My Active', value: activeCount, icon: 'construct-outline' as const, tone: '#2563eb' },
      { label: 'Completed', value: completedCount, icon: 'checkmark-circle-outline' as const, tone: '#16a34a' },
      { label: 'Rejections', value: rejectedCount, icon: 'arrow-undo-outline' as const, tone: '#dc2626' },
    ];
  }, [activeCount, completedCount, isLeader, pendingReviewCount, rejectedCount]);

  const initials = currentUser.name
    .split(' ')
    .map((chunk) => chunk[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.scrollSurface}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
      >
        <AppHeader
        title={getText(language, 'Profile', 'Wasifu')}
        subtitle={getText(language, 'Manage your account and settings.', 'Simamia akaunti yako na mipangilio.')}
      />

        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Organization</Text>
            <View style={styles.card}>
              <DetailRow icon="briefcase-outline" label="Role" value={humanizeRole(currentUser.role)} />
              <DetailRow icon="mail-outline" label="Email" value={currentUser.email || user?.email || 'Not available'} />
              <DetailRow icon="people-outline" label="Team" value={teamName || 'Not assigned'} />
              <DetailRow icon="map-outline" label="DMA" value={dmaName} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Work Summary</Text>
            <View style={styles.tileRow}>
              {roleTiles.map((tile) => (
                <View key={tile.label} style={styles.tile}>
                  <View style={[styles.tileIconWrap, { backgroundColor: `${tile.tone}12` }]}>
                    <Ionicons name={tile.icon} size={18} color={tile.tone} />
                  </View>
                  <Text style={[styles.tileValue, { color: tile.tone }]}>{tile.value}</Text>
                  <Text style={styles.tileLabel}>{tile.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Connectivity</Text>
            <View style={styles.card}>
              <View style={styles.offlineRow}>
                <View style={styles.connectivityCopy}>
                  <Text style={styles.cardTitle}>Offline Mode</Text>
                  <Text style={styles.cardSubtitle}>
                    Queue updates locally and replay them when connectivity returns.
                  </Text>
                  <View style={styles.queuePill}>
                    <Ionicons name="cloud-upload-outline" size={14} color={colors.primary} />
                    <Text style={styles.queueText}>
                      {offlineQueue.length} queued update{offlineQueue.length === 1 ? '' : 's'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isOffline}
                  onValueChange={(value) => void handleToggleOffline(value)}
                  trackColor={{ false: '#e2e8f0', true: '#ef4444' }}
                  thumbColor="#ffffff"
                />
              </View>

              <View style={styles.syncRow}>
                <TouchableOpacity
                  style={[styles.syncButton, (offlineQueue.length === 0 || syncingQueue) && styles.syncButtonDisabled]}
                  onPress={() => void handleSyncQueuedWork()}
                  disabled={offlineQueue.length === 0 || syncingQueue}
                  activeOpacity={0.85}
                >
                  {syncingQueue ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="sync-outline" size={16} color="#ffffff" />
                      <Text style={styles.syncButtonText}>Sync queued work</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => clearOfflineQueue()}
                  activeOpacity={0.85}
                >
                  <Ionicons name="trash-outline" size={16} color="#475569" />
                  <Text style={styles.clearButtonText}>Clear queue</Text>
                </TouchableOpacity>
              </View>

{offlineQueue.length > 0 ? (
                <View style={styles.queueList}>
                  {offlineQueue.map((item) => {
                    const queueStatus = item.syncStatus || 'queued';
                    return (
                      <View key={item.id} style={styles.queueItem}>
                        <View style={styles.queueItemHeader}>
                          <Text style={styles.queueItemTitle}>{describeQueuedUpdateType(item.type)}</Text>
                          <View
                            style={[
                              styles.queueStatusBadge,
                              queueStatus === 'failed'
                                ? styles.queueStatusFailed
                                : queueStatus === 'conflict'
                                ? styles.queueStatusConflict
                                : queueStatus === 'syncing'
                                ? styles.queueStatusSyncing
                                : styles.queueStatusQueued,
                            ]}
                          >
                            <Text style={styles.queueStatusBadgeText}>{queueStatus}</Text>
                          </View>
                        </View>
                        <Text style={styles.queueItemMeta}>Task ID: {item.taskId}</Text>
                        <Text style={styles.queueItemMeta}>
                          Attempts: {item.retryCount ?? 0}
                          {item.lastAttemptAt ? ` - Last try ${formatTanzaniaDateTime(item.lastAttemptAt)}` : ''}
                        </Text>
                        {item.conflictSnapshot?.backendStatus ? (
                          <Text style={styles.queueItemMeta}>
                            Server now shows: {formatBackendStatus(item.conflictSnapshot.backendStatus)}
                            {item.conflictSnapshot.backendUpdatedAt
                              ? ` - ${formatTanzaniaDateTime(item.conflictSnapshot.backendUpdatedAt)}`
                              : ''}
                          </Text>
                        ) : null}
                        {item.conflictSnapshot?.backendNotes ? (
                          <Text style={styles.queueItemConflictNote}>{item.conflictSnapshot.backendNotes}</Text>
                        ) : null}
                        {item.lastError ? <Text style={styles.queueItemError}>{item.lastError}</Text> : null}
                        <View style={styles.queueItemActions}>
                          <TouchableOpacity
                            style={[styles.queueActionButton, styles.queueRetryButton]}
                            onPress={() => void handleRetryQueuedItem(item.id)}
                            activeOpacity={0.85}
                          >
                            <Ionicons name="refresh-outline" size={14} color="#ffffff" />
                            <Text style={styles.queueActionButtonText}>
                              {queueStatus === 'conflict' ? 'Keep Local' : 'Retry'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.queueActionButton, styles.queueRemoveButton]}
                            onPress={() =>
                              queueStatus === 'conflict'
                                ? void handleUseServerTaskState(item.id)
                                : handleRemoveQueuedItem(item.id)
                            }
                            activeOpacity={0.85}
                          >
                            <Ionicons
                              name={queueStatus === 'conflict' ? 'cloud-done-outline' : 'close-outline'}
                              size={14}
                              color="#475569"
                            />
                            <Text style={styles.queueRemoveButtonText}>
                              {queueStatus === 'conflict' ? 'Use Server' : 'Remove'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </View>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            {loadingLogout ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                <Text style={styles.logoutText}>Sign out</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabelWrap}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollSurface: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  heroCard: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -70,
    right: -36,
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -24,
    left: -10,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  roleChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  roleChipText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '700',
  },
  heroMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
  },
  heroAside: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusCard: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statusCardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusCardValue: {
    marginTop: 2,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '800',
  },
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
  },
  heroStatNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  detailLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  tileRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileValue: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  tileLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectivityCopy: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  queuePill: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  queueText: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '700',
  },
  syncRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  queueList: {
    marginTop: 14,
    gap: 10,
  },
  queueItem: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fbff',
    padding: 12,
    gap: 4,
  },
  queueItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  queueItemTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  queueStatusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  queueStatusQueued: {
    backgroundColor: '#e0f2fe',
  },
  queueStatusSyncing: {
    backgroundColor: '#fef3c7',
  },
  queueStatusFailed: {
    backgroundColor: '#fee2e2',
  },
  queueStatusConflict: {
    backgroundColor: '#ede9fe',
  },
  queueStatusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'capitalize',
  },
  queueItemMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  queueItemError: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
    lineHeight: 16,
  },
  queueItemConflictNote: {
    fontSize: 12,
    color: '#5b21b6',
    lineHeight: 16,
  },
  queueItemActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  queueActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  queueRetryButton: {
    backgroundColor: '#0f5fff',
  },
  queueRemoveButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  queueActionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  queueRemoveButtonText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },
  syncButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#0f5fff',
    paddingVertical: 12,
  },
  syncButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearButtonText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
  },
});
