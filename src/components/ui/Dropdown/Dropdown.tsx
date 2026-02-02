import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../Button/Button'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

export const Dropdown = ({
  trigger,
  children,
  align = 'left',
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] rounded-lg',
            'border border-sage-gray-200 bg-sage-white shadow-elegant-lg',
            'animate-scale-in',
            align === 'left' && 'left-0',
            align === 'right' && 'right-0',
            align === 'center' && 'left-1/2 -translate-x-1/2'
          )}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  disabled?: boolean
  destructive?: boolean
}

export const DropdownItem = ({
  icon,
  disabled = false,
  destructive = false,
  children,
  className,
  onClick,
  ...props
}: DropdownItemProps) => {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left',
        'transition-colors focus-visible:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        destructive
          ? 'text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10'
          : 'text-sage-black hover:bg-sage-gray-100 focus-visible:bg-sage-gray-100',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  )
}

export const DropdownDivider = () => {
  return <div className="my-1 h-px bg-sage-gray-200" role="separator" />
}

interface DropdownTriggerProps {
  children: ReactNode
  variant?: 'sage' | 'gold' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const DropdownTrigger = ({
  children,
  variant = 'outline',
  size = 'md',
  className,
}: DropdownTriggerProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      rightIcon={<ChevronDown className="w-4 h-4" />}
      className={className}
    >
      {children}
    </Button>
  )
}

Dropdown.displayName = 'Dropdown'
DropdownItem.displayName = 'DropdownItem'
DropdownDivider.displayName = 'DropdownDivider'
DropdownTrigger.displayName = 'DropdownTrigger'
