import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { ImageLightboxModal } from '../components/shared/ImageLightboxModal';
import AppHeader from '../components/AppHeader';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { ResolvedImage, inferMediaKind } from '../components/ResolvedImage';
import { StatusBadge } from '../components/StatusBadge';
import { ReportTypeBadge } from '../components/ReportTypeBadge';
import { formatTanzaniaDate } from '../lib/dateTime';
import { getLeakageTypeLabel, isLeakageReport } from '../services/reportTypes';
import { useDMAStore } from '../store/dmaStore';
import { borderRadius, colors, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DMAReportDetail'>;

export const DMAReportDetailScreen: React.FC<Props> = ({ route }) => {
  const { reportId } = route.params;
  const reports = useDMAStore((state) => state.reports);
  const teams = useDMAStore((state) => state.teams);
  const fetchReportById = useDMAStore((state) => state.fetchReportById);
  const assignReport = useDMAStore((state) => state.assignReport);
  const approveReport = useDMAStore((state) => state.approveReport);
  const rejectReport = useDMAStore((state) => state.rejectReport);

  const { language } = useAppLanguage();
  const report = reports.find((item) => item.id === reportId);
  const [loading, setLoading] = useState(!report);
  const [submitting, setSubmitting] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState<'approve' | 'reject' | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState(report?.teamId || '');
  const [reviewNotes, setReviewNotes] = useState('');
  const [activeImage, setActiveImage] = useState<{ uri: string; label: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    const ensureReport = async () => {
      if (report) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await fetchReportById(reportId);
      } catch {
        if (mounted) {
          Alert.alert('Unable to load report', 'The DMA report could not be loaded right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void ensureReport();

    return () => {
      mounted = false;
    };
  }, [fetchReportById, report, reportId]);

  useEffect(() => {
    if (report?.teamId) {
      setSelectedTeamId(report.teamId);
    }
  }, [report?.teamId]);

  const canAssign = report ? ['new', 'assigned', 'in_progress', 'rejected'].includes(report.status) : false;
  const canReview = report?.status === 'pending_approval';

  const workflowStep =
    report?.status === 'new'
      ? 1
      : report?.status === 'assigned'
      ? 2
      : report?.status === 'in_progress' || report?.status === 'rejected'
      ? 3
      : 4;

  const originalMedia = useMemo(
    () =>
      (report?.reportPhotos || report?.photos || []).map((uri, index) => ({
        uri,
        label: `Reported media ${index + 1}`,
        kind: inferMediaKind(uri),
      })),
    [report?.photos, report?.reportPhotos]
  );

  const repairMedia = useMemo(
    () =>
      [...(report?.submissionBeforePhotos || []), ...(report?.submissionAfterPhotos || [])].map((uri, index) => ({
        uri,
        label: `Repair evidence ${index + 1}`,
        kind: inferMediaKind(uri),
      })),
    [report?.submissionAfterPhotos, report?.submissionBeforePhotos]
  );

  const openExternalMedia = async (uri: string) => {
    const supported = await Linking.canOpenURL(uri);
    if (!supported) {
      Alert.alert('Media unavailable', 'This media file could not be opened on this device.');
      return;
    }
    await Linking.openURL(uri);
  };

  const handleAssign = async () => {
    if (!selectedTeamId) {
      Alert.alert('Select team', 'Choose a team before assigning this reported leakage.');
      return;
    }

    setSubmitting(true);
    try {
      await assignReport(reportId, selectedTeamId);
      setAssignModalOpen(false);
      Alert.alert('Assigned', 'The reported leakage has been routed to the selected team.');
    } catch (error: any) {
      Alert.alert('Assignment failed', error?.message || 'The team assignment could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReview = async () => {
    if (!reviewMode) return;

    if (!reviewNotes.trim()) {
      Alert.alert(
        reviewMode === 'approve' ? 'Add approval comment' : 'Add rework reason',
        reviewMode === 'approve'
          ? 'DMA approval requires a review comment.'
          : 'DMA rework requires a clear reason for the field team.'
      );
      return;
    }

    setSubmitting(true);
    try {
      if (reviewMode === 'approve') {
        await approveReport(reportId, reviewNotes.trim());
        Alert.alert('Approved', 'The repair has been approved and closed.');
      } else {
        await rejectReport(reportId, reviewNotes.trim());
        Alert.alert('Returned for rework', 'The report has been sent back to the assigned team.');
      }
      setReviewMode(null);
      setReviewNotes('');
    } catch (error: any) {
      Alert.alert('Action failed', error?.message || 'The DMA decision could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !report) {
    return (
      <SafeAreaView style={styles.loadingRoot}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading DMA report...</Text>
      </SafeAreaView>
    );
  }

  const detailCards = [
    {
      icon: 'location-outline' as const,
      label: 'Location',
      value: report.address || `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`,
    },
    {
      icon: 'git-branch-outline' as const,
      label: 'Workflow',
      value:
        report.status === 'pending_approval'
          ? 'Ready for DMA review'
          : report.status === 'approved' || report.status === 'closed'
          ? 'Closed by DMA'
          : report.status === 'rejected'
          ? 'Returned for field rework'
          : 'Still moving through field workflow',
    },
    {
      icon: 'call-outline' as const,
      label: 'Reporter',
      value: `${report.reporterName}${report.reporterPhone ? ` | ${report.reporterPhone}` : ''}`,
    },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader
          title={getText(language, 'DMA Report', 'Ripoti ya DMA')}
          subtitle={
            report
              ? report.address || `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`
              : getText(language, 'DMA report details', 'Maelezo ya ripoti ya DMA')
          }
        />
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
              <Text style={styles.taskId}>{report.trackingId}</Text>
              <Text style={styles.title}>{report.address || report.dmaName || 'Reported Leakage'}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {report.description}
              </Text>
              <View style={styles.classificationRow}>
                <ReportTypeBadge type={report.reportType} />
                {isLeakageReport(report.reportType) ? (
                  <View style={styles.leakageChip}>
                    <Text style={styles.leakageChipText}>{getLeakageTypeLabel(report.leakageType)}</Text>
                  </View>
                ) : (
                  <View style={styles.naChip}>
                    <Text style={styles.naChipText}>Leakage type: Not applicable</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.headerBadges}>
              <StatusBadge label={report.priority} variant="priority" />
              <StatusBadge label={report.status} variant="status" style={{ marginTop: 8 }} />
            </View>

          <View style={styles.stepsRow}>
            {['Reported', 'Routing', 'Field Work', 'DMA Review'].map((label, index) => {
              const active = index + 1 <= workflowStep;
              return (
                <View style={styles.stepItem} key={label}>
                  <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
                    <Text style={[styles.stepIndex, active && styles.stepIndexActive]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.workflowCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionTitle}>DMA decision</Text>
              <Text style={styles.sectionSubtitle}>
                Review the workflow state, check field evidence, and decide whether this reported leakage should close or return for rework.
              </Text>
            </View>
          </View>
          <View style={styles.heroBadgeRow}>
            {report.slaDeadline ? <MetaStatusPill icon="time-outline" label={`Due ${formatTanzaniaDate(report.slaDeadline)}`} /> : null}
            {report.reporterName ? <MetaStatusPill icon="person-outline" label={report.reporterName} /> : null}
          </View>
          <View style={styles.actionRow}>
            {canAssign ? (
              <TouchableOpacity
                style={styles.primaryAction}
                onPress={() => setAssignModalOpen(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="git-branch-outline" size={18} color="#ffffff" />
                <Text style={styles.primaryActionText}>{report.teamId ? 'Reassign Team' : 'Assign Team'}</Text>
              </TouchableOpacity>
            ) : null}
            {canReview ? (
              <>
                <TouchableOpacity
                  style={styles.successAction}
                  onPress={() => setReviewMode('approve')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
                  <Text style={styles.primaryActionText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.warningAction}
                  onPress={() => setReviewMode('reject')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="arrow-undo-outline" size={18} color="#ffffff" />
                  <Text style={styles.primaryActionText}>Rework</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reported leakage summary</Text>
          <Text style={styles.summaryDescription}>{report.description}</Text>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.sectionSubtitle}>
                The DMA view keeps the map and coordinates inside the report so routing decisions stay grounded to the site.
              </Text>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: report.latitude || -6.17,
                longitude: report.longitude || 35.74,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012,
              }}
            >
              <Marker
                coordinate={{ latitude: report.latitude, longitude: report.longitude }}
                title={report.trackingId}
                description={report.address || report.description}
              />
            </MapView>
          </View>
          <View style={styles.mapMetaStrip}>
            <View style={styles.mapMetaPill}>
              <Ionicons name="navigate-outline" size={14} color={colors.primary} />
              <Text style={styles.mapMetaText}>
                {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
              </Text>
            </View>
            <View style={styles.mapMetaPill}>
              <Ionicons name="location-outline" size={14} color={colors.primary} />
              <Text style={styles.mapMetaText}>{report.address || 'Address not captured'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Workflow notes</Text>
          <NoteBlock title="Engineer submission" value={report.engineerSubmissionNotes || 'No engineer submission note yet.'} />
          <NoteBlock title="Team leader review" value={report.teamLeaderReviewNotes || 'No team leader review comment yet.'} />
          <NoteBlock title="DMA review" value={report.dmaReviewNotes || 'No DMA review comment yet.'} />
        </View>

        <MediaSection
          title="Reported evidence"
          items={originalMedia}
          onImagePress={(uri, label) => setActiveImage({ uri, label })}
          onExternalPress={openExternalMedia}
        />

        <MediaSection
          title="Repair evidence"
          items={repairMedia}
          onImagePress={(uri, label) => setActiveImage({ uri, label })}
          onExternalPress={openExternalMedia}
          emptyText="No repair evidence has been uploaded for this report yet."
        />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Operational details</Text>
          {detailCards.map((item) => (
            <View key={item.label} style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <Ionicons name={item.icon} size={18} color={colors.primaryDark} />
              </View>
              <View style={styles.detailCopy}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={assignModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setAssignModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign reported leakage</Text>
            <Text style={styles.modalSubtitle}>
              Choose the DMA team that should own the next field action.
            </Text>

            <ScrollView style={styles.optionList} contentContainerStyle={styles.optionListContent}>
              {teams.map((team) => {
                const selected = selectedTeamId === team.id;
                return (
                  <TouchableOpacity
                    key={team.id}
                    style={[styles.optionCard, selected && styles.optionCardSelected]}
                    onPress={() => setSelectedTeamId(team.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.optionCopy}>
                      <Text style={styles.optionTitle}>{team.name}</Text>
                      <Text style={styles.optionSubtitle}>
                        {team.leaderName || 'No leader assigned'} | {team.memberCount} members | {team.activeReports} active reports
                      </Text>
                    </View>
                    {selected ? <Ionicons name="checkmark-circle" size={22} color={colors.primary} /> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setAssignModalOpen(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => void handleAssign()}
                activeOpacity={0.85}
                disabled={submitting}
              >
                {submitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>Save team</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={Boolean(reviewMode)}
        animationType="slide"
        transparent
        onRequestClose={() => setReviewMode(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{reviewMode === 'approve' ? 'Approve repair' : 'Return for rework'}</Text>
            <Text style={styles.modalSubtitle}>
              {reviewMode === 'approve'
                ? 'Add the DMA approval comment that should stay with this reported leakage.'
                : 'Tell the field team what must be corrected before they resubmit.'}
            </Text>
            <TextInput
              value={reviewNotes}
              onChangeText={setReviewNotes}
              placeholder={reviewMode === 'approve' ? 'Enter DMA approval comment...' : 'Enter rework reason...'}
              placeholderTextColor={colors.textMuted}
              multiline
              style={styles.notesInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setReviewMode(null);
                  setReviewNotes('');
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => void handleReview()}
                activeOpacity={0.85}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.primaryButtonText}>{reviewMode === 'approve' ? 'Approve now' : 'Send to rework'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ImageLightboxModal
        visible={Boolean(activeImage)}
        uri={activeImage?.uri}
        label={activeImage?.label}
        onClose={() => setActiveImage(null)}
      />
    </SafeAreaView>
  );
};

const MediaSection: React.FC<{
  title: string;
  items: Array<{ uri: string; label: string; kind: 'image' | 'video' | 'file' }>;
  onImagePress: (uri: string, label: string) => void;
  onExternalPress: (uri: string) => void;
  emptyText?: string;
}> = ({ title, items, onImagePress, onExternalPress, emptyText = 'No media available.' }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items.length === 0 ? (
      <Text style={styles.emptyText}>{emptyText}</Text>
    ) : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaRow}>
        {items.map((item) =>
          item.kind === 'image' ? (
            <TouchableOpacity
              key={`${title}-${item.uri}`}
              style={styles.mediaCard}
              onPress={() => onImagePress(item.uri, item.label)}
              activeOpacity={0.85}
            >
              <ResolvedImage uri={item.uri} style={styles.mediaPreview} fallbackContainerStyle={styles.mediaPreview} />
              <Text style={styles.mediaLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              key={`${title}-${item.uri}`}
              style={styles.fileCard}
              onPress={() => void onExternalPress(item.uri)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={item.kind === 'video' ? 'play-circle-outline' : 'document-outline'}
                size={26}
                color={colors.primaryDark}
              />
              <Text style={styles.fileLabel}>{item.label}</Text>
              <Text style={styles.fileAction}>Open media</Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    )}
  </View>
);

const NoteBlock: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <View style={styles.noteBlock}>
    <Text style={styles.noteLabel}>{title}</Text>
    <Text style={styles.noteValue}>{value}</Text>
  </View>
);

const MetaStatusPill: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string }> = ({ icon, label }) => (
  <View style={styles.metaStatusPill}>
    <Ionicons name={icon} size={13} color={colors.primaryDark} />
    <Text style={styles.metaStatusPillText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMedium,
    fontSize: typography.fontSize.sm,
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  heroCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroGlowLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(37,99,235,0.06)',
    top: -50,
    right: -30,
  },
  heroGlowSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(6,182,212,0.08)',
    bottom: -30,
    left: -16,
  },
  heroTop: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  heroCopy: {
    flex: 1,
  },
  taskId: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  classificationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  leakageChip: {
    borderRadius: 999,
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#a5f3fc',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  leakageChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#155e75',
  },
  naChip: {
    borderRadius: 999,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  naChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  headerBadges: {
    alignItems: 'flex-end',
  },
  workflowCard: {
    marginBottom: 16,
    borderRadius: borderRadius.xl,
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 8,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepIndex: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  stepIndexActive: {
    color: '#ffffff',
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#0f172a',
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  sectionHeaderCopy: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
  },
  sectionSubtitle: {
    marginTop: spacing.xs,
    color: colors.textMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  summaryDescription: {
    color: colors.textMedium,
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
  },
  metaStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: '#eff6ff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  metaStatusPillText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryAction: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  successAction: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: '#16a34a',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  warningAction: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: '#dc2626',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  mapContainer: {
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
  },
  map: {
    height: 220,
  },
  mapMetaStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  mapMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: '#eff6ff',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mapMetaText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    flexShrink: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 72,
  },
  detailIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
  },
  detailCopy: {
    flex: 1,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.semibold,
  },
  detailValue: {
    marginTop: spacing.xs,
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: 20,
  },
  noteBlock: {
    borderRadius: borderRadius.lg,
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  noteLabel: {
    color: colors.textMuted,
    fontSize: typography.fontSize.xs,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.semibold,
  },
  noteValue: {
    marginTop: spacing.sm,
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  mediaRow: {
    gap: spacing.md,
  },
  mediaCard: {
    width: 180,
    gap: spacing.sm,
  },
  mediaPreview: {
    width: 180,
    height: 144,
    borderRadius: borderRadius.lg,
    backgroundColor: '#e2e8f0',
  },
  mediaLabel: {
    color: colors.textMedium,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  fileCard: {
    width: 160,
    height: 144,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8fbff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  fileLabel: {
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  fileAction: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '82%',
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
  optionList: {
    maxHeight: 320,
  },
  optionListContent: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  optionCardSelected: {
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
  notesInput: {
    minHeight: 140,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#f8fbff',
    color: colors.textDark,
    fontSize: typography.fontSize.sm,
    padding: spacing.md,
    textAlignVertical: 'top',
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
