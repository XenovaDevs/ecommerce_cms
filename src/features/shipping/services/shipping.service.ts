/**
 * Shipping Service
 *
 * Service layer for Andreani shipping integration.
 * Follows SRP: Single responsibility for shipping API communication.
 * Follows DIP: Depends on axios abstraction, not concrete HTTP implementation.
 */

import { AxiosError } from 'axios'
import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import type {
  Shipment,
  CreateShipmentData,
  TrackingInfo,
  ShipmentListResponse,
  OrderForShipment
} from '../types/shipping.types'

type GenericRecord = Record<string, unknown>

/**
 * Shipping Service Interface
 * Defines the contract for shipping operations (ISP)
 */
interface IShippingService {
  list(page?: number, perPage?: number): Promise<ShipmentListResponse>
  create(data: CreateShipmentData): Promise<Shipment>
  track(id: number): Promise<TrackingInfo>
  getAvailableOrders(): Promise<OrderForShipment[]>
}

const toRecord = (value: unknown): GenericRecord =>
  value && typeof value === 'object' ? (value as GenericRecord) : {}

const toShipmentList = (value: unknown): Shipment[] =>
  Array.isArray(value) ? value as Shipment[] : []

/**
 * Shipping Service Implementation
 *
 * Handles all HTTP operations related to shipments.
 * Uses dependency injection via axios instance.
 */
class ShippingService implements IShippingService {
  private normalizeShipmentList(payload: unknown, fallbackPage: number, fallbackPerPage: number): ShipmentListResponse {
    const parsed = toRecord(payload)
    const dataValue = parsed.data

    if (Array.isArray(dataValue) && typeof parsed.total === 'number') {
      return {
        data: dataValue as Shipment[],
        total: parsed.total,
        page: typeof parsed.page === 'number' ? parsed.page : fallbackPage,
        per_page: typeof parsed.per_page === 'number' ? parsed.per_page : fallbackPerPage,
      }
    }

    const meta = toRecord(parsed.meta)
    const list = Array.isArray(payload) ? payload : (Array.isArray(dataValue) ? dataValue : [])

    return {
      data: toShipmentList(list),
      total: typeof meta.total === 'number'
        ? meta.total
        : (typeof parsed.total === 'number' ? parsed.total : 0),
      page: typeof meta.current_page === 'number'
        ? meta.current_page
        : (typeof parsed.page === 'number' ? parsed.page : fallbackPage),
      per_page: typeof meta.per_page === 'number'
        ? meta.per_page
        : (typeof parsed.per_page === 'number' ? parsed.per_page : fallbackPerPage),
    }
  }

  /**
   * List all shipments with pagination
   */
  async list(page = 1, perPage = 10): Promise<ShipmentListResponse> {
    try {
      const response = await api.get<unknown>(API_ENDPOINTS.SHIPPING.LIST, {
        params: { page, per_page: perPage }
      })
      return this.normalizeShipmentList(response.data, page, perPage)
    } catch (error: unknown) {
      const axiosError = this.asAxiosError(error)
      if (axiosError?.response?.status === 404) {
        throw new Error('Shipping API endpoint is not available yet. Backend integration in progress.')
      }
      throw this.handleError(error, 'Failed to fetch shipments')
    }
  }

  /**
   * Create a new shipment for an order
   */
  async create(data: CreateShipmentData): Promise<Shipment> {
    try {
      const response = await api.post<Shipment>(API_ENDPOINTS.SHIPPING.CREATE, data)
      return response.data
    } catch (error: unknown) {
      const axiosError = this.asAxiosError(error)
      if (axiosError?.response?.status === 404) {
        throw new Error('Shipping API endpoint is not available yet. Backend integration in progress.')
      }
      if (axiosError?.response?.status === 422) {
        const payload = toRecord(axiosError.response.data)
        const message = typeof payload.message === 'string' ? payload.message : 'Invalid shipment data'
        throw new Error(message)
      }
      throw this.handleError(error, 'Failed to create shipment')
    }
  }

  /**
   * Track a shipment by ID
   */
  async track(id: number): Promise<TrackingInfo> {
    try {
      const response = await api.get<TrackingInfo>(API_ENDPOINTS.SHIPPING.TRACK(id))
      return response.data
    } catch (error: unknown) {
      const axiosError = this.asAxiosError(error)
      if (axiosError?.response?.status === 404) {
        throw new Error('Tracking information not available. Shipment may not exist or backend integration is in progress.')
      }
      throw this.handleError(error, 'Failed to fetch tracking information')
    }
  }

  /**
   * Get orders available for shipment creation
   */
  async getAvailableOrders(): Promise<OrderForShipment[]> {
    try {
      const response = await api.get<unknown>(`${API_ENDPOINTS.SHIPPING.LIST}/available-orders`)
      if (Array.isArray(response.data)) {
        return response.data as OrderForShipment[]
      }

      const payload = toRecord(response.data)
      return Array.isArray(payload.data) ? payload.data as OrderForShipment[] : []
    } catch (error: unknown) {
      const axiosError = this.asAxiosError(error)
      if (axiosError?.response?.status === 404) {
        console.warn('Available orders endpoint not implemented yet')
        return []
      }
      throw this.handleError(error, 'Failed to fetch available orders')
    }
  }

  private asAxiosError(error: unknown): AxiosError | null {
    return error instanceof AxiosError ? error : null
  }

  /**
   * Centralized error handler
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (error instanceof Error && error.message) {
      return new Error(error.message)
    }

    const axiosError = this.asAxiosError(error)
    const responsePayload = axiosError ? toRecord(axiosError.response?.data) : {}
    const message = typeof responsePayload.message === 'string'
      ? responsePayload.message
      : defaultMessage

    return new Error(message)
  }
}

// Export singleton instance
export const shippingService = new ShippingService()

// Export type for testing and mocking
export type { IShippingService }
