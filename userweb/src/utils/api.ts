// API functions for Majiscope Web
// In dev: uses Vite proxy (relative /api paths → backend)
// In prod: uses VITE_BACKEND_URL env var to call backend directly

const BASE =
  import.meta.env.VITE_BACKEND_URL
    ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')
    : ''

// If no VITE_BACKEND_URL, relative /api paths are used (works with Vite proxy in dev
// or a reverse proxy / same-origin setup in production)

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 40000): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('The server is starting up — please try again in a moment.')
    }
    throw new Error('Could not reach the server. Please check your internet connection and try again.')
  } finally {
    clearTimeout(id)
  }
}

export async function sendAnonymousReport(payload: {
  description: string
  address?: string
  reported_by?: string
  region_name?: string
  district_name?: string
  priority?: string
  latitude: number
  longitude: number
  images?: string[]
  share_public?: boolean
  note?: string
}): Promise<{ tracking_id: string }> {
  const response = await fetchWithTimeout(
    `${BASE}/api/reports/anonymous`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Server error ${response.status}${text ? ': ' + text : ''}`)
  }

  return response.json()
}
