import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSalesReport } from '../hooks/useReports';
import { DateRangeFilter } from './DateRangeFilter';
import { formatCurrency } from '@/lib/utils';

export function SalesReport() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data, isLoading } = useSalesReport({
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '',
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading sales data...</div>;
  }

  if (!data) {
    return <div className="text-center p-8 text-muted-foreground">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <DateRangeFilter
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        className="max-w-sm"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-sage-200 bg-gradient-to-br from-white to-sage-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sage-900">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-sage-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sage-900">
              {formatCurrency(data.totalSales)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold-200 bg-gradient-to-br from-white to-gold-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sage-900">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-gold-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sage-900">{data.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-sage-200 bg-gradient-to-br from-white to-sage-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sage-900">Average Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-sage-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sage-900">
              {formatCurrency(data.averageOrderValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="text-sage-900">Daily Sales</CardTitle>
          <CardDescription>Breakdown of sales by day</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.dailySales.map((sale) => (
                <TableRow key={sale.date}>
                  <TableCell className="font-medium">
                    {format(new Date(sale.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">{sale.orders}</TableCell>
                  <TableCell className="text-right">{formatCurrency(sale.sales)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
