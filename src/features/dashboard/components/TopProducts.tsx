/**
 * TopProducts Component
 * Single Responsibility: Display list of best-selling products with sales metrics
 */

import { TrendingUp, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card'
import { formatCurrency } from '@/lib/utils'
import { TopProduct } from '../types/dashboard.types'

interface TopProductsProps {
  products?: TopProduct[]
}

/**
 * Empty state when no products exist
 */
function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-gray-100 mb-4">
        <TrendingUp className="w-8 h-8 text-sage-gray-400" />
      </div>
      <p className="text-sage-gray-500 font-medium mb-2">No hay datos disponibles</p>
      <p className="text-sm text-sage-gray-400">
        Los productos más vendidos aparecerán aquí
      </p>
    </div>
  )
}

/**
 * Product item component
 */
function ProductItem({ product }: { product: TopProduct }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-sage-gray-50 transition-colors">
      {/* Product Image */}
      <div className="flex-shrink-0 w-12 h-12 bg-sage-gray-100 rounded-lg overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-sage-gray-400" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sage-black truncate mb-1">{product.name}</p>
        <div className="flex items-center gap-3 text-sm text-sage-gray-600">
          <span>{product.sales_count} ventas</span>
          <span className="text-sage-gray-400">•</span>
          <span className="font-semibold text-sage-green">
            {formatCurrency(product.revenue)}
          </span>
        </div>
      </div>

      {/* Ranking Badge */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-sage-green-light flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-sage-green" />
        </div>
      </div>
    </div>
  )
}

/**
 * TopProducts - Displays a list of best-selling products
 *
 * Adheres to SRP by focusing only on rendering product list.
 * Data formatting is delegated to utility functions.
 * Empty states are handled by a separate component.
 */
export function TopProducts({ products }: TopProductsProps) {
  const hasProducts = products && products.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasProducts ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
