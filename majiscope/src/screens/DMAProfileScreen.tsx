import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { useDMAStore } from '../store/dmaStore';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { BrandWordmark } from '../components/shared/BrandWordmark';
import AppHeader from '../components/AppHeader';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { formatTanzaniaTime } from '../lib/dateTime';
import { colors } from '../theme';

const getInitials = (value?: string | null) =>
  String(value || 'DMA')
    .split(' ')
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const DMAProfileScreen: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const reports = useDMAStore((state) => state.reports);
  const teams = useDMAStore((state) => state.teams);
  const engineers = useDMAStore((state) => state.engineers);
  const lastUpdatedAt = useDMAStore((state) => state.lastUpdatedAt);
  const refreshAllData = useDMAStore((state) => state.refreshAllData);
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const bottomPadding = useBottomTabPadding();
  const { language } = useAppLanguage();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const dmaName =
    String(currentUser?.dma_name || (currentUser as any)?.dmaName || '').trim() || 'Assigned DMA';
  const utilityName =
    String(currentUser?.utility_name || (currentUser as any)?.utilityName || '').trim() || 'Assigned Utility';

  const openReports = reports.filter((report) => !['approved', 'closed'].includes(report.status)).length;
  const pendingReviewCount = reports.filter((report) => report.status === 'pending_approval').length;
  const activeTeams = teams.filter((team) => team.status === 'active').length;
  const activeEngineers = engineers.filter((engineer) => engineer.status === 'active').length;

  const roleTiles = useMemo(
    () => [
      { label: 'Open Reports', value: openReports, icon: 'document-text-outline' as const, tone: '#2563eb' },
      { label: 'Waiting DMA', value: pendingReviewCount, icon: 'shield-checkmark-outline' as const, tone: '#16a34a' },
      { label: 'Active Teams', value: activeTeams, icon: 'layers-outline' as const, tone: '#ea580c' },
    ],
    [activeTeams, openReports, pendingReviewCount]
  );

  useEffect(() => {
    Animated.stagger(110, [
      Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.spring(contentAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start();
  }, [contentAnim, headerAnim]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out from the DMA manager app?', [
      { text: 'Cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            setLoggingOut(true);
            await logout();
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        style={styles.scrollSurface}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void handleRefresh()} tintColor={colors.primary} />}
      >
        <Animated.View
          style={{
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          }}
        >
          <AppHeader title={getText(language, 'DMA Profile', 'Wasifu wa DMA')} subtitle={getText(language, 'DMA manager details and settings.', 'Maelezo na mipangilio ya meneja wa DMA.')} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentAnim,
            transform: [{ translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
          }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Organization</Text>
            <View style={styles.card}>
              <DetailRow icon="briefcase-outline" label="Role" value="DMA Manager" />
              <DetailRow icon="mail-outline" label="Email" value={currentUser?.email || 'Not available'} />
              <DetailRow icon="business-outline" label="Utility" value={utilityName} />
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
            <Text style={styles.sectionLabel}>System</Text>
            <View style={styles.card}>
              <View style={styles.systemRow}>
                <View style={styles.systemCopy}>
                  <Text style={styles.cardTitle}>DMA Sync</Text>
                  <Text style={styles.cardSubtitle}>
                    Refresh queue, teams, and engineer coverage for this DMA from the live backend.
                  </Text>
                  <View style={styles.queuePill}>
                    <Ionicons name="sync-outline" size={14} color={colors.primary} />
                    <Text style={styles.queueText}>
                      {lastUpdatedAt ? `Updated ${formatTanzaniaTime(lastUpdatedAt)}` : 'Not synced yet'}
                    </Text>
                  </View>
                </View>
                <View style={styles.systemBadge}>
                  <Text style={styles.systemBadgeValue}>{activeEngineers}</Text>
                  <Text style={styles.systemBadgeLabel}>engineers</Text>
                </View>
              </View>

              <View style={styles.syncRow}>
                <TouchableOpacity style={styles.syncButton} onPress={() => void handleRefresh()} activeOpacity={0.85}>
                  <Ionicons name="refresh-outline" size={16} color="#ffffff" />
                  <Text style={styles.syncButtonText}>Refresh DMA data</Text>
                </TouchableOpacity>
                <View style={styles.clearButton}>
                  <Ionicons name="layers-outline" size={16} color="#475569" />
                  <Text style={styles.clearButtonText}>{activeTeams} active teams</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
            {loggingOut ? (
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
  heroAside: {
    alignItems: 'flex-end',
    gap: 8,
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
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 12,
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
    paddingHorizontal: 16,
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
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  systemCopy: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748b',
  },
  queuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#eff6ff',
  },
  queueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f5fff',
  },
  systemBadge: {
    minWidth: 74,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  systemBadgeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f5fff',
  },
  systemBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  syncRow: {
    flexDirection: 'row',
    gap: 12,
  },
  syncButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: '#0f5fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  clearButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  clearButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
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
