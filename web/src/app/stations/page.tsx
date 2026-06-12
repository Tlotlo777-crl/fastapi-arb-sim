import type { Metadata } from 'next'
import { Navbar }  from '@/components/navigation/Navbar'
import { Footer }  from '@/components/sections/Footer'
import { StationsClientPage } from './StationsClient'

export const metadata: Metadata = {
  title: 'Station Finder',
  description: 'Find your nearest TswanaFuel station — live pricing, amenities, and directions across all 9 Botswana sites.',
}

export default function StationsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-950 pt-8">
        <StationsClientPage />
      </main>
      <Footer />
    </>
  )
}
