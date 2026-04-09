import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import PrimaryButton from '../components/PrimaryButton';
import ImagePicker from '../components/ImagePicker';
import { getLocation, getLocationName, getLocationDetails } from '../services/LocationService';
import { submitWaterProblem } from '../services/ApiService';
import { ImageResult, Coordinates } from '../types';

export default function ReportScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<ImageResult | null>(null);
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [priority, setPriority] = useState<'urgent' | 'moderate' | null>(null);

    const handleGetLocation = async () => {
        setGettingLocation(true);
        try {
            const coords = await getLocation();
            setLocation(coords);

            const areaName = await getLocationName(coords.latitude, coords.longitude);
            setLocationName(areaName);

            const locationDetails = await getLocationDetails(coords.latitude, coords.longitude);
            setDistrict(locationDetails.district || null);
        } catch (error: any) {
            Alert.alert('Location Error', error.message);
        } finally {
            setGettingLocation(false);
        }
    };

    const handleImageSelected = (selectedImage: ImageResult) => {
        if (!location) {
            Alert.alert(
                'Location Required',
                'Please capture your GPS location first before adding media.'
            );
            return;
        }

        setImage(selectedImage);
        Alert.alert(
            'Select Priority Level',
            'How urgent is this water problem?',
            [
                {
                    text: 'Urgently',
                    onPress: () => setPriority('urgent'),
                    style: 'destructive',
                },
                {
                    text: 'Moderate',
                    onPress: () => setPriority('moderate'),
                },
            ]
        );
    };

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert('Validation Error', 'Please provide a description.');
            return;
        }

        if (!location) {
            Alert.alert('Validation Error', 'Please capture your location.');
            return;
        }

        if (!image) {
            Alert.alert('Validation Error', 'Please add a photo or video of the water problem.');
            return;
        }

        if (!priority) {
            Alert.alert('Validation Error', 'Please select a priority level for this report.');
            return;
        }

        setLoading(true);
        try {
            const report = await submitWaterProblem({
                description: description.trim(),
                location,
                image,
                priority,
                timestamp: new Date(),
            });

            Alert.alert(
                'Success',
                `Water problem reported successfully.\n\nTracking ID: ${report.tracking_id || 'pending'}`,
                [
                    {
                        text: 'View Reports',
                        onPress: () => {
                            setDescription('');
                            setImage(null);
                            setLocation(null);
                            setLocationName(null);
                            setDistrict(null);
                            setPriority(null);
                            navigation.navigate('History');
                        },
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Submission Error', error.message || 'Failed to submit report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <Text style={[styles.title, { color: colors.primary }]}>Report Water Leakage</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Capture the location, attach a clear photo or short video, and send the issue to the utility team.
                        </Text>

                        <View style={styles.stepIndicator}>
                            {renderStep(1, 'Location', !!location, colors.primary)}
                            <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
                            {renderStep(2, 'Media', !!image, colors.primary)}
                            <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
                            {renderStep(3, 'Priority', !!priority, colors.primary)}
                            <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
                            {renderStep(4, 'Describe', !!description.trim(), colors.primary)}
                        </View>

                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.labelContainer}>
                                <Text style={[styles.label, { color: colors.text }]}>Step 1: Capture GPS Location</Text>
                                {!location && (
                                    <View style={styles.requiredBadge}>
                                        <Text style={styles.requiredText}>REQUIRED FIRST</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                                Capture your current position so the report can be routed to the right DMA and utility team.
                            </Text>
                            <PrimaryButton
                                title={location ? 'Location Captured' : 'Get Current Location'}
                                onPress={handleGetLocation}
                                loading={gettingLocation}
                                variant={location ? 'secondary' : 'primary'}
                            />
                            {location && (
                                <View style={styles.locationInfo}>
                                    {locationName && (
                                        <Text style={styles.locationNameText}>{locationName}</Text>
                                    )}
                                    <Text style={styles.locationText}>
                                        District: {district || 'Detecting...'}
                                    </Text>
                                    <Text style={styles.locationText}>
                                        Latitude: {location.latitude.toFixed(6)}
                                    </Text>
                                    <Text style={styles.locationText}>
                                        Longitude: {location.longitude.toFixed(6)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={[styles.section, !location && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                            <View style={styles.labelContainer}>
                                <Text style={[styles.label, { color: colors.text }, !location && styles.labelDisabled]}>
                                    Step 2: Add Photo or Video
                                </Text>
                                {!location && (
                                    <View style={styles.lockedBadge}>
                                        <Text style={styles.lockedText}>LOCKED</Text>
                                    </View>
                                )}
                            </View>
                            {!location && (
                                <Text style={styles.warningText}>
                                    Capture GPS location first to unlock media selection.
                                </Text>
                            )}
                            <ImagePicker
                                image={image}
                                onImageSelected={handleImageSelected}
                                disabled={!location}
                                allowVideo={true}
                            />
                        </View>

                        <View style={[styles.section, !image && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                            <View style={styles.labelContainer}>
                                <Text style={[styles.label, { color: colors.text }, !image && styles.labelDisabled]}>
                                    Step 3: Select Priority
                                </Text>
                                {priority && (
                                    <View
                                        style={[
                                            styles.priorityBadge,
                                            priority === 'urgent' ? styles.priorityBadgeUrgent : styles.priorityBadgeModerate,
                                        ]}
                                    >
                                        <Text style={styles.priorityBadgeText}>
                                            {priority === 'urgent' ? 'Urgent' : 'Moderate'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {!image && (
                                <Text style={styles.warningText}>
                                    Add media first to choose the report priority.
                                </Text>
                            )}
                            {image && (
                                <View style={styles.priorityContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.priorityButton,
                                            priority === 'urgent' && styles.priorityButtonActive,
                                            priority === 'urgent' && styles.priorityButtonUrgent,
                                        ]}
                                        onPress={() => setPriority('urgent')}
                                    >
                                        <Text style={styles.priorityButtonText}>Urgently</Text>
                                        <Text style={styles.priorityButtonSubtext}>Needs quick attention</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.priorityButton,
                                            priority === 'moderate' && styles.priorityButtonActive,
                                            priority === 'moderate' && styles.priorityButtonModerate,
                                        ]}
                                        onPress={() => setPriority('moderate')}
                                    >
                                        <Text style={styles.priorityButtonText}>Moderate</Text>
                                        <Text style={styles.priorityButtonSubtext}>Important but not critical</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <Text style={[styles.label, { color: colors.text }]}>Step 4: Description</Text>
                            <TextInput
                                style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                                placeholder="Describe the water problem, for example pipe burst, water leakage, or contamination."
                                placeholderTextColor={colors.textSecondary}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.submitSection}>
                            <PrimaryButton
                                title="Submit Report"
                                onPress={handleSubmit}
                                loading={loading}
                                disabled={!description.trim() || !location || !image || !priority}
                            />
                            {(!description.trim() || !location || !image || !priority) && (
                                <Text style={styles.submitHint}>Complete all steps to submit your report.</Text>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function renderStep(step: number, label: string, active: boolean, primary: string) {
    return (
        <View style={styles.stepItem}>
            <View style={[styles.stepCircle, active && { backgroundColor: primary }]}>
                <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>{step}</Text>
            </View>
            <Text style={styles.stepText}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        paddingHorizontal: 10,
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.55)',
    },
    stepItem: {
        alignItems: 'center',
        flex: 1,
    },
    stepCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepNumber: {
        fontSize: 17,
        fontWeight: '700',
        color: '#9ca3af',
    },
    stepNumberActive: {
        color: '#fff',
    },
    stepText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    stepLine: {
        flex: 1,
        height: 2,
        marginHorizontal: 4,
    },
    section: {
        marginBottom: 24,
        padding: 18,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    sectionDisabled: {
        opacity: 0.6,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
    },
    labelDisabled: {
        color: '#9ca3af',
    },
    requiredBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },
    requiredText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#b45309',
    },
    lockedBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
    },
    lockedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#b91c1c',
    },
    helpText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 14,
    },
    warningText: {
        fontSize: 13,
        color: '#b91c1c',
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
    },
    locationInfo: {
        marginTop: 14,
        backgroundColor: '#ecfdf5',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#a7f3d0',
        gap: 4,
    },
    locationNameText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#065f46',
    },
    locationText: {
        fontSize: 13,
        color: '#047857',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    priorityButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
        alignItems: 'center',
    },
    priorityButtonActive: {
        backgroundColor: '#f0f7ff',
    },
    priorityButtonUrgent: {
        borderColor: '#dc2626',
    },
    priorityButtonModerate: {
        borderColor: '#d97706',
    },
    priorityButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    priorityButtonSubtext: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    priorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    priorityBadgeUrgent: {
        backgroundColor: '#fee2e2',
    },
    priorityBadgeModerate: {
        backgroundColor: '#fef3c7',
    },
    priorityBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1f2937',
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        minHeight: 120,
    },
    submitSection: {
        marginTop: 12,
        marginBottom: 36,
    },
    submitHint: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 10,
    },
});
