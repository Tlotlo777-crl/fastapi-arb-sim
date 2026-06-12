'use client'
import { useState } from 'react'
import {
  Truck, Droplets, TrendingUp, Activity,
  AlertTriangle, Zap, ArrowUpRight, ArrowDownRight,
  FileText, Plus, BarChart3, RefreshCw,
} from 'lucide-react'
import { MOCK_FLEET, MOCK_TRANSACTIONS, STATIONS, FUEL_CONSUMPTION_DATA } from '@/lib/constants'
import { TelemetryCard } from './TelemetryCard'
import { TransactionTable } from './TransactionTable'
import { FuelChart } from './FuelChart'
import { formatLitres, formatPula } from '@/lib/utils'
import type { FleetTruck } from '@/lib/types'

// ── Fleet health ring ──────────────────────────────────────────────────────────
function HealthRing({ pct }: { pct: number }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  const color = pct >= 70 ? '#1FA84D' : pct >= 40 ? '#F5B91A' : '#E5484D'
  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white">{Math.round(pct)}%</span>
      </div>
    </div>
  )
}

// ── Mini station ring (small) ─────────────────────────────────────────────────
function StationRing({ pct, color }: { pct: number; color: string }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <div className="relative w-11 h-11">
      <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black text-white">{pct}%</span>
      </div>
    </div>
  )
}

// ── Derived KPIs ──────────────────────────────────────────────────────────────
function computeKPIs() {
  const totalLitres = FUEL_CONSUMPTION_DATA.reduce((s, d) => s + d.diesel + d.ulp95, 0)
  const totalRevenue = MOCK_TRANSACTIONS.reduce((s, tx) => s + tx.totalPula, 0)
  const activeTrucks = MOCK_FLEET.filter(t => t.status === 'in_transit' || t.status === 'fueling').length
  const fleetHealth = Math.round(MOCK_FLEET.reduce((s, t) => s + t.fuelLevelPct, 0) / MOCK_FLEET.length)
  return { totalLitres, totalRevenue, activeTrucks, fleetHealth }
}

const STATION_FUEL_PCT = [
  { id: 'gaborone-b3', pct: 71, color: '#1FA84D' },
  { id: 'tlokweng',    pct: 40, color: '#F5B91A' },
  { id: 'kazungula',   pct: 78, color: '#1FA84D' },
  { id: 'lobatse',     pct: 66, color: '#1FA84D' },
  { id: 'sherwood',    pct: 55, color: '#F5B91A' },
  { id: 'mamuno',      pct: 11, color: '#E5484D' },
  { id: 'ghanzi',      pct: 38, color: '#F5B91A' },
  { id: 'francistown', pct: 26, color: '#E5484D' },
]

// ── Action shortcuts ───────────────────────────────────────────────────────────
const ACTIONS = [
  { icon: Plus,      label: 'Request\nFuel',         bg: 'rgba(245,185,26,0.18)', color: '#F5B91A' },
  { icon: FileText,  label: 'View\nInvoices',         bg: 'rgba(59,130,246,0.18)', color: '#60a5fa' },
  { icon: BarChart3, label: 'Reports\n& Analytics',   bg: 'rgba(31,168,77,0.18)',  color: '#4ade80' },
]

