import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
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
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { DMAHeroCard, DMATile, DMASectionHeading, getDMAInitials } from '../components/dma/DMAChrome';
import AppHeader from '../components/AppHeader';
import { PaginationBar } from '../components/shared/PaginationBar';
import { usePagination } from '../hooks/usePagination';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { StatusBadge } from '../components/StatusBadge';
import { useAuthStore } from '../store/authStore';
import { useDMAStore, type DMAEntityStatus, type DMATeam } from '../store/dmaStore';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { colors, spacing, borderRadius, typography } from '../theme';

export const DMATeamsScreen: React.FC = () => {
  const { language } = useAppLanguage();
  const currentUser = useAuthStore((state) => state.currentUser);
  const teams = useDMAStore((state) => state.teams);
  const engineers = useDMAStore((state) => state.engineers);
  const refreshAllData = useDMAStore((state) => state.refreshAllData);
  const createTeam = useDMAStore((state) => state.createTeam);
  const updateTeam = useDMAStore((state) => state.updateTeam);
  const deleteTeam = useDMAStore((state) => state.deleteTeam);
  const assignTeamLeader = useDMAStore((state) => state.assignTeamLeader);
  const removeTeamLeader = useDMAStore((state) => state.removeTeamLeader);

  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DMAEntityStatus>('all');
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [leaderModalOpen, setLeaderModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<DMATeam | null>(null);
  const [leaderTeam, setLeaderTeam] = useState<DMATeam | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<DMAEntityStatus>('active');
  const [selectedLeaderId, setSelectedLeaderId] = useState('');
  const bottomPadding = useBottomTabPadding();

  const dmaName =
    String(currentUser?.dma_name || (currentUser as any)?.dmaName || '').trim() || 'Assigned DMA';
  const utilityName =
    String(currentUser?.utility_name || (currentUser as any)?.utilityName || '').trim() || 'Assigned Utility';

  useFocusEffect(
    React.useCallback(() => {
      void refreshAllData();
    }, [refreshAllData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAllData();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();
    return teams.filter((team) => {
      if (statusFilter !== 'all' && team.status !== statusFilter) return false;
      if (!query) return true;
      return (
        team.name.toLowerCase().includes(query) ||
        (team.description || '').toLowerCase().includes(query) ||
        (team.leaderName || '').toLowerCase().includes(query)
      );
    });
  }, [search, statusFilter, teams]);

  const {
    paginatedItems,
    page,
    totalPages,
    totalItems,
    pageSize,
    resetPage,
    prevPage,
    nextPage,
  } = usePagination(filteredTeams, 10);

  useEffect(() => {
    resetPage();
  }, [search, statusFilter, resetPage]);

  const leaderOptions = useMemo(() => {
    if (!leaderTeam) return [];
    return engineers.filter(
      (engineer) =>
        engineer.status === 'active' &&
        (!engineer.teamId || engineer.teamId === leaderTeam.id)
    );
  }, [engineers, leaderTeam]);

  const summary = useMemo(
    () => ({
      total: teams.length,
      active: teams.filter((team) => team.status === 'active').length,
      noLeader: teams.filter((team) => !team.leaderId).length,
      activeReports: teams.reduce((sum, team) => sum + team.activeReports, 0),
    }),
    [teams]
  );

  const beginCreate = () => {
    setEditingTeam(null);
    setName('');
    setDescription('');
    setStatus('active');
    setTeamModalOpen(true);
  };

  const beginEdit = (team: DMATeam) => {
    setEditingTeam(team);
    setName(team.name);
    setDescription(team.description || '');
    setStatus(team.status);
    setTeamModalOpen(true);
  };

  const beginLeaderAssignment = (team: DMATeam) => {
    setLeaderTeam(team);
    setSelectedLeaderId(team.leaderId || '');
    setLeaderModalOpen(true);
  };

  const handleSaveTeam = async () => {
    if (!name.trim()) {
      Alert.alert('Team name required', 'Add a team name before saving.');
      return;
    }

    setSaving(true);
    try {
      if (editingTeam) {
        await updateTeam({ id: editingTeam.id, name, description, status });
        Alert.alert('Updated', 'The team details were updated successfully.');
      } else {
        await createTeam({ name, description, status });
        Alert.alert('Created', 'The new DMA team was created successfully.');
      }
      setTeamModalOpen(false);
    } catch (error: any) {
      Alert.alert('Unable to save team', error?.message || 'The team could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLeader = async () => {
    if (!leaderTeam) return;

    setSaving(true);
    try {
      if (!selectedLeaderId) {
        await removeTeamLeader(leaderTeam.id);
        Alert.alert('Leader removed', 'The team leader assignment was removed.');
      } else {
        await assignTeamLeader(leaderTeam.id, selectedLeaderId);
        Alert.alert('Leader assigned', 'The team leader assignment was updated.');
      }
      setLeaderModalOpen(false);
    } catch (error: any) {
      Alert.alert('Unable to save leader', error?.message || 'The leader assignment could not be updated.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (team: DMATeam) => {
    Alert.alert(
      'Delete team',
      `Delete ${team.name}? Engineers in the team will become unassigned.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeam(team.id);
              Alert.alert('Deleted', 'The team was removed successfully.');
            } catch (error: any) {
              Alert.alert('Delete failed', error?.message || 'The team could not be deleted.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <FlatList
        data={paginatedItems}
        keyExtractor={(item) => item.id}
        style={styles.listSurface}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void handleRefresh()} tintColor={colors.primary} />}
        ListHeaderComponent={
          <>
            <AppHeader
              title={getText(language, 'DMA Teams', 'Timu za DMA')}
              subtitle={getText(language, 'Manage DMA teams and assignments.', 'Simamia timu za DMA na majukumu.')}
            />

            <View style={styles.actionCard}>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.createButton} onPress={beginCreate} activeOpacity={0.85}>
                  <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
                  <Text style={styles.createButtonText}>{getText(language, 'Create team', 'Unda timu')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={getText(language, 'Search team or leader...', 'Tafuta timu au kiongozi...')}
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
              {[
                { key: 'all', label: getText(language, 'All status', 'Hali zote') },
                { key: 'active', label: getText(language, 'Active', 'Hai') },
                { key: 'inactive', label: getText(language, 'Inactive', 'Haifanyi kazi') },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.filterChip, statusFilter === item.key && styles.filterChipSelected]}
                  onPress={() => setStatusFilter(item.key as 'all' | DMAEntityStatus)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.filterChipText, statusFilter === item.key && styles.filterChipTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="layers-outline" size={24} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No teams found</Text>
            <Text style={styles.emptyText}>Create a new team or change the active filter to view more.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <View style={styles.teamIdentity}>
                <Text style={styles.teamName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.teamDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                ) : null}
                <Text style={styles.teamMeta} numberOfLines={1}>
                  {item.memberCount} members · {item.activeReports} active · {item.leaderName || 'No leader'} ·{' '}
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.cardActionButton} onPress={() => beginEdit(item)} activeOpacity={0.85}>
                <Ionicons name="create-outline" size={16} color={colors.primaryDark} />
                <Text style={styles.cardActionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardActionButton} onPress={() => beginLeaderAssignment(item)} activeOpacity={0.85}>
                <Ionicons name="person-circle-outline" size={16} color={colors.primaryDark} />
                <Text style={styles.cardActionText}>Leader</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardActionButton} onPress={() => confirmDelete(item)} activeOpacity={0.85}>
                <Ionicons name="trash-outline" size={16} color={colors.destructive} />
                <Text style={[styles.cardActionText, { color: colors.destructive }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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

      <Modal visible={teamModalOpen} animationType="slide" transparent onRequestClose={() => setTeamModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingTeam ? 'Edit team' : 'Create team'}</Text>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Team name</Text>
              <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Team name" placeholderTextColor={colors.textMuted} />
            </View>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textArea]}
                placeholder="Optional description"
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.segmentRow}>
                <Segment selected={status === 'active'} label="Active" onPress={() => setStatus('active')} />
                <Segment selected={status === 'inactive'} label="Inactive" onPress={() => setStatus('inactive')} />
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setTeamModalOpen(false)} activeOpacity={0.85}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={() => void handleSaveTeam()} activeOpacity={0.85} disabled={saving}>
                {saving ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>Save team</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={leaderModalOpen} animationType="slide" transparent onRequestClose={() => setLeaderModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign team leader</Text>
            <Text style={styles.modalSubtitle}>
              {leaderTeam ? `Choose the leader for ${leaderTeam.name}.` : 'Choose the leader for this team.'}
            </Text>
            <ScrollView style={styles.leaderList} contentContainerStyle={styles.leaderListContent}>
              <TouchableOpacity
                style={[styles.leaderOption, !selectedLeaderId && styles.leaderOptionSelected]}
                onPress={() => setSelectedLeaderId('')}
                activeOpacity={0.85}
              >
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>No team leader</Text>
                  <Text style={styles.optionSubtitle}>Remove the current leader assignment.</Text>
                </View>
                {!selectedLeaderId ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
              </TouchableOpacity>
              {leaderOptions.map((engineer) => (
                <TouchableOpacity
                  key={engineer.id}
                  style={[styles.leaderOption, selectedLeaderId === engineer.id && styles.leaderOptionSelected]}
                  onPress={() => setSelectedLeaderId(engineer.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionTitle}>{engineer.name}</Text>
                    <Text style={styles.optionSubtitle}>{engineer.email} | {engineer.teamName || 'Unassigned team'}</Text>
                  </View>
                  {selectedLeaderId === engineer.id ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setLeaderModalOpen(false)} activeOpacity={0.85}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={() => void handleSaveLeader()} activeOpacity={0.85} disabled={saving}>
                {saving ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>Save leader</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const Segment: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({ label, selected, onPress }) => (
  <TouchableOpacity style={[styles.segmentButton, selected && styles.segmentButtonSelected]} onPress={onPress} activeOpacity={0.85}>
    <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const Metric: React.FC<{ label: string; icon: keyof typeof Ionicons.glyphMap; warning?: boolean }> = ({ label, icon, warning }) => (
  <View style={[styles.metricPill, warning && styles.metricPillWarning]}>
    <Ionicons name={icon} size={13} color={warning ? '#b45309' : colors.primaryDark} />
    <Text style={[styles.metricText, warning && styles.metricTextWarning]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  listSurface: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing['6xl'],
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  actionCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  filtersRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  filterChip: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#ecfeff',
  },
  filterChipText: {
    color: colors.textMedium,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  filterChipTextSelected: {
    color: colors.primaryDark,
  },
  teamCard: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  teamIdentity: {
    flex: 1,
  },
  teamName: {
    color: colors.textDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  teamDescription: {
    marginTop: spacing.xs,
    color: colors.textMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  teamMeta: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#eff6ff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  metricPillWarning: {
    backgroundColor: '#fef3c7',
  },
  metricText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  metricTextWarning: {
    color: '#b45309',
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardActionText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '85%',
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalTitle: {
    color: colors.textDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  modalSubtitle: {
    color: colors.textMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  fieldWrap: {
    gap: spacing.sm,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.semibold,
  },
  input: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8fbff',
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segmentButton: {
    flex: 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
  },
  segmentButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segmentText: {
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  segmentTextSelected: {
    color: '#ffffff',
  },
  leaderList: {
    maxHeight: 320,
  },
  leaderListContent: {
    gap: spacing.sm,
  },
  leaderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  leaderOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#f0fdff',
  },
  optionCopy: {
    flex: 1,
  },
  optionTitle: {
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  optionSubtitle: {
    marginTop: spacing.xs,
    color: colors.textMedium,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  primaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
