"use client"

import type { LeafletMouseEvent } from "leaflet"
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet"

const DEFAULT_CENTER: [number, number] = [-6.7924, 39.2083]

function ClickHandler({
  onChange,
}: {
  onChange: (next: { latitude: number; longitude: number }) => void
}) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      })
    },
  })

  return null
}

export function DMALocationPickerImpl({
  value,
  onChange,
}: {
  value: { latitude: number | null; longitude: number | null }
  onChange: (next: { latitude: number; longitude: number }) => void
}) {
  const center: [number, number] =
    value.latitude !== null && value.longitude !== null
      ? [value.latitude, value.longitude]
      : DEFAULT_CENTER

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">DMA Map Center</p>
        <p className="mt-1 text-xs text-slate-500">
          Click anywhere on the map to set the DMA center used for dashboard centering and management visibility.
        </p>
      </div>
      <MapContainer center={center} zoom={12} scrollWheelZoom className="h-[260px] w-full md:h-[300px]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {value.latitude !== null && value.longitude !== null ? (
          <CircleMarker
            center={[value.latitude, value.longitude]}
            radius={11}
            pathOptions={{
              color: "#0f766e",
              fillColor: "#14b8a6",
              fillOpacity: 0.9,
              weight: 2,
            }}
          />
        ) : null}
      </MapContainer>
    </div>
  )
}
