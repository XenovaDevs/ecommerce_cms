/**
 * Dashboard Service
 * Single Responsibility: Handle all dashboard-related API interactions
 */

import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { DashboardStats, DashboardData } from '../types/dashboard.types'

/**
 * Dashboard service - encapsulates all dashboard data fetching logic
 */
export class DashboardService {
  /**
   * Fetch dashboard statistics
   * @returns Promise with dashboard stats
   */
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS)
    return data
  }

  /**
   * Fetch complete dashboard data including stats, recent orders, and top products
   * @returns Promise with complete dashboard data
   */
  async getDashboardData(): Promise<DashboardData> {
    const { data } = await apiClient.get<DashboardData>(API_ENDPOINTS.DASHBOARD.STATS)
    return data
  }
}

// Export singleton instance
export const dashboardService = new DashboardService()

// Export default for convenience
export default dashboardService
