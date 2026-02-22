import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight transition-sophisticated',
  {
    variants: {
      variant: {
        default:
          'bg-sage-gray-100 text-sage-gray-800 hover:bg-sage-gray-200',
        sage:
          'bg-sage-black/10 text-sage-black hover:bg-sage-black/20',
        gold:
          'bg-sage-gold/15 text-sage-gold-dark hover:bg-sage-gold/25',
        success:
          'bg-green-50 text-green-800 hover:bg-green-100 border border-green-200',
        warning:
          'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200',
        danger:
          'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200',
        info:
          'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200',
        outline:
          'border-2 border-sage-gray-300 bg-transparent text-sage-gray-700 hover:bg-sage-gray-50',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)
