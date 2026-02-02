import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useOrder } from '../hooks/useOrder'
import { OrderDetail } from '../components/OrderDetail'
import { OrderTimeline } from '../components/OrderTimeline'
import { Button } from '@/components/ui/Button/Button'

/**
 * OrderDetailPage Component
 * Single Responsibility: Layout and orchestration for order detail view
 * Separates concerns: layout structure vs. content rendering (OrderDetail, OrderTimeline)
 */
export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)

  const { data: order, isLoading } = useOrder(orderId)

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/orders">
          <Button variant="secondary" leftIcon={<ChevronLeft className="w-4 h-4" />}>
            Back to Orders
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/orders">
          <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>
            Back to Orders
          </Button>
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Order Details */}
        <div className="lg:col-span-2">
          <OrderDetail order={order} />
        </div>

        {/* Sidebar - Timeline */}
        <div>
          {order.status_history && order.status_history.length > 0 ? (
            <OrderTimeline statusHistory={order.status_history} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
              <p className="text-sm text-gray-500">No status history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

OrderDetailPage.displayName = 'OrderDetailPage'
