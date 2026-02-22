import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingSettingsFormValues>({
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
    <Card className="border-sage-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Truck className="h-5 w-5 text-gold-600" />
          Shipping Settings
        </CardTitle>
        <CardDescription>Configure your Andreani shipping integration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Andreani Username"
            placeholder="your-username"
            error={errors.andreaniUsername?.message}
            helperText="Your Andreani account username"
            {...register('andreaniUsername')}
          />

          <Input
            label="Andreani Password"
            type="password"
            placeholder="********"
            error={errors.andreaniPassword?.message}
            helperText="Your Andreani account password"
            {...register('andreaniPassword')}
          />

          <Input
            label="Contract Number"
            placeholder="123456"
            error={errors.andreaniContract?.message}
            helperText="Your Andreani contract number"
            {...register('andreaniContract')}
          />

          <Input
            label="Default Shipping Method"
            placeholder="Standard"
            error={errors.defaultShippingMethod?.message}
            helperText="Default shipping method for new orders (optional)"
            {...register('defaultShippingMethod')}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
