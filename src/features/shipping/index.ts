/**
 * Shipping Feature Barrel Export
 *
 * Main entry point for the shipping feature module.
 * Provides clean public API for consuming code.
 * Follows ISP: Exports only what's needed by external consumers.
 */

// Types
export type {
  Shipment,
  CreateShipmentData,
  ShippingAddress,
  TrackingEvent,
  TrackingInfo as ShipmentTrackingInfo,
  OrderForShipment,
  ShipmentListResponse,
} from './types/shipping.types';

export { ShippingStatus } from './types/shipping.types';

// Services
export { shippingService } from './services/shipping.service';
export type { IShippingService } from './services/shipping.service';

// Hooks
export {
  useShipments,
  useCreateShipment,
  useTrackingInfo,
  useAvailableOrders,
  shipmentKeys,
} from './hooks';

// Components
export {
  ShipmentList,
  CreateShipmentForm,
  TrackingInfo,
} from './components';

// Pages
export { ShippingPage } from './pages/ShippingPage';
