/**
 * ShippingPage Component
 *
 * Main page for shipping management with tabbed interface.
 * Follows SRP: Single responsibility for page layout and navigation.
 * Follows OCP: Extensible by adding new tabs without modification to core logic.
 */

import { useState } from 'react';
import { ShipmentList, CreateShipmentForm, TrackingInfo } from '../components';
import type { Shipment } from '../types/shipping.types';

/**
 * Available tabs
 */
enum Tab {
  LIST = 'list',
  CREATE = 'create',
  TRACKING = 'tracking',
}

/**
 * Tab configuration
 * Follows OCP: Easy to add new tabs by extending this array
 */
interface TabConfig {
  id: Tab;
  label: string;
  icon: JSX.Element;
}

const tabs: TabConfig[] = [
  {
    id: Tab.LIST,
    label: 'Shipments',
    icon: (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: Tab.CREATE,
    label: 'Create Shipment',
    icon: (
      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
];

/**
 * ShippingPage Component
 *
 * Container page for all shipping-related functionality.
 * Manages tab navigation and inter-component communication.
 */
export function ShippingPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LIST);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  /**
   * Handle tracking view request from ShipmentList
   */
  const handleTrackingClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setActiveTab(Tab.TRACKING);
  };

  /**
   * Handle successful shipment creation
   * Navigate back to list to show new shipment
   */
  const handleShipmentCreated = () => {
    setActiveTab(Tab.LIST);
  };

  /**
   * Close tracking view
   */
  const handleCloseTracking = () => {
    setSelectedShipment(null);
    setActiveTab(Tab.LIST);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shipping Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage shipments and track orders with Andreani integration
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
            {selectedShipment && activeTab === Tab.TRACKING && (
              <button
                onClick={() => setActiveTab(Tab.TRACKING)}
                className="flex items-center py-4 px-1 border-b-2 border-indigo-500 text-indigo-600 font-medium text-sm"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Tracking
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {activeTab === Tab.LIST && (
            <ShipmentList onTrackingClick={handleTrackingClick} />
          )}

          {activeTab === Tab.CREATE && (
            <CreateShipmentForm onSuccess={handleShipmentCreated} />
          )}

          {activeTab === Tab.TRACKING && selectedShipment && (
            <TrackingInfo
              shipmentId={selectedShipment.id}
              onClose={handleCloseTracking}
            />
          )}
        </div>
      </div>
    </div>
  );
}
