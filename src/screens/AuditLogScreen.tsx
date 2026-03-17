import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { AuditLog, AuditAction } from '../services/types';
import { getUserActivityLog, getResourceAuditHistory } from '../services/auditService_v2';

type AuditFilter = 'all' | 'reports' | 'submissions' | 'users';

const FILTER_ICON: Record<AuditFilter, string> = {
  all: '',
  reports: '',
  submissions: '',
  users: '',
};

const ACTION_ICON: Record<string, string> = {
  REPORT_CREATED: '',
  REPORT_ASSIGNED: '',
  REPORT_STATUS_CHANGED: '',
  SUBMISSION_CREATED: '',
  SUBMISSION_APPROVED: '',
  SUBMISSION_REJECTED: '',
  USER_APPROVED: '',
  REPORT_CLOSED: '',
};

const ACTION_COLOR: Record<string, string> = {
  REPORT_CREATED: '#3b82f6',
  REPORT_ASSIGNED: '#f59e0b',
  REPORT_STATUS_CHANGED: '#8b5cf6',
  SUBMISSION_CREATED: '#ec4899',
  SUBMISSION_APPROVED: '#10b981',
  SUBMISSION_REJECTED: '#ef4444',
  USER_APPROVED: '#06b6d4',
  REPORT_CLOSED: '#6366f1',
};

export const AuditLogScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState<AuditFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, []);

  // Fetch audit logs
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        // For now, fetch recent user activity
        // In production, fetch based on user's DMA
        const logs = await getUserActivityLog(currentUser.id, 100);
        setAuditLogs(logs);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentUser?.id]);

  // Apply filters
  useEffect(() => {
    let filtered = auditLogs;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter((log) => {
        switch (filter) {
          case 'reports':
            return log.resourceType === 'Report';
          case 'submissions':
            return log.resourceType === 'Submission';
          case 'users':
            return log.resourceType === 'User';
          default:
            return true;
        }
      });
    }

    // Filter by search text
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(search) ||
          log.userName.toLowerCase().includes(search) ||
          log.resourceId.toLowerCase().includes(search)
      );
    }

    setFilteredLogs(filtered);
  }, [auditLogs, filter, searchText]);

  const renderItem = ({ item, index }: { item: AuditLog; index: number }) => {
    const actionColor = ACTION_COLOR[item.action] || '#6b7280';
    const icon = ACTION_ICON[item.action] || '';
    const timestamp = new Date(item.timestamp);

    const itemAnim = new Animated.Value(0);
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
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
        <View style={styles.logItem}>
          <View style={[styles.iconBox, { backgroundColor: actionColor + '20' }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          <View style={styles.logContent}>
            <View style={styles.logHeader}>
              <Text style={styles.action}>{item.action.replace(/_/g, ' ')}</Text>
              <Text style={styles.timestamp}>
                {timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <View style={styles.logMeta}>
              <Text style={styles.user}>👤 {item.userName}</Text>
              <Text style={styles.role}>{item.userRole}</Text>
            </View>

            <View style={styles.logDetail}>
              <Text style={styles.resourceType}>{item.resourceType}</Text>
              <Text style={styles.resourceId}>{item.resourceId}</Text>
            </View>

            {item.details && Object.keys(item.details).length > 0 && (
              <View style={styles.detailsBox}>
                <Text style={styles.detailsLabel}>Details:</Text>
                <Text style={styles.detailsText}>
                  {JSON.stringify(item.details).substring(0, 100)}...
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
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
                colors={['#0f172a', '#1e3347', '#0c3566']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
              >
                <Text style={styles.heroTitle}>Audit Logs</Text>
                <Text style={styles.heroSubtitle}>
                  System activity & compliance tracking
                </Text>
                <Text style={styles.logCount}>
                  {filteredLogs.length} {filter === 'all' ? 'records' : 'matching records'} found
                </Text>
              </LinearGradient>
            </Animated.View>

            {/* Search & Filters */}
            <Animated.View
              style={{
                opacity: contentAnim,
                transform: [
                  {
                    translateY: contentAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by action, user, or ID..."
                  placeholderTextColor="#9ca3af"
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              <View style={styles.filterRow}>
                {(['all', 'reports', 'submissions', 'users'] as AuditFilter[]).map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.filterPill, filter === f && styles.filterPillActive]}
                    onPress={() => setFilter(f)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.filterIcon}>{FILTER_ICON[f]}</Text>
                    <Text
                      style={[
                        styles.filterText,
                        filter === f && styles.filterTextActive,
                      ]}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}></Text>
            <Text style={styles.emptyTitle}>
              {loading ? 'Loading audit logs...' : 'No matching records'}
            </Text>
            <Text style={styles.emptyBody}>
              {loading
                ? 'Fetching system activity data...'
                : 'Try adjusting your search or filter criteria.'}
            </Text>
            {loading && <ActivityIndicator color="#0077b6" size="large" style={{ marginTop: 16 }} />}
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
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
    fontWeight: '500',
  },
  logCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  searchBox: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterPillActive: {
    backgroundColor: '#0077b6',
    borderColor: '#0077b6',
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  logItem: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    marginBottom: 8,
  },
  action: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
    color: '#9ca3af',
  },
  logMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  user: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  role: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  logDetail: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  resourceType: {
    fontSize: 11,
    color: '#fff',
    backgroundColor: '#6b7280',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '600',
  },
  resourceId: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  detailsBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
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
    paddingHorizontal: 32,
  },
});
