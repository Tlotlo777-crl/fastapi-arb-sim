'use client'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Fuel, Truck, Wrench, Package, Monitor, CreditCard, ArrowRight } from 'lucide-react'
import Link from 'next/link'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    icon: Fuel, title: 'Retail Sites',
    description: 'ENGEN-branded retail stations at Mmamashia, Nkoyaphiri and Molepolole — independently managed with Diesel and ULP95 available.',
    features: ['ENGEN Brand Partnership', 'Multiple Nozzle Configs', 'Diesel & ULP95'],
    accent: false,
  },
  {
    icon: Truck, title: 'Truck Stop Facilities',
    description: 'Best-in-class truck stops strategically located near all major Botswana border posts for cross-border transport operators.',
    features: ['24hr CCTV Security', 'Free Wi-Fi (150m radius)', 'Border Permits & Toll Fees', 'Secure Parking & Ablutions'],
    accent: false,
  },
  {
    icon: Wrench, title: 'Roadside Assistance',
    description: 'You Call. We Assist. 24/7 emergency response acting as an extension of your fleet department.',
    features: ['24/7 Emergency Number', 'Tyre Services & Pressure Tests', 'Breakdown Co-ordination', 'Cargo Handling'],
    accent: false,
  },
  {
    icon: Package, title: 'Bulk Fuel Supply',
    description: 'Own fleet of metered calibrated tankers for reliable 24/7 direct bridging to customer sites. Currently supplying BDF, CTO & Botswana Railways.',
    features: ['Direct Bridging Delivery', 'Free SHEQ Training', 'IOT Remote Monitoring', 'Dispensing Solutions'],
    accent: true,
  },
  {
    icon: Monitor, title: 'Integrated Software',
    description: 'Real-time 100% visibility of all TswanaFuel transactions. Our proprietary platform gives you full control over fuel consumption.',
    features: ['100% Transaction Visibility', 'SMS Stock Alerts', 'Fuel Management Training', 'Implementation Support'],
    accent: false,
  },
  {
    icon: CreditCard, title: 'Loyalty Cards',
    description: 'Track fleet spending, earn rewards, and simplify fuel management across all sites with TswanaFuel Loyalty Cards.',
    features: ['Centralized Fleet Billing', 'Usage Analytics', 'Multi-site Acceptance', 'Digital Invoicing'],
    accent: false,
  },
]

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-card-item', {
        y: 50, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={ref} className="py-24 bg-navy-950">
      <div className="section-width px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-fuel text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-8 h-px bg-fuel" /> What We Offer <span className="w-8 h-px bg-fuel" />
          </div>
          <h2 className="font-display text-5xl font-black text-white mb-4">Our Services</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-fuel to-fuel-300 rounded-full mx-auto mb-6" />
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            We aim to provide simple and effective solutions — from retail fuel to full logistics integration.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(s => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className={`service-card-item group glass rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-card cursor-default ${
                  s.accent ? 'border-fuel/25 bg-fuel/05' : 'hover:border-fuel/15'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                  s.accent ? 'bg-fuel shadow-glow-sm' : 'bg-fuel/15'
                }`}>
                  <Icon size={24} className={s.accent ? 'text-white' : 'text-fuel'} />
                </div>

                <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{s.description}</p>

                <ul className="space-y-2">
                  {s.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-fuel flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 text-fuel font-semibold text-sm hover:gap-3 transition-all duration-200"
          >
            Request a service quote <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
