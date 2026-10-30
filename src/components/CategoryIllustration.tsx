
interface CategoryIllustrationProps {
  slug: string
  className?: string
}

/**
 * Flat wood illustrations drawn as cut-out products for each furniture category:
 * Beds, Tables, Seating, Storage, Custom Pieces.
 * Styled with warm wood tones (#B8793E, #8A5A2B, #D9A066), no background box,
 * floating cleanly on the cream page surface.
 */
export default function CategoryIllustration({ slug, className = '' }: CategoryIllustrationProps) {
  switch (slug) {
    case 'beds':
      return (
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Soft contact shadow */}
          <ellipse cx="100" cy="142" rx="75" ry="5" fill="#3B2418" fillOpacity="0.08" />
          {/* Headboard back posts */}
          <rect x="35" y="40" width="10" height="95" rx="3" fill="#8A5A2B" />
          <rect x="155" y="40" width="10" height="95" rx="3" fill="#8A5A2B" />
          {/* Headboard panel */}
          <rect x="35" y="45" width="130" height="50" rx="4" fill="#D9A066" />
          <rect x="42" y="52" width="116" height="36" rx="2" fill="#B8793E" fillOpacity="0.3" />
          {/* Mattress & Frame */}
          <rect x="30" y="90" width="140" height="22" rx="4" fill="#FAF6EE" stroke="#E6DFCF" strokeWidth="2" />
          <rect x="25" y="108" width="150" height="14" rx="2" fill="#B8793E" />
          {/* Front legs */}
          <rect x="32" y="120" width="9" height="20" rx="2" fill="#8A5A2B" />
          <rect x="159" y="120" width="9" height="20" rx="2" fill="#8A5A2B" />
        </svg>
      )

    case 'tables':
      return (
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Soft contact shadow */}
          <ellipse cx="100" cy="144" rx="70" ry="4" fill="#3B2418" fillOpacity="0.08" />
          {/* Angled legs */}
          <polygon points="45,60 38,142 46,142 57,60" fill="#8A5A2B" />
          <polygon points="62,60 70,140 77,140 70,60" fill="#B8793E" />
          <polygon points="155,60 162,142 154,142 143,60" fill="#8A5A2B" />
          <polygon points="138,60 130,140 123,140 130,60" fill="#B8793E" />
          {/* Apron rail */}
          <rect x="45" y="56" width="110" height="12" fill="#8A5A2B" />
          {/* Tabletop main board */}
          <rect x="25" y="44" width="150" height="14" rx="2" fill="#D9A066" />
          {/* Top highlight bevel */}
          <rect x="23" y="40" width="154" height="5" rx="1" fill="#B8793E" />
        </svg>
      )

    case 'seating':
      return (
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Soft contact shadow */}
          <ellipse cx="100" cy="144" rx="50" ry="5" fill="#3B2418" fillOpacity="0.08" />
          {/* Angled legs */}
          <polygon points="65,95 56,142 64,142 75,95" fill="#8A5A2B" />
          <polygon points="135,95 144,142 136,142 125,95" fill="#8A5A2B" />
          <polygon points="80,95 86,138 92,138 86,95" fill="#B8793E" />
          <polygon points="120,95 114,138 108,138 114,95" fill="#B8793E" />
          {/* Curved seat shell */}
          <path
            d="M 52 82 C 52 98, 148 98, 148 82 C 148 76, 142 74, 136 76 C 120 81, 80 81, 64 76 C 58 74, 52 76, 52 82 Z"
            fill="#D9A066"
          />
          {/* Molded backrest */}
          <path
            d="M 60 76 C 54 48, 62 25, 100 25 C 138 25, 146 48, 140 76 C 130 80, 70 80, 60 76 Z"
            fill="#B8793E"
          />
          <path
            d="M 66 72 C 62 50, 70 32, 100 32 C 130 32, 138 50, 134 72 C 124 75, 76 75, 66 72 Z"
            fill="#D9A066"
          />
        </svg>
      )

    case 'storage':
      return (
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Soft contact shadow */}
          <ellipse cx="100" cy="144" rx="65" ry="4" fill="#3B2418" fillOpacity="0.08" />
          {/* Tapered feet */}
          <polygon points="42,120 38,142 46,142 48,120" fill="#8A5A2B" />
          <polygon points="158,120 162,142 154,142 152,120" fill="#8A5A2B" />
          <polygon points="96,120 96,140 104,140 104,120" fill="#8A5A2B" />
          {/* Main Cabinet body */}
          <rect x="30" y="45" width="140" height="78" rx="3" fill="#D9A066" />
          {/* Top slab */}
          <rect x="26" y="40" width="148" height="7" rx="1" fill="#B8793E" />
          {/* Door panels */}
          <rect x="36" y="52" width="60" height="64" rx="2" fill="#B8793E" fillOpacity="0.25" />
          <rect x="104" y="52" width="60" height="64" rx="2" fill="#B8793E" fillOpacity="0.25" />
          {/* Door handles */}
          <rect x="88" y="78" width="4" height="14" rx="2" fill="#8A5A2B" />
          <rect x="108" y="78" width="4" height="14" rx="2" fill="#8A5A2B" />
        </svg>
      )

    case 'custom-pieces':
    default:
      return (
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${className}`}
        >
          {/* Soft contact shadow */}
          <ellipse cx="100" cy="144" rx="60" ry="4" fill="#3B2418" fillOpacity="0.08" />
          {/* Sculptural console legs */}
          <path d="M 45 60 C 45 100, 75 140, 50 142 L 62 142 C 85 130, 60 90, 60 60 Z" fill="#8A5A2B" />
          <path d="M 155 60 C 155 100, 125 140, 150 142 L 138 142 C 115 130, 140 90, 140 60 Z" fill="#8A5A2B" />
          {/* Middle carved support */}
          <rect x="95" y="60" width="10" height="75" rx="2" fill="#B8793E" />
          {/* Solid live-edge bench top */}
          <path d="M 25 44 C 60 42, 140 46, 175 44 L 173 58 C 135 56, 65 60, 27 58 Z" fill="#D9A066" />
          <path d="M 23 39 C 60 37, 140 41, 177 39 L 175 45 C 135 43, 65 47, 25 45 Z" fill="#B8793E" />
        </svg>
      )
  }
}
