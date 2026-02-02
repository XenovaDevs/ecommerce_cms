import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { Order, OrderFilters, UpdateOrderStatusPayload } from '../types/order.types'
import { PaginatedResponse } from '@/types/api.types'

/**
 * Order Service
 * Handles all API interactions related to orders
 * Follows the Single Responsibility Principle - only concerned with data fetching
 */
export const orderService = {
  /**
   * Retrieve paginated list of orders with optional filters
   */
  async list(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const { data } = await apiClient.get<PaginatedResponse<Order>>(
      API_ENDPOINTS.ORDERS.LIST,
      { params: filters }
    )
    return data
  },

  /**
   * Retrieve a single order by ID
   */
  async get(id: number): Promise<Order> {
    const { data } = await apiClient.get<Order>(API_ENDPOINTS.ORDERS.GET(id))
    return data
  },

  /**
   * Update order status with optional notes
   */
  async updateStatus(id: number, payload: UpdateOrderStatusPayload): Promise<Order> {
    const { data } = await apiClient.put<Order>(
      API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
      payload
    )
    return data
  },
}
