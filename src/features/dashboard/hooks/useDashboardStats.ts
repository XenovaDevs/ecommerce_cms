/**
 * Dashboard Stats Hook
 * Single Responsibility: Manage dashboard statistics data fetching and state
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard.service'
import { DashboardData } from '../types/dashboard.types'

/**
 * Query key factory for dashboard queries
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
}

/**
 * Hook to fetch dashboard statistics
 * Automatically refetches every 5 minutes to keep data fresh
 *
 * @param refetchInterval - Custom refetch interval in ms (default: 5 minutes)
 * @returns Query result with dashboard data
 */
export function useDashboardStats(
  refetchInterval: number = 5 * 60 * 1000 // 5 minutes
): UseQueryResult<DashboardData, Error> {
  return useQuery<DashboardData, Error>({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getDashboardData(),
    refetchInterval,
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })
}
