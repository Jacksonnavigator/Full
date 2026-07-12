import React from 'react'
import NewReport from './pages/NewReport'
import Thanks from './pages/Thanks'
import About from './pages/About'
import Feedback from './pages/Feedback'
import Header from './components/Header'

// Very small client-side router (SPA) to support /, /thanks, /about, and /feedback paths
function Router() {
  const path = window.location.pathname
  if (path.startsWith('/thanks')) return <Thanks />
  if (path.startsWith('/about')) return <About />
  if (path.startsWith('/feedback')) return <Feedback />
  return <NewReport />
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <Header />
      <main className="pt-6 w-full">
        <Router />
      </main>
    </div>
  )
}
