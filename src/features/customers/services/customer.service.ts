/**
 * Customer Service
 * Single Responsibility: Handle all customer-related API communications
 * Dependency Inversion: Depends on API client abstraction
 */

import apiClient from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import { PaginatedResponse } from '@/types/api.types';
import {
  Customer,
  CustomerFilters,
  CustomerDetailData,
} from '../types/customer.types';

/**
 * Service class for customer operations
 * Follows Single Responsibility: Only handles customer data fetching
 */
type CustomerQueryParams = Record<string, string | number>;

class CustomerService {
  /**
   * Fetch paginated list of customers with optional filters
   * @param filters - Search and pagination filters
   * @returns Promise with customer list and pagination data
   */
  async list(filters?: CustomerFilters): Promise<PaginatedResponse<Customer>> {
    const params = this.buildQueryParams(filters);
    const { data } = await apiClient.get<PaginatedResponse<Customer>>(
      API_ENDPOINTS.CUSTOMERS.LIST,
      { params }
    );
    return data;
  }

  /**
   * Fetch single customer by ID with order history
   * @param id - Customer identifier
   * @returns Promise with customer details
   */
  async get(id: number): Promise<CustomerDetailData> {
    const { data } = await apiClient.get<CustomerDetailData>(
      API_ENDPOINTS.CUSTOMERS.GET(id)
    );
    return data;
  }

  /**
   * Build query parameters from filters
   * Private method following clean code principles
   */
  private buildQueryParams(filters?: CustomerFilters): CustomerQueryParams {
    if (!filters) return {};

    const params: CustomerQueryParams = {};

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
