/**
 * HydraNet Mobile - useApi Hook
 * Generic hook for handling API requests
 */

import { useState, useCallback } from 'react';
import { ApiResponse } from '@/lib/api-client';

export interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
  });

  /**
   * Execute API request
   */
  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      setState({
        data: null,
        error: null,
        isLoading: true,
        isSuccess: false,
      });

      try {
        const response = await apiCall();

        if (response.success && response.data) {
          setState({
            data: response.data,
            error: null,
            isLoading: false,
            isSuccess: true,
          });
          return { success: true, data: response.data };
        } else {
          const errorMsg = response.error || 'Request failed';
          setState({
            data: null,
            error: errorMsg,
            isLoading: false,
            isSuccess: false,
          });
          return { success: false, error: errorMsg };
        }
      } catch (error: any) {
        const errorMsg = error.message || 'Network error';
        setState({
          data: null,
          error: errorMsg,
          isLoading: false,
          isSuccess: false,
        });
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    clearError,
  };
}

export default useApi;
