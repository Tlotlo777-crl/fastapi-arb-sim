'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Fuel, LayoutDashboard, Truck, MapPin, Receipt,
  BarChart3, Settings, LogOut, Bell,
} from 'lucide-react'

const NAV = [
  { href: '/portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/portal/fleet',     icon: Truck,           label: 'Fleet'     },
  { href: '/stations',         icon: MapPin,           label: 'Stations'  },
  { href: '/portal/transactions', icon: Receipt,       label: 'Transactions' },
  { href: '/portal/reports',   icon: BarChart3,        label: 'Reports'   },
  { href: '/portal/settings',  icon: Settings,         label: 'Settings'  },
]

export function PortalSidebar() {
  const path = usePathname()

  return (
    <aside
      className="fixed top-0 left-0 h-full w-64 flex flex-col z-40"
      style={{ background: '#16140E', borderRight: '1px solid rgba(245,185,26,0.12)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(245,185,26,0.12)' }}>
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #F5B91A, #D99B00)' }}
          >
            <Fuel size={20} className="text-[#16140E]" />
          </div>
          <div>
            <p className="font-black text-white text-sm leading-tight">TswanaFuel</p>
            <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#F5B91A' }}>
              Fleet Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/portal/dashboard' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={
                active
                  ? { background: 'rgba(245,185,26,0.15)', color: '#F5B91A' }
                  : { color: '#A8A294' }
              }
            >
              <Icon size={17} style={active ? { color: '#F5B91A' } : { color: '#6E6A60' }} />
              {label}
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: '#F5B91A' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Notification bell */}
      <div className="px-6 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ color: '#A8A294' }}
        >
          <Bell size={17} style={{ color: '#6E6A60' }} />
          Notifications
          <span
            className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded-full"
            style={{ background: '#E5484D', color: '#fff' }}
          >
            2
          </span>
        </button>
      </div>

      {/* User row */}
      <div className="px-6 py-4 border-t" style={{ borderColor: 'rgba(245,185,26,0.12)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm"
            style={{ background: 'rgba(245,185,26,0.15)', color: '#F5B91A' }}
          >
            KM
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-xs truncate">Kabelo Moremi</p>
            <p className="text-[11px] truncate" style={{ color: '#6E6A60' }}>Fleet Manager</p>
          </div>
        </div>
        <Link
          href="/portal"
          className="flex items-center gap-2 text-xs font-semibold w-full px-3 py-2 rounded-lg transition-colors hover:text-white"
          style={{ color: '#6E6A60' }}
        >
          <LogOut size={13} /> Sign Out
        </Link>
      </div>
    </aside>
  )
}
