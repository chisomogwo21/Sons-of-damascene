# Content Management Guide

This guide explains how to manage content on the Sons of Damascene website. All content is statically embedded in the repository, with images hosted in `public/images/`.

---

## 1. Adding a New Product

Whenever you have new product photos and details, follow these steps:

### A. Process & Save Photos
1. Create a dedicated folder: `public/images/products/<slug>/`
   - Use a lowercase, hyphenated slug (e.g. `kigali-dining-table`).
2. Resize each photo so its longest side is at most **1600px**.
3. Convert photos to **WebP** format (recommended quality ~80%).
4. Name the files sequentially:
   - `1.webp` (First image is the **cover** image by default)
   - `2.webp`
   - `3.webp`
   - etc.

### B. Add Entry in `src/content/products.ts`
Add a new object to the `products` array in [src/content/products.ts](file:///c:/Users/hp/OneDrive/Desktop/Sons/of/Damascene/src/content/products.ts):

```typescript
{
  slug: 'kigali-dining-table',
  category: 'tables', // Must match an existing category slug: 'beds', 'tables', 'seating', 'storage', or 'custom-pieces'
  name: {
    en: 'Kigali Dining Table',
    rw: 'Ameza yo Kuriraho ya Kigali', // needs native review
    fr: 'Table à Manger Kigali',        // needs native review
  },
  description: {
    en: 'Solid mahogany dining table handcrafted in our Kigali workshop.',
    rw: 'Ameza yo kuriraho akozwe mu giti cya mahogany mu mahuguriro yacu i Kigali.', // needs native review
    fr: 'Table de salle à manger en acajou massif fabriquée à la main dans notre atelier de Kigali.', // needs native review
  },
  woodType: 'Mahogany',
  dimensions: '220cm × 100cm × 76cm',
  leadTime: '3-4 weeks',
  price: null, // Set to number (e.g. 850000) or null for "Price on request"
  published: true,
  featured: false, // Set to true to showcase on the home page
  sortOrder: 10,
  images: [
    { url: 'images/products/kigali-dining-table/1.webp', alt: 'Kigali Dining Table - Main View' },
    { url: 'images/products/kigali-dining-table/2.webp', alt: 'Kigali Dining Table - Detail View' },
  ],
},
```

> **Rules:**
> - Keep `slug` lowercase with dashes.
> - Provide translations for `rw` and `fr`. Mark them with the comment `// needs native review`.
> - Use `price: null` (which displays "Price on request") unless an exact RWF price is provided.
> - The first item in `images` is the cover image shown on product cards.

---

## 2. Updating or Removing a Product

- **To update:** Edit the product's entry in `src/content/products.ts` or replace images in `public/images/products/<slug>/`.
- **To unpublish:** Set `published: false` in `src/content/products.ts`.
- **To delete:** Remove the product object from `src/content/products.ts` and delete its directory `public/images/products/<slug>/`.

---

## 3. Managing Testimonials

Edit [src/content/testimonials.ts](file:///c:/Users/hp/OneDrive/Desktop/Sons/of/Damascene/src/content/testimonials.ts). Each testimonial contains:
```typescript
{
  id: '1',
  clientName: 'Client Name',
  location: 'Kigali, Rwanda',
  quote: {
    en: 'English quote...',
    rw: 'Kinyarwanda quote...', // needs native review
    fr: 'French quote...',      // needs native review
  },
  rating: 5,
  sortOrder: 1,
}
```

---

## 4. Managing Categories and Site Settings

- **Categories:** Edit [src/content/categories.ts](file:///c:/Users/hp/OneDrive/Desktop/Sons/of/Damascene/src/content/categories.ts).
- **Hero Video & Site Settings:** Edit [src/content/settings.ts](file:///c:/Users/hp/OneDrive/Desktop/Sons/of/Damascene/src/content/settings.ts).
  - Site images (collage, hero poster, banners) are stored in `public/images/site/`.
  - Hero video is located at `public/images/site/hero.mp4` and its first frame poster at `public/images/site/hero-poster.webp`.

---

## 5. Testing and Deploying

1. Run the local build to ensure TypeScript types and routes pass:
   ```bash
   npm run build
   ```
2. Test locally:
   ```bash
   npm run preview
   ```
3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Add new product: <product-name>"
   git push origin main
   ```
4. GitHub Actions will automatically build and deploy to GitHub Pages within 1–2 minutes.

