import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
import { DMAHeroCard, getDMAInitials } from '../components/dma/DMAChrome';
import { NotificationBellButton } from '../components/shared/NotificationBellButton';
import { PaginationBar } from '../components/shared/PaginationBar';
import { usePagination } from '../hooks/usePagination';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { StatusBadge } from '../components/StatusBadge';
import { useAuthStore } from '../store/authStore';
import { useDMAStore, type DMAReport } from '../store/dmaStore';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { formatTanzaniaShortDateTime } from '../lib/dateTime';
import { borderRadius, colors, spacing, typography } from '../theme';

type FilterKey = 'all' | 'new' | 'field' | 'review' | 'resolved';

const FILTERS: Array<{ key: FilterKey; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'all', label: 'All', icon: 'layers-outline' },
  { key: 'new', label: 'New', icon: 'sparkles-outline' },
  { key: 'field', label: 'Field Work', icon: 'construct-outline' },
  { key: 'review', label: 'DMA Review', icon: 'shield-checkmark-outline' },
  { key: 'resolved', label: 'Resolved', icon: 'checkmark-circle-outline' },
];

const formatQueueDate = (value?: string | null) => {
  if (!value) return 'No recent update';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'No recent update';
  return formatTanzaniaShortDateTime(parsed, 'No recent update');
};

const filterReport = (report: DMAReport, filter: FilterKey) => {
  switch (filter) {
    case 'new':
      return report.status === 'new';
    case 'field':
      return report.status === 'assigned' || report.status === 'in_progress';
    case 'review':
      return report.status === 'pending_approval';
    case 'resolved':
      return report.status === 'approved' || report.status === 'closed';
    case 'all':
    default:
      return true;
  }
};

const getPriorityLabel = (priority: DMAReport['priority']) => {
  switch (priority) {
    case 'critical':
      return 'Critical';
    case 'high':
      return 'High';
    case 'medium':
      return 'Moderate';
    default:
      return 'Low';
  }
};

const getPriorityTone = (priority: DMAReport['priority']) => {
  switch (priority) {
    case 'critical':
      return '#b91c1c';
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#d97706';
    default:
      return '#16a34a';
  }
};

