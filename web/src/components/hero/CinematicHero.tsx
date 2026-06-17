'use client'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, Zap, Shield, Leaf, ArrowRight } from 'lucide-react'
import { ParticleCanvas } from './ParticleCanvas'
import { Button } from '@/components/ui/Button'
import { BRAND } from '@/lib/constants'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export function CinematicHero() {
  const heroRef    = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)
  const badgeRef   = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)

  // ── Entrance animation ──────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 })

      // Glow pulse-in
      tl.from(glowRef.current, { scale: 0.3, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0)

      // Badge pop
      tl.from(badgeRef.current, { y: -20, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, 0.3)

      // Text stagger
      tl.from(textRef.current!.querySelectorAll('[data-gsap]'), {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      }, 0.45)

      // Stat cards
      tl.from(statsRef.current!.querySelectorAll('.stat-card'), {
        y: 30, opacity: 0, scale: 0.92, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)',
      }, 0.8)
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // ── Scroll-linked parallax ──────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      // Fade-and-slide hero text out as user scrolls
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
          if (!textRef.current) return
          gsap.set(textRef.current, {
            y: self.progress * 80,
            opacity: 1 - self.progress * 1.4,
          })
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      className="hero-animated-bg bg-noise relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Particle network */}
      <ParticleCanvas />

      {/* Fuel glow blob */}
      <div
        ref={glowRef}
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', willChange: 'transform, opacity' }}
      />
      <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.10) 0%, transparent 70%)' }}
      />

      {/* ── Content grid ── */}
      <div className="section-width section-padding relative z-10 w-full">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">

          {/* Left: headline */}
          <div ref={textRef}>
            {/* Launch badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-2.5 glass border-fuel/25 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-fuel animate-pulse" />
              <span className="text-xs font-bold text-fuel tracking-widest uppercase">
                EST. {BRAND.established} · {BRAND.group}
              </span>
            </div>

            <h1 data-gsap className="font-display text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight text-white mb-4">
              Botswana&apos;s
            </h1>
            <h1 data-gsap className="font-display text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight text-gradient-fuel mb-4">
              Preferred
            </h1>
            <h1 data-gsap className="font-display text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight text-white mb-8">
              Energy Partner
            </h1>

            <p data-gsap className="text-slate-300 text-lg leading-relaxed max-w-lg mb-10">
              Providing environmentally sustainable energy solutions across 8 strategic sites.{' '}
              <span className="text-white font-semibold">We have never run dry</span> in our entire trading history.
            </p>

            {/* CTA row */}
            <div data-gsap className="flex flex-wrap gap-4 mb-12">
              <Link href="/#services">
                <Button variant="primary" size="lg" icon={<ArrowRight size={16} />} iconRight>
                  Explore Services
                </Button>
              </Link>
              <Link href="/portal">
                <Button variant="outline" size="lg">
                  Fleet Portal
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div data-gsap className="flex flex-wrap gap-3">
              {[
                { icon: <Shield size={13} />, label: 'SHEQ Certified' },
                { icon: <Zap size={13} />,    label: '24/7 Operations' },
                { icon: <Leaf size={13} />,   label: 'Sustainable Energy' },
              ].map(b => (
                <span key={b.label} className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300">
                  <span className="text-fuel">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: stat cards */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4">
            {[
              { value: '2M+',  label: 'Litres',          sub: 'Total Storage'          },
              { value: '8',    label: 'Operational',      sub: 'Sites Nationwide'        },
              { value: '25+',  label: 'Years',            sub: 'Group Experience'        },
              { value: '24/7', label: 'Operations',       sub: 'Available on Demand'     },
            ].map(s => (
              <div key={s.value} className="stat-card glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-black text-gradient-fuel mb-1">{s.value}</div>
                <div className="text-xs font-bold text-white uppercase tracking-widest">{s.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
              </div>
            ))}

            {/* Zero-downtime banner */}
            <div className="stat-card glass-strong rounded-2xl p-5 col-span-2 flex items-center gap-4 border-fuel/20">
              <div className="w-12 h-12 rounded-xl bg-fuel/20 flex items-center justify-center flex-shrink-0">
                <Zap size={22} className="text-fuel" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Zero Supply Interruptions</p>
                <p className="text-slate-400 text-xs mt-0.5">Never run dry in our entire trading history since 2011</p>
              </div>
              <div className="ml-auto flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
        <span className="text-[10px] font-bold tracking-widest text-white uppercase">Scroll</span>
        <ChevronDown size={16} className="text-white" />
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none" />
    </section>
  )
}
