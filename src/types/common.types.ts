/**
 * Common type definitions
 */

/**
 * User type
 */
export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
  created_at: string
  updated_at: string
}

/**
 * Auth tokens
 */
export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

/**
 * Login response
 */
export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

/**
 * Product type
 */
export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  cost_price?: number
  sku?: string
  barcode?: string
  stock: number
  low_stock_threshold?: number
  category_id?: number
  category?: Category
  images: ProductImage[]
  variants?: ProductVariant[]
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  url: string
  alt?: string
  position: number
}

export interface ProductVariant {
  id: number
  name: string
  sku?: string
  price: number
  stock: number
  options: Record<string, string>
}

/**
 * Category type
 */
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  parent_id?: number
  parent?: Category
  children?: Category[]
  products_count?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Order type
 */
export interface Order {
  id: number
  order_number: string
  customer_id: number
  customer: Customer
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping_cost: number
  discount: number
  total: number
  status: string
  payment_status: string
  payment_method: string
  shipping_address: Address
  billing_address: Address
  notes?: string
  tracking_number?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  product_id: number
  product: Product
  quantity: number
  price: number
  subtotal: number
}

/**
 * Customer type
 */
export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  addresses: Address[]
  orders_count: number
  total_spent: number
  created_at: string
  updated_at: string
}

export interface Address {
  id?: number
  first_name: string
  last_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
}

/**
 * Dashboard stats
 */
export interface DashboardStats {
  total_orders: number
  total_revenue: number
  total_products: number
  total_customers: number
  recent_orders: Order[]
  top_products: Product[]
  sales_chart?: {
    labels: string[]
    data: number[]
  }
}

/**
 * Shipment type
 */
export interface Shipment {
  id: number
  order_id: number
  order: Order
  tracking_number: string
  carrier: string
  status: string
  shipped_at?: string
  delivered_at?: string
  tracking_url?: string
  created_at: string
  updated_at: string
}

/**
 * Settings type
 */
export interface Settings {
  general: {
    site_name: string
    site_url: string
    admin_email: string
    currency: string
    timezone: string
  }
  shipping: {
    enabled: boolean
    free_shipping_threshold?: number
    andreani_api_key?: string
    andreani_username?: string
  }
  payment: {
    mercadopago_enabled: boolean
    mercadopago_public_key?: string
    mercadopago_access_token?: string
  }
}
