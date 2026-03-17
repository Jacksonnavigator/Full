/**
 * Image Upload Service V2 - Main App
 * Handles image upload to backend with FormData
 */

import * as FileSystem from 'expo-file-system';
import { apiRequest } from './apiClient';

interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
}

interface UploadedImage {
  id: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  mimeType: string;
  imageType: string;
  createdAt: string;
  downloadUrl: string;
}

/**
 * Upload image to backend
 */
export async function uploadImage(
  imagePath: string,
  imageType: 'report' | 'submission_before' | 'submission_after' | 'profile' = 'report',
  reportId?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedImage> {
  try {
    console.log('📤 Starting image upload:', imagePath);

    // Read file as base64
    const base64Data = await FileSystem.readAsStringAsync(imagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    const fileName = imagePath.split('/').pop() || 'image.jpg';
    const mimeType = getMimeType(fileName);

    console.log('📋 Image info:', {
      fileName,
      size: fileInfo.size,
      mimeType,
    });

    // Create FormData
    const formData = new FormData();
    formData.append('file', {
      uri: imagePath,
      type: mimeType,
      name: fileName,
    } as any);
    formData.append('image_type', imageType);
    if (reportId) {
      formData.append('report_id', reportId);
    }

    // Upload to backend
    const token = await getAccessToken();
    const response = await fetch('http://localhost:8000/api/uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    const uploadedImage: UploadedImage = await response.json();
    
    console.log('✅ Image uploaded successfully:', uploadedImage.id);
    
    return uploadedImage;
  } catch (error) {
    console.error('❌ Image upload error:', error);
    throw error;
  }
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  imagePaths: string[],
  imageType: 'report' | 'submission_before' | 'submission_after' | 'profile' = 'report',
  reportId?: string,
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<UploadedImage[]> {
  try {
    const uploadedImages: UploadedImage[] = [];

    for (let i = 0; i < imagePaths.length; i++) {
      console.log(`📤 Uploading image ${i + 1}/${imagePaths.length}...`);
      
      const uploaded = await uploadImage(
        imagePaths[i],
        imageType,
        reportId,
        (progress) => {
          if (onProgress) {
            onProgress(i, progress);
          }
        }
      );
      
      uploadedImages.push(uploaded);
    }

    console.log('✅ All images uploaded:', uploadedImages.length);
    
    return uploadedImages;
  } catch (error) {
    console.error('❌ Batch upload error:', error);
    throw error;
  }
}

/**
 * Delete image from backend
 */
export async function deleteImage(imageId: string): Promise<void> {
  try {
    const response = await apiRequest(
      `/api/uploads/${imageId}`,
      'DELETE'
    );
    console.log('✅ Image deleted:', imageId);
  } catch (error) {
    console.error('❌ Delete image error:', error);
    throw error;
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  return mimeTypes[extension || ''] || 'image/jpeg';
}

/**
 * Import from apiClient
 */
import { getAccessToken } from './apiClient';
