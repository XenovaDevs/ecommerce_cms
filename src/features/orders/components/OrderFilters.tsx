import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input/Input'
import { Select, SelectOption } from '@/components/ui/Select/Select'
import { OrderFilters as OrderFiltersType, OrderStatus, PaymentStatus } from '../types/order.types'

/**
 * OrderFilters Component
 * Single Responsibility: Handles order filtering UI and state management
 * Interface Segregation: Minimal, focused props
 */

interface OrderFiltersProps {
  filters: OrderFiltersType
  onFilterChange: (filters: OrderFiltersType) => void
  disabled?: boolean
}

const ORDER_STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All Statuses' },
  { value: OrderStatus.PENDING, label: 'Pending' },
  { value: OrderStatus.PROCESSING, label: 'Processing' },
  { value: OrderStatus.SHIPPED, label: 'Shipped' },
  { value: OrderStatus.DELIVERED, label: 'Delivered' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled' },
  { value: OrderStatus.REFUNDED, label: 'Refunded' },
]

const PAYMENT_STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All Payment Statuses' },
  { value: PaymentStatus.PENDING, label: 'Pending' },
  { value: PaymentStatus.PAID, label: 'Paid' },
  { value: PaymentStatus.FAILED, label: 'Failed' },
  { value: PaymentStatus.REFUNDED, label: 'Refunded' },
]

export function OrderFilters({
  filters,
  onFilterChange,
  disabled = false,
}: OrderFiltersProps) {
  // Dependency Inversion: Depends on abstraction (onFilterChange callback)
  // not on concrete implementation

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value || undefined,
    })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as OrderStatus | ''
    onFilterChange({
      ...filters,
      status: value || undefined,
    })
  }

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PaymentStatus | ''
    onFilterChange({
      ...filters,
      payment_status: value || undefined,
    })
  }

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      date_from: e.target.value || undefined,
    })
  }

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      date_to: e.target.value || undefined,
    })
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Filter */}
        <div>
          <Input
            type="text"
            placeholder="Search by order number or customer..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            leftIcon={<Search className="w-4 h-4" />}
            disabled={disabled}
            aria-label="Search orders"
          />
        </div>

        {/* Order Status Filter */}
        <Select
          options={ORDER_STATUS_OPTIONS}
          value={filters.status || ''}
          onChange={handleStatusChange}
          disabled={disabled}
          aria-label="Filter by order status"
        />

        {/* Payment Status Filter */}
        <Select
          options={PAYMENT_STATUS_OPTIONS}
          value={filters.payment_status || ''}
          onChange={handlePaymentStatusChange}
          disabled={disabled}
          aria-label="Filter by payment status"
        />
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <Input
            id="date-from"
            type="date"
            value={filters.date_from || ''}
            onChange={handleDateFromChange}
            disabled={disabled}
            aria-label="Filter from date"
          />
        </div>

        <div>
          <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <Input
            id="date-to"
            type="date"
            value={filters.date_to || ''}
            onChange={handleDateToChange}
            disabled={disabled}
            aria-label="Filter to date"
          />
        </div>
      </div>
    </div>
  )
}
