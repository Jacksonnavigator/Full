import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// NEW: Import new architecture components
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@/hooks/useQuery';
import { ReportService } from '@/services/api';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, borderRadius, spacing, shadows, fontWeight } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

type Filter = 'All' | 'New' | 'Assigned' | 'In Progress' | 'Completed';

const FILTERS: Filter[] = ['All', 'New', 'Assigned', 'In Progress', 'Completed'];

const FILTER_ICONS = {
  'All': '📋',
  'New': '🆕',
  'Assigned': '📎',
  'In Progress': '🔧',
  'Completed': '✅',
};

const FILTER_SHORT = {
  'All': 'All',
  'New': 'New',
  'Assigned': 'Assigned',
  'In Progress': 'In Progress',
  'Completed': 'Completed',
};

const STATUS_CONFIG = [
  { status: 'new', label: 'New', icon: 'radio-button-on-outline', accent: '#ef4444', bg: '#fef2f2' },
  { status: 'assigned', label: 'Assigned', icon: 'checkmark-circle-outline', accent: '#3b82f6', bg: '#eff6ff' },
  { status: 'in_progress', label: 'In Progress', icon: 'construct-outline', accent: '#f59e0b', bg: '#fffbeb' },
  { status: 'completed', label: 'Completed', icon: 'checkmark-done-circle-outline', accent: '#10b981', bg: '#ecfdf5' },
];

interface Report {
  id: string;
  tracking_id: string;
  description: string;
  latitude: number;
  longitude: number;
  priority: string;
  status: string;
  utility_name?: string;
  dma_name?: string;
  branch_name?: string;
  created_at: string;
  reporter_name: string;
}

export const DMAManagerReportsScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<Filter>('All');

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;

  // Animation effect
  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(cardsAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  // NEW: Use useQuery hook for data fetching with caching
  const {
    data: reports,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['reports', currentUser?.id], // Cache key includes user ID
    () => ReportService.getReports({
      limit: 50
    }),
    {
      enabled: !!currentUser, // Only fetch when user is authenticated
    }
  ) as { data: Report[] | undefined, isLoading: boolean, error: any, refetch: () => void };

  // Filter reports based on selected filter
  const filteredReports = useMemo(() => {
    if (!reports) return [];

    if (filter === 'All') return reports;

    // Map filter names to API status values
    const statusMap = {
      'New': 'new',
      'Assigned': 'assigned',
      'In Progress': 'in_progress',
      'Completed': 'completed'
    };

    return reports.filter(report => report.status === statusMap[filter as keyof typeof statusMap]);
  }, [reports, filter]);

  const handleAssignReport = (reportId: string) => {
    // Navigate to assignment screen
    navigation.navigate('ReportAssignment', { reportId });
  };

  const renderReportCard = ({ item }: { item: Report }) => {
    const statusConfig = STATUS_CONFIG.find(config => config.status === item.status) || STATUS_CONFIG[0];

    return (
      <Animated.View style={{ opacity: cardsAnim, transform: [{ translateY: cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
        <Card style={styles.reportCard}>
          <View style={styles.cardHeader}>
            <View style={styles.trackingContainer}>
              <Text style={styles.trackingId}>{item.tracking_id}</Text>
              <Badge
                label={statusConfig.label}
                variant={item.status === 'new' ? 'warning' : item.status === 'assigned' ? 'info' : item.status === 'in_progress' ? 'default' : 'success'}
                size="small"
              />
            </View>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.location}>
              {item.branch_name || 'Unknown Location'}
            </Text>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Priority:</Text>
              <Text style={[styles.metaValue, { color: item.priority === 'High' ? '#ef4444' : item.priority === 'Medium' ? '#f59e0b' : '#22c55e' }]}>
                {item.priority}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Reporter:</Text>
              <Text style={styles.metaValue}>{item.reporter_name}</Text>
            </View>
          </View>

          {item.status === 'new' && (
            <View style={styles.actionsContainer}>
              <Button
                label="Assign Team"
                onPress={() => handleAssignReport(item.id)}
                size="small"
                style={styles.assignButton}
              />
            </View>
          )}
        </Card>
      </Animated.View>
    );
  };

  const renderFilterButton = (filterOption: Filter) => (
    <TouchableOpacity
      key={filterOption}
      style={[
        styles.filterButton,
        filter === filterOption && styles.filterButtonActive
      ]}
      onPress={() => setFilter(filterOption)}
    >
      <Text style={styles.filterEmoji}>{FILTER_ICONS[filterOption]}</Text>
      <Text style={[
        styles.filterText,
        filter === filterOption && styles.filterTextActive
      ]}>
        {FILTER_SHORT[filterOption]}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load reports</Text>
          <Button title="Retry" onPress={refetch} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandPrimary} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <LinearGradient
          colors={[colors.brandPrimary, colors.brandSecondary]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Reports Management</Text>
            <Text style={styles.headerSubtitle}>
              {filteredReports.length} {filter === 'All' ? 'total' : filter.toLowerCase()} reports
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {FILTERS.map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No reports found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'All' ? 'New reports will appear here' : `No ${filter.toLowerCase()} reports`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    marginBottom: spacing.md,
  },
  header: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.lg,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  filtersContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  filtersScroll: {
    paddingRight: spacing.lg,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  filterEmoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  filterText: {
    ...typography.body,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  reportCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  trackingContainer: {
    flex: 1,
  },
  trackingId: {
    ...typography.h4,
    fontWeight: fontWeight.bold,
    color: colors.brandPrimary,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
  },
  description: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  location: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  metaValue: {
    ...typography.caption,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  assignButton: {
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default DMAManagerReportsScreen;