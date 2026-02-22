import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import { OrderStatusHistory, OrderStatus } from '../types/order.types'
import { formatDateTime } from '@/utils/format'

interface OrderTimelineProps {
  statusHistory: OrderStatusHistory[]
}

/**
 * OrderTimeline Component
 * Single Responsibility: Displays chronological status history
 * Open/Closed: Icon mapping can be extended without modifying component logic
 */
export function OrderTimeline({ statusHistory }: OrderTimelineProps) {
  const toOrderStatus = (status: string): OrderStatus => {
    return (Object.values(OrderStatus) as string[]).includes(status)
      ? (status as OrderStatus)
      : OrderStatus.PENDING
  }

  const getStatusIcon = (status: OrderStatus) => {
    const iconMap: Record<OrderStatus, React.ReactNode> = {
      [OrderStatus.PENDING]: <Clock className="w-5 h-5 text-yellow-600" />,
      [OrderStatus.CONFIRMED]: <CheckCircle className="w-5 h-5 text-cyan-600" />,
      [OrderStatus.PROCESSING]: <Package className="w-5 h-5 text-blue-600" />,
      [OrderStatus.SHIPPED]: <Truck className="w-5 h-5 text-indigo-600" />,
      [OrderStatus.DELIVERED]: <CheckCircle className="w-5 h-5 text-green-600" />,
      [OrderStatus.CANCELLED]: <XCircle className="w-5 h-5 text-red-600" />,
      [OrderStatus.REFUNDED]: <DollarSign className="w-5 h-5 text-gray-600" />,
    }

    return iconMap[status] || <AlertCircle className="w-5 h-5 text-gray-600" />
  }

  const getStatusLabel = (status: OrderStatus) => {
    const labelMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Order Pending',
      [OrderStatus.CONFIRMED]: 'Order Confirmed',
      [OrderStatus.PROCESSING]: 'Processing Order',
      [OrderStatus.SHIPPED]: 'Order Shipped',
      [OrderStatus.DELIVERED]: 'Order Delivered',
      [OrderStatus.CANCELLED]: 'Order Cancelled',
      [OrderStatus.REFUNDED]: 'Order Refunded',
    }

    return labelMap[status] || status
  }

  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>

      <div className="flow-root">
        <ul className="-mb-8">
          {sortedHistory.map((event, index) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {index !== sortedHistory.length - 1 && (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-white">
                      {getStatusIcon(toOrderStatus(event.status))}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getStatusLabel(toOrderStatus(event.status))}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatDateTime(event.created_at)}
                        {event.changed_by && ` by ${event.changed_by}`}
                      </p>
                    </div>
                    {event.notes && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p className="bg-gray-50 rounded-md px-3 py-2">{event.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
