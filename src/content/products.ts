export interface ProductImageItem {
  url: string
  alt_text?: string | null
}

export interface ProductItem {
  slug: string
  category: string
  name_en: string
  name_rw: string | null
  name_fr: string | null
  description_en: string | null
  description_rw: string | null
  description_fr: string | null
  wood_type: string | null
  dimensions: string | null
  lead_time_text: string | null
  price_amount: number | null
  currency: string
  published: boolean
  featured: boolean
  sortOrder: number
  images: (string | ProductImageItem)[]
}

export const products: ProductItem[] = [
  {
    slug: 'bed',
    category: 'beds',
    name_en: 'Handcrafted Solid Wood Bed',
    name_rw: "Igitanda cy'Imbaho Zikomeye", // needs native review
    name_fr: 'Lit Artisanal en Bois Massif', // needs native review
    description_en: 'Low-profile solid wood bed frame handcrafted with traditional mortise-and-tenon joinery and finished with natural oil for lasting warmth and character.',
    description_rw: "Igitanda cy'imbaho zikomeye cyakozwe mu buhanga gakondo bwo guteranya imbaho. Cyakozwe mu buryo burambye buhebuje n'amavuta y'umwimerere.", // needs native review
    description_fr: "Cadre de lit artisanal en bois massif assemblé selon des techniques traditionnelles de tenon et mortaise, avec une finition chaleureuse à l'huile naturelle.", // needs native review
    wood_type: 'Rwandan Mahogany',
    dimensions: '160 × 200 cm (queen)',
    lead_time_text: '3–5 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 1,
    images: [
      {
        url: 'images/products/bed/1.webp',
        alt_text: 'Handcrafted Solid Wood Bed Frame',
      },
    ],
  },
  {
    slug: 'bespoke-wardrobe',
    category: 'custom-pieces',
    name_en: 'Bespoke Built-in Wardrobe',
    name_rw: "Ibigega Bikorwa Bihuje n'Aho",
    name_fr: 'Armoire Sur Mesure',
    description_en: 'Fully custom wardrobes designed around your space. We work with you from first sketch to final fitting. Price varies by size and specification.',
    description_rw: "Ibigega bikorwa bihuje n'aho ushaka mu nzu yawe. Dukorana nawe kuva ku gishushanyo cya mbere kugeza igihe kirangiye.",
    description_fr: "Armoires entièrement sur mesure conçues autour de votre espace. Nous travaillons avec vous du premier croquis à l'installation finale.",
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '6–10 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 2,
    images: [
      {
        url: 'images/products/bespoke-wardrobe/1.webp',
        alt_text: 'Bespoke Built-in Wardrobe',
      },
    ],
  },
  {
    slug: 'serving-tray',
    category: 'custom-pieces',
    name_en: 'Handled Serving Tray',
    name_rw: "Ibereberero ry'Imbaho rifite Igikondo", // needs native review
    name_fr: 'Plateau de Service en Bois avec Poignée', // needs native review
    description_en: 'A hand-finished serving tray with a raised rim and a shaped handle with a hanging hole, set with a contrasting stripe of reddish wood. Made for bread, snacks, cheese or grilled food, and made to the size and wood you choose.',
    description_rw: "Ibereberero ry'imbaho rikozwe n'intoki rifite inkengero zazamuye n'umukondo wacukuwemo umwenge wo kumanika, ririmo n'umurongo w'urubaho rutukura rugaragara neza. Ryakozwe mu kwakiriza umugati, ibyo kurya byoroheje, foromaje cyangwa inyama zokeje, rikorwa ku bunini n'igiti wihitiyemo.", // needs native review
    description_fr: "Un plateau de service aux finitions soignées faites à la main, avec des bords relevés et une poignée ergonomique percée d'un trou de suspension, orné d'une bande contrastée en bois rougeâtre. Conçu pour le pain, les collations, les fromages ou les grillades, fabriqué sur mesure selon les dimensions et l'essence de bois de votre choix.", // needs native review
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '2–4 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 3,
    images: [
      {
        url: 'images/products/serving-tray/1.webp',
        alt_text: 'Handled Serving Tray',
      },
    ],
  },
  {
    slug: 'tic-tac-toe-set',
    category: 'custom-pieces',
    name_en: 'Tic-Tac-Toe Game Set',
    name_rw: "Umukino wa Tic-Tac-Toe w'Imbaho", // needs native review
    name_fr: 'Jeu de Morpion en Bois', // needs native review
    description_en: 'A hand-carved wooden tic-tac-toe board with deep grooves and six matching pieces, three rounded and three squared, made from layered woods in two tones. A lasting gift or a table piece, made to the size and wood you choose.',
    description_rw: "Ikibaho cy'umukino wa tic-tac-toe cyakozwe n'intoki mu mbaho zicukuwemo imirongo ifite ubujyakuzimu, kiri kumwe n'utubuye dutandatu t'amoko abiri (dutatu tuzengurutse n'utundi dutatu tw'inguni enye) twakozwe mu mbaho z'amabara abiri. Ni impano irambye cyangwa umutako mwiza wo ku meza, bikorwa ku bunini n'ubwoko bw'igiti wihitiyemo.", // needs native review
    description_fr: "Un plateau de jeu de morpion artisanal en bois sculpté à la main, doté de rainures profondes et de six pièces coordonnées — trois arrondies et trois carrées — confectionnées à partir de bois superposés en deux tons. Un cadeau durable ou une pièce décorative de table, fabriqué aux dimensions et dans l'essence de bois de votre choix.", // needs native review
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '2–4 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 4,
    images: [
      {
        url: 'images/products/tic-tac-toe-set/1.webp',
        alt_text: 'Tic-Tac-Toe Game Set',
      },
    ],
  },
  {
    slug: 'dog-cage',
    category: 'custom-pieces',
    name_en: 'Two-Compartment Dog Cage',
    name_rw: "Akazu k'Imbwa k'Ibyumba Bibiri", // needs native review
    name_fr: 'Enclos pour Chien à Deux Compartiments', // needs native review
    description_en: 'A sturdy wooden dog cage with two separate compartments, wire mesh doors with secure latches, and openings for food bowls. It stands on wheels so it is easy to move, and it has a metal roof for shade and rain. Built to the size and design you need.',
    description_rw: "Akazu gakomeye k'imbwa gakozwe mu mbaho zikomeye gafite ibyumba bibiri bitandukanye, inzugi z'urusengero zifite ibifunga byizewe, hamwe n'imyenge y'amasahani y'ibiryo. Gahagaze ku nziga zikomeye zituma koroha kukimura, kandi gafite igisenge cy'amabati kikirinda izuba n'imvura. Gakorwa ku bunini n'igishushanyo ukeneye.", // needs native review
    description_fr: "Un enclos pour chien robuste en bois massif comprenant deux compartiments séparés, des portes grillagées avec verrous sécurisés et des ouvertures dédiées aux gamelles de nourriture. Monté sur roulettes pour un déplacement aisé, il est surmonté d'un toit métallique protecteur contre le soleil et la pluie. Conçu sur mesure selon vos dimensions et vos besoins.", // needs native review
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '2–4 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 5,
    images: [
      {
        url: 'images/products/dog-cage/1.webp',
        alt_text: 'Two-Compartment Dog Cage',
      },
    ],
  },
  {
    slug: 'slatted-bench',
    category: 'seating',
    name_en: 'Slatted Bench',
    name_rw: 'Intebe y\'Imbaho Zigaragara', // needs native review
    name_fr: 'Banc à Lattes', // needs native review
    description_en: 'A sturdy bench with a slatted seat in warm, mixed wood tones on a dark-stained frame with a lower crossbar. Good for dining, entrance halls or the garden, and made to the length, height and wood you choose.',
    description_rw: 'Intebe ikomeye ifite aho kwicara hakozwe mu mbaho zigaragara z\'amabara ashyuha arimo n\'isuri ry\'ibiti bibiri, bihagarariwe n\'imiterere yafuye umwirakari n\'inkozamiryango. Ikwiriye kuri tafura, mu nzugi z\'inzu cyangwa mu murima, kandi ikorwa ku bunini, uburebure n\'igiti wihitiyemo.', // needs native review
    description_fr: 'Un banc robuste au plateau à lattes dans des tons de bois chauds et mélangés, monté sur un cadre teinté sombre avec une traverse basse. Idéal pour la salle à manger, l\'entrée ou le jardin, fabriqué à la longueur, la hauteur et dans l\'essence de bois de votre choix.', // needs native review
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '2–4 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 6,
    images: [
      {
        url: 'images/products/slatted-bench/1.webp',
        alt_text: 'Slatted Bench in warm mixed wood tones on a dark frame',
      },
    ],
  },
  {
    slug: 'fabric-wrapped-low-bed',
    category: 'beds',
    name_en: 'Fabric-Wrapped Low Bed',
    name_rw: 'Igitanda Cyo Hasi Gifunikiye Igitambaro cy\'Afurika', // needs native review
    name_fr: 'Lit Bas Habillé de Tissu Africain', // needs native review
    description_en: 'A low bed base wrapped in bold African wax-print fabric, built to the size you need, from single to queen. The fabric and frame are of your choice. The mattress and bedding shown in the photo are not included.',
    description_rw: 'Igitanda cyo hasi kifunikiye igitambaro cy\'Afurika gikozwe mu mabara ashimishije, kikorwa ku bunini ukeneye, kuva ku cyumba kimwe kugeza kinini. Igitambaro n\'imbaho bihatirwa ibibazo byawe. Materas n\'ibikoresho by\'ubuturo bigaragara mu kifoto ntibibiziramo.', // needs native review
    description_fr: 'Un sommier bas habillé d\'un tissu wax africain aux motifs audacieux, fabriqué à la taille dont vous avez besoin, du simple au queen. Le tissu et le cadre sont au choix du client. Le matelas et la literie visibles sur la photo ne sont pas inclus.', // needs native review
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '4–6 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 7,
    images: [
      {
        url: 'images/products/fabric-wrapped-low-bed/1.webp',
        alt_text: 'Fabric-Wrapped Low Bed with bold African wax-print fabric base',
      },
    ],
  },
  {
    slug: 'kintu-queen-bed',
    category: 'beds',
    name_en: 'Kintu Queen Bed',
    name_rw: 'Igitanda cya Kintu',
    name_fr: 'Lit Kintu Queen',
    description_en: 'A bold, handcrafted queen-sized bed frame made from sustainably sourced Rwandan timber. Clean lines and warm tones make this piece the centrepiece of any bedroom.',
    description_rw: "Igitanda kinini cyakozwe n'ubunyangamugayo n'imiti y'u Rwanda. Imirongo isukuye n'amabara ashyuha bitera iki gitanda kuba icyubahiro cy'inzu.",
    description_fr: "Un cadre de lit queen size artisanal et audacieux, fabriqué à partir de bois rwandais d'approvisionnement durable. Les lignes épurées et les tons chaleureux en font la pièce maîtresse de toute chambre.",
    wood_type: 'Rwandan Mahogany',
    dimensions: '160 × 200 cm (queen)',
    lead_time_text: '4–6 weeks',
    price_amount: 450000,
    currency: 'RWF',
    published: true,
    featured: false,
    sortOrder: 8,
    images: [],
  },
  {
    slug: 'savanna-platform-bed',
    category: 'beds',
    name_en: 'Savanna Platform Bed',
    name_rw: 'Igitanda Savanna',
    name_fr: 'Lit Plateforme Savanna',
    description_en: 'Low-profile platform bed with a natural oil finish. Minimal joinery, maximum character.',
    description_rw: "Igitanda cya platform gifite amavuta y'umwimerere. Imiterere yoroheje kandi ikomeye.", // needs native review
    description_fr: 'Lit plateforme bas avec finition à l’huile naturelle. Assemblage épuré, caractère affirmé.', // needs native review
    wood_type: 'Eucalyptus',
    dimensions: '140 × 190 cm (double)',
    lead_time_text: '3–5 weeks',
    price_amount: 380000,
    currency: 'RWF',
    published: true,
    featured: false,
    sortOrder: 9,
    images: [],
  },
  {
    slug: 'amara-dining-table',
    category: 'tables',
    name_en: 'Amara Dining Table',
    name_rw: 'Ameza ya Amara',
    name_fr: 'Table à Manger Amara',
    description_en: 'A generous solid-wood dining table that seats six comfortably. Mortise-and-tenon joints, no metal hardware.',
    description_rw: 'Ameza manini y’imbaho zikomeye yicarwaho n’abantu batandatu bisanzuye. Iteranyijwe mu buhanga gakondo nta byuma.', // needs native review
    description_fr: 'Une généreuse table à manger en bois massif pour six personnes. Assemblage tenon-mortaise sans quincaillerie apparente.', // needs native review
    wood_type: 'African Rosewood',
    dimensions: '180 × 90 cm',
    lead_time_text: '5–7 weeks',
    price_amount: 620000,
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 10,
    images: [],
  },
  {
    slug: 'kigali-coffee-table',
    category: 'tables',
    name_en: 'Kigali Coffee Table',
    name_rw: 'Ameza ya Kawa ya Kigali',
    name_fr: 'Table Basse Kigali',
    description_en: 'Compact coffee table with a live-edge top and hairpin-inspired solid-wood legs.',
    description_rw: 'Ameza magufi ya kawa afite hejuru h’umwimerere n’amaguru y’imbaho zikomeye.', // needs native review
    description_fr: 'Table basse compacte au plateau en bord naturel et pieds en bois massif inspirés du style épingle.', // needs native review
    wood_type: 'Rwandan Pine',
    dimensions: '100 × 55 cm',
    lead_time_text: '2–3 weeks',
    price_amount: 185000,
    currency: 'RWF',
    published: true,
    featured: false,
    sortOrder: 11,
    images: [],
  },
  {
    slug: 'hills-accent-chair',
    category: 'seating',
    name_en: 'Hills Accent Chair',
    name_rw: 'Intebe ya Hills',
    name_fr: "Chaise d'Accent Hills",
    description_en: 'A sculpted accent chair with angled legs and an open back. Upholstery in neutral linen (fabric customisable on request).',
    description_rw: 'Intebe nziza ifite amaguru ahengamye n’umugongo ufunguye. Ipfukishijwe igitambaro cyiza cy’irenga.', // needs native review
    description_fr: 'Une chaise d’appoint sculptée aux pieds inclinés et dossier ajouré. Revêtement en lin neutre personnalisable sur demande.', // needs native review
    wood_type: 'Teak',
    dimensions: '60 × 65 × 85 cm',
    lead_time_text: '3–4 weeks',
    price_amount: 290000,
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 12,
    images: [],
  },
  {
    slug: 'nyamirambo-bench',
    category: 'seating',
    name_en: 'Nyamirambo Bench',
    name_rw: 'Intebe Ndende ya Nyamirambo',
    name_fr: 'Banc Nyamirambo',
    description_en: 'A versatile solid-wood bench, equally at home at the foot of a bed or in an entryway.',
    description_rw: "Intebe ndende y'imbaho zikomeye ikwiriye ku mpera y'igitanda cyangwa mu muryango.", // needs native review
    description_fr: 'Un banc polyvalent en bois massif, parfait au pied d’un lit ou dans une entrée.', // needs native review
    wood_type: 'Eucalyptus',
    dimensions: '120 × 40 × 45 cm',
    lead_time_text: '2–3 weeks',
    price_amount: 160000,
    currency: 'RWF',
    published: true,
    featured: false,
    sortOrder: 13,
    images: [],
  },
  {
    slug: 'imigongo-bookshelf',
    category: 'storage',
    name_en: 'Imigongo Bookshelf',
    name_rw: "Igikoresho cy'Ibitabo cya Imigongo",
    name_fr: 'Étagère Imigongo',
    description_en: 'A tall open bookshelf inspired by the geometric patterns of Rwandan Imigongo art. Five shelves, no nails.',
    description_rw: "Igikoresho kirekire cy'ibitabo gishingiye ku bishushanyo by'imigongo nyarwanda. Amasuka atanu, nta misumari.", // needs native review
    description_fr: 'Une grande étagère ouverte inspirée des motifs géométriques de l’art rwandais Imigongo. Cinq étagères, sans clous.', // needs native review
    wood_type: 'Rwandan Mahogany',
    dimensions: '90 × 30 × 180 cm',
    lead_time_text: '4–5 weeks',
    price_amount: 320000,
    currency: 'RWF',
    published: true,
    featured: false,
    sortOrder: 14,
    images: [],
  },
]
