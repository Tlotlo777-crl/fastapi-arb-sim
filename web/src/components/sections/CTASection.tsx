'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Send, Phone, Mail, MapPin } from 'lucide-react'
import { BRAND } from '@/lib/constants'

export function CTASection() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1400)
  }

  return (
    <section id="contact" className="py-24 bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />

      <div className="section-width px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: info */}
          <div>
            <div className="inline-flex items-center gap-2 text-fuel text-xs font-bold tracking-widest uppercase mb-6">
              <span className="w-8 h-px bg-fuel" /> Get In Touch
            </div>
            <h2 className="font-display text-5xl font-black text-white mb-6 leading-tight">
              Ready to Power<br />Your Operations?
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Whether it&apos;s a bulk fuel inquiry, a fleet portal setup, or a partnership opportunity — our team is on standby 24/7.
            </p>

            {/* Contact cards */}
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'CEO Direct Line', value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g,'')}` },
                { icon: Mail,  label: 'Email Us',        value: BRAND.email, href: `mailto:${BRAND.email}` },
                { icon: MapPin,label: 'Head Office',     value: 'Gaborone, Botswana', href: '#' },
              ].map(c => {
                const Icon = c.icon
                return (
                  <a key={c.label} href={c.href}
                    className="flex items-center gap-4 glass rounded-xl p-4 hover:border-fuel/25 transition-all duration-200 hover:-translate-x-1">
                    <div className="w-10 h-10 rounded-xl bg-fuel/15 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-fuel" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{c.label}</p>
                      <p className="font-semibold text-white">{c.value}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Right: form */}
          <div className="glass-strong rounded-3xl p-8">
            <h3 className="font-black text-white text-xl mb-6">Send a Message</h3>

            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-400/15 flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-green-400" />
                </div>
                <p className="font-bold text-white text-lg mb-2">Message Sent!</p>
                <p className="text-slate-400 text-sm">We&apos;ll be in touch within 24 hours.</p>
                <Button variant="ghost" size="sm" className="mt-6" onClick={() => setSent(false)}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: 'name',    label: 'Full Name',    type: 'text',  placeholder: 'Your name',       required: true  },
                    { id: 'company', label: 'Company',      type: 'text',  placeholder: 'Company name',    required: false },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                        {f.label}{f.required && ' *'}
                      </label>
                      <input id={f.id} type={f.type} required={f.required} placeholder={f.placeholder}
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none border border-transparent focus:border-fuel/40 transition-colors" />
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com', required: true  },
                    { id: 'phone', label: 'Phone', type: 'tel',   placeholder: '+267 …',           required: false },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                        {f.label}{f.required && ' *'}
                      </label>
                      <input id={f.id} type={f.type} required={f.required} placeholder={f.placeholder}
                        className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none border border-transparent focus:border-fuel/40 transition-colors" />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="service" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Service of Interest</label>
                  <select id="service" className="w-full glass rounded-xl px-4 py-3 text-sm text-white outline-none border border-transparent focus:border-fuel/40 transition-colors bg-transparent">
                    <option value="" className="bg-navy-900">Select a service…</option>
                    {['Bulk Fuel Supply', 'Retail Site', 'Truck Stop Facilities', 'Roadside Assistance', 'Software Solutions', 'Loyalty Cards', 'Partnership / Other'].map(s => (
                      <option key={s} value={s} className="bg-navy-900">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Message *</label>
                  <textarea id="message" required rows={4} placeholder="Tell us about your fuel needs…"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none border border-transparent focus:border-fuel/40 transition-colors resize-none" />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}
                  icon={<Send size={15} />} iconRight>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
