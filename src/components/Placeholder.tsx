import { useTranslation } from 'react-i18next'

interface PlaceholderProps {
  label?: string
  className?: string
  variant?: 'default' | 'category' | 'cream'
}

/** Warm placeholder block shown when no image is available yet. */
export default function Placeholder({
  label,
  className = '',
  variant = 'default',
}: PlaceholderProps) {
  const { t } = useTranslation()

  if (variant === 'category') {
    return (
      <div
        className={`flex items-center justify-center bg-[#F2EBDC] w-full h-full ${className}`}
        aria-hidden="true"
      >
        {/* Simple faint line icon of a furniture piece */}
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#8a7060]/30 transition-transform duration-300 group-hover:scale-[1.03]"
        >
          {/* Minimalist chair outline */}
          <path d="M5 12h14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4z" />
          <path d="M5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" />
          <path d="M7 18v3" />
          <path d="M17 18v3" />
        </svg>
      </div>
    )
  }

  const gradientClass =
    variant === 'cream'
      ? 'bg-gradient-to-br from-[#FAF7EE] via-[#F4EBD9] to-[#EDE1C8]'
      : 'bg-gradient-to-br from-[#f0e8d5] via-[#e8dcc5] to-[#d9ccaa]'

  return (
    <div
      className={`flex items-center justify-center ${gradientClass} w-full h-full min-h-[160px] ${className}`}
      aria-label={label || t('placeholder.photo')}
      role="img"
    >
      {/* Subtle grain overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />
      <span className="relative text-[#8a7060] text-xs tracking-wide font-medium select-none">
        {label || t('placeholder.photo')}
      </span>
    </div>
  )
}
