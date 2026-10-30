import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to load .env if present and environment variables are not set
function loadEnvFile() {
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn('[export-content] Warning loading .env file:', e.message);
    }
  }
}

loadEnvFile();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[export-content] ERROR: Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mediaDir = path.join(rootDir, 'public', 'media');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

function getFileExtension(urlString, contentType = '') {
  try {
    const parsed = new URL(urlString);
    const ext = path.extname(parsed.pathname).toLowerCase();
    if (ext && ext.length >= 2 && ext.length <= 6) {
      return ext;
    }
  } catch {}

  const ct = (contentType || '').toLowerCase();
  if (ct.includes('video/mp4')) return '.mp4';
  if (ct.includes('video/webm')) return '.webm';
  if (ct.includes('image/webp')) return '.webp';
  if (ct.includes('image/png')) return '.png';
  if (ct.includes('image/jpeg') || ct.includes('image/jpg')) return '.jpeg';
  if (ct.includes('image/svg')) return '.svg';
  if (ct.includes('image/gif')) return '.gif';
  if (ct.includes('image/avif')) return '.avif';
  return '.bin';
}

function isMediaUrl(key, urlString) {
  if (!urlString || typeof urlString !== 'string') return false;
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) return false;

  const socialKeys = ['instagram_url', 'facebook_url', 'twitter_url', 'linkedin_url', 'youtube_url'];
  if (socialKeys.includes(key)) return false;

  const mediaExtensions = ['.mp4', '.webm', '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif'];
  const hasMediaExt = mediaExtensions.some((ext) => urlString.toLowerCase().includes(ext));
  const isStorageUrl = urlString.includes('/storage/v1/object/public/');

  const knownMediaKeys = [
    'hero_video_url',
    'hero_poster_url',
    'banner_image_url',
    'collage_materials_url',
    'collage_workshop_url',
    'collage_finish_url',
    'about_banner_url',
    'about_process_1_url',
    'about_process_2_url',
    'about_process_3_url',
    'about_process_4_url',
    'craftsman_portrait_url',
    'craftsman_process_url',
    'craftsman_tools_url',
  ];

  return hasMediaExt || isStorageUrl || knownMediaKeys.includes(key);
}

// Media cache map: originalUrl -> relativePath (e.g. "media/hash.ext")
const mediaMap = new Map();
let downloadedCount = 0;
let skippedCount = 0;

async function downloadMedia(sourceUrl) {
  if (!sourceUrl || typeof sourceUrl !== 'string') return sourceUrl;
  if (mediaMap.has(sourceUrl)) {
    return mediaMap.get(sourceUrl);
  }

  // Derive stable hash from source URL
  const hash = crypto.createHash('sha256').update(sourceUrl).digest('hex').slice(0, 16);

  // Initial guess at extension from URL
  let ext = getFileExtension(sourceUrl);
  let filename = `${hash}${ext}`;
  let targetPath = path.join(mediaDir, filename);

  // Check if file already exists
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 0) {
    const relPath = `media/${filename}`;
    mediaMap.set(sourceUrl, relPath);
    skippedCount++;
    return relPath;
  }

  console.log(`[export-content] Downloading media: ${sourceUrl}`);
  let response;
  try {
    response = await fetch(sourceUrl);
  } catch (err) {
    console.error(`[export-content] ERROR: Network error downloading ${sourceUrl}:`, err.message);
    process.exit(1);
  }

  if (response.status === 404 || response.status === 400) {
    const text = await response.text();
    if (response.status === 404 || text.includes('not_found') || text.includes('NoSuchKey')) {
      console.warn(`[export-content] WARNING: Media object not found on storage (404): ${sourceUrl}. Setting to null.`);
      mediaMap.set(sourceUrl, null);
      return null;
    }
    console.error(`[export-content] ERROR: HTTP ${response.status} ${response.statusText} for ${sourceUrl}: ${text}`);
    process.exit(1);
  }

  if (!response.ok) {
    console.error(`[export-content] ERROR: HTTP ${response.status} ${response.statusText} for ${sourceUrl}`);
    process.exit(1);
  }

  const contentType = response.headers.get('content-type') || '';
  if (ext === '.bin' || !ext) {
    ext = getFileExtension(sourceUrl, contentType);
    filename = `${hash}${ext}`;
    targetPath = path.join(mediaDir, filename);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetPath, buffer);

  downloadedCount++;
  const relPath = `media/${filename}`;
  mediaMap.set(sourceUrl, relPath);
  return relPath;
}

