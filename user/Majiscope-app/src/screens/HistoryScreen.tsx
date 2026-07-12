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
import { useTheme } from '../context/ThemeContext';
import { EmptyState } from '../components/ui';
import AppHeader from '../components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { SCREEN_PADDING_H, SCREEN_PADDING_TOP, SCREEN_SECTION_GAP } from '../theme/screenLayout';
import {
    getPublicHistorySyncKey,
    getReportHistory,
    lookupReportByTrackingId,
    setPublicHistorySyncKey,
} from '../services/ApiService';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
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
const SWAHILI_PROGRESS_STEPS = ['Imeandikwa', 'Imepewa', 'Matengenezo', 'Ukaguzi wa Kiongozi', 'Ukaguzi wa DMA', 'Imekamilika'];

export default function HistoryScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { language } = useAppLanguage();
    const bottomPadding = useBottomTabPadding();
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

    const copy = language === 'sw'
        ? {
            lookupTitle: 'Kitambulisho cha Ufuatiliaji kinahitajika',
            lookupMessage: 'Ingiza kitambulisho cha ufuatiliaji ili kurejesha ripoti ya uvujaji kutoka backend.',
            notFoundTitle: 'Haijapatikana',
            notFoundMessage: 'Hakuna ripoti ya uvujaji iliyopatikana na kitambulisho hicho.',
            recoveredTitle: 'Imerejeshwa',
            recoveredMessage: 'Ripoti hiyo imeongezwa tena kwenye historia yako.',
            syncTitle: 'Msimbo wa historia unahitajika',
            syncMessage: 'Ingiza msimbo wa historia kutoka simu yako nyingine ili kuunganisha historia ya ripoti hapa.',
            syncSuccessTitle: 'Historia imeunganishwa',
            syncSuccessMessage: 'Simu hii sasa imeunganishwa na historia hiyo ya ripoti.',
            shareUnavailableTitle: 'Msimbo wa historia haupatikani',
            shareUnavailableMessage: 'Fungua historia yako mara moja mtandaoni ili programu ipate msimbo wako wa historia.',
            pendingTracking: 'Kitambulisho cha ufuatiliaji kinachunguzwa',
            noPhoto: 'Hakuna picha inayopatikana',
            videoPlaceholder: 'Video imejumuishwa',
            videoMessage: 'Ushahidi wa video uliopelekwa kwa ripoti hii',
            searchPlaceholder: 'Tafuta kwa kitambulisho cha ufuatiliaji',
            searchButton: 'Tafuta',
            connectButton: 'Unganisha Historia',
            shareButton: 'Shiriki Msimbo',
            headerTitle: 'Ripoti Zangu',
            headerSubtitle: 'Fuata kila ripoti kutoka uwasilishaji hadi ufumbuzi.',
            helpTitle: 'Unahitaji msaada kupata ripoti ya zamani?',
            helpSubtitle: 'Fungua chaguo za ziada tu ikiwa unahitaji kuhamisha historia hii kwenda kwenye simu nyingine au kurejesha ripoti ya zamani.',
            emptyTitle: 'Hakuna ripoti bado',
            emptyMessage: 'Ripoti zako ulizowasilisha zitaonekana hapa baada ya kutuma ya kwanza.',
            emptyAction: 'Ripoti Tatizo',
            modalTitle: 'Rejesha au Hamisha Historia',
            modalSubtitle: 'Tumia hizi tu wakati wa kuhamisha simu au kurejesha ripoti ya zamani.',
            closeButton: 'Funga',
            moveTitle: 'Hamisha historia yako kwenda kwa simu nyingine',
            moveSubtitle: 'Tumia msimbo wako wa historia wa faragha tu unapotaka historia hii ya ripoti kwenye kifaa kingine.',
            moveToolsOpen: 'Fungua zana za uhamishaji',
            moveToolsHide: 'Ficha zana za uhamishaji',
            moveToolsHintOpen: 'Fungua hii tu unapotaka kuunganisha simu nyingine.',
            moveToolsHintClosed: 'Zana za msimbo wa historia ziko chini.',
            moveToolsPlaceholder: 'Bandika msimbo wa historia',
            connectButtonLabel: 'Unganisha',
            shareHistoryTitle: 'Shiriki msimbo wangu wa historia',
            shareHistorySubtitle: 'Tuma msimbo kwenda kwa simu yako nyingine bila kuandika kwa mikono.',
            recoverTitle: 'Rejesha ripoti ya zamani',
            recoverSubtitle: 'Kama kipengee kimoja cha ripoti yako ya zamani hakipo kwenye simu hii, tumia kitambulisho chake cha ufuatiliaji kuirejesha hapa.',
            recoverToolsOpen: 'Fungua zana za urejesho',
            recoverToolsHide: 'Ficha zana za urejesho',
            recoverToolsHintOpen: 'Urejesho wa kitambulisho cha ufuatiliaji uko chini.',
            recoverToolsHintClosed: 'Fungua hii tu wakati ripoti ya zamani inapotea.',
            recoverPlaceholder: 'Mfano: ANON-ABC12345',
            recoverButton: 'Rejesha',
            viewDetails: 'Gusa kwa ripoti kamili →',
            viewDetailsVideo: 'Gusa kwa ripoti kamili na video →',
            progressLabel: 'Hatua',
            submittedPrefix: 'Imewasilishwa ',
            priorityPrefix: 'Kipaumbele: ',
            dmaPrefix: 'DMA: ',
            utilityPrefix: 'Huduma: ',
          }
        : {
            lookupTitle: 'Tracking ID required',
            lookupMessage: 'Enter a tracking ID to recover a reported leakage from the backend.',
            notFoundTitle: 'Not found',
            notFoundMessage: 'No reported leakage was found with that tracking ID.',
            recoveredTitle: 'Recovered',
            recoveredMessage: 'That reported leakage has been added back into your history.',
            syncTitle: 'History code required',
            syncMessage: 'Enter the history code from your other phone to connect this reported leakage history here.',
            syncSuccessTitle: 'History connected',
            syncSuccessMessage: 'This phone is now connected to that reported leakage history.',
            shareUnavailableTitle: 'History code unavailable',
            shareUnavailableMessage: 'Open your history once online so the app can load your history code.',
            pendingTracking: 'Pending Tracking ID',
            noPhoto: 'No photo available',
            videoPlaceholder: 'Video included',
            videoMessage: 'Video evidence submitted for this reported leakage',
            searchPlaceholder: 'Search by tracking ID',
            searchButton: 'Lookup',
            connectButton: 'Connect History',
            shareButton: 'Share Code',
            headerTitle: 'My Reports',
            headerSubtitle: 'Track every report from submission to resolution.',
            helpTitle: 'Need help finding an older report?',
            helpSubtitle: 'Open extra options only if you need to move this history to another phone or restore an older report.',
            emptyTitle: 'No reports yet',
            emptyMessage: 'Your submitted reports will appear here after you send your first one.',
            emptyAction: 'Report a Problem',
            modalTitle: 'Recover Or Move History',
            modalSubtitle: 'Use these only when you are moving phones or recovering an older report.',
            closeButton: 'Close',
            moveTitle: 'Move your history to another phone',
            moveSubtitle: 'Use your private history code only when you want this same reported leakage history on another device.',
            moveToolsOpen: 'Open move tools',
            moveToolsHide: 'Hide move tools',
            moveToolsHintOpen: 'History-code tools are open below.',
            moveToolsHintClosed: 'Open this only when you need to connect another phone.',
            moveToolsPlaceholder: 'Paste history code',
            connectButtonLabel: 'Connect',
            shareHistoryTitle: 'Share my history code',
            shareHistorySubtitle: 'Send the code to your other phone without typing it manually.',
            recoverTitle: 'Recover an older report',
            recoverSubtitle: 'If one of your older reported leakage items is missing on this phone, use its tracking ID to bring it back here.',
            recoverToolsOpen: 'Open recovery tools',
            recoverToolsHide: 'Hide recovery tools',
            recoverToolsHintOpen: 'Tracking ID recovery is open below.',
            recoverToolsHintClosed: 'Open this only when an older report is missing.',
            recoverPlaceholder: 'Example: ANON-ABC12345',
            recoverButton: 'Recover',
            viewDetails: 'Tap for full report →',
            viewDetailsVideo: 'Tap for full report & video →',
            progressLabel: 'Step',
            submittedPrefix: 'Submitted ',
            priorityPrefix: 'Priority: ',
            dmaPrefix: 'DMA: ',
            utilityPrefix: 'Utility: ',
          };

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
            Alert.alert(copy.lookupTitle, copy.lookupMessage);
            return;
        }

        try {
            setLookingUp(true);
            const report = await lookupReportByTrackingId(trackingId);
            if (!report) {
                Alert.alert(copy.notFoundTitle, copy.notFoundMessage);
                return;
            }

            await loadReports();
            setTrackingLookup(report.tracking_id);
            Alert.alert(copy.recoveredTitle, copy.recoveredMessage);
        } finally {
            setLookingUp(false);
        }
    };

    const handleApplySyncKey = async () => {
        const syncKey = historySyncKey.trim();
        if (!syncKey) {
            Alert.alert(copy.syncTitle, copy.syncMessage);
            return;
        }

        try {
            setApplyingSyncKey(true);
            await setPublicHistorySyncKey(syncKey);
            await loadReports();
            Alert.alert(copy.syncSuccessTitle, copy.syncSuccessMessage);
        } finally {
            setApplyingSyncKey(false);
        }
    };

    const handleShareSyncKey = async () => {
        const syncKey = historySyncKey.trim();
        if (!syncKey) {
            Alert.alert(copy.shareUnavailableTitle, copy.shareUnavailableMessage);
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

    const formatPriorityLabel = (value?: string, currentLanguage: 'sw' | 'en' = 'en') => {
        switch ((value || '').toLowerCase()) {
            case 'urgent':
                return currentLanguage === 'sw' ? 'Juu' : 'High';
            case 'moderate':
                return currentLanguage === 'sw' ? 'Kati' : 'Moderate';
            case 'low':
                return currentLanguage === 'sw' ? 'Chini' : 'Low';
            default:
                return value || 'N/A';
        }
    };

    const renderItem = ({ item }: { item: ReportResponse }) => {
        const coverPhoto = item.photos?.find((uri) => !isVideoReference(uri)) || item.photos?.[0];
        const progress = getUserProgressState(item.status, language);
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
                        <Text style={styles.videoPlaceholderIcon}>{copy.videoPlaceholder}</Text>
                        <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                            {copy.videoMessage}
                        </Text>
                    </View>
                ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                            {copy.noPhoto}
                        </Text>
                    </View>
                )}

                <View style={styles.cardContent}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.trackingId, { color: colors.primary }]}>
                            {item.tracking_id || copy.pendingTracking}
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
                        {language === 'sw' ? SWAHILI_PROGRESS_STEPS[progress.activeStep] : PROGRESS_STEPS[progress.activeStep]} · {copy.progressLabel} {progress.activeStep + 1} of {PROGRESS_STEPS.length}
                    </Text>
                    <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                        {copy.submittedPrefix}{formatDate(item.created_at)}
                    </Text>
                    <Text style={[styles.location, { color: colors.textSecondary }]}>
                        {item.address || `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`}
                    </Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>
                        {copy.priorityPrefix}{formatPriorityLabel(item.priority, language)}
                    </Text>
                    {!!item.dma_name && (
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>
                            {copy.dmaPrefix}{item.dma_name}
                        </Text>
                    )}
                    {!!item.utility_name && (
                        <Text style={[styles.meta, { color: colors.textSecondary }]}>
                            {copy.utilityPrefix}{item.utility_name}
                        </Text>
                    )}
                    <Text style={[styles.viewDetailsHint, { color: colors.primary }]}>
                        {videoUri ? copy.viewDetailsVideo : copy.viewDetails}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={reports}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
                ListHeaderComponent={
                    <View style={styles.headerCards}>
                        <AppHeader title={copy.headerTitle} subtitle={copy.headerSubtitle} onLanguagePress={() => navigation.navigate('LanguageSelection')} />
                        <View style={[styles.lookupCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <TouchableOpacity
                                style={styles.supportLauncherButton}
                                onPress={() => setShowSupportTools(true)}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.supportLauncherText, { color: colors.primary }]}>{copy.helpTitle}</Text>
                                <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                    {copy.helpSubtitle}
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
                        title={copy.emptyTitle}
                        message={copy.emptyMessage}
                        actionLabel={copy.emptyAction}
                        onAction={() => navigation.getParent()?.navigate('Report')}
                        style={styles.emptyState}
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
                                <Text style={[styles.modalTitle, { color: colors.text }]}>{copy.modalTitle}</Text>
                                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                                    {copy.modalSubtitle}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowSupportTools(false)}
                                style={[styles.modalCloseButton, { borderColor: colors.border }]}
                            >
                                <Text style={[styles.modalCloseText, { color: colors.text }]}>{copy.closeButton}</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <View style={styles.supportToolsStack}>
                                <View style={[styles.supportCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                                    <Text style={[styles.lookupTitle, { color: colors.text }]}>{copy.moveTitle}</Text>
                                    <Text style={[styles.lookupSubtitle, { color: colors.textSecondary }]}>
                                        {copy.moveSubtitle}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.secondaryActionButton, { borderColor: colors.border }]}
                                        onPress={() => setShowTransferTools((value) => !value)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.secondaryActionText, { color: colors.primary }]}>
                                            {showTransferTools ? copy.moveToolsHide : copy.moveToolsOpen}
                                        </Text>
                                        <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                            {showTransferTools
                                                ? copy.moveToolsHintOpen
                                                : copy.moveToolsHintClosed}
                                        </Text>
                                    </TouchableOpacity>
                                    {showTransferTools ? (
                                        <>
                                            <View style={styles.lookupRow}>
                                                <TextInput
                                                    value={historySyncKey}
                                                    onChangeText={setHistorySyncKey}
                                                    placeholder={copy.moveToolsPlaceholder}
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
                                                        <Text style={styles.lookupButtonText}>{copy.connectButtonLabel}</Text>
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
                                                        <Text style={[styles.secondaryActionText, { color: colors.primary }]}>{copy.shareHistoryTitle}</Text>
                                                        <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                                            {copy.shareHistorySubtitle}
                                                        </Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        </>
                                    ) : null}
                                </View>

                                <View style={[styles.supportCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                                    <Text style={[styles.lookupTitle, { color: colors.text }]}>{copy.recoverTitle}</Text>
                                    <Text style={[styles.lookupSubtitle, { color: colors.textSecondary }]}>
                                        {copy.recoverSubtitle}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.secondaryActionButton, { borderColor: colors.border }]}
                                        onPress={() => setShowRecoveryTools((value) => !value)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.secondaryActionText, { color: colors.primary }]}>
                                            {showRecoveryTools ? copy.recoverToolsHide : copy.recoverToolsOpen}
                                        </Text>
                                        <Text style={[styles.secondaryActionHint, { color: colors.textSecondary }]}>
                                            {showRecoveryTools
                                                ? copy.recoverToolsHintOpen
                                                : copy.recoverToolsHintClosed}
                                        </Text>
                                    </TouchableOpacity>
                                    {showRecoveryTools ? (
                                        <View style={styles.lookupRow}>
                                            <TextInput
                                                value={trackingLookup}
                                                onChangeText={setTrackingLookup}
                                                placeholder={copy.recoverPlaceholder}
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
                                                    <Text style={styles.lookupButtonText}>{copy.recoverButton}</Text>
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
        </View>
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

const getUserProgressState = (status: string, language: 'sw' | 'en' = 'en'): UserProgressState => {
    switch (status) {
        case 'new':
            return {
                badgeLabel: language === 'sw' ? 'Imepokelewa' : 'Received',
                detail: language === 'sw' ? 'Ripoti yako ya uvujaji imepokelewa na inasubiri kupewa timu ya uwanja.' : 'Your reported leakage has been received and is waiting to be assigned to a field team.',
                activeStep: 0,
                tone: { backgroundColor: '#e0f2fe', textColor: '#0c4a6e' },
            };
        case 'assigned':
            return {
                badgeLabel: language === 'sw' ? 'Imepewa' : 'Assigned',
                detail: language === 'sw' ? 'Timu ya uwanja imepewa kazi na itaenda kwenye eneo lililoripotiwa au kuendelea na marekebisho kama ilirudishwa.' : 'A field team has been assigned and will head to the reported location or continue rework if it was sent back.',
                activeStep: 1,
                tone: { backgroundColor: '#dbeafe', textColor: '#1d4ed8' },
            };
        case 'in_progress':
            return {
                badgeLabel: language === 'sw' ? 'Matengenezo Yanaendelea' : 'Repair in Progress',
                detail: language === 'sw' ? 'Wafanyakazi wa uwanja wanafanya kazi kwa bidii kwenye uvujaji uliloripotiwa.' : 'The field crew is actively working on the reported leakage.',
                activeStep: 2,
                tone: { backgroundColor: '#fef3c7', textColor: '#92400e' },
            };
        case 'pending_approval':
            return {
                badgeLabel: language === 'sw' ? 'Chini ya Ukaguzi wa Mwisho' : 'Under Final Review',
                detail: language === 'sw' ? 'Kazi ya matengenezo imekamilika na uvujaji uliloripotiwa unaendelea kupitia ukaguzi wa kiongozi wa timu na DMA.' : 'Repair work is complete and the reported leakage is moving through team leader and DMA review.',
                activeStep: 4,
                tone: { backgroundColor: '#fde68a', textColor: '#92400e' },
            };
        case 'approved':
        case 'closed':
            return {
                badgeLabel: language === 'sw' ? 'Imekamilika' : 'Resolved',
                detail: language === 'sw' ? 'Uvujaji huu uliloripotiwa umekamilika na kufungwa kwa mafanikio.' : 'This reported leakage has been completed and closed successfully.',
                activeStep: 5,
                tone: { backgroundColor: '#d1fae5', textColor: '#065f46' },
            };
        case 'rejected':
            return {
                badgeLabel: language === 'sw' ? 'Imerudishwa kwa Marekebisho' : 'Sent Back for Rework',
                detail: language === 'sw' ? 'Marekebisho yanahitaji kazi zaidi kabla ya kuidhinishwa kikamilifu.' : 'The repair needs more work before it can be fully approved.',
                activeStep: 2,
                tone: { backgroundColor: '#fee2e2', textColor: '#991b1b' },
            };
        default:
            return {
                badgeLabel: formatStatus(status),
                detail: language === 'sw' ? 'Ripoti yako ya uvujaji inaendelea kupitia mchakato wa uendeshaji.' : 'Your reported leakage is moving through the operations workflow.',
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
        paddingHorizontal: SCREEN_PADDING_H,
        paddingTop: SCREEN_PADDING_TOP,
    },
    emptyState: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    headerCards: {
        gap: 8,
        marginBottom: SCREEN_SECTION_GAP,
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
        borderRadius: 14,
        borderWidth: 1,
        padding: 12,
        gap: 6,
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
        borderRadius: 16,
        marginBottom: 10,
        overflow: 'hidden',
        elevation: 4,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    image: {
        width: '100%',
        height: 150,
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
        height: 110,
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
        padding: 12,
        gap: 4,
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
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
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
        height: 5,
        borderRadius: 999,
        marginTop: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 999,
    },
    progressLabel: {
        marginTop: 4,
        fontSize: 11,
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
        marginTop: 4,
        fontSize: 12,
        fontWeight: '700',
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
