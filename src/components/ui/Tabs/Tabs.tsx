import { createContext, useContext, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within TabsContainer')
  }
  return context
}

interface TabsContainerProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
}

export const TabsContainer = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: TabsContainerProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue)

  const activeTab = value ?? internalValue
  const setActiveTab = (newValue: string) => {
    if (!value) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabsList = ({ children, className, ...props }: TabsListProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center border-b border-sage-gray-200 gap-6',
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

export const TabsTrigger = ({
  value,
  disabled = false,
  children,
  className,
  ...props
}: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative pb-3 px-1 text-sm font-medium tracking-tight transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-gold focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isActive
          ? 'text-sage-black'
          : 'text-sage-gray-600 hover:text-sage-black',
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <span
          className={cn(
            'absolute bottom-0 left-0 right-0 h-0.5 bg-sage-gold',
            'transition-all duration-300'
          )}
        />
      )}
    </button>
  )
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: boolean
}

export const TabsContent = ({
  value,
  forceMount = false,
  children,
  className,
  ...props
}: TabsContentProps) => {
  const { activeTab } = useTabsContext()
  const isActive = activeTab === value

  if (!isActive && !forceMount) {
    return null
  }

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      className={cn(
        'pt-6',
        isActive && 'animate-fade-in',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

TabsContainer.displayName = 'TabsContainer'
TabsList.displayName = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'
