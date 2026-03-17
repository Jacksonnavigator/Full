import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Platform,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// NEW: Import new architecture components
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@/hooks/useQuery';
import { TaskService } from '@/services/api/tasks';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { TaskCard } from '../components/TaskCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, typography, borderRadius, spacing, shadows, fontWeight } from '../theme';
import { useTaskStore } from '../store/taskStore';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;
type Filter = 'All' | 'Assigned' | 'In Progress' | 'Submitted by Engineer';

const FILTERS: Filter[] = ['All', 'Assigned', 'In Progress', 'Submitted by Engineer'];

const FILTER_ICONS = {
    'All': '📋',
    'Assigned': '📎',
    'In Progress': '🔧',
    'Submitted by Engineer': '✅',
};

const FILTER_SHORT = {
    'All': 'All',
    'Assigned': 'Assigned',
    'In Progress': 'In Progress',
    'Submitted by Engineer': 'Submitted',
};

const STATUS_CONFIG = [
    { status: 'assigned', label: 'Assigned', icon: 'clipboard-outline', accent: '#3b82f6', bg: '#eff6ff' },
    { status: 'in_progress', label: 'In Progress', icon: 'construct-outline', accent: '#f59e0b', bg: '#fffbeb' },
    { status: 'submitted', label: 'Submitted', icon: 'checkmark-circle-outline', accent: '#10b981', bg: '#ecfdf5' },
];

