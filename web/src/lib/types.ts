// ─── Core domain types ──────────────────────────────────────────────────────

export interface FuelStation {
  id: string
  name: string
  location: string
  lat: number
  lng: number
  status: 'operational' | 'coming_soon' | 'maintenance'
  capacityLitres: number
  nozzles: NozzleConfig[]
  amenities: StationAmenity[]
  manager: StationManager
  fuelPrices: FuelPrice[]
  operatingHours: string
}

export interface NozzleConfig {
  type: 'D50' | 'ULP95' | 'ULP93'
  count: number
}

export interface StationAmenity {
  id: string
  label: string
  icon: string
}

export interface StationManager {
  name: string
  phone: string
  email: string
}

export interface FuelPrice {
  type: 'Diesel' | 'ULP95' | 'ULP93'
  pricePula: number
  lastUpdated: string
}

// ─── Fleet & Telemetry ───────────────────────────────────────────────────────

export type TruckStatus = 'in_transit' | 'fueling' | 'idle' | 'maintenance'

export interface FleetTruck {
  id: string
  plateNumber: string
  driverName: string
  status: TruckStatus
  currentLocation: { lat: number; lng: number; address: string }
  destination: string
  fuelLevelPct: number
  speedKph: number
  loadLitres: number
  maxLoadLitres: number
  lastUpdated: string
  route: [number, number][]
}

export interface TelemetryEvent {
  truckId: string
  timestamp: string
  type: 'refuel' | 'delivery' | 'alert' | 'checkpoint'
  value: number
  unit: string
  note?: string
}

// ─── B2B Portal ──────────────────────────────────────────────────────────────

export interface PortalUser {
  id: string
  name: string
  email: string
  company: string
  role: 'fleet_manager' | 'accountant' | 'admin'
  avatarUrl?: string
}

export interface FuelAllocation {
  id: string
  clientId: string
  stationId: string
  allocatedLitres: number
  consumedLitres: number
  expiresAt: string
  fuelType: 'Diesel' | 'ULP95'
}

export interface Transaction {
  id: string
  truckId: string
  plateNumber: string
  driverName: string
  stationId: string
  stationName: string
  fuelType: 'Diesel' | 'ULP95'
  litresFuelled: number
  totalPula: number
  pricePerLitre: number
  timestamp: string
  rfidTag: string
  status: 'completed' | 'pending' | 'flagged'
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  period: string
  transactions: Transaction[]
  totalLitres: number
  totalAmount: number
  taxAmount: number
  issuedAt: string
  dueAt: string
  status: 'paid' | 'outstanding' | 'overdue'
}

// ─── Dashboard KPIs ──────────────────────────────────────────────────────────

export interface DashboardKPI {
  label: string
  value: string | number
  unit?: string
  change: number
  changeLabel: string
  trend: 'up' | 'down' | 'neutral'
  icon: string
}

export interface FuelConsumptionPoint {
  date: string
  diesel: number
  ulp95: number
}

// ─── Social Media ─────────────────────────────────────────────────────────────

export type SocialPlatform = 'linkedin' | 'instagram' | 'x'

export interface SocialPost {
  id: string
  platform: SocialPlatform
  author: string
  handle: string
  content: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  mediaUrl?: string
  url: string
}
