'use client'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Zap, Gauge, MapPin, AlertTriangle, Navigation } from 'lucide-react'
import { MOCK_FLEET } from '@/lib/constants'
import { statusColor, statusLabel, fuelLevelColor } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export function StationFleetScroller() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tracksRef    = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!containerRef.current || !tracksRef.current) return

    const ctx = gsap.context(() => {
      const track = tracksRef.current!
      const totalWidth = track.scrollWidth
      const viewportWidth = track.offsetWidth

      gsap.to(track, {
        x: -(totalWidth - viewportWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1.2,
          snap: {
            snapTo: 1 / (MOCK_FLEET.length - 1),
            duration: { min: 0.2, max: 0.5 },
            ease: 'power1.inOut',
          },
          end: () => `+=${totalWidth - viewportWidth}`,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const badgeVariant = (s: string) => {
    if (s === 'in_transit') return 'blue'
    if (s === 'fueling')    return 'fuel'
    if (s === 'idle')       return 'gray'
    return 'red'
  }

  return (
    <section className="bg-navy-900 relative">
      {/* Section label */}
      <div className="py-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 text-fuel text-xs font-bold tracking-widest uppercase mb-4">
          <span className="w-8 h-px bg-fuel" /> Live Fleet Status <span className="w-8 h-px bg-fuel" />
        </div>
        <h2 className="font-display text-5xl font-black text-white mb-4">Active Fleet</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-fuel to-fuel-300 rounded-full mx-auto mb-4" />
        <p className="text-slate-400 max-w-lg mx-auto">
          Scroll horizontally to explore live telemetry from each active tanker in the TswanaFuel fleet.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 animate-bounce">
          <span>→ Scroll down to navigate</span>
        </div>
      </div>

      {/* ── GSAP horizontal pin container ── */}
      <div ref={containerRef} className="overflow-hidden">
        <div
          ref={tracksRef}
          className="horizontal-section"
          style={{ willChange: 'transform' }}
        >
          {MOCK_FLEET.map((truck, i) => {
            const fuelColor = fuelLevelColor(truck.fuelLevelPct)
            return (
              <div
                key={truck.id}
                className="horizontal-panel flex items-center justify-center px-8 pb-16"
              >
                {/* ── Truck telemetry card ── */}
                <div className="max-w-2xl w-full">
                  <div className="glass-strong rounded-3xl overflow-hidden shadow-card border border-white/10">

                    {/* Card header — gradient accent */}
                    <div className="relative h-48 bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center overflow-hidden">
                      {/* Animated scan line */}
                      <div
                        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-fuel/60 to-transparent animate-scan-line pointer-events-none"
                        style={{ top: '50%' }}
                      />
                      {/* Grid overlay */}
                      <div className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: 'linear-gradient(rgba(249,115,22,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.3) 1px,transparent 1px)',
                          backgroundSize: '40px 40px',
                        }}
                      />
                      {/* Truck icon */}
                      <div className="relative text-center">
                        <div className="text-8xl mb-3 animate-float">🚛</div>
                        <div className="text-xl font-black text-white tracking-widest font-mono">{truck.plateNumber}</div>
                      </div>
                      {/* Status badge */}
                      <div className="absolute top-4 right-4">
                        <Badge
                          label={statusLabel(truck.status)}
                          variant={badgeVariant(truck.status) as never}
                          dot
                        />
                      </div>
                      {/* Card index */}
                      <div className="absolute top-4 left-4 text-slate-500 text-xs font-mono">
                        {String(i + 1).padStart(2, '0')} / {String(MOCK_FLEET.length).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6 space-y-5">
                      {/* Driver + destination */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Driver</p>
                          <p className="font-bold text-white">{truck.driverName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                          <p className="font-bold text-white flex items-center gap-1.5 justify-end">
                            <Navigation size={13} className="text-fuel" />
                            {truck.destination}
                          </p>
                        </div>
                      </div>

                      {/* Telemetry grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="glass rounded-xl p-3 text-center">
                          <Gauge size={16} className="text-fuel mx-auto mb-1.5" />
                          <div className="text-xl font-black text-white">{truck.speedKph}</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">km/h</div>
                        </div>
                        <div className="glass rounded-xl p-3 text-center">
                          <Zap size={16} className="text-fuel mx-auto mb-1.5" />
                          <div className="text-xl font-black text-white">{(truck.loadLitres / 1000).toFixed(0)}K</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Load (L)</div>
                        </div>
                        <div className="glass rounded-xl p-3 text-center">
                          <MapPin size={16} className="text-fuel mx-auto mb-1.5" />
                          <div className="text-xl font-black text-white">{truck.fuelLevelPct}%</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Fuel</div>
                        </div>
                      </div>

                      {/* Fuel level bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                          <span>Fuel Level</span>
                          <span style={{ color: fuelColor }}>{truck.fuelLevelPct}%</span>
                        </div>
                        <div className="h-2 bg-white/08 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${truck.fuelLevelPct}%`, background: fuelColor }}
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="glass rounded-xl p-3 flex items-start gap-3">
                        <MapPin size={14} className="text-fuel flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-400">Current Location</p>
                          <p className="text-sm font-medium text-white">{truck.currentLocation.address}</p>
                        </div>
                        {truck.fuelLevelPct < 35 && (
                          <div className="ml-auto flex-shrink-0">
                            <AlertTriangle size={14} className="text-red-400 animate-pulse" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
