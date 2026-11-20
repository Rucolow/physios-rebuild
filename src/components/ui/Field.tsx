import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const field = cva(['w-full rounded-field bg-layer-5 border border-layer-10', 'text-sm text-white placeholder:text-navy-500', 'transition-colors duration-fast ease-out', 'focus:border-gold-500 focus:outline-none', 'disabled:cursor-not-allowed disabled:bg-layer-3 disabled:text-navy-500', 'aria-[invalid=true]:border-red-500'], { variants: {
  size: { sm: 'h-9 px-3', md: 'h-11 px-4' }, hasLeadingIcon: { true: 'pl-10', false: '' }, numeric: { true: 'font-mono tabular-nums', false: '' },
}, defaultVariants: { size: 'md', hasLeadingIcon: false, numeric: false } })
type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & VariantProps<typeof field>
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, size, hasLeadingIcon, numeric, ...props }, ref) { return <input ref={ref} className={cn(field({ size, hasLeadingIcon, numeric }), className)} {...props} /> })
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) { return <textarea ref={ref} className={cn(field(), 'h-auto min-h-24 py-3', className)} {...props} /> })
/** ネイティブメニューをダーク化するため <option> には className="bg-navy-700" を付ける（§4-9） */
export const Select = forwardRef<HTMLSelectElement, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>>(function Select({ className, children, ...props }, ref) { return <select ref={ref} className={cn(field(), 'cursor-pointer appearance-none pr-10', className)} {...props}>{children}</select> })
export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) { return <div className="space-y-1.5"><label htmlFor={id} className="block text-2xs font-medium text-navy-300">{label}</label>{children}{hint && <p className="text-2xs text-navy-500">{hint}</p>}{error && <p id={`${id}-error`} className="text-2xs font-medium text-red-400">{error}</p>}</div> }
