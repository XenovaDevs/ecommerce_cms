import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useTabsContext } from './Tabs'

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Value matching the associated TabsTrigger */
  value: string
  /** Content to display when tab is active */
  children: React.ReactNode
  /** Force mount content even when inactive (useful for preserving state) */
  forceMount?: boolean
}

/**
 * TabsContent Component
 * Content panel with slide animation using sophisticated easing
 *
 * Animation Details:
 * - Fade in: opacity 0 → 1
 * - Slide up: translateY(10px) → 0
 * - Duration: 400ms with cubic-bezier easing
 *
 * Follows Open/Closed Principle - extensible via className prop
 */
export function TabsContent({
  value,
  children,
  forceMount = false,
  className,
  ...props
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext()
  const isActive = activeValue === value

  // Don't render if not active (unless forceMount)
  if (!isActive && !forceMount) {
    return null
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      hidden={!isActive}
      className={cn(
        'mt-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-black focus-visible:ring-offset-2',
        // Sophisticated slide animation with easing
        isActive &&
          'animate-in fade-in-0 slide-in-from-bottom-2 duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
        !isActive && forceMount && 'opacity-0 pointer-events-none',
        className
      )}
      style={{
        animationDuration: '400ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', // Elegant easing
      }}
      {...props}
    >
      {children}
    </div>
  )
}

TabsContent.displayName = 'TabsContent'
