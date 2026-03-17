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
import VideoPlayer from '../components/VideoPlayer';
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
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [videoToPlay, setVideoToPlay] = useState<ImageResult | null>(null);


    const handleGetLocation = async () => {
        setGettingLocation(true);
        try {
            const coords = await getLocation();
            setLocation(coords);
            
            // Get the location name (area/address)
            const areaName = await getLocationName(coords.latitude, coords.longitude);
            setLocationName(areaName);

            // Get detailed location info including district
            const locationDetails = await getLocationDetails(coords.latitude, coords.longitude);
            
            // Always set district (even if undefined/null)
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
                'Please capture your GPS location first before adding media.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Validate video
        if (selectedImage.mediaType === 'video' && selectedImage.duration && selectedImage.duration > 60000) {
            Alert.alert('Video Too Long', 'Please select a video clip under 60 seconds.');
            return;
        }

        setImage(selectedImage);

        // Show compression warning if needed
        let compressionMessage = 'How urgent is this water problem?';
        if (selectedImage.requiresServerCompression) {
            compressionMessage = 'How urgent is this water problem?\n\n⚙️ Note: This video will be automatically compressed during upload to meet the 10MB size limit.';
        }
        
        // Show priority selection alert
        Alert.alert(
            'Select Priority Level',
            compressionMessage,
            [
                {
                    text: '🚨 Urgently',
                    onPress: () => setPriority('urgent'),
                    style: 'destructive',
                },
                {
                    text: '⚠️ Moderate',
                    onPress: () => setPriority('moderate'),
                },
            ]
        );
    };

    const handleVideoPlay = (video: ImageResult) => {
        setVideoToPlay(video);
        setShowVideoPlayer(true);
    };

    const handleVideoPlayerClose = () => {
        setShowVideoPlayer(false);
        setVideoToPlay(null);
    };

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert('Validation Error', 'Please provide a description');
            return;
        }

        if (!location) {
            Alert.alert('Validation Error', 'Please capture your location');
            return;
        }

        if (!image) {
            Alert.alert('Validation Error', 'Please add a photo or video of the water problem');
            return;
        }

        if (!priority) {
            Alert.alert('Validation Error', 'Please select a priority level for this report');
            return;
        }

        setLoading(true);
        try {
            await submitWaterProblem({
                description: description.trim(),
                location,
                image: image,
                priority: priority,
                timestamp: new Date(),
            });

            Alert.alert(
                'Success',
                'Water problem reported successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setDescription('');
                            setImage(null);
                            setLocation(null);
                            setLocationName(null);
                            setDistrict(null);
                            setPriority(null);
                            navigation.goBack();
                        },
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Submission Error', error.message || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: colors.background }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: colors.primary }]}>Report Water Leakage </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Help us maintain water infrastructure</Text>

                    {/* Step indicator */}
                    <View style={styles.stepIndicator}>
                        <View style={styles.stepItem}>
                            <View style={[styles.stepCircle, location && { backgroundColor: colors.primary }]}>
                                <Text style={[styles.stepNumber, location && styles.stepNumberActive]}>1</Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textSecondary }]}>Location</Text>
                        </View>

                        <View style={[styles.stepLine, { backgroundColor: colors.border }]} />

                        <View style={styles.stepItem}>
                            <View style={[styles.stepCircle, image && { backgroundColor: colors.primary }]}>
                                <Text style={[styles.stepNumber, image && styles.stepNumberActive]}>2</Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textSecondary }]}>Photo</Text>
                        </View>

                        <View style={[styles.stepLine, { backgroundColor: colors.border }]} />

                        <View style={styles.stepItem}>
                            <View style={[styles.stepCircle, priority && { backgroundColor: colors.primary }]}>
                                <Text style={[styles.stepNumber, priority && styles.stepNumberActive]}>3</Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textSecondary }]}>Priority</Text>
                        </View>

                        <View style={[styles.stepLine, { backgroundColor: colors.border }]} />

                        <View style={styles.stepItem}>
                            <View style={[styles.stepCircle, description && { backgroundColor: colors.primary }]}>
                                <Text style={[styles.stepNumber, description && styles.stepNumberActive]}>4</Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.textSecondary }]}>Describe</Text>
                        </View>
                    </View>

                    {/* STEP 1: Location (Required First) */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.label, { color: colors.text }]}>Step 1: Capture GPS Location *</Text>
                            {!location && (
                                <View style={styles.requiredBadge}>
                                    <Text style={styles.requiredText}>REQUIRED FIRST</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                            📍 You must capture your current location before taking a photo
                        </Text>
                        <PrimaryButton
                            title={location ? '✓ Location Captured' : 'Get Current Location'}
                            onPress={handleGetLocation}
                            loading={gettingLocation}
                            variant={location ? 'secondary' : 'primary'}
                        />
                        {location && (
                            <View style={styles.locationInfo}>
                                <Text style={styles.locationLabel}>Captured Location:</Text>
                                {locationName && (
                                    <Text style={[styles.locationText, styles.locationNameText]}>
                                        📍 {locationName}
                                    </Text>
                                )}
                                {district ? (
                                    <Text style={[styles.locationText, styles.districtText]}>
                                        🗺️ District: {district}
                                    </Text>
                                ) : (
                                    <Text style={[styles.locationText, styles.districtPlaceholder]}>
                                        🗺️ District: Detecting...
                                    </Text>
                                )}
                                <Text style={styles.locationText}>
                                    Latitude: {location.latitude.toFixed(6)}
                                </Text>
                                <Text style={styles.locationText}>
                                    Longitude: {location.longitude.toFixed(6)}
                                </Text>
                                <Text style={styles.locationText}>
                                    Accuracy: ±{location.accuracy ? location.accuracy.toFixed(1) : 'N/A'}m
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* STEP 2: Image (Locked until location is captured) */}
                    <View style={[styles.section, !location && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.label, !location && styles.labelDisabled, { color: colors.text }]}>
                                Step 2: Take Photo of Problem *
                            </Text>
                            {!location && (
                                <View style={styles.lockedBadge}>
                                    <Text style={styles.lockedText}>🔒 LOCKED</Text>
                                </View>
                            )}
                        </View>
                        {!location && (
                            <Text style={styles.warningText}>
                                ⚠️ Please capture GPS location first to unlock photo capture
                            </Text>
                        )}
                        <ImagePicker
                            image={image}
                            onImageSelected={handleImageSelected}
                            onVideoPlay={handleVideoPlay}
                            disabled={!location}
                        />
                    </View>

                    {/* STEP 3: Priority Level */}
                    <View style={[styles.section, !image && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.label, !image && styles.labelDisabled, { color: colors.text }]}>
                                Step 3: Select Priority *
                            </Text>
                            {image && priority && (
                                <View style={[
                                    styles.priorityBadge,
                                    priority === 'urgent' ? styles.priorityBadgeUrgent : styles.priorityBadgeModerate
                                ]}>
                                    <Text style={styles.priorityBadgeText}>
                                        {priority === 'urgent' ? '🚨 Urgent' : '⚠️ Moderate'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        {!image && (
                            <Text style={styles.warningText}>
                                ⚠️ Please take a photo first to select priority level
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
                                    <Text style={styles.priorityButtonText}>🚨 Urgently</Text>
                                    <Text style={styles.priorityButtonSubtext}>Critical/Immediate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.priorityButton,
                                        priority === 'moderate' && styles.priorityButtonActive,
                                        priority === 'moderate' && styles.priorityButtonModerate,
                                    ]}
                                    onPress={() => setPriority('moderate')}
                                >
                                    <Text style={styles.priorityButtonText}>⚠️ Moderate</Text>
                                    <Text style={styles.priorityButtonSubtext}>Can wait a bit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* STEP 4: Description */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <Text style={[styles.label, { color: colors.text }]}>Step 4: Description *</Text>
                        <TextInput
                            style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                            placeholder="Describe the water problem (e.g., pipe burst, water leakage, contamination)"
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
                            <Text style={styles.submitHint}>
                                Complete all steps to submit report
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            <VideoPlayer
                visible={showVideoPlayer}
                videoUri={videoToPlay?.uri || null}
                duration={videoToPlay?.duration}
                onClose={handleVideoPlayerClose}
            />
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1e40af',
        marginBottom: 6,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 28,
        fontWeight: '400',
        textAlign: 'center',
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 36,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 16,
        borderRadius: 14,
    },
    stepItem: {
        alignItems: 'center',
        flex: 1,
    },
    stepCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    stepCircleActive: {
        backgroundColor: '#1e40af',
    },
    stepNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#9ca3af',
    },
    stepNumberActive: {
        color: '#fff',
    },
    stepText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        fontWeight: '500',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 4,
    },
    section: {
        marginBottom: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 18,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionDisabled: {
        opacity: 0.6,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    labelDisabled: {
        color: '#9ca3af',
    },
    requiredBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    requiredText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#d97706',
    },
    lockedBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    lockedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#dc2626',
    },
    helpText: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 14,
        lineHeight: 20,
        fontWeight: '400',
    },
    warningText: {
        fontSize: 14,
        color: '#dc2626',
        marginBottom: 14,
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 10,
        lineHeight: 20,
        fontWeight: '500',
    },
    locationInfo: {
        backgroundColor: '#ecfdf5',
        padding: 16,
        borderRadius: 12,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#10b981',
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#065f46',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 13,
        color: '#047857',
        marginBottom: 4,
        fontWeight: '400',
    },
    locationNameText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#065f46',
        marginBottom: 8,
    },
    districtText: {
        fontSize: 13,
        color: '#047857',
        marginBottom: 4,
        fontWeight: '400',
    },
    districtPlaceholder: {
        fontSize: 13,
        color: '#047857',
        marginBottom: 4,
        fontWeight: '400',
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        minHeight: 120,
        color: '#1f2937',
    },
    submitSection: {
        marginTop: 36,
        marginBottom: 40,
    },
    submitHint: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '500',
    },
    priorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
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
    priorityContainer: {
        flexDirection: 'row',
        gap: 14,
        marginTop: 14,
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
        borderColor: '#1e40af',
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
        fontWeight: '400',
    },
});