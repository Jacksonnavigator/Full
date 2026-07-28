import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import BrandWordmark from '../components/BrandWordmark';
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

        void fetchLocation();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerBanner}>
                    <BrandWordmark size="lg" surface="dark" />
                    <Text style={styles.bannerSubtitle}>Water Problem Reporting System</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.quickActionsSection}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.actionsGrid}>
                            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Report')}>
                                <Ionicons name="water-outline" size={30} color="#0f5fff" style={styles.actionCardIcon} />
                                <Text style={styles.actionCardTitle}>Reported Leakage</Text>
                                <Text style={styles.actionCardDesc}>Document water problems</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('History')}>
                                <Ionicons name="time-outline" size={30} color="#0f5fff" style={styles.actionCardIcon} />
                                <Text style={styles.actionCardTitle}>View History</Text>
                                <Text style={styles.actionCardDesc}>Track your reported leakage</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionTitleRow}>
                            <Ionicons name="list-outline" size={20} color="#0f5fff" />
                            <Text style={styles.sectionTitle}>How to Report</Text>
                        </View>
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
                                            ? `Location: ${currentLocation}`
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
                                    <Text style={styles.instructionTitle}>Take Photo or Video</Text>
                                    <Text style={styles.instructionText}>Document the water problem clearly.</Text>
                                </View>
                            </View>
                            <View style={styles.instructionDivider} />
                            <View style={styles.instructionItem}>
                                <View style={styles.stepCircle}>
                                    <Text style={styles.stepNumber}>3</Text>
                                </View>
                                <View style={styles.instructionContent}>
                                    <Text style={styles.instructionTitle}>Describe and Submit</Text>
                                    <Text style={styles.instructionText}>Provide the details and send the report.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoBanner}>
                        <Ionicons name="bulb-outline" size={22} color="#1e40af" style={styles.infoBannerIcon} />
                        <View style={styles.infoBannerContent}>
                            <Text style={styles.infoBannerTitle}>Pro Tip</Text>
                            <Text style={styles.infoBannerText}>
                                Capture the location first, then add photos or video so your report is easier to track.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton title="Submit Reported Leakage" onPress={() => navigation.navigate('Report')} />
                        <PrimaryButton title="View My Reported Leakage" onPress={() => navigation.navigate('History')} variant="secondary" />
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
    bannerSubtitle: {
        fontSize: 16,
        color: '#cbd5e1',
        marginTop: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    content: {
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderTopWidth: 2,
        borderTopColor: '#e2e8f0',
        paddingTop: 28,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
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
