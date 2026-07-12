import React, { useState } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ActivityIndicator,
    Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface VideoPlayerProps {
    visible: boolean;
    videoUri: string | null;
    duration?: number;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({ visible, videoUri, duration, onClose }: VideoPlayerProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleVideoLoadStart = () => {
        setIsLoading(true);
    };

    const handleVideoLoad = () => {
        setIsLoading(false);
    };

    const formatTime = (milliseconds?: number) => {
        if (!milliseconds) return '0:00';
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <MaterialIcons name="close" size={32} color="#ffffff" />
                </TouchableOpacity>

                <View style={styles.videoContainer}>
                    {videoUri ? (
                        <>
                            <Image
                                source={{ uri: videoUri }}
                                style={styles.video}
                                resizeMode="contain"
                                onLoadStart={handleVideoLoadStart}
                                onLoad={handleVideoLoad}
                            />

                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#ffffff" />
                                    <Text style={styles.loadingText}>Preparing preview...</Text>
                                </View>
                            ) : null}
                        </>
                    ) : null}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Video Preview</Text>
                    <Text style={styles.infoSubtext}>
                        Duration: {formatTime(duration)} | Use the player controls to play, pause, seek, and view fullscreen
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
        padding: 8,
    },
    videoContainer: {
        width: '100%',
        height: width > height ? height * 0.8 : width * 1.2,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    loadingText: {
        color: '#ffffff',
        marginTop: 12,
        fontSize: 14,
    },
    infoContainer: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
    },
    infoText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    infoSubtext: {
        color: '#d1d5db',
        fontSize: 13,
        textAlign: 'center',
    },
});
