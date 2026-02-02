/**
 * TrackingInfo Component
 *
 * Displays detailed tracking information with timeline of events.
 * Follows SRP: Single responsibility for tracking visualization.
 * Follows OCP: Extensible through props without modification.
 */

import React from 'react';
import { useTrackingInfo } from '../hooks';
import { ShippingStatus } from '../types/shipping.types';
import type { TrackingEvent } from '../types/shipping.types';

/**
 * Component props
 */
interface TrackingInfoProps {
  shipmentId: number;
  onClose?: () => void;
}

/**
 * Get status badge color
 */
function getStatusColor(status: ShippingStatus): string {
  switch (status) {
    case ShippingStatus.PENDING:
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case ShippingStatus.SHIPPED:
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case ShippingStatus.IN_TRANSIT:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case ShippingStatus.DELIVERED:
      return 'bg-green-100 text-green-800 border-green-300';
    case ShippingStatus.FAILED:
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Get timeline dot color
 */
function getTimelineDotColor(status: ShippingStatus): string {
  switch (status) {
    case ShippingStatus.DELIVERED:
      return 'bg-green-500';
    case ShippingStatus.IN_TRANSIT:
      return 'bg-yellow-500';
    case ShippingStatus.SHIPPED:
      return 'bg-blue-500';
    case ShippingStatus.FAILED:
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}

/**
 * Format timestamp to readable date
 */
function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Timeline Event Item Component
 * Follows SRP: Single responsibility for rendering one timeline event
 */
interface TimelineEventProps {
  event: TrackingEvent;
  isLast: boolean;
}

function TimelineEvent({ event, isLast }: TimelineEventProps): JSX.Element {
  return (
    <div className="relative pb-8">
      {!isLast && (
        <span
          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
      )}
      <div className="relative flex space-x-3">
        <div>
          <span
            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getTimelineDotColor(
              event.status
            )}`}
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
          <div>
            <p className="text-sm font-medium text-gray-900">{event.description}</p>
            {event.location && (
              <p className="mt-0.5 text-sm text-gray-500">Location: {event.location}</p>
            )}
          </div>
          <div className="whitespace-nowrap text-right text-sm text-gray-500">
            <time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TrackingInfo Component
 *
 * Displays shipment tracking details with event timeline.
 * Handles loading, error, and empty states.
 */
export function TrackingInfo({ shipmentId, onClose }: TrackingInfoProps): JSX.Element {
  const { trackingInfo, isLoading, isError, error } = useTrackingInfo({ shipmentId });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading tracking information...</span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Unable to Load Tracking Information
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{error?.message || 'An error occurred while fetching tracking data.'}</p>
            </div>
          </div>
        </div>
        {onClose && (
          <div className="mt-4">
            <button
              onClick={onClose}
              className="text-sm font-medium text-yellow-800 hover:text-yellow-900"
            >
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!trackingInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tracking information available</p>
      </div>
    );
  }

  const { shipment, events, estimated_delivery } = trackingInfo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Tracking: {shipment.tracking_number}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Order #{shipment.order_id} - {shipment.carrier}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            shipment.status
          )}`}
        >
          Current Status: {shipment.status.replace('_', ' ').toUpperCase()}
        </span>
        {estimated_delivery && (
          <span className="text-sm text-gray-500">
            Estimated delivery: {new Date(estimated_delivery).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="flow-root">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Tracking History</h4>
        {events.length > 0 ? (
          <ul className="-mb-8">
            {events.map((event, idx) => (
              <li key={event.id}>
                <TimelineEvent event={event} isLast={idx === events.length - 1} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No tracking events available yet</p>
        )}
      </div>
    </div>
  );
}
