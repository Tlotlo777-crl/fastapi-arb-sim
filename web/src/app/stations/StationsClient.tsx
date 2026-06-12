'use client'
import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import { Search, Filter, MapPin, Droplets, Clock, CheckCircle, Zap } from 'lucide-react'
import { STATIONS } from '@/lib/constants'
import { formatLitres } from '@/lib/utils'
import type { FuelStation } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'

const Map = dynamic(() => import('@/components/sections/NetworkMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full rounded-2xl glass flex items-center justify-center text-slate-400">
      <div className="w-8 h-8 border-2 border-fuel border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

export function StationsClientPage() {
  const [query, setQuery]       = useState('')
  const [statusFlt, setStatus]  = useState<'all' | 'operational' | 'coming_soon'>('all')
  const [fuelFlt, setFuelFlt]   = useState<'all' | 'D50' | 'ULP95'>('all')
  const [active, setActive]     = useState<FuelStation>(STATIONS[0])

  const filtered = useMemo(() =>
    STATIONS.filter(s => {
      const q = query.toLowerCase()
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
      const matchS = statusFlt === 'all' || s.status === statusFlt
      const matchF = fuelFlt  === 'all' || s.nozzles.some(n => n.type === fuelFlt)
      return matchQ && matchS && matchF
    })
  , [query, statusFlt, fuelFlt])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-fuel text-xs font-bold tracking-widest uppercase mb-4">
          <span className="w-8 h-px bg-fuel" /> B2C Station Finder <span className="w-8 h-px bg-fuel" />
        </div>
        <h1 className="font-display text-5xl font-black text-white mb-4">Find a Station</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-fuel to-fuel-300 rounded-full mx-auto mb-6" />
        <p className="text-slate-400 max-w-lg mx-auto">Live pricing, amenities, and capacity for all 9 TswanaFuel sites across Botswana.</p>
      </div>

      {/* Filter bar */}
      <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or location…"
            className="w-full glass rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none border border-transparent focus:border-fuel/40 transition-colors" />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-400" />
          {(['all', 'operational', 'coming_soon'] as const).map(f => (
            <button key={f} onClick={() => setStatus(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${statusFlt === f ? 'bg-fuel text-white' : 'glass text-slate-400 hover:text-white'}`}>
              {f === 'coming_soon' ? 'Coming Soon' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Droplets size={13} className="text-slate-400" />
          {(['all', 'D50', 'ULP95'] as const).map(f => (
            <button key={f} onClick={() => setFuelFlt(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${fuelFlt === f ? 'bg-blue-600 text-white' : 'glass text-slate-400 hover:text-white'}`}>
              {f === 'all' ? 'All Fuel' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-8">

        {/* Station cards */}
        <div className="lg:col-span-2 space-y-3 max-h-[620px] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-slate-400 text-sm">No stations match your filters.</div>
          )}
          {filtered.map(s => (
            <button key={s.id} onClick={() => setActive(s)} className={`w-full text-left rounded-2xl p-5 transition-all duration-200 border glass-dark ${
              active.id === s.id ? 'border-fuel/40 shadow-glow-sm' : 'border-white/04 hover:border-fuel/20'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-black text-white">{s.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} className="text-fuel" />{s.location}
                  </p>
                </div>
                <Badge label={s.status === 'operational' ? 'Live' : 'Soon'} variant={s.status === 'operational' ? 'green' : 'yellow'} dot={s.status === 'operational'} />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="glass rounded-lg p-2 text-center">
                  <Droplets size={12} className="text-fuel mx-auto mb-1" />
                  <p className="text-xs font-bold text-white">{formatLitres(s.capacityLitres)}</p>
                </div>
                <div className="glass rounded-lg p-2 text-center">
                  <Clock size={12} className="text-fuel mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-white">{s.operatingHours}</p>
                </div>
                <div className="glass rounded-lg p-2 text-center">
                  <Zap size={12} className="text-fuel mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-white">
                    {s.nozzles.map(n => n.type).join('/') || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Live prices */}
              {s.fuelPrices.length > 0 && (
                <div className="flex gap-3">
                  {s.fuelPrices.map(fp => (
                    <div key={fp.type} className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400">{fp.type}:</span>
                      <span className="font-black text-fuel">BWP {fp.pricePula.toFixed(2)}/L</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Amenities */}
              {s.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/06">
                  {s.amenities.slice(0, 3).map(a => (
                    <span key={a.id} className="flex items-center gap-1 text-[10px] text-slate-300 glass px-2 py-0.5 rounded-full">
                      <CheckCircle size={9} className="text-fuel" />{a.label}
                    </span>
                  ))}
                  {s.amenities.length > 3 && (
                    <span className="text-[10px] text-slate-400 glass px-2 py-0.5 rounded-full">+{s.amenities.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="lg:col-span-3 h-[620px]">
          <Map activeStation={active} onSelect={setActive} />
        </div>
      </div>
    </div>
  )
}
