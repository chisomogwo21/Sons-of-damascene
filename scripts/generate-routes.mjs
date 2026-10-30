import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('[generate-routes] ERROR: dist/index.html does not exist. Run build first.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Find content.json either in dist or public
let contentJsonPath = path.join(distDir, 'content.json');
if (!fs.existsSync(contentJsonPath)) {
  contentJsonPath = path.join(rootDir, 'public', 'content.json');
}

let products = [];
if (fs.existsSync(contentJsonPath)) {
  try {
    const raw = fs.readFileSync(contentJsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    products = parsed.products || [];
  } catch (err) {
    console.warn('[generate-routes] Warning: Could not parse content.json for product slugs:', err.message);
  }
}

const staticRoutes = [
  'about',
  'products',
  'craftsman',
  'contact',
  'admin',
  'admin/login',
];

const dynamicRoutes = products
  .filter((p) => p.slug)
  .map((p) => `products/${p.slug}`);

const allRoutes = [...staticRoutes, ...dynamicRoutes];

let count = 0;
for (const route of allRoutes) {
  const targetDir = path.join(distDir, route);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const destFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(destFile, indexHtml, 'utf8');
  count++;
}

// 404 fallback
const dest404 = path.join(distDir, '404.html');
fs.writeFileSync(dest404, indexHtml, 'utf8');

// .nojekyll for GitHub Pages
const destNoJekyll = path.join(distDir, '.nojekyll');
fs.writeFileSync(destNoJekyll, '', 'utf8');

console.log(`[generate-routes] Created ${count} folder-style route index.html files, 404.html, and .nojekyll in dist/`);
