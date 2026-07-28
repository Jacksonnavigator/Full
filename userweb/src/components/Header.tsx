import React from 'react'

type HeaderProps = {
  language: 'en' | 'sw'
  activePath: string
  onNavigate: (path: string) => void
  onLanguageClick: () => void
}

const labels = {
  en: { report: 'Report', history: 'History', emergency: 'SOS', terms: 'Terms', language: 'English' },
  sw: { report: 'Ripoti', history: 'Historia', emergency: 'Dharura', terms: 'Sheria', language: 'Kiswahili' },
}

export default function Header({ language, activePath, onNavigate, onLanguageClick }: HeaderProps) {
  const copy = labels[language]
  const tabs = [
    { path: '/', label: copy.report },
    { path: '/history', label: copy.history },
    { path: '/emergency', label: copy.emergency },
    { path: '/terms', label: copy.terms },
  ]

  return <>
    <header className="site-header">
      <div className="site-header__inner">
        <button type="button" className="brand" onClick={() => onNavigate('/')} aria-label="MajiScope home">
          <img className="brand__logo" src="/logo.png" alt="" aria-hidden="true" />
          <span className="brand__identity">
            <span className="brand__wordmark" aria-hidden="true">MajiScope</span>
            <span className="brand__tagline">Community water reporting</span>
          </span>
        </button>
        <div className="header-actions">
          <button type="button" className="language-button" onClick={onLanguageClick}>{copy.language}</button>
          <span className="header-actions__ministry"><small>Powered by</small><strong>Water Ministry</strong></span>
        </div>
      </div>
      <span className="site-header__waves" aria-hidden="true">
        <svg viewBox="0 0 375 72" preserveAspectRatio="none">
          <path d="M0 30 C60 64 120 12 180 30 C240 48 300 18 360 40 C372 46 384 52 375 56 L375 72 L0 72 Z" fill="rgba(6,139,176,0.22)" />
          <path d="M0 38 C70 66 140 24 210 38 C280 52 330 30 375 50 L375 72 L0 72 Z" fill="rgba(3,105,121,0.32)" />
        </svg>
      </span>
    </header>
    <nav className="primary-nav" aria-label="Main navigation">
      <div className="primary-nav__inner">
        {tabs.map((tab) => <button key={tab.path} type="button" className={activePath === tab.path || (tab.path === '/history' && activePath.startsWith('/history/')) ? 'nav-item nav-item--active' : 'nav-item'} onClick={() => onNavigate(tab.path)}>{tab.label}</button>)}
      </div>
    </nav>
  </>
}

