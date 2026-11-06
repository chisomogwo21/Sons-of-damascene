import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import {
  fetchAllProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  addProductImage,
  deleteProductImage,
  setCoverImage,
  type Product,
  type Category,
  type ProductImage,
} from '../lib/queries'
import { uploadProductImage } from '../lib/imageResize'
import { supabase } from '../lib/supabase'

type LangTab = 'en' | 'rw' | 'fr'

interface ErrorDetailResult {
  detail: string
  isJwtExpired: boolean
}

function parseErrorDetail(err: unknown): ErrorDetailResult {
  const e = err as {
    code?: string | number
    status?: string | number
    statusCode?: string | number
    message?: string
    error?: string | { message?: string }
    error_description?: string
    name?: string
  }

  const code = String(e?.code ?? e?.statusCode ?? e?.status ?? '').trim()
  let msg = ''
  if (typeof e?.message === 'string') {
    msg = e.message
  } else if (typeof e?.error === 'string') {
    msg = e.error
  } else if (typeof e?.error?.message === 'string') {
    msg = e.error.message
  } else if (typeof e?.error_description === 'string') {
    msg = e.error_description
  } else if (typeof err === 'string') {
    msg = err
  }
  const lowerMsg = msg.toLowerCase()

  // 1. JWT expired with redirect to login
  if (
    lowerMsg.includes('jwt expired') ||
    lowerMsg.includes('token expired') ||
    lowerMsg.includes('invalid jwt') ||
    code === 'PGRST301' ||
    (code === '401' && lowerMsg.includes('jwt'))
  ) {
    return {
      detail: 'Your session has expired. Redirecting to login...',
      isJwtExpired: true,
    }
  }

  // 2. Duplicate slug 23505
  if (
    code === '23505' ||
    lowerMsg.includes('23505') ||
    lowerMsg.includes('duplicate key') ||
    lowerMsg.includes('already exists')
  ) {
    return {
      detail: 'A product with this slug already exists. Please choose a different slug.',
      isJwtExpired: false,
    }
  }

  // 3. RLS 42501 / 401 / 403
  if (
    code === '42501' ||
    code === '401' ||
    code === '403' ||
    lowerMsg.includes('42501') ||
    lowerMsg.includes('row-level security') ||
    lowerMsg.includes('permission denied') ||
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('forbidden')
  ) {
    return {
      detail: 'Permission denied. Please check your admin privileges.',
      isJwtExpired: false,
    }
  }

  // 4. Network failure
  if (
    lowerMsg.includes('failed to fetch') ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('connection') ||
    e?.name === 'TypeError'
  ) {
    return {
      detail: 'Network connection failure. Please check your internet connection.',
      isJwtExpired: false,
    }
  }

  // 5. Storage upload errors
  if (
    lowerMsg.includes('storage') ||
    lowerMsg.includes('bucket') ||
    lowerMsg.includes('payload too large') ||
    lowerMsg.includes('entity too large') ||
    lowerMsg.includes('upload')
  ) {
    return {
      detail: 'Storage upload error. Please check the image file and storage bucket.',
      isJwtExpired: false,
    }
  }

  // 6. Otherwise shortened error message
  const fallback = msg ? (msg.length > 80 ? msg.slice(0, 80) + '…' : msg) : 'An unexpected error occurred.'
  return {
    detail: fallback,
    isJwtExpired: false,
  }
}