export const TaskListScreen: React.FC<Props> = ({ navigation }) => {
    const { currentUser } = useAuth();
    const [filter, setFilter] = useState<Filter>('All');

    // Animation refs
    const headerAnim = useRef(new Animated.Value(0)).current;
    const cardsAnim = useRef(new Animated.Value(0)).current;

    // Animation effect
    useEffect(() => {
        Animated.stagger(150, [
            Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
            Animated.spring(cardsAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
        ]).start();
    }, []);

    // NEW: Use useQuery hook for data fetching with caching
    const {
        data: tasks,
        isLoading,
        error,
        refetch
    } = useQuery(
        ['tasks', currentUser?.id], // Cache key includes user ID
        () => TaskService.getTasks({
            user_id: currentUser?.id,
            limit: 50
        }),
        {
            enabled: !!currentUser, // Only fetch when user is authenticated
        }
    ) as { data: Task[] | undefined, isLoading: boolean, error: any, refetch: () => void };
    // NEW: Filter tasks based on selected filter
    const filteredTasks = useMemo(() => {
        if (!tasks) return [];

        if (filter === 'All') return tasks;

        // Map filter names to API status values
        const statusMap = {
            'Assigned': 'assigned',
            'In Progress': 'in_progress',
            'Submitted by Engineer': 'submitted'
        };

        return tasks.filter(task => task.status === statusMap[filter as keyof typeof statusMap]);
    }, [tasks, filter]);

    // NEW: Calculate statistics
    const counts = useMemo(() => {
        if (!tasks) return { assigned: 0, in_progress: 0, submitted: 0 };

        return tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [tasks]);

    const totalTasks = tasks?.length || 0;
    const completionPct = totalTasks === 0 ? 0 : Math.round(((counts.submitted || 0) / totalTasks) * 100);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}

                /* ══════════ LIST HEADER ══════════ */
                ListHeaderComponent={
                    <>
                        {/* ── HERO ── */}
                        <Animated.View
                            style={{
                                opacity: headerAnim,
                                transform: [{
                                    translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
                                }],
                            }}
                        >
                            <LinearGradient
                                colors={['#06b6d4', '#2563eb', '#0f5fff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.heroCard}
                            >
                                {/* Decorative circles */}
                                <View style={styles.decCircle1} />
                                <View style={styles.decCircle2} />

                                <View style={styles.heroTop}>
                                    <View style={{ flex: 1, marginRight: 12 }}>
                                        <Text style={styles.heroEyebrow}>
                                            {currentUser?.role === 'Team Leader' ? 'Team Leader' : 'Field Engineer'}
                                        </Text>
                                        <Text style={styles.heroTitle}>Today's Workload</Text>
                                        <Text style={styles.heroSubtitle}>
                                            {currentUser?.team ?? 'Your team'} · {today}
                                        </Text>
                                    </View>
                                    <View style={styles.heroBadge}>
                                        <Text style={styles.heroBadgeNumber}>{filteredTasks.length}</Text>
                                        <Text style={styles.heroBadgeLabel}>tasks</Text>
                                    </View>
                                </View>

                                {/* Progress bar */}
                                <View style={styles.progressSection}>
                                    <View style={styles.progressLabelRow}>
                                        <Text style={styles.progressLabel}>Overall completion</Text>
                                        <Text style={styles.progressPct}>{completionPct}%</Text>
                                    </View>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${completionPct}%` as any }]} />
                                    </View>
                                </View>
                            </LinearGradient>
                        </Animated.View>

                        {/* ── STAT CARDS + FILTERS ── */}
                        <Animated.View
                            style={{
                                opacity: cardsAnim,
                                transform: [{
                                    translateY: cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
                                }],
                            }}
                        >
                            {/* Stat cards */}
                            <View style={styles.statsRow}>
                                {STATUS_CONFIG.map(({ status, label, icon, accent, bg }) => {
                                    const count = counts[status as keyof typeof counts];
                                    const pct = totalTasks === 0 ? 0 : (count / totalTasks) * 100;
                                    const isActive = filter === label;
                                    return (
                                        <TouchableOpacity
                                            key={status}
                                            style={[styles.statCard, isActive && { borderColor: accent }]}
                                            onPress={() => setFilter(isActive ? 'All' : label)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={[styles.statIconWrap, { backgroundColor: bg }]}>
                                                <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={accent} />
                                            </View>
                                            <Text style={[styles.statCount, { color: accent }]}>{count}</Text>
                                            <Text style={styles.statLabel}>{label}</Text>
                                            <View style={styles.statBarTrack}>
                                                <View style={[styles.statBarFill, { width: `${pct}%` as any, backgroundColor: accent }]} />
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Filter pills — horizontal scroll to match LeaderTeamTasksScreen */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filterScroll}
                            >
                                {FILTERS.map((value) => {
                                    const selected = filter === value;
                                    const count = value === 'All' ? totalTasks : (counts[value as keyof typeof counts] ?? 0);
                                    return (
                                        <TouchableOpacity
                                            key={value}
                                            style={[styles.pill, selected && styles.pillSelected]}
                                            onPress={() => setFilter(value)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.pillIcon}>{FILTER_ICONS[value]}</Text>
                                            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                                                {FILTER_SHORT[value]}
                                            </Text>
                                            <View style={[styles.pillCount, selected && styles.pillCountSelected]}>
                                                <Text style={[styles.pillCountText, selected && styles.pillCountTextSelected]}>
                                                    {count}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            {/* Section label */}
                            <View style={styles.sectionLabelRow}>
                                <Text style={styles.sectionLabel}>
                                    {filter === 'All' ? 'All Tasks' : FILTER_SHORT[filter]}
                                </Text>
                                <Text style={styles.sectionCount}>{filteredTasks.length} tasks</Text>
                            </View>
                        </Animated.View>
                    </>
                }

                /* ══════════ LIST ITEMS ══════════ */
                renderItem={({ item, index }) => {
                    const itemAnim = new Animated.Value(0);
                    Animated.timing(itemAnim, {
                        toValue: 1,
                        duration: 300,
                        delay: index * 60,
                        useNativeDriver: true,
                    }).start();
                    return (
                        <Animated.View
                            style={{
                                opacity: itemAnim,
                                transform: [{
                                    translateX: itemAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
                                }],
                            }}
                        >
                            <TaskCard
                                task={item}
                                onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
                            />
                        </Animated.View>
                    );
                }}

                /* ══════════ EMPTY STATE ══════════ */
                ListEmptyComponent={
                    <View style={styles.emptyWrap}>
                        <View style={styles.emptyCircle}>
                            <Text style={styles.emptyEmoji}></Text>
                        </View>
                        <Text style={styles.emptyTitle}>Nothing here</Text>
                        <Text style={styles.emptyBody}>
                            No tasks match this filter. Switch to a different status or reset the view.
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyBtn}
                            onPress={() => setFilter('All')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.emptyBtnText}>Show all tasks</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

/* ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        paddingBottom: 40,
    },

    // ── Hero ──
    heroCard: {
        paddingHorizontal: 22,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 20 : 20,
        paddingBottom: 28,
        overflow: 'hidden',
    },
    decCircle1: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: colors.primary + '08',
        top: -70,
        right: -60,
    },
    decCircle2: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: colors.primary + '1a',
        bottom: -30,
        left: 10,
    },
    heroTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    heroEyebrow: {
        fontSize: 11,
        color: colors.primary,
        fontWeight: fontWeight.bold,
        letterSpacing: 1,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: fontWeight.bold,
        color: colors.foreground,
        letterSpacing: -0.5,
    },
    heroSubtitle: {
        fontSize: 13,
        color: colors.mutedForeground,
        marginTop: 5,
        fontWeight: fontWeight.medium,
    },
    heroBadge: {
        backgroundColor: colors.secondary,
        borderRadius: 18,
        paddingHorizontal: 18,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    heroBadgeNumber: {
        fontSize: 30,
        fontWeight: fontWeight.bold,
        color: colors.primary,
        lineHeight: 34,
    },
    heroBadgeLabel: {
        fontSize: 10,
        color: colors.mutedForeground,
        fontWeight: fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    progressSection: { gap: 8 },
    progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
    progressLabel: { fontSize: 12, color: colors.mutedForeground, fontWeight: fontWeight.semibold },
    progressPct: { fontSize: 12, color: colors.foreground, fontWeight: fontWeight.bold },
    progressTrack: {
        height: 6,
        backgroundColor: colors.border,
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.chart2,
        borderRadius: 999,
    },

    // ── Stat cards ──
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 6,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: 12,
        alignItems: 'center',
        gap: 4,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    statIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    statIcon: { fontSize: 18 },
    statCount: { fontSize: 26, fontWeight: fontWeight.bold, lineHeight: 30, color: colors.foreground },
    statLabel: {
        fontSize: 9,
        color: colors.mutedForeground,
        fontWeight: fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
    statBarTrack: {
        width: '100%',
        height: 3,
        backgroundColor: colors.border,
        borderRadius: 999,
        marginTop: 6,
        overflow: 'hidden',
    },
    statBarFill: { height: '100%', borderRadius: 999 },

    // ── Filter pills (horizontal scroll — matches LeaderTeamTasksScreen) ──
    filterScroll: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 999,
        backgroundColor: colors.card,
        borderWidth: 1.5,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    pillSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    pillIcon: { fontSize: 13 },
    pillText: { fontSize: 13, color: colors.mutedForeground, fontWeight: fontWeight.semibold },
    pillTextSelected: { color: colors.primaryForeground, fontWeight: fontWeight.bold },
    pillCount: {
        backgroundColor: colors.secondary,
        borderRadius: 999,
        minWidth: 20,
        height: 20,
        paddingHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillCountSelected: { backgroundColor: colors.primary + '40' },
    pillCountText: { fontSize: 11, fontWeight: fontWeight.bold, color: colors.mutedForeground },
    pillCountTextSelected: { color: colors.primaryForeground },

    // ── Section label ──
    sectionLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        marginBottom: 10,
    },
    sectionLabel: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
    sectionCount: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },

    // ── Empty state ──
    emptyWrap: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
        gap: 10,
    },
    emptyCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: 6,
    },
    emptyEmoji: { fontSize: 36 },
    emptyTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
    emptyBody: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 19,
    },
    emptyBtn: {
        marginTop: 8,
        backgroundColor: '#0f172a',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 999,
    },
    emptyBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});