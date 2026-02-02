/**
 * Customer domain types
 * Single Responsibility: Define customer-related type contracts
 */

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  orders_count: number;
  total_spent: number;
  created_at: string;
}

export interface CustomerFilters {
  search?: string;
  is_active?: boolean | null;
  page?: number;
  per_page?: number;
}

export interface CustomerListResponse {
  data: Customer[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface CustomerOrder {
  id: number;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
}

export interface CustomerDetailData extends Customer {
  orders?: CustomerOrder[];
}
