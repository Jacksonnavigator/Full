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
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoPlayer from '../components/VideoPlayer';
import AppHeader from '../components/AppHeader';
import { HeroHeader } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { ReportResponse } from '../services/reportService';
import {
    getLeakageTypeLabel,
    getReportClassificationLabel,
    isLeakageReport,
} from '../services/reportTypeService';

export default function ReportDetailsScreen({ route }: any) {
    const { colors } = useTheme();
    const report = route?.params?.report as ReportResponse | undefined;
    const [videoPreviewUri, setVideoPreviewUri] = useState<string | null>(null);

    const media = useMemo(() => {
        if (!report) return [];
        return report.report_photos && report.report_photos.length > 0 ? report.report_photos : report.photos || [];
    }, [report]);

    const images = media.filter((uri) => !isVideoReference(uri));
    const videoUri = resolveVideoUri(report);

    if (!report) {
        return (
            <SafeAreaView style={[styles.centerContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.missingText, { color: colors.textSecondary }]}>This reported leakage could not be opened.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <AppHeader title="Report Details" subtitle="Review your report status and utility follow-up information." />
                <HeroHeader
                    title={report.tracking_id || 'Your Report'}
                    subtitle={getUserProgressState(report.status).detail}
                    icon="assignment"
                    badge={getUserProgressState(report.status).badgeLabel}
                />

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
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Submitted evidence</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaStrip}>
                            {images.map((uri, index) => (
                                <Image key={`${uri}-${index}`} source={{ uri }} style={styles.mediaImage} />
                            ))}
                        </ScrollView>
                    </View>
                ) : null}

                {videoUri ? (
                    <View style={[styles.noteBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.noteTitle, { color: colors.text }]}>Submitted video</Text>
                        <Text style={[styles.noteValue, { color: colors.textSecondary }]}>
                            A submitted video is available for this reported leakage.
                        </Text>
                        <TouchableOpacity
                            style={[styles.videoActionButton, { backgroundColor: colors.primary }]}
                            onPress={() => setVideoPreviewUri(videoUri)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.videoActionButtonText}>Open submitted video</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <DetailLine
                        label="Report Type"
                        value={getReportClassificationLabel(report.report_type)}
                        colors={colors}
                    />
                    {isLeakageReport(report.report_type) ? (
                        <DetailLine
                            label="Leakage Type"
                            value={getLeakageTypeLabel(report.leakage_type)}
                            colors={colors}
                        />
                    ) : null}
                    <DetailLine label="Status" value={getUserProgressState(report.status).badgeLabel} colors={colors} />
                    <DetailLine label="Priority" value={formatPriorityLabel(report.priority)} colors={colors} />
                    <DetailLine
                        label="Location"
                        value={report.address || `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`}
                        colors={colors}
                    />
                    <DetailLine label="Submitted" value={formatDate(report.created_at)} colors={colors} />
                    {report.utility_name ? <DetailLine label="Utility" value={report.utility_name} colors={colors} /> : null}
                    {report.dma_name ? <DetailLine label="DMA" value={report.dma_name} colors={colors} /> : null}
                </View>

                {(report.utility_contact_phone || report.utility_contact_email || report.utility_contact_address) ? (
                    <View style={[styles.noteBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.noteTitle, { color: colors.text }]}>Utility contacts for this report</Text>
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
                                        Alert.alert('Error', 'Unable to open phone dialer');
                                    })
                                }
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.contactActionText, { color: colors.primary }]}>
                                    Call: {report.utility_contact_phone}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        {report.utility_contact_email ? (
                            <TouchableOpacity
                                style={[styles.contactActionButton, { borderColor: colors.primary }]}
                                onPress={() =>
                                    Linking.openURL(`mailto:${report.utility_contact_email}`).catch(() => {
                                        Alert.alert('Error', 'Unable to open email app');
                                    })
                                }
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.contactActionText, { color: colors.primary }]}>
                                    Email: {report.utility_contact_email}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                        {report.utility_contact_address ? (
                            <TouchableOpacity
                                style={[styles.contactActionButton, { borderColor: colors.primary }]}
                                onPress={() =>
                                    Linking.openURL(`geo:0,0?q=${encodeURIComponent(report.utility_contact_address || '')}`).catch(() => {
                                        Alert.alert('Error', 'Unable to open map');
                                    })
                                }
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.contactActionText, { color: colors.primary }]}>
                                    Address: {report.utility_contact_address}
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                ) : null}

                {report.notes ? <NoteBlock title="Latest workflow note" value={report.notes} colors={colors} /> : null}
                {report.engineer_submission_notes ? <NoteBlock title="Engineer submission note" value={report.engineer_submission_notes} colors={colors} /> : null}
                {report.team_leader_review_notes ? <NoteBlock title="Team leader review comment" value={report.team_leader_review_notes} colors={colors} /> : null}
                {report.dma_review_notes ? <NoteBlock title="DMA review decision" value={report.dma_review_notes} colors={colors} /> : null}
            </ScrollView>

            <VideoPlayer visible={Boolean(videoPreviewUri)} videoUri={videoPreviewUri} onClose={() => setVideoPreviewUri(null)} />
        </SafeAreaView>
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

const getUserProgressState = (status: string) => {
    switch (status) {
        case 'new':
            return {
                badgeLabel: 'Received',
                detail: 'Your reported leakage has been received and is waiting to be assigned to a field team.',
                tone: { backgroundColor: '#e0f2fe', textColor: '#0c4a6e' },
            };
        case 'assigned':
            return {
                badgeLabel: 'Assigned',
                detail: 'A field team has been assigned and will head to the reported location or continue rework if it was sent back.',
                tone: { backgroundColor: '#dbeafe', textColor: '#1d4ed8' },
            };
        case 'in_progress':
            return {
                badgeLabel: 'Repair in Progress',
                detail: 'The field crew is actively working on the reported leakage.',
                tone: { backgroundColor: '#fef3c7', textColor: '#92400e' },
            };
        case 'pending_approval':
            return {
                badgeLabel: 'Under Final Review',
                detail: 'Repair work is complete and the reported leakage is moving through team leader and DMA review.',
                tone: { backgroundColor: '#fde68a', textColor: '#92400e' },
            };
        case 'approved':
        case 'closed':
            return {
                badgeLabel: 'Resolved',
                detail: 'This reported leakage has been completed and closed successfully.',
                tone: { backgroundColor: '#d1fae5', textColor: '#065f46' },
            };
        case 'rejected':
            return {
                badgeLabel: 'Sent Back for Rework',
                detail: 'The repair needs more work before it can be fully approved.',
                tone: { backgroundColor: '#fee2e2', textColor: '#991b1b' },
            };
        default:
            return {
                badgeLabel: formatStatus(status),
                detail: 'Your reported leakage is moving through the operations workflow.',
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
        padding: 16,
        gap: 16,
        paddingBottom: 32,
    },
    heroCard: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 18,
        gap: 10,
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
        width: 180,
        height: 140,
        borderRadius: 14,
        resizeMode: 'cover',
    },
    sectionCard: {
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    detailLine: {
        paddingVertical: 12,
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
        borderRadius: 16,
        padding: 14,
        gap: 8,
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
