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
    slug: 'dining-table-and-benches',
    category: 'seating',
    name_en: 'Dining Table and Benches Set',
    name_rw: "Ameza yo Kuriraho n'Intebe Ndende", // needs native review
    name_fr: 'Ensemble Table à Manger et Bancs', // needs native review
    description_en: 'A solid wooden dining table with matching benches, built on a strong braced frame with a natural, rustic finish. It suits patios, gardens and family dining rooms, and is made to the size, number of seats and wood you choose.',
    description_rw: "Ameza yo kuriraho akomeye y'imbaho ari kumwe n'intebe ndende zihuye nayo, yubatswe ku nkingi zikomeye zishyigikiranye kandi afite isuku y'umwimerere. Aberanye n'imbuga, ubusitani n'ibyumba byo kuriramo by'umuryango, kandi akorwa ku bunini, umubare w'imyanya yo kwicaraho n'ubwoko bw'igiti wihitiyemo.", // needs native review
    description_fr: "Une table à manger en bois massif avec ses bancs assortis, construite sur une structure renforcée robuste à la finition naturelle et rustique. Elle convient aux terrasses, jardins et salles à manger familiales, et est fabriquée aux dimensions, au nombre de places et dans l'essence de bois de votre choix.", // needs native review
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '4–6 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 8,
    images: [
      {
        url: 'images/products/dining-table-and-benches/1.webp',
        alt_text: 'Dining Table and Benches Set in natural rustic solid wood',
      },
    ],
  },
  {
    slug: 'custom-christmas-tree',
    category: 'custom-pieces',
    name_en: 'Custom Christmas Tree',
    name_rw: 'Igiti cya Noheli Gikorwa ku Cyifuzo', // needs native review
    name_fr: 'Sapin de Noël Sur Mesure', // needs native review
    description_en: 'A freestanding Christmas tree built on a sturdy frame, set on a wooden base with room underneath for gifts. It is made to the height and shape you need and can be reused every year. The lights, baubles and gifts shown in the photo are not included.',
    description_rw: "Igiti cya Noheli gihagaze cyonyine cyubatswe ku nkingi zikomeye, giteretse ku ntango y'imbaho ifite umwanya munsi wo gushyiramo impano. Gikorwa ku burebure n'imiterere ukeneye kandi gishobora kongera gukoreshwa buri mwaka. Amatara, imitako n'impano bigaragara ku ifoto ntibirimo.", // needs native review
    description_fr: "Un sapin de Noël autoportant construit sur une structure solide, posé sur une base en bois avec de l'espace en dessous pour les cadeaux. Il est fabriqué à la hauteur et à la forme dont vous avez besoin et peut être réutilisé chaque année. Les guirlandes lumineuses, boules et cadeaux visibles sur la photo ne sont pas inclus.", // needs native review
    wood_type: 'Your choice',
    dimensions: 'Made to measure',
    lead_time_text: '2–4 weeks',
    price_amount: null, // Price on request
    currency: 'RWF',
    published: true,
    featured: true,
    sortOrder: 9,
    images: [
      {
        url: 'images/products/custom-christmas-tree/1.webp',
        alt_text: 'Custom freestanding Christmas tree on a wooden gift base',
      },
    ],
  },
]
