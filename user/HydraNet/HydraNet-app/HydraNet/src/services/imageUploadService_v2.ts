/**
 * Image Upload Service V2 - User App
 * Handles image upload to backend with FormData
 */

import * as FileSystem from 'expo-file-system';
import { getAccessToken } from './apiClient';

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
  reportId?: string
): Promise<UploadedImage> {
  try {
    console.log('📤 Starting image upload:', imagePath);

    // Get file info
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    const fileName = imagePath.split('/').pop() || 'image.jpg';
    const mimeType = getMimeType(fileName);

    console.log('📋 Image info:', {
      fileName,
      size: (fileInfo.size || 0) / 1024,
      mimeType,
    });

    // Create FormData
    const formData = new FormData();
    formData.append('file', {
      uri: imagePath,
      type: mimeType,
      name: fileName,
    } as any);
    formData.append('image_type', 'report');
    if (reportId) {
      formData.append('report_id', reportId);
    }

    // Upload to backend
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8000/api/uploads', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Upload failed: ${response.status}`);
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
  reportId?: string
): Promise<UploadedImage[]> {
  try {
    const uploadedImages: UploadedImage[] = [];

    for (let i = 0; i < imagePaths.length; i++) {
      console.log(`📤 Uploading image ${i + 1}/${imagePaths.length}...`);
      
      const uploaded = await uploadImage(imagePaths[i], reportId);
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
