/**
 * Orders Feature Module Exports
 * Central export point following the Barrel Pattern
 * Provides clean, encapsulated access to the orders feature
 */

// Types
export type {
  Order,
  OrderCustomer,
  OrderItem,
  ShippingAddress,
  OrderStatusHistory,
  OrderFilters as OrderFiltersType,
  UpdateOrderStatusPayload,
} from './types/order.types'

export { OrderStatus, PaymentStatus } from './types/order.types'

// Services
export { orderService } from './services/order.service'

// Hooks
export { useOrders } from './hooks/useOrders'
export { useOrder } from './hooks/useOrder'
export { useUpdateOrderStatus } from './hooks/useUpdateOrderStatus'

// Components
export { OrderList } from './components/OrderList'
export { OrderFilters } from './components/OrderFilters'
export { OrderDetail } from './components/OrderDetail'
export { OrderStatusBadge } from './components/OrderStatusBadge'
export { OrderTimeline } from './components/OrderTimeline'

// Pages
export { OrdersPage } from './pages/OrdersPage'
export { OrderDetailPage } from './pages/OrderDetailPage'
