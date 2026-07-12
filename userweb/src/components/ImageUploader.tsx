import React, { useRef, useState } from 'react'

export default function ImageUploader({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function doUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    setProgress(0)
    const uploadedUrls: string[] = []
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size > 50 * 1024 * 1024) {
          throw new Error('Each file must be smaller than 50 MB')
        }
        const form = new FormData()
        form.append('file', file)
        const res = await fetch(`${base}/api/uploads/public`, {
          method: 'POST',
          body: form,
        })
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
        const body = await res.json()
        if (body?.downloadUrl) {
          uploadedUrls.push(body.downloadUrl.startsWith('http') ? body.downloadUrl : `${base}${body.downloadUrl}`)
        } else if (body?.id) {
          uploadedUrls.push(`${base}/api/uploads/${body.id}`)
        }
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }
      setUrls((prev) => {
        const merged = [...prev, ...uploadedUrls]
        onUploaded(merged)
        return merged
      })
    } catch (err) {
      console.error(err)
      setError((err as any).message || 'Image upload failed')
    } finally {
      setUploading(false)
      setProgress(null)
      setDragActive(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    doUpload(e.target.files)
  }

  function handleAddClick() {
    inputRef.current?.click()
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    doUpload(e.dataTransfer.files)
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${dragActive ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-white'}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <svg className="mx-auto text-slate-400" width="56" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 15v3a1 1 0 001 1h16a1 1 0 001-1v-3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 10l3-3 4 4 5-5 3 3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="mb-4 text-slate-600">Drag & Drop photos here or click on 'Add photo'</div>
        <div>
          <button type="button" onClick={handleAddClick} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
            Add photo
          </button>
        </div>
        <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />
      </div>
      <p className="mt-3 text-sm text-slate-500">Add an overview photo to clarify your issue and speed up handling. You can add up to 50 MB of attachments at a time.</p>
      {uploading && progress !== null ? <div className="text-sm text-slate-600 mt-2">Uploading... {progress}%</div> : null}
      {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}
      {urls.length ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {urls.map((u) => (
            <img key={u} src={u} alt="uploaded" className="h-20 w-full object-cover rounded" />
          ))}
        </div>
      ) : null}
    </div>
  )
}
