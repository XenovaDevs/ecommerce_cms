import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useTabsContext } from './Tabs'

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  /** Child TabsTrigger components */
  children: React.ReactNode
}

/**
 * TabsList Component
 * Container for tab triggers with orientation-aware layout
 *
 * Follows Interface Segregation Principle - focused solely on layout responsibility
 */
export function TabsList({ children, className, ...props }: TabsListProps) {
  const { orientation } = useTabsContext()

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        'inline-flex items-center justify-start gap-1 rounded-lg bg-sage-pearl p-1',
        'border border-sage-whisper shadow-sm',
        orientation === 'horizontal' ? 'flex-row w-full' : 'flex-col w-fit min-w-[180px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

TabsList.displayName = 'TabsList'
