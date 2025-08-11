'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = "Search plants by name or species..." }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-3 rounded-2xl border border-eva-greenLight/50 bg-white focus:outline-none focus:ring-4 focus:ring-eva-green/20 focus:border-eva-green transition-all"
      />
      <svg
        className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-eva-ink/40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}