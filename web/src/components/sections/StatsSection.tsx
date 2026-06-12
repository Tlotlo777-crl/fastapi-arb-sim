'use client'
import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TrendingUp, MapPin, Droplets, Truck } from 'lucide-react'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { icon: TrendingUp, value: 2100, prefix: 'BWP ', suffix: 'M', label: '2024 Annual Turnover', sub: '257% growth since 2020' },
  { icon: MapPin,     value: 9,    prefix: '',      suffix: '',  label: 'Strategically Placed Sites', sub: 'Across Botswana' },
  { icon: Droplets,   value: 2,    prefix: '',      suffix: 'M L', label: 'Total Storage Capacity', sub: 'Across all sites' },
  { icon: Truck,      value: 100,  prefix: '',      suffix: '%', label: 'Supply Reliability', sub: 'Never run dry since 2011' },
]

function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => setDisplay(Math.round(obj.val)),
        })
      }
    }, { threshold: 0.5 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Gradient separator */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-800/60 to-navy-950" />
      <div className="absolute inset-0 bg-noise opacity-30" />

      <div className="section-width relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="stat-item glass rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-11 h-11 rounded-xl bg-fuel/15 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-fuel" />
                </div>
                <div className="text-4xl font-black text-white mb-1">
                  <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="text-sm font-semibold text-white mb-0.5">{s.label}</div>
                <div className="text-xs text-slate-400">{s.sub}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
