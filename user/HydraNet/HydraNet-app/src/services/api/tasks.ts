/**
 * HydraNet Mobile - Task API Service
 * Centralized task/report API calls
 */

import CONFIG from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { Report } from '@/lib/types';

export class TaskService {
  /**
   * Get all tasks/reports
   */
  static async getTasks(filters?: any) {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get<Report[]>(`${CONFIG.ENDPOINTS.TASKS.LIST}${params}`);
  }

  /**
   * Get single task/report details
   */
  static async getTaskDetail(taskId: string) {
    return apiClient.get<Report>(
      CONFIG.ENDPOINTS.TASKS.DETAIL.replace(':id', taskId)
    );
  }

  /**
   * Create new task/report
   */
  static async createTask(data: Partial<Report>) {
    return apiClient.post<Report>(CONFIG.ENDPOINTS.TASKS.CREATE, data);
  }

  /**
   * Update task/report
   */
  static async updateTask(taskId: string, data: Partial<Report>) {
    return apiClient.put<Report>(
      CONFIG.ENDPOINTS.TASKS.UPDATE.replace(':id', taskId),
      data
    );
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(taskId: string, status: string) {
    return apiClient.patch<Report>(
      CONFIG.ENDPOINTS.TASKS.UPDATE.replace(':id', taskId),
      { status }
    );
  }

  /**
   * Delete task
   */
  static async deleteTask(taskId: string) {
    return apiClient.delete(
      CONFIG.ENDPOINTS.TASKS.UPDATE.replace(':id', taskId)
    );
  }

  /**
   * Get tasks by utility
   */
  static async getTasksByUtility(utilityId: string) {
    return apiClient.get<Report[]>(
      `${CONFIG.ENDPOINTS.TASKS.LIST}?utility_id=${utilityId}`
    );
  }

  /**
   * Get tasks by DMA
   */
  static async getTasksByDMA(dmaId: string) {
    return apiClient.get<Report[]>(
      `${CONFIG.ENDPOINTS.TASKS.LIST}?dma_id=${dmaId}`
    );
  }

  /**
   * Assign task to engineer
   */
  static async assignTask(taskId: string, engineerId: string) {
    return apiClient.patch<Report>(
      CONFIG.ENDPOINTS.TASKS.UPDATE.replace(':id', taskId),
      { assigned_engineer_id: engineerId }
    );
  }
}

export default TaskService;
