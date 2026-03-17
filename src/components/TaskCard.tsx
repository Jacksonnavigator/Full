import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Task } from '../data/mockTasks';
import { StatusBadge } from './StatusBadge';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';

interface TaskCardProps {
    task: Task;
    onPress: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
    const getPriorityGradient = (priority: Task['priority']) => {
        switch (priority) {
            case 'High':
                return colors.gradients.danger;
            case 'Medium':
                return colors.gradients.warning;
            case 'Low':
            default:
                return colors.gradients.success;
        }
    };

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
                    <Text style={styles.taskId}>{task.id}</Text>
                    <StatusBadge label={task.priority} variant="priority" />
                </View>

                <Text style={styles.title} numberOfLines={1}>
                    {task.title}
                </Text>

                <Text style={styles.subtitle}>
                    {task.description}
                </Text>

                <View style={styles.bottomRow}>
                    <StatusBadge label={task.status} variant="status" />
                    <Text style={styles.metaText}>
                        • {task.assignedTeam ?? 'Unassigned'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.cardLight,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        marginHorizontal: spacing.md,
        ...shadows.md,
        overflow: 'hidden',
        minHeight: 150,
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
    taskId: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: typography.letterSpacing.wide,
    },
    title: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textDark,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.textDark,
        marginBottom: spacing.md,
        marginTop: spacing.xs,
        lineHeight: 20,
        fontWeight: '400',
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
    }
});
