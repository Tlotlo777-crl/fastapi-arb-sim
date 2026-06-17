'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fuel, Eye, EyeOff, Chrome, Apple, ArrowRight, Shield, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BRAND } from '@/lib/constants'

export default function PortalLoginPage() {
  const router = useRouter()
  const [mode, setMode]         = useState<'login' | 'signup'>('login')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany]   = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/portal/dashboard')
    }, 1200)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #16140E 0%, #23201A 50%, #16140E 100%)' }}
    >
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,185,26,0.10) 0%, transparent 70%)' }} />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,185,26,0.06) 0%, transparent 70%)' }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F5B91A, #D99B00)' }}>
              <Fuel size={28} className="text-[#16140E]" />
            </div>
            <div>
              <p className="font-black text-2xl text-white tracking-tight">{BRAND.name}</p>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#F5B91A' }}>
                Fleet Management Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-2xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
                mode === m
                  ? 'text-[#16140E] shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={mode === m ? { background: '#F5B91A' } : {}}>
              {m === 'login' ? 'Log In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(20px)' }}>
          <h2 className="font-black text-white text-xl mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#A8A294' }}>
            {mode === 'login'
              ? 'Sign in to your fleet management dashboard'
              : 'Register your organisation to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A8A294' }}>Company / Organisation</label>
                <input value={company} onChange={e => setCompany(e.target.value)}
                  type="text" placeholder="Your company name" required={mode === 'signup'}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                  onFocus={e => e.target.style.borderColor = '#F5B91A'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#A8A294' }}>Your Email Address</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="you@company.com" required
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                onFocus={e => e.target.style.borderColor = '#F5B91A'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#A8A294' }}>
                  {mode === 'signup' ? 'Choose a Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-xs font-bold" style={{ color: '#F5B91A' }}>Forgot Password?</button>
                )}
              </div>
              <div className="relative">
                <input value={password} onChange={e => setPassword(e.target.value)}
                  type={showPw ? 'text' : 'password'} placeholder={mode === 'signup' ? 'min 8 characters' : '••••••••'}
                  required
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-white outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                  onFocus={e => e.target.style.borderColor = '#F5B91A'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.10)'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" required className="w-4 h-4 rounded accent-yellow-400" />
                <span className="text-xs" style={{ color: '#A8A294' }}>
                  I agree to the <span style={{ color: '#F5B91A' }} className="font-bold">terms of use</span>
                </span>
              </label>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-13 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
              style={{ background: '#F5B91A', color: '#16140E', height: '52px' }}>
              {loading
                ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : <>{mode === 'login' ? 'Log In' : 'Sign In'} <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <span className="text-xs" style={{ color: '#6E6A60' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[{ icon: Chrome, label: 'Google Play' }, { icon: Apple, label: 'Apple Store' }].map(s => {
              const Icon = s.icon
              return (
                <button key={s.label}
                  className="flex items-center justify-center gap-2 h-11 rounded-xl text-xs font-bold text-white transition-colors hover:bg-white/08"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                  <Icon size={15} style={{ color: '#A8A294' }} />
                  {s.label}
                </button>
              )
            })}
          </div>

          <p className="text-center text-xs mt-5" style={{ color: '#6E6A60' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-bold" style={{ color: '#F5B91A' }}>
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs" style={{ color: '#6E6A60' }}>
          <span className="flex items-center gap-1.5"><Lock size={11} style={{ color: '#F5B91A' }} /> 256-bit SSL</span>
          <span className="flex items-center gap-1.5"><Shield size={11} style={{ color: '#F5B91A' }} /> POPIA Compliant</span>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#6E6A60' }}>
          &copy; 2026 TswanaFuel · LSB Group of Companies
        </p>
      </div>
    </div>
  )
}
