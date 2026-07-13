import React, { useState, useRef } from 'react'

interface ImageUploaderProps {
  onUploaded: (base64Images: string[]) => void
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ImageUploader({ onUploaded }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    setProcessing(true)

    const fileArray = Array.from(files)

    // Validate sizes (10 MB limit per file)
    const oversized = fileArray.filter((f) => f.size > 10 * 1024 * 1024)
    if (oversized.length > 0) {
      setError(`${oversized.length} file(s) exceed 10 MB and were skipped.`)
    }
    const valid = fileArray.filter((f) => f.size <= 10 * 1024 * 1024)
    if (valid.length === 0) {
      setProcessing(false)
      return
    }

    try {
      // Convert to base64 locally — no network call needed
      const base64List = await Promise.all(valid.map(fileToBase64))
      const next = [...previews, ...base64List]
      setPreviews(next)
      onUploaded(next)
    } catch (err: any) {
      setError('Could not read one or more images. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  function removeImage(index: number) {
    const next = previews.filter((_, i) => i !== index)
    setPreviews(next)
    onUploaded(next)
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 transition hover:border-teal-400 hover:bg-teal-50"
      >
        {processing ? (
          <span>Processing…</span>
        ) : (
          <>
            <span className="font-medium text-slate-700">Click or drag photos here</span>
            <span className="mt-1 text-xs">PNG, JPG, WEBP up to 10 MB each</span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden rounded border border-slate-200">
              <img src={src} alt={`preview-${i}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(i)
                }}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
