/**
 * HydraNet Mobile - Utilities & Managers API Service
 * Centralized utilities and manager API calls
 */

import CONFIG from '@/lib/config';
import { apiClient } from '@/lib/api-client';
import { Utility, DMA, UtilityManager, DMAManager } from '@/lib/types';

export class UtilityService {
  /**
   * Get all utilities
   */
  static async getUtilities() {
    return apiClient.get<Utility[]>(CONFIG.ENDPOINTS.UTILITIES.LIST);
  }

  /**
   * Get single utility
   */
  static async getUtility(utilityId: string) {
    return apiClient.get<Utility>(`${CONFIG.ENDPOINTS.UTILITIES.LIST}/${utilityId}`);
  }

  /**
   * Create utility
   */
  static async createUtility(data: Partial<Utility>) {
    return apiClient.post<Utility>(CONFIG.ENDPOINTS.UTILITIES.LIST, data);
  }

  /**
   * Update utility
   */
  static async updateUtility(utilityId: string, data: Partial<Utility>) {
    return apiClient.put<Utility>(
      `${CONFIG.ENDPOINTS.UTILITIES.LIST}/${utilityId}`,
      data
    );
  }

  /**
   * Delete utility
   */
  static async deleteUtility(utilityId: string) {
    return apiClient.delete(`${CONFIG.ENDPOINTS.UTILITIES.LIST}/${utilityId}`);
  }
}

export class DMAService {
  /**
   * Get all DMAs
   */
  static async getDMAs(filters?: any) {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get<DMA[]>(`${CONFIG.ENDPOINTS.DMAS.LIST}${params}`);
  }

  /**
   * Get DMAs by utility
   */
  static async getDMAsByUtility(utilityId: string) {
    return apiClient.get<DMA[]>(
      `${CONFIG.ENDPOINTS.DMAS.LIST}?utility_id=${utilityId}`
    );
  }

  /**
   * Get single DMA
   */
  static async getDMA(dmaId: string) {
    return apiClient.get<DMA>(`${CONFIG.ENDPOINTS.DMAS.LIST}/${dmaId}`);
  }

  /**
   * Create DMA
   */
  static async createDMA(data: Partial<DMA>) {
    return apiClient.post<DMA>(CONFIG.ENDPOINTS.DMAS.LIST, data);
  }

  /**
   * Update DMA
   */
  static async updateDMA(dmaId: string, data: Partial<DMA>) {
    return apiClient.put<DMA>(
      `${CONFIG.ENDPOINTS.DMAS.LIST}/${dmaId}`,
      data
    );
  }

  /**
   * Delete DMA
   */
  static async deleteDMA(dmaId: string) {
    return apiClient.delete(`${CONFIG.ENDPOINTS.DMAS.LIST}/${dmaId}`);
  }
}

export class UtilityManagerService {
  /**
   * Get all utility managers
   */
  static async getManagers() {
    return apiClient.get<UtilityManager[]>(CONFIG.ENDPOINTS.MANAGERS.UTILITY);
  }

  /**
   * Get single utility manager
   */
  static async getManager(managerId: string) {
    return apiClient.get<UtilityManager>(
      `${CONFIG.ENDPOINTS.MANAGERS.UTILITY}/${managerId}`
    );
  }

  /**
   * Create utility manager
   */
  static async createManager(data: any) {
    return apiClient.post<UtilityManager>(CONFIG.ENDPOINTS.MANAGERS.UTILITY, data);
  }

  /**
   * Update utility manager
   */
  static async updateManager(managerId: string, data: Partial<UtilityManager>) {
    return apiClient.put<UtilityManager>(
      `${CONFIG.ENDPOINTS.MANAGERS.UTILITY}/${managerId}`,
      data
    );
  }

  /**
   * Delete utility manager
   */
  static async deleteManager(managerId: string) {
    return apiClient.delete(`${CONFIG.ENDPOINTS.MANAGERS.UTILITY}/${managerId}`);
  }
}

export class DMAManagerService {
  /**
   * Get all DMA managers
   */
  static async getManagers() {
    return apiClient.get<DMAManager[]>(CONFIG.ENDPOINTS.MANAGERS.DMA);
  }

  /**
   * Get single DMA manager
   */
  static async getManager(managerId: string) {
    return apiClient.get<DMAManager>(
      `${CONFIG.ENDPOINTS.MANAGERS.DMA}/${managerId}`
    );
  }

  /**
   * Create DMA manager
   */
  static async createManager(data: any) {
    return apiClient.post<DMAManager>(CONFIG.ENDPOINTS.MANAGERS.DMA, data);
  }

  /**
   * Update DMA manager
   */
  static async updateManager(managerId: string, data: Partial<DMAManager>) {
    return apiClient.put<DMAManager>(
      `${CONFIG.ENDPOINTS.MANAGERS.DMA}/${managerId}`,
      data
    );
  }

  /**
   * Delete DMA manager
   */
  static async deleteManager(managerId: string) {
    return apiClient.delete(`${CONFIG.ENDPOINTS.MANAGERS.DMA}/${managerId}`);
  }
}

export default {
  UtilityService,
  DMAService,
  UtilityManagerService,
  DMAManagerService,
};
