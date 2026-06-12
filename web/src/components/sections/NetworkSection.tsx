'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MapPin, Droplets, Zap, Clock, CheckCircle } from 'lucide-react'
import { STATIONS } from '@/lib/constants'
import { formatLitres } from '@/lib/utils'
import type { FuelStation } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'

const Map = dynamic(() => import('./NetworkMap'), { ssr: false, loading: () => (
  <div className="h-[480px] rounded-2xl glass flex items-center justify-center text-slate-400">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-fuel border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm">Loading map…</p>
    </div>
  </div>
)})

export function NetworkSection() {
  const [active, setActive] = useState<FuelStation>(STATIONS[0])

  return (
    <section id="network" className="py-24 bg-navy-950">
      <div className="section-width px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-fuel text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-8 h-px bg-fuel" /> Across Botswana <span className="w-8 h-px bg-fuel" />
          </div>
          <h2 className="font-display text-5xl font-black text-white mb-4">Our Network</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-fuel to-fuel-300 rounded-full mx-auto mb-6" />
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            All sites strategically located near border posts — total capacity:{' '}
            <span className="text-white font-bold">2 million litres</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Station list */}
          <div className="lg:col-span-2 space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {STATIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s)}
                className={`w-full text-left rounded-xl p-4 transition-all duration-200 border ${
                  active.id === s.id
                    ? 'border-fuel/40 bg-fuel/08 shadow-glow-sm'
                    : 'border-white/06 glass hover:border-fuel/20 hover:bg-fuel/03'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-white text-sm">{s.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.location}</p>
                  </div>
                  <Badge
                    label={s.status === 'operational' ? 'Live' : 'Soon'}
                    variant={s.status === 'operational' ? 'green' : 'yellow'}
                    dot={s.status === 'operational'}
                  />
                </div>
                <div className="flex gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Droplets size={11} className="text-fuel" />
                    {formatLitres(s.capacityLitres)}
                  </span>
                  {s.nozzles.map(n => (
                    <span key={n.type} className="flex items-center gap-1">
                      <Zap size={11} className="text-fuel" />
                      {n.count}x {n.type}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Map + detail panel */}
          <div className="lg:col-span-3 space-y-4">
            <Map activeStation={active} onSelect={setActive} />

            {/* Active station detail */}
            <div className="glass rounded-2xl p-5 border-fuel/15">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-white text-lg">{active.name}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                    <MapPin size={12} className="text-fuel" /> {active.location}
                  </p>
                </div>
                <Badge
                  label={active.status === 'operational' ? 'Operational' : 'Coming Soon'}
                  variant={active.status === 'operational' ? 'green' : 'yellow'}
                  dot
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">Capacity</p>
                  <p className="font-black text-fuel">{formatLitres(active.capacityLitres)}</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">Hours</p>
                  <p className="font-black text-white text-xs">{active.operatingHours}</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">Fuel Types</p>
                  <p className="font-black text-white text-xs">
                    {active.nozzles.map(n => n.type).join(' / ') || 'N/A'}
                  </p>
                </div>
              </div>

              {active.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {active.amenities.map(a => (
                    <span key={a.id} className="flex items-center gap-1.5 text-xs text-slate-300 glass px-2.5 py-1 rounded-full">
                      <CheckCircle size={10} className="text-fuel" /> {a.label}
                    </span>
                  ))}
                </div>
              )}

              {active.fuelPrices.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/06 flex gap-4">
                  {active.fuelPrices.map(fp => (
                    <div key={fp.type}>
                      <p className="text-xs text-slate-400">{fp.type}</p>
                      <p className="font-black text-white">BWP {fp.pricePula.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/L</span></p>
                    </div>
                  ))}
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={11} /> Updated today
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
