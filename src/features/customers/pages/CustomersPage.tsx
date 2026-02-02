/**
 * CustomersPage Component
 * Single Responsibility: Compose customer list view with filters and pagination
 * Container component that manages state and composition
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerList } from '../components/CustomerList';
import { useCustomers } from '../hooks/useCustomers';
import { CustomerFilters as CustomerFiltersType } from '../types/customer.types';
import { Loader2 } from 'lucide-react';

/**
 * Main page for customer management
 * Follows container/presenter pattern
 */
export function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFiltersType>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, isError, error } = useCustomers(filters);

  const handleFiltersChange = (newFilters: CustomerFiltersType) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">
            Error al cargar clientes
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gestiona la información de tus clientes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de clientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomerFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : data ? (
            <>
              <CustomerList customers={data.data} />
              {data.last_page > 1 && (
                <Pagination
                  currentPage={data.current_page}
                  totalPages={data.last_page}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
