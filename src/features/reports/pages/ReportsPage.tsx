import { BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesReport } from '../components/SalesReport';
import { ProductsReport } from '../components/ProductsReport';
import { CustomersReport } from '../components/CustomersReport';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-gold-600" />
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Reports</h1>
          <p className="text-muted-foreground">View and analyze your business performance</p>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesReport />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsReport />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <CustomersReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
