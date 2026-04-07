/**
 * Public media helpers for the HydraNet user app.
 *
 * The public reporting flow is anonymous, so it cannot rely on the backend's
 * authenticated upload endpoint. Instead, we serialize photos into portable
 * data URIs that the anonymous report API can store directly on the report.
 */

import * as FileSystem from 'expo-file-system/legacy';
import { getEndpointUrl } from './backendConfig';
import { getAccessToken } from './apiClient';

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

export async function uploadAnonymousImage(imagePath: string): Promise<UploadedImage> {
  const fileInfo = await FileSystem.getInfoAsync(imagePath);
  if (!fileInfo.exists) {
    throw new Error('Selected photo could not be found on this device.');
  }

  const fileName = imagePath.split('/').pop() || 'image.jpg';
  const mimeType = getMimeType(fileName);

  const formData = new FormData();
  formData.append('file', {
    uri: imagePath,
    type: mimeType,
    name: fileName,
  } as any);
  formData.append('image_type', 'report');

  const response = await fetch(getEndpointUrl('/api/uploads/public'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Public upload failed: ${response.status}`);
  }

  return (await response.json()) as UploadedImage;
}

export async function encodeImageAsDataUri(
  imagePath: string,
  mimeType?: string
): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(imagePath);
  if (!fileInfo.exists) {
    throw new Error('Selected photo could not be found on this device.');
  }

  const base64 = await FileSystem.readAsStringAsync(imagePath, {
    encoding: 'base64',
  });

  const resolvedMimeType = mimeType || getMimeType(imagePath);
  return `data:${resolvedMimeType};base64,${base64}`;
}

/**
 * Authenticated upload support for future signed-in flows.
 * The current public user app does not depend on this path.
 */
export async function uploadImage(
  imagePath: string,
  reportId?: string
): Promise<UploadedImage> {
  const fileInfo = await FileSystem.getInfoAsync(imagePath);
  if (!fileInfo.exists) {
    throw new Error('Selected photo could not be found on this device.');
  }

  const token = await getAccessToken();
  if (!token) {
    throw new Error('Signed-in upload is unavailable without a valid account session.');
  }

  const fileName = imagePath.split('/').pop() || 'image.jpg';
  const mimeType = getMimeType(fileName);

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

  const response = await fetch(getEndpointUrl('/api/uploads'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Upload failed: ${response.status}`);
  }

  return (await response.json()) as UploadedImage;
}

export async function uploadImages(
  imagePaths: string[],
  reportId?: string
): Promise<UploadedImage[]> {
  const uploads: UploadedImage[] = [];

  for (const imagePath of imagePaths) {
    uploads.push(await uploadImage(imagePath, reportId));
  }

  return uploads;
}

function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    heic: 'image/heic',
    heif: 'image/heif',
  };

  return mimeTypes[extension || ''] || 'image/jpeg';
}
