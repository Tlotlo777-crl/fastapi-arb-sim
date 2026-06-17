'use client'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { TrendingUp, Award, Building2 } from 'lucide-react'
import { GROWTH_DATA, FUEL_CONSUMPTION_DATA } from '@/lib/constants'
import { KPICard } from '@/components/ui/Card'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-dark rounded-xl px-4 py-3 text-sm border border-fuel/20">
      <p className="font-bold text-fuel mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function GrowthSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.growth-item', {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="growth" ref={ref} className="py-24 bg-navy-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)' }} />

      <div className="section-width px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-fuel text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-8 h-px bg-fuel" /> Year On Year <span className="w-8 h-px bg-fuel" />
          </div>
          <h2 className="font-display text-5xl font-black text-white mb-4">Financial Performance</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-fuel to-fuel-300 rounded-full mx-auto mb-6" />
          <p className="text-slate-400 max-w-xl mx-auto">
            Consistent growth from BWP 588M (2020) to BWP 2.1B (2024) — 257% increase in four years.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <div className="growth-item">
            <KPICard label="2024 Turnover" value="BWP 2.1B" change={27} icon={<TrendingUp size={16} className="text-fuel" />} accent />
          </div>
          <div className="growth-item">
            <KPICard label="Total Storage" value="2M" unit="Litres" change={0} icon={<Building2 size={16} className="text-fuel" />} />
          </div>
          <div className="growth-item">
            <KPICard label="Key Tenders Won" value="3" unit="active" change={0} icon={<Award size={16} className="text-fuel" />} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Turnover bar chart */}
          <div className="growth-item glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-1">Annual Turnover (BWP Millions)</h3>
            <p className="text-xs text-slate-400 mb-6">2020 – 2024 growth trajectory</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={GROWTH_DATA} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.05)' }} />
                <ReferenceLine y={588} stroke="rgba(249,115,22,0.2)" strokeDasharray="4 4" />
                <Bar dataKey="turnoverM" name="Turnover (BWP M)" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#f97316" stopOpacity={1} />
                    <stop offset="100%" stopColor="#c2410c" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fuel consumption area chart */}
          <div className="growth-item glass rounded-2xl p-6">
            <h3 className="font-bold text-white mb-1">Fuel Throughput (Litres)</h3>
            <p className="text-xs text-slate-400 mb-6">Monthly Diesel vs ULP95 — 2026</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={FUEL_CONSUMPTION_DATA}>
                <defs>
                  <linearGradient id="dieselGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"   stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%"  stopColor="#f97316" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="ulpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"   stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%"  stopColor="#60a5fa" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="diesel" name="Diesel (L)" stroke="#f97316" strokeWidth={2} fill="url(#dieselGrad)" />
                <Area type="monotone" dataKey="ulp95"  name="ULP95 (L)"  stroke="#60a5fa" strokeWidth={2} fill="url(#ulpGrad)"   />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key clients */}
        <div className="growth-item mt-8 glass rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">Key Tender Clients</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Botswana Defence Force', tag: 'Government', color: 'blue' },
              { label: 'CTO',                    tag: 'Parastatal', color: 'green' },
              { label: 'Botswana Railways',       tag: 'Transport',  color: 'fuel'  },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-3 glass rounded-xl p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${c.color === 'fuel' ? 'fuel' : c.color+'-500'}/15 flex-shrink-0`}>
                  <Award size={18} className={`text-${c.color === 'fuel' ? 'fuel' : c.color+'-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{c.label}</p>
                  <p className="text-xs text-slate-400">{c.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
