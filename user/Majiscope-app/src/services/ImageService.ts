import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { ImageResult } from '../types';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB for images
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB for videos
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;

function resolveMediaUri(sourceUri: string): string {
    if (!sourceUri || typeof sourceUri !== 'string') {
        throw new Error('Invalid media: no URI found');
    }

    return sourceUri;
}

const getExtensionFromAsset = (asset: ImagePicker.ImagePickerAsset, fallback: string): string => {
    const fileNameExtension = typeof asset.fileName === 'string' ? asset.fileName.split('.').pop() : undefined;
    if (fileNameExtension && fileNameExtension.length <= 5) {
        return fileNameExtension.toLowerCase();
    }

    const mimeExtension = typeof asset.mimeType === 'string' ? asset.mimeType.split('/').pop() : undefined;
    return mimeExtension || fallback;
};

const persistMediaFile = async (
    asset: ImagePicker.ImagePickerAsset,
    fallbackExtension: string
): Promise<string> => {
    const sourceUri = resolveMediaUri(asset.uri);

    if (!FileSystem.documentDirectory) {
        return sourceUri;
    }

    try {
        const directory = `${FileSystem.documentDirectory}report-media/`;
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        const extension = getExtensionFromAsset(asset, fallbackExtension);
        const destination = `${directory}${Date.now()}-${Math.round(Math.random() * 1_000_000)}.${extension}`;
        await FileSystem.copyAsync({ from: sourceUri, to: destination });
        return destination;
    } catch (error) {
        console.warn('Failed to persist media file, using original URI:', error);
        return sourceUri;
    }
};

export const compressIfNeeded = async (image: ImagePicker.ImagePickerAsset): Promise<ImageResult> => {
    try {
        const asset = image as ImagePicker.ImagePickerAsset & {
            width?: unknown;
            height?: unknown;
            fileSize?: unknown;
            mimeType?: unknown;
            fileName?: unknown;
            uri?: unknown;
        };

        if (!asset?.uri || typeof asset.uri !== 'string') {
            throw new Error('Invalid image: no URI found');
        }

        const width = typeof asset.width === 'number' && Number.isFinite(asset.width) ? asset.width : MAX_WIDTH;
        const height = typeof asset.height === 'number' && Number.isFinite(asset.height) ? asset.height : MAX_HEIGHT;
        const stableUri = await persistMediaFile(asset, 'jpg');

        return {
            uri: stableUri,
            width,
            height,
            fileSize: typeof asset.fileSize === 'number' ? asset.fileSize : undefined,
            type: typeof asset.mimeType === 'string' ? asset.mimeType : 'image/jpeg',
            fileName: typeof asset.fileName === 'string' ? asset.fileName : 'photo.jpg',
            mediaType: 'photo',
        };
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
    }
};

export const takePhoto = async (): Promise<ImageResult | null> => {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Camera permission denied');
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            allowsEditing: false,
            exif: false,
        });

        if (result.canceled) {
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            return await compressIfNeeded(result.assets[0]);
        }

        return null;
    } catch (error) {
        console.error('Error taking photo:', error);
        throw error;
    }
};

export const pickImage = async (): Promise<ImageResult | null> => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Media library permission denied');
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
            allowsEditing: false,
            exif: false,
        });

        if (result.canceled) {
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            return await compressIfNeeded(result.assets[0]);
        }

        return null;
    } catch (error) {
        console.error('Error picking image:', error);
        throw error;
    }
};

export const compressVideoIfNeeded = async (video: ImagePicker.ImagePickerAsset): Promise<ImageResult> => {
    try {
        const asset = video as ImagePicker.ImagePickerAsset & {
            width?: unknown;
            height?: unknown;
            fileSize?: unknown;
            mimeType?: unknown;
            fileName?: unknown;
            uri?: unknown;
            duration?: unknown;
        };

        if (!asset?.uri || typeof asset.uri !== 'string') {
            throw new Error('Invalid video: no URI found');
        }

        const videoSizeInMB = typeof asset.fileSize === 'number' ? (asset.fileSize || 0) / (1024 * 1024) : 0;
        const stableUri = await persistMediaFile(asset, 'mp4');

        return {
            uri: stableUri,
            width: typeof asset.width === 'number' && Number.isFinite(asset.width) ? asset.width : 0,
            height: typeof asset.height === 'number' && Number.isFinite(asset.height) ? asset.height : 0,
            fileSize: typeof asset.fileSize === 'number' ? asset.fileSize : undefined,
            type: typeof asset.mimeType === 'string' ? asset.mimeType : 'video/mp4',
            fileName: typeof asset.fileName === 'string' ? asset.fileName : 'video.mp4',
            mediaType: 'video',
            duration: typeof asset.duration === 'number' ? asset.duration : undefined,
            requiresServerCompression: videoSizeInMB > 10,
            originalSize: videoSizeInMB,
        };
    } catch (error) {
        console.error('Error processing video:', error);
        throw new Error('Failed to process video');
    }
};

export const takeVideo = async (): Promise<ImageResult | null> => {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Camera permission denied');
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['videos'],
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
            allowsEditing: false,
        });

        if (result.canceled) {
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            return await compressVideoIfNeeded(result.assets[0]);
        }

        return null;
    } catch (error) {
        console.error('Error taking video:', error);
        throw error;
    }
};

export const pickVideo = async (): Promise<ImageResult | null> => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Media library permission denied');
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: false,
        });

        if (result.canceled) {
            return null;
        }

        if (result.assets && result.assets.length > 0) {
            return await compressVideoIfNeeded(result.assets[0]);
        }

        return null;
    } catch (error) {
        console.error('Error picking video:', error);
        throw error;
    }
};

export const recoverPendingMediaResult = async (): Promise<ImageResult | null> => {
    try {
        const pendingResult = await ImagePicker.getPendingResultAsync();

        if (!pendingResult) {
            return null;
        }

        if ('code' in pendingResult) {
            console.warn('Pending image picker result failed:', pendingResult.message);
            return null;
        }

        if (pendingResult.canceled || !pendingResult.assets?.length) {
            return null;
        }

        const pendingAsset = pendingResult.assets[0];
        if (pendingAsset.type === 'video') {
            return await compressVideoIfNeeded(pendingAsset);
        }

        return await compressIfNeeded(pendingAsset);
    } catch (error) {
        console.warn('Failed to recover pending media result:', error);
        return null;
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

    if (image.fileSize && image.fileSize > MAX_FILE_SIZE * 5) {
        return { valid: false, error: 'Image is too large (max 5MB)' };
    }

    if (image.width && image.width < 100) {
        return { valid: false, error: 'Image resolution too low' };
    }

    return { valid: true };
};