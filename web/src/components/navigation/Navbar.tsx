'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { Fuel, Menu, X, ChevronRight, LayoutDashboard } from 'lucide-react'
import { NAV_LINKS, BRAND } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef  = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        yPercent: -100, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3,
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* ── Ticker ribbon ── */}
      <div className="bg-fuel/90 overflow-hidden py-1.5 hidden lg:block">
        <div className="animate-ticker flex whitespace-nowrap text-white text-[11px] font-bold tracking-wide">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-12 mr-12">
              <span>⛽ NEVER RUN DRY IN OUR HISTORY OF TRADING FUEL IN BOTSWANA</span>
              <span>📍 8 OPERATIONAL SITES ACROSS BOTSWANA</span>
              <span>🛢 2 MILLION LITRES TOTAL STORAGE CAPACITY</span>
              <span>🚛 24/7 BULK FUEL DELIVERY AVAILABLE</span>
              <span>📞 CEO: +267 76 552 333</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav
        ref={navRef}
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-navy-950/95 backdrop-blur-xl border-b border-white/08 shadow-card'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-fuel flex items-center justify-center shadow-glow-sm group-hover:scale-110 transition-transform duration-200">
                <Fuel size={18} className="text-white" />
              </div>
              <div>
                <p className="font-black text-white text-lg leading-tight tracking-tight">{BRAND.name}</p>
                <p className="text-[10px] text-slate-400 leading-tight">LSB Group of Companies</p>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const active = pathname === link.href || pathname.startsWith(link.href.replace('/#', '/').split('#')[0])
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      active
                        ? 'text-fuel'
                        : 'text-slate-300 hover:text-white hover:bg-white/05',
                    )}
                  >
                    {active && (
                      <span className="absolute inset-x-3 bottom-1 h-0.5 bg-fuel rounded-full" />
                    )}
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/portal">
                <Button variant="outline" size="sm" icon={<LayoutDashboard size={14} />}>
                  Fleet Portal
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="primary" size="sm" icon={<ChevronRight size={14} />} iconRight>
                  Get a Quote
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/08 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-96' : 'max-h-0',
        )}>
          <div className="glass-dark border-t border-white/08 px-4 pb-6 pt-3 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/08 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-3">
              <Link href="/portal" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Fleet Portal</Button>
              </Link>
              <Link href="/#contact" className="flex-1">
                <Button variant="primary" size="sm" className="w-full">Get a Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
