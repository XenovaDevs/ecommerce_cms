import { useState } from 'react'
import { OrderFilters as OrderFiltersType } from '../types/order.types'
import { useOrders } from '../hooks/useOrders'
import { OrderFilters } from '../components/OrderFilters'
import { OrderList } from '../components/OrderList'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { Card } from '@/components/ui/Card/Card'

/**
 * OrdersPage Component
 * Single Responsibility: Manages orders listing page layout and state
 * Dependency Inversion: Depends on hooks abstraction for data fetching
 * Open/Closed: Extensible through filters without modifying core logic
 */
export function OrdersPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [filters, setFilters] = useState<OrderFiltersType>({})

  const { data, isLoading } = useOrders({
    ...filters,
    page,
    per_page: perPage,
  })

  const handleFilterChange = (newFilters: OrderFiltersType) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page on filter change
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-sage-black">Orders</h1>
        <p className="mt-1 text-sage-slate">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        disabled={isLoading}
      />

      {/* Orders List */}
      <Card>
        <OrderList orders={data?.data || []} isLoading={isLoading} />

        {data && data.meta.total > 0 && (
          <div className="p-4 border-t border-sage-gray-200">
            <Pagination
              currentPage={page}
              totalPages={data.meta.last_page}
              totalItems={data.meta.total}
              pageSize={perPage}
              onPageChange={setPage}
              onPageSizeChange={setPerPage}
            />
          </div>
        )}
      </Card>
    </div>
  )
}

OrdersPage.displayName = 'OrdersPage'
