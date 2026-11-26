export interface Category {
  id: string
  slug: string
  name_en: string
  name_rw: string | null
  name_fr: string | null
  coverImage?: string | null
  coverPosition?: string
  cover_image_url: string | null
  sort_order: number
}

export const categories: Category[] = [
  {
    id: 'beds',
    slug: 'beds',
    name_en: 'Beds',
    name_rw: 'Ibitanda',
    name_fr: 'Lits',
    coverImage: 'images/products/bed/1.webp',
    coverPosition: '52% 68%',
    cover_image_url: null,
    sort_order: 1,
  },
  {
    id: 'tables',
    slug: 'tables',
    name_en: 'Tables',
    name_rw: 'Ameza',
    name_fr: 'Tables',
    coverImage: null,
    coverPosition: '50% 50%',
    cover_image_url: null,
    sort_order: 2,
  },
  {
    id: 'seating',
    slug: 'seating',
    name_en: 'Seating',
    name_rw: 'Intebe',
    name_fr: 'Sièges',
    coverImage: 'images/products/dining-table-and-benches/1.webp',
    coverPosition: '52% 62%',
    cover_image_url: null,
    sort_order: 3,
  },
  {
    id: 'storage',
    slug: 'storage',
    name_en: 'Storage',
    name_rw: 'Ibibyoroshye',
    name_fr: 'Rangement',
    coverImage: null,
    coverPosition: '50% 50%',
    cover_image_url: null,
    sort_order: 4,
  },
  {
    id: 'custom-pieces',
    slug: 'custom-pieces',
    name_en: 'Custom Pieces',
    name_rw: 'Ibintu Bikorwa',
    name_fr: 'Pièces sur mesure',
    coverImage: 'images/products/tic-tac-toe-set/1.webp',
    coverPosition: '50% 50%',
    cover_image_url: null,
    sort_order: 5,
  },
]

