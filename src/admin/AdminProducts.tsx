import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  fetchAllProducts,
  deleteProduct,
  upsertProduct,
  type Product,
} from '../lib/queries'

export default function AdminProducts() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchAllProducts()
    setProducts(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function togglePublish(p: Product) {
    try {
      await upsertProduct({ id: p.id, is_published: !p.is_published })
      toast.success(t('admin.saved'))
      load()
    } catch {
      toast.error(t('admin.error'))
    }
  }

  async function toggleFeatured(p: Product) {
    try {
      await upsertProduct({ id: p.id, is_featured: !p.is_featured })
      toast.success(t('admin.saved'))
      load()
    } catch {
      toast.error(t('admin.error'))
    }
  }

  async function handleDelete(p: Product) {
    if (!confirm(t('admin.delete_confirm'))) return
    try {
      await deleteProduct(p.id)
      toast.success(t('admin.saved'))
      load()
    } catch {
      toast.error(t('admin.error'))
    }
  }

  const filtered = products.filter((p) =>
    p.name_en.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-xl font-normal text-[#3B2418]">{t('admin.products')}</h1>
        <Link
          to="/admin/products/new"
          className="bg-[#3B2418] text-white text-sm px-5 py-2.5 hover:bg-[#D9541E] transition-colors"
        >
          + {t('admin.add_product')}
        </Link>
      </div>

      <input
        type="search"
        placeholder={t('admin.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-[#E6DFCF] bg-white px-4 py-2.5 text-sm mb-6 focus:outline-none focus:border-[#D9541E]"
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-14 rounded" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-[#E6DFCF] border border-[#E6DFCF] bg-white">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal text-[#3B2418] truncate">{p.name_en}</p>
                <p className="text-xs text-[#8a7060]">{p.slug}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Published toggle */}
                <button
                  onClick={() => togglePublish(p)}
                  className={`text-xs px-3 py-1 border transition-colors ${
                    p.is_published
                      ? 'bg-[#4F7568] text-white border-[#4F7568]'
                      : 'text-[#8a7060] border-[#E6DFCF] hover:border-[#4F7568]'
                  }`}
                >
                  {p.is_published ? t('admin.unpublish') : t('admin.publish')}
                </button>
                {/* Featured toggle */}
                <button
                  onClick={() => toggleFeatured(p)}
                  className={`text-xs px-3 py-1 border transition-colors ${
                    p.is_featured
                      ? 'bg-[#D9541E] text-white border-[#D9541E]'
                      : 'text-[#8a7060] border-[#E6DFCF] hover:border-[#D9541E]'
                  }`}
                >
                  {p.is_featured ? t('admin.unfeature') : t('admin.feature')}
                </button>
                <Link
                  to={`/admin/products/${p.id}`}
                  className="text-xs px-3 py-1 border border-[#E6DFCF] hover:border-[#3B2418] transition-colors text-[#3B2418]"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p)}
                  className="text-xs px-3 py-1 border border-[#E6DFCF] hover:border-[#D9541E] hover:text-[#D9541E] transition-colors text-[#8a7060]"
                >
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-[#8a7060] text-center">No products found.</p>
          )}
        </div>
      )}
    </div>
  )
}
