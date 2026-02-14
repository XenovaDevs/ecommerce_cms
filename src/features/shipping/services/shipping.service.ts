/**
 * Shipping Service
 *
 * Service layer for Andreani shipping integration.
 * Follows SRP: Single responsibility for shipping API communication.
 * Follows DIP: Depends on axios abstraction, not concrete HTTP implementation.
 */

import api from '@/services/api';
import { API_ENDPOINTS } from '@/services/apiEndpoints';
import type {
  Shipment,
  CreateShipmentData,
  TrackingInfo,
  ShipmentListResponse,
  OrderForShipment
} from '../types/shipping.types';

/**
 * Shipping Service Interface
 * Defines the contract for shipping operations (ISP)
 */
interface IShippingService {
  list(page?: number, perPage?: number): Promise<ShipmentListResponse>;
  create(data: CreateShipmentData): Promise<Shipment>;
  track(id: number): Promise<TrackingInfo>;
  getAvailableOrders(): Promise<OrderForShipment[]>;
}

/**
 * Shipping Service Implementation
 *
 * Handles all HTTP operations related to shipments.
 * Uses dependency injection via axios instance.
 */
class ShippingService implements IShippingService {
  private normalizeShipmentList(payload: any, fallbackPage: number, fallbackPerPage: number): ShipmentListResponse {
    if (payload && Array.isArray(payload.data) && typeof payload.total === 'number') {
      return payload as ShipmentListResponse;
    }

    const list = Array.isArray(payload) ? payload : payload?.data ?? [];
    return {
      data: Array.isArray(list) ? list : [],
      total: payload?.meta?.total ?? payload?.total ?? 0,
      page: payload?.meta?.current_page ?? payload?.page ?? fallbackPage,
      per_page: payload?.meta?.per_page ?? payload?.per_page ?? fallbackPerPage,
    };
  }

  /**
   * List all shipments with pagination
   */
  async list(page = 1, perPage = 10): Promise<ShipmentListResponse> {
    try {
      const response = await api.get<ShipmentListResponse>(API_ENDPOINTS.SHIPPING.LIST, {
        params: { page, per_page: perPage }
      });
      return this.normalizeShipmentList(response.data, page, perPage);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Shipping API endpoint is not available yet. Backend integration in progress.');
      }
      throw this.handleError(error, 'Failed to fetch shipments');
    }
  }

  /**
   * Create a new shipment for an order
   */
  async create(data: CreateShipmentData): Promise<Shipment> {
    try {
      const response = await api.post<Shipment>(API_ENDPOINTS.SHIPPING.CREATE, data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Shipping API endpoint is not available yet. Backend integration in progress.');
      }
      if (error.response?.status === 422) {
        throw new Error(error.response.data.message || 'Invalid shipment data');
      }
      throw this.handleError(error, 'Failed to create shipment');
    }
  }

  /**
   * Track a shipment by ID
   */
  async track(id: number): Promise<TrackingInfo> {
    try {
      const response = await api.get<TrackingInfo>(API_ENDPOINTS.SHIPPING.TRACK(id));
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Tracking information not available. Shipment may not exist or backend integration is in progress.');
      }
      throw this.handleError(error, 'Failed to fetch tracking information');
    }
  }

  /**
   * Get orders available for shipment creation
   */
  async getAvailableOrders(): Promise<OrderForShipment[]> {
    try {
      const response = await api.get<OrderForShipment[]>(`${API_ENDPOINTS.SHIPPING.LIST}/available-orders`);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return (response.data as any)?.data ?? [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('Available orders endpoint not implemented yet');
        return [];
      }
      throw this.handleError(error, 'Failed to fetch available orders');
    }
  }

  /**
   * Centralized error handler
   */
  private handleError(error: any, defaultMessage: string): Error {
    const message = error.response?.data?.message || error.message || defaultMessage;
    return new Error(message);
  }
}

// Export singleton instance
export const shippingService = new ShippingService();

// Export type for testing and mocking
export type { IShippingService };
