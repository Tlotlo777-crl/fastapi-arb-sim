import Link from 'next/link'
import { Fuel } from 'lucide-react'
import { BRAND, NAV_LINKS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-white/06">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-fuel flex items-center justify-center">
                <Fuel size={18} className="text-white" />
              </div>
              <div>
                <p className="font-black text-white text-lg">{BRAND.name}</p>
                <p className="text-xs text-slate-400">{BRAND.group}</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-4">
              Botswana&apos;s preferred energy supplier since {BRAND.established}. Reliable, sustainable fuel solutions across the SADC region.
            </p>
            <blockquote className="border-l-2 border-fuel pl-3 italic text-slate-500 text-xs">
              &quot;We have never run dry in our history of trading fuel in Botswana.&quot;
            </blockquote>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {['Retail Sites', 'Truck Stop Facilities', 'Bulk Fuel Supply', 'Roadside Assistance', 'Software Solutions', 'Loyalty Cards'].map(s => (
                <li key={s}><Link href="/#services" className="hover:text-fuel transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {NAV_LINKS.map(l => (
                <li key={l.href}><Link href={l.href} className="hover:text-fuel transition-colors">{l.label}</Link></li>
              ))}
              <li><Link href="/portal" className="hover:text-fuel transition-colors">Fleet Portal</Link></li>
              <li><Link href="/stations" className="hover:text-fuel transition-colors">Station Finder</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/06 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>&copy; 2026 TswanaFuel (Pty) Ltd · LSB Group of Companies · All rights reserved.</span>
          <span>Registered in Botswana ·{' '}
            <a href={BRAND.website} className="hover:text-fuel transition-colors">{BRAND.website.replace('https://', '')}</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
