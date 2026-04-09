import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { getLocation, getLocationName } from '../services/LocationService';

export default function HomeScreen({ navigation }: any) {
    const [currentLocation, setCurrentLocation] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setIsLoadingLocation(true);
                const coords = await getLocation();
                const locationName = await getLocationName(coords.latitude, coords.longitude);
                setCurrentLocation(locationName);
            } catch (error) {
                console.log('Location detection skipped or failed');
                setCurrentLocation(null);
            } finally {
                setIsLoadingLocation(false);
            }
        };

        fetchLocation();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Banner */}
                <View style={styles.headerBanner}>
                    <Text style={styles.bannerTitle}>🌊 HydraNet</Text>
                    <Text style={styles.bannerSubtitle}>Water Problem Reporting System</Text>
                    <View style={styles.bannerUnderline} />
                </View>

                <View style={styles.content}>
                    {/* Quick Action Cards */}
                    <View style={styles.quickActionsSection}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.actionsGrid}>
                            <TouchableOpacity
                                style={styles.actionCard}
                                onPress={() => navigation.navigate('Report')}
                            >
                                <Text style={styles.actionCardIcon}>📍</Text>
                                <Text style={styles.actionCardTitle}>Report Issue</Text>
                                <Text style={styles.actionCardDesc}>Document water problems</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionCard}
                                onPress={() => navigation.navigate('History')}
                            >
                                <Text style={styles.actionCardIcon}>📊</Text>
                                <Text style={styles.actionCardTitle}>View History</Text>
                                <Text style={styles.actionCardDesc}>Track your reports</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Instructions Card */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 How to Report</Text>
                        <View style={styles.instructionsCard}>
                            <View style={styles.instructionItem}>
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>1</Text>
                                </View>
                                <View style={styles.instructionContent}>
                                    <Text style={styles.instructionTitle}>Capture GPS Location</Text>
                                    <Text style={styles.instructionText}>
                                        {isLoadingLocation 
                                            ? 'Detecting location...' 
                                            : currentLocation 
                                            ? `📍 ${currentLocation}` 
                                            : 'Get your current coordinates'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.instructionDivider} />
                            <View style={styles.instructionItem}>
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>2</Text>
                                </View>
                                <View style={styles.instructionContent}>
                                    <Text style={styles.instructionTitle}>Take Photo/Video</Text>
                                    <Text style={styles.instructionText}>Document the water problem</Text>
                                </View>
                            </View>
                            <View style={styles.instructionDivider} />
                            <View style={styles.instructionItem}>
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>3</Text>
                                </View>
                                <View style={styles.instructionContent}>
                                    <Text style={styles.instructionTitle}>Describe & Submit</Text>
                                    <Text style={styles.instructionText}>Provide details about the issue</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Text style={styles.infoBannerIcon}>💡</Text>
                        <View style={styles.infoBannerContent}>
                            <Text style={styles.infoBannerTitle}>Pro Tip</Text>
                            <Text style={styles.infoBannerText}>Location capture is required before adding media to ensure accurate tracking</Text>
                        </View>
                    </View>

                    {/* Main Buttons */}
                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            title="🚨 Report Water Leakage"
                            onPress={() => navigation.navigate('Report')}
                        />
                        <PrimaryButton
                            title="📋 View My Reports"
                            onPress={() => navigation.navigate('History')}
                            variant="secondary"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    headerBanner: {
        backgroundColor: '#0f172a',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 28,
        alignItems: 'center',
        borderBottomWidth: 5,
        borderBottomColor: '#10b981',
    },
    bannerTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 2,
    },
    bannerSubtitle: {
        fontSize: 16,
        color: '#cbd5e1',
        marginBottom: 16,
        fontWeight: '500',
    },
    bannerUnderline: {
        width: 60,
        height: 3,
        backgroundColor: '#10b981',
        borderRadius: 2,
    },
    content: {
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderTopWidth: 2,
        borderTopColor: '#e2e8f0',
        paddingTop: 28,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    quickActionsSection: {
        marginBottom: 32,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    actionCardIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    actionCardDesc: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 16,
    },
    section: {
        marginBottom: 28,
    },
    instructionsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: '#10b981',
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingVertical: 8,
    },
    instructionDivider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginBottom: 16,
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#dbeafe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        shadowColor: '#1e40af',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    stepNumber: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e40af',
    },
    instructionContent: {
        flex: 1,
        paddingTop: 2,
    },
    instructionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    instructionText: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#f0f7ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: '#dbeafe',
        alignItems: 'flex-start',
    },
    infoBannerIcon: {
        fontSize: 24,
        marginRight: 12,
        marginTop: 2,
    },
    infoBannerContent: {
        flex: 1,
    },
    infoBannerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: 4,
    },
    infoBannerText: {
        fontSize: 13,
        color: '#0c4a6e',
        lineHeight: 18,
    },
    buttonContainer: {
        gap: 12,
    },
});
