import type { Metadata } from 'next'
import { PortalSidebar } from '@/components/portal/PortalSidebar'
import { FleetDashboard } from '@/components/portal/FleetDashboard'

export const metadata: Metadata = {
  title: 'Fleet Dashboard — TswanaFuel Portal',
  description: 'Real-time fleet telemetry, RFID transactions and fuel throughput for TswanaFuel fleet managers.',
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0f0d09' }}>
      <PortalSidebar />
      <main className="flex-1 ml-64 overflow-x-hidden">
        <FleetDashboard />
      </main>
    </div>
  )
}
