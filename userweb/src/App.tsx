import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import MapPicker from './components/MapPicker'
import ImageUploader from './components/ImageUploader'
import AddressSearch from './components/AddressSearch'
import {
  AppLanguage,
  LeakageType,
  PublicReport,
  ReportPriority,
  ReportType,
  getReportHistory,
  lookupReportByTrackingId,
  resolveUtility,
  submitAnonymousReport,
} from './utils/api'

const LANGUAGE_STORAGE_KEY = 'majiscope_app_language'

type Position = { lat: number; lng: number }

type Copy = Record<string, string>

const copy: Record<AppLanguage, Copy> = {
  en: {
    reportTitle: 'Report a Water Problem', reportSubtitle: 'Add evidence, pin the exact location, then send it to the utility team.',
    step1: 'Step 1: Add Photo or Video', step1Help: 'Clear visual evidence helps the field team understand the issue before arrival.',
    step2: 'Step 2: Capture Location', step2Help: 'Use your current location or place the marker on the exact affected spot.',
    currentLocation: 'Use current location', gettingLocation: 'Getting current location...', locationReady: 'Current location captured. You can fine-tune the pin on the map.', locationRetry: 'GPS is taking longer than expected. Trying a less precise location...', locationDenied: 'Location permission is blocked. Enable it for this site in your browser settings, then try again.', locationUnavailable: 'Your current location is unavailable. Check that location services are on, then try again.', locationTimeout: 'Location took too long to respond. Move to an area with better signal and try again.', locationSecure: 'Current location needs HTTPS or localhost. Open this site securely and try again.', step3: 'Step 3: Select Priority', step4: 'Step 4: Report Type', step5: 'Step 5: Leakage Type', step6: 'Step 6: Describe the Problem',
    select: 'Select an option', descriptionPlaceholder: 'Describe the water problem, for example pipe burst, water leakage, or contamination.',
    submit: 'Submit Report', submitting: 'Sending report...', completed: 'Report submitted', historyTitle: 'Your Reports', historySubtitle: 'Follow the status of reports from this browser or add an existing tracking ID.',
    lookupPlaceholder: 'Enter tracking ID', lookup: 'Find report', noReports: 'No reports yet', noReportsDetail: 'Reports submitted from this browser will appear here.',
    refresh: 'Refresh', viewDetails: 'View details', received: 'Received', assigned: 'Assigned', inProgress: 'Repair in Progress', finalReview: 'Under Final Review', resolved: 'Resolved', rework: 'Sent Back for Rework',
    reportDetails: 'Report Details', evidence: 'Submitted evidence', reportType: 'Report type', leakageType: 'Leakage type', status: 'Status', priority: 'Priority', location: 'Location', submitted: 'Submitted', utility: 'Utility', dma: 'DMA',
    utilityContacts: 'Utility contacts for this report', workflowNote: 'Latest workflow note', engineerNote: 'Engineer submission note', leaderNote: 'Team leader review comment', dmaNote: 'DMA review decision',
    emergencyTitle: 'Emergency Contacts', emergencySubtitle: 'Find the water utility serving your current area.', findUtility: 'Find my utility', resolving: 'Checking your location...', noUtility: 'We could not identify a utility for this location. Try again after allowing location access.',
    termsTitle: 'Before You Report', termsSubtitle: 'Use MajiScope to submit complete, genuine reports that help utilities respond.',
    termsOneTitle: 'Report real water problems', termsOne: 'Use the app for leakages and water-service issues that need a utility response.',
    termsTwoTitle: 'Include clear evidence', termsTwo: 'Add a clear photo or short video and describe what you observed.', termsThreeTitle: 'Pin the exact location', termsThree: 'Move the marker to the affected place so a field team can find it.',
    termsFourTitle: 'Keep tracking your report', termsFour: 'Your tracking ID and updates stay available in report history on this browser.',
    chooseLanguage: 'Choose Language', chooseLanguageSubtitle: 'Select the language you want to use in MajiScope.', continue: 'Continue', english: 'English', swahili: 'Kiswahili',
    mediaRequired: 'Add at least one photo or video before continuing.', locationLocked: 'Add evidence before capturing a location.', priorityLocked: 'Capture and confirm a location first.', typeLocked: 'Select a priority first.', leakageLocked: 'Choose leakage as the report type first.',
    validation: 'Complete the required reporting steps before submitting.', uploadError: 'Unable to submit your report. Please check your connection and try again.',
    high: 'High', moderate: 'Moderate', low: 'Low', leakage: 'Leakage', nonLeakage: 'Other service issue', groundLeakage: 'Ground leakage', pipeBurst: 'Pipe burst', meterLeakage: 'Meter leakage', valveLeakage: 'Valve leakage', overflow: 'Overflow', unknown: "I don't know",
    reportReceived: 'Your report has been received and is waiting to be assigned to a field team.', reportAssigned: 'A field team has been assigned and will head to the reported location.', reportInProgress: 'The field crew is actively working on the reported issue.', reportReview: 'Repair work is complete and the report is moving through final review.', reportResolved: 'This report has been completed and closed successfully.', reportRework: 'The repair needs more work before it can be fully approved.', reportUnknown: 'Your report is moving through the operations workflow.',
  },
  sw: {
    reportTitle: 'Ripoti Tatizo la Maji', reportSubtitle: 'Ongeza ushahidi, weka eneo sahihi, kisha tuma kwa timu ya huduma.',
    step1: 'Hatua 1: Ongeza Picha au Video', step1Help: 'Ushahidi wazi husaidia timu ya uwanja kuelewa tatizo kabla ya kufika.',
    step2: 'Hatua 2: Pata Eneo', step2Help: 'Tumia eneo la sasa au weka alama kwenye eneo halisi lililoathiriwa.',
    currentLocation: 'Tumia eneo la sasa', gettingLocation: 'Inapata eneo la sasa...', locationReady: 'Eneo la sasa limepatikana. Unaweza kurekebisha alama kwenye ramani.', locationRetry: 'GPS inachelewa. Inajaribu eneo la usahihi wa kawaida...', locationDenied: 'Ruhusa ya eneo imezuiwa. Iruhusu kwa tovuti hii kwenye mipangilio ya kivinjari kisha jaribu tena.', locationUnavailable: 'Eneo la sasa halipatikani. Hakikisha huduma za eneo zimewashwa kisha jaribu tena.', locationTimeout: 'Eneo limechelewa kujibu. Nenda mahali penye mtandao bora kisha jaribu tena.', locationSecure: 'Eneo la sasa linahitaji HTTPS au localhost. Fungua tovuti kwa muunganisho salama kisha jaribu tena.', step3: 'Hatua 3: Chagua Kipaumbele', step4: 'Hatua 4: Aina ya Ripoti', step5: 'Hatua 5: Aina ya Uvujaji', step6: 'Hatua 6: Eleza Tatizo',
    select: 'Chagua', descriptionPlaceholder: 'Eleza tatizo la maji, kwa mfano bomba kupasuka, uvujaji, au uchafuzi.',
    submit: 'Wasilisha Ripoti', submitting: 'Inatuma ripoti...', completed: 'Ripoti imetumwa', historyTitle: 'Ripoti Zako', historySubtitle: 'Fuatilia hali ya ripoti kutoka kwenye kivinjari hiki au ongeza namba ya ufuatiliaji.',
    lookupPlaceholder: 'Weka namba ya ufuatiliaji', lookup: 'Tafuta ripoti', noReports: 'Bado hakuna ripoti', noReportsDetail: 'Ripoti zilizotumwa kutoka kwenye kivinjari hiki zitaonekana hapa.',
    refresh: 'Sasisha', viewDetails: 'Angalia maelezo', received: 'Imepokelewa', assigned: 'Imepewa', inProgress: 'Matengenezo yanaendelea', finalReview: 'Chini ya ukaguzi wa mwisho', resolved: 'Imekamilika', rework: 'Imerudishwa kwa marekebisho',
    reportDetails: 'Maelezo ya Ripoti', evidence: 'Ushahidi uliotumwa', reportType: 'Aina ya ripoti', leakageType: 'Aina ya uvujaji', status: 'Hali', priority: 'Kipaumbele', location: 'Eneo', submitted: 'Imewasilishwa', utility: 'Huduma', dma: 'DMA',
    utilityContacts: 'Anwani za huduma kwa ripoti hii', workflowNote: 'Ujumbe wa mwisho wa utaratibu', engineerNote: 'Ujumbe wa mhandisi', leaderNote: 'Maoni ya kiongozi wa timu', dmaNote: 'Uamuzi wa ukaguzi wa DMA',
    emergencyTitle: 'Anwani za Dharura', emergencySubtitle: 'Pata huduma ya maji inayohudumia eneo lako la sasa.', findUtility: 'Pata huduma yangu', resolving: 'Inakagua eneo lako...', noUtility: 'Hatukuweza kutambua huduma ya maji kwa eneo hili. Ruhusu eneo kisha jaribu tena.',
    termsTitle: 'Kabla ya Kuripoti', termsSubtitle: 'Tumia MajiScope kutuma ripoti kamili za kweli zinazosaidia huduma kujibu.',
    termsOneTitle: 'Ripoti matatizo halisi ya maji', termsOne: 'Tumia programu kwa uvujaji na shida za huduma za maji zinazohitaji jibu.',
    termsTwoTitle: 'Ongeza ushahidi wazi', termsTwo: 'Ongeza picha wazi au video fupi na eleza ulichoona.', termsThreeTitle: 'Weka eneo sahihi', termsThree: 'Sogeza alama mahali palipoathiriwa ili timu iweze kufika.',
    termsFourTitle: 'Endelea kufuatilia ripoti', termsFour: 'Namba yako ya ufuatiliaji na taarifa hubaki kwenye historia ya kivinjari hiki.',
    chooseLanguage: 'Chagua Lugha', chooseLanguageSubtitle: 'Chagua lugha unayotaka kutumia kwenye MajiScope.', continue: 'Endelea', english: 'English', swahili: 'Kiswahili',
    mediaRequired: 'Ongeza angalau picha moja au video kabla ya kuendelea.', locationLocked: 'Ongeza ushahidi kabla ya kuchukua eneo.', priorityLocked: 'Chukua na thibitisha eneo kwanza.', typeLocked: 'Chagua kipaumbele kwanza.', leakageLocked: 'Chagua uvujaji kama aina ya ripoti kwanza.',
    validation: 'Kamilisha hatua zinazohitajika kabla ya kuwasilisha.', uploadError: 'Imeshindwa kutuma ripoti. Angalia mtandao wako kisha jaribu tena.',
    high: 'Juu', moderate: 'Kati', low: 'Chini', leakage: 'Uvujaji', nonLeakage: 'Tatizo lingine la huduma', groundLeakage: 'Uvujaji wa ardhini', pipeBurst: 'Bomba limepasuka', meterLeakage: 'Uvujaji wa mita', valveLeakage: 'Uvujaji wa vali', overflow: 'Kufurika', unknown: 'Haijulikani',
    reportReceived: 'Ripoti yako imepokelewa na inasubiri kupewa timu ya uwanja.', reportAssigned: 'Timu ya uwanja imepewa kazi na itaenda kwenye eneo lililoripotiwa.', reportInProgress: 'Wafanyakazi wa uwanja wanafanya kazi kwenye tatizo lililoripotiwa.', reportReview: 'Kazi ya matengenezo imekamilika na ripoti inapitia ukaguzi wa mwisho.', reportResolved: 'Ripoti hii imekamilika na kufungwa kwa mafanikio.', reportRework: 'Matengenezo yanahitaji kazi zaidi kabla ya kuidhinishwa.', reportUnknown: 'Ripoti yako inaendelea kupitia utaratibu wa uendeshaji.',
  },
}

