import React, { useState, useEffect, useRef } from 'react'

type Suggestion = {
  display_name: string
  lat: string
  lon: string
}

export default function AddressSearch({
  onSelect,
  placeholder = 'Search for an address or street',
}: {
  onSelect: (displayName: string, latlng: { lat: number; lng: number }) => void
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function fetchResults(searchQuery: string) {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setResults([])
      return
    }

    try {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      setLoading(true)
      setGeoError(null)
      const q = encodeURIComponent(searchQuery)
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=tz&q=${q}`
      const res = await fetch(url, { signal: ac.signal, headers: { 'Accept-Language': 'en' } })
      if (!res.ok) throw new Error('Geocode failed')
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } catch (err) {
      if ((err as any).name === 'AbortError') return
      console.error(err)
      setResults([])
      setGeoError('Unable to search for that address. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function isInTanzania(lat: number, lng: number) {
    return lat >= -12.35 && lat <= -0.85 && lng >= 29.0 && lng <= 40.5
  }

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Location capture is not supported by this browser.')
      return
    }

    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
        if (!isInTanzania(coords.lat, coords.lng)) {
          setGeoError('Current location is outside Tanzania. Please select a location inside Tanzania or type a Tanzanian address.')
          setGeoLoading(false)
          return
        }
        setQuery('Current location')
        setResults([])
        onSelect('Current location', coords)
        setGeoLoading(false)
      },
      (error) => {
        console.error(error)
        setGeoError('Unable to retrieve your current location. Please allow location access and try again.')
        setGeoLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setResults([])
      return
    }

    const id = window.setTimeout(() => {
      fetchResults(query)
    }, 300)

    return () => window.clearTimeout(id)
  }, [query])

  const showNoResults = query.trim().length >= 2 && !loading && results.length === 0
  const showLocationIcon = query.trim().length === 0

  return (
    <div className="relative">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.5" fill="currentColor" />
          </svg>
        </span>
        <input
          className={`w-full rounded border px-3 py-2 pl-11 pr-14 text-sm shadow-sm focus:border-teal-500 focus:outline-none ${showNoResults ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0f5b66] text-white shadow-sm hover:bg-[#0d4f58]"
          onClick={() => {
            if (showLocationIcon) {
              captureLocation()
            } else {
              fetchResults(query)
            }
          }}
        >
          {showLocationIcon ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4a7 7 0 017 7 7 7 0 01-7 7 7 7 0 010-14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {loading && <div className="absolute right-14 top-1/2 -translate-y-1/2 text-sm text-slate-500">Searching...</div>}
      {showNoResults && (
        <div className="mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          We could not find the issue location. Type and select a street name or click on the map.
        </div>
      )}
      {results.length > 0 && (
        <ul className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded border border-slate-200 bg-white shadow-lg">
          {results.map((r, i) => (
            <li
              key={i}
              className="cursor-pointer px-3 py-2 hover:bg-slate-100"
              onClick={() => {
                setQuery(r.display_name)
                setResults([])
                onSelect(r.display_name, { lat: Number(r.lat), lng: Number(r.lon) })
              }}
            >
              <div className="text-sm text-slate-900">{r.display_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