const EMPTY: Partial<Product> = {
  name_en: '', name_rw: '', name_fr: '',
  description_en: '', description_rw: '', description_fr: '',
  slug: '', wood_type: '', dimensions: '', lead_time_text: '',
  price_amount: null, currency: 'RWF',
  is_published: false, is_featured: false, sort_order: 0,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [tab, setTab] = useState<LangTab>('en')
  const [form, setForm] = useState<Partial<Product>>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [priceOnRequest, setPriceOnRequest] = useState(false)

  const showErrorToast = useCallback(
    (title: string, err: unknown) => {
      const { detail, isJwtExpired } = parseErrorDetail(err)
      toast.error(
        <div>
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-[#8a7060] mt-0.5">{detail}</div>
        </div>
      )
      if (isJwtExpired) {
        setTimeout(() => {
          navigate('/admin/login', { replace: true })
        }, 1200)
      }
    },
    [navigate]
  )

  useEffect(() => {
    fetchCategories().then(setCategories)
    if (!isNew) {
      fetchAllProducts().then((all: Product[]) => {
        const p = all.find((x: Product) => x.id === id)
        if (p) {
          setForm(p)
          setPriceOnRequest(p.price_amount === null)
          setImages(
            [...(p.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)
          )
        }
      })
    }
  }, [id, isNew])

  function set(k: keyof Product, v: unknown) {
    setForm((f: Partial<Product>) => ({ ...f, [k]: v }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload: Partial<Product> = {
        slug: form.slug?.trim() || slugify(form.name_en || ''),
        category_id: form.category_id || null,
        name_en: form.name_en || '',
        name_rw: form.name_rw || null,
        name_fr: form.name_fr || null,
        description_en: form.description_en || null,
        description_rw: form.description_rw || null,
        description_fr: form.description_fr || null,
        wood_type: form.wood_type || null,
        dimensions: form.dimensions || null,
        lead_time_text: form.lead_time_text || null,
        price_amount: priceOnRequest
          ? null
          : form.price_amount !== undefined && form.price_amount !== null && !isNaN(Number(form.price_amount))
            ? Number(form.price_amount)
            : null,
        currency: form.currency || 'RWF',
        is_published: Boolean(form.is_published),
        is_featured: Boolean(form.is_featured),
        sort_order: typeof form.sort_order === 'number' ? form.sort_order : 0,
      }

      let saved: Product
      if (isNew) {
        saved = await createProduct(payload)
      } else {
        saved = await updateProduct(id!, payload)
      }

      const savedProductId = saved.id

      if (pendingFiles.length > 0) {
        for (let i = 0; i < pendingFiles.length; i++) {
          const file = pendingFiles[i]
          let url: string
          try {
            url = await uploadProductImage(supabase, file, savedProductId)
          } catch (uploadErr) {
            console.error('upload image', uploadErr)
            showErrorToast('Upload failed', uploadErr)
            continue
          }

          try {
            const img = await addProductImage({
              product_id: savedProductId,
              url,
              alt_text: null,
              sort_order: images.length + i,
              is_cover: images.length === 0 && i === 0,
            })
            setImages((prev) => [...prev, img])
          } catch (recordErr) {
            console.error('save image record', recordErr)
            showErrorToast('Failed to save image record', recordErr)
          }
        }
        setPendingFiles([])
      }

      setForm((prev) => ({
        ...prev,
        ...payload,
        id: savedProductId,
      }))

      toast.success(t('admin.saved'))
      if (isNew) navigate(`/admin/products/${savedProductId}`, { replace: true })
    } catch (e: unknown) {
      console.error('save product', e)
      showErrorToast(t('admin.error'), e)
    } finally {
      setSaving(false)
    }
  }

  const onDrop = useCallback(
    async (files: File[]) => {
      const currentProductId = form.id || (isNew ? null : id)
      if (!currentProductId) {
        setPendingFiles((prev) => [...prev, ...files])
        return
      }
      setUploading(true)
      for (const file of files) {
        let url: string
        try {
          url = await uploadProductImage(supabase, file, currentProductId)
        } catch (uploadErr) {
          console.error('upload image', uploadErr)
          showErrorToast('Upload failed', uploadErr)
          continue
        }

        try {
          const img = await addProductImage({
            product_id: currentProductId,
            url,
            alt_text: null,
            sort_order: images.length,
            is_cover: images.length === 0,
          })
          setImages((prev) => [...prev, img])
        } catch (recordErr) {
          console.error('save image record', recordErr)
          showErrorToast('Failed to save image record', recordErr)
        }
      }
      setUploading(false)
    },
    [form.id, id, isNew, images.length, showErrorToast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 8 * 1024 * 1024,
  })

  async function handleDeleteImage(img: ProductImage) {
    try {
      await deleteProductImage(img.id)
      setImages((prev) => prev.filter((i) => i.id !== img.id))
      toast.success(t('admin.saved'))
    } catch (err) {
      console.error('save image record', err)
      showErrorToast(t('admin.error'), err)
    }
  }

  async function handleSetCover(img: ProductImage) {
    const currentProductId = form.id || id
    if (!currentProductId) return
    try {
      await setCoverImage(currentProductId, img.id)
      setImages((prev) => prev.map((i) => ({ ...i, is_cover: i.id === img.id })))
      toast.success(t('admin.saved'))
    } catch (err) {
      console.error('save image record', err)
      showErrorToast(t('admin.error'), err)
    }
  }

  const inputCls =
    'w-full border border-[#E6DFCF] bg-white px-3 py-2.5 text-sm text-[#3B2418] focus:outline-none focus:border-[#D9541E] transition-colors'

  const LANG_TABS: LangTab[] = ['en', 'rw', 'fr']

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-sm text-[#8a7060] hover:text-[#3B2418]"
        >
          ← Back
        </button>
        <h1 className="text-xl font-normal text-[#3B2418]">
          {isNew ? t('admin.add_product') : t('admin.edit_product')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: form fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language tabs */}
          <div className="flex border-b border-[#E6DFCF]">
            {LANG_TABS.map((l) => (
              <button
                key={l}
                onClick={() => setTab(l)}
                className={`px-5 py-2.5 text-sm border-b-2 transition-colors ${
                  tab === l
                    ? 'border-[#D9541E] text-[#D9541E] font-normal'
                    : 'border-transparent text-[#8a7060] hover:text-[#3B2418]'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Name & description per language */}
          {LANG_TABS.map((l) => (
            <div key={l} className={l !== tab ? 'hidden' : 'space-y-4'}>
              <div>
                <label className="block text-xs text-[#8a7060] mb-1">
                  Name ({l.toUpperCase()}) {l === 'en' && '*'}
                </label>
                <input
                  value={(form[`name_${l}` as keyof Product] as string) || ''}
                  onChange={(e) => {
                    set(`name_${l}` as keyof Product, e.target.value)
                    if (l === 'en' && isNew) set('slug', slugify(e.target.value))
                  }}
                  required={l === 'en'}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-[#8a7060] mb-1">
                  Description ({l.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  value={(form[`description_${l}` as keyof Product] as string) || ''}
                  onChange={(e) => set(`description_${l}` as keyof Product, e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          ))}

          {/* Shared fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Slug *</label>
              <input value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Category</label>
              <select
                value={form.category_id || ''}
                onChange={(e) => set('category_id', e.target.value || null)}
                className={inputCls}
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Wood type</label>
              <input value={form.wood_type || ''} onChange={(e) => set('wood_type', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Dimensions</label>
              <input value={form.dimensions || ''} onChange={(e) => set('dimensions', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Lead time</label>
              <input value={form.lead_time_text || ''} onChange={(e) => set('lead_time_text', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Sort order</label>
              <input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => set('sort_order', Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={priceOnRequest}
                onChange={(e) => setPriceOnRequest(e.target.checked)}
                className="accent-[#D9541E]"
              />
              Price on request (hide price)
            </label>
            {!priceOnRequest && (
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={form.price_amount ?? ''}
                  onChange={(e) => set('price_amount', e.target.value ? Number(e.target.value) : null)}
                  className={`${inputCls} flex-1`}
                />
                <input
                  value={form.currency || 'RWF'}
                  onChange={(e) => set('currency', e.target.value)}
                  className={`${inputCls} w-24`}
                />
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.is_published}
                onChange={(e) => set('is_published', e.target.checked)}
                className="accent-[#4F7568]"
              />
              {t('admin.publish')}
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)}
                className="accent-[#D9541E]"
              />
              {t('admin.feature')}
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#3B2418] text-white px-8 py-3 text-sm font-normal hover:bg-[#D9541E] transition-colors disabled:opacity-50"
          >
            {saving ? '…' : t('admin.save')}
          </button>
        </div>

        {/* Right: images */}
        <div className="space-y-4">
          <h2 className="text-sm font-normal text-[#3B2418]">Images</h2>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 text-center text-sm cursor-pointer transition-colors ${
              isDragActive
                ? 'border-[#D9541E] bg-[#fff8f5]'
                : 'border-[#E6DFCF] hover:border-[#3B2418]'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-[#8a7060]">
              {uploading ? 'Uploading…' : t('admin.upload_images')}
            </p>
            <p className="text-xs text-[#b8a898] mt-1">JPG, PNG or WebP · max 8MB</p>
            <p className="text-xs text-[#8a7060] mt-1.5 italic font-normal">
              Best with a photo of the piece on a plain or transparent background.
            </p>
            {pendingFiles.length > 0 && (
              <p className="text-xs text-[#D9541E] mt-2 font-normal">
                {pendingFiles.length} {pendingFiles.length === 1 ? 'image' : 'images'} queued (will upload on save)
              </p>
            )}
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-2 gap-2">
            {images.map((img) => (
              <div key={img.id} className="relative group border border-[#E6DFCF] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt_text || ''}
                  className="w-full aspect-square object-cover"
                />
                {img.is_cover && (
                  <span className="absolute top-1 left-1 bg-[#D9541E] text-white text-[10px] px-1.5 py-0.5">
                    {t('admin.cover')}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {!img.is_cover && (
                    <button
                      onClick={() => handleSetCover(img)}
                      className="w-full text-[10px] bg-white text-[#3B2418] py-1 px-2 hover:bg-[#D9541E] hover:text-white transition-colors"
                    >
                      {t('admin.set_cover')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img)}
                    className="w-full text-[10px] bg-white text-[#D9541E] py-1 px-2 hover:bg-[#D9541E] hover:text-white transition-colors"
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
