import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconRight?: boolean
  loading?: boolean
}

export function Button({
  variant = 'primary', size = 'md',
  icon, iconRight = false, loading = false,
  className, children, disabled, ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2.5 font-semibold rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-fuel/60 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 disabled:opacity-40 disabled:pointer-events-none select-none'

  const variants = {
    primary: 'bg-fuel hover:bg-fuel-600 text-white shadow-glow-sm hover:shadow-fuel active:scale-95',
    outline: 'border border-white/20 text-white hover:border-fuel hover:text-fuel hover:bg-fuel/5 active:scale-95',
    ghost:   'text-slate-400 hover:text-white hover:bg-white/05 active:scale-95',
    danger:  'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 active:scale-95',
  }

  const sizes = {
    sm:  'px-4 py-2 text-sm',
    md:  'px-6 py-3 text-sm',
    lg:  'px-8 py-4 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (!iconRight && icon)}
      {children}
      {(iconRight && icon)}
    </button>
  )
}
