import { forwardRef, type InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  containerClassName?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, containerClassName, label, error, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('flex items-start', containerClassName)}>
        <div className="relative flex h-5 items-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              'peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white',
              'checked:border-primary checked:bg-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:bg-gray-100',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute left-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 cursor-pointer text-sm text-gray-700"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
