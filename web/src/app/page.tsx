import { Navbar }               from '@/components/navigation/Navbar'
import { CinematicHero }        from '@/components/hero/CinematicHero'
import { StatsSection }         from '@/components/sections/StatsSection'
import { ServicesSection }      from '@/components/sections/ServicesSection'
import { StationFleetScroller } from '@/components/sections/StationFleetScroller'
import { NetworkSection }       from '@/components/sections/NetworkSection'
import { GrowthSection }        from '@/components/sections/GrowthSection'
import { SocialHub }            from '@/components/sections/SocialHub'
import { CTASection }           from '@/components/sections/CTASection'
import { Footer }               from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <CinematicHero />
        <StatsSection />
        <ServicesSection />
        <StationFleetScroller />
        <NetworkSection />
        <GrowthSection />
        <SocialHub />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
