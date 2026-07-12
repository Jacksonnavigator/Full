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
import { useDMAStore, type DMAEngineer, type DMAEngineerRole, type DMAEntityStatus } from '../store/dmaStore';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { colors, spacing, borderRadius, typography } from '../theme';

type RoleFilter = 'all' | 'engineer' | 'team_leader';

export const DMAEngineersScreen: React.FC = () => {
  const { language } = useAppLanguage();
  const currentUser = useAuthStore((state) => state.currentUser);
  const engineers = useDMAStore((state) => state.engineers);
  const teams = useDMAStore((state) => state.teams);
  const refreshAllData = useDMAStore((state) => state.refreshAllData);
  const inviteEngineer = useDMAStore((state) => state.inviteEngineer);
  const updateEngineer = useDMAStore((state) => state.updateEngineer);
  const deleteEngineer = useDMAStore((state) => state.deleteEngineer);

  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | DMAEntityStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<DMAEngineer | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [teamId, setTeamId] = useState('');
  const [role, setRole] = useState<DMAEngineerRole>('engineer');
  const [status, setStatus] = useState<DMAEntityStatus>('active');
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

  const filteredEngineers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return engineers.filter((engineer) => {
      if (roleFilter !== 'all' && engineer.role !== roleFilter) return false;
      if (statusFilter !== 'all' && engineer.status !== statusFilter) return false;
      if (!query) return true;
      return (
        engineer.name.toLowerCase().includes(query) ||
        engineer.email.toLowerCase().includes(query) ||
        (engineer.teamName || '').toLowerCase().includes(query)
      );
    });
  }, [engineers, roleFilter, search, statusFilter]);

  const {
    paginatedItems,
    page,
    totalPages,
    totalItems,
    pageSize,
    resetPage,
    prevPage,
    nextPage,
  } = usePagination(filteredEngineers, 10);

  useEffect(() => {
    resetPage();
  }, [roleFilter, search, statusFilter, resetPage]);

  const summary = useMemo(
    () => ({
      total: engineers.length,
      active: engineers.filter((engineer) => engineer.status === 'active').length,
      leaders: engineers.filter((engineer) => engineer.role === 'team_leader').length,
      pending: engineers.filter(
        (engineer) => engineer.onboardingStatus && engineer.onboardingStatus !== 'completed'
      ).length,
    }),
    [engineers]
  );

  const beginCreate = () => {
    setEditingEngineer(null);
    setEmail('');
    setName('');
    setPhone('');
    setTeamId('');
    setRole('engineer');
    setStatus('active');
    setModalOpen(true);
  };

  const beginEdit = (engineer: DMAEngineer) => {
    setEditingEngineer(engineer);
    setEmail(engineer.email);
    setName(engineer.name);
    setPhone(engineer.phone || '');
    setTeamId(engineer.teamId || '');
    setRole(engineer.role);
    setStatus(engineer.status);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Add the engineer email before saving.');
      return;
    }
    if (!teamId) {
      Alert.alert('Team required', 'Engineers and team leaders must be assigned to a team.');
      return;
    }
    if (role === 'team_leader' && !teamId) {
      Alert.alert('Team required', 'Team leaders must be assigned to a team.');
      return;
    }

    setSaving(true);
    try {
      if (editingEngineer) {
        await updateEngineer({
          id: editingEngineer.id,
          name: name.trim() || editingEngineer.name,
          email,
          phone,
          teamId,
          role,
          status,
        });
        Alert.alert('Updated', 'Engineer details were saved successfully.');
      } else {
        await inviteEngineer({ email, teamId, role, status });
        Alert.alert('Invitation sent', 'The engineer invitation has been created successfully.');
      }
      setModalOpen(false);
    } catch (error: any) {
      Alert.alert('Unable to save engineer', error?.message || 'This engineer action could not be completed.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (engineer: DMAEngineer) => {
    Alert.alert(
      'Delete engineer',
      `Remove ${engineer.name} from this DMA?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEngineer(engineer.id);
              Alert.alert('Deleted', 'The engineer account was removed.');
            } catch (error: any) {
              Alert.alert('Delete failed', error?.message || 'The engineer could not be deleted.');
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
              title={getText(language, 'Engineers & Team Leaders', 'Wataalamu na Viongozi wa Timu')}
              subtitle={getText(language, 'Manage DMA engineers and team leaders.', 'Simamia wahandisi wa DMA na viongozi wa timu.')}
            />

            <View style={styles.actionCard}>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.createButton} onPress={beginCreate} activeOpacity={0.85}>
                  <Ionicons name="person-add-outline" size={18} color="#ffffff" />
                  <Text style={styles.createButtonText}>{getText(language, 'Invite engineer', 'Mwita mhandisi')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={getText(language, 'Search name, email, team...', 'Tafuta jina, barua pepe, timu...')}
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
              {[
                { key: 'all', label: getText(language, 'All people', 'Watu wote') },
                { key: 'engineer', label: getText(language, 'Engineers', 'Wataalamu') },
                { key: 'team_leader', label: getText(language, 'Team leaders', 'Viongozi wa timu') },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.filterChip, roleFilter === item.key && styles.filterChipSelected]}
                  onPress={() => setRoleFilter(item.key as RoleFilter)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.filterChipText, roleFilter === item.key && styles.filterChipTextSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
              {[
                { key: 'all', label: getText(language, 'All status', 'Hali zote') },
                { key: 'active', label: getText(language, 'Active', 'Hai') },
                { key: 'inactive', label: getText(language, 'Inactive', 'Haifanyi kazi') },
              ].map((item) => (
                <TouchableOpacity
                  key={`status-${item.key}`}
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
            <Ionicons name="people-outline" size={24} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No engineers found</Text>
            <Text style={styles.emptyText}>Try another filter or invite a new engineer into this DMA.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.personCard}>
            <View style={styles.personHeader}>
              <View style={styles.personIdentity}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={styles.personMeta} numberOfLines={1}>
                  {item.email}
                </Text>
                <Text style={styles.personMetaMuted} numberOfLines={1}>
                  {(item.teamName || 'No team') +
                    ' · ' +
                    (item.role === 'team_leader' ? 'Team Leader' : 'Engineer') +
                    ' · ' +
                    item.status}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.cardActionButton} onPress={() => beginEdit(item)} activeOpacity={0.85}>
                <Ionicons name="create-outline" size={16} color={colors.primaryDark} />
                <Text style={styles.cardActionText}>Edit</Text>
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

      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingEngineer ? 'Edit engineer' : 'Invite engineer'}</Text>
            <ScrollView contentContainerStyle={styles.formFields}>
              {editingEngineer ? (
                <Field label="Full name">
                  <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Engineer name" placeholderTextColor={colors.textMuted} />
                </Field>
              ) : null}
              <Field label="Email">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholder="person@example.com"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </Field>
              {editingEngineer ? (
                <Field label="Phone">
                  <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="+255..." placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
                </Field>
              ) : null}
              <Field label="Role">
                <View style={styles.segmentRow}>
                  <Segment selected={role === 'engineer'} label="Engineer" onPress={() => setRole('engineer')} />
                  <Segment selected={role === 'team_leader'} label="Team Leader" onPress={() => setRole('team_leader')} />
                </View>
              </Field>
              <Field label="Status">
                <View style={styles.segmentRow}>
                  <Segment selected={status === 'active'} label="Active" onPress={() => setStatus('active')} />
                  <Segment selected={status === 'inactive'} label="Inactive" onPress={() => setStatus('inactive')} />
                </View>
              </Field>
              <Field label="Assigned team">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.teamSelectRow}>
                  {teams.map((team) => (
                    <TouchableOpacity
                      key={team.id}
                      style={[styles.teamSelectChip, teamId === team.id && styles.teamSelectChipSelected]}
                      onPress={() => setTeamId(team.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.teamSelectText, teamId === team.id && styles.teamSelectTextSelected]}>{team.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Field>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalOpen(false)} activeOpacity={0.85}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={() => void handleSave()} activeOpacity={0.85} disabled={saving}>
                {saving ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>{editingEngineer ? 'Save changes' : 'Send invite'}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
);

const Segment: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({ label, selected, onPress }) => (
  <TouchableOpacity style={[styles.segmentButton, selected && styles.segmentButtonSelected]} onPress={onPress} activeOpacity={0.85}>
    <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const MetaPill: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; warning?: boolean }> = ({ icon, label, warning }) => (
  <View style={[styles.metaPill, warning && styles.metaPillWarning]}>
    <Ionicons name={icon} size={13} color={warning ? '#b45309' : colors.primaryDark} />
    <Text style={[styles.metaPillText, warning && styles.metaPillTextWarning]}>{label}</Text>
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
  personCard: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  personIdentity: {
    flex: 1,
  },
  personName: {
    color: colors.textDark,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  personMeta: {
    marginTop: spacing.xs,
    color: colors.textMedium,
    fontSize: typography.fontSize.sm,
  },
  personMetaMuted: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#eff6ff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  metaPillWarning: {
    backgroundColor: '#fef3c7',
  },
  metaPillText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  metaPillTextWarning: {
    color: '#b45309',
  },
  cardActions: {
    flexDirection: 'row',
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
  formFields: {
    gap: spacing.md,
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
  teamSelectRow: {
    gap: spacing.sm,
  },
  teamSelectChip: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  teamSelectChipSelected: {
    borderColor: colors.primary,
    backgroundColor: '#ecfeff',
  },
  teamSelectText: {
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  teamSelectTextSelected: {
    color: colors.primaryDark,
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
