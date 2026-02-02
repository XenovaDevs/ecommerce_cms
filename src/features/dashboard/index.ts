/**
 * Dashboard Feature Barrel Export
 * Central export point for the dashboard feature module
 */

// Pages
export { DashboardPage } from './pages/DashboardPage'

// Components
export { StatsGrid, RecentOrders, TopProducts } from './components'

// Hooks
export { useDashboardStats, dashboardKeys } from './hooks/useDashboardStats'

// Services
export { dashboardService } from './services/dashboard.service'

// Types
export type {
  DashboardStats,
  DashboardData,
  RecentOrder,
  TopProduct,
} from './types/dashboard.types'
