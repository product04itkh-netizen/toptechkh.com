'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  defaultImages?: string[]
  name?: string
}

export default function ImageUpload({ defaultImages = [], name = 'images' }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(
    defaultImages.filter((url) => url.includes('supabase'))
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(async (files: File[]) => {
    setUploading(true)
    setError(null)

    const results: string[] = []
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (data.url) results.push(data.url)
        else setError(data.error || 'Upload failed')
      } catch {
        setError('Network error during upload')
      }
    }

    setImages((prev) => [...prev, ...results])
    setUploading(false)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files.length) uploadFiles(files)
  }

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx))

  const moveToFront = (idx: number) => {
    if (idx === 0) return
    setImages((prev) => {
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.unshift(item)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {/* Hidden form field — newline-joined URLs, compatible with parseForm */}
      <input type="hidden" name={name} value={images.join('\n')} />

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div key={url + idx} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-[#e5e8ec] bg-[#f2f3f5]">
              <Image
                src={url}
                alt=""
                fill
                className="object-contain p-1"
                onError={(e) => { (e.target as HTMLImageElement).src = '/top-tech-logo.png' }}
              />
              {/* Main badge */}
              {idx === 0 && (
                <div className="absolute bottom-0 inset-x-0 bg-[#041e42]/80 text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                  Main
                </div>
              )}
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-between p-1 gap-1">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => moveToFront(idx)}
                    title="Set as main image"
                    className="bg-white text-[#041e42] text-[9px] font-bold rounded px-1.5 py-0.5 leading-tight hover:bg-[#041e42] hover:text-white transition-colors"
                  >
                    Main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  title="Remove image"
                  className="ml-auto bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          ))}

          {/* Inline add tile */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-[#c5ccd5] flex flex-col items-center justify-center gap-1 text-[#818ea0] hover:border-[#041e42] hover:text-[#041e42] hover:bg-[#f8f9ff] transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
            <span className="text-[9px] font-semibold uppercase tracking-wide">Add</span>
          </button>
        </div>
      )}

      {/* Drop zone — shown when no images yet */}
      {images.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
            dragOver
              ? 'border-[#041e42] bg-[#f0f4ff]'
              : 'border-[#c5ccd5] bg-[#fafbfc] hover:border-[#041e42] hover:bg-[#f8f9ff]'
          }`}
        >
          {uploading ? (
            <Loader2 size={28} className="text-[#041e42] animate-spin" />
          ) : (
            <Upload size={28} className="text-[#818ea0]" />
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-[#021523]">
              {uploading ? 'Uploading…' : 'Click or drag & drop images here'}
            </p>
            <p className="text-xs text-[#818ea0] mt-0.5">PNG, JPG, WEBP — up to 5 MB each</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[#ef262c]">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  )
}
