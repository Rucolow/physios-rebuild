import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const button = cva(
  ['inline-flex items-center justify-center gap-2 rounded-field font-bold whitespace-nowrap', 'transition-colors duration-fast ease-out', 'disabled:pointer-events-none disabled:opacity-50'],
  { variants: {
    variant: {
      primary: 'bg-gold-500 text-navy-900 hover:bg-gold-400 active:bg-gold-600 shadow-e1',
      secondary: 'bg-layer-10 text-white border border-layer-10 hover:bg-layer-20',
      outline: 'border border-layer-10 text-navy-200 hover:bg-layer-5 hover:text-white',
      ghost: 'text-navy-300 hover:bg-layer-5 hover:text-white',
      link: 'text-gold-400 hover:text-gold-300 font-bold',
      danger: 'bg-red-500 text-navy-900 hover:bg-red-400 active:bg-red-600',
      'danger-outline': 'border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20',
    },
    size: { sm: 'h-8 px-3 text-2xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-sm', icon: 'h-10 w-10 p-0' },
    block: { true: 'w-full', false: '' },
  }, defaultVariants: { variant: 'secondary', size: 'md', block: false } },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>
export function Button({ className, variant, size, block, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(button({ variant, size, block }), className)} {...props} />
}
