'use client'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { FUEL_CONSUMPTION_DATA } from '@/lib/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-dark rounded-xl px-4 py-3 text-sm border border-fuel/20">
      <p className="font-bold text-fuel mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.value.toLocaleString()} L
        </p>
      ))}
    </div>
  )
}

export function FuelChart() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-white text-base">Fuel Throughput</h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly consumption — 2026</p>
        </div>
        <div className="flex gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-fuel" /> Diesel</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> ULP95</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={FUEL_CONSUMPTION_DATA}>
          <defs>
            <linearGradient id="fuelDiesel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="fuelUlp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ display: 'none' }} />
          <Area type="monotone" dataKey="diesel" name="Diesel" stroke="#f97316" strokeWidth={2} fill="url(#fuelDiesel)" dot={false} />
          <Area type="monotone" dataKey="ulp95"  name="ULP95"  stroke="#60a5fa" strokeWidth={2} fill="url(#fuelUlp)"   dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
