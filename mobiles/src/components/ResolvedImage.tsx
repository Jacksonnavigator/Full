import React, { useEffect, useState } from 'react';
import { Image, ImageResizeMode, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Buffer } from 'buffer';

type UploadImageResponse = {
  mimeType?: string;
  data?: string;
};

export const isUploadReference = (uri: string) => /\/api\/uploads\/[^/?#]+$/i.test(uri.split('?')[0]);

export const inferMediaKind = (uri: string): 'image' | 'video' | 'file' => {
  const cleanUri = uri.split('?')[0].toLowerCase();

  if (cleanUri.startsWith('data:image/')) return 'image';
  if (cleanUri.startsWith('data:video/')) return 'video';
  if (isUploadReference(cleanUri)) return 'image';
  if (/\.(jpg|jpeg|png|gif|webp|bmp|heic|heif)$/i.test(cleanUri)) return 'image';
  if (/\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(cleanUri)) return 'video';
  return 'file';
};

const convertUploadHexToDataUri = (mimeType: string, hexData: string) => {
  const pairs = hexData.trim().match(/.{1,2}/g) ?? [];
  const bytes = Uint8Array.from(pairs.map((pair) => parseInt(pair, 16)));
  const base64 = Buffer.from(bytes).toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

type Props = {
  uri: string;
  style: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
  fallbackContainerStyle?: StyleProp<ViewStyle>;
  fallbackText?: string;
};

export const ResolvedImage: React.FC<Props> = ({
  uri,
  style,
  resizeMode = 'cover',
  fallbackContainerStyle,
  fallbackText = 'Photo unavailable',
}) => {
  const [resolvedUri, setResolvedUri] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const resolveImage = async () => {
      setLoadFailed(false);

      if (!isUploadReference(uri)) {
        setResolvedUri(uri);
        return;
      }

      try {
        const response = await fetch(uri);
        const payload = (await response.json()) as UploadImageResponse;

        if (!response.ok || !payload.mimeType || !payload.data) {
          throw new Error('Image payload unavailable');
        }

        if (active) {
          setResolvedUri(convertUploadHexToDataUri(payload.mimeType, payload.data));
        }
      } catch (error) {
        console.warn('[ResolvedImage] Unable to resolve uploaded image:', error);
        if (active) {
          setResolvedUri(null);
          setLoadFailed(true);
        }
      }
    };

    void resolveImage();

    return () => {
      active = false;
    };
  }, [uri]);

  if (resolvedUri) {
    return (
      <Image
        source={{ uri: resolvedUri }}
        style={style}
        resizeMode={resizeMode}
        onError={() => {
          setResolvedUri(null);
          setLoadFailed(true);
        }}
      />
    );
  }

  return (
    <View style={[styles.fallback, fallbackContainerStyle]}>
      <Ionicons name="image-outline" size={24} color={loadFailed ? '#94a3b8' : '#1d4ed8'} />
      <Text style={styles.fallbackText}>
        {loadFailed ? fallbackText : 'Loading photo...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  fallbackText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ResolvedImage;
