import { OrderStatus } from '../types/order.types'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

/**
 * OrderStatusBadge Component
 * Displays order status with appropriate color coding
 * Follows Single Responsibility: only concerned with visual representation of status
 */
export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    const configs: Record<OrderStatus, { label: string; className: string }> = {
      [OrderStatus.PENDING]: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      },
      [OrderStatus.PROCESSING]: {
        label: 'Processing',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      [OrderStatus.SHIPPED]: {
        label: 'Shipped',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      },
      [OrderStatus.DELIVERED]: {
        label: 'Delivered',
        className: 'bg-green-100 text-green-800 border-green-200',
      },
      [OrderStatus.CANCELLED]: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200',
      },
      [OrderStatus.REFUNDED]: {
        label: 'Refunded',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
      },
    }

    return configs[status]
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  )
}