export const DMAReportsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { language } = useAppLanguage();
  const currentUser = useAuthStore((state) => state.currentUser);
  const reports = useDMAStore((state) => state.reports);
  const refreshAllData = useDMAStore((state) => state.refreshAllData);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const bottomPadding = useBottomTabPadding();

  const dmaName =
    String(currentUser?.dma_name || (currentUser as any)?.dmaName || '').trim() || getText(language, 'Assigned DMA', 'DMA Imepewa');
  const utilityName =
    String(currentUser?.utility_name || (currentUser as any)?.utilityName || '').trim() || getText(language, 'Assigned Utility', 'Huduma ya maji Imepewa');

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

  const counts = useMemo(
    () => ({
      all: reports.length,
      new: reports.filter((report) => report.status === 'new').length,
      field: reports.filter((report) => report.status === 'assigned' || report.status === 'in_progress').length,
      review: reports.filter((report) => report.status === 'pending_approval').length,
      resolved: reports.filter((report) => report.status === 'approved' || report.status === 'closed').length,
    }),
    [reports]
  );

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reports.filter((report) => {
      if (!filterReport(report, filter)) return false;
      if (!query) return true;

      return (
        report.trackingId.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        (report.address || '').toLowerCase().includes(query) ||
        (report.teamName || '').toLowerCase().includes(query) ||
        (report.assignedEngineerName || '').toLowerCase().includes(query)
      );
    });
  }, [filter, reports, search]);

  const {
    paginatedItems,
    page,
    totalPages,
    totalItems,
    pageSize,
    resetPage,
    prevPage,
    nextPage,
  } = usePagination(filteredReports, 10);

  useEffect(() => {
    resetPage();
  }, [filter, search, resetPage]);

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
            onRefresh={() => void onRefresh()}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
                    <AppHeader
              title={getText(language, 'Reported Leakage', 'Mimomonyoko ya Maji Imeripotiwa')}
              subtitle={getText(language, 'Queue of water loss reports.', 'Foleni ya ripoti za upotevu wa maji.')}
            />

            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={getText(
                  language,
                  'Search tracking ID, address, engineer, team...',
                  'Tafuta ID ya ufuatiliaji, anuani, mhandisi, timu...'
                )}
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
              />
            </View>

            <View style={styles.filterBar}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {FILTERS.map((item) => {
                  const selected = filter === item.key;
                  const count = counts[item.key];

                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[styles.filterChip, selected && styles.filterChipSelected]}
                      onPress={() => setFilter(item.key)}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name={item.icon}
                        size={14}
                        color={selected ? '#ffffff' : '#475569'}
                      />
                      <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                        {item.label}
                      </Text>
                      <View style={[styles.filterCount, selected && styles.filterCountSelected]}>
                        <Text style={[styles.filterCountText, selected && styles.filterCountTextSelected]}>
                          {count}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Ionicons name="file-tray-outline" size={30} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No reported leakage here right now</Text>
            <Text style={styles.emptyBody}>
              Change the current view or refresh to pull the latest DMA queue.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const locationLabel = item.address?.trim() || `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`;
          const priorityTone = getPriorityTone(item.priority);
          const ownerLine = [item.teamName, item.assignedEngineerName || item.teamLeaderName]
            .filter(Boolean)
            .join(' · ') || 'Unassigned';

          return (
            <TouchableOpacity
              style={[styles.card, { borderTopColor: priorityTone }]}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('DMAReportDetail', { reportId: item.id })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderCopy}>
                  <Text style={styles.cardTracking}>{item.trackingId}</Text>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {locationLabel}
                  </Text>
                  <Text style={styles.cardMeta} numberOfLines={1}>
                    {ownerLine} · Updated {formatQueueDate(item.updatedAt)}
                  </Text>
                </View>
                <View style={styles.headerSide}>
                  <StatusBadge label={getPriorityLabel(item.priority)} variant="priority" />
                  <StatusBadge label={item.status} variant="status" style={styles.headerStatusBadge} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  headerRow: {
    position: 'relative',
  },
  headerCopy: {
    flex: 1,
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
    paddingBottom: spacing['6xl'],
  },
  heroFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: 2,
  },
  heroFooterText: {
    flex: 1,
    color: 'rgba(255,255,255,0.86)',
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  queueCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: '#0f172a',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 52,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
  },
  filterBar: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  filterScroll: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: '#475569',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  filterTextSelected: {
    color: '#ffffff',
  },
  filterCount: {
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
  },
  filterCountSelected: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  filterCountText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  filterCountTextSelected: {
    color: '#ffffff',
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 4,
    backgroundColor: colors.card,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cardHeaderCopy: {
    flex: 1,
  },
  cardTracking: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  cardTitle: {
    marginTop: spacing.xs,
    color: colors.textDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  cardMeta: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  cardDescription: {
    marginTop: spacing.xs,
    color: colors.textMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  classificationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  leakageChip: {
    borderRadius: borderRadius.full,
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#a5f3fc',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  leakageChipText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: '#155e75',
  },
  headerSide: {
    alignItems: 'flex-end',
  },
  headerStatusBadge: {
    marginTop: spacing.sm,
  },
  metaStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metaChipAccent: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  metaChipText: {
    color: '#475569',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  metaChipTextAccent: {
    color: '#059669',
  },
  reviewSignalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  signalChip: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  signalChipGood: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  signalChipWarn: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  signalChipRisk: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  signalChipNeutral: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  signalChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  signalChipTextGood: {
    color: '#059669',
  },
  signalChipTextWarn: {
    color: '#b45309',
  },
  signalChipTextRisk: {
    color: '#dc2626',
  },
  signalChipTextNeutral: {
    color: '#1d4ed8',
  },
  infoBlock: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  infoBlockLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  locationMetaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  locationMetaText: {
    flex: 1,
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 20,
  },
  ownerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  ownerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: '#eff6ff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ownerPillText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    flexShrink: 1,
  },
  cardFooter: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardFooterText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  openAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openActionText: {
    color: '#1d4ed8',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  emptyCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  emptyBody: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xl,
  },
});
