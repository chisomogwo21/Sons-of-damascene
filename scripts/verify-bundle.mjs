import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distAssets = path.join(rootDir, 'dist', 'assets');

if (!fs.existsSync(distAssets)) {
  console.error('[verify-bundle] ERROR: dist/assets directory not found. Run build first.');
  process.exit(1);
}

const files = fs.readdirSync(distAssets);
const entryChunk = files.find((f) => f.startsWith('index-') && f.endsWith('.js'));

if (!entryChunk) {
  console.error('[verify-bundle] ERROR: Could not find entry chunk index-*.js in dist/assets');
  process.exit(1);
}

console.log(`[verify-bundle] Inspecting public entry chunk: ${entryChunk}`);
const entryContent = fs.readFileSync(path.join(distAssets, entryChunk), 'utf8');

const hasSupabaseWord = entryContent.toLowerCase().includes('supabase');
const hasSupabaseUrl = entryContent.includes('supabase.co');

console.log(`- Contains 'supabase': ${hasSupabaseWord}`);
console.log(`- Contains 'supabase.co': ${hasSupabaseUrl}`);

if (hasSupabaseWord || hasSupabaseUrl) {
  console.error('[verify-bundle] FAIL: Public entry chunk contains Supabase references!');
  process.exit(1);
} else {
  console.log('[verify-bundle] PASS: Public entry chunk contains no Supabase client and no Supabase URL.');
}
