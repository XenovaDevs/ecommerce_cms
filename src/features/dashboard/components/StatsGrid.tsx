/**
 * StatsGrid Component
 * Single Responsibility: Display dashboard statistics in a grid layout
 */

import { ShoppingCart, DollarSign, Package, Users, LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card/Card'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { formatCurrency } from '@/lib/utils'
import { DashboardStats } from '../types/dashboard.types'

interface StatCardData {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
}

interface StatsGridProps {
  stats?: DashboardStats
  isLoading?: boolean
}

/**
 * Individual stat card component
 */
function StatCard({ title, value, icon: Icon, color, bgColor }: StatCardData) {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-sage-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-sage-black">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for stats grid
 */
function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton height={80} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * Transform stats data into stat card configurations
 */
function buildStatCards(stats: DashboardStats): StatCardData[] {
  return [
    {
      title: 'Total Órdenes',
      value: stats.total_orders || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(stats.total_revenue || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Productos',
      value: stats.total_products || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Clientes',
      value: stats.total_customers || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]
}

/**
 * StatsGrid - Displays dashboard statistics in a responsive grid
 *
 * Adheres to SRP by only handling stat card rendering and layout.
 * Data fetching and formatting logic is delegated to parent and utility functions.
 */
export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return <StatsGridSkeleton />
  }

  if (!stats) {
    return null
  }

  const statCards = buildStatCards(stats)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
