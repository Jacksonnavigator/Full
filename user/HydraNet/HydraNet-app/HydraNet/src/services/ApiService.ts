import { submitWaterProblem as submitReportToBackend, getReportHistory as fetchReportHistory } from './reportService';
import { ImageResult, Coordinates } from '../types';

/**
 * @deprecated Use submitReportToBackend from reportService instead
 * Compatibility wrapper for old API
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
    console.log('📤 Submitting water problem report...', {
      description: problem.description,
      latitude: problem.location.latitude,
      longitude: problem.location.longitude,
      priority: problem.priority,
    });

    // Call the new backend service
    const response = await submitReportToBackend({
      description: problem.description,
      latitude: problem.location.latitude,
      longitude: problem.location.longitude,
      priority: problem.priority,
      image_url: problem.image?.uri,
    });

    console.log('✅ Water problem reported successfully!', response.id);
    return response;
  } catch (error) {
    console.error('❌ Error submitting water problem:', error);
    throw error;
  }
}

export async function getReportHistory(): Promise<any[]> {
  try {
    console.log('📋 Fetching report history from backend...');
    const reports = await fetchReportHistory(50);
    console.log('✅ Report history fetched:', reports.length, 'reports');
    return reports;
  } catch (error) {
    console.error('❌ Error fetching report history:', error);
    return [];
  }
}