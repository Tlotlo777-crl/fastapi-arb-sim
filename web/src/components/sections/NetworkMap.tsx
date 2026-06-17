'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { STATIONS } from '@/lib/constants'
import type { FuelStation } from '@/lib/types'
import { formatLitres } from '@/lib/utils'

// Custom fuel-pin icon
function makeIcon(operational: boolean) {
  const color = operational ? '#f97316' : '#f59e0b'
  return L.divIcon({
    html: `<div style="position:relative;width:32px;height:40px;">
      <div style="width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
        background:${color};border:3px solid rgba(255,255,255,0.8);
        box-shadow:0 4px 16px rgba(249,115,22,0.5);">
      </div>
      <div style="position:absolute;top:6px;left:6px;width:20px;height:20px;
        transform:rotate(45deg);display:flex;align-items:center;justify-content:center;
        color:white;font-size:11px;">⛽</div>
    </div>`,
    iconSize:   [32, 40],
    iconAnchor: [16, 40],
    popupAnchor:[0, -44],
    className: '',
  })
}

function FlyTo({ station }: { station: FuelStation }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([station.lat, station.lng], 10, { duration: 1.2 })
  }, [station, map])
  return null
}

interface Props { activeStation: FuelStation; onSelect: (s: FuelStation) => void }

export default function NetworkMap({ activeStation, onSelect }: Props) {
  return (
    <MapContainer
      center={[-22.5, 24.5]}
      zoom={6}
      className="h-[480px] rounded-2xl"
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <FlyTo station={activeStation} />

      {STATIONS.map(s => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={makeIcon(s.status === 'operational')}
          eventHandlers={{ click: () => onSelect(s) }}
        >
          <Popup>
            <div className="font-sans min-w-[180px]">
              <p className="font-bold text-slate-800 text-sm mb-1">{s.name}</p>
              <p className="text-xs text-gray-500 mb-2">{s.location}</p>
              <p className="text-xs font-semibold" style={{ color: s.status === 'operational' ? '#16a34a' : '#d97706' }}>
                {s.status === 'operational' ? '● Operational' : '◌ Coming Soon'}
              </p>
              <p className="text-xs text-gray-600 mt-1">Capacity: {formatLitres(s.capacityLitres)}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
