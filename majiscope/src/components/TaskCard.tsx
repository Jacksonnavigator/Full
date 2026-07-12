import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBadge } from './StatusBadge';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { getSlaLabel, getSlaState, getSlaTone } from '../utils/sla';
import { getLeakageTypeLabel, isLeakageReport } from '../services/reportTypes';

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
    reportType?: 'leakage' | 'non_leakage';
    leakageType?: string | null;
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
    const assignee = task.assignedEngineer || task.teamLeader || task.assignedTeam || 'Unassigned';
    const typeLabel = isLeakageReport(task.reportType)
        ? task.leakageType
            ? getLeakageTypeLabel(task.leakageType)
            : 'Leakage'
        : 'Non-leakage';
    const slaState = getSlaState({ slaDeadline: task.slaDeadline, backendStatus: task.backendStatus });
    const slaLabel = getSlaLabel(slaState);
    const slaTone = getSlaTone(slaState);

    return (
        <TouchableOpacity style={styles.cardWrapper} onPress={onPress} activeOpacity={0.9}>
            <LinearGradient
                colors={getPriorityGradient(task.priority) as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.priorityStrip}
            />

            <View style={styles.cardContent}>
                <View style={styles.topRow}>
                    <Text style={styles.taskId} numberOfLines={1}>
                        {task.trackingId || task.id}
                    </Text>
                    <Text style={styles.typeLabel} numberOfLines={1}>
                        {typeLabel}
                    </Text>
                </View>

                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                <Text style={styles.assignee} numberOfLines={1}>
                    {assignee}
                </Text>

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
                            <Text style={[styles.slaChipText, { color: slaTone.textColor }]}>{slaLabel}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...shadows.sm,
        overflow: 'hidden',
    },
    priorityStrip: {
        width: 4,
    },
    cardContent: {
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: 4,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
    },
    taskId: {
        flex: 1,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textSoft,
        letterSpacing: 0.3,
    },
    typeLabel: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: '#155e75',
    },
    title: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.textDark,
        lineHeight: 20,
    },
    assignee: {
        fontSize: typography.fontSize.xs,
        color: colors.textMedium,
        fontWeight: typography.fontWeight.medium,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: 4,
    },
    slaChip: {
        borderRadius: borderRadius.full,
        borderWidth: 1,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
    },
    slaChipText: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
    },
});
