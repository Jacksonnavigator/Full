import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from './StatusBadge';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { getSlaLabel, getSlaState, getSlaTone } from '../utils/sla';

interface TaskCardData {
    id: string;
    trackingId?: string;
    title?: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: string;
    assignedTeam?: string;
    teamLeader?: string;
    assignedEngineer?: string;
    backendStatus?: string;
    slaDeadline?: string;
}

interface TaskCardProps {
    task: TaskCardData;
    onPress: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
    const getPriorityGradient = (priority: TaskCardData['priority']) => {
        switch (priority) {
            case 'Critical':
                return ['#7f1d1d', '#b91c1c'];
            case 'High':
                return ['#dc2626', '#f97316'];
            case 'Medium':
                return ['#f59e0b', '#fbbf24'];
            case 'Low':
            default:
                return ['#0f766e', '#14b8a6'];
        }
    };

    const title = task.title?.trim() || task.trackingId || task.id;
    const teamLabel = task.assignedTeam || task.teamLeader || task.assignedEngineer || 'Unassigned';
    const assigneeLabel = task.assignedEngineer || task.teamLeader || 'Field team';
    const slaState = getSlaState({ slaDeadline: task.slaDeadline, backendStatus: task.backendStatus });
    const slaLabel = getSlaLabel(slaState);
    const slaTone = getSlaTone(slaState);

    return (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <LinearGradient
                colors={getPriorityGradient(task.priority) as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.priorityStrip}
            />

            <View style={styles.cardContent}>
                <View style={styles.topRow}>
                    <View style={styles.referenceWrap}>
                        <Text style={styles.taskId}>{task.trackingId || task.id}</Text>
                        <View style={styles.tapHint}>
                            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                        </View>
                    </View>
                    <StatusBadge label={task.priority} variant="priority" />
                </View>

                <Text style={styles.title} numberOfLines={1}>
                    {title}
                </Text>

                <Text style={styles.subtitle} numberOfLines={2}>
                    {task.description}
                </Text>

                <View style={styles.infoStrip}>
                    <View style={styles.infoChip}>
                        <Ionicons name="people-outline" size={14} color={colors.primaryDark} />
                        <Text style={styles.infoChipText} numberOfLines={1}>
                            {teamLabel}
                        </Text>
                    </View>
                    <View style={styles.infoChip}>
                        <Ionicons name="person-outline" size={14} color={colors.primaryDark} />
                        <Text style={styles.infoChipText} numberOfLines={1}>
                            {assigneeLabel}
                        </Text>
                    </View>
                </View>

                <View style={styles.bottomRow}>
                    <StatusBadge label={task.status} variant="status" />
                    {slaLabel ? (
                        <View
                            style={[
                                styles.slaChip,
                                {
                                    backgroundColor: slaTone.backgroundColor,
                                    borderColor: slaTone.borderColor,
                                },
                            ]}
                        >
                            <Text style={[styles.slaChipText, { color: slaTone.textColor }]}>
                                {slaLabel}
                            </Text>
                        </View>
                    ) : null}
                    <Text style={styles.metaText} numberOfLines={1}>
                        Open task details
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...shadows.sm,
        overflow: 'hidden',
        minHeight: 156,
    },
    priorityStrip: {
        width: 6,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        justifyContent: 'flex-start',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    referenceWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        flex: 1,
        paddingRight: spacing.sm,
    },
    taskId: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textSoft,
        textTransform: 'uppercase',
        letterSpacing: typography.letterSpacing.wide,
    },
    tapHint: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textDark,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.textMedium,
        marginBottom: spacing.md,
        marginTop: spacing.xs,
        lineHeight: 20,
        fontWeight: '400',
    },
    infoStrip: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    infoChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: borderRadius.full,
        backgroundColor: '#f8fbff',
        borderWidth: 1,
        borderColor: '#dbeafe',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs + 2,
    },
    infoChipText: {
        flex: 1,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textMedium,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginTop: 'auto',
    },
    metaText: {
        fontSize: typography.fontSize.xs,
        color: colors.textMuted,
        fontWeight: typography.fontWeight.medium,
    },
    slaChip: {
        borderRadius: borderRadius.full,
        borderWidth: 1,
        paddingHorizontal: spacing.sm,
        paddingVertical: 5,
    },
    slaChipText: {
        fontSize: 11,
        fontWeight: typography.fontWeight.bold,
    },
});
