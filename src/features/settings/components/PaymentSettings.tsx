import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSettings } from '../hooks/useSettings';
import { useUpdateSettings } from '../hooks/useUpdateSettings';

const paymentSettingsSchema = z.object({
  mercadoPagoPublicKey: z.string().min(1, 'Public key is required'),
  mercadoPagoAccessToken: z.string().min(1, 'Access token is required'),
  paymentMethods: z.array(z.string()).optional(),
});

type PaymentSettingsFormValues = z.infer<typeof paymentSettingsSchema>;

export function PaymentSettings() {
  const { data, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentSettingsFormValues>({
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
    <Card className="border-sage-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CreditCard className="h-5 w-5 text-gold-600" />
          Payment Settings
        </CardTitle>
        <CardDescription>Configure your MercadoPago payment integration</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="MercadoPago Public Key"
            placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            error={errors.mercadoPagoPublicKey?.message}
            helperText="Your MercadoPago public key"
            {...register('mercadoPagoPublicKey')}
          />

          <Input
            label="MercadoPago Access Token"
            type="password"
            placeholder="APP_USR-xxxxxxxxxxxx-xxxxxxxxxxxx"
            error={errors.mercadoPagoAccessToken?.message}
            helperText="Your MercadoPago access token"
            {...register('mercadoPagoAccessToken')}
          />

          <div className="rounded-lg border border-sage-gold/25 bg-sage-gold/10 p-4">
            <p className="text-sm text-foreground">
              <strong>Important:</strong> Keep your access token secure. Never share it publicly
              or commit it to version control.
            </p>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
