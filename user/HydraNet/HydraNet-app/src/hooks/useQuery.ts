/**
 * HydraNet Mobile - useQuery Hook
 * Hook for fetching and managing cached data
 */

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/lib/api-client';

export interface UseQueryState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isRefetching: boolean;
}

export interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  retryCount?: number;
}

export function useQuery<T = any>(
  queryKey: string | string[],
  queryFn: () => Promise<ApiResponse<T>>,
  options: UseQueryOptions = {}
) {
  const [state, setState] = useState<UseQueryState<T>>({
    data: null,
    error: null,
    isLoading: true,
    isRefetching: false,
  });

  const { enabled = true, refetchInterval, retryCount = 3 } = options;

  /**
   * Fetch data
   */
  const fetch = useCallback(
    async (isRefetch = false) => {
      if (!enabled) return;

      setState((prev) => ({
        ...prev,
        [isRefetch ? 'isRefetching' : 'isLoading']: true,
      }));

      let attempts = 0;
      while (attempts < retryCount) {
        try {
          const response = await queryFn();

          if (response.success && response.data) {
            setState({
              data: response.data,
              error: null,
              isLoading: false,
              isRefetching: false,
            });
            return;
          } else {
            const error = response.error || 'Query failed';
            if (attempts === retryCount - 1) {
              setState({
                data: null,
                error,
                isLoading: false,
                isRefetching: false,
              });
              return;
            }
          }
        } catch (error: any) {
          if (attempts === retryCount - 1) {
            setState({
              data: null,
              error: error.message || 'Network error',
              isLoading: false,
              isRefetching: false,
            });
            return;
          }
        }

        attempts++;
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempts) * 1000)
        );
      }
    },
    [enabled, queryFn, retryCount]
  );

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetch(false);
    }
  }, [enabled, fetch]);

  // Refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      fetch(true);
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetch]);

  /**
   * Refetch data
   */
  const refetch = useCallback(() => fetch(true), [fetch]);

  return {
    ...state,
    refetch,
  };
}

export default useQuery;
