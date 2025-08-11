'use client'

import Image from 'next/image'

interface Plant {
  id: string
  common_name: string
  species: string
  light: string
  water_freq: string
  pet_safe: boolean
  indoor_outdoor: string
  trivia: string
  image?: string
}

interface PlantCardProps {
  plant: Plant
  onAdd: () => void
}

export default function PlantCard({ plant, onAdd }: PlantCardProps) {
  const chips = [
    { label: plant.indoor_outdoor, color: 'bg-eva-greenLight/30' },
    { label: plant.light, color: 'bg-eva-beige' },
    { label: plant.water_freq, color: 'bg-eva-greenLight/20' },
    { label: plant.pet_safe ? 'Pet Safe' : 'Not Pet Safe', color: plant.pet_safe ? 'bg-green-100' : 'bg-red-100' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-eva-greenLight/20 group">
      {plant.image && (
        <div className="relative h-56 w-full overflow-hidden bg-eva-greenLight/10">
          <Image
            src={plant.image}
            alt={plant.common_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      <div className="p-5">
        <h3 className="font-headline font-semibold text-lg text-eva-green mb-1">
          {plant.common_name}
        </h3>
        <p className="text-sm text-eva-ink/60 italic mb-4">{plant.species}</p>
      
        <div className="flex flex-wrap gap-1.5 mb-4">
          {chips.map((chip, index) => (
            <span
              key={index}
              className={`${chip.color} text-xs px-2 py-1 rounded-full font-data`}
              data-label
            >
              {chip.label}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-eva-ink/70 mb-4 line-clamp-2">{plant.trivia}</p>
        
        <button
          onClick={onAdd}
          className="w-full bg-eva-terracotta text-white py-2 rounded-xl font-medium hover:opacity-90 transition-opacity focus:ring-2 focus:ring-eva-terracotta/30 flex items-center justify-center gap-2"
        >
          <span>+</span>
          <span>Add to Journal</span>
        </button>
      </div>
    </div>
  )
}