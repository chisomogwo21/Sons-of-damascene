/**
 * Resizes and compresses an image file client-side before upload.
 * Outputs a WebP blob, max 1600px wide, quality 0.82.
 */
export async function resizeImage(file: File, maxWidth = 1600): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to compress image'))
        },
        'image/webp',
        0.82
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

/**
 * Uploads a product image to Supabase Storage and returns its public URL.
 */
export async function uploadProductImage(
  supabase: import('@supabase/supabase-js').SupabaseClient,
  file: File,
  productId: string
): Promise<string> {
  const blob = await resizeImage(file)
  const ext = 'webp'
  const path = `${productId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, blob, { contentType: 'image/webp', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}
