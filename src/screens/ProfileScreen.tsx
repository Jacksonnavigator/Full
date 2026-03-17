import React, { useRef, useEffect, useState } from 'react';
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
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskStore } from '../store/taskStore';
import { getCurrentUser, logoutUser } from '../services/authService';
import { colors, borderRadius, fontWeight, spacing, fontSize } from '../theme';

export const ProfileScreen: React.FC = () => {
  const currentUser = useTaskStore((state) => state.currentUser);
  const tasks = useTaskStore((state) => state.tasks);
  const isOffline = useTaskStore((state) => state.isOffline);
  const offlineQueue = useTaskStore((state) => state.offlineQueue);
  const setOffline = useTaskStore((state) => state.setOffline);
  const clearOfflineQueue = useTaskStore((state) => state.clearOfflineQueue);
  const logout = useTaskStore((state) => state.logout);
  const [user, setUser] = useState<any>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);
        console.log('✅ User loaded from backend');
      } catch (error) {
        console.error('❌ Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            setLoadingLogout(true);
            await logoutUser();
            logout();
          } catch (error) {
            Alert.alert('Logout Failed', 'Could not logout. Please try again.');
            console.error('Logout error:', error);
          } finally {
            setLoadingLogout(false);
          }
        },
      },
    ]);
  };

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.centered}>
          <Text style={styles.errorEmoji}></Text>
          <Text style={styles.errorTitle}>No user loaded</Text>
        </View>
      </SafeAreaView>
    );
  }

  const normalizeRole = (role: string) => role?.toLowerCase().replace(/\s+/g, '_');
  const normalizedRole = normalizeRole(currentUser.role);
  const isLeader = normalizedRole === 'team_leader';
  const isEngineer = normalizedRole === 'engineer';
  const myTasks = tasks.filter((t) => t.assignee === currentUser.name);

  const completedCount = isEngineer
    ? myTasks.filter((t) => t.status === 'Closed by Manager').length
    : tasks.filter((t) => t.status === 'Closed by Manager').length;

  const inProgressCount = isEngineer
    ? myTasks.filter((t) =>
        ['Assigned', 'In Progress', 'Submitted by Engineer', 'Rejected by Team Leader'].includes(
          t.status
        )
      ).length
    : tasks.filter((t) =>
        ['Assigned', 'In Progress', 'In Progress (Leader)', 'Submitted by Engineer'].includes(
          t.status
        )
      ).length;

  const rejectedSubmissions = isEngineer
    ? myTasks.reduce(
        (sum, t) =>
          sum + t.timeline.filter((e) => e.status === 'Rejected by Team Leader').length,
        0
      )
    : 0;

  const approvalsByLeader = isLeader
    ? tasks.reduce(
        (sum, t) =>
          sum +
          t.timeline.filter(
            (e) => e.status === 'Approved by Team Leader' && e.actorRole === 'Team Leader'
          ).length,
        0
      )
    : 0;

  const rejectionsByLeader = isLeader
    ? tasks.reduce(
        (sum, t) =>
          sum +
          t.timeline.filter(
            (e) => e.status === 'Rejected by Team Leader' && e.actorRole === 'Team Leader'
          ).length,
        0
      )
    : 0;

  const directFixes = isLeader
    ? tasks.filter((t) => t.leaderResolution?.resolvedByLeader).length
    : 0;

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const totalDecisions = approvalsByLeader + rejectionsByLeader;
  const approvalRate =
    totalDecisions === 0 ? null : Math.round((approvalsByLeader / totalDecisions) * 100);

  const handleToggleOffline = (value: boolean) => {
    if (!value && offlineQueue.length > 0) {
      const count = offlineQueue.length;
      clearOfflineQueue();
      Alert.alert(
        'Sync complete (simulated)',
        `${count} offline update${count > 1 ? 's' : ''} have been synced.`
      );
    }
    setOffline(value);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ══ HERO HEADER ══ */}
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [
              { translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) },
            ],
          }}
        >
          <LinearGradient
            colors={['#06b6d4', '#2563eb', '#0b3558']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.decCircle1} />
            <View style={styles.decCircle2} />

            {/* Avatar + identity */}
            <View style={styles.heroBody}>
              <View style={styles.avatarWrap}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.08)']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>{initials}</Text>
                </LinearGradient>
                {/* Online / Offline indicator dot */}
                <View style={[styles.statusDot, { backgroundColor: isOffline ? '#ef4444' : '#34d399' }]} />
              </View>

              <View style={styles.heroInfo}>
                <Text style={styles.heroName}>{currentUser.name}</Text>
                <View style={styles.roleChip}>
                  <Text style={styles.roleChipText}>
                    {isLeader ? 'Team Leader' : 'Field Engineer'}
                  </Text>
                </View>
                {currentUser.team && (
                  <Text style={styles.heroTeam}>Team {currentUser.team}</Text>
                )}
              </View>
            </View>

            {/* Quick stat strip */}
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>{completedCount}</Text>
                <Text style={styles.heroStatLabel}>Completed</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>{inProgressCount}</Text>
                <Text style={styles.heroStatLabel}>In Progress</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.heroStatNumber}>
                  {isLeader ? directFixes : rejectedSubmissions}
                </Text>
                <Text style={styles.heroStatLabel}>
                  {isLeader ? 'Direct Fixes' : 'Rejections'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [
              { translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
            ],
          }}
        >
          {/* ══ ORGANIZATIONAL DETAILS ══ */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Organizational Details</Text>
            <View style={styles.card}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Role</Text>
                <Text style={styles.detailValue}>
                  {isLeader ? 'Team Leader' : 'Field Engineer'}
                </Text>
              </View>
              {user?.teamId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Team</Text>
                  <Text style={styles.detailValue}>{user.teamId}</Text>
                </View>
              )}
              {user?.utilityId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Utility</Text>
                  <Text style={styles.detailValue}>{user.utilityId}</Text>
                </View>
              )}
              {user?.dmaId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>DMA</Text>
                  <Text style={styles.detailValue}>{user.dmaId}</Text>
                </View>
              )}
              {user?.branchId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Branch</Text>
                  <Text style={styles.detailValue}>{user.branchId}</Text>
                </View>
              )}
            </View>
          </View>

          {/* ══ ENGINEER: QUALITY FEEDBACK ══ */}
          {isEngineer && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Quality Feedback</Text>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconWrap, { backgroundColor: rejectedSubmissions > 0 ? '#fef2f2' : '#ecfdf5' }]}>
                    <Text style={styles.cardIcon}>{rejectedSubmissions > 0 ? 'R' : 'A'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Rejected Submissions</Text>
                    <Text style={styles.cardSubtitle}>
                      Times a Team Leader has sent back your repair reports.
                    </Text>
                  </View>
                  <Text style={[
                    styles.bigStat,
                    { color: rejectedSubmissions > 0 ? '#ef4444' : '#10b981' },
                  ]}>
                    {rejectedSubmissions}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ══ LEADER: SUPERVISION SUMMARY ══ */}
          {isLeader && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Supervision Summary</Text>

              {/* Approvals / Rejections tile grid */}
              <View style={styles.tileRow}>
                <View style={[styles.tile, { backgroundColor: '#ecfdf5' }]}>
                  <Text style={styles.tileIcon}>✓</Text>
                  <Text style={[styles.tileStat, { color: '#10b981' }]}>{approvalsByLeader}</Text>
                  <Text style={styles.tileLabel}>Approvals</Text>
                </View>
                <View style={[styles.tile, { backgroundColor: '#fef2f2' }]}>
                  <Text style={styles.tileIcon}>✗</Text>
                  <Text style={[styles.tileStat, { color: '#ef4444' }]}>{rejectionsByLeader}</Text>
                  <Text style={styles.tileLabel}>Rejections</Text>
                </View>
                <View style={[styles.tile, { backgroundColor: '#eff6ff' }]}>
                  <Text style={styles.tileIcon}>≡</Text>
                  <Text style={[styles.tileStat, { color: '#3b82f6' }]}>
                    {approvalRate == null ? '—' : `${approvalRate}%`}
                  </Text>
                  <Text style={styles.tileLabel}>Approval Rate</Text>
                </View>
              </View>

              {/* Direct fixes card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconWrap, { backgroundColor: '#f5f3ff' }]}>
                    <Text style={styles.cardIcon}></Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Direct Fixes</Text>
                    <Text style={styles.cardSubtitle}>
                      Tasks you personally resolved as Team Leader.
                    </Text>
                  </View>
                  <Text style={[styles.bigStat, { color: '#8b5cf6' }]}>{directFixes}</Text>
                </View>
              </View>
            </View>
          )}

          {/* ══ OFFLINE MODE ══ */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Connectivity</Text>
            <View style={styles.card}>
              <View style={styles.offlineRow}>
                <View style={[styles.cardIconWrap, { backgroundColor: isOffline ? '#fef2f2' : '#ecfdf5' }]}>
                  <Text style={styles.cardIcon}>{isOffline ? '📵' : '📶'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Offline Mode</Text>
                  <Text style={styles.cardSubtitle}>
                    Queue updates locally and sync when back online.
                  </Text>
                  {offlineQueue.length > 0 && (
                    <View style={styles.queueBadge}>
                      <Text style={styles.queueBadgeText}>
                        {offlineQueue.length} update{offlineQueue.length > 1 ? 's' : ''} queued
                      </Text>
                    </View>
                  )}
                </View>
                <Switch
                  value={isOffline}
                  onValueChange={handleToggleOffline}
                  trackColor={{ false: '#e2e8f0', true: '#ef4444' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* ══ SIGN OUT ══ */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Error ──
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorEmoji: { fontSize: 40 },
  errorTitle: { fontSize: 18, fontWeight: fontWeight.bold, color: colors.foreground },

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
    backgroundColor: colors.primary + '08',
    top: -70,
    right: -60,
  },
  decCircle2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.primary + '1a',
    bottom: -30,
    left: 10,
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 22,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 26,
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
    gap: 6,
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  roleChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  roleChipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },
  heroTeam: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },

  // ── Hero stat strip ──
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  heroStatNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 4,
  },

  // ── Sections ──
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },

  // ── Card ──
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: { fontSize: 20 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  bigStat: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 32,
  },

  // ── Tile grid (leader) ──
  tileRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tileIcon: { fontSize: 20 },
  tileStat: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
  },
  tileLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },

  // ── Offline ──
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  queueBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fef9c3',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  queueBadgeText: {
    fontSize: 11,
    color: '#854d0e',
    fontWeight: '700',
  },

  // ── Detail Rows ──
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  // ── Logout ──
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
  logoutIcon: { fontSize: 16 },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
  },
});