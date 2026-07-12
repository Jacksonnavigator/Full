import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { ImageResult } from '../types';

const REPORT_DRAFT_KEY = 'majiscope_report_draft_v1';

export interface ReportDraft {
    image: ImageResult | null;
    savedAt: string;
}

export async function saveReportDraftImage(image: ImageResult): Promise<void> {
    const draft: ReportDraft = {
        image,
        savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(REPORT_DRAFT_KEY, JSON.stringify(draft));
}

export async function loadReportDraftImage(): Promise<ImageResult | null> {
    try {
        const stored = await AsyncStorage.getItem(REPORT_DRAFT_KEY);
        if (!stored) {
            return null;
        }

        const draft = JSON.parse(stored) as ReportDraft;
        if (!draft?.image?.uri) {
            return null;
        }

        const fileInfo = await FileSystem.getInfoAsync(draft.image.uri);
        if (!fileInfo.exists) {
            await clearReportDraft();
            return null;
        }

        return draft.image;
    } catch (error) {
        console.warn('[ReportDraft] Failed to restore draft image:', error);
        return null;
    }
}

export async function clearReportDraft(): Promise<void> {
    await AsyncStorage.removeItem(REPORT_DRAFT_KEY);
}
