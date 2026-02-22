/**
 * RecentOrders Component
 * Single Responsibility: Display list of recent orders with status and customer info
 */

import { Link } from 'react-router-dom'
import { ExternalLink, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card'
import { Badge } from '@/components/ui/Badge/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RecentOrder } from '../types/dashboard.types'

interface RecentOrdersProps {
  orders?: RecentOrder[]
}

/**
 * Map order status to badge variant
 */
function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  const statusMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'danger',
  }

  return statusMap[status.toLowerCase()] || 'default'
}

/**
 * Format status text for display
 */
function formatStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  }

  return statusLabels[status.toLowerCase()] || status
}

/**
 * Empty state when no orders exist
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-gray-100 mb-4">
        <Package className="w-8 h-8 text-sage-gray-400" />
      </div>
      <p className="text-sage-gray-500 font-medium mb-2">No hay órdenes recientes</p>
      <p className="text-sm text-sage-gray-400">
        Las órdenes nuevas aparecerán aquí
      </p>
    </div>
  )
}

/**
 * Order row component
 */
function OrderRow({ order }: { order: RecentOrder }) {
  return (
    <tr className="border-b border-sage-gray-100 hover:bg-sage-gray-50 transition-colors">
      <td className="py-3 px-4">
        <Link
          to={`/orders/${order.id}`}
          className="text-sage-green font-medium hover:text-sage-green-dark inline-flex items-center gap-1"
        >
          #{order.order_number}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </td>
      <td className="py-3 px-4 text-sage-gray-700">{order.customer_name}</td>
      <td className="py-3 px-4 font-medium text-sage-black">
        {formatCurrency(order.total)}
      </td>
      <td className="py-3 px-4">
        <Badge variant={getStatusVariant(order.status)}>
          {formatStatus(order.status)}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sage-gray-600 text-sm">
        {formatDate(order.created_at)}
      </td>
    </tr>
  )
}

/**
 * RecentOrders - Displays a table of the most recent orders
 *
 * Follows SRP by focusing solely on rendering recent orders.
 * Status formatting and data transformation are delegated to helper functions.
 */
export function RecentOrders({ orders }: RecentOrdersProps) {
  const hasOrders = orders && orders.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasOrders ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-sage-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-sage-gray-700">
                    Order #
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-sage-gray-700">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-sage-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-sage-gray-700">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-sage-gray-700">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
