import React, { useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import AppHeader from '../components/AppHeader';
import { DMAHeroCard, DMATile, DMASectionHeading, getDMAInitials } from '../components/dma/DMAChrome';
import { useDMAStore, type DMATeam } from '../store/dmaStore';
import { useAuthStore } from '../store/authStore';
import { NotificationBellButton } from '../components/shared/NotificationBellButton';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { StatusBadge } from '../components/StatusBadge';
import { formatTanzaniaWeekdayDate } from '../lib/dateTime';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { colors, spacing, borderRadius, typography } from '../theme';

export const DMADashboardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language } = useAppLanguage();
  const currentUser = useAuthStore((state) => state.currentUser);
  const reports = useDMAStore((state) => state.reports);
  const teams = useDMAStore((state) => state.teams);
  const engineers = useDMAStore((state) => state.engineers);
  const refreshAllData = useDMAStore((state) => state.refreshAllData);
  const [refreshing, setRefreshing] = useState(false);
  const bottomPadding = useBottomTabPadding();

  useFocusEffect(
    React.useCallback(() => {
      void refreshAllData();
    }, [refreshAllData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllData();
    } finally {
      setRefreshing(false);
    }
  };

  const dmaName =
    String(currentUser?.dma_name || (currentUser as any)?.dmaName || '').trim() || 'Your DMA';
  const utilityName =
    String(currentUser?.utility_name || (currentUser as any)?.utilityName || '').trim() || 'Assigned Utility';

  const today = formatTanzaniaWeekdayDate(new Date(), 'Today');

  const summary = useMemo(() => {
    const openReports = reports.filter((report) => !['approved', 'closed'].includes(report.status));
    const pendingApprovals = reports.filter((report) => report.status === 'pending_approval');
    const inField = reports.filter((report) => report.status === 'assigned' || report.status === 'in_progress');
    const criticalOpen = openReports.filter((report) => ['critical', 'high'].includes(report.priority));

    return {
      openReports: openReports.length,
      pendingApprovals: pendingApprovals.length,
      inField: inField.length,
      criticalOpen: criticalOpen.length,
      activeEngineers: engineers.filter((engineer) => engineer.status === 'active').length,
      activeTeams: teams.filter((team) => team.status === 'active').length,
    };
  }, [engineers, reports, teams]);

  const attentionTeams = useMemo(
    () =>
      [...teams]
        .sort((left, right) => {
          if (right.activeReports !== left.activeReports) return right.activeReports - left.activeReports;
          return left.name.localeCompare(right.name);
        })
        .slice(0, 5),
    [teams]
  );

  const recentReports = useMemo(
    () =>
      [...reports]
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
        .slice(0, 4),
    [reports]
  );

  const completionPct =
    summary.openReports === 0
      ? 100
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((reports.filter((report) => report.status === 'approved' || report.status === 'closed').length) /
                Math.max(reports.length, 1)) *
                100
            )
          )
        );

  const quickActions = [
    { label: getText(language, 'Queue', 'Foleni'), icon: 'clipboard-outline' as const, screen: 'Reports' as const },
    { label: getText(language, 'People', 'Watu'), icon: 'people-outline' as const, screen: 'People' as const },
    { label: getText(language, 'Teams', 'Timu'), icon: 'layers-outline' as const, screen: 'Teams' as const },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.listSurface}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} tintColor={colors.primary} />}
      >
        <AppHeader
          title={getText(language, 'DMA Dashboard', 'Dahboard ya DMA')}
          subtitle={getText(language, 'Manage water infrastructure and repairs.', 'Simamia miundombinu ya maji na ukarabati.')}
        />

        <View style={styles.statsRow}>
          <DMATile icon="document-text-outline" label={getText(language, 'Open', 'Wazi')} value={summary.openReports} tone="#2563eb" />
          <DMATile icon="checkmark-done-outline" label={getText(language, 'Review', 'Kagua')} value={summary.pendingApprovals} tone="#16a34a" />
          <DMATile icon="construct-outline" label={getText(language, 'Field', 'Uwanja')} value={summary.inField} tone="#d97706" />
          <DMATile icon="people-outline" label={getText(language, 'People', 'Watu')} value={summary.activeEngineers} tone="#7c3aed" />
        </View>

        <View style={styles.sectionCard}>
          {recentReports.length === 0 ? (
            <EmptyState text={getText(language, 'No reports in this DMA yet.', 'Hakuna ripoti katika DMA hii bado.')} />
          ) : (
            recentReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={[styles.reportRow, report.status === 'pending_approval' && styles.reportRowHighlight]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('DMAReportDetail', { reportId: report.id })}
              >
                <View style={[styles.reportAccent, report.status === 'pending_approval' && styles.reportAccentReview]} />
                <View style={styles.reportRowHeader}>
                  <Text style={styles.reportTracking}>{report.trackingId}</Text>
                  <StatusBadge label={report.priority} variant="priority" />
                </View>
                <Text style={styles.reportTitle} numberOfLines={1}>
                  {report.address || report.dmaName || 'Reported Leakage'}
                </Text>
                <Text style={styles.reportMetaText} numberOfLines={1}>
                  {(report.teamName || 'Unassigned') +
                    ' · ' +
                    report.status +
                    (report.assignedEngineerName ? ` · ${report.assignedEngineerName}` : '')}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TeamWatchCard: React.FC<{ team: DMATeam }> = ({ team }) => (
  <View style={styles.teamRow}>
    <View style={styles.teamRowTop}>
      <View style={styles.teamIdentity}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamLeader}>Leader: {team.leaderName || 'Not assigned'}</Text>
      </View>
      <StatusBadge label={team.status} variant="status" />
    </View>
    <View style={styles.teamMetricsRow}>
      <MetricPill icon="people-outline" label={`${team.memberCount} members`} />
      <MetricPill icon="alert-circle-outline" label={`${team.activeReports} active reports`} />
      {!team.leaderId ? <MetricPill icon="shield-outline" label="Needs leader" warning /> : null}
    </View>
  </View>
);

const MetricPill: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; warning?: boolean }> = ({ icon, label, warning }) => (
  <View style={[styles.metricPill, warning && styles.metricPillWarning]}>
    <Ionicons name={icon} size={13} color={warning ? '#b45309' : '#1d4ed8'} />
    <Text style={[styles.metricPillText, warning && styles.metricPillTextWarning]}>{label}</Text>
  </View>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyCircle}>
      <Ionicons name="file-tray-outline" size={34} color={colors.primary} />
    </View>
    <Text style={styles.emptyTitle}>Nothing here</Text>
    <Text style={styles.emptyBody}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerRow: {
    position: 'relative',
  },
  headerBell: {
    position: 'absolute',
    top: 28,
    right: 28,
    zIndex: 2,
  },
  listSurface: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 40,
  },
  heroControlsRow: {
    gap: 10,
  },
  commandCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    color: '#64748b',
    fontWeight: '600',
  },
  progressPct: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: '800',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0f5fff',
    borderRadius: 999,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#0f5fff',
    fontWeight: '700',
    fontSize: typography.fontSize.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    marginTop: 4,
  },
  linkButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
  },
  linkButtonText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
  reportRow: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8fbff',
    padding: 14,
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  reportRowHighlight: {
    backgroundColor: '#f0fdfa',
  },
  reportAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#60a5fa',
  },
  reportAccentReview: {
    backgroundColor: '#14b8a6',
  },
  reportRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  reportTracking: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  reportDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 17,
  },
  reportMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  reportMetaText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  teamRow: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 12,
  },
  teamRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  teamIdentity: {
    flex: 1,
  },
  teamName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  teamLeader: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },
  teamMetricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eff6ff',
  },
  metricPillWarning: {
    backgroundColor: '#fef3c7',
  },
  metricPillText: {
    color: '#1d4ed8',
    fontSize: 11,
    fontWeight: '600',
  },
  metricPillTextWarning: {
    color: '#b45309',
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
});
