import { useState } from 'react'
import { Order, OrderStatus, UpdateOrderStatusPayload } from '../types/order.types'
import { OrderStatusBadge } from './OrderStatusBadge'
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/Button/Button'
import { Select, SelectOption } from '@/components/ui/Select/Select'

interface OrderDetailProps {
  order: Order
}

/**
 * OrderDetail Component
 * Single Responsibility: Displays and manages order details
 * Separates presentation from business logic via hooks
 */
export function OrderDetail({ order }: OrderDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status)
  const [notes, setNotes] = useState('')
  const [showStatusUpdate, setShowStatusUpdate] = useState(false)

  const updateStatusMutation = useUpdateOrderStatus()

  const statusOptions: SelectOption[] = [
    { value: OrderStatus.PENDING, label: 'Pending' },
    { value: OrderStatus.PROCESSING, label: 'Processing' },
    { value: OrderStatus.SHIPPED, label: 'Shipped' },
    { value: OrderStatus.DELIVERED, label: 'Delivered' },
    { value: OrderStatus.CANCELLED, label: 'Cancelled' },
    { value: OrderStatus.REFUNDED, label: 'Refunded' },
  ]

  const handleStatusUpdate = () => {
    if (selectedStatus === order.status) {
      setShowStatusUpdate(false)
      return
    }

    const payload: UpdateOrderStatusPayload = {
      status: selectedStatus,
      notes: notes.trim() || undefined,
    }

    updateStatusMutation.mutate(
      { id: order.id, payload },
      {
        onSuccess: () => {
          setShowStatusUpdate(false)
          setNotes('')
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order {order.order_number}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Status Update Section */}
        {!showStatusUpdate ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowStatusUpdate(true)}
          >
            Update Status
          </Button>
        ) : (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-3">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  New Status
                </label>
                <Select
                  id="status"
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add notes about this status change..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowStatusUpdate(false)
                    setSelectedStatus(order.status)
                    setNotes('')
                  }}
                  disabled={updateStatusMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Information */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{order.customer.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{order.customer.email}</dd>
          </div>
          {order.customer.phone && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.customer.phone}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-3 py-4">
                    <div className="flex items-center">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="h-10 w-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.product_name}
                        </div>
                        {item.sku && (
                          <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-4 text-right text-sm text-gray-900">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-3 py-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Totals */}
        <div className="mt-6 border-t pt-4">
          <dl className="space-y-2">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="text-gray-900 font-medium">{formatCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="text-gray-900 font-medium">{formatCurrency(order.shipping_cost)}</dd>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <dt className="text-gray-600">Tax</dt>
                <dd className="text-gray-900 font-medium">{formatCurrency(order.tax)}</dd>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold border-t pt-2">
              <dt className="text-gray-900">Total</dt>
              <dd className="text-gray-900">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
        <address className="text-sm text-gray-900 not-italic">
          <div className="font-medium">{order.shipping_address.name}</div>
          <div className="mt-1">{order.shipping_address.address_line_1}</div>
          {order.shipping_address.address_line_2 && (
            <div>{order.shipping_address.address_line_2}</div>
          )}
          <div>
            {order.shipping_address.city}, {order.shipping_address.state}{' '}
            {order.shipping_address.postal_code}
          </div>
          <div>{order.shipping_address.country}</div>
          {order.shipping_address.phone && (
            <div className="mt-2">Phone: {order.shipping_address.phone}</div>
          )}
        </address>
      </div>

      {/* Payment Information */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  order.payment_status === 'paid'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : order.payment_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}
              >
                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </dd>
          </div>
          {order.payment_method && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.payment_method}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h3>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
