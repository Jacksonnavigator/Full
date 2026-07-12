import React from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const markerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Fix default icon paths (Leaflet + Vite)
delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapPicker({
  onChange,
  initialPosition,
}: {
  onChange: (pos: { lat: number; lng: number }) => void
  initialPosition?: { lat: number; lng: number }
}) {
  const defaultCenter = initialPosition || { lat: -6.7924, lng: 39.2083 }

  function LocationMarker() {
    const [pos, setPos] = React.useState<{ lat: number; lng: number } | null>(initialPosition || null)
    const map = useMapEvents({
      click(e) {
        const p = { lat: e.latlng.lat, lng: e.latlng.lng }
        setPos(p)
        onChange(p)
      },
    })

    React.useEffect(() => {
      if (initialPosition && map) {
        map.setView([initialPosition.lat, initialPosition.lng], map.getZoom())
      }
    }, [initialPosition, map])

    if (!pos) return null
    return (
      <Marker
        icon={markerIcon}
        position={[pos.lat, pos.lng]}
        draggable={true}
        eventHandlers={{
          dragend(e) {
            const marker = e.target
            const latlng = marker.getLatLng()
            const p = { lat: latlng.lat, lng: latlng.lng }
            setPos(p)
            onChange(p)
          },
        }}
      />
    )
  }

  return (
    <MapContainer center={[defaultCenter.lat, defaultCenter.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  )
}
