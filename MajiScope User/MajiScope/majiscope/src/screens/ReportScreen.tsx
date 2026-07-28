import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import DraggableLocationMap from '../components/DraggableLocationMap';
import ImagePicker from '../components/ImagePicker';
import PrimaryButton from '../components/PrimaryButton';
import AppHeader from '../components/AppHeader';
import { HeroHeader, StepProgress } from '../components/ui';
import VideoPlayer from '../components/VideoPlayer';
import { submitWaterProblem } from '../services/ApiService';
import { getLocation, getLocationDetails, getLocationName } from '../services/LocationService';
import {
    resolveUtilityForCoordinates,
    ResolvedUtilityContact,
} from '../services/utilityService';
import {
    REPORT_CLASSIFICATION_OPTIONS,
    LEAKAGE_TYPE_OPTIONS,
    ReportLeakageType,
    ReportType,
    selectReportType,
} from '../services/reportTypeService';
import { Coordinates, ImageResult } from '../types';

export default function ReportScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<ImageResult | null>(null);
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [region, setRegion] = useState<string | null>(null);
    const [resolvedUtility, setResolvedUtility] = useState<ResolvedUtilityContact | null>(null);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);
    const [priority, setPriority] = useState<'urgent' | 'moderate' | 'low' | null>(null);
    const [reportType, setReportType] = useState<ReportType | null>(null);
    const [leakageType, setLeakageType] = useState<ReportLeakageType | null>(null);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [videoToPlay, setVideoToPlay] = useState<ImageResult | null>(null);

    const getPriorityLabel = (value: 'urgent' | 'moderate' | 'low') => {
        switch (value) {
            case 'urgent':
                return 'High';
            case 'moderate':
                return 'Moderate';
            case 'low':
                return 'Low';
            default:
                return value;
        }
    };

    const hydrateLocationContext = async (coords: Coordinates) => {
        setResolvingLocation(true);
        try {
            const areaName = await getLocationName(coords.latitude, coords.longitude);
            setLocationName(areaName);

            const locationDetails = await getLocationDetails(coords.latitude, coords.longitude);
            setDistrict(locationDetails.district || null);
            setRegion(locationDetails.region || null);

            const utilityMatch = await resolveUtilityForCoordinates(coords.latitude, coords.longitude);
            setResolvedUtility(utilityMatch);

            if (!locationDetails.region && utilityMatch?.region_name) {
                setRegion(utilityMatch.region_name);
            }
            if (!locationDetails.district && utilityMatch?.dma_name) {
                setDistrict(utilityMatch.dma_name);
            }
        } finally {
            setResolvingLocation(false);
        }
    };

    const handleGetLocation = async () => {
        setGettingLocation(true);
        try {
            const coords = await getLocation();
            setLocation(coords);
            await hydrateLocationContext(coords);
        } catch (error: any) {
            Alert.alert('Location Error', error.message);
        } finally {
            setGettingLocation(false);
        }
    };

    const handleLocationAdjusted = async (coords: Coordinates) => {
        setLocation(coords);
        await hydrateLocationContext(coords);
    };

    const handleImageSelected = (selectedImage: ImageResult) => {
        if (
            selectedImage.mediaType === 'video' &&
            selectedImage.duration &&
            selectedImage.duration > 60000
        ) {
            Alert.alert('Video Too Long', 'Please select a video clip under 60 seconds.');
            return;
        }

        setImage(selectedImage);

        if (selectedImage.requiresServerCompression) {
            Alert.alert(
                'Video Ready',
                'This video will be compressed during upload to stay within the size limit.'
            );
        }
    };

    const handleVideoPlay = (video: ImageResult) => {
        setVideoToPlay(video);
        setShowVideoPlayer(true);
    };

    const handleVideoPlayerClose = () => {
        setShowVideoPlayer(false);
        setVideoToPlay(null);
    };

    const resetForm = () => {
        setDescription('');
        setImage(null);
        setLocation(null);
        setLocationName(null);
        setDistrict(null);
        setRegion(null);
        setResolvedUtility(null);
        setPriority(null);
        setReportType(null);
        setLeakageType(null);
        setResolvingLocation(false);
    };

    const handleSubmit = async () => {
        if (!description.trim()) {
            Alert.alert('Validation Error', 'Please provide a description.');
            return;
        }

        if (!image) {
            Alert.alert('Validation Error', 'Please add a photo or video of the water problem.');
            return;
        }

        if (!location) {
            Alert.alert('Validation Error', 'Please capture your location.');
            return;
        }

        if (!priority) {
            Alert.alert(
                'Validation Error',
                'Please select a priority level for this report.'
            );
            return;
        }

        if (!reportType) {
            Alert.alert('Validation Error', 'Please select a report type.');
            return;
        }

        if (reportType === 'leakage' && !leakageType) {
            Alert.alert('Validation Error', 'Please select a leakage type or choose "I don\'t know".');
            return;
        }

        setLoading(true);
        try {
            const report = await submitWaterProblem({
                description: description.trim(),
                location,
                address:
                    locationName || `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`,
                regionName: region || undefined,
                districtName: district || undefined,
                image,
                priority,
                reportType,
                leakageType: reportType === 'non_leakage' ? null : leakageType,
                timestamp: new Date(),
            });

            Alert.alert(
                'Success',
                `Report submitted successfully.\n\nTracking ID: ${report.tracking_id || 'pending'}`,
                [
                    {
                        text: 'View Report',
                        onPress: () => {
                            resetForm();
                            navigation.navigate('ReportDetails', { report });
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

    const locationReady = !!location;
    const priorityReady = !!priority;
    const reportTypeReady = !!reportType;
    const leakageTypeReady = reportType === 'non_leakage' || !!leakageType;
    const descriptionReady = !!description.trim();
    const locationStepUnlocked = !!image;
    const priorityStepUnlocked = !!image && !!location;
    const reportTypeStepUnlocked = priorityStepUnlocked && !!priority;
    const leakageTypeStepUnlocked = reportTypeStepUnlocked && reportType === 'leakage';
    const canSubmit =
        descriptionReady && locationReady && !!image && priorityReady && reportTypeReady && leakageTypeReady;

    const reportSteps = ['Media', 'Location', 'Priority', 'Report', 'Type', 'Describe'];
    let completedSteps = 0;
    if (image) completedSteps += 1;
    if (locationReady) completedSteps += 1;
    if (priorityReady) completedSteps += 1;
    if (reportTypeReady) completedSteps += 1;
    if (leakageTypeReady) completedSteps += 1;
    if (descriptionReady) completedSteps += 1;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.content}>
                        <AppHeader
                            title="Report a Problem"
                            subtitle="Photo first, pin the location, then send to your utility team."
                        />
                        <HeroHeader
                            title="Your next report"
                            subtitle="Submit a photo, capture the location, and get it to the right utility team."
                            icon="water-drop"
                            badge="Citizen Report"
                        />

                        <TouchableOpacity
                            style={[
                                styles.viewReportBanner,
                                { borderColor: colors.border, backgroundColor: colors.surface },
                            ]}
                            onPress={() => navigation.getParent()?.navigate('ViewReport')}
                            activeOpacity={0.85}
                        >
                            <View style={styles.viewReportBannerCopy}>
                                <Text style={[styles.viewReportBannerTitle, { color: colors.text }]}>
                                    View Report
                                </Text>
                                <Text
                                    style={[styles.viewReportBannerText, { color: colors.textSecondary }]}
                                >
                                    Open your submitted reports and track progress.
                                </Text>
                            </View>
                            <Ionicons name="arrow-forward-circle-outline" size={26} color={colors.primary} />
                        </TouchableOpacity>

                        <StepProgress steps={reportSteps} completedCount={completedSteps} />

                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                            <View style={styles.labelContainer}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    Step 1: Add Photo or Video
                                </Text>
                            </View>
                            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                                Start with a clear photo or a short video clip so the utility can immediately see
                                the reported issue.
                            </Text>
                            <ImagePicker image={image} onImageSelected={handleImageSelected} onVideoPlay={handleVideoPlay} />
                        </View>

                        <View
                            style={[
                                styles.section,
                                !locationStepUnlocked && styles.sectionDisabled,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <View style={styles.labelContainer}>
                                <Text
                                    style={[
                                        styles.label,
                                        { color: colors.text },
                                        !locationStepUnlocked && styles.labelDisabled,
                                    ]}
                                >
                                    Step 2: Capture GPS Location
                                </Text>
                                {!locationStepUnlocked && (
                                    <View style={styles.lockedBadge}>
                                        <Text style={styles.lockedText}>ADD MEDIA FIRST</Text>
                                    </View>
                                )}
                            </View>

                            {!locationStepUnlocked ? (
                                <Text style={styles.warningText}>
                                    Add a photo or video first, then capture the location and adjust the pin if needed.
                                </Text>
                            ) : (
                                <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                                    Capture your current position, then drag the pin to the exact spot you want to report.
                                </Text>
                            )}

                            <PrimaryButton
                                title={location ? 'Refresh Current Location' : 'Capture Current Location'}
                                onPress={handleGetLocation}
                                loading={gettingLocation}
                                variant={location ? 'secondary' : 'primary'}
                                disabled={!locationStepUnlocked}
                            />

                            {location ? (
                                <>
                                    <DraggableLocationMap
                                        location={location}
                                        onLocationChange={handleLocationAdjusted}
                                        addressLabel={locationName}
                                    />
                                    <View style={styles.locationInfo}>
                                        {resolvingLocation ? (
                                            <Text style={styles.locationUpdatingText}>
                                                Updating location details...
                                            </Text>
                                        ) : null}
                                        {resolvedUtility?.utility_name ? (
                                            <Text style={styles.locationUtilityText}>
                                                Responsible Utility: {resolvedUtility.utility_name}
                                                {resolvedUtility.dma_name ? ` · ${resolvedUtility.dma_name}` : ''}
                                            </Text>
                                        ) : null}
                                        {locationName ? (
                                            <Text style={styles.locationNameText}>{locationName}</Text>
                                        ) : null}
                                        <Text style={styles.locationText}>Region: {region || 'Detecting...'}</Text>
                                        <Text style={styles.locationText}>
                                            District: {district || 'Detecting...'}
                                        </Text>
                                        <Text style={styles.locationText}>
                                            Latitude: {location.latitude.toFixed(6)}
                                        </Text>
                                        <Text style={styles.locationText}>
                                            Longitude: {location.longitude.toFixed(6)}
                                        </Text>
                                        <Text style={styles.locationText}>
                                            Accuracy: about {location.accuracy ? Math.round(location.accuracy) : 'N/A'} m
                                        </Text>
                                    </View>
                                </>
                            ) : null}
                        </View>

                        {resolvedUtility ? (
                            <View style={[styles.section, { backgroundColor: colors.card }]}>
                                <View style={styles.labelContainer}>
                                    <Text style={[styles.label, { color: colors.text }]}>
                                        Utility Contact For This Area
                                    </Text>
                                </View>
                                <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                                    These contact details come from the utility profile responsible for your current area.
                                </Text>
                                <View style={styles.utilityContactBox}>
                                    <Text style={styles.utilityContactTitle}>{resolvedUtility.utility_name}</Text>
                                    {resolvedUtility.contact_phone ? (
                                        <Text style={styles.utilityContactValue}>
                                            Phone: {resolvedUtility.contact_phone}
                                        </Text>
                                    ) : null}
                                    {resolvedUtility.contact_email ? (
                                        <Text style={styles.utilityContactValue}>
                                            Email: {resolvedUtility.contact_email}
                                        </Text>
                                    ) : null}
                                    {resolvedUtility.contact_address ? (
                                        <Text style={styles.utilityContactValue}>
                                            Address: {resolvedUtility.contact_address}
                                        </Text>
                                    ) : null}
                                    <TouchableOpacity
                                        style={styles.utilityEmergencyLink}
                                        onPress={() => navigation.getParent()?.navigate('Emergency')}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={styles.utilityEmergencyLinkText}>
                                            Open utility emergency contacts
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}

                        <View
                            style={[
                                styles.section,
                                !priorityStepUnlocked && styles.sectionDisabled,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <View style={styles.labelContainer}>
                                <Text
                                    style={[
                                        styles.label,
                                        { color: colors.text },
                                        !priorityStepUnlocked && styles.labelDisabled,
                                    ]}
                                >
                                    Step 3: Select Priority
                                </Text>
                                {priority ? (
                                    <View
                                        style={[
                                            styles.priorityBadge,
                                            priority === 'urgent'
                                                ? styles.priorityBadgeUrgent
                                                : priority === 'moderate'
                                                  ? styles.priorityBadgeModerate
                                                  : styles.priorityBadgeLow,
                                        ]}
                                    >
                                        <Text style={styles.priorityBadgeText}>{getPriorityLabel(priority)}</Text>
                                    </View>
                                ) : null}
                            </View>

                            {!priorityStepUnlocked ? (
                                <Text style={styles.warningText}>
                                    Finish the media and location steps first, then choose the report priority.
                                </Text>
                            ) : (
                                <View style={styles.priorityContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.priorityButton,
                                            priority === 'urgent' && styles.priorityButtonActive,
                                            priority === 'urgent' && styles.priorityButtonUrgent,
                                        ]}
                                        onPress={() => setPriority('urgent')}
                                    >
                                        <Text style={styles.priorityButtonText}>High</Text>
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
                                    <TouchableOpacity
                                        style={[
                                            styles.priorityButton,
                                            priority === 'low' && styles.priorityButtonActive,
                                            priority === 'low' && styles.priorityButtonLow,
                                        ]}
                                        onPress={() => setPriority('low')}
                                    >
                                        <Text style={styles.priorityButtonText}>Low</Text>
                                        <Text style={styles.priorityButtonSubtext}>Can be handled in normal queue</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View
                            style={[
                                styles.section,
                                !reportTypeStepUnlocked && styles.sectionDisabled,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text style={[styles.label, { color: colors.text }]}>Step 4: Report Type</Text>
                            <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                                Choose whether this is a water leakage or another utility service issue.
                            </Text>
                            {!reportTypeStepUnlocked ? (
                                <Text style={styles.warningText}>
                                    Complete the media, location, and priority steps first.
                                </Text>
                            ) : (
                                <View style={styles.typeOptionContainer}>
                                    {REPORT_CLASSIFICATION_OPTIONS.map((option) => {
                                        const selected = reportType === option.value;
                                        return (
                                            <TouchableOpacity
                                                key={option.value}
                                                style={[
                                                    styles.typeOption,
                                                    selected && styles.typeOptionSelected,
                                                    selected && { borderColor: colors.primary },
                                                ]}
                                                onPress={() =>
                                                    selectReportType(option.value, setReportType, setLeakageType)
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.typeOptionText,
                                                        selected && styles.typeOptionTextSelected,
                                                    ]}
                                                >
                                                    {option.label}
                                                </Text>
                                                <Text style={styles.typeOptionSubtext}>{option.swahiliLabel}</Text>
                                                <Text style={styles.typeOptionDescription}>{option.description}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                        </View>

                        {reportType === 'leakage' ? (
                            <View
                                style={[
                                    styles.section,
                                    !leakageTypeStepUnlocked && styles.sectionDisabled,
                                    { backgroundColor: colors.card },
                                ]}
                            >
                                <Text style={[styles.label, { color: colors.text }]}>Step 5: Leakage Type</Text>
                                <Text style={[styles.helpText, { color: colors.textSecondary }]}>
                                    Choose the type of leakage you observed so the utility can route it correctly.
                                </Text>
                                <View style={styles.typeOptionContainer}>
                                    {LEAKAGE_TYPE_OPTIONS.map((option) => {
                                        const selected = leakageType === option.value;
                                        return (
                                            <TouchableOpacity
                                                key={option.value}
                                                style={[
                                                    styles.typeOption,
                                                    selected && styles.typeOptionSelected,
                                                    selected && { borderColor: colors.primary },
                                                ]}
                                                onPress={() => setLeakageType(option.value)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.typeOptionText,
                                                        selected && styles.typeOptionTextSelected,
                                                    ]}
                                                >
                                                    {option.label}
                                                </Text>
                                                <Text style={styles.typeOptionSubtext}>{option.swahiliLabel}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ) : null}

                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <Text style={[styles.label, { color: colors.text }]}>
                                Step {reportType === 'leakage' ? 6 : 5}: Description
                            </Text>
                            <TextInput
                                style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                                placeholder={
                                    reportType === 'non_leakage'
                                        ? 'Describe the utility service issue, for example: The storage tank has no water.'
                                        : 'Describe the water problem, for example pipe burst, water leakage, or contamination.'
                                }
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
                                disabled={!canSubmit}
                            />
                            {!canSubmit && (
                                <Text style={styles.submitHint}>
                                    Complete all steps to submit your report.
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
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 110,
    },
    content: {
        padding: 20,
        paddingTop: 16,
    },
    viewReportBanner: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    viewReportBannerCopy: {
        flex: 1,
        paddingRight: 12,
    },
    viewReportBannerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    viewReportBannerText: {
        marginTop: 4,
        fontSize: 13,
        lineHeight: 18,
    },
    section: {
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#0891b2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    sectionDisabled: {
        opacity: 0.65,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
    },
    labelDisabled: {
        color: '#9ca3af',
    },
    lockedBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        flexShrink: 1,
        maxWidth: '100%',
    },
    lockedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#b91c1c',
        marginHorizontal: -2,
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
    locationUpdatingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1d4ed8',
        marginBottom: 4,
    },
    locationNameText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#065f46',
    },
    locationUtilityText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0f5fff',
        marginBottom: 2,
    },
    locationText: {
        fontSize: 13,
        color: '#047857',
    },
    utilityContactBox: {
        marginTop: 4,
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
        padding: 14,
        gap: 6,
    },
    utilityContactTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e3a8a',
    },
    utilityContactValue: {
        fontSize: 13,
        lineHeight: 18,
        color: '#1e40af',
    },
    utilityEmergencyLink: {
        marginTop: 6,
        alignSelf: 'flex-start',
        paddingVertical: 8,
    },
    utilityEmergencyLinkText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0f5fff',
    },
    priorityContainer: {
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
    priorityButtonLow: {
        borderColor: '#0f766e',
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
    priorityBadgeLow: {
        backgroundColor: '#ccfbf1',
    },
    priorityBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1f2937',
    },
    typeOptionContainer: {
        gap: 10,
    },
    typeOption: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    typeOptionSelected: {
        backgroundColor: '#eff6ff',
    },
    typeOptionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    typeOptionTextSelected: {
        color: '#2563eb',
    },
    typeOptionSubtext: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    typeOptionDescription: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
        lineHeight: 16,
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
