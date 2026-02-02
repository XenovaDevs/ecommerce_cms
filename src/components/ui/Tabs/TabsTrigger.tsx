import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useTabsContext } from './Tabs'

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique value identifying this tab */
  value: string
  /** Tab label */
  children: React.ReactNode
  /** Icon to display before label */
  icon?: React.ReactNode
}

/**
 * TabsTrigger Component
 * Interactive button to switch between tabs with smooth animations
 *
 * Features:
 * - Sophisticated easing transitions (cubic-bezier)
 * - Sage/gold color scheme
 * - Accessibility with ARIA attributes
 * - Keyboard navigation support
 */
export function TabsTrigger({
  value,
  children,
  icon,
  className,
  disabled,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onChange, orientation } = useTabsContext()
  const isActive = activeValue === value

  const handleClick = () => {
    if (!disabled) {
      onChange(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium',
        'rounded-md whitespace-nowrap',
        'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]', // Sophisticated easing
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-black focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        orientation === 'horizontal' ? 'flex-1' : 'w-full justify-start',
        isActive
          ? 'bg-white text-sage-black shadow-md border border-sage-whisper'
          : 'text-sage-slate hover:text-sage-black hover:bg-white/50',
        // Slide indicator animation
        isActive &&
          'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold after:to-gold-dark',
        className
      )}
      {...props}
    >
      {icon && (
        <span className={cn('transition-transform duration-300', isActive && 'scale-110')}>
          {icon}
        </span>
      )}
      <span className="transition-colors duration-300">{children}</span>
    </button>
  )
}

TabsTrigger.displayName = 'TabsTrigger'
