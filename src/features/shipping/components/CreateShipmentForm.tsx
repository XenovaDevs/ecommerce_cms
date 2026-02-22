/**
 * CreateShipmentForm Component
 *
 * Form for creating new shipments with order selection and address input.
 * Follows SRP: Single responsibility for shipment creation UI.
 * Follows ISP: Uses focused hooks for specific data needs.
 */

import { useState, type FormEvent } from 'react';
import { useCreateShipment, useAvailableOrders } from '../hooks';
import type { CreateShipmentData, ShippingAddress } from '../types/shipping.types';

/**
 * Component props
 */
interface CreateShipmentFormProps {
  onSuccess?: () => void;
}

/**
 * Form validation errors
 */
type FormErrors = Partial<Record<keyof ShippingAddress | 'order_id', string>>;

/**
 * Initial address state
 */
const initialAddress: ShippingAddress = {
  street: '',
  number: '',
  floor: '',
  apartment: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'Argentina',
};

/**
 * CreateShipmentForm Component
 *
 * Provides form interface for creating shipments.
 * Handles validation, error display, and success feedback.
 */
export function CreateShipmentForm({ onSuccess }: CreateShipmentFormProps): JSX.Element {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const { orders, isLoading: loadingOrders } = useAvailableOrders();

  const { createShipment, isLoading, isError, error: apiError } = useCreateShipment({
    onSuccess: (shipment) => {
      setSuccessMessage(`Shipment created successfully! Tracking number: ${shipment.tracking_number}`);
      // Reset form
      setSelectedOrderId(null);
      setAddress(initialAddress);
      setErrors({});

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

      onSuccess?.();
    },
  });

  /**
   * Validate form data
   * Returns true if valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!selectedOrderId) {
      newErrors.order_id = 'Please select an order';
    }

    if (!address.street.trim()) {
      newErrors.street = 'Street is required';
    }

    if (!address.number.trim()) {
      newErrors.number = 'Number is required';
    }

    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.state.trim()) {
      newErrors.state = 'State/Province is required';
    }

    if (!address.postal_code.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }

    if (!address.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    const data: CreateShipmentData = {
      order_id: selectedOrderId!,
      shipping_address: address,
    };

    createShipment(data);
  };

  /**
   * Handle order selection
   * Auto-populate address if available
   */
  const handleOrderSelect = (orderId: string) => {
    const id = parseInt(orderId, 10);
    setSelectedOrderId(id);

    // Find order and pre-fill address if available
    const order = orders.find(o => o.id === id);
    if (order?.shipping_address) {
      setAddress(order.shipping_address);
    }
  };

  /**
   * Update address field
   */
  const updateAddress = (field: keyof ShippingAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* API Error Message */}
      {isError && apiError && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{apiError.message}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Selection */}
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
            Select Order *
          </label>
          <select
            id="order"
            value={selectedOrderId || ''}
            onChange={(e) => handleOrderSelect(e.target.value)}
            disabled={loadingOrders || isLoading}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              errors.order_id ? 'border-red-300' : ''
            }`}
          >
            <option value="">-- Select an order --</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                Order #{order.order_number} - {order.customer_name}
              </option>
            ))}
          </select>
          {errors.order_id && (
            <p className="mt-1 text-sm text-red-600">{errors.order_id}</p>
          )}
          {orders.length === 0 && !loadingOrders && (
            <p className="mt-1 text-sm text-gray-500">No orders available for shipment</p>
          )}
        </div>

        {/* Shipping Address Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Street */}
            <div className="sm:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street *
              </label>
              <input
                type="text"
                id="street"
                value={address.street}
                onChange={(e) => updateAddress('street', e.target.value)}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.street ? 'border-red-300' : ''
                }`}
              />
              {errors.street && (
                <p className="mt-1 text-sm text-red-600">{errors.street}</p>
              )}
            </div>

            {/* Number */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                Number *
              </label>
              <input
                type="text"
                id="number"
                value={address.number}
                onChange={(e) => updateAddress('number', e.target.value)}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.number ? 'border-red-300' : ''
                }`}
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">{errors.number}</p>
              )}
            </div>

            {/* Floor */}
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                Floor
              </label>
              <input
                type="text"
                id="floor"
                value={address.floor}
                onChange={(e) => updateAddress('floor', e.target.value)}
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Apartment */}
            <div>
              <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                Apartment
              </label>
              <input
                type="text"
                id="apartment"
                value={address.apartment}
                onChange={(e) => updateAddress('apartment', e.target.value)}
                disabled={isLoading}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={address.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.city ? 'border-red-300' : ''
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State/Province *
              </label>
              <input
                type="text"
                id="state"
                value={address.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.state ? 'border-red-300' : ''
                }`}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                Postal Code *
              </label>
              <input
                type="text"
                id="postal_code"
                value={address.postal_code}
                onChange={(e) => updateAddress('postal_code', e.target.value)}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.postal_code ? 'border-red-300' : ''
                }`}
              />
              {errors.postal_code && (
                <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                type="text"
                id="country"
                value={address.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                disabled={isLoading}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.country ? 'border-red-300' : ''
                }`}
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end border-t border-gray-200 pt-6">
          <button
            type="submit"
            disabled={isLoading || loadingOrders}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Shipment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
