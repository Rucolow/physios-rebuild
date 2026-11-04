import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export const button = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-field font-bold whitespace-nowrap',
    'transition-colors duration-fast ease-out',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-gold-500 text-navy-900 hover:bg-gold-400 active:bg-gold-600 shadow-e1',
        secondary: 'bg-layer-10 text-white border border-layer-10 hover:bg-layer-20',
        outline: 'border border-layer-10 text-navy-200 hover:bg-layer-5 hover:text-white',
        ghost: 'text-navy-300 hover:bg-layer-5 hover:text-white',
        link: 'text-gold-400 hover:text-gold-300 font-bold',
      },
      size: {
        sm: 'h-8 px-3 text-2xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-sm',
        icon: 'h-10 w-10 p-0',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'secondary', size: 'md', block: false },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, ...props },
  ref,
) {
  return <button ref={ref} className={cn(button({ variant, size, block }), className)} {...props} />
})