const priorityOptions: { value: ReportPriority; key: string }[] = [
  { value: 'urgent', key: 'high' }, { value: 'moderate', key: 'moderate' }, { value: 'low', key: 'low' },
]
const typeOptions: { value: ReportType; key: string }[] = [{ value: 'leakage', key: 'leakage' }, { value: 'non_leakage', key: 'nonLeakage' }]
const leakageOptions: { value: LeakageType; key: string }[] = [
  { value: 'ground_leakage', key: 'groundLeakage' }, { value: 'pipe_burst', key: 'pipeBurst' }, { value: 'meter_leakage', key: 'meterLeakage' },
  { value: 'valve_leakage', key: 'valveLeakage' }, { value: 'overflow', key: 'overflow' }, { value: 'unknown', key: 'unknown' },
]

function navigateTo(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-TZ', { timeZone: 'Africa/Dar_es_Salaam', dateStyle: 'medium', timeStyle: 'short', hour12: false }).format(date)
}

function progressFor(status: string, t: Copy) {
  const data: Record<string, { label: string; detail: string; tone: string }> = {
    new: { label: t.received, detail: t.reportReceived, tone: 'blue' }, assigned: { label: t.assigned, detail: t.reportAssigned, tone: 'indigo' },
    in_progress: { label: t.inProgress, detail: t.reportInProgress, tone: 'amber' }, pending_approval: { label: t.finalReview, detail: t.reportReview, tone: 'amber' },
    approved: { label: t.resolved, detail: t.reportResolved, tone: 'green' }, closed: { label: t.resolved, detail: t.reportResolved, tone: 'green' }, rejected: { label: t.rework, detail: t.reportRework, tone: 'red' },
  }
  return data[status] || { label: status.split('_').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' '), detail: t.reportUnknown, tone: 'slate' }
}

