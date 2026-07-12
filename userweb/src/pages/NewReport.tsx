import React, { useState } from 'react'
import MapPicker from '../components/MapPicker'
import ImageUploader from '../components/ImageUploader'
import { sendAnonymousReport } from '../utils/api'
import AddressSearch from '../components/AddressSearch'

export default function NewReport() {
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetails, setAddressDetails] = useState('')
  const [reportedBy, setReportedBy] = useState('')
  const [priority, setPriority] = useState('medium')
  const [latlng, setLatlng] = useState<{ lat: number; lng: number } | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [sharePublic, setSharePublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'new' | 'issues'>('new')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!latlng) {
      setError('Please select the location on the map or by choosing an address.')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        description: description || 'Public report',
        address: address || undefined,
        reported_by: reportedBy || 'Anonymous',
        region_name: undefined,
        district_name: undefined,
        priority,
        latitude: latlng.lat,
        longitude: latlng.lng,
        images,
        share_public: sharePublic,
        note: addressDetails || undefined,
      }
      const res = await sendAnonymousReport(payload)
      if (res?.tracking_id) {
        const search = new URLSearchParams({ trackingId: res.tracking_id })
        window.location.href = `/thanks?${search.toString()}`
      } else {
        setError('Report submitted but no tracking ID returned')
      }
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full px-4 py-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(320px,25%)_minmax(0,75%)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 text-sm shadow-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-sm ${activeSection === 'new' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                onClick={() => setActiveSection('new')}
              >
                New report
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-1 text-sm ${activeSection === 'issues' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                onClick={() => setActiveSection('issues')}
              >
                My issues
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm sticky top-6">
            {activeSection === 'issues' ? (
              <div className="space-y-4">
                <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  My issues is an upcoming feature. Here you’ll soon see the issues you have reported.
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">No reports yet</p>
                  <p className="mt-2">When you submit a report, it will appear here along with its status and tracking number.</p>
                  <button
                    type="button"
                    onClick={() => setActiveSection('new')}
                    className="mt-4 inline-flex rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    Submit a new issue
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Description of the issue; do not enter any personal information (such as name, email, or phone number).
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Description of the issue *</label>
                    <textarea
                      className="w-full rounded border border-slate-300 bg-white px-3 py-3 text-sm shadow-sm focus:border-teal-500 focus:outline-none"
                      rows={5}
                      placeholder="For example: There are three waste bags in the supermarket parking area"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Location of the issue *</label>
                    <AddressSearch
                      placeholder="Search for an address, street or landmark"
                      onSelect={(display, pos) => {
                        setAddress(display)
                        setLatlng(pos)
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Address details</label>
                    <input
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none"
                      placeholder="For example: On the parking area"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Reported by</label>
                      <input
                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none"
                        placeholder="Anonymous"
                        value={reportedBy}
                        onChange={(e) => setReportedBy(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-900 mb-2">Priority</label>
                      <select
                        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Moderate</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Photos</label>
                    <ImageUploader onUploaded={(urls) => setImages(urls)} />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="sharePublic"
                      type="checkbox"
                      checked={sharePublic}
                      onChange={(e) => setSharePublic(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="sharePublic" className="text-sm text-slate-700">
                      Share above details on public map (description, photos and location will be visible to other users).
                    </label>
                  </div>

                  {error ? <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

                  <div>
                    <button
                      disabled={submitting}
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? 'Submitting...' : 'Submit report'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white p-5 shadow h-[760px]">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Pick location on the map</h3>
                <p className="text-sm text-slate-500">Click a point or drag the marker to fine-tune.</p>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">Nearby issues:</span>{' '}
                <a className="underline">Map view</a> | <a className="underline">List view</a>
              </div>
            </div>
            <div className="h-[600px] overflow-hidden rounded-xl border border-slate-200">
              <MapPicker onChange={(pos) => setLatlng(pos)} initialPosition={latlng ?? undefined} />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Selected: {latlng ? `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}` : 'Click on the map to drop a pin.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
