import React, { useMemo, useState } from 'react';
import {
    Alert,
    Linking,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import AppHeader from '../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { SCREEN_PADDING_H, SCREEN_SECTION_GAP } from '../theme/screenLayout';
import { ReportResponse } from '../services/reportService';
import {
    getLeakageTypeLabel,
    getReportClassificationLabel,
    isLeakageReport,
} from '../services/reportTypeService';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';

export default function ReportDetailsScreen({ route }: any) {
    const { colors } = useTheme();
    const { language } = useAppLanguage();
    const bottomPadding = useBottomTabPadding();
    const navigation = useNavigation<any>();
    const report = route?.params?.report as ReportResponse | undefined;
    const [videoPreviewUri, setVideoPreviewUri] = useState<string | null>(null);
    const copy = language === 'sw'
        ? {
            missingText: 'Ripoti hii ya uvujaji haiwezi kufunguliwa.',
            evidenceTitle: 'Ushahidi uliowasilishwa',
            videoTitle: 'Video iliyowasilishwa',
            videoMessage: 'Video iliyowasilishwa inapatikana kwa ripoti hii ya uvujaji.',
            openVideo: 'Fungua video iliyowasilishwa',
            reportTypeLabel: 'Aina ya Ripoti',
            leakageTypeLabel: 'Aina ya Uvujaji',
            statusLabel: 'Hali',
            priorityLabel: 'Kipaumbele',
            locationLabel: 'Eneo',
            submittedLabel: 'Imewasilishwa',
            utilityLabel: 'Huduma',
            dmaLabel: 'DMA',
            utilityContactsTitle: 'Anwani za huduma kwa ripoti hii',
            reportTitle: 'Ripoti Yako',
            callPrefix: 'Piga: ',
            emailPrefix: 'Barua pepe: ',
            addressPrefix: 'Anwani: ',
            callError: 'Hitilafu',
            dialerError: 'Imeshindwa kufungua kisanduku cha simu',
            emailError: 'Imeshindwa kufungua barua pepe',
            mapError: 'Imeshindwa kufungua ramani',
            latestNoteTitle: 'Ujumbe wa mwisho wa utaratibu',
            engineerNoteTitle: 'Ujumbe wa uwasilishaji wa mhandisi',
            leaderNoteTitle: 'Maoni ya kiongozi wa timu',
            dmaNoteTitle: 'Uamuzi wa ukaguzi wa DMA',
          }
        : {
            missingText: 'This reported leakage could not be opened.',
            evidenceTitle: 'Submitted evidence',
            videoTitle: 'Submitted video',
            videoMessage: 'A submitted video is available for this reported leakage.',
            openVideo: 'Open submitted video',
            reportTypeLabel: 'Report Type',
            leakageTypeLabel: 'Leakage Type',
            statusLabel: 'Status',
            priorityLabel: 'Priority',
            locationLabel: 'Location',
            submittedLabel: 'Submitted',
            utilityLabel: 'Utility',
            dmaLabel: 'DMA',
            utilityContactsTitle: 'Utility contacts for this report',
            reportTitle: 'Your Report',
            callPrefix: 'Call: ',
            emailPrefix: 'Email: ',
            addressPrefix: 'Address: ',
            callError: 'Error',
            dialerError: 'Unable to open phone dialer',
            emailError: 'Unable to open email app',
            mapError: 'Unable to open map',
            latestNoteTitle: 'Latest workflow note',
            engineerNoteTitle: 'Engineer submission note',
            leaderNoteTitle: 'Team leader review comment',
            dmaNoteTitle: 'DMA review decision',
          };

    const media = useMemo(() => {
        if (!report) return [];
        return report.report_photos && report.report_photos.length > 0 ? report.report_photos : report.photos || [];
    }, [report]);

    const images = media.filter((uri) => !isVideoReference(uri));
    const videoUri = resolveVideoUri(report);

    if (!report) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.missingText, { color: colors.textSecondary }]}>{copy.missingText}</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]} showsVerticalScrollIndicator={false}>
                <AppHeader title={report.tracking_id || copy.reportTitle} subtitle={getUserProgressState(report.status).detail} onLanguagePress={() => navigation.navigate('LanguageSelection')} />

                <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.description, { color: colors.text }]}>{report.description}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getUserProgressState(report.status).tone.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: getUserProgressState(report.status).tone.textColor }]}>
                            {getUserProgressState(report.status).badgeLabel}
                        </Text>
                    </View>
                </View>

                {images.length > 0 ? (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>{copy.evidenceTitle}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaStrip}>
                            {images.map((uri, index) => (
                                <Image key={`${uri}-${index}`} source={{ uri }} style={styles.mediaImage} />
                            ))}
                        </ScrollView>
                    </View>
                ) : null}

                {videoUri ? (
                    <View style={[styles.noteBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.noteTitle, { color: colors.text }]}>{copy.videoTitle}</Text>
                        <Text style={[styles.noteValue, { color: colors.textSecondary }]}>
                            {copy.videoMessage}
                        </Text>
                        <TouchableOpacity
                            style={[styles.videoActionButton, { backgroundColor: colors.primary }]}
                            onPress={() => setVideoPreviewUri(videoUri)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.videoActionButtonText}>{copy.openVideo}</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <DetailLine
                        label={copy.reportTypeLabel}
                        value={getReportClassificationLabel(report.report_type)}
                        colors={colors}
                    />
                    {isLeakageReport(report.report_type) ? (
                        <DetailLine
                            label={copy.leakageTypeLabel}
                            value={getLeakageTypeLabel(report.leakage_type)}
                            colors={colors}
                        />
                    ) : null}
                    <DetailLine label={copy.statusLabel} value={getUserProgressState(report.status, language).badgeLabel} colors={colors} />
                    <DetailLine label={copy.priorityLabel} value={formatPriorityLabel(report.priority)} colors={colors} />
                    <DetailLine
                        label={copy.locationLabel}
                        value={report.address || `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`}
                        colors={colors}
                    />
                    <DetailLine label={copy.submittedLabel} value={formatDate(report.created_at)} colors={colors} />
                    {report.utility_name ? <DetailLine label={copy.utilityLabel} value={report.utility_name} colors={colors} /> : null}
                    {report.dma_name ? <DetailLine label={copy.dmaLabel} value={report.dma_name} colors={colors} /> : null}
                </View>

                {(report.utility_contact_phone || report.utility_contact_email || report.utility_contact_address) ? (
                    <View style={[styles.noteBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.noteTitle, { color: colors.text }]}>{copy.utilityContactsTitle}</Text>
                        {report.utility_name ? (
                            <Text style={[styles.noteValue, { color: colors.textSecondary }]}>
                                {report.utility_name}
                            </Text>
                        ) : null}
                        {report.utility_contact_phone ? (
                            <TouchableOpacity
                                style={[styles.contactActionButton, { borderColor: colors.primary }]}
                                onPress={() =>
                                    Linking.openURL(`tel:${report.utility_contact_phone}`).catch(() => {
                                        Alert.alert(copy.callError, copy.dialerError);
                                    })
                                }
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.contactActionText, { color: colors.primary }]}>
                                    {copy.callPrefix}{report.utility_contact_phone}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        {report.utility_contact_email ? (
                            <TouchableOpacity
                                style={[styles.contactActionButton, { borderColor: colors.primary }]}
                                onPress={() =>
                                    Linking.openURL(`mailto:${report.utility_contact_email}`).catch(() => {
                                        Alert.alert(copy.callError, copy.emailError);
                                    })
                                }
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.contactActionText, { color: colors.primary }]}>
                                    {copy.emailPrefix}{report.utility_contact_email}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        {report.utility_contact_address ? (
                            <TouchableOpacity
                                style={[styles.contactActionButton, { borderColor: colors.primary }]}
                                onPress={() =>
                                    Linking.openURL(`geo:0,0?q=${encodeURIComponent(report.utility_contact_address || '')}`).catch(() => {
                                        Alert.alert(copy.callError, copy.mapError);
                                    })
                                }
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.contactActionText, { color: colors.primary }]}>
                                    {copy.addressPrefix}{report.utility_contact_address}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : null}

                {report.notes ? <NoteBlock title={copy.latestNoteTitle} value={report.notes} colors={colors} /> : null}
                {report.engineer_submission_notes ? <NoteBlock title={copy.engineerNoteTitle} value={report.engineer_submission_notes} colors={colors} /> : null}
                {report.team_leader_review_notes ? <NoteBlock title={copy.leaderNoteTitle} value={report.team_leader_review_notes} colors={colors} /> : null}
                {report.dma_review_notes ? <NoteBlock title={copy.dmaNoteTitle} value={report.dma_review_notes} colors={colors} /> : null}
            </ScrollView>

            <VideoPlayer visible={Boolean(videoPreviewUri)} videoUri={videoPreviewUri} onClose={() => setVideoPreviewUri(null)} />
        </View>
    );
}

const isVideoReference = (value?: string | null) => {
    if (!value) return false;
    return value.startsWith('data:video/') || /\.(mp4|mov|webm|m4v|3gp)(\?|$)/i.test(value);
};

const resolveVideoUri = (report?: ReportResponse | null) => {
    if (!report) return null;
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

const getUserProgressState = (status: string, language: 'sw' | 'en' = 'en') => {
    switch (status) {
        case 'new':
            return {
                badgeLabel: language === 'sw' ? 'Imepokelewa' : 'Received',
                detail: language === 'sw' ? 'Ripoti yako ya uvujaji imepokelewa na inasubiri kupewa timu ya uwanja.' : 'Your reported leakage has been received and is waiting to be assigned to a field team.',
                tone: { backgroundColor: '#e0f2fe', textColor: '#0c4a6e' },
            };
        case 'assigned':
            return {
                badgeLabel: language === 'sw' ? 'Imepewa' : 'Assigned',
                detail: language === 'sw' ? 'Timu ya uwanja imepewa kazi na itaenda kwenye eneo lililoripotiwa au kuendelea na marekebisho kama ilirudishwa.' : 'A field team has been assigned and will head to the reported location or continue rework if it was sent back.',
                tone: { backgroundColor: '#dbeafe', textColor: '#1d4ed8' },
            };
        case 'in_progress':
            return {
                badgeLabel: language === 'sw' ? 'Matengenezo Yanaendelea' : 'Repair in Progress',
                detail: language === 'sw' ? 'Wafanyakazi wa uwanja wanafanya kazi kwa bidii kwenye uvujaji uliloripotiwa.' : 'The field crew is actively working on the reported leakage.',
                tone: { backgroundColor: '#fef3c7', textColor: '#92400e' },
            };
        case 'pending_approval':
            return {
                badgeLabel: language === 'sw' ? 'Chini ya Ukaguzi wa Mwisho' : 'Under Final Review',
                detail: language === 'sw' ? 'Kazi ya matengenezo imekamilika na uvujaji uliloripotiwa unaendelea kupitia ukaguzi wa kiongozi wa timu na DMA.' : 'Repair work is complete and the reported leakage is moving through team leader and DMA review.',
                tone: { backgroundColor: '#fde68a', textColor: '#92400e' },
            };
        case 'approved':
        case 'closed':
            return {
                badgeLabel: language === 'sw' ? 'Imekamilika' : 'Resolved',
                detail: language === 'sw' ? 'Uvujaji huu uliloripotiwa umekamilika na kufungwa kwa mafanikio.' : 'This reported leakage has been completed and closed successfully.',
                tone: { backgroundColor: '#d1fae5', textColor: '#065f46' },
            };
        case 'rejected':
            return {
                badgeLabel: language === 'sw' ? 'Imerudishwa kwa Marekebisho' : 'Sent Back for Rework',
                detail: language === 'sw' ? 'Marekebisho yanahitaji kazi zaidi kabla ya kuidhinishwa kikamilifu.' : 'The repair needs more work before it can be fully approved.',
                tone: { backgroundColor: '#fee2e2', textColor: '#991b1b' },
            };
        default:
            return {
                badgeLabel: formatStatus(status),
                detail: language === 'sw' ? 'Ripoti yako ya uvujaji inaendelea kupitia mchakato wa uendeshaji.' : 'Your reported leakage is moving through the operations workflow.',
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

const DetailLine = ({
    label,
    value,
    colors,
}: {
    label: string;
    value: string;
    colors: any;
}) => (
    <View style={[styles.detailLine, { borderBottomColor: colors.border }]}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
);

const NoteBlock = ({
    title,
    value,
    colors,
}: {
    title: string;
    value: string;
    colors: any;
}) => (
    <View style={[styles.noteBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.noteTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.noteValue, { color: colors.textSecondary }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    missingText: {
        fontSize: 15,
        textAlign: 'center',
    },
    content: {
        paddingHorizontal: SCREEN_PADDING_H,
        gap: SCREEN_SECTION_GAP,
    },
    heroCard: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
        gap: 8,
    },
    trackingId: {
        fontSize: 13,
        fontWeight: '700',
    },
    description: {
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 24,
    },
    statusDetail: {
        fontSize: 13,
        lineHeight: 18,
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
    section: {
        gap: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    mediaStrip: {
        gap: 12,
    },
    mediaImage: {
        width: 160,
        height: 120,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    sectionCard: {
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 4,
    },
    detailLine: {
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 6,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    noteBlock: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        gap: 6,
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    noteValue: {
        fontSize: 13,
        lineHeight: 19,
    },
    videoActionButton: {
        marginTop: 4,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoActionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    contactActionButton: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    contactActionText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
