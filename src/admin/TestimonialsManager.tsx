import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  fetchAllTestimonials,
  upsertTestimonial,
  deleteTestimonial,
  type Testimonial,
} from '../lib/queries'

const EMPTY: Partial<Testimonial> = {
  author_name: '', author_location: '',
  quote_en: '', quote_rw: '', quote_fr: '',
  is_published: false, sort_order: 0,
}

type LangTab = 'en' | 'rw' | 'fr'

export default function TestimonialsManager() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Testimonial[]>([])
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null)
  const [tab, setTab] = useState<LangTab>('en')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const data = await fetchAllTestimonials()
    setItems(data)
  }, [])

  useEffect(() => { load() }, [load])

  function startAdd() { setEditing({ ...EMPTY }); setTab('en') }
  function startEdit(item: Testimonial) { setEditing({ ...item }); setTab('en') }
  function cancelEdit() { setEditing(null) }

  function set(k: keyof Testimonial, v: unknown) {
    setEditing((prev: Partial<Testimonial> | null) => prev ? { ...prev, [k]: v } : prev)
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      await upsertTestimonial(editing)
      toast.success(t('admin.saved'))
      setEditing(null)
      load()
    } catch {
      toast.error(t('admin.error'))
    } finally {
      setSaving(false)
    }
  }

  async function handleTogglePublish(item: Testimonial) {
    try {
      await upsertTestimonial({ id: item.id, is_published: !item.is_published })
      toast.success(t('admin.saved'))
      load()
    } catch {
      toast.error(t('admin.error'))
    }
  }

  async function handleDelete(item: Testimonial) {
    if (!confirm(t('admin.delete_confirm'))) return
    try {
      await deleteTestimonial(item.id)
      toast.success(t('admin.saved'))
      load()
    } catch {
      toast.error(t('admin.error'))
    }
  }

  const inputCls =
    'w-full border border-[#E6DFCF] bg-white px-3 py-2.5 text-sm text-[#3B2418] focus:outline-none focus:border-[#D9541E] transition-colors'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-[#3B2418]">{t('admin.testimonials')}</h1>
        {!editing && (
          <button
            onClick={startAdd}
            className="bg-[#3B2418] text-white text-sm px-5 py-2.5 hover:bg-[#D9541E] transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {editing && (
        <div className="border border-[#E6DFCF] bg-white p-6 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Author name *</label>
              <input
                value={editing.author_name || ''}
                onChange={(e) => set('author_name', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs text-[#8a7060] mb-1">Location</label>
              <input
                value={editing.author_location || ''}
                onChange={(e) => set('author_location', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          {/* Language tabs */}
          <div className="flex border-b border-[#E6DFCF]">
            {(['en', 'rw', 'fr'] as LangTab[]).map((l) => (
              <button
                key={l}
                onClick={() => setTab(l)}
                className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                  tab === l ? 'border-[#D9541E] text-[#D9541E]' : 'border-transparent text-[#8a7060]'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {(['en', 'rw', 'fr'] as LangTab[]).map((l) => (
            <div key={l} className={l !== tab ? 'hidden' : ''}>
              <label className="block text-xs text-[#8a7060] mb-1">
                Quote ({l.toUpperCase()}) {l === 'en' && '*'}
              </label>
              <textarea
                rows={3}
                value={(editing[`quote_${l}` as keyof Testimonial] as string) || ''}
                onChange={(e) => set(`quote_${l}` as keyof Testimonial, e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>
          ))}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!editing.is_published}
                onChange={(e) => set('is_published', e.target.checked)}
                className="accent-[#4F7568]"
              />
              {t('admin.publish')}
            </label>
            <input
              type="number"
              placeholder="Sort order"
              value={editing.sort_order ?? 0}
              onChange={(e) => set('sort_order', Number(e.target.value))}
              className="border border-[#E6DFCF] px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-[#D9541E]"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#3B2418] text-white px-6 py-2.5 text-sm hover:bg-[#D9541E] transition-colors disabled:opacity-50"
            >
              {saving ? '…' : t('admin.save')}
            </button>
            <button
              onClick={cancelEdit}
              className="px-6 py-2.5 text-sm border border-[#E6DFCF] hover:border-[#3B2418] transition-colors"
            >
              {t('admin.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-[#E6DFCF] border border-[#E6DFCF] bg-white">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-4 flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#3B2418]">{item.author_name}</p>
              {item.author_location && (
                <p className="text-xs text-[#8a7060]">{item.author_location}</p>
              )}
              <p className="text-xs text-[#5c4434] mt-1 line-clamp-2">"{item.quote_en}"</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleTogglePublish(item)}
                className={`text-xs px-3 py-1 border transition-colors ${
                  item.is_published
                    ? 'bg-[#4F7568] text-white border-[#4F7568]'
                    : 'text-[#8a7060] border-[#E6DFCF]'
                }`}
              >
                {item.is_published ? t('admin.unpublish') : t('admin.publish')}
              </button>
              <button
                onClick={() => startEdit(item)}
                className="text-xs px-3 py-1 border border-[#E6DFCF] hover:border-[#3B2418] transition-colors text-[#3B2418]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="text-xs px-3 py-1 border border-[#E6DFCF] hover:border-[#D9541E] hover:text-[#D9541E] transition-colors text-[#8a7060]"
              >
                {t('admin.delete')}
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="px-4 py-6 text-sm text-[#8a7060] text-center">No testimonials yet.</p>
        )}
      </div>
    </div>
  )
}
