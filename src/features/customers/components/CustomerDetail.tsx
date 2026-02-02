/**
 * CustomerDetail Component
 * Single Responsibility: Display detailed customer information
 * Composite component combining customer info and order history
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CustomerDetailData } from '../types/customer.types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Mail, Phone, Calendar, ShoppingBag, DollarSign } from 'lucide-react';

interface CustomerDetailProps {
  customer: CustomerDetailData;
}

/**
 * Detailed view of customer information
 * Follows clean code: Well-organized, readable structure
 */
export function CustomerDetail({ customer }: CustomerDetailProps) {
  return (
    <div className="space-y-6">
      {/* Customer Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{customer.name}</CardTitle>
              <CardDescription>Información del cliente</CardDescription>
            </div>
            <Badge variant={customer.is_active ? 'default' : 'secondary'}>
              {customer.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={customer.email}
            />
            <InfoItem
              icon={<Phone className="h-4 w-4" />}
              label="Teléfono"
              value={customer.phone || 'No registrado'}
            />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Cliente desde"
              value={formatDate(customer.created_at)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={<ShoppingBag className="h-4 w-4" />}
          label="Total de órdenes"
          value={customer.orders_count.toString()}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Total gastado"
          value={formatCurrency(customer.total_spent)}
        />
        <StatCard
          icon={<DollarSign className="h-4 w-4" />}
          label="Promedio por orden"
          value={formatCurrency(
            customer.orders_count > 0
              ? customer.total_spent / customer.orders_count
              : 0
          )}
        />
      </div>

      {/* Order History */}
      {customer.orders && customer.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de órdenes</CardTitle>
            <CardDescription>
              Últimas órdenes realizadas por el cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de orden</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(order.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Reusable info item component
 * Follows DRY principle
 */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

/**
 * Reusable statistics card component
 * Follows DRY principle
 */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
