'use client'

interface Shop {
  name: string
  city: string
  url: string
  notes: string
}

interface ShopListProps {
  shops: Shop[]
}

export default function ShopList({ shops }: ShopListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shops.map((shop, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 border border-eva-greenLight/20 hover:shadow-sm transition-shadow"
        >
          <h3 className="font-headline font-semibold text-lg text-eva-green mb-2">
            {shop.name}
          </h3>
          <p className="text-sm text-eva-ink/60 mb-3 font-data" data-label>
            {shop.city}, NH
          </p>
          <p className="text-sm text-eva-ink/70 mb-4">{shop.notes}</p>
          <a
            href={shop.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-eva-terracotta hover:text-eva-terracotta/80 font-medium text-sm transition-colors"
          >
            Visit Website
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      ))}
    </div>
  )
}