export function FleetDashboard() {
  const [selectedTruck, setSelectedTruck] = useState<FleetTruck>(MOCK_FLEET[0])
  const { totalLitres, totalRevenue, activeTrucks, fleetHealth } = computeKPIs()

  const lowFuelTruck = MOCK_FLEET.find(t => t.fuelLevelPct < 35)
  const flaggedTx = MOCK_TRANSACTIONS.filter(tx => tx.status === 'flagged').length

  return (
    <div className="min-h-screen" style={{ background: '#0f0d09' }}>

      {/* ── Dark ink header with health ring ── */}
      <div
        className="relative overflow-hidden px-8 pt-8 pb-24"
        style={{ background: 'linear-gradient(135deg, #16140E 0%, #23201A 100%)' }}
      >
        {/* Gold glow radial */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,185,26,0.20) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(31,168,77,0.2)', color: '#1FA84D' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                ATG Sensors Live
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-2">
              Dumela, Kabelo <span style={{ color: '#F5B91A' }}>✦</span>
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#A8A294' }}>
              Thursday 12 Jun 2026 · TswanaFuel Fleet Management
            </p>
          </div>

          {/* Health ring */}
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6E6A60' }}>
                Network Health
              </p>
              <p className="text-xs mt-1" style={{ color: '#A8A294' }}>
                {activeTrucks} trucks active · {STATIONS.filter(s => s.status === 'operational').length} sites live
              </p>
            </div>
            <HealthRing pct={fleetHealth} />
          </div>
        </div>

        {/* Refresh indicator */}
        <button
          className="absolute bottom-4 right-8 flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: '#6E6A60' }}
        >
          <RefreshCw size={11} /> Live · refreshes every 30s
        </button>
      </div>

      {/* ── Alert banner (if critical) ── */}
      {(lowFuelTruck || flaggedTx > 0) && (
        <div className="mx-8 -mt-8 relative z-10 mb-6">
          <div
            className="rounded-2xl px-5 py-4 flex items-start gap-4 cursor-pointer"
            style={{ background: 'rgba(229,72,77,0.12)', border: '1.5px solid rgba(229,72,77,0.35)' }}
          >
            <AlertTriangle size={18} style={{ color: '#E5484D', flexShrink: 0, marginTop: 1 }} />
            <div>
              {lowFuelTruck && (
                <>
                  <p className="font-bold text-sm" style={{ color: '#E5484D' }}>
                    Low fuel alert — {lowFuelTruck.plateNumber}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#A8A294' }}>
                    {lowFuelTruck.fuelLevelPct}% fuel remaining · driver {lowFuelTruck.driverName} · en route to {lowFuelTruck.destination}
                  </p>
                </>
              )}
              {flaggedTx > 0 && (
                <p className="text-xs mt-1" style={{ color: '#F5B91A' }}>
                  {flaggedTx} flagged transaction{flaggedTx > 1 ? 's' : ''} require review
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="px-8 pb-16 space-y-6" style={{ marginTop: lowFuelTruck || flaggedTx > 0 ? 0 : '-2rem' }}>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 relative z-10">
          {[
            {
              icon: Droplets,
              label: 'Total Volume YTD',
              value: formatLitres(totalLitres),
              change: +12.4,
              color: '#F5B91A',
              bg: 'rgba(245,185,26,0.12)',
            },
            {
              icon: TrendingUp,
              label: 'Revenue (Jun)',
              value: formatPula(totalRevenue),
              change: +8.7,
              color: '#4ade80',
              bg: 'rgba(74,222,128,0.10)',
            },
            {
              icon: Truck,
              label: 'Active Fleet',
              value: `${activeTrucks} / ${MOCK_FLEET.length}`,
              change: 0,
              color: '#60a5fa',
              bg: 'rgba(96,165,250,0.10)',
            },
            {
              icon: Activity,
              label: 'Avg Fleet Fuel',
              value: `${fleetHealth}%`,
              change: -3.1,
              color: fleetHealth >= 60 ? '#4ade80' : '#E5484D',
              bg: fleetHealth >= 60 ? 'rgba(74,222,128,0.10)' : 'rgba(229,72,77,0.10)',
            },
          ].map(({ icon: Icon, label, value, change, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: 'rgba(35,32,26,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <span
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ color: change > 0 ? '#4ade80' : change < 0 ? '#E5484D' : '#6E6A60' }}
                >
                  {change > 0 ? <ArrowUpRight size={12} /> : change < 0 ? <ArrowDownRight size={12} /> : null}
                  {change !== 0 ? `${Math.abs(change)}%` : '—'}
                </span>
              </div>
              <div>
                <p className="text-xl font-black text-white leading-tight">{value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6E6A60' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fuel chart + actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FuelChart />
          </div>

          <div className="space-y-4">
            {/* Action shortcuts */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(35,32,26,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6E6A60' }}>Quick Actions</p>
              <div className="space-y-3">
                {ACTIONS.map(({ icon: Icon, label, bg, color }) => (
                  <button
                    key={label}
                    className="flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-opacity hover:opacity-80"
                    style={{ background: bg }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <span className="font-bold text-sm text-left text-white" style={{ whiteSpace: 'pre-line' }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Station capacity mini-cards */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(35,32,26,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6E6A60' }}>Site Levels</p>
                <span className="text-xs" style={{ color: '#F5B91A' }}>Live ATG</span>
              </div>
              <div className="space-y-3">
                {STATION_FUEL_PCT.slice(0, 5).map(({ id, pct, color }) => {
                  const station = STATIONS.find(s => s.id === id)
                  if (!station) return null
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <StationRing pct={pct} color={color} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{station.name}</p>
                        <div className="h-1 bg-white/08 rounded-full mt-1 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color }}>
                        {formatLitres(Math.round(station.capacityLitres * pct / 100))}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Fleet telemetry */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-black text-white text-lg">Live Fleet</h2>
              <p className="text-xs mt-0.5" style={{ color: '#6E6A60' }}>
                {MOCK_FLEET.filter(t => t.status === 'in_transit').length} in transit ·{' '}
                {MOCK_FLEET.filter(t => t.status === 'fueling').length} fueling ·{' '}
                {MOCK_FLEET.filter(t => t.status === 'idle').length} idle
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={13} style={{ color: '#F5B91A' }} />
              <span className="text-xs font-bold" style={{ color: '#F5B91A' }}>GPS Tracking Active</span>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {MOCK_FLEET.map(truck => (
              <TelemetryCard
                key={truck.id}
                truck={truck}
                selected={selectedTruck?.id === truck.id}
                onClick={() => setSelectedTruck(truck)}
              />
            ))}
          </div>
        </div>

        {/* Selected truck detail banner */}
        {selectedTruck && (
          <div
            className="rounded-2xl p-5 flex items-center gap-6"
            style={{ background: 'rgba(245,185,26,0.07)', border: '1px solid rgba(245,185,26,0.20)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(245,185,26,0.15)' }}
            >
              <Truck size={22} style={{ color: '#F5B91A' }} />
            </div>
            <div className="flex-1 grid grid-cols-4 gap-4">
              {[
                { label: 'Plate', value: selectedTruck.plateNumber },
                { label: 'Driver', value: selectedTruck.driverName },
                { label: 'Speed', value: `${selectedTruck.speedKph} km/h` },
                { label: 'Destination', value: selectedTruck.destination },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#6E6A60' }}>{label}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: '#F5B91A' }}>
              <Activity size={13} />
              {selectedTruck.fuelLevelPct}% Fuel
            </div>
          </div>
        )}

        {/* Transaction table */}
        <TransactionTable />
      </div>
    </div>
  )
}
