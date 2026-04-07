import { submitWaterProblem as submitReportToBackend, getReportHistory as fetchReportHistory } from './reportService';
import { getReportsEndpoint } from './backendConfig';
import { apiGet } from './apiClient';
import { ImageResult, Coordinates } from '../types';

/**
 * Compatibility wrapper for legacy imports inside the public user app.
 */
export interface WaterProblem {
  description: string;
  image?: ImageResult;
  location: Coordinates;
  priority: 'urgent' | 'moderate' | 'low';
  timestamp: Date;
}

export async function submitWaterProblem(problem: WaterProblem): Promise<any> {
  try {
    console.log('[ApiService] Submitting water problem report...', {
      description: problem.description,
      latitude: problem.location.latitude,
      longitude: problem.location.longitude,
      priority: problem.priority,
    });

    const response = await submitReportToBackend({
      description: problem.description,
      latitude: problem.location.latitude,
      longitude: problem.location.longitude,
      priority: problem.priority,
      image: problem.image,
    });

    console.log('[ApiService] Water problem reported successfully:', response.id);
    return response;
  } catch (error) {
    console.error('[ApiService] Error submitting water problem:', error);
    throw error;
  }
}

export async function getReportHistory(): Promise<any[]> {
  try {
    console.log('[ApiService] Fetching report history...');
    const reports = await fetchReportHistory(50);
    console.log('[ApiService] Report history fetched:', reports.length);
    return reports;
  } catch (error) {
    console.error('[ApiService] Error fetching report history:', error);
    return [];
  }
}

export async function getReportsByUtilityAndDMA(utilityId: string, dmaId: string): Promise<any[]> {
  try {
    console.log(`[ApiService] Fetching reports for utility ${utilityId}, DMA ${dmaId}...`);
    const data = await apiGet<any>(`${getReportsEndpoint()}`, {
      params: { utility_id: utilityId, dma_id: dmaId, limit: 100 },
    });

    const reports = data.items || data || [];
    console.log('[ApiService] Reports fetched:', reports.length);
    return reports;
  } catch (error) {
    console.error('[ApiService] Error fetching reports:', error);
    return [];
  }
}
