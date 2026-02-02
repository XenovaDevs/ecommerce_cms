/**
 * Order domain types
 * Defines the structure and contracts for order entities
 */

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface OrderCustomer {
  id: number
  name: string
  email: string
  phone?: string
}

export interface OrderItem {
  id: number
  product_id: number
  product_name: string
  product_image?: string
  sku?: string
  quantity: number
  price: number
  subtotal: number
}

export interface ShippingAddress {
  name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
}

export interface OrderStatusHistory {
  id: number
  status: OrderStatus
  notes?: string
  created_at: string
  created_by?: string
}

export interface Order {
  id: number
  order_number: string
  customer: OrderCustomer
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method?: string
  shipping_address: ShippingAddress
  billing_address?: ShippingAddress
  notes?: string
  status_history?: OrderStatusHistory[]
  created_at: string
  updated_at: string
}

export interface OrderFilters {
  search?: string
  status?: OrderStatus
  payment_status?: PaymentStatus
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus
  notes?: string
}
