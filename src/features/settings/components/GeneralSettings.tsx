import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';

const generalSettingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeEmail: z.string().email('Invalid email address'),
  storePhone: z.string().min(1, 'Phone number is required'),
  storeAddress: z.string().optional(),
  taxId: z.string().optional(),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

export function GeneralSettings() {
  const { data, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    values: data?.general,
  });

  const onSubmit = (values: GeneralSettingsFormValues) => {
    updateSettings({
      group: 'general',
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
          <Store className="h-5 w-5 text-gold-600" />
          General Settings
        </CardTitle>
        <CardDescription>Manage your store's basic information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Store Name"
            placeholder="Le Pas Sage"
            error={errors.storeName?.message}
            helperText="The name of your store"
            {...register('storeName')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="store@example.com"
            error={errors.storeEmail?.message}
            helperText="Contact email for customer inquiries"
            {...register('storeEmail')}
          />

          <Input
            label="Phone"
            placeholder="+54 11 1234-5678"
            error={errors.storePhone?.message}
            helperText="Contact phone number"
            {...register('storePhone')}
          />

          <Textarea
            label="Address"
            placeholder="Store address"
            error={errors.storeAddress?.message}
            {...register('storeAddress')}
          />

          <Input
            label="Tax ID / CUIT"
            placeholder="20-12345678-9"
            error={errors.taxId?.message}
            helperText="Tax identification number (optional)"
            {...register('taxId')}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
