import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { takePhoto, pickImage, takeVideo, pickVideo } from '../services/ImageService';
import { ImageResult } from '../types';

interface ImagePickerProps {
    image: ImageResult | null;
    onImageSelected: (image: ImageResult) => void;
    disabled?: boolean;
    onVideoPlay?: (video: ImageResult) => void;
}

export default function ImagePicker({ image, onImageSelected, disabled = false, onVideoPlay }: ImagePickerProps) {
    const [processingMedia, setProcessingMedia] = useState(false);

    const runMediaAction = async (action: () => Promise<ImageResult | null>) => {
        if (processingMedia) {
            return;
        }

        setProcessingMedia(true);
        try {
            const media = await action();
            if (media) {
                onImageSelected(media);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to process media');
        } finally {
            setProcessingMedia(false);
        }
    };

    const handleMediaSelection = () => {
        if (disabled || processingMedia) {
            return;
        }

        Alert.alert(
            'Select media',
            'Choose how to add your photo or video.',
            [
                { text: 'Take Photo', onPress: () => runMediaAction(takePhoto) },
                { text: 'Choose Photo', onPress: () => runMediaAction(pickImage) },
                { text: 'Record Video', onPress: () => runMediaAction(takeVideo) },
                { text: 'Choose Video', onPress: () => runMediaAction(pickVideo) },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const getMediaLabel = () => {
        if (!image) return 'Add photo or video';
        if (image.mediaType === 'video') {
            const duration = image.duration ? `${(image.duration / 1000).toFixed(1)}s` : '';
            const size = image.fileSize ? `${(image.fileSize / (1024 * 1024)).toFixed(1)}MB` : '';
            let label = `📹 Video${duration ? ` (${duration})` : ''}`;
            if (size) {
                label += ` - ${size}`;
                // Add compression indicator if needed
                if (image.requiresServerCompression) {
                    label += ' (compressing...)';
                }
            }
            return label;
        }
        return '📷 Photo';
    };

    const handleVideoPlayPress = (video: ImageResult) => {
        if (onVideoPlay) {
            onVideoPlay(video);
        }
    };

    return (
        <View style={styles.container}>
            {processingMedia ? (
                <View style={styles.processingBanner}>
                    <ActivityIndicator size="small" color="#0891b2" />
                    <Text style={styles.processingText}>Processing media...</Text>
                </View>
            ) : null}

            <TouchableOpacity
                style={[
                    styles.imageContainer,
                    (disabled || processingMedia) && styles.imageContainerDisabled
                ]}
                onPress={handleMediaSelection}
                activeOpacity={disabled || processingMedia ? 1 : 0.8}
                disabled={processingMedia}
            >
                {image ? (
                    <View style={styles.mediaPreview}>
                        {image.mediaType === 'video' ? (
                            <TouchableOpacity
                                style={styles.videoPreview}
                                onPress={() => handleVideoPlayPress(image)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.videoPlaceholder}>
                                    <Text style={styles.videoLabel}>
                                        {image.duration ? `${((image.duration) / 1000).toFixed(1)}s` : 'Video'}
                                    </Text>
                                </View>
                                <View style={styles.playButtonOverlay}>
                                    <View style={styles.playIconContainer}>
                                        <Text style={styles.playIconText}>▶</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Image
                                source={{ uri: image.uri }}
                                style={styles.image}
                                resizeMode="cover"
                                resizeMethod="resize"
                            />
                        )}
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        {disabled ? (
                            <>
                                <Text style={styles.placeholderIcon}>🔒</Text>
                                <Text style={styles.placeholderSubtext}>
                                    Media selection unavailable
                                </Text>
                            </>
                        ) : (
                            <View style={styles.placeholderContent}>
                                {/* Camera Icon with HydraNet Blue Theme */}
                                <View style={styles.cameraIconWrapper}>
                                    <View style={styles.cameraIconBg}>
                                        <MaterialIcons 
                                            name="camera-alt" 
                                            size={60} 
                                            color="#ffffff" 
                                        />
                                    </View>
                                </View>
                                <Text style={styles.placeholderText}>Add photo or video</Text>
                                <Text style={styles.placeholderSmallText}>Tap to capture or upload</Text>
                            </View>
                        )}
                    </View>
                )}
            </TouchableOpacity>

            {image && !disabled && (
                <TouchableOpacity onPress={handleMediaSelection}>
                    <Text style={styles.changeText}>Change Media</Text>
                </TouchableOpacity>
            )}

            {image?.requiresServerCompression && (
                <View style={styles.compressionWarning}>
                    <Text style={styles.compressionWarningText}>
                        ⚙️ Video will be compressed during upload to meet 10MB limit
                    </Text>
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    processingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: '#ecfeff',
    },
    processingText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0891b2',
    },
    imageContainer: {
        width: '100%',
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#ecfeff',
        borderWidth: 2,
        borderColor: '#67e8f9',
        borderStyle: 'dashed',
    },
    imageContainerDisabled: {
        backgroundColor: '#fafafa',
        borderColor: '#d1d5db',
        opacity: 0.5,
    },
    mediaPreview: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    videoPreview: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1f2937',
        width: '100%',
    },
    videoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    playButtonOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(30, 64, 175, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconText: {
        fontSize: 32,
        color: '#ffffff',
        marginLeft: 4,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 64, 175, 0.08)',
        paddingVertical: 20,
    },
    placeholderContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    cameraOverlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    cameraIconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cameraIconBg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(8, 145, 178, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(6, 182, 212, 0.45)',
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0891b2',
        marginTop: 0,
        textAlign: 'center',
        zIndex: 10,
    },
    placeholderSmallText: {
        fontSize: 12,
        color: '#3b5998',
        marginTop: 4,
        textAlign: 'center',
    },
    placeholderIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    placeholderSubtext: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    changeText: {
        color: '#1e40af',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8,
    },
    disabledOverlay: {
        marginTop: 12,
        backgroundColor: '#fef3c7',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    disabledText: {
        fontSize: 13,
        color: '#92400e',
        textAlign: 'center',
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalCameraSection: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalCameraIconBg: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: 'rgba(30, 144, 255, 0.4)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    modalOptions: {
        paddingVertical: 20,
    },
    mediaOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    mediaOptionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginLeft: 16,
    },
    closeButton: {
        marginHorizontal: 20,
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
    },
    compressionWarning: {
        marginTop: 12,
        backgroundColor: '#dbeafe',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#93c5fd',
    },
    compressionWarningText: {
        fontSize: 13,
        color: '#1e40af',
        textAlign: 'center',
        fontWeight: '500',
    },
});