import React, { useEffect, useRef, useState } from 'react'

type SearchResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
  name?: string
}

type Position = { lat: number; lng: number }

type AddressSearchProps = {
  language: 'en' | 'sw'
  onSelect: (displayName: string, position: Position) => void
  placeholder?: string
  disabled?: boolean
}

const TANZANIA_VIEWBOX = '28.6,-0.7,40.8,-12.5'
const SEARCH_DELAY_MS = 450
const MIN_SEARCH_LENGTH = 2

function isInTanzania(position: Position) {
  return position.lat >= -12.5 && position.lat <= -0.7 && position.lng >= 28.6 && position.lng <= 40.8
}

function copyFor(language: AddressSearchProps['language']) {
  return language === 'sw'
    ? {
        searching: 'Inatafuta...',
        noResults: 'Hakuna eneo lililopatikana Tanzania kwa utafutaji huo.',
        error: 'Utafutaji wa eneo haujapatikana. Jaribu tena baada ya muda.',
        clear: 'Futa',
      }
    : {
        searching: 'Searching...',
        noResults: 'No place or street was found in Tanzania for that search.',
        error: 'Location search is unavailable right now. Please try again shortly.',
        clear: 'Clear',
      }
}

export default function AddressSearch({ language, onSelect, placeholder, disabled = false }: AddressSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef(new Map<string, SearchResult[]>())
  const controllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const normalized = query.trim().replace(/\s+/g, ' ')
    controllerRef.current?.abort()

    if (normalized.length < MIN_SEARCH_LENGTH) {
      setResults([])
      setLoading(false)
      setSearched(false)
      setError(null)
      return
    }

    const timer = window.setTimeout(async () => {
      const cached = cacheRef.current.get(normalized.toLowerCase())
      if (cached) {
        setResults(cached)
        setSearched(true)
        return
      }

      const controller = new AbortController()
      controllerRef.current = controller
      const requestId = ++requestIdRef.current
      setLoading(true)
      setSearched(false)
      setError(null)

      try {
        const searchQuery = /\btanzania\b/i.test(normalized) ? normalized : `${normalized}, Tanzania`
        const params = new URLSearchParams({
          format: 'jsonv2',
          q: searchQuery,
          countrycodes: 'tz',
          viewbox: TANZANIA_VIEWBOX,
          bounded: '1',
          addressdetails: '1',
          dedupe: '1',
          limit: '8',
          'accept-language': language === 'sw' ? 'sw,en' : 'en',
        })
        const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('Location search failed')
        const data = await response.json() as SearchResult[]
        const filtered = data.filter((result) => isInTanzania({ lat: Number(result.lat), lng: Number(result.lon) }))
        cacheRef.current.set(normalized.toLowerCase(), filtered)
        if (requestId === requestIdRef.current) {
          setResults(filtered)
          setSearched(true)
        }
      } catch (reason) {
        if (reason instanceof DOMException && reason.name === 'AbortError') return
        if (requestId === requestIdRef.current) {
          setResults([])
          setSearched(true)
          setError(copyFor(language).error)
        }
      } finally {
        if (requestId === requestIdRef.current) setLoading(false)
      }
    }, SEARCH_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [language, query])

  useEffect(() => () => controllerRef.current?.abort(), [])

  const text = copyFor(language)
  const noResults = searched && !loading && !error && results.length === 0 && query.trim().length >= MIN_SEARCH_LENGTH

  return <div className="address-search">
    <div className="address-search__input-wrap">
      <input
        value={query}
        disabled={disabled}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={results.length > 0}
        placeholder={placeholder || (language === 'sw' ? 'Tafuta mtaa, sehemu au anwani Tanzania' : 'Search a street, place, or address in Tanzania')}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.preventDefault()
          if (event.key === 'Escape') setResults([])
        }}
      />
      {query ? <button type="button" className="address-search__clear" onClick={() => setQuery('')} disabled={disabled}>{text.clear}</button> : null}
      {loading ? <span className="address-search__loading" aria-live="polite">{text.searching}</span> : null}
    </div>
    {error ? <p className="field-error">{error}</p> : null}
    {noResults ? <p className="address-search__message">{text.noResults}</p> : null}
    {results.length > 0 ? <ul className="address-search__results" role="listbox">
      {results.map((result) => <li key={result.place_id} role="option">
        <button type="button" onClick={() => {
          const position = { lat: Number(result.lat), lng: Number(result.lon) }
          setQuery(result.name || result.display_name)
          setResults([])
          onSelect(result.display_name, position)
        }}>
          <strong>{result.name || result.display_name.split(',')[0]}</strong>
          <span>{result.display_name}</span>
        </button>
      </li>)}
    </ul> : null}
  </div>
}