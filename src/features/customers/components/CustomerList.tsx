/**
 * CustomerList Component
 * Single Responsibility: Display customer data in table format
 * Presentational component focused on rendering
 */

import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Customer } from '../types/customer.types';
import { formatCurrency } from '@/lib/utils';

interface CustomerListProps {
  customers: Customer[];
}

/**
 * Table display for customer list
 * Follows clean code: Small, focused component
 */
export function CustomerList({ customers }: CustomerListProps) {
  const navigate = useNavigate();

  const handleRowClick = (customerId: number) => {
    navigate(`/customers/${customerId}`);
  };

  if (customers.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        No se encontraron clientes
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-center">Órdenes</TableHead>
            <TableHead className="text-right">Total Gastado</TableHead>
            <TableHead className="text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              onClick={() => handleRowClick(customer.id)}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone || '-'}</TableCell>
              <TableCell className="text-center">
                {customer.orders_count}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(customer.total_spent)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={customer.is_active ? 'default' : 'secondary'}
                >
                  {customer.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
