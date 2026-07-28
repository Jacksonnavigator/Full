import React, { useEffect, useRef, useState } from 'react'

interface ImageUploaderProps {
  files: File[]
  onChange: (files: File[]) => void
  disabled?: boolean
  language: 'en' | 'sw'
}

const MAX_FILE_SIZE = 15 * 1024 * 1024
const MAX_FILES = 4

export default function ImageUploader({ files, onChange, disabled, language }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    const nextPreviews = files.map((file) => URL.createObjectURL(file))
    setPreviews(nextPreviews)
    return () => nextPreviews.forEach(URL.revokeObjectURL)
  }, [files])

  function addFiles(selected: FileList | null) {
    if (!selected) return
    setError(null)
    const candidates = Array.from(selected).filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
    const tooLarge = candidates.filter((file) => file.size > MAX_FILE_SIZE)
    const allowed = candidates.filter((file) => file.size <= MAX_FILE_SIZE).slice(0, MAX_FILES - files.length)
    if (tooLarge.length) setError(language === 'sw' ? 'Baadhi ya faili ni makubwa kuliko MB 15.' : 'Some files are larger than 15 MB.')
    if (!allowed.length && !tooLarge.length) setError(language === 'sw' ? `Unaweza kuongeza hadi faili ${MAX_FILES}.` : `You can add up to ${MAX_FILES} files.`)
    if (allowed.length) onChange([...files, ...allowed])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="media-picker">
      <input ref={inputRef} className="sr-only" type="file" accept="image/*,video/*" multiple onChange={(event) => addFiles(event.target.files)} disabled={disabled || files.length >= MAX_FILES} />
      <button type="button" className="media-picker__trigger" onClick={() => inputRef.current?.click()} disabled={disabled || files.length >= MAX_FILES}>
        <span className="media-picker__plus">+</span>
        <span>{files.length ? (language === 'sw' ? 'Ongeza ushahidi zaidi' : 'Add more evidence') : (language === 'sw' ? 'Ongeza picha au video' : 'Add photo or video')}</span>
        <small>{language === 'sw' ? 'Hadi faili 4, MB 15 kila moja' : 'Up to 4 files, 15 MB each'}</small>
      </button>
      {previews.length > 0 ? <div className="media-picker__grid">
        {previews.map((preview, index) => <div className="media-picker__item" key={`${files[index].name}-${files[index].lastModified}`}>
          {files[index].type.startsWith('video/') ? <video src={preview} muted playsInline /> : <img src={preview} alt="Selected evidence" />}
          <button type="button" className="media-picker__remove" onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))} aria-label="Remove selected file">x</button>
          <span>{files[index].type.startsWith('video/') ? 'Video' : 'Photo'}</span>
        </div>)}
      </div> : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  )
}