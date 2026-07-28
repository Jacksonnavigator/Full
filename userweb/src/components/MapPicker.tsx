import React, { useEffect, useMemo, useRef } from 'react'
import { CircleMarker, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L, { LeafletEvent, LeafletMouseEvent, Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Position = { lat: number; lng: number }

type MapPickerProps = {
  value?: Position
  onChange: (position: Position) => void
  disabled?: boolean
  disabledMessage?: string
}

const TANZANIA_CENTER: [number, number] = [-6.369, 34.8888]
const TANZANIA_BOUNDS: L.LatLngBoundsExpression = [[-12.55, 28.45], [-0.55, 40.95]]
const POSITION_EPSILON = 0.00001

const markerIcon = L.divIcon({
  className: 'majiscope-map-marker',
  html: '<span class="majiscope-map-marker__pin" aria-hidden="true"></span>',
  iconSize: [30, 42],
  iconAnchor: [15, 40],
})

function samePosition(left: Position, right: Position) {
  return Math.abs(left.lat - right.lat) < POSITION_EPSILON && Math.abs(left.lng - right.lng) < POSITION_EPSILON
}

function keepMapSized(map: LeafletMap) {
  const resize = () => map.invalidateSize({ pan: false, debounceMoveend: true })
  const frame = window.requestAnimationFrame(resize)
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
  observer?.observe(map.getContainer())
  window.addEventListener('resize', resize)
  return () => {
    window.cancelAnimationFrame(frame)
    observer?.disconnect()
    window.removeEventListener('resize', resize)
  }
}

function MapController({ value, onChange, disabled }: MapPickerProps) {
  const map = useMap()
  const lastControlledPosition = useRef<Position | undefined>(value)

  useMapEvents({
    click(event: LeafletMouseEvent) {
      if (disabled) return
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })

  useEffect(() => keepMapSized(map), [map])

  useEffect(() => {
    if (!value) return
    const center = map.getCenter()
    const current = { lat: center.lat, lng: center.lng }
    const changedExternally = !lastControlledPosition.current || !samePosition(lastControlledPosition.current, value)
    lastControlledPosition.current = value

    if (changedExternally && !samePosition(current, value)) {
      map.setView([value.lat, value.lng], Math.max(map.getZoom(), 15), { animate: false })
    }
  }, [map, value?.lat, value?.lng])

  if (!value) return null

  return <>
    <CircleMarker
      center={[value.lat, value.lng]}
      radius={11}
      pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#cb302c', fillOpacity: 1 }}
      interactive={false}
    />
    <Marker
      icon={markerIcon}
      position={[value.lat, value.lng]}
      draggable={!disabled}
      zIndexOffset={1000}
      eventHandlers={{
        dragend(event: LeafletEvent) {
          if (disabled) return
          const point = (event.target as L.Marker).getLatLng()
          onChange({ lat: point.lat, lng: point.lng })
        },
      }}
    />
  </>
}

export default function MapPicker({ value, onChange, disabled = false, disabledMessage }: MapPickerProps) {
  const mapClassName = useMemo(() => `map-picker${disabled ? ' map-picker--disabled' : ''}`, [disabled])

  return <div className={mapClassName}>
    <MapContainer
      center={TANZANIA_CENTER}
      zoom={6}
      minZoom={5}
      maxZoom={19}
      maxBounds={TANZANIA_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom={false}
      zoomControl
      preferCanvas
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
        maxZoom={19}
        keepBuffer={2}
        updateWhenIdle
      />
      <MapController value={value} onChange={onChange} disabled={disabled} />
    </MapContainer>
    {disabled ? <div className="map-picker__overlay">{disabledMessage || 'Add evidence before setting the location.'}</div> : null}
  </div>
}