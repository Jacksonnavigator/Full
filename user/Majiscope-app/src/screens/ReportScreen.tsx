import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import BrandWordmark from '../components/BrandWordmark';
import AppHeader from '../components/AppHeader';
import ImagePicker from '../components/ImagePicker';
import VideoPlayer from '../components/VideoPlayer';
import PrimaryButton from '../components/PrimaryButton';
import LocationPicker from '../components/LocationPicker';
import { SelectDropdown, CompactHeader } from '../components/ui';
import { useBottomTabPadding } from '../navigation/useBottomTabPadding';
import { SCREEN_PADDING_H, SCREEN_PADDING_TOP, SCREEN_SECTION_GAP } from '../theme/screenLayout';
import { submitWaterProblem } from '../services/ApiService';
import { useAppLanguage } from '../context/LanguageContext';
import { getText } from '../services/languageService';
import { getLocationDetails, getLocationName } from '../services/LocationService';
import {
    REPORT_CLASSIFICATION_OPTIONS,
    LEAKAGE_TYPE_OPTIONS,
    PRIORITY_OPTIONS,
    ReportLeakageType,
    ReportPriority,
    ReportType,
    selectReportType,
} from '../services/reportTypeService';
import { getReportClassificationLabel, getLeakageTypeLabel } from '../services/reportTypeService';
import { Coordinates, ImageResult } from '../types';
import { clearReportDraft, loadReportDraftImage, saveReportDraftImage } from '../services/reportDraftService';
import { recoverPendingMediaResult } from '../services/ImageService';