async function exportContent() {
  console.log('[export-content] Starting export from Supabase at:', supabaseUrl);

  // 1. Fetch products
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select(`
      *,
      product_images(*),
      categories(*)
    `)
    .eq('is_published', true)
    .order('sort_order');

  if (prodErr) {
    console.error('[export-content] ERROR: Failed to fetch products:', prodErr);
    process.exit(1);
  }

  // 2. Fetch categories
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  if (catErr) {
    console.error('[export-content] ERROR: Failed to fetch categories:', catErr);
    process.exit(1);
  }

  // 3. Fetch testimonials
  const { data: testimonials, error: testErr } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');

  if (testErr) {
    console.error('[export-content] ERROR: Failed to fetch testimonials:', testErr);
    process.exit(1);
  }

  // 4. Fetch site settings
  const { data: settingsRows, error: setErr } = await supabase
    .from('site_settings')
    .select('*');

  if (setErr) {
    console.error('[export-content] ERROR: Failed to fetch site_settings:', setErr);
    process.exit(1);
  }

  // Safety check: zero products and zero categories
  if ((!products || products.length === 0) && (!categories || categories.length === 0)) {
    console.error('[export-content] SAFETY CHECK FAILED: Supabase returned 0 products and 0 categories. Exiting to keep previous live deployment active.');
    process.exit(1);
  }

  // Transform settings rows into key-value map
  const settings = {};
  for (const row of settingsRows || []) {
    settings[row.key] = row.value;
  }

  // Download and rewrite product images
  for (const prod of products || []) {
    if (Array.isArray(prod.product_images)) {
      for (const img of prod.product_images) {
        if (img.url && (img.url.startsWith('http://') || img.url.startsWith('https://'))) {
          img.url = await downloadMedia(img.url);
        }
      }
    }
  }

  // Download and rewrite category cover images
  for (const cat of categories || []) {
    if (cat.cover_image_url && (cat.cover_image_url.startsWith('http://') || cat.cover_image_url.startsWith('https://'))) {
      cat.cover_image_url = await downloadMedia(cat.cover_image_url);
    }
  }

  // Download and rewrite settings media URLs
  for (const [key, value] of Object.entries(settings)) {
    if (isMediaUrl(key, value)) {
      settings[key] = await downloadMedia(value);
    }
  }

  // Prepare final content object
  const content = {
    products: products || [],
    categories: categories || [],
    testimonials: testimonials || [],
    settings,
  };

  // Atomic write to public/content.json
  const tempFile = path.join(publicDir, 'content.json.tmp');
  const targetFile = path.join(publicDir, 'content.json');
  fs.writeFileSync(tempFile, JSON.stringify(content, null, 2), 'utf8');
  fs.renameSync(tempFile, targetFile);

  // Compute directory statistics
  let totalBytes = 0;
  const files = fs.readdirSync(mediaDir);
  for (const f of files) {
    const fPath = path.join(mediaDir, f);
    const stats = fs.statSync(fPath);
    if (stats.isFile()) {
      totalBytes += stats.size;
      const sizeMb = stats.size / (1024 * 1024);
      if (sizeMb > 20) {
        console.warn(`[export-content] WARNING: File ${f} is over 20 MB (${sizeMb.toFixed(2)} MB)!`);
      }
    }
  }

  const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
  console.log('\n── Export Content Summary ──────────────────────');
  console.log(`Products:            ${products?.length || 0}`);
  console.log(`Categories:          ${categories?.length || 0}`);
  console.log(`Testimonials:        ${testimonials?.length || 0}`);
  console.log(`Media Files Total:   ${files.length} (${downloadedCount} newly downloaded, ${skippedCount} skipped/cached)`);
  console.log(`Media Total Size:    ${totalMb} MB`);
  console.log(`content.json:        Successfully written to ${targetFile}`);
  console.log('────────────────────────────────────────────────\n');
}

exportContent().catch((err) => {
  console.error('[export-content] FATAL ERROR:', err);
  process.exit(1);
});