function priorityText(value: string, t: Copy) {
  if (value.toLowerCase() === 'urgent' || value.toLowerCase() === 'high') return t.high
  if (value.toLowerCase() === 'low') return t.low
  return t.moderate
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="page-heading"><h1>{title}</h1><p>{subtitle}</p></div>
}

function cleanStepTitle(title: string) {
  return title.replace(/^(Step|Hatua)\s+\d+\s*:\s*/i, '')
}

function StepCard({ number, title, help, locked, current, compact, children }: { number: number; title: string; help?: string; locked?: string; current?: boolean; compact?: boolean; children: React.ReactNode }) {
  return <section className={`step-card${locked ? ' step-card--locked' : ''}${current ? ' step-card--current' : ''}${compact ? ' step-card--compact' : ''}`}>
    <div className="step-card__heading"><span>{number}</span><div><h2>{cleanStepTitle(title)}</h2>{help ? <p>{help}</p> : null}</div></div>
    {locked ? <p className="locked-message">{locked}</p> : children}
  </section>
}

function ReportPage({ language, onNavigate }: { language: AppLanguage; onNavigate: (path: string) => void }) {
  const t = copy[language]
  const [files, setFiles] = useState<File[]>([])
  const [position, setPosition] = useState<Position | null>(null)
  const [address, setAddress] = useState('')
  const [priority, setPriority] = useState<ReportPriority | ''>('')
  const [reportType, setReportType] = useState<ReportType | ''>('')
  const [leakageType, setLeakageType] = useState<LeakageType | ''>('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationStatus, setLocationStatus] = useState<{ message: string; tone: 'info' | 'success' | 'error' } | null>(null)

  const mediaReady = files.length > 0
  const locationReady = position !== null
  const canSubmit = mediaReady && locationReady && priority && reportType && (reportType === 'non_leakage' || leakageType) && description.trim()


  const updateMapPosition = useCallback((next: Position) => {
    setError(null)
    setPosition(next)
    setAddress(`${next.lat.toFixed(5)}, ${next.lng.toFixed(5)}`)
  }, [])

  async function captureLocation() {
    setError(null)
    setLocationStatus(null)

    if (!window.isSecureContext) {
      setLocationStatus({ message: t.locationSecure, tone: 'error' })
      setError(t.locationSecure)
      return
    }

    if (!navigator.geolocation) {
      setLocationStatus({ message: t.locationUnavailable, tone: 'error' })
      setError(t.locationUnavailable)
      return
    }

    const getPosition = (options: PositionOptions) => new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
    const savePosition = (result: GeolocationPosition) => {
      const next = { lat: result.coords.latitude, lng: result.coords.longitude }
      setPosition(next)
      setAddress(`${next.lat.toFixed(5)}, ${next.lng.toFixed(5)}`)
      setLocationStatus({ message: t.locationReady, tone: 'success' })
    }
    const describeFailure = (reason: GeolocationPositionError) => {
      if (reason.code === reason.PERMISSION_DENIED) return t.locationDenied
      if (reason.code === reason.TIMEOUT) return t.locationTimeout
      return t.locationUnavailable
    }

    try {
      if (navigator.permissions?.query) {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        if (permission.state === 'denied') {
          setLocationStatus({ message: t.locationDenied, tone: 'error' })
          setError(t.locationDenied)
          return
        }
      }
    } catch {
      // Permission state is not exposed by every browser; the location request below remains authoritative.
    }

    setLocationLoading(true)
    setLocationStatus({ message: t.gettingLocation, tone: 'info' })
    try {
      try {
        savePosition(await getPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 }))
      } catch (firstError) {
        const firstReason = firstError as GeolocationPositionError
        if (firstReason.code === firstReason.PERMISSION_DENIED) {
          const message = describeFailure(firstReason)
          setLocationStatus({ message, tone: 'error' })
          setError(message)
          return
        }

        setLocationStatus({ message: t.locationRetry, tone: 'info' })
        try {
          savePosition(await getPosition({ enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }))
        } catch (fallbackError) {
          const message = describeFailure(fallbackError as GeolocationPositionError)
          setLocationStatus({ message, tone: 'error' })
          setError(message)
        }
      }
    } finally {
      setLocationLoading(false)
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    if (!canSubmit || !position || !priority || !reportType) { setError(t.validation); return }
    setSubmitting(true)
    try {
      const report = await submitAnonymousReport({ description: description.trim(), latitude: position.lat, longitude: position.lng, address: address || undefined, priority, report_type: reportType, leakage_type: reportType === 'non_leakage' ? null : leakageType as LeakageType, files })
      onNavigate(`/history/${encodeURIComponent(report.tracking_id)}`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t.uploadError)
    } finally { setSubmitting(false) }
  }

  return <main className="page-shell">

    <form onSubmit={submit} className="report-layout">
      <section className="report-workflow" aria-label={language === 'sw' ? 'Hatua za ripoti' : 'Report steps'}>
        <div className="report-workflow__header"><strong>{language === 'sw' ? 'Maelezo ya ripoti' : 'Report details'}</strong></div>
        <div className="report-steps">
          <StepCard number={1} title={t.step1} help={t.step1Help} current={!mediaReady}><ImageUploader files={files} onChange={setFiles} language={language} /></StepCard>
          <StepCard number={2} title={t.step2} help={t.step2Help} current={!locationReady}>
            <div className="location-actions"><button type="button" className="button button--secondary" onClick={captureLocation} disabled={locationLoading}>{locationLoading ? t.gettingLocation : t.currentLocation}</button><span>{position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : ''}</span></div>{locationStatus ? <p className={`location-status location-status--${locationStatus.tone}`} aria-live="polite">{locationStatus.message}</p> : null}
            <label className="field-label">{language === 'sw' ? 'Tafuta eneo au alama' : 'Search for an address or landmark'}</label>
            <AddressSearch language={language} onSelect={(name, next) => { setAddress(name); setPosition(next) }} placeholder={language === 'sw' ? 'Tafuta mtaa, sehemu au anwani Tanzania' : 'Search a street, place, or address in Tanzania'} />
          </StepCard>
          <div className={`report-classification-grid${reportType === 'leakage' ? ' report-classification-grid--three' : ''}`}>
            <StepCard number={3} title={t.step3} compact current={locationReady && !priority}><select value={priority} onChange={(event) => setPriority(event.target.value as ReportPriority)}><option value="">{t.select}</option>{priorityOptions.map((option) => <option key={option.value} value={option.value}>{t[option.key]}</option>)}</select></StepCard>
            <StepCard number={4} title={t.step4} compact current={Boolean(priority) && !reportType}><select value={reportType} onChange={(event) => { const next = event.target.value as ReportType; setReportType(next); if (next === 'non_leakage') setLeakageType('') }}><option value="">{t.select}</option>{typeOptions.map((option) => <option key={option.value} value={option.value}>{t[option.key]}</option>)}</select></StepCard>
            {reportType === 'leakage' ? <StepCard number={5} title={t.step5} compact current={!leakageType}><select value={leakageType} onChange={(event) => setLeakageType(event.target.value as LeakageType)}><option value="">{t.select}</option>{leakageOptions.map((option) => <option key={option.value} value={option.value}>{t[option.key]}</option>)}</select></StepCard> : null}
          </div>
          <StepCard number={reportType === 'leakage' ? 6 : 5} title={t.step6} current={Boolean(reportType === 'non_leakage' || leakageType) && !description.trim()}><textarea rows={5} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={t.descriptionPlaceholder} /></StepCard>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="button button--primary button--wide" disabled={!canSubmit || submitting} type="submit">{submitting ? t.submitting : t.submit}</button>
        </div>
      </section>
      <aside className="map-panel">
        <div className="map-panel__title"><div><strong>{language === 'sw' ? 'Eneo kwenye ramani' : 'Map location'}</strong><span>{language === 'sw' ? 'Bofya ramani au buruta alama.' : 'Click the map or drag the marker.'}</span></div><span className={`map-panel__readiness${locationReady ? ' map-panel__readiness--ready' : ''}`}><i aria-hidden="true" />{locationReady ? (language === 'sw' ? 'Alama imewekwa' : 'Pin placed') : (language === 'sw' ? 'Weka alama' : 'Choose a pin')}</span></div>
        <div className="map-frame"><MapPicker value={position || undefined} onChange={updateMapPosition} /></div>
      </aside>
    </form>
  </main>
}

