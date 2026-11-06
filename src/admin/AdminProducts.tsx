import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import {
  fetchAllProducts,
  deleteProduct,
  upsertProduct,
  checkDeploymentStatus,
  type Product,
  type DeploymentStatus,
} from '../lib/queries'

function formatLastUpdated(iso: string | null): string {
  if (!iso) return 'Not available'
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function AdminProducts() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(true)
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    lastDeployedAt: null,
    pendingChanges: 0,
  })

  const load = useCallback(async () => {
    setLoading(true)
    const [productsData, depStatus] = await Promise.all([
      fetchAllProducts(),
      checkDeploymentStatus(),
    ])
    setProducts(productsData)
    setDeploymentStatus(depStatus)
    setLoading(false)
    setStatusLoading(false)
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
      {/* Deployment Status Bar */}
      <div className="mb-6 border border-[#E6DFCF] bg-white p-4 text-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                statusLoading
                  ? 'bg-[#8a7060]'
                  : deploymentStatus.pendingChanges > 0
                  ? 'bg-[#D9541E]'
                  : 'bg-[#4F7568]'
              }`}
            />
            <span className="font-normal text-[#3B2418]">
              Live site last updated:{' '}
              <span className="font-medium">
                {statusLoading ? 'Checking…' : formatLastUpdated(deploymentStatus.lastDeployedAt)}
              </span>
            </span>
          </div>

          {!statusLoading && (
            <div>
              {deploymentStatus.pendingChanges > 0 ? (
                <p className="text-xs text-[#8a7060]">
                  <span className="text-[#D9541E] font-medium">
                    {deploymentStatus.pendingChanges}{' '}
                    {deploymentStatus.pendingChanges === 1 ? 'change' : 'changes'} not live yet.
                  </span>{' '}
                  Changes go live at the next hourly update, or run it now.
                </p>
              ) : (
                <p className="text-xs text-[#4F7568] font-medium">
                  Everything is live.
                </p>
              )}
            </div>
          )}
        </div>

        {!statusLoading && deploymentStatus.pendingChanges > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <a
              href="https://github.com/chisomogwo21/Sons-of-damascene/actions/workflows/deploy.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#D9541E] hover:bg-[#3B2418] text-white text-xs px-3.5 py-2 transition-colors font-medium whitespace-nowrap"
            >
              Publish now ↗
            </a>
            <span className="text-[11px] text-[#8a7060]">
              Tip: Run workflow, then wait about 2 minutes.
            </span>
          </div>
        )}
      </div>

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
