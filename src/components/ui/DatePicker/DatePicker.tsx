import { forwardRef, type InputHTMLAttributes } from 'react'
import { Calendar } from 'lucide-react'
import { format, parse } from 'date-fns'
import { cn } from '@/lib/utils'

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-sage-black mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Calendar className="w-4 h-4 text-sage-gray-500" />
          </div>

          <input
            ref={ref}
            type="date"
            className={cn(
              'w-full h-10 pl-10 pr-4 rounded-lg',
              'border border-sage-gray-300 bg-sage-white',
              'text-sm text-sage-black',
              'transition-all',
              'focus:outline-none focus:border-sage-gold focus:ring-2 focus:ring-sage-gold/20',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

interface DateRangePickerProps {
  fromDate?: string
  toDate?: string
  onFromChange?: (date: string) => void
  onToChange?: (date: string) => void
  fromLabel?: string
  toLabel?: string
  error?: string
  className?: string
}

export const DateRangePicker = ({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  fromLabel = 'From',
  toLabel = 'To',
  error,
  className,
}: DateRangePickerProps) => {
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ''
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date())
      return format(date, 'yyyy-MM-dd')
    } catch {
      return dateString
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePicker
          label={fromLabel}
          value={formatDate(fromDate)}
          onChange={(e) => onFromChange?.(e.target.value)}
          max={toDate}
        />

        <DatePicker
          label={toLabel}
          value={formatDate(toDate)}
          onChange={(e) => onToChange?.(e.target.value)}
          min={fromDate}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  )
}

DateRangePicker.displayName = 'DateRangePicker'
