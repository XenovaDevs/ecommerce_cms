/**
 * Customers Feature Module Exports
 * Clean module boundary following Open/Closed Principle
 */

// Types
export type {
  Customer,
  CustomerFilters,
  CustomerListResponse,
  CustomerOrder,
  CustomerDetailData,
} from './types/customer.types';

// Services
export { customerService } from './services/customer.service';

// Hooks
export { useCustomers } from './hooks/useCustomers';
export { useCustomer } from './hooks/useCustomer';

// Components
export { CustomerFilters } from './components/CustomerFilters';
export { CustomerList } from './components/CustomerList';
export { CustomerDetail } from './components/CustomerDetail';

// Pages
export { CustomersPage } from './pages/CustomersPage';
export { CustomerDetailPage } from './pages/CustomerDetailPage';
