'use client'
import { useState } from 'react'
import { Download, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { MOCK_TRANSACTIONS } from '@/lib/constants'
import { formatPula, txStatusStyle, relativeTime } from '@/lib/utils'
import type { Transaction } from '@/lib/types'
import { Button } from '@/components/ui/Button'

function StatusIcon({ status }: { status: Transaction['status'] }) {
  if (status === 'completed') return <CheckCircle size={13} className="text-green-400" />
  if (status === 'pending')   return <Clock size={13} className="text-yellow-400" />
  return <AlertTriangle size={13} className="text-red-400" />
}

export function TransactionTable() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | Transaction['status']>('all')

  const filtered = MOCK_TRANSACTIONS.filter(tx => {
    const q = query.toLowerCase()
    const matchQ = !q || tx.plateNumber.toLowerCase().includes(q) || tx.driverName.toLowerCase().includes(q) || tx.stationName.toLowerCase().includes(q)
    const matchF = filter === 'all' || tx.status === filter
    return matchQ && matchF
  })

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-5 border-b border-white/06 flex-wrap">
        <h3 className="font-black text-white text-base">RFID Transactions</h3>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              className="glass rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none border border-transparent focus:border-fuel/40 w-40"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5">
            {(['all', 'completed', 'pending', 'flagged'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === f ? 'bg-fuel text-white' : 'glass text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" icon={<Download size={13} />}>Export</Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/06">
              {['Plate / Driver', 'Station', 'Fuel', 'Litres', 'Amount', 'RFID', 'Time', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/04">
            {filtered.map(tx => (
              <tr key={tx.id} className={`hover:bg-white/03 transition-colors ${tx.status === 'flagged' ? 'bg-red-400/03' : ''}`}>
                <td className="px-4 py-3.5">
                  <p className="font-bold text-white font-mono text-xs">{tx.plateNumber}</p>
                  <p className="text-slate-400 text-xs">{tx.driverName}</p>
                </td>
                <td className="px-4 py-3.5 text-slate-300 text-xs">{tx.stationName}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tx.fuelType === 'Diesel' ? 'bg-fuel/15 text-fuel' : 'bg-blue-400/15 text-blue-400'}`}>
                    {tx.fuelType}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-white font-bold tabular-nums">{tx.litresFuelled.toLocaleString()} L</td>
                <td className="px-4 py-3.5 text-white font-bold tabular-nums">{formatPula(tx.totalPula)}</td>
                <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">{tx.rfidTag}</td>
                <td className="px-4 py-3.5 text-slate-400 text-xs">{relativeTime(tx.timestamp)}</td>
                <td className="px-4 py-3.5">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${txStatusStyle(tx.status)}`}>
                    <StatusIcon status={tx.status} />
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">No transactions match your search.</div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-white/06 flex items-center justify-between text-xs text-slate-500">
        <span>{filtered.length} of {MOCK_TRANSACTIONS.length} transactions</span>
        <span>Auto-refreshes every 30s</span>
      </div>
    </div>
  )
}
