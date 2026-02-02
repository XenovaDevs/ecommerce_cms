import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import type { PaymentSettings } from '../types/settings.types';

const paymentSettingsSchema = z.object({
  mercadoPagoPublicKey: z.string().min(1, 'Public key is required'),
  mercadoPagoAccessToken: z.string().min(1, 'Access token is required'),
  paymentMethods: z.array(z.string()).optional(),
});

type PaymentSettingsFormValues = z.infer<typeof paymentSettingsSchema>;

export function PaymentSettings() {
  const { data, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const form = useForm<PaymentSettingsFormValues>({
    resolver: zodResolver(paymentSettingsSchema),
    values: data?.payment,
  });

  const onSubmit = (values: PaymentSettingsFormValues) => {
    updateSettings({
      group: 'payment',
      settings: values,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading settings...</div>;
  }

  return (
    <Card className="border-sage-200">
      <CardHeader>
        <CardTitle className="text-sage-900 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gold-600" />
          Payment Settings
        </CardTitle>
        <CardDescription>Configure your MercadoPago payment integration</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mercadoPagoPublicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MercadoPago Public Key</FormLabel>
                  <FormControl>
                    <Input placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormDescription>Your MercadoPago public key</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mercadoPagoAccessToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MercadoPago Access Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="APP_USR-xxxxxxxxxxxx-xxxxxxxxxxxx"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your MercadoPago access token</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border border-gold-200 bg-gold-50 p-4">
              <p className="text-sm text-sage-800">
                <strong>Important:</strong> Keep your access token secure. Never share it publicly
                or commit it to version control.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-sage-600 hover:bg-sage-700"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