function ReportCard({ report, language, onNavigate }: { report: PublicReport; language: AppLanguage; onNavigate: (path: string) => void }) {
  const t = copy[language]
  const progress = progressFor(report.status, t)
  return <article className="report-card"><div className="report-card__top"><div><p className="eyebrow">{report.tracking_id}</p><h2>{report.description || t.reportDetails}</h2></div><span className={`status status--${progress.tone}`}>{progress.label}</span></div><p className="report-card__detail">{progress.detail}</p><div className="report-card__meta"><span>{priorityText(report.priority, t)}</span><span>{formatDate(report.created_at)}</span></div><button type="button" className="text-button" onClick={() => onNavigate(`/history/${encodeURIComponent(report.tracking_id)}`)}>{t.viewDetails}</button></article>
}

function HistoryPage({ language, onNavigate }: { language: AppLanguage; onNavigate: (path: string) => void }) {
  const t = copy[language]
  const [reports, setReports] = useState<PublicReport[]>([])
  const [trackingId, setTrackingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [lookingUp, setLookingUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const load = async () => { setLoading(true); setReports(await getReportHistory()); setLoading(false) }
  useEffect(() => { void load() }, [])
  async function lookup(event: React.FormEvent) { event.preventDefault(); setError(null); setLookingUp(true); const report = await lookupReportByTrackingId(trackingId); setLookingUp(false); if (report) onNavigate(`/history/${encodeURIComponent(report.tracking_id)}`); else setError(language === 'sw' ? 'Hatukupata ripoti yenye namba hiyo.' : 'No report was found for that tracking ID.') }
  return <main className="page-shell page-shell--narrow"><SectionHeader title={t.historyTitle} subtitle={t.historySubtitle} /><form className="tracking-form" onSubmit={lookup}><input value={trackingId} onChange={(event) => setTrackingId(event.target.value)} placeholder={t.lookupPlaceholder} /><button className="button button--primary" disabled={!trackingId.trim() || lookingUp}>{lookingUp ? '...' : t.lookup}</button></form>{error ? <p className="form-error">{error}</p> : null}<div className="section-actions"><strong>{t.historyTitle}</strong><button type="button" className="text-button" onClick={() => void load()}>{t.refresh}</button></div>{loading ? <p className="muted">Loading...</p> : reports.length ? <div className="report-list">{reports.map((report) => <ReportCard key={report.id || report.tracking_id} report={report} language={language} onNavigate={onNavigate} />)}</div> : <div className="empty-state"><h2>{t.noReports}</h2><p>{t.noReportsDetail}</p></div>}</main>
}

function DetailPage({ trackingId, language }: { trackingId: string; language: AppLanguage }) {
  const t = copy[language]
  const [report, setReport] = useState<PublicReport | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { void lookupReportByTrackingId(trackingId).then((next) => { setReport(next); setLoading(false) }) }, [trackingId])
  if (loading) return <main className="page-shell page-shell--narrow"><p className="muted">Loading...</p></main>
  if (!report) return <main className="page-shell page-shell--narrow"><div className="empty-state"><h2>{language === 'sw' ? 'Ripoti haikupatikana' : 'Report not found'}</h2><p>{language === 'sw' ? 'Angalia namba ya ufuatiliaji kisha ujaribu tena.' : 'Check the tracking ID and try again.'}</p></div></main>
  const progress = progressFor(report.status, t)
  const media = report.report_photos?.length ? report.report_photos : report.photos
  const imageMedia = media.filter((item) => !isVideo(item))
  const videoMedia = media.filter(isVideo)
  const details = [
    [t.reportType, report.report_type === 'non_leakage' ? t.nonLeakage : t.leakage],
    ...(report.report_type === 'leakage' ? [[t.leakageType, t[leakageOptions.find((item) => item.value === report.leakage_type)?.key || 'unknown']]] : []),
    [t.status, progress.label], [t.priority, priorityText(report.priority, t)], [t.location, report.address || `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`], [t.submitted, formatDate(report.created_at)],
    ...(report.utility_name ? [[t.utility, report.utility_name]] : []), ...(report.dma_name ? [[t.dma, report.dma_name]] : []),
  ]
  return <main className="page-shell page-shell--narrow"><SectionHeader title={report.tracking_id || t.reportDetails} subtitle={progress.detail} /><article className="detail-summary"><p>{report.description}</p><span className={`status status--${progress.tone}`}>{progress.label}</span></article>{imageMedia.length ? <section className="detail-section"><h2>{t.evidence}</h2><div className="evidence-grid">{imageMedia.map((url, index) => <img key={`${url}-${index}`} src={url} alt="Submitted report evidence" />)}</div></section> : null}{videoMedia.length ? <section className="detail-section"><h2>{t.evidence}</h2>{videoMedia.map((url, index) => <video key={`${url}-${index}`} src={url} controls playsInline />)}</section> : null}<section className="detail-grid">{details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>{(report.utility_contact_phone || report.utility_contact_email || report.utility_contact_address) ? <section className="detail-section contact-section"><h2>{t.utilityContacts}</h2>{report.utility_contact_phone ? <a href={`tel:${report.utility_contact_phone}`}>{report.utility_contact_phone}</a> : null}{report.utility_contact_email ? <a href={`mailto:${report.utility_contact_email}`}>{report.utility_contact_email}</a> : null}{report.utility_contact_address ? <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.utility_contact_address)}`} target="_blank" rel="noreferrer">{report.utility_contact_address}</a> : null}</section> : null}{[[t.workflowNote, report.notes], [t.engineerNote, report.engineer_submission_notes], [t.leaderNote, report.team_leader_review_notes], [t.dmaNote, report.dma_review_notes]].filter(([, value]) => value).map(([label, value]) => <section className="detail-section note-section" key={label}><h2>{label}</h2><p>{value}</p></section>)}</main>
}

function isVideo(url: string) { return url.startsWith('data:video/') || /\.(mp4|mov|webm|m4v|3gp)(\?|$)/i.test(url) }

function EmergencyPage({ language }: { language: AppLanguage }) {
  const t = copy[language]
  const [loading, setLoading] = useState(false)
  const [utility, setUtility] = useState<Awaited<ReturnType<typeof resolveUtility>>>(null)
  const [error, setError] = useState<string | null>(null)
  function findUtility() { setError(null); setUtility(null); if (!navigator.geolocation) { setError(t.noUtility); return }; setLoading(true); navigator.geolocation.getCurrentPosition(async (position) => { const result = await resolveUtility(position.coords.latitude, position.coords.longitude); setUtility(result); if (!result) setError(t.noUtility); setLoading(false) }, () => { setError(t.noUtility); setLoading(false) }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }) }
  return <main className="page-shell page-shell--narrow"><SectionHeader title={t.emergencyTitle} subtitle={t.emergencySubtitle} /><section className="emergency-callout"><button type="button" className="button button--danger" onClick={findUtility} disabled={loading}>{loading ? t.resolving : t.findUtility}</button>{error ? <p className="form-error">{error}</p> : null}{utility ? <div className="utility-result"><p className="eyebrow">{utility.dma_name ? `DMA: ${utility.dma_name}` : 'Water utility'}</p><h2>{utility.utility_name}</h2>{utility.contact_phone ? <a href={`tel:${utility.contact_phone}`}>{utility.contact_phone}</a> : null}{utility.contact_email ? <a href={`mailto:${utility.contact_email}`}>{utility.contact_email}</a> : null}{utility.contact_address ? <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(utility.contact_address)}`} target="_blank" rel="noreferrer">{utility.contact_address}</a> : null}</div> : null}</section></main>
}

