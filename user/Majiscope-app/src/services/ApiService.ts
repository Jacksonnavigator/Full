import { ImageResult, Coordinates } from '../types';
import {
    submitWaterProblem as submitReportToBackend,
    getReportHistory as fetchReportHistory,
    lookupReportByTrackingId as lookupPublicReportByTrackingId,
    getPublicHistorySyncKey as fetchPublicHistorySyncKey,
    setPublicHistorySyncKey as savePublicHistorySyncKey,
} from './reportService';

export interface WaterProblem {
    description: string;
    image?: ImageResult;
    location: Coordinates;
    address?: string;
    regionName?: string;
    districtName?: string;
    priority: 'urgent' | 'moderate' | 'low';
    reportType?: 'leakage' | 'non_leakage';
    leakageType?: 'ground_leakage' | 'pipe_burst' | 'meter_leakage' | 'valve_leakage' | 'overflow' | 'unknown' | null;
    timestamp: Date;
}

export async function submitWaterProblem(problem: WaterProblem): Promise<any> {
    try {
        const response = await submitReportToBackend({
            description: problem.description,
            latitude: problem.location.latitude,
            longitude: problem.location.longitude,
            address: problem.address,
            region_name: problem.regionName,
            district_name: problem.districtName,
            priority: problem.priority,
            report_type: problem.reportType || 'leakage',
            leakage_type: problem.reportType === 'non_leakage' ? null : problem.leakageType || 'unknown',
            image: problem.image,
        });

        return response;
    } catch (error) {
        console.error('[ApiService] Error submitting water problem:', error);
        throw error;
    }
}

export async function getReportHistory(): Promise<any[]> {
    try {
        return await fetchReportHistory(50);
    } catch (error) {
        console.error('[ApiService] Error fetching report history:', error);
        return [];
    }
}

export async function lookupReportByTrackingId(trackingId: string): Promise<any | null> {
    try {
        return await lookupPublicReportByTrackingId(trackingId);
    } catch (error) {
        console.error('[ApiService] Error looking up report by tracking ID:', error);
        return null;
    }
}

export async function getPublicHistorySyncKey(): Promise<string> {
    return fetchPublicHistorySyncKey();
}

export async function setPublicHistorySyncKey(historyKey: string): Promise<void> {
    await savePublicHistorySyncKey(historyKey);
}
