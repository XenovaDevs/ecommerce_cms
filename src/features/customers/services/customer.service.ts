/**
 * Customer Service
 * Single Responsibility: Handle all customer-related API communications
 * Dependency Inversion: Depends on API client abstraction
 */

import api from '@/lib/api';
import {
  Customer,
  CustomerFilters,
  CustomerListResponse,
  CustomerDetailData,
} from '../types/customer.types';

/**
 * Service class for customer operations
 * Follows Single Responsibility: Only handles customer data fetching
 */
class CustomerService {
  private readonly basePath = '/admin/customers';

  /**
   * Fetch paginated list of customers with optional filters
   * @param filters - Search and pagination filters
   * @returns Promise with customer list and pagination data
   */
  async list(filters?: CustomerFilters): Promise<CustomerListResponse> {
    const params = this.buildQueryParams(filters);
    const response = await api.get<CustomerListResponse>(this.basePath, {
      params,
    });
    return response.data;
  }

  /**
   * Fetch single customer by ID with order history
   * @param id - Customer identifier
   * @returns Promise with customer details
   */
  async get(id: number): Promise<CustomerDetailData> {
    const response = await api.get<CustomerDetailData>(
      `${this.basePath}/${id}`
    );
    return response.data;
  }

  /**
   * Build query parameters from filters
   * Private method following clean code principles
   */
  private buildQueryParams(filters?: CustomerFilters): Record<string, any> {
    if (!filters) return {};

    const params: Record<string, any> = {};

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.is_active !== undefined && filters.is_active !== null) {
      params.is_active = filters.is_active ? 1 : 0;
    }

    if (filters.page) {
      params.page = filters.page;
    }

    if (filters.per_page) {
      params.per_page = filters.per_page;
    }

    return params;
  }
}

// Export singleton instance
export const customerService = new CustomerService();
export default customerService;
