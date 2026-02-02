import { type ReactNode, type HTMLAttributes } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '../Card/Card'

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label?: string
  }
  color?: 'sage' | 'gold' | 'success' | 'danger' | 'info'
}

const colorClasses = {
  sage: {
    icon: 'bg-sage-black/10 text-sage-black',
    trend: 'text-sage-black',
  },
  gold: {
    icon: 'bg-sage-gold/10 text-sage-gold',
    trend: 'text-sage-gold',
  },
  success: {
    icon: 'bg-green-100 text-green-600',
    trend: 'text-green-600',
  },
  danger: {
    icon: 'bg-red-100 text-red-600',
    trend: 'text-red-600',
  },
  info: {
    icon: 'bg-blue-100 text-blue-600',
    trend: 'text-blue-600',
  },
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = 'sage',
  className,
  ...props
}: StatCardProps) => {
  const isPositiveTrend = trend && trend.value > 0
  const isNegativeTrend = trend && trend.value < 0

  return (
    <Card
      variant="default"
      className={cn(
        'p-6 transition-all hover:-translate-y-1',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-sage-gray-600 mb-1">
            {title}
          </p>

          <p className="text-3xl font-bold text-sage-black tracking-tight">
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-1 mt-3">
              {isPositiveTrend && (
                <TrendingUp className="w-4 h-4 text-green-600" />
              )}
              {isNegativeTrend && (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}

              <span
                className={cn(
                  'text-sm font-medium',
                  isPositiveTrend && 'text-green-600',
                  isNegativeTrend && 'text-red-600',
                  !isPositiveTrend && !isNegativeTrend && 'text-sage-gray-600'
                )}
              >
                {isPositiveTrend && '+'}
                {trend.value}%
              </span>

              {trend.label && (
                <span className="text-sm text-sage-gray-600 ml-1">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              'flex-shrink-0 transition-transform hover:scale-110',
              colorClasses[color].icon
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

StatCard.displayName = 'StatCard'
