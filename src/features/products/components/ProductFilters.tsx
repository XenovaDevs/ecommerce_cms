import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input/Input'
import { Select, SelectOption } from '@/components/ui/Select/Select'
import { Button } from '@/components/ui/Button/Button'
import { ProductFilters as ProductFiltersType } from '../types/product.types'

/**
 * ProductFilters Component
 *
 * Single Responsibility: Handles only product filtering UI and state management
 * Interface Segregation: Props are minimal and focused
 */

interface ProductFiltersProps {
  filters: ProductFiltersType
  onFilterChange: (filters: ProductFiltersType) => void
  categories?: Array<{ id: number; name: string }>
  disabled?: boolean
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
]

const STOCK_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'in-stock', label: 'En stock' },
  { value: 'low', label: 'Stock bajo' },
  { value: 'out', label: 'Sin stock' },
]

export function ProductFilters({
  filters,
  onFilterChange,
  categories = [],
  disabled = false,
}: ProductFiltersProps) {
  // Dependency Inversion: Component depends on abstraction (onFilterChange callback)
  // not on concrete implementation of how filters are applied

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      search: e.target.value || undefined,
    })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onFilterChange({
      ...filters,
      category_id: value ? Number(value) : undefined,
    })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    let isActive: boolean | undefined

    switch (value) {
      case 'active':
        isActive = true
        break
      case 'inactive':
        isActive = false
        break
      default:
        isActive = undefined
    }

    onFilterChange({
      ...filters,
      is_active: isActive,
    })
  }

  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'all' | 'in-stock' | 'low' | 'out'
    // Stock filtering is handled by parent component via filters
    // This demonstrates Separation of Concerns
    onFilterChange({
      ...filters,
      stock_filter: value === 'all' ? undefined : value,
    })
  }

  const categoryOptions: SelectOption[] = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
  ]

  const getStatusValue = (): string => {
    if (filters.is_active === true) return 'active'
    if (filters.is_active === false) return 'inactive'
    return 'all'
  }

  const handleClearFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters =
    filters.search ||
    filters.category_id ||
    filters.is_active !== undefined ||
    filters.stock_filter

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search Filter */}
      <div className="lg:col-span-2">
        <Input
          type="text"
          placeholder="Buscar productos por nombre o SKU..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          leftIcon={<Search className="w-4 h-4" />}
          disabled={disabled}
          aria-label="Buscar productos"
        />
      </div>

      {/* Category Filter */}
      <Select
        options={categoryOptions}
        value={filters.category_id ? String(filters.category_id) : ''}
        onChange={handleCategoryChange}
        disabled={disabled}
        aria-label="Filtrar por categoría"
      />

      {/* Status Filter */}
      <Select
        options={STATUS_OPTIONS}
        value={getStatusValue()}
        onChange={handleStatusChange}
        disabled={disabled}
        aria-label="Filtrar por estado"
      />

      {/* Stock Filter - Optional second row on mobile */}
      <div className="md:col-span-2 lg:col-span-1">
        <Select
          options={STOCK_OPTIONS}
          value={filters.stock_filter || 'all'}
          onChange={handleStockChange}
          disabled={disabled}
          aria-label="Filtrar por stock"
        />
      </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={disabled}
            leftIcon={<X className="w-4 h-4" />}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  )
}
