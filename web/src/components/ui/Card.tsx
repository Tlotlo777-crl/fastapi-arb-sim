import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
  noPad?: boolean
}

export function Card({ children, className, glow = false, hover = false, noPad = false }: CardProps) {
  return (
    <div className={cn(
      'glass rounded-2xl',
      !noPad && 'p-6',
      glow  && 'shadow-fuel',
      hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-fuel/20',
      className,
    )}>
      {children}
    </div>
  )
}

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  change?: number
  icon?: ReactNode
  accent?: boolean
}

export function KPICard({ label, value, unit, change, icon, accent = false }: KPICardProps) {
  const positive = change !== undefined && change >= 0

  return (
    <div className={cn(
      'glass rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5',
      accent && 'border-fuel/25 bg-fuel/05',
    )}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        {icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', accent ? 'bg-fuel/20' : 'bg-white/08')}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className={cn('text-3xl font-black', accent ? 'text-gradient-fuel' : 'text-white')}>
          {value}
        </span>
        {unit && <span className="text-sm text-slate-400 mb-0.5">{unit}</span>}
      </div>

      {change !== undefined && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs font-semibold',
          positive ? 'text-green-400' : 'text-red-400'
        )}>
          <span>{positive ? '↑' : '↓'}</span>
          <span>{Math.abs(change)}% vs last month</span>
        </div>
      )}
    </div>
  )
}
