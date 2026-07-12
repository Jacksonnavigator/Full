import React from 'react'

export default function Feedback() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">Feedback about Fixi</h1>
        <p className="mt-4 text-slate-700">
          We’re building the Fixi report flow. If you have ideas or issues, please send feedback through the app.
        </p>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <p>
            For now, this preview doesn’t include a live feedback backend. The buttons in the header are now wired to this page so the app behavior matches the Fixi interface.
          </p>
          <p>
            In a full version, this page would allow users to submit product feedback, request feature improvements, and report usability problems.
          </p>
        </div>
      </div>
    </div>
  )
}
