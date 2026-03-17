import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';
import { getReportHistory } from '../services/ApiService';
import { WaterProblem } from '../types';

export default function HistoryScreen() {
    const [reports, setReports] = useState<WaterProblem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadReports = async () => {
        try {
            const data = await getReportHistory();
            setReports(data);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadReports();
    };

    const renderItem = ({ item }: { item: WaterProblem }) => (
        <View style={styles.card}>
            {item.image && (
                <Image source={{ uri: item.image.uri }} style={styles.image} />
            )}
            <View style={styles.cardContent}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.timestamp}>
                    {new Date(item.timestamp).toLocaleDateString()} at{' '}
                    {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
                <Text style={styles.location}>
                    📍 {item.location.latitude.toFixed(6)}, {item.location.longitude.toFixed(6)}
                </Text>
                {item.status && (
                    <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                    </View>
                )}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#1e40af" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={reports}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id || index.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No reports yet</Text>
                        <Text style={styles.emptySubtext}>Your submitted reports will appear here</Text>
                    </View>
                }
            />
        </View>
    );
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'pending':
            return { backgroundColor: '#fef3c7' };
        case 'in-progress':
            return { backgroundColor: '#dbeafe' };
        case 'resolved':
            return { backgroundColor: '#d1fae5' };
        default:
            return { backgroundColor: '#f3f4f6' };
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    description: {
        fontSize: 16,
        color: '#1f2937',
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    location: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#374151',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9ca3af',
    },
});