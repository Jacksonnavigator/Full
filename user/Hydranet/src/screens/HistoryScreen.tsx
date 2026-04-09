import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getReportHistory } from '../services/ApiService';
import { ReportResponse } from '../services/reportService';

type UserProgressState = {
    badgeLabel: string;
    detail: string;
    activeStep: number;
    tone: {
        backgroundColor: string;
        textColor: string;
    };
};

const PROGRESS_STEPS = ['Reported', 'Assigned', 'Repair', 'Resolved'];

export default function HistoryScreen() {
    const { colors } = useTheme();
    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadReports = useCallback(async () => {
        try {
            const data = await getReportHistory();
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

    const renderItem = ({ item }: { item: ReportResponse }) => {
        const coverPhoto = item.photos?.[0];
        const progress = getUserProgressState(item.status);
        const showVideoPlaceholder =
            item.primary_media_type === 'video' ||
            (coverPhoto ? coverPhoto.startsWith('data:video/') : false);

        return (
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}>
                {coverPhoto && !showVideoPlaceholder ? (
                    <Image source={{ uri: coverPhoto }} style={styles.image} />
                ) : showVideoPlaceholder ? (
                    <View style={[styles.imagePlaceholder, styles.videoPlaceholder, { backgroundColor: colors.surface }]}>
                        <Text style={styles.videoPlaceholderIcon}>VIDEO</Text>
                        <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
                            Video evidence submitted
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
                    <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>{progress.detail}</Text>
                    <View style={styles.progressRow}>
                        {PROGRESS_STEPS.map((step, index) => {
                            const isActive = index <= progress.activeStep;
                            const isCurrent = index === progress.activeStep;
                            return (
                                <View key={step} style={styles.progressStep}>
                                    <View
                                        style={[
                                            styles.progressDot,
                                            {
                                                backgroundColor: isActive ? colors.primary : colors.surface,
                                                borderColor: isCurrent ? colors.primary : colors.border,
                                            },
                                        ]}
                                    />
                                    {index < PROGRESS_STEPS.length - 1 && (
                                        <View
                                            style={[
                                                styles.progressLine,
                                                { backgroundColor: index < progress.activeStep ? colors.primary : colors.border },
                                            ]}
                                        />
                                    )}
                                    <Text
                                        style={[
                                            styles.progressLabel,
                                            { color: isActive ? colors.text : colors.textSecondary },
                                        ]}
                                    >
                                        {step}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                    <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                        Submitted {formatDate(item.created_at)}
                    </Text>
                    <Text style={[styles.location, { color: colors.textSecondary }]}>
                        {item.address || `${item.latitude.toFixed(6)}, ${item.longitude.toFixed(6)}`}
                    </Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>
                        Priority: {item.priority}
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
                </View>
            </View>
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No reports yet</Text>
                        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                            Your submitted reports will appear here after you send your first one.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const getUserProgressState = (status: string): UserProgressState => {
    switch (status) {
        case 'new':
            return {
                badgeLabel: 'Received',
                detail: 'Your report has been received and is waiting to be assigned to a field team.',
                activeStep: 0,
                tone: { backgroundColor: '#e0f2fe', textColor: '#0c4a6e' },
            };
        case 'assigned':
            return {
                badgeLabel: 'Assigned',
                detail: 'A field team has been assigned and will head to the reported location.',
                activeStep: 1,
                tone: { backgroundColor: '#dbeafe', textColor: '#1d4ed8' },
            };
        case 'in_progress':
            return {
                badgeLabel: 'Repair in Progress',
                detail: 'The field crew is actively working on the leakage report.',
                activeStep: 2,
                tone: { backgroundColor: '#fef3c7', textColor: '#92400e' },
            };
        case 'pending_approval':
            return {
                badgeLabel: 'Awaiting Final Approval',
                detail: 'Repair work is done and the report is being reviewed for final approval.',
                activeStep: 2,
                tone: { backgroundColor: '#fde68a', textColor: '#92400e' },
            };
        case 'approved':
        case 'closed':
            return {
                badgeLabel: 'Resolved',
                detail: 'This report has been completed and closed successfully.',
                activeStep: 3,
                tone: { backgroundColor: '#d1fae5', textColor: '#065f46' },
            };
        case 'rejected':
            return {
                badgeLabel: 'Sent Back for Rework',
                detail: 'The repair needs more work before it can be fully approved.',
                activeStep: 1,
                tone: { backgroundColor: '#fee2e2', textColor: '#991b1b' },
            };
        default:
            return {
                badgeLabel: formatStatus(status),
                detail: 'Your report is moving through the operations workflow.',
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

const formatDate = (value: string) => {
    const date = new Date(value);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
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
        flexGrow: 1,
    },
    card: {
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
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
    statusDetail: {
        fontSize: 13,
        lineHeight: 18,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: 2,
    },
    progressStep: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        zIndex: 2,
    },
    progressLine: {
        position: 'absolute',
        top: 5,
        left: '55%',
        right: '-45%',
        height: 2,
        zIndex: 1,
    },
    progressLabel: {
        marginTop: 8,
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
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
});
