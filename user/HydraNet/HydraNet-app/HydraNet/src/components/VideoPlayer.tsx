import React, { useState, useRef } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

interface VideoPlayerProps {
    visible: boolean;
    videoUri: string | null;
    duration?: number;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({ visible, videoUri, duration, onClose }: VideoPlayerProps) {
    const videoRef = useRef<Video>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const handlePlayPause = async () => {
        if (videoRef.current) {
            if (isPlaying) {
                await videoRef.current.pauseAsync();
            } else {
                await videoRef.current.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVideoLoadStart = () => {
        setIsLoading(true);
    };

    const handleVideoLoad = (status: any) => {
        setIsLoading(false);
    };

    const handleVideoStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setCurrentTime(status.positionMillis);
            if (status.didJustFinish) {
                setIsPlaying(false);
            }
        }
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
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Close button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <MaterialIcons name="close" size={32} color="#ffffff" />
                </TouchableOpacity>

                {/* Video container */}
                <View style={styles.videoContainer}>
                    {videoUri && (
                        <>
                            <Video
                                ref={videoRef}
                                source={{ uri: videoUri }}
                                style={styles.video}
                                resizeMode={ResizeMode.CONTAIN}
                                onLoadStart={handleVideoLoadStart}
                                onLoad={handleVideoLoad}
                                onPlaybackStatusUpdate={handleVideoStatusUpdate}
                                progressUpdateIntervalMillis={500}
                                useNativeControls={false}
                                shouldPlay={false}
                            />
                            
                            {isLoading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#ffffff" />
                                    <Text style={styles.loadingText}>Loading video...</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* Video controls */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={styles.playButton}
                        onPress={handlePlayPause}
                    >
                        <MaterialIcons
                            name={isPlaying ? 'pause' : 'play-arrow'}
                            size={48}
                            color="#ffffff"
                        />
                    </TouchableOpacity>

                    {/* Time info */}
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </Text>
                    </View>
                </View>

                {/* Video info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>📹 Video Preview</Text>
                    <Text style={styles.infoSubtext}>
                        Duration: {formatTime(duration)} • Tap to play/pause
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
    controlsContainer: {
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(30, 64, 175, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeContainer: {
        marginTop: 12,
    },
    timeText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
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
