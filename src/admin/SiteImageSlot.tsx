import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { upsertSetting } from '../lib/queries'

export interface SiteImageSlotProps {
  title: string
  subtitle?: string
  urlKey: string
  altKey: string
  currentUrl?: string
  currentAlt?: string
  sizeHint: string
  aspectRatioClass: string
  maxWidth?: number
  onUrlChange: (url: string) => void
  onAltChange: (alt: string) => void
}

/**
 * Resizes and compresses an image file in the browser before upload.
 * Limits to maxWidth, converts to WebP (or JPEG fallback) at 0.85 quality.
 */
async function compressAndResizeImage(file: File, maxWidth: number): Promise<Blob> {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    throw new Error('Please choose a JPG, PNG, or WebP photo.')
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('The image must be smaller than 8MB.')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected image.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not open the selected image.'))
      img.onload = () => {
        let width = img.naturalWidth || img.width
        let height = img.naturalHeight || img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Your browser could not process this image.'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size > 0) {
              resolve(blob)
            } else {
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob && jpegBlob.size > 0) {
                    resolve(jpegBlob)
                  } else {
                    reject(new Error('Could not compress the image.'))
                  }
                },
                'image/jpeg',
                0.85
              )
            }
          },
          'image/webp',
          0.85
        )
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

function getStoragePath(publicUrl: string): string | null {
  try {
    const marker = '/product-images/'
    const idx = publicUrl.indexOf(marker)
    if (idx !== -1) {
      return decodeURIComponent(publicUrl.substring(idx + marker.length))
    }
  } catch {
    // ignore
  }
  return null
}

export default function SiteImageSlot({
  title,
  subtitle,
  urlKey,
  altKey,
  currentUrl = '',
  currentAlt = '',
  sizeHint,
  aspectRatioClass,
  maxWidth = 1600,
  onUrlChange,
  onAltChange,
}: SiteImageSlotProps) {
  const [altText, setAltText] = useState(currentAlt)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  useEffect(() => {
    setAltText(currentAlt || '')
  }, [currentAlt])

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const blob = await compressAndResizeImage(file, maxWidth)
      const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
      const path = `site/${urlKey}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, blob, {
          upsert: true,
          contentType: blob.type,
        })

      if (uploadError) {
        toast.error('Could not upload the image. Please try again.')
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      const newUrl = data.publicUrl

      // Clean up previous image if it was in the site/ folder
      if (currentUrl) {
        const oldPath = getStoragePath(currentUrl)
        if (oldPath && oldPath.startsWith('site/')) {
          supabase.storage.from('product-images').remove([oldPath]).catch(() => {})
        }
      }

      await upsertSetting(urlKey, newUrl)
      onUrlChange(newUrl)
      toast.success('Photo uploaded successfully')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not upload the image.'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    noClick: false,
    onDrop: (files: File[]) => {
      if (files[0]) {
        handleFile(files[0])
      }
    },
  })

  async function handleRemove() {
    setRemoving(true)
    try {
      if (currentUrl) {
        const path = getStoragePath(currentUrl)
        if (path) {
          await supabase.storage.from('product-images').remove([path])
        }
      }
      await upsertSetting(urlKey, '')
      onUrlChange('')
      setConfirmingRemove(false)
      toast.success('Photo removed')
    } catch {
      toast.error('Could not remove the photo. Please try again.')
    } finally {
      setRemoving(false)
    }
  }

  async function handleAltBlur() {
    if (altText !== currentAlt) {
      try {
        await upsertSetting(altKey, altText)
        onAltChange(altText)
        toast.success('Description saved')
      } catch {
        toast.error('Could not save description.')
      }
    }
  }

  return (
    <div className="flex flex-col bg-[#FAF7EE] border border-[#E6DFCF] p-4 transition-colors">
      {/* Header */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-[#3B2418]">{title}</h4>
        {subtitle && <p className="text-xs text-[#8a7060] mt-0.5">{subtitle}</p>}
      </div>

      {/* Preview Box & Dropzone */}
      <div
        {...getRootProps()}
        className={`relative w-full ${aspectRatioClass} overflow-hidden border border-[#E6DFCF] bg-[#FBF6EA] cursor-pointer group transition-all select-none ${
          isDragActive ? 'border-[#D9541E] ring-2 ring-[#D9541E]/30' : 'hover:border-[#3B2418]'
        }`}
        title="Click or drop an image to upload"
      >
        <input {...getInputProps()} />

        {currentUrl ? (
          <img
            src={currentUrl}
            alt={altText || title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#f0e8d5] via-[#e8dcc5] to-[#d9ccaa]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#8a7060]/50 mb-1.5"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-xs font-medium text-[#3B2418]">No photo uploaded</span>
            <span className="text-[11px] text-[#8a7060] mt-0.5">Drop photo or click to choose</span>
          </div>
        )}

        {/* Dragging state overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-[#3B2418]/70 flex items-center justify-center text-white text-xs font-medium z-10">
            Drop photo here
          </div>
        )}

        {/* Uploading loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-[#3B2418]/80 flex flex-col items-center justify-center text-white text-xs font-medium z-20 gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Compressing & uploading…</span>
          </div>
        )}
      </div>

      {/* Recommended size hint */}
      <p className="text-[11px] text-[#8a7060] mt-2 mb-3">{sizeHint}</p>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          type="button"
          onClick={open}
          disabled={uploading || removing}
          className="px-3 py-1.5 text-xs font-medium bg-[#3B2418] text-white hover:bg-[#D9541E] transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : currentUrl ? 'Replace photo' : 'Upload photo'}
        </button>

        {currentUrl && (
          <>
            {confirmingRemove ? (
              <div className="flex items-center gap-1.5 bg-white border border-[#D9541E] px-2 py-1">
                <span className="text-[11px] text-[#D9541E] font-medium">Remove photo?</span>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={removing}
                  className="px-2 py-0.5 text-[11px] font-medium bg-[#D9541E] text-white hover:bg-[#b84314] transition-colors disabled:opacity-50"
                >
                  {removing ? '…' : 'Yes'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingRemove(false)}
                  disabled={removing}
                  className="px-1.5 py-0.5 text-[11px] text-[#8a7060] hover:text-[#3B2418] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingRemove(true)}
                disabled={uploading || removing}
                className="px-3 py-1.5 text-xs font-medium border border-[#E6DFCF] bg-white text-[#8a7060] hover:text-[#D9541E] hover:border-[#D9541E] transition-colors disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </>
        )}
      </div>

      {/* Alt text field */}
      <div className="mt-auto pt-2 border-t border-[#E6DFCF]/60">
        <label className="block text-[11px] font-medium text-[#8a7060] mb-1">
          Describe this photo
        </label>
        <input
          type="text"
          value={altText}
          onChange={(e) => {
            setAltText(e.target.value)
            onAltChange(e.target.value)
          }}
          onBlur={handleAltBlur}
          placeholder="Used as alt text (optional)"
          className="w-full border border-[#E6DFCF] bg-white px-2.5 py-1.5 text-xs text-[#3B2418] placeholder-[#8a7060]/50 focus:outline-none focus:border-[#D9541E] transition-colors"
        />
      </div>
    </div>
  )
}
