import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { takePhoto, pickImage, takeVideo, pickVideo } from '../services/ImageService';
import { ImageResult } from '../types';

interface ImagePickerProps {
    image: ImageResult | null;
    onImageSelected: (image: ImageResult) => void;
    disabled?: boolean;
    onVideoPlay?: (video: ImageResult) => void;
    allowVideo?: boolean;
}

const { height } = Dimensions.get('window');

export default function ImagePicker({
    image,
    onImageSelected,
    disabled = false,
    onVideoPlay,
    allowVideo = true,
}: ImagePickerProps) {
    const [showMediaModal, setShowMediaModal] = useState(false);
    const handleMediaSelection = () => {
        if (disabled) {
            Alert.alert(
                'Location Required First',
                'Please capture your GPS location before adding media. This ensures accurate problem reporting.',
                [{ text: 'OK' }]
            );
            return;
        }

        setShowMediaModal(true);
    };

    const closeMediaModal = () => {
        setShowMediaModal(false);
    };

    const handleTakePhoto = async () => {
        try {
            const photo = await takePhoto();
            if (photo) {
                onImageSelected(photo);
                closeMediaModal();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handlePickImage = async () => {
        try {
            const photo = await pickImage();
            if (photo) {
                onImageSelected(photo);
                closeMediaModal();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleTakeVideo = async () => {
        try {
            const video = await takeVideo();
            if (video) {
                onImageSelected(video);
                closeMediaModal();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handlePickVideo = async () => {
        try {
            const video = await pickVideo();
            if (video) {
                onImageSelected(video);
                closeMediaModal();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const getMediaLabel = () => {
        if (!image) return allowVideo ? 'Add photo or video' : 'Add photo';
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
            <TouchableOpacity
                style={[
                    styles.imageContainer,
                    disabled && styles.imageContainerDisabled
                ]}
                onPress={handleMediaSelection}
                activeOpacity={disabled ? 1 : 0.8}
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
                            <Image source={{ uri: image.uri }} style={styles.image} />
                        )}
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        {disabled ? (
                            <>
                                <Text style={styles.placeholderIcon}>🔒</Text>
                                <Text style={styles.placeholderSubtext}>
                                    Capture location first
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
                                <Text style={styles.placeholderText}>{getMediaLabel()}</Text>
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

            {disabled && (
                <View style={styles.disabledOverlay}>
                    <Text style={styles.disabledText}>
                        🔒 Media upload locked until GPS location is obtained
                    </Text>
                </View>
            )}

            {/* Custom Media Selection Modal */}
            <Modal
                visible={showMediaModal}
                transparent={true}
                animationType="slide"
                onRequestClose={closeMediaModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Camera Icon with Transparent Effect */}
                        <View style={styles.modalCameraSection}>
                            <View style={styles.modalCameraIconBg}>
                                <MaterialIcons 
                                    name="camera-alt" 
                                    size={80} 
                                    color="#ffffff" 
                                />
                            </View>
                            <Text style={styles.modalTitle}>Select Media Type</Text>
                            <Text style={styles.modalSubtitle}>
                                {allowVideo
                                    ? 'Add a photo or short video clip (max 60 seconds)'
                                    : 'Add a clear photo of the water problem'}
                            </Text>
                        </View>

                        {/* Media Selection Options */}
                        <View style={styles.modalOptions}>
                            <TouchableOpacity 
                                style={styles.mediaOption}
                                onPress={handleTakePhoto}
                            >
                                <MaterialIcons name="camera-alt" size={28} color="#1e40af" />
                                <Text style={styles.mediaOptionText}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.mediaOption}
                                onPress={handlePickImage}
                            >
                                <MaterialIcons name="image" size={28} color="#1e40af" />
                                <Text style={styles.mediaOptionText}>Choose Photo</Text>
                            </TouchableOpacity>

                            {allowVideo && (
                                <TouchableOpacity 
                                    style={styles.mediaOption}
                                    onPress={handleTakeVideo}
                                >
                                    <MaterialIcons name="videocam" size={28} color="#1e40af" />
                                    <Text style={styles.mediaOptionText}>Record Video</Text>
                                </TouchableOpacity>
                            )}

                            {allowVideo && (
                                <TouchableOpacity 
                                    style={styles.mediaOption}
                                    onPress={handlePickVideo}
                                >
                                    <MaterialIcons name="video-library" size={28} color="#1e40af" />
                                    <Text style={styles.mediaOptionText}>Choose Video</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={closeMediaModal}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        borderWidth: 0,
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
        backgroundColor: 'rgba(30, 144, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(30, 144, 255, 0.5)',
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af',
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
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
        paddingTop: 20,
        maxHeight: height * 0.75,
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
