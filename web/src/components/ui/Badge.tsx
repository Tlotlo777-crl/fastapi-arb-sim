import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'fuel' | 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  dot?: boolean
  className?: string
}

export function Badge({ label, variant = 'gray', dot = false, className }: BadgeProps) {
  const variants = {
    fuel:   'bg-fuel/15 text-fuel border-fuel/25',
    green:  'bg-green-400/15 text-green-400 border-green-400/25',
    yellow: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/25',
    red:    'bg-red-400/15 text-red-400 border-red-400/25',
    blue:   'bg-blue-400/15 text-blue-400 border-blue-400/25',
    gray:   'bg-white/08 text-slate-400 border-white/10',
  }

  const dotColors = {
    fuel:   'bg-fuel',
    green:  'bg-green-400',
    yellow: 'bg-yellow-400',
    red:    'bg-red-400',
    blue:   'bg-blue-400',
    gray:   'bg-slate-400',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      variants[variant], className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse-slow', dotColors[variant])} />}
      {label}
    </span>
  )
}
