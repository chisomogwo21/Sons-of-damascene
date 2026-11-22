export interface Testimonial {
  id: string
  author_name: string
  author_location: string | null
  quote_en: string
  quote_rw: string | null
  quote_fr: string | null
  is_published: boolean
  sort_order: number
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    author_name: 'Claire M.',
    author_location: 'Kigali',
    quote_en: 'The dining table Sons of Damascene made for us is the heart of our home. Guests always ask about it.',
    quote_rw: 'Ameza ya Sons of Damascene yakoze iriho ho muri twese. Abashyitsi barayibaza buri gihe.',
    quote_fr: 'La table à manger que Sons of Damascene a fabriquée est le cœur de notre maison. Les invités la remarquent toujours.',
    is_published: true,
    sort_order: 1,
  },
  {
    id: '2',
    author_name: 'Jean-Paul K.',
    author_location: 'Remera, Kigali',
    quote_en: 'Exceptional craftsmanship and they listened to every detail I had in mind. The bed is better than I imagined.',
    quote_rw: 'Ubuhanga bwihayimana kandi bashoboye kumva ibyose nabahisemo. Igitanda ni cyiza kuruta ibyo narose.',
    quote_fr: "Un savoir-faire exceptionnel et ils ont écouté chaque détail que j'avais en tête. Le lit est meilleur que ce que j'imaginais.",
    is_published: true,
    sort_order: 2,
  },
  {
    id: '3',
    author_name: 'Amina T.',
    author_location: 'Nyamirambo, Kigali',
    quote_en: 'Honest timelines, beautiful finish, and they deliver what they promise. Highly recommend.',
    quote_rw: 'Igihe kizwi, amasaro meza, kandi batanga ibyo basezerana. Birasabwa cyane.',
    quote_fr: 'Des délais honnêtes, une belle finition et ils tiennent leurs promesses. Je recommande vivement.',
    is_published: true,
    sort_order: 3,
  },
]

