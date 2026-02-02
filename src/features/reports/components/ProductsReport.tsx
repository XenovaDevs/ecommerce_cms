import { Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProductsReport } from '../hooks/useReports';
import { formatCurrency } from '@/lib/utils';

export function ProductsReport() {
  const { data, isLoading } = useProductsReport({ limit: 10 });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading products data...</div>;
  }

  if (!data?.topProducts.length) {
    return <div className="text-center p-8 text-muted-foreground">No products data available</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="text-sage-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-gold-600" />
            Top Selling Products
          </CardTitle>
          <CardDescription>Best performing products by quantity sold</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity Sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{product.quantitySold}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
