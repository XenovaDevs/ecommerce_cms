/**
 * Shipping Service
 *
 * Service layer for Andreani shipping integration.
 * Follows SRP: Single responsibility for shipping API communication.
 * Follows DIP: Depends on axios abstraction, not concrete HTTP implementation.
 */

import api from '@/lib/axios';
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
  private readonly basePath = '/admin/shipping';

  /**
   * List all shipments with pagination
   *
   * @param page - Page number (default: 1)
   * @param perPage - Items per page (default: 10)
   * @returns Promise with shipment list and metadata
   * @throws Error if API endpoint is not available
   */
  async list(page = 1, perPage = 10): Promise<ShipmentListResponse> {
    try {
      const response = await api.get<ShipmentListResponse>(this.basePath, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Backend endpoint not yet implemented
        throw new Error('Shipping API endpoint is not available yet. Backend integration in progress.');
      }
      throw this.handleError(error, 'Failed to fetch shipments');
    }
  }

  /**
   * Create a new shipment for an order
   *
   * @param data - Shipment creation data
   * @returns Promise with created shipment
   * @throws Error if validation fails or API is unavailable
   */
  async create(data: CreateShipmentData): Promise<Shipment> {
    try {
      const response = await api.post<Shipment>(this.basePath, data);
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
   *
   * @param id - Shipment ID
   * @returns Promise with tracking information and events
   * @throws Error if shipment not found or API unavailable
   */
  async track(id: number): Promise<TrackingInfo> {
    try {
      const response = await api.get<TrackingInfo>(`${this.basePath}/${id}/track`);
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
   * Orders without existing shipments
   *
   * @returns Promise with list of available orders
   */
  async getAvailableOrders(): Promise<OrderForShipment[]> {
    try {
      const response = await api.get<OrderForShipment[]>(`${this.basePath}/available-orders`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Fallback: return empty array if endpoint doesn't exist yet
        console.warn('Available orders endpoint not implemented yet');
        return [];
      }
      throw this.handleError(error, 'Failed to fetch available orders');
    }
  }

  /**
   * Centralized error handler
   * Provides consistent error messages across service methods
   *
   * @param error - Original error
   * @param defaultMessage - Default message if error details unavailable
   * @returns Error with user-friendly message
   */
  private handleError(error: any, defaultMessage: string): Error {
    const message = error.response?.data?.message || error.message || defaultMessage;
    return new Error(message);
  }
}

// Export singleton instance (follows Factory pattern)
export const shippingService = new ShippingService();

// Export type for testing and mocking
export type { IShippingService };
