import React from 'react'

export default function Thanks() {
  // Read trackingId from query string
  const params = new URLSearchParams(window.location.search)
  const trackingId = params.get('trackingId')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-2xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold">Thank you</h1>
        <p className="mt-2 text-slate-700">Your report has been submitted.</p>
        {trackingId ? (
          <div className="mt-4 rounded border p-4">
            <p className="text-sm text-slate-500">Tracking ID</p>
            <p className="mt-1 font-medium">{trackingId}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
