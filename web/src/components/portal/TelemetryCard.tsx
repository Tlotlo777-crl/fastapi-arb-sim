'use client'
import { Gauge, Navigation, AlertTriangle, MapPin, Zap } from 'lucide-react'
import type { FleetTruck } from '@/lib/types'
import { statusColor, statusLabel, fuelLevelColor, formatLitres, relativeTime } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface Props { truck: FleetTruck; onClick?: () => void; selected?: boolean }

export function TelemetryCard({ truck, onClick, selected }: Props) {
  const fl = fuelLevelColor(truck.fuelLevelPct)
  const loadPct = Math.round((truck.loadLitres / truck.maxLoadLitres) * 100)
  const badgeVariant = truck.status === 'in_transit' ? 'blue' : truck.status === 'fueling' ? 'fuel' : truck.status === 'idle' ? 'gray' : 'red'

  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card ${
        selected ? 'border-fuel/40 bg-fuel/05 shadow-glow-sm' : 'hover:border-fuel/15'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-black text-white font-mono text-base">{truck.plateNumber}</p>
          <p className="text-xs text-slate-400 mt-0.5">{truck.driverName}</p>
        </div>
        <Badge label={statusLabel(truck.status)} variant={badgeVariant as never} dot />
      </div>

      {/* Telemetry row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="glass rounded-xl p-2 text-center">
          <Gauge size={13} className="text-fuel mx-auto mb-1" />
          <p className="text-lg font-black text-white">{truck.speedKph}</p>
          <p className="text-[10px] text-slate-500">km/h</p>
        </div>
        <div className="glass rounded-xl p-2 text-center">
          <Zap size={13} className="text-fuel mx-auto mb-1" />
          <p className="text-lg font-black text-white">{formatLitres(truck.loadLitres)}</p>
          <p className="text-[10px] text-slate-500">Load</p>
        </div>
        <div className="glass rounded-xl p-2 text-center">
          <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ background: fl }} />
          <p className="text-lg font-black text-white">{truck.fuelLevelPct}%</p>
          <p className="text-[10px] text-slate-500">Fuel</p>
        </div>
      </div>

      {/* Fuel level bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Fuel Level</span>
          {truck.fuelLevelPct < 30 && <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={9} /> Low</span>}
        </div>
        <div className="h-1.5 bg-white/08 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${truck.fuelLevelPct}%`, background: fl }} />
        </div>
      </div>

      {/* Load bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Load</span><span>{loadPct}%</span>
        </div>
        <div className="h-1.5 bg-white/08 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${loadPct}%` }} />
        </div>
      </div>

      {/* Destination */}
      <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-white/06 pt-3">
        <MapPin size={11} className="text-fuel flex-shrink-0" />
        <span className="truncate">{truck.currentLocation.address}</span>
        <span className="ml-auto flex items-center gap-1 flex-shrink-0">
          <Navigation size={11} className="text-fuel" />
          <span className="text-white font-medium">{truck.destination}</span>
        </span>
      </div>

      <p className="text-[10px] text-slate-500 mt-2 text-right">{relativeTime(truck.lastUpdated)}</p>
    </div>
  )
}
