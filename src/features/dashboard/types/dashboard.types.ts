/**
 * Dashboard domain types
 * Defines the structure for dashboard statistics and data
 */

export interface DashboardStats {
  total_orders: number
  total_revenue: number
  total_products: number
  total_customers: number
}

export interface RecentOrder {
  id: number
  order_number: string
  customer_name: string
  total: number
  status: string
  created_at: string
}

export interface TopProduct {
  id: number
  name: string
  image?: string
  sales_count: number
  revenue: number
}

export interface DashboardData extends DashboardStats {
  recent_orders?: RecentOrder[]
  top_products?: TopProduct[]
}
