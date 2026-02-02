import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        sage:
          'bg-sage-black text-sage-white shadow-elegant hover:shadow-elegant-lg hover:bg-sage-black/90 focus-visible:ring-sage-black relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000',
        gold:
          'bg-sage-gold text-sage-white shadow-gold hover:shadow-gold-lg hover:bg-sage-gold-dark focus-visible:ring-sage-gold relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000',
        secondary:
          'bg-sage-gray-700 text-sage-white shadow-elegant hover:shadow-elegant-lg hover:bg-sage-gray-600 focus-visible:ring-sage-gray-700',
        outline:
          'border-2 border-sage-gray-300 bg-background text-sage-black hover:bg-sage-gray-50 hover:border-sage-black focus-visible:ring-sage-black transition-sophisticated',
        ghost:
          'text-sage-black hover:bg-sage-gray-100 focus-visible:ring-sage-black transition-sophisticated',
        danger:
          'bg-destructive text-sage-white shadow-elegant hover:shadow-elegant-lg hover:bg-destructive/90 focus-visible:ring-destructive',
        link:
          'text-sage-black underline-offset-4 hover:underline focus-visible:ring-sage-black',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'sage',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
