export async function sendAnonymousReport(payload: any) {
  const base = import.meta.env.VITE_BACKEND_URL || 'https://majiscope.onrender.com'
  const res = await fetch(`${base}/api/reports/anonymous`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail || body?.message || `HTTP ${res.status}`)
  }
  return res.json()
}
