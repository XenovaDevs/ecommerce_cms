/**
 * CustomerFilters Component
 * Single Responsibility: Handle customer filtering UI and state
 * Presentational component with controlled inputs
 */

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, type SelectOption } from '@/components/ui/Select/Select';
import { CustomerFilters as CustomerFiltersType } from '../types/customer.types';

interface CustomerFiltersProps {
  filters: CustomerFiltersType;
  onFiltersChange: (filters: CustomerFiltersType) => void;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];

/**
 * Filter controls for customer list
 * Clean separation of UI and logic
 */
export function CustomerFilters({
  filters,
  onFiltersChange,
}: CustomerFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
      page: 1, // Reset to first page on filter change
    });
  };

  const handleStatusChange = (value: string) => {
    const isActive =
      value === 'all' ? null : value === 'active' ? true : false;
    onFiltersChange({
      ...filters,
      is_active: isActive,
      page: 1, // Reset to first page on filter change
    });
  };

  const getStatusValue = () => {
    if (filters.is_active === null || filters.is_active === undefined) {
      return 'all';
    }
    return filters.is_active ? 'active' : 'inactive';
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nombre, email o telefono..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        options={STATUS_OPTIONS}
        value={getStatusValue()}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="w-full sm:w-[180px]"
      />
    </div>
  );
}
