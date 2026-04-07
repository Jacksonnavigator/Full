export interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
}

export interface ImageResult {
    uri: string;
    width: number;
    height: number;
    fileSize?: number;
    type?: string;
    fileName?: string;
    mediaType?: 'photo' | 'video';
    duration?: number; // Duration in seconds for videos
    requiresServerCompression?: boolean; // Flag if video needs server-side compression
    originalSize?: number; // Original size in MB for videos
}

export interface WaterProblem {
    id?: string;
    description: string;
    location: Coordinates;
    image?: ImageResult;
    priority?: 'urgent' | 'moderate';
    timestamp: Date;
    status?: 'pending' | 'in-progress' | 'resolved';
}