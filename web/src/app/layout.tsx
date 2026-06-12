import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default:  'TswanaFuel | Preferred Energy Supplier — SADC Region',
    template: '%s | TswanaFuel',
  },
  description:
    'TswanaFuel — Botswana\'s leading fuel supplier. 8 operational sites, 2 million litres total storage, 24/7 bulk delivery, truck stops & roadside assistance across the SADC region.',
  keywords: ['TswanaFuel', 'fuel supply', 'Botswana', 'SADC', 'diesel', 'truck stop', 'bulk fuel', 'LSB Group'],
  authors: [{ name: 'TswanaFuel', url: 'https://www.lsb-tswanafuel.com' }],
  openGraph: {
    type:        'website',
    locale:      'en_BW',
    url:         'https://www.lsb-tswanafuel.com',
    siteName:    'TswanaFuel',
    title:       'TswanaFuel | Preferred Energy Supplier — SADC Region',
    description: 'Reliable, sustainable fuel solutions across 8 strategic Botswana sites.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'TswanaFuel | Preferred Energy Supplier',
    description: 'Botswana\'s leading fuel network — never run dry since 2011.',
    creator:     '@TswanaFuel_BW',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0a1f44',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-navy-950 text-slate-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
