import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">About Fixi</h1>
        <p className="mt-4 text-slate-700">
          Fixi is a fast public issue reporting experience for local communities. Use the issue form to share details, location and photos so the right teams can resolve the problem.
        </p>
        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <p>
            This preview includes the issue submission flow, map selection, photo upload and address search. The full Fixi experience will also include issue tracking, comments and local area status.
          </p>
          <p>
            Use the top page controls to switch between submitting a new issue or viewing the report list, and the map pane to choose whether you want a map or list view.
          </p>
        </div>
      </div>
    </div>
  )
}
