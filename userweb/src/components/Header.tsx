import React from 'react'

export default function Header() {
  return (
    <header className="bg-primary border-b border-slate-200 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-3 text-white hover:text-slate-100"
            onClick={() => (window.location.href = '/')}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-black uppercase tracking-tight">M</span>
            <span className="text-lg font-semibold">Majiscope</span>
          </button>
          <button type="button" className="hover:text-slate-100" onClick={() => window.alert('About Majiscope is not yet available in this preview.')}>About</button>
          <button type="button" className="hover:text-slate-100" onClick={() => window.alert('Feedback about Majiscope is not yet available in this preview.')}>Feedback</button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-slate-100">
          <button
            type="button"
            className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10"
            onClick={() => window.alert('Language options will be available soon.')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.4a8.4 8.4 0 110-16.8 8.4 8.4 0 010 16.8z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M2.5 12h19" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            English
          </button>
          <span className="hidden h-4 border-l border-white/20 sm:inline" />
          <button type="button" className="hover:text-white" onClick={() => (window.location.href = '/download')}>
            Get the app
          </button>
          <button
            type="button"
            className="rounded border border-white/20 px-3 py-1 hover:bg-white/10"
            onClick={() => (window.location.href = '/login')}
          >
            Login / Register
          </button>
        </div>
      </div>
    </header>
  )
}