function TermsPage({ language }: { language: AppLanguage }) {
  const t = copy[language]
  const terms = [[t.termsOneTitle, t.termsOne], [t.termsTwoTitle, t.termsTwo], [t.termsThreeTitle, t.termsThree], [t.termsFourTitle, t.termsFour]]
  return <main className="page-shell page-shell--narrow"><SectionHeader title={t.termsTitle} subtitle={t.termsSubtitle} /><div className="terms-list">{terms.map(([title, body], index) => <article key={title}><span>{index + 1}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}</div></main>
}

function LanguageDialog({ language, onSelect, onClose }: { language: AppLanguage; onSelect: (language: AppLanguage) => void; onClose: () => void }) {
  const t = copy[language]
  const [selected, setSelected] = useState<AppLanguage>(language)
  return <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="language-title"><div className="language-dialog"><h1 id="language-title">{t.chooseLanguage}</h1><p>{t.chooseLanguageSubtitle}</p><div className="language-options"><label><input type="radio" checked={selected === 'en'} onChange={() => setSelected('en')} /><span>{t.english}</span></label><label><input type="radio" checked={selected === 'sw'} onChange={() => setSelected('sw')} /><span>{t.swahili}</span></label></div><button type="button" className="button button--primary button--wide" onClick={() => { onSelect(selected); onClose() }}>{t.continue}</button></div></div>
}

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>(() => localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'sw' ? 'sw' : 'en')
  const [showLanguage, setShowLanguage] = useState(() => !localStorage.getItem(LANGUAGE_STORAGE_KEY))
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => { const update = () => setPath(window.location.pathname); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update) }, [])
  function updateLanguage(next: AppLanguage) { localStorage.setItem(LANGUAGE_STORAGE_KEY, next); setLanguage(next) }
  function onNavigate(next: string) { navigateTo(next) }
  const view = useMemo(() => {
    if (path.startsWith('/history/')) return <DetailPage trackingId={decodeURIComponent(path.slice('/history/'.length))} language={language} />
    if (path === '/history') return <HistoryPage language={language} onNavigate={onNavigate} />
    if (path === '/emergency') return <EmergencyPage language={language} />
    if (path === '/terms') return <TermsPage language={language} />
    return <ReportPage language={language} onNavigate={onNavigate} />
  }, [path, language])
  return <div className="app"><Header language={language} activePath={path} onNavigate={onNavigate} onLanguageClick={() => setShowLanguage(true)} />{view}{showLanguage ? <LanguageDialog language={language} onSelect={updateLanguage} onClose={() => setShowLanguage(false)} /> : null}</div>
}