/**
 * DashboardPage Component
 * Single Responsibility: Orchestrate dashboard layout and data display
 *
 * This component follows Clean Architecture principles:
 * - Presentational logic only
 * - Business logic delegated to hooks and services
 * - Component composition for maintainability
 */

import { useDashboardStats } from '../hooks/useDashboardStats'
import { StatsGrid } from '../components/StatsGrid'
import { RecentOrders } from '../components/RecentOrders'
import { TopProducts } from '../components/TopProducts'

/**
 * DashboardPage - Main dashboard view
 *
 * Automatically refreshes data every 5 minutes via useDashboardStats hook
 */
export function DashboardPage() {
  const { data, isLoading } = useDashboardStats()

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-sage-black mb-6">Dashboard</h1>

      {/* Statistics Grid */}
      <div className="mb-8">
        <StatsGrid stats={data} isLoading={isLoading} />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={data?.recent_orders} />
        <TopProducts products={data?.top_products} />
      </div>
    </div>
  )
}
