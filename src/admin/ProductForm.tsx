import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import {
  fetchAllProducts,
  fetchCategories,
  upsertProduct,
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
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [priceOnRequest, setPriceOnRequest] = useState(false)

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
        ...form,
        slug: form.slug || slugify(form.name_en || ''),
        price_amount: priceOnRequest ? null : form.price_amount,
      }
      const saved = await upsertProduct(payload)
      toast.success(t('admin.saved'))
      if (isNew) navigate(`/admin/products/${saved.id}`, { replace: true })
    } catch (e: unknown) {
      toast.error(t('admin.error'))
    } finally {
      setSaving(false)
    }
  }

  const onDrop = useCallback(async (files: File[]) => {
    if (!form.id && isNew) {
      toast.error('Save the product first before uploading images.')
      return
    }
    setUploading(true)
    for (const file of files) {
      try {
        const url = await uploadProductImage(supabase, file, form.id!)
        const img = await addProductImage({
          product_id: form.id,
          url,
          sort_order: images.length,
          is_cover: images.length === 0,
        })
        setImages((prev) => [...prev, img])
      } catch {
        toast.error('Upload failed')
      }
    }
    setUploading(false)
  }, [form.id, images.length, isNew])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 8 * 1024 * 1024,
    disabled: isNew || !form.id,
  })

  async function handleDeleteImage(img: ProductImage) {
    try {
      await deleteProductImage(img.id)
      setImages((prev) => prev.filter((i) => i.id !== img.id))
      toast.success(t('admin.saved'))
    } catch {
      toast.error(t('admin.error'))
    }
  }

  async function handleSetCover(img: ProductImage) {
    if (!form.id) return
    try {
      await setCoverImage(form.id, img.id)
      setImages((prev) => prev.map((i) => ({ ...i, is_cover: i.id === img.id })))
      toast.success(t('admin.saved'))
    } catch {
      toast.error(t('admin.error'))
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
            } ${(isNew || !form.id) ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <p className="text-[#8a7060]">
              {uploading ? 'Uploading…' : t('admin.upload_images')}
            </p>
            <p className="text-xs text-[#b8a898] mt-1">JPG, PNG or WebP · max 8MB</p>
            <p className="text-xs text-[#8a7060] mt-1.5 italic font-normal">
              Best with a photo of the piece on a plain or transparent background.
            </p>
            {(isNew || !form.id) && (
              <p className="text-xs text-[#D9541E] mt-2">Save the product first</p>
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
