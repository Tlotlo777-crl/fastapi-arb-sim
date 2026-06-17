import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TruckStatus, Transaction } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLitres(litres: number): string {
  if (litres >= 1_000_000) return `${(litres / 1_000_000).toFixed(1)}M L`
  if (litres >= 1_000)     return `${(litres / 1_000).toFixed(0)}K L`
  return `${litres.toLocaleString()} L`
}

export function formatPula(amount: number): string {
  return `BWP ${amount.toLocaleString('en-BW', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function statusColor(status: TruckStatus): string {
  switch (status) {
    case 'in_transit':  return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    case 'fueling':     return 'text-fuel bg-fuel/10 border-fuel/20'
    case 'idle':        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    case 'maintenance': return 'text-red-400 bg-red-400/10 border-red-400/20'
  }
}

export function statusLabel(status: TruckStatus): string {
  switch (status) {
    case 'in_transit':  return 'In Transit'
    case 'fueling':     return 'Fueling'
    case 'idle':        return 'Idle'
    case 'maintenance': return 'Maintenance'
  }
}

export function txStatusStyle(status: Transaction['status']): string {
  switch (status) {
    case 'completed': return 'text-green-400 bg-green-400/10'
    case 'pending':   return 'text-yellow-400 bg-yellow-400/10'
    case 'flagged':   return 'text-red-400 bg-red-400/10'
  }
}

export function fuelLevelColor(pct: number): string {
  if (pct >= 60) return '#22c55e'
  if (pct >= 30) return '#f97316'
  return '#ef4444'
}

export function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}
