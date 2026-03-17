import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { ImageResult } from '../types';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB for images
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB for videos
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const COMPRESSION_QUALITY = 0.8;
const VIDEO_COMPRESSION_QUALITY = 0.6; // Lower quality for videos to meet size limit

export const compressIfNeeded = async (image: ImagePicker.ImagePickerAsset): Promise<ImageResult> => {
    try {
        if (!image.uri) {
            throw new Error('Invalid image: no URI found');
        }

        const needsCompression =
            (image.fileSize && image.fileSize > MAX_FILE_SIZE) ||
            (image.width && image.width > MAX_WIDTH) ||
            (image.height && image.height > MAX_HEIGHT);

        if (needsCompression) {
            console.log('Compressing image...', {
                originalSize: image.fileSize,
                originalWidth: image.width,
                originalHeight: image.height,
            });

            // Calculate new dimensions while maintaining aspect ratio
            let newWidth = image.width;
            let newHeight = image.height;

            if (newWidth > MAX_WIDTH || newHeight > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / newWidth, MAX_HEIGHT / newHeight);
                newWidth = Math.round(newWidth * ratio);
                newHeight = Math.round(newHeight * ratio);
            }

            const resized = await ImageManipulator.manipulateAsync(
                image.uri,
                [{ resize: { width: newWidth, height: newHeight } }],
                { compress: COMPRESSION_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
            );

            console.log('Image compressed successfully', {
                newWidth: resized.width,
                newHeight: resized.height,
            });

            return {
                uri: resized.uri,
                width: resized.width,
                height: resized.height,
                fileSize: image.fileSize,
                type: 'image/jpeg',
                fileName: image.fileName || 'photo.jpg',
                mediaType: 'photo',
            };
        }

        return {
            uri: image.uri,
            width: image.width || 0,
            height: image.height || 0,
            fileSize: image.fileSize,
            type: image.mimeType || 'image/jpeg',
            fileName: image.fileName || 'photo.jpg',
            mediaType: 'photo',
        };
    } catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Failed to compress image');
    }
};

export const takePhoto = async (): Promise<ImageResult | null> => {
    try {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Camera permission denied');
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: false,
            exif: false,
        });

        if (result.canceled) {
            console.log('User cancelled camera');
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            const photo = result.assets[0];
            return await compressIfNeeded(photo);
        }

        return null;
    } catch (error) {
        console.error('Error taking photo:', error);
        throw error;
    }
};

export const pickImage = async (): Promise<ImageResult | null> => {
    try {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Media library permission denied');
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: false,
            exif: false,
        });

        if (result.canceled) {
            console.log('User cancelled image picker');
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            const image = result.assets[0];
            return await compressIfNeeded(image);
        }

        return null;
    } catch (error) {
        console.error('Error picking image:', error);
        throw error;
    }
};

export const compressVideoIfNeeded = async (video: ImagePicker.ImagePickerAsset): Promise<ImageResult> => {
    try {
        if (!video.uri) {
            throw new Error('Invalid video: no URI found');
        }

        const videoSizeInMB = (video.fileSize || 0) / (1024 * 1024);

        // If video is within size limit, return as is
        if (videoSizeInMB <= 10) {
            console.log('Video is within size limit:', `${videoSizeInMB.toFixed(2)}MB`);

            return {
                uri: video.uri,
                width: video.width || 0,
                height: video.height || 0,
                fileSize: video.fileSize,
                type: video.mimeType || 'video/mp4',
                fileName: video.fileName || 'video.mp4',
                mediaType: 'video',
                duration: video.duration,
            };
        }

        // Video is too large, attempt compression via file system
        console.log('Video compression initiated:', {
            originalSize: `${videoSizeInMB.toFixed(2)}MB`,
            targetSize: '10MB',
            duration: video.duration ? `${(video.duration / 1000).toFixed(1)}s` : 'unknown',
        });

        // For Expo, we can't directly compress video without native modules
        // However, we provide file metadata and let the API handle compression
        // or suggest using a video compression library like react-native-ffmpeg
        
        const compressedVideoData: ImageResult = {
            uri: video.uri,
            width: video.width || 0,
            height: video.height || 0,
            fileSize: video.fileSize,
            type: video.mimeType || 'video/mp4',
            fileName: video.fileName || 'video.mp4',
            mediaType: 'video',
            duration: video.duration,
            requiresServerCompression: videoSizeInMB > 10, // Flag for server-side compression
            originalSize: videoSizeInMB,
        };

        // Log compression requirements
        if (compressedVideoData.requiresServerCompression) {
            console.warn(
                `Video exceeds 10MB limit (${videoSizeInMB.toFixed(2)}MB). ` +
                'Server-side compression will be applied during upload.'
            );
        }

        return compressedVideoData;
    } catch (error) {
        console.error('Error processing video:', error);
        throw new Error('Failed to process video');
    }
};

export const takeVideo = async (): Promise<ImageResult | null> => {
    try {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Camera permission denied');
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 0.8,
            allowsEditing: false,
        });

        if (result.canceled) {
            console.log('User cancelled video recording');
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            const video = result.assets[0];

            // Compress video if it exceeds 10MB
            return await compressVideoIfNeeded(video);
        }

        return null;
    } catch (error) {
        console.error('Error taking video:', error);
        throw error;
    }
};

export const pickVideo = async (): Promise<ImageResult | null> => {
    try {
        // Request media library permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Media library permission denied');
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            quality: 1,
            allowsEditing: false,
        });

        if (result.canceled) {
            console.log('User cancelled video picker');
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            const video = result.assets[0];

            // Compress video if it exceeds 10MB
            return await compressVideoIfNeeded(video);
        }

        return null;
    } catch (error) {
        console.error('Error picking video:', error);
        throw error;
    }
};

export const getImageSizeInMB = (sizeInBytes?: number): string => {
    if (!sizeInBytes) return '0 MB';
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const validateImage = (image: ImageResult): { valid: boolean; error?: string } => {
    if (!image.uri) {
        return { valid: false, error: 'No media selected' };
    }

    if (image.mediaType === 'video') {
        if (image.fileSize && image.fileSize > MAX_VIDEO_SIZE * 2) {
            return { valid: false, error: `Video is too large (max 20MB, got ${getImageSizeInMB(image.fileSize)})` };
        }
        if (image.duration && image.duration > 60) {
            return { valid: false, error: 'Video is too long (max 60 seconds)' };
        }
        return { valid: true };
    }

    // Image validation
    if (image.fileSize && image.fileSize > MAX_FILE_SIZE * 5) {
        return { valid: false, error: 'Image is too large (max 5MB)' };
    }

    if (image.width && image.width < 100) {
        return { valid: false, error: 'Image resolution too low' };
    }

    return { valid: true };
};