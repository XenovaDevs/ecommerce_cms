import { useState, useEffect, useRef, type InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void
  debounceMs?: number
  showClearButton?: boolean
}

export const SearchInput = ({
  onSearch,
  debounceMs = 300,
  showClearButton = true,
  className,
  placeholder = 'Search...',
  defaultValue = '',
  ...props
}: SearchInputProps) => {
  const [value, setValue] = useState(defaultValue as string)
  const [isFocused, setIsFocused] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      onSearch?.(value)
    }, debounceMs)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [value, debounceMs, onSearch])

  const handleClear = () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div
      className={cn(
        'relative flex items-center w-full',
        'rounded-lg border border-sage-gray-300',
        'bg-sage-white transition-all',
        isFocused && 'border-sage-gold ring-2 ring-sage-gold/20',
        className
      )}
    >
      <div className="absolute left-3 pointer-events-none">
        <Search className="w-4 h-4 text-sage-gray-500" />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          'w-full h-10 pl-10 pr-10 text-sm',
          'bg-transparent text-sage-black placeholder:text-sage-gray-500',
          'focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        {...props}
      />

      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'absolute right-3 p-1 rounded',
            'text-sage-gray-500 hover:text-sage-black',
            'transition-colors focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-sage-gold'
          )}
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

SearchInput.displayName = 'SearchInput'
