export interface Setting {
  key: string;
  value: string;
  group: SettingsGroup;
}

export type SettingsGroup = 'general' | 'shipping' | 'payment';

export interface GeneralSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress?: string;
  taxId?: string;
}

export interface ShippingSettings {
  andreaniUsername: string;
  andreaniPassword: string;
  andreaniContract: string;
  defaultShippingMethod?: string;
}

export interface PaymentSettings {
  mercadoPagoPublicKey: string;
  mercadoPagoAccessToken: string;
  paymentMethods?: string[];
}

export interface SettingsData {
  general: GeneralSettings;
  shipping: ShippingSettings;
  payment: PaymentSettings;
}

export interface UpdateSettingsRequest {
  group: SettingsGroup;
  settings: Partial<GeneralSettings | ShippingSettings | PaymentSettings>;
}
