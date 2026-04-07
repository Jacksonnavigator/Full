/**
 * Image Upload Service V2 - Main App
 * Handles authenticated image uploads for engineer workflows.
 */

import * as FileSystem from 'expo-file-system/legacy';
import { getAccessToken } from './apiClient';
import { getEndpointUrl } from './backendConfig';

interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface UploadedImage {
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

const normalizeDownloadUrl = (downloadUrl: string) => {
  if (!downloadUrl) return downloadUrl;
  if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
    return downloadUrl;
  }

  return getEndpointUrl(downloadUrl);
};

export async function uploadImage(
  imagePath: string,
  imageType: 'report' | 'submission_before' | 'submission_after' | 'profile' = 'report',
  reportId?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedImage> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imagePath);
    if (!fileInfo.exists) {
      throw new Error('Selected image was not found on the device.');
    }

    const token = await getAccessToken();
    if (!token) {
      throw new Error('No authentication token available for image upload.');
    }

    const fileName = imagePath.split('/').pop() || 'image.jpg';
    const mimeType = getMimeType(fileName);

    console.log('[ImageUpload] Starting image upload:', { imageType, fileName, reportId });

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

    onProgress?.({
      bytesTransferred: 0,
      totalBytes: fileInfo.size ?? 0,
      progress: 0,
    });

    const response = await fetch(getEndpointUrl('/api/uploads'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Upload failed');
    }

    const uploadedImage = (await response.json()) as UploadedImage;
    const normalizedImage = {
      ...uploadedImage,
      downloadUrl: normalizeDownloadUrl(uploadedImage.downloadUrl),
    };

    onProgress?.({
      bytesTransferred: fileInfo.size ?? 0,
      totalBytes: fileInfo.size ?? 0,
      progress: 100,
    });

    console.log('[ImageUpload] Image uploaded successfully:', normalizedImage.id);

    return normalizedImage;
  } catch (error) {
    console.error('[ImageUpload] Image upload error:', error);
    throw error;
  }
}

export async function uploadImages(
  imagePaths: string[],
  imageType: 'report' | 'submission_before' | 'submission_after' | 'profile' = 'report',
  reportId?: string,
  onProgress?: (index: number, progress: UploadProgress) => void
): Promise<UploadedImage[]> {
  const uploadedImages: UploadedImage[] = [];

  for (let index = 0; index < imagePaths.length; index += 1) {
    const uploaded = await uploadImage(imagePaths[index], imageType, reportId, (progress) => {
      onProgress?.(index, progress);
    });
    uploadedImages.push(uploaded);
  }

  return uploadedImages;
}

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
