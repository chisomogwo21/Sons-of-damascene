import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { fetchSiteSettings, upsertSetting, type SiteSettings } from '../lib/queries'
import { supabase } from '../lib/supabase'
import SiteImageSlot from './SiteImageSlot'

const SETTINGS_FIELDS = [
  { key: 'whatsapp_number', label: 'WhatsApp number', type: 'text' },
  { key: 'contact_phone', label: 'Phone number', type: 'text' },
  { key: 'contact_email', label: 'Contact email', type: 'email' },
  { key: 'address', label: 'Workshop address', type: 'text' },
  { key: 'hours', label: 'Opening hours', type: 'text' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
  { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
]

export default function SettingsForm() {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<SiteSettings>({})
  const [saving, setSaving] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)

  useEffect(() => {
    fetchSiteSettings().then(setSettings)
  }, [])

  function set(k: string, v: string) {
    setSettings((s: SiteSettings) => ({ ...s, [k]: v }))
  }

  const rawOpacity = settings.hero_overlay_opacity
  const currentOpacity = (() => {
    if (rawOpacity === undefined || rawOpacity === null || rawOpacity === '') return 25
    const n = parseInt(rawOpacity, 10)
    if (isNaN(n)) return 25
    return Math.min(60, Math.max(0, n))
  })()

  async function commitOpacity(val: string) {
    try {
      await upsertSetting('hero_overlay_opacity', val)
      toast.success('Darkness setting saved', { id: 'hero-darkness' })
    } catch (err) {
      console.error(err)
      toast.error('Failed to save darkness setting')
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      for (const f of SETTINGS_FIELDS) {
        await upsertSetting(f.key, settings[f.key] || '')
      }
      if (settings.hero_overlay_opacity !== undefined) {
        await upsertSetting('hero_overlay_opacity', settings.hero_overlay_opacity)
      }
      toast.success(t('admin.saved'))
    } catch {
      toast.error(t('admin.error'))
    } finally {
      setSaving(false)
    }
  }

  async function uploadAsset(file: File, settingKey: string, onStart: () => void, onEnd: () => void) {
    onStart()
    const path = `hero/${settingKey}-${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (error) { toast.error('Upload failed'); onEnd(); return }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    await upsertSetting(settingKey, data.publicUrl)
    setSettings((s: SiteSettings) => ({ ...s, [settingKey]: data.publicUrl }))
    toast.success('Uploaded!')
    onEnd()
  }

  const { getRootProps: vRoot, getInputProps: vInput } = useDropzone({
    accept: { 'video/*': ['.mp4', '.webm', '.mov'] },
    maxFiles: 1,
    onDrop: (files: File[]) => {
      if (files[0]) {
        uploadAsset(
          files[0], 'hero_video_url',
          () => setUploadingVideo(true),
          () => setUploadingVideo(false)
        )
      }
    },
  })

  const { getRootProps: pRoot, getInputProps: pInput } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: (files: File[]) => {
      if (files[0]) {
        uploadAsset(
          files[0], 'hero_poster_url',
          () => setUploadingPoster(true),
          () => setUploadingPoster(false)
        )
      }
    },
  })

  const inputCls =
    'w-full border border-[#E6DFCF] bg-white px-3 py-2.5 text-sm text-[#3B2418] focus:outline-none focus:border-[#D9541E] transition-colors'

  return (
    <div>
      <h1 className="text-xl font-normal text-[#3B2418] mb-8">{t('admin.settings')}</h1>

      {/* Hero media */}
      <div className="border border-[#E6DFCF] bg-white p-6 mb-8 space-y-6">
        <h2 className="text-sm font-normal text-[#3B2418]">Hero Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-[#8a7060] mb-2">Hero video (MP4 / WebM)</p>
            <div
              {...vRoot()}
              className="border-2 border-dashed border-[#E6DFCF] hover:border-[#D9541E] p-6 text-center text-sm cursor-pointer transition-colors"
            >
              <input {...vInput()} />
              <p className="text-[#8a7060]">{uploadingVideo ? 'Uploading…' : 'Drop video or click'}</p>
            </div>
            {settings.hero_video_url && (
              <p className="text-xs text-[#4F7568] mt-2 truncate">✓ {settings.hero_video_url}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-[#8a7060] mb-2">Hero poster / fallback image</p>
            <div
              {...pRoot()}
              className="border-2 border-dashed border-[#E6DFCF] hover:border-[#D9541E] p-6 text-center text-sm cursor-pointer transition-colors"
            >
              <input {...pInput()} />
              <p className="text-[#8a7060]">{uploadingPoster ? 'Uploading…' : 'Drop image or click'}</p>
            </div>
            {settings.hero_poster_url && (
              <p className="text-xs text-[#4F7568] mt-2 truncate">✓ {settings.hero_poster_url}</p>
            )}
          </div>
        </div>

        {/* Darkness slider & live preview strip */}
        <div className="pt-4 border-t border-[#E6DFCF] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="hero-overlay-darkness"
                className="text-xs font-normal text-[#3B2418] block"
              >
                Darkness over the video
              </label>
              <p className="text-xs text-[#8a7060] mt-0.5">
                Increase this if the headline is hard to read.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-[#FBF6EA] border border-[#E6DFCF] text-xs font-normal text-[#3B2418] rounded font-mono">
                {currentOpacity}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8a7060] font-mono">0%</span>
            <input
              id="hero-overlay-darkness"
              type="range"
              min={0}
              max={60}
              step={5}
              value={currentOpacity}
              onChange={(e) => set('hero_overlay_opacity', e.target.value)}
              onPointerUp={(e) => commitOpacity(e.currentTarget.value)}
              onTouchEnd={(e) => commitOpacity(e.currentTarget.value)}
              onKeyUp={(e) => commitOpacity(e.currentTarget.value)}
              className="flex-1 h-2 bg-[#E6DFCF] rounded-lg appearance-none cursor-pointer accent-[#D9541E]"
              aria-label="Darkness over the video"
            />
            <span className="text-xs text-[#8a7060] font-mono">60%</span>
          </div>

          {/* Live preview strip showing the poster or video frame under the chosen darkness */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-normal text-[#8a7060] uppercase tracking-wider">
              Live Preview Strip
            </p>
            <div
              className="relative w-full h-24 sm:h-28 rounded overflow-hidden border border-[#E6DFCF] flex items-center px-6"
              style={{
                backgroundColor: '#3B2418',
              }}
            >
              {/* Media layer */}
              {settings.hero_poster_url ? (
                <img
                  src={settings.hero_poster_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : settings.hero_video_url ? (
                <video
                  src={settings.hero_video_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                  autoPlay
                  loop
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(120deg, #3B2418 0%, #6b3c22 35%, #a0622a 65%, #c8833a 100%)',
                  }}
                />
              )}

              {/* Darkness overlay */}
              <div
                className="absolute inset-0 transition-colors duration-150 pointer-events-none"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${currentOpacity / 100})`,
                }}
              />

              {/* Sample headline showing readability */}
              <div className="relative z-10">
                <p
                  className="text-white font-normal text-lg sm:text-xl tracking-tight leading-snug"
                  style={{ textShadow: '0 1px 24px rgba(0,0,0,0.25)' }}
                >
                  Handcrafted from Rwandan timber
                </p>
                <p
                  className="text-white/80 text-xs mt-0.5"
                  style={{ textShadow: '0 1px 24px rgba(0,0,0,0.25)' }}
                >
                  Hero headline contrast preview ({currentOpacity}% darkness)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Site images */}
      <div className="border border-[#E6DFCF] bg-white p-6 mb-8 space-y-8">
        <div>
          <h2 className="text-sm font-normal text-[#3B2418]">Site images</h2>
          <p className="text-xs text-[#8a7060] mt-1">
            Replace placeholder photos across public pages. Images are compressed in your browser before upload.
          </p>
        </div>

        {/* a) Homepage collage */}
        <div className="space-y-3">
          <h3 className="text-xs font-normal uppercase tracking-wider text-[#8a7060] pb-1 border-b border-[#E6DFCF]">
            Homepage collage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SiteImageSlot
              title="Collage: workshop"
              subtitle="The photo above the yellow panel"
              urlKey="collage_workshop_url"
              altKey="collage_workshop_alt"
              currentUrl={settings.collage_workshop_url}
              currentAlt={settings.collage_workshop_alt}
              sizeHint="Square photo, at least 1200px wide"
              aspectRatioClass="aspect-square"
              maxWidth={1600}
              onUrlChange={(url) => set('collage_workshop_url', url)}
              onAltChange={(alt) => set('collage_workshop_alt', alt)}
            />
            <SiteImageSlot
              title="Collage: materials"
              subtitle="The photo in the oak panel"
              urlKey="collage_materials_url"
              altKey="collage_materials_alt"
              currentUrl={settings.collage_materials_url}
              currentAlt={settings.collage_materials_alt}
              sizeHint="Square photo, at least 1200px wide"
              aspectRatioClass="aspect-square"
              maxWidth={1600}
              onUrlChange={(url) => set('collage_materials_url', url)}
              onAltChange={(alt) => set('collage_materials_alt', alt)}
            />
            <SiteImageSlot
              title="Collage: finish"
              subtitle="The photo in the walnut panel"
              urlKey="collage_finish_url"
              altKey="collage_finish_alt"
              currentUrl={settings.collage_finish_url}
              currentAlt={settings.collage_finish_alt}
              sizeHint="Square photo, at least 1200px wide"
              aspectRatioClass="aspect-square"
              maxWidth={1600}
              onUrlChange={(url) => set('collage_finish_url', url)}
              onAltChange={(alt) => set('collage_finish_alt', alt)}
            />
          </div>
        </div>

        {/* b) Homepage banner */}
        <div className="space-y-3">
          <h3 className="text-xs font-normal uppercase tracking-wider text-[#8a7060] pb-1 border-b border-[#E6DFCF]">
            Homepage banner
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SiteImageSlot
              title="Banner image"
              subtitle="The wide photo with the headline over it"
              urlKey="banner_image_url"
              altKey="banner_image_alt"
              currentUrl={settings.banner_image_url}
              currentAlt={settings.banner_image_alt}
              sizeHint="Wide 2:1 photo, about 2400 x 1200px"
              aspectRatioClass="aspect-[2/1]"
              maxWidth={2400}
              onUrlChange={(url) => set('banner_image_url', url)}
              onAltChange={(alt) => set('banner_image_alt', alt)}
            />
          </div>
        </div>

        {/* c) About page */}
        <div className="space-y-3">
          <h3 className="text-xs font-normal uppercase tracking-wider text-[#8a7060] pb-1 border-b border-[#E6DFCF]">
            About page
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <SiteImageSlot
              title="About page banner"
              subtitle="The wide photo across the About page"
              urlKey="about_banner_url"
              altKey="about_banner_alt"
              currentUrl={settings.about_banner_url}
              currentAlt={settings.about_banner_alt}
              sizeHint="Wide photo, about 2400 x 800px"
              aspectRatioClass="aspect-[16/5]"
              maxWidth={2400}
              onUrlChange={(url) => set('about_banner_url', url)}
              onAltChange={(alt) => set('about_banner_alt', alt)}
            />
          </div>

          <h4 className="text-xs font-normal text-[#8a7060] pt-2">
            About page process steps
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SiteImageSlot
              title="Process: 01 Design"
              urlKey="about_process_1_url"
              altKey="about_process_1_alt"
              currentUrl={settings.about_process_1_url}
              currentAlt={settings.about_process_1_alt}
              sizeHint="Square photo, at least 800px wide"
              aspectRatioClass="aspect-square"
              maxWidth={1600}
              onUrlChange={(url) => set('about_process_1_url', url)}
              onAltChange={(alt) => set('about_process_1_alt', alt)}
            />
            <SiteImageSlot
              title="Process: 02 Craft"
              urlKey="about_process_2_url"
              altKey="about_process_2_alt"
              currentUrl={settings.about_process_2_url}
              currentAlt={settings.about_process_2_alt}
              sizeHint="Square photo, at least 800px wide"
              aspectRatioClass="aspect-square"
              maxWidth={1600}
              onUrlChange={(url) => set('about_process_2_url', url)}
              onAltChange={(alt) => set('about_process_2_alt', alt)}
            />
            <SiteImageSlot
              title="Process: 03 Finish"
              urlKey="about_process_3_url"
              altKey="about_process_3_alt"
              currentUrl={settings.about_process_3_url}
              currentAlt={settings.about_process_3_alt}
              sizeHint="Square photo, at least 800px wide"
              aspectRatioClass="aspect-square"
              maxWidth={1600}
              onUrlChange={(url) => set('about_process_3_url', url)}
              onAltChange={(alt) => set('about_process_3_alt', alt)}
            />
            <SiteImageSlot
              title="Process: 04 Deliver"
              urlKey="about_process_4_url"
              altKey="about_process_4_alt"
              currentUrl={settings.about_process_4_url}
              currentAlt={settings.about_process_4_alt}
              sizeHint="Square photo, at least 800px wide"
              aspectRatioClass="aspect-square"
              maxWidth={1600}
              onUrlChange={(url) => set('about_process_4_url', url)}
              onAltChange={(alt) => set('about_process_4_alt', alt)}
            />
          </div>
        </div>

        {/* d) Our Craftsman page */}
        <div className="space-y-3">
          <h3 className="text-xs font-normal uppercase tracking-wider text-[#8a7060] pb-1 border-b border-[#E6DFCF]">
            Our Craftsman page
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SiteImageSlot
              title="Craftsman portrait"
              subtitle="Portrait photo in the introduction"
              urlKey="craftsman_portrait_url"
              altKey="craftsman_portrait_alt"
              currentUrl={settings.craftsman_portrait_url}
              currentAlt={settings.craftsman_portrait_alt}
              sizeHint="Portrait photo, at least 1000px tall"
              aspectRatioClass="aspect-[3/4]"
              maxWidth={1600}
              onUrlChange={(url) => set('craftsman_portrait_url', url)}
              onAltChange={(alt) => set('craftsman_portrait_alt', alt)}
            />
            <SiteImageSlot
              title="Craftsman process photo"
              subtitle="Workshop photo in tools & approach"
              urlKey="craftsman_process_url"
              altKey="craftsman_process_alt"
              currentUrl={settings.craftsman_process_url}
              currentAlt={settings.craftsman_process_alt}
              sizeHint="Landscape 4:3 photo, at least 1200px wide"
              aspectRatioClass="aspect-[4/3]"
              maxWidth={1600}
              onUrlChange={(url) => set('craftsman_process_url', url)}
              onAltChange={(alt) => set('craftsman_process_alt', alt)}
            />
            <SiteImageSlot
              title="Craftsman tools photo"
              subtitle="Hand tools photo in tools & approach"
              urlKey="craftsman_tools_url"
              altKey="craftsman_tools_alt"
              currentUrl={settings.craftsman_tools_url}
              currentAlt={settings.craftsman_tools_alt}
              sizeHint="Landscape 4:3 photo, at least 1200px wide"
              aspectRatioClass="aspect-[4/3]"
              maxWidth={1600}
              onUrlChange={(url) => set('craftsman_tools_url', url)}
              onAltChange={(alt) => set('craftsman_tools_alt', alt)}
            />
          </div>
        </div>
      </div>

      {/* Other settings */}
      <form onSubmit={save} className="border border-[#E6DFCF] bg-white p-6 space-y-4">
        <h2 className="text-sm font-normal text-[#3B2418] mb-4">Site settings</h2>
        {SETTINGS_FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-[#8a7060] mb-1">{f.label}</label>
            <input
              type={f.type}
              value={settings[f.key] || ''}
              onChange={(e) => set(f.key, e.target.value)}
              className={inputCls}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#3B2418] text-white px-8 py-3 text-sm font-normal hover:bg-[#D9541E] transition-colors disabled:opacity-50 mt-4"
        >
          {saving ? '…' : t('admin.save')}
        </button>
      </form>
    </div>
  )
}
