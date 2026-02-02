/**
 * Shipping Feature Types
 *
 * Type definitions for Andreani shipping integration.
 * Follows SRP: Single responsibility for type definitions only.
 */

/**
 * Available shipping status values
 *
 * @enum {string}
 */
export enum ShippingStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

/**
 * Shipment entity
 * Represents a shipment record from the backend
 */
export interface Shipment {
  id: number;
  order_id: number;
  tracking_number: string;
  carrier: string;
  status: ShippingStatus;
  created_at: string;
  updated_at?: string;
}

/**
 * Data required to create a new shipment
 * Used for POST /admin/shipping
 */
export interface CreateShipmentData {
  order_id: number;
  shipping_address: ShippingAddress;
}

/**
 * Shipping address structure
 */
export interface ShippingAddress {
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

/**
 * Tracking event in the shipment timeline
 */
export interface TrackingEvent {
  id: number;
  shipment_id: number;
  status: ShippingStatus;
  description: string;
  location?: string;
  timestamp: string;
}

/**
 * Tracking information response
 * Returned by GET /admin/shipping/{id}/track
 */
export interface TrackingInfo {
  shipment: Shipment;
  events: TrackingEvent[];
  estimated_delivery?: string;
}

/**
 * Order summary for shipment selection
 * Used in CreateShipmentForm dropdown
 */
export interface OrderForShipment {
  id: number;
  order_number: string;
  customer_name: string;
  shipping_address: ShippingAddress;
  created_at: string;
}

/**
 * API response for shipment list
 */
export interface ShipmentListResponse {
  data: Shipment[];
  total: number;
  page: number;
  per_page: number;
}