export default function ReportScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { language } = useAppLanguage();
    const bottomPadding = useBottomTabPadding();
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<ImageResult | null>(null);
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [locationName, setLocationName] = useState<string | null>(null);
    const [district, setDistrict] = useState<string | null>(null);
    const [region, setRegion] = useState<string | null>(null);
    const [locationVerified, setLocationVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resolvingLocation, setResolvingLocation] = useState(false);
    const [priority, setPriority] = useState<ReportPriority | null>(null);
    const [reportType, setReportType] = useState<ReportType | null>(null);
    const [leakageType, setLeakageType] = useState<ReportLeakageType | null>(null);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [videoToPlay, setVideoToPlay] = useState<ImageResult | null>(null);
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;

        const restoreDraftImage = async () => {
            const pendingMedia = await recoverPendingMediaResult();
            if (pendingMedia) {
                await saveReportDraftImage(pendingMedia);
                if (isMounted) {
                    setImage(pendingMedia);
                }
                return;
            }

            const draftImage = await loadReportDraftImage();
            if (draftImage && isMounted) {
                setImage(draftImage);
            }
        };

        restoreDraftImage();

        return () => {
            isMounted = false;
        };
    }, []);

    const reportTypeOptions = REPORT_CLASSIFICATION_OPTIONS.map((option) => ({
        value: option.value,
        label: language === 'sw' ? option.swahiliLabel : option.label,
        sublabel: language === 'sw' ? option.label : option.swahiliLabel,
        description: language === 'sw' ? option.description.replace('Escaping, bursting, overflowing, or leaking water.', 'Kutoka, kupasuka, kufurika, au kuvuja kwa maji.') : option.description,
    }));

    const leakageTypeOptions = LEAKAGE_TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: language === 'sw' ? option.swahiliLabel : option.label,
        sublabel: language === 'sw' ? option.label : option.swahiliLabel,
    }));

    const copy = language === 'sw'
        ? {
            headerTitle: 'Ripoti Tatizo',
            headerSubtitle: 'Ongeza picha au video, weka eneo, kisha wasilisha.',
            changeLanguage: 'Badilisha Lugha',
            step1Title: 'Hatua 1: Ongeza Picha au Video',
            step1Help: 'Anza na picha wazi au video fupi ili huduma ya maji iweze kuona tatizo mara moja.',
            step2Title: 'Hatua 2: Pata Eneo la GPS',
            step2Help: 'Kusanya nafasi yako ya sasa, kisha uburute alama kwenye eneo halisi unalotaka kuripoti.',
            step2Locked: 'Ongeza picha au video kwanza, kisha piga eneo lako.',
            step2Button: 'Pata Eneo la Sasa',
            step2ButtonRefresh: 'Sasisha Eneo la Sasa',
            locationUpdating: 'Inasasisha maelezo ya eneo...',
            step3Title: 'Hatua 3: Chagua Kipaumbele',
            step3Locked: 'Kamilisha hatua za media na eneo kwanza, kisha uchague kipaumbele cha ripoti.',
            step3Placeholder: 'Gusa kuchagua kipaumbele',
            step3SheetTitle: 'Chagua kipaumbele',
            step4Title: 'Hatua 4: Aina ya Ripoti',
            step4Help: 'Chagua kama hii ni uvujaji wa maji au shida nyingine ya huduma ya maji.',
            step4Locked: 'Kamilisha hatua za media, eneo, na kipaumbele kwanza.',
            step4Placeholder: 'Gusa kuchagua aina ya ripoti',
            step4SheetTitle: 'Chagua aina ya ripoti',
            step5Title: 'Hatua 5: Aina ya Uvujaji',
            step5Help: 'Chagua aina ya uvujaji ulioona ili huduma ya maji iweze kuielekeza ipasavyo.',
            step5Locked: 'Chagua aina ya ripoti kwanza.',
            step5Placeholder: 'Gusa kuchagua aina ya uvujaji',
            step5SheetTitle: 'Chagua aina ya uvujaji',
            descriptionTitle: 'Hatua 6: Maelezo',
            descriptionPlaceholder: 'Eleza tatizo la maji, kwa mfano kuvimba kwa bomba, uvujaji wa maji, au uchafuzi.',
            descriptionPlaceholderNonLeakage: 'Eleza shida ya huduma ya maji, kwa mfano: Mzigo wa hifadhi haina maji.',
            submitButton: 'Wasilisha Ripoti',
            submitHint: 'Kamilisha hatua zote kutuma ripoti yako.',
            validationTitle: 'Hitilafu ya Uthibitishaji',
            validationMedia: 'Tafadhali ongeza picha au video ya tatizo la maji.',
            validationDescription: 'Tafadhali toa maelezo.',
            validationLocation: 'Tafadhali piga eneo lako.',
            validationPriority: 'Tafadhali chagua kiwango cha kipaumbele cha ripoti hii.',
            validationReportType: 'Tafadhali chagua aina ya ripoti.',
            validationLeakageType: 'Tafadhali chagua aina ya uvujaji au chagua "Sijui".',
            videoTooLongTitle: 'Video Refu Sana',
            videoTooLongMessage: 'Tafadhali chagua video chini ya sekunde 60.',
            videoReadyTitle: 'Video Tayari',
            videoReadyMessage: 'Video hii itapunguzwa wakati wa kupakia ili kufikia kikomo cha ukubwa.',
            mediaSummaryPhoto: 'Picha imeongezwa',
            mediaSummaryVideo: 'Video imeongezwa',
            submitError: 'Hitilafu ya Uwasilishaji',
            successTitle: 'Imefanikiwa',
            successText: 'Ripoti imewasilishwa kwa mafanikio.',
            viewReport: 'Angalia Ripoti',
            locationErrorTitle: 'Hitilafu ya Eneo',
            locationErrorMessage: 'Hitilafu ya eneo',
            shareSuccessTitle: 'Imefanikiwa',
            shareSuccessMessage: 'Ripoti imewasilishwa kwa mafanikio.\n\nKitambulisho cha Ufuatiliaji: ',
          }
        : {
            headerTitle: 'Report a Problem',
            headerSubtitle: 'Add a photo or video, pin your location, then submit.',
            changeLanguage: 'Change Language',
            step1Title: 'Step 1: Add Photo or Video',
            step1Help: 'Start with a clear photo or short video clip so the utility can immediately see the reported issue.',
            step2Title: 'Step 2: Capture GPS Location',
            step2Help: 'Capture your current position, then drag the pin to the exact spot you want to report.',
            step2Locked: 'Add a photo or video first, then capture your location.',
            step2Button: 'Capture Current Location',
            step2ButtonRefresh: 'Refresh Current Location',
            locationUpdating: 'Updating location details...',
            step3Title: 'Step 3: Select Priority',
            step3Locked: 'Finish the media and location steps first, then choose the report priority.',
            step3Placeholder: 'Tap to choose priority',
            step3SheetTitle: 'Select priority',
            step4Title: 'Step 4: Report Type',
            step4Help: 'Choose whether this is a water leakage or another utility service issue.',
            step4Locked: 'Complete the media, location, and priority steps first.',
            step4Placeholder: 'Tap to choose report type',
            step4SheetTitle: 'Select report type',
            step5Title: 'Step 5: Leakage Type',
            step5Help: 'Choose the type of leakage you observed so the utility can route it correctly.',
            step5Locked: 'Select report type first.',
            step5Placeholder: 'Tap to choose leakage type',
            step5SheetTitle: 'Select leakage type',
            descriptionTitle: 'Step 6: Description',
            descriptionPlaceholder: 'Describe the water problem, for example pipe burst, water leakage, or contamination.',
            descriptionPlaceholderNonLeakage: 'Describe the utility service issue, for example: The storage tank has no water.',
            submitButton: 'Submit Report',
            submitHint: 'Complete all steps to submit your report.',
            validationTitle: 'Validation Error',
            validationMedia: 'Please add a photo or video of the water problem.',
            validationDescription: 'Please provide a description.',
            validationLocation: 'Please capture your location.',
            validationPriority: 'Please select a priority level for this report.',
            validationReportType: 'Please select a report type.',
            validationLeakageType: 'Please select a leakage type or choose "I don\'t know".',
            videoTooLongTitle: 'Video Too Long',
            videoTooLongMessage: 'Please select a video clip under 60 seconds.',
            videoReadyTitle: 'Video Ready',
            videoReadyMessage: 'This video will be compressed during upload to stay within the size limit.',
            mediaSummaryPhoto: 'Photo added',
            mediaSummaryVideo: 'Video added',
            submitError: 'Submission Error',
            successTitle: 'Success',
            successText: 'Report submitted successfully.',
            viewReport: 'View Report',
            locationErrorTitle: 'Location Error',
            locationErrorMessage: 'Location error',
            shareSuccessTitle: 'Success',
            shareSuccessMessage: 'Report submitted successfully.\n\nTracking ID: ',
          };

    const handleReportTypeSelect = (nextType: ReportType) => {
        selectReportType(nextType, setReportType, setLeakageType);
    };

    const handleImageSelected = async (selectedImage: ImageResult) => {
        if (
            selectedImage.mediaType === 'video' &&
            selectedImage.duration &&
            selectedImage.duration > 60000
        ) {
            Alert.alert(copy.videoTooLongTitle, copy.videoTooLongMessage);
            return;
        }

        setImage(selectedImage);
        await saveReportDraftImage(selectedImage);

        if (selectedImage.requiresServerCompression) {
            Alert.alert(copy.videoReadyTitle, copy.videoReadyMessage);
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

    const hydrateLocationContext = async (coords: Coordinates) => {
        setResolvingLocation(true);
        try {
            try {
                const areaName = await getLocationName(coords.latitude, coords.longitude);
                setLocationName(areaName);
            } catch (error) {
                console.warn('Failed to get location name:', error);
                setLocationName(null);
            }

            try {
                const locationDetails = await getLocationDetails(coords.latitude, coords.longitude);
                setDistrict(locationDetails.district || null);
                setRegion(locationDetails.region || null);

                if (!locationDetails.region && !region) {
                    setRegion(null);
                }
                if (!locationDetails.district && !district) {
                    setDistrict(null);
                }
            } catch (error) {
                console.warn('Failed to get location details:', error);
                setDistrict(null);
                setRegion(null);
            }
        } finally {
            setResolvingLocation(false);
        }
    };

    const resetForm = async () => {
        setDescription('');
        setImage(null);
        setLocation(null);
        setLocationName(null);
        setDistrict(null);
        setRegion(null);
        setLocationVerified(false);
        setPriority(null);
        setReportType(null);
        setLeakageType(null);
        setResolvingLocation(false);
        await clearReportDraft();
    };

    const handleSubmit = async () => {
        if (!image) {
            Alert.alert(copy.validationTitle, copy.validationMedia);
            return;
        }

        if (!description.trim()) {
            Alert.alert(copy.validationTitle, copy.validationDescription);
            return;
        }

        if (!location) {
            Alert.alert(copy.validationTitle, copy.validationLocation);
            return;
        }

        if (!priority) {
            Alert.alert(copy.validationTitle, copy.validationPriority);
            return;
        }

        if (!reportType) {
            Alert.alert(copy.validationTitle, copy.validationReportType);
            return;
        }

        if (reportType === 'leakage' && !leakageType) {
            Alert.alert(copy.validationTitle, copy.validationLeakageType);
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
                copy.successTitle,
                `${copy.successText}\n\nTracking ID: ${report.tracking_id || 'pending'}`,
                [
                    {
                        text: copy.viewReport,
                        onPress: () => {
                            void resetForm();
                            navigation.navigate('ReportDetails', { report });
                        },
                    },
                ]
            );
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : typeof error === 'string'
                    ? error
                    : JSON.stringify(error);

            Alert.alert(copy.submitError, errorMessage || 'Failed to submit report.');
        } finally {
            setLoading(false);
        }
    };

    const mediaReady = !!image;
    const locationCaptured = !!location;
    const locationReady = !!location && locationVerified;
    const priorityReady = !!priority;
    const reportTypeReady = !!reportType;
    const leakageTypeReady = reportType === 'non_leakage' || !!leakageType;
    const descriptionReady = !!description.trim();
    const locationStepUnlocked = mediaReady;
    const priorityStepUnlocked = locationReady;
    const reportTypeStepUnlocked = priorityStepUnlocked && !!priority;
    const leakageTypeStepUnlocked = reportTypeStepUnlocked && reportType === 'leakage';
    const descriptionStepIndex = reportType === 'leakage' ? 5 : 4;
    const canSubmit =
        mediaReady && descriptionReady && locationReady && priorityReady && reportTypeReady && leakageTypeReady;

    const reportSteps = ['Media', 'Location', 'Priority', 'Report', 'Type', 'Describe'];
    let completedSteps = 0;
    if (mediaReady) completedSteps += 1;
    if (locationReady) completedSteps += 1;
    if (priorityReady) completedSteps += 1;
    if (reportTypeReady) completedSteps += 1;
    if (leakageTypeReady) completedSteps += 1;
    if (descriptionReady) completedSteps += 1;

    const currentStepIndex = !mediaReady
        ? 0
        : !locationCaptured
            ? 1
        : !locationVerified
                ? 1
                : !priorityReady
                    ? 2
                    : !reportTypeReady
                        ? 3
                        : reportType === 'leakage' && !leakageTypeReady
                            ? 4
                            : !descriptionReady
                                ? descriptionStepIndex
                                : descriptionStepIndex;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
                >
                    <View style={styles.content}>
                        <AppHeader
                            title={copy.headerTitle}
                            subtitle={copy.headerSubtitle}
                            onLanguagePress={() => navigation.navigate('LanguageSelection')}
                        />

                        {/* Step controls: allow expanding a single step; default open is currentStepIndex */}

                        {(expandedStep === 0 || currentStepIndex === 0) ? (
                            <View style={[styles.section, { backgroundColor: colors.card }]}>
                                <View style={styles.labelContainer}>
                                    <Text style={[styles.label, { color: colors.text }]}>{copy.step1Title}</Text>
                                </View>
                                <Text style={[styles.helpText, { color: colors.textSecondary }]}>{copy.step1Help}</Text>
                                <ImagePicker
                                    image={image}
                                    onImageSelected={handleImageSelected}
                                    onVideoPlay={handleVideoPlay}
                                />
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.sectionSummary, { backgroundColor: colors.card }]} activeOpacity={0.85} onPress={() => setExpandedStep(0)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <MaterialIcons
                                        name={image ? 'check-circle' : 'photo-camera'}
                                        size={20}
                                        color={image ? colors.primary : colors.textSecondary}
                                    />
                                    <Text style={[styles.label, { color: colors.text }]}>
                                        {image
                                            ? image.mediaType === 'video'
                                                ? copy.mediaSummaryVideo
                                                : copy.mediaSummaryPhoto
                                            : copy.step1Title}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {(expandedStep === 1 || currentStepIndex === 1) ? (
                            <View style={[styles.section, !locationStepUnlocked && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                                <View style={styles.labelContainer}>
                                    <Text style={[styles.label, { color: colors.text }, !locationStepUnlocked && styles.labelDisabled]}>{copy.step2Title}</Text>
                                </View>

                                {!locationStepUnlocked ? (
                                    <Text style={styles.warningText}>{copy.step2Locked}</Text>
                                ) : (
                                    <Text style={[styles.helpText, { color: colors.textSecondary }]}>{copy.step2Help}</Text>
                                )}

                                <LocationPicker
                                    location={location}
                                    onLocationSelected={(coords) => {
                                        setLocation(coords);
                                        setLocationVerified(false);
                                        hydrateLocationContext(coords).catch(() => {});
                                    }}
                                    disabled={!locationStepUnlocked}
                                />

                                {location ? (
                                    <View style={styles.locationInfo}>
                                        {!locationVerified && <PrimaryButton title={language === 'sw' ? 'Thibitisha Eneo' : 'Confirm Location'} onPress={() => setLocationVerified(true)} variant="primary" />}
                                        {resolvingLocation ? <Text style={styles.locationUpdatingText}>{copy.locationUpdating}</Text> : null}
                                        {locationName ? <Text style={styles.locationNameText}>{locationName}</Text> : null}
                                    </View>
                                ) : null}
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.sectionSummary, { backgroundColor: colors.card }]} activeOpacity={0.85} onPress={() => setExpandedStep(1)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <MaterialIcons name={locationReady ? 'check-circle' : 'place'} size={20} color={locationReady ? colors.primary : colors.textSecondary} />
                                    <Text style={[styles.label, { color: colors.text }]}>{locationReady ? 'Location set' : copy.step2Title}</Text>
                                </View>
                            </TouchableOpacity>
                        )}


                        {(expandedStep === 2 || currentStepIndex === 2) ? (
                            <View style={[styles.section, !priorityStepUnlocked && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                                <Text style={[styles.label, { color: colors.text }, !priorityStepUnlocked && styles.labelDisabled]}>{copy.step3Title}</Text>
                                {!priorityStepUnlocked ? (
                                    <Text style={styles.warningText}>{copy.step3Locked}</Text>
                                ) : (
                                    <SelectDropdown placeholder={copy.step3Placeholder} sheetTitle={copy.step3SheetTitle} value={priority} options={PRIORITY_OPTIONS} onSelect={setPriority} />
                                )}
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.sectionSummary, { backgroundColor: colors.card }]} activeOpacity={0.85} onPress={() => setExpandedStep(2)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <MaterialIcons name={priority ? 'check-circle' : 'flag'} size={20} color={priority ? colors.primary : colors.textSecondary} />
                                    <Text style={[styles.label, { color: colors.text }]}>{priority ? `Priority: ${priority}` : copy.step3Title}</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {(expandedStep === 3 || currentStepIndex === 3) ? (
                            <View style={[styles.section, !reportTypeStepUnlocked && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                                <Text style={[styles.label, { color: colors.text }]}>{copy.step4Title}</Text>
                                <Text style={[styles.helpText, { color: colors.textSecondary }]}>{copy.step4Help}</Text>
                                {!reportTypeStepUnlocked ? (
                                    <Text style={styles.warningText}>{copy.step4Locked}</Text>
                                ) : (
                                    <SelectDropdown placeholder={copy.step4Placeholder} sheetTitle={copy.step4SheetTitle} value={reportType} options={reportTypeOptions} onSelect={handleReportTypeSelect} />
                                )}
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.sectionSummary, { backgroundColor: colors.card }]} activeOpacity={0.85} onPress={() => setExpandedStep(3)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <MaterialIcons name={reportType ? 'check-circle' : 'category'} size={20} color={reportType ? colors.primary : colors.textSecondary} />
                                    <Text style={[styles.label, { color: colors.text }]}>{reportType ? getReportClassificationLabel(reportType) : copy.step4Title}</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {reportType === 'leakage' ? (
                            (expandedStep === 4 || currentStepIndex === 4) ? (
                                <View style={[styles.section, !leakageTypeStepUnlocked && styles.sectionDisabled, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.label, { color: colors.text }]}>{copy.step5Title}</Text>
                                    <Text style={[styles.helpText, { color: colors.textSecondary }]}>{copy.step5Help}</Text>
                                    {!leakageTypeStepUnlocked ? (
                                        <Text style={styles.warningText}>{copy.step5Locked}</Text>
                                    ) : (
                                        <SelectDropdown placeholder={copy.step5Placeholder} sheetTitle={copy.step5SheetTitle} value={leakageType} options={leakageTypeOptions} onSelect={setLeakageType} />
                                    )}
                                </View>
                            ) : (
                                <TouchableOpacity style={[styles.sectionSummary, { backgroundColor: colors.card }]} activeOpacity={0.85} onPress={() => setExpandedStep(4)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <MaterialIcons name={leakageType ? 'check-circle' : 'water-drop'} size={20} color={leakageType ? colors.primary : colors.textSecondary} />
                                        <Text style={[styles.label, { color: colors.text }]}>{leakageType ? getLeakageTypeLabel(leakageType) : copy.step5Title}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        ) : null}

                        {(expandedStep === descriptionStepIndex || currentStepIndex === descriptionStepIndex) ? (
                            <View style={[styles.section, { backgroundColor: colors.card }]}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    {reportType === 'leakage'
                                        ? copy.descriptionTitle
                                        : language === 'sw'
                                            ? 'Hatua 5: Maelezo'
                                            : 'Step 5: Description'}
                                </Text>
                                <TextInput
                                    style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
                                    placeholder={reportType === 'non_leakage' ? copy.descriptionPlaceholderNonLeakage : copy.descriptionPlaceholder}
                                    placeholderTextColor={colors.textSecondary}
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.sectionSummary, { backgroundColor: colors.card }]} activeOpacity={0.85} onPress={() => setExpandedStep(descriptionStepIndex)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <MaterialIcons name={description ? 'check-circle' : 'edit'} size={20} color={description ? colors.primary : colors.textSecondary} />
                                    <Text style={[styles.label, { color: colors.text }]}>
                                        {description
                                            ? description.substring(0, 40) + (description.length > 40 ? '…' : '')
                                            : reportType === 'leakage'
                                                ? copy.descriptionTitle
                                                : language === 'sw'
                                                    ? 'Hatua 5: Maelezo'
                                                    : 'Step 5: Description'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <View style={styles.submitSection}>
                            <PrimaryButton
                                title={copy.submitButton}
                                onPress={handleSubmit}
                                loading={loading}
                                disabled={!canSubmit}
                            />
                            {!canSubmit && (
                                <Text style={styles.submitHint}>
                                    {copy.submitHint}
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
    scrollContent: {},
    content: {
        paddingHorizontal: SCREEN_PADDING_H,
        paddingTop: SCREEN_PADDING_TOP,
    },
    headerRow: {
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 10,
    },
        heroHeader: {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 18,
                paddingVertical: 20,
                borderRadius: 20,
                marginBottom: 14,
                overflow: 'hidden',
                position: 'relative',
            },
        heroContent: {
                    flex: 1,
                    flexBasis: 0,
                    flexGrow: 1,
                    paddingLeft: 12,
                    minWidth: 140,
                    alignItems: 'flex-start',
                },
        heroTitle: {
                fontSize: 30,
                fontWeight: '900',
                letterSpacing: 0.4,
                lineHeight: 36,
            },
        heroSubtitle: {
                fontSize: 13,
                marginTop: 6,
                fontWeight: '600',
                lineHeight: 18,
            },
        languagePill: {
                flexDirection: 'row',
                alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 0,
                    flexShrink: 0,
            },
        languagePillText: {
                fontSize: 13,
                fontWeight: '800',
                marginHorizontal: 4,
            },
        logoWrap: {
            flexShrink: 0,
            marginRight: 8,
            paddingTop: 4,
        },
        waveContainer: {
            position: 'absolute',
            right: -10,
            bottom: -24,
            width: 240,
            height: 120,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            overflow: 'visible',
        },
        waveCircle: {
            position: 'absolute',
            borderRadius: 200,
            opacity: 1,
        },
        waveCirclePrimary: {
            width: 220,
            height: 110,
            right: -20,
            bottom: -18,
            transform: [{ scaleX: 1.2 }],
        },
        waveCircleSecondary: {
            width: 160,
            height: 80,
            right: 18,
            bottom: -4,
            opacity: 0.95,
        },
    languageButton: {
        marginTop: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#0f766e',
    },
    progressOverlapWrap: {
        marginTop: -26,
        paddingHorizontal: 2,
    },
    languageButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    section: {
        marginBottom: SCREEN_SECTION_GAP,
        padding: 14,
        borderRadius: 16,
        borderWidth: 0,
        shadowColor: '#0891b2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    sectionSummary: {
        marginBottom: SCREEN_SECTION_GAP,
        padding: 12,
        borderRadius: 12,
        borderWidth: 0,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionDisabled: {
        opacity: 0.65,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '700',
    },
    labelDisabled: {
        color: '#9ca3af',
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
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 10,
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
        padding: 12,
        fontSize: 15,
        minHeight: 96,
    },
    submitSection: {
        marginTop: 8,
        marginBottom: 8,
    },
    submitHint: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        marginTop: 10,
    },
});
