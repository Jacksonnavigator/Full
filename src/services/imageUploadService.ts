/**
 * HydraNet Image Upload Service
 * Handles uploading report and repair submission images to Firebase Storage
 */

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './firebase';
import * as FileSystem from 'expo-file-system';

interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
}

/**
 * Upload report image
 */
export async function uploadReportImage(
  reportIdOrPath: string,
  imagePath: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    // Read image file
    const base64 = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const blob = base64ToBlob(base64, 'image/jpeg');
    const storagePath = `reports/${reportIdOrPath}/${Date.now()}.jpg`;
    const storageRef = ref(storage, storagePath);

    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress({
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress,
            });
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error uploading report image:', error);
    throw error;
  }
}

/**
 * Upload submission image (before/after)
 */
export async function uploadSubmissionImage(
  submissionId: string,
  imagePath: string,
  imageType: 'before' | 'after',
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const blob = base64ToBlob(base64, 'image/jpeg');
    const storagePath = `submissions/${submissionId}/${imageType}-${Date.now()}.jpg`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress({
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress,
            });
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('Error uploading submission image:', error);
    throw error;
  }
}

/**
 * Upload profile photo
 */
export async function uploadProfilePhoto(userId: string, imagePath: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const blob = base64ToBlob(base64, 'image/jpeg');
    const storagePath = `profiles/${userId}/photo-${Date.now()}.jpg`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
}

/**
 * Delete image from storage
 */
export async function deleteImage(storagePath: string): Promise<void> {
  try {
    const imageRef = ref(storage, storagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - allow deletion to fail gracefully
  }
}

/**
 * Delete multiple images
 */
export async function deleteImages(storagePaths: string[]): Promise<void> {
  try {
    await Promise.all(
      storagePaths.map((path) =>
        deleteObject(ref(storage, path)).catch((error) => {
          console.warn(`Failed to delete ${path}:`, error);
        })
      )
    );
  } catch (error) {
    console.error('Error deleting images:', error);
  }
}

/**
 * Get download URL for an image
 */
export async function getImageUrl(storagePath: string): Promise<string> {
  try {
    const imageRef = ref(storage, storagePath);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, contentType: string = 'application/octet-stream'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

/**
 * Compress image before upload (reduce file size)
 * Note: This is a placeholder - actual implementation requires image processing library
 */
export async function compressImage(imagePath: string): Promise<string> {
  // TODO: Implement image compression using expo-image-manipulator or similar
  // For now, return original path
  return imagePath;
}

/**
 * Validate image before upload
 */
export async function validateImage(imagePath: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imagePath);

    if (!fileInfo.exists) {
      return { isValid: false, error: 'Image file does not exist' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (fileInfo.size && fileInfo.size > maxSize) {
      return { isValid: false, error: `Image size exceeds 10MB limit (${fileInfo.size / 1024 / 1024}MB)` };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: `Validation error: ${error}` };
  }
}

/**
 * Batch upload images with error handling
 */
export async function batchUploadImages(
  imagePaths: string[],
  baseStoragePath: string,
  onProgress?: (current: number, total: number) => void
): Promise<{ urls: string[]; errors: string[] }> {
  const results = { urls: [] as string[], errors: [] as string[] };

  for (let i = 0; i < imagePaths.length; i++) {
    try {
      const validation = await validateImage(imagePaths[i]);
      if (!validation.isValid) {
        results.errors.push(validation.error || 'Validation failed');
        continue;
      }

      const url = await uploadReportImage(baseStoragePath, imagePaths[i]);
      results.urls.push(url);

      if (onProgress) {
        onProgress(i + 1, imagePaths.length);
      }
    } catch (error) {
      results.errors.push(`Failed to upload image ${i + 1}: ${error}`);
    }
  }

  return results;
}
