import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
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
          'border-2 border-border bg-background text-foreground hover:bg-muted hover:border-sage-gold/45 focus-visible:ring-ring transition-sophisticated',
        ghost:
          'text-foreground hover:bg-muted focus-visible:ring-ring transition-sophisticated',
        danger:
          'bg-destructive text-sage-white shadow-elegant hover:shadow-elegant-lg hover:bg-destructive/90 focus-visible:ring-destructive',
        link:
          'text-foreground underline-offset-4 hover:underline focus-visible:ring-ring',
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
