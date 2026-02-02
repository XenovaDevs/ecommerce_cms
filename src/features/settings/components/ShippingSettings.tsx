import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck } from 'lucide-react';
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
import type { ShippingSettings } from '../types/settings.types';

const shippingSettingsSchema = z.object({
  andreaniUsername: z.string().min(1, 'Username is required'),
  andreaniPassword: z.string().min(1, 'Password is required'),
  andreaniContract: z.string().min(1, 'Contract number is required'),
  defaultShippingMethod: z.string().optional(),
});

type ShippingSettingsFormValues = z.infer<typeof shippingSettingsSchema>;

export function ShippingSettings() {
  const { data, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const form = useForm<ShippingSettingsFormValues>({
    resolver: zodResolver(shippingSettingsSchema),
    values: data?.shipping,
  });

  const onSubmit = (values: ShippingSettingsFormValues) => {
    updateSettings({
      group: 'shipping',
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
          <Truck className="h-5 w-5 text-gold-600" />
          Shipping Settings
        </CardTitle>
        <CardDescription>Configure your Andreani shipping integration</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="andreaniUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andreani Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your-username" {...field} />
                  </FormControl>
                  <FormDescription>Your Andreani account username</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="andreaniPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Andreani Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>Your Andreani account password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="andreaniContract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormDescription>Your Andreani contract number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultShippingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Shipping Method</FormLabel>
                  <FormControl>
                    <Input placeholder="Standard" {...field} />
                  </FormControl>
                  <FormDescription>Default shipping method for new orders (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
