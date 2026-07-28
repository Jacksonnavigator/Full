import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    Alert,
    Share,
    Modal,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { useTheme } from '../context/ThemeContext';
import { EmptyState, HeroHeader } from '../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import {
    getPublicHistorySyncKey,
    getReportHistory,
    lookupReportByTrackingId,
    setPublicHistorySyncKey,
} from '../services/ApiService';
import { ReportResponse } from '../services/reportService';
import {
    getLeakageTypeLabel,
    getReportClassificationLabel,
    isLeakageReport,
} from '../services/reportTypeService';

type UserProgressState = {
    badgeLabel: string;
    detail: string;
    activeStep: number;
    tone: {
        backgroundColor: string;
        textColor: string;
    };
};

const PROGRESS_STEPS = ['Reported', 'Assigned', 'Repair', 'Leader Review', 'DMA Review', 'Resolved'];

export default function HistoryScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [trackingLookup, setTrackingLookup] = useState('');
    const [lookingUp, setLookingUp] = useState(false);
    const [historySyncKey, setHistorySyncKey] = useState('');
    const [applyingSyncKey, setApplyingSyncKey] = useState(false);
    const [sharingSyncKey, setSharingSyncKey] = useState(false);
    const [showSupportTools, setShowSupportTools] = useState(false);
    const [showTransferTools, setShowTransferTools] = useState(false);
    const [showRecoveryTools, setShowRecoveryTools] = useState(false);

    const loadReports = useCallback(async () => {
        try {
            const syncKey = await getPublicHistorySyncKey();
            const data = await getReportHistory();
            setHistorySyncKey(syncKey);
            setReports(data);
        } catch (error) {
            console.error('[HistoryScreen] Error loading reports:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const onRefresh = () => {
        setRefreshing(true);
        loadReports();
    };

    const handleLookupTrackingId = async () => {
        const trackingId = trackingLookup.trim();
        if (!trackingId) {
            Alert.alert('Tracking ID required', 'Enter a tracking ID to recover a reported leakage from the backend.');
            return;
        }

        try {
            setLookingUp(true);
            const report = await lookupReportByTrackingId(trackingId);
            if (!report) {
                Alert.alert('Not found', 'No reported leakage was found with that tracking ID.');
                return;
            }

            await loadReports();
            setTrackingLookup(report.tracking_id);
            Alert.alert('Recovered', 'That reported leakage has been added back into your history.');
        } finally {
            setLookingUp(false);
        }
    };

    const handleApplySyncKey = async () => {
        const syncKey = historySyncKey.trim();
        if (!syncKey) {
            Alert.alert('History code required', 'Enter the history code from your other phone to connect this reported leakage history here.');
            return;
        }

        try {
            setApplyingSyncKey(true);
            await setPublicHistorySyncKey(syncKey);
            await loadReports();
            Alert.alert('History connected', 'This phone is now connected to that reported leakage history.');
        } finally {
            setApplyingSyncKey(false);
        }
    };

    const handleShareSyncKey = async () => {
        const syncKey = historySyncKey.trim();
        if (!syncKey) {
            Alert.alert('History code unavailable', 'Open your history once online so the app can load your history code.');
            return;
        }

        try {
            setSharingSyncKey(true);
            await Share.share({
                message: `MajiScope reported leakage history code: ${syncKey}`,
            });
        } finally {
            setSharingSyncKey(false);
        }
    };

    const formatPriorityLabel = (value?: string) => {
        switch ((value || '').toLowerCase()) {
            case 'urgent':
                return 'High';
            case 'moderate':
                return 'Moderate';
            case 'low':
                return 'Low';
            default:
                return value || 'N/A';
        }
    };

    const renderItem = ({ item }: { item: ReportResponse }) => {
        const coverPhoto = item.photos?.find((uri) => !isVideoReference(uri)) || item.photos?.[0];
        const progress = getUserProgressState(item.status);
        const videoUri = resolveVideoUri(item);
        const showVideoPlaceholder = Boolean(videoUri) && !coverPhoto;

        return (
            <TouchableOpacity
                activeOpacity={0.92}
                onPress={() => navigation.navigate('ReportDetails', { report: item })}
                style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}
            >
                {coverPhoto && !showVideoPlaceholder ? (
                    <View>
                        <Image source={{ uri: coverPhoto }} style={styles.image} />
                        <LinearGradient
                            colors={['transparent', 'rgba(15,23,42,0.55)']}
                            style={styles.imageOverlay}
                        />
                    </View>
                ) : showVideoPlaceholder ? (
                    <View style={[styles.imagePlaceholder, styles.videoPlaceholder, { backgroundColor: colors.surface }]}>
                        <Text style={styles.videoPlaceholderIcon}>Video included</Text>
                        <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                            Video evidence submitted for this reported leakage
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                            No photo available
                        </Text>
                    </View>
                )}

                <View style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.trackingId, { color: colors.primary }]}>
                            {item.tracking_id || 'Pending Tracking ID'}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: progress.tone.backgroundColor }]}>
                            <Text style={[styles.statusText, { color: progress.tone.textColor }]}>{progress.badgeLabel}</Text>
                        </View>
                    </View>

                    <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
                    <View style={styles.classificationRow}>
                        <View style={[styles.classificationBadge, { backgroundColor: '#e0f2fe' }]}>
                            <Text style={[styles.classificationBadgeText, { color: '#0c4a6e' }]}>
                                {getReportClassificationLabel(item.report_type)}
                            </Text>
                        </View>
                        {isLeakageReport(item.report_type) && item.leakage_type ? (
                            <View style={[styles.classificationBadge, { backgroundColor: '#cffafe' }]}>
                                <Text style={[styles.classificationBadgeText, { color: '#155e75' }]}>
                                    {getLeakageTypeLabel(item.leakage_type)}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                    <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>{progress.detail}</Text>
                    <View style={[styles.progressBarTrack, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    backgroundColor: colors.primary,
                                    width: `${((progress.activeStep + 1) / PROGRESS_STEPS.length) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                        {PROGRESS_STEPS[progress.activeStep]} · Step {progress.activeStep + 1} of {PROGRESS_STEPS.length}
                    </Text>
                    <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                        Submitted {formatDate(item.created_at)}
                    </Text>
                    <Text style={[styles.location, { color: colors.textSecondary }]}>
                        {item.address || `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`}
                    </Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>
                        Priority: {formatPriorityLabel(item.priority)}
                    </Text>
                    {!!item.dma_name && (
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>
                            DMA: {item.dma_name}
                        </Text>
                    )}
                    {!!item.utility_name && (
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>
                            Utility: {item.utility_name}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={styles.viewReportButton}
                        onPress={() => navigation.navigate('ReportDetails', { report: item })}
                        activeOpacity={0.85}
                    >
                        <LinearGradient colors={['#0891b2', '#06b6d4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.viewReportGradient}>
                            <Text style={styles.viewReportButtonText}>
                                {videoUri ? 'View Report & Video' : 'View Full Report'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={reports}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <View style={styles.headerCards}>
                        <AppHeader title="Report History" subtitle="Track your submitted reports and review status updates." />
                        <HeroHeader
                            title="My Reports"
                            subtitle="Track every report from submission to resolution."
                            icon="assignment"
                            badge={`${reports.length} report${reports.length === 1 ? '' : 's'}`}
                        />
                        <View style={[styles.lookupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <TouchableOpacity
                                style={styles.supportLauncherButton}
                                onPress={() => setShowSupportTools(true)}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.supportLauncherText, { color: colors.primary }]}>Need help finding an older report?</Text>
                                <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                    Open extra options only if you need to move this history to another phone or restore an older report.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                ListEmptyComponent={
                    <EmptyState
                        icon="assignment"
                        title="No reports yet"
                        message="Your submitted reports will appear here after you send your first one."
                        actionLabel="Report a Problem"
                        onAction={() => navigation.getParent()?.navigate('Report')}
                    />
                }
            />
            <Modal
                visible={showSupportTools}
                transparent
                animationType="slide"
                onRequestClose={() => setShowSupportTools(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
                        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                            <View style={styles.modalHeaderCopy}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Recover Or Move History</Text>
                                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                                    Use these only when you are moving phones or recovering an older report.
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowSupportTools(false)}
                                style={[styles.modalCloseButton, { borderColor: colors.border }]}
                            >
                                <Text style={[styles.modalCloseText, { color: colors.text }]}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <View style={styles.supportToolsStack}>
                                <View style={[styles.supportCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                                    <Text style={[styles.lookupTitle, { color: colors.text }]}>Move your history to another phone</Text>
                                    <Text style={[styles.lookupSubtitle, { color: colors.textSecondary }]}>
                                        Use your private history code only when you want this same reported leakage history on another device.
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.secondaryActionButton, { borderColor: colors.border }]}
                                        onPress={() => setShowTransferTools((value) => !value)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.secondaryActionText, { color: colors.primary }]}>
                                            {showTransferTools ? 'Hide move tools' : 'Open move tools'}
                                        </Text>
                                        <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                            {showTransferTools
                                                ? 'History-code tools are open below.'
                                                : 'Open this only when you need to connect another phone.'}
                                        </Text>
                                    </TouchableOpacity>
                                    {showTransferTools ? (
                                        <>
                                            <View style={styles.lookupRow}>
                                                <TextInput
                                                    value={historySyncKey}
                                                    onChangeText={setHistorySyncKey}
                                                    placeholder="Paste history code"
                                                    placeholderTextColor={colors.textSecondary}
                                                    autoCapitalize="none"
                                                    style={[
                                                        styles.lookupInput,
                                                        {
                                                            color: colors.text,
                                                            borderColor: colors.border,
                                                            backgroundColor: colors.card,
                                                        },
                                                    ]}
                                                />
                                                <TouchableOpacity
                                                    style={[styles.lookupButton, { backgroundColor: colors.primary }, applyingSyncKey && styles.lookupButtonDisabled]}
                                                    onPress={() => void handleApplySyncKey()}
                                                    disabled={applyingSyncKey}
                                                    activeOpacity={0.85}
                                                >
                                                    {applyingSyncKey ? (
                                                        <ActivityIndicator size="small" color="#ffffff" />
                                                    ) : (
                                                        <Text style={styles.lookupButtonText}>Connect</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                style={[styles.secondaryActionButton, { borderColor: colors.border }]}
                                                onPress={() => void handleShareSyncKey()}
                                                disabled={sharingSyncKey}
                                                activeOpacity={0.85}
                                            >
                                                {sharingSyncKey ? (
                                                    <ActivityIndicator size="small" color={colors.primary} />
                                                ) : (
                                                    <>
                                                        <Text style={[styles.secondaryActionText, { color: colors.primary }]}>Share my history code</Text>
                                                        <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                                            Send the code to your other phone without typing it manually.
                                                        </Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        </>
                                    ) : null}
                                </View>

                                <View style={[styles.supportCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                                    <Text style={[styles.lookupTitle, { color: colors.text }]}>Recover an older report</Text>
                                    <Text style={[styles.lookupSubtitle, { color: colors.textSecondary }]}>
                                        If one of your older reported leakage items is missing on this phone, use its tracking ID to bring it back here.
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.secondaryActionButton, { borderColor: colors.border }]}
                                        onPress={() => setShowRecoveryTools((value) => !value)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.secondaryActionText, { color: colors.primary }]}>
                                            {showRecoveryTools ? 'Hide recovery tools' : 'Open recovery tools'}
                                        </Text>
                                        <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                            {showRecoveryTools
                                                ? 'Tracking ID recovery is open below.'
                                                : 'Open this only when an older report is missing.'}
                                        </Text>
                                    </TouchableOpacity>
                                    {showRecoveryTools ? (
                                        <View style={styles.lookupRow}>
                                            <TextInput
                                                value={trackingLookup}
                                                onChangeText={setTrackingLookup}
                                                placeholder="Example: ANON-ABC12345"
                                                placeholderTextColor={colors.textSecondary}
                                                autoCapitalize="characters"
                                                style={[
                                                    styles.lookupInput,
                                                    {
                                                        color: colors.text,
                                                        borderColor: colors.border,
                                                        backgroundColor: colors.card,
                                                    },
                                                ]}
                                            />
                                            <TouchableOpacity
                                                style={[styles.lookupButton, { backgroundColor: colors.primary }, lookingUp && styles.lookupButtonDisabled]}
                                                onPress={() => void handleLookupTrackingId()}
                                                disabled={lookingUp}
                                                activeOpacity={0.85}
                                            >
                                                {lookingUp ? (
                                                    <ActivityIndicator size="small" color="#ffffff" />
                                                ) : (
                                                    <Text style={styles.lookupButtonText}>Recover</Text>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    ) : null}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const isVideoReference = (value?: string | null) => {
    if (!value) return false;
    return value.startsWith('data:video/') || /\.(mp4|mov|webm|m4v|3gp)(\?|$)/i.test(value);
};

const resolveVideoUri = (report: ReportResponse) => {
    const media = report.report_photos && report.report_photos.length > 0 ? report.report_photos : report.photos || [];
    const explicitVideo = media.find((uri) => isVideoReference(uri));
    if (explicitVideo) {
        return explicitVideo;
    }

    if (report.primary_media_type === 'video' && media.length > 0) {
        return media[0];
    }

    return null;
};

const getUserProgressState = (status: string): UserProgressState => {
    switch (status) {
        case 'new':
            return {
                badgeLabel: 'Received',
                detail: 'Your reported leakage has been received and is waiting to be assigned to a field team.',
                activeStep: 0,
                tone: { backgroundColor: '#e0f2fe', textColor: '#0c4a6e' },
            };
        case 'assigned':
            return {
                badgeLabel: 'Assigned',
                detail: 'A field team has been assigned and will head to the reported location or continue rework if it was sent back.',
                activeStep: 1,
                tone: { backgroundColor: '#dbeafe', textColor: '#1d4ed8' },
            };
        case 'in_progress':
            return {
                badgeLabel: 'Repair in Progress',
                detail: 'The field crew is actively working on the reported leakage.',
                activeStep: 2,
                tone: { backgroundColor: '#fef3c7', textColor: '#92400e' },
            };
        case 'pending_approval':
            return {
                badgeLabel: 'Under Final Review',
                detail: 'Repair work is complete and the reported leakage is moving through team leader and DMA review.',
                activeStep: 4,
                tone: { backgroundColor: '#fde68a', textColor: '#92400e' },
            };
        case 'approved':
        case 'closed':
            return {
                badgeLabel: 'Resolved',
                detail: 'This reported leakage has been completed and closed successfully.',
                activeStep: 5,
                tone: { backgroundColor: '#d1fae5', textColor: '#065f46' },
            };
        case 'rejected':
            return {
                badgeLabel: 'Sent Back for Rework',
                detail: 'The repair needs more work before it can be fully approved.',
                activeStep: 2,
                tone: { backgroundColor: '#fee2e2', textColor: '#991b1b' },
            };
        default:
            return {
                badgeLabel: formatStatus(status),
                detail: 'Your reported leakage is moving through the operations workflow.',
                activeStep: 0,
                tone: { backgroundColor: '#f3f4f6', textColor: '#374151' },
            };
    }
};

const formatStatus = (status: string) =>
    status
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

const TANZANIA_LOCALE = 'en-TZ';
const TANZANIA_TIME_ZONE = 'Africa/Dar_es_Salaam';

const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    try {
        const datePart = new Intl.DateTimeFormat(TANZANIA_LOCALE, {
            timeZone: TANZANIA_TIME_ZONE,
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
        const timePart = new Intl.DateTimeFormat(TANZANIA_LOCALE, {
            timeZone: TANZANIA_TIME_ZONE,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(date);
        return `${datePart}, ${timePart}`;
    } catch {
        return value;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 120,
        flexGrow: 1,
    },
    headerCards: {
        gap: 12,
        marginBottom: 16,
    },
    supportToolsStack: {
        gap: 12,
    },
    supportLauncherButton: {
        paddingTop: 6,
        gap: 4,
        alignSelf: 'flex-start',
    },
    supportLauncherText: {
        fontSize: 13,
        fontWeight: '700',
    },
    supportCard: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        gap: 8,
    },
    lookupCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        gap: 8,
    },
    lookupTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    lookupSubtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
    lookupRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    lookupInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        fontWeight: '600',
    },
    lookupButton: {
        minWidth: 92,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lookupButtonDisabled: {
        opacity: 0.7,
    },
    lookupButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    secondaryActionButton: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 4,
    },
    secondaryActionText: {
        fontSize: 14,
        fontWeight: '700',
    },
    secondaryActionHint: {
        fontSize: 12,
        lineHeight: 16,
    },
    card: {
        borderRadius: 20,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 6,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
    },
    imagePlaceholder: {
        width: '100%',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoPlaceholder: {
        gap: 8,
    },
    videoPlaceholderIcon: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 1.5,
        color: '#1d4ed8',
        backgroundColor: '#dbeafe',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    imagePlaceholderText: {
        fontSize: 14,
        fontWeight: '500',
    },
    cardContent: {
        padding: 16,
        gap: 6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    trackingId: {
        fontSize: 13,
        fontWeight: '700',
        flex: 1,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    classificationRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    classificationBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },
    classificationBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    statusDetail: {
        fontSize: 13,
        lineHeight: 18,
    },
    progressBarTrack: {
        height: 6,
        borderRadius: 999,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 999,
    },
    progressLabel: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
    },
    timestamp: {
        fontSize: 12,
    },
    location: {
        fontSize: 13,
        lineHeight: 18,
    },
    meta: {
        fontSize: 12,
    },
    viewDetailsHint: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '700',
    },
    viewReportButton: {
        marginTop: 10,
        alignSelf: 'stretch',
        borderRadius: 999,
        overflow: 'hidden',
    },
    viewReportGradient: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 999,
    },
    viewReportButtonText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.3,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 80,
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        maxHeight: '84%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    modalHeaderCopy: {
        flex: 1,
        paddingRight: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    modalSubtitle: {
        marginTop: 4,
        fontSize: 12,
    },
    modalCloseButton: {
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    modalCloseText: {
        fontSize: 12,
        fontWeight: '700',
    },
    modalBody: {
        padding: 20,
        gap: 14,
    },
    mediaSection: {
        gap: 10,
    },
    mediaTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    mediaStrip: {
        gap: 10,
        paddingRight: 8,
    },
    mediaImage: {
        width: 180,
        height: 120,
        borderRadius: 14,
        resizeMode: 'cover',
    },
    videoActionButton: {
        alignSelf: 'flex-start',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginTop: 4,
    },
    videoActionButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '700',
    },
    modalDescription: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    detailLine: {
        paddingBottom: 10,
        borderBottomWidth: 1,
        gap: 4,
    },
    detailLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        fontWeight: '700',
        letterSpacing: 0.4,
    },
    detailValue: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    noteBlock: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        gap: 6,
    },
    noteTitle: {
        fontSize: 13,
        fontWeight: '700',
    },
    noteValue: {
        fontSize: 13,
        lineHeight: 20,
    },
});
