import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from '../components/GeneralSettings';
import { ShippingSettings } from '../components/ShippingSettings';
import { PaymentSettings } from '../components/PaymentSettings';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-gold-600" />
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <ShippingSettings />
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
