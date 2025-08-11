'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { fetchPlantDetails, PerenualDetailResponse } from '@/lib/perenual-api'

export default function PlantDetail({ params }: { params: { id: string } }) {
  const [plant, setPlant] = useState<PerenualDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlant = async () => {
      try {
        const data = await fetchPlantDetails(parseInt(params.id))
        setPlant(data)
      } catch (err) {
        setError('Failed to load plant details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    loadPlant()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-eva-beige">
        <Navigation />
        <div className="px-8 lg:px-16 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-eva-green"></div>
          <p className="mt-4 text-eva-ink/60">Loading plant details...</p>
        </div>
      </main>
    )
  }

  if (error || !plant) {
    return (
      <main className="min-h-screen bg-eva-beige">
        <Navigation />
        <div className="px-8 lg:px-16 py-12 text-center">
          <h1 className="text-2xl font-bold text-eva-green mb-4">Plant Not Found</h1>
          <p className="text-eva-ink/60 mb-4">{error}</p>
          <Link href="/plant-database" className="text-eva-terracotta hover:underline">
            Return to Plant Database
          </Link>
        </div>
      </main>
    )
  }

  const getPoisonousLabel = () => {
    if (plant.poisonous_to_humans === 0 && plant.poisonous_to_pets === 0) return '✅ Pet & Human Safe'
    if (plant.poisonous_to_pets > 0 && plant.poisonous_to_humans > 0) return '⚠️ Toxic to Pets & Humans'
    if (plant.poisonous_to_pets > 0) return '🐾 Toxic to Pets'
    if (plant.poisonous_to_humans > 0) return '👤 Toxic to Humans'
    return 'Unknown'
  }

  const getPoisonousColor = () => {
    if (plant.poisonous_to_humans === 0 && plant.poisonous_to_pets === 0) return 'bg-green-100 text-green-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <main className="min-h-screen bg-eva-beige">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/plant-database"
            className="inline-flex items-center gap-2 text-eva-terracotta hover:text-eva-terracotta/80 mb-6"
          >
            ← Back to Database
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              {plant.default_image ? (
                <div className="relative h-96 w-full overflow-hidden bg-eva-greenLight/10 rounded-2xl">
                  <Image
                    src={plant.default_image.original_url}
                    alt={plant.common_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="h-96 w-full bg-eva-greenLight/10 rounded-2xl flex items-center justify-center">
                  <span className="text-8xl opacity-20">🌿</span>
                </div>
              )}
              
              <div className="mt-6 bg-white rounded-2xl p-6 border border-eva-greenLight/20">
                <h3 className="font-headline font-semibold text-lg text-eva-green mb-4">Quick Facts</h3>
                <dl className="space-y-3">
                  {plant.family && (
                    <>
                      <dt className="text-sm text-eva-ink/60">Family</dt>
                      <dd className="font-medium">{plant.family}</dd>
                    </>
                  )}
                  {plant.origin && plant.origin.length > 0 && (
                    <>
                      <dt className="text-sm text-eva-ink/60">Origin</dt>
                      <dd className="font-medium">{plant.origin.join(', ')}</dd>
                    </>
                  )}
                  {plant.dimension && (
                    <>
                      <dt className="text-sm text-eva-ink/60">Size</dt>
                      <dd className="font-medium">{plant.dimension}</dd>
                    </>
                  )}
                  {plant.growth_rate && (
                    <>
                      <dt className="text-sm text-eva-ink/60">Growth Rate</dt>
                      <dd className="font-medium capitalize">{plant.growth_rate}</dd>
                    </>
                  )}
                  {plant.hardiness && (
                    <>
                      <dt className="text-sm text-eva-ink/60">Hardiness Zone</dt>
                      <dd className="font-medium">{plant.hardiness.min} - {plant.hardiness.max}</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
            
            <div>
              <h1 className="text-[36px] font-headline font-bold text-eva-green mb-2">
                {plant.common_name}
              </h1>
              <p className="text-lg text-eva-ink/60 italic mb-4">
                {plant.scientific_name?.[0] || 'Unknown species'}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1.5 rounded-full font-semibold ${getPoisonousColor()}`}>
                  {getPoisonousLabel()}
                </span>
                {plant.indoor && (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full">
                    🏠 Indoor Plant
                  </span>
                )}
                {plant.medicinal && (
                  <span className="px-3 py-1.5 bg-teal-100 text-teal-800 rounded-full">
                    💊 Medicinal
                  </span>
                )}
                {plant.edible_fruit && (
                  <span className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full">
                    🍎 Edible Fruit
                  </span>
                )}
                {plant.flowers && (
                  <span className="px-3 py-1.5 bg-pink-100 text-pink-800 rounded-full">
                    🌸 Flowering
                  </span>
                )}
              </div>
              
              {plant.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-eva-green mb-3">About</h2>
                  <p className="text-eva-ink/80 leading-relaxed">{plant.description}</p>
                </div>
              )}
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-eva-green mb-3 flex items-center gap-2">
                    💧 Watering
                  </h3>
                  <p className="text-eva-ink/80">
                    <strong>Frequency:</strong> {plant.watering || 'Not specified'}
                  </p>
                  {plant.watering_general_benchmark && (
                    <p className="text-eva-ink/80 mt-2">
                      <strong>Amount:</strong> {plant.watering_general_benchmark.value} {plant.watering_general_benchmark.unit}
                    </p>
                  )}
                  {plant.watering_period && (
                    <p className="text-eva-ink/80 mt-2">
                      <strong>Period:</strong> {plant.watering_period}
                    </p>
                  )}
                </div>
                
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                  <h3 className="font-semibold text-eva-green mb-3 flex items-center gap-2">
                    ☀️ Light Requirements
                  </h3>
                  <p className="text-eva-ink/80">
                    {plant.sunlight?.map(s => s.replace(/_/g, ' ')).join(', ') || 'Not specified'}
                  </p>
                </div>
                
                <div className="bg-eva-greenLight/20 rounded-2xl p-6">
                  <h3 className="font-semibold text-eva-green mb-3 flex items-center gap-2">
                    🌱 Care Information
                  </h3>
                  <div className="space-y-2 text-eva-ink/80">
                    {plant.care_level && (
                      <p><strong>Care Level:</strong> {plant.care_level}</p>
                    )}
                    {plant.maintenance && (
                      <p><strong>Maintenance:</strong> {plant.maintenance}</p>
                    )}
                    {plant.soil && plant.soil.length > 0 && (
                      <p><strong>Soil Type:</strong> {plant.soil.join(', ')}</p>
                    )}
                    {plant.propagation && plant.propagation.length > 0 && (
                      <p><strong>Propagation:</strong> {plant.propagation.join(', ')}</p>
                    )}
                    {plant.pruning_month && plant.pruning_month.length > 0 && (
                      <p><strong>Pruning Months:</strong> {plant.pruning_month.join(', ')}</p>
                    )}
                  </div>
                </div>
                
                {plant.pest_susceptibility && plant.pest_susceptibility.length > 0 && (
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                    <h3 className="font-semibold text-eva-green mb-3 flex items-center gap-2">
                      🐛 Common Pests
                    </h3>
                    <p className="text-eva-ink/80">
                      {plant.pest_susceptibility.join(', ')}
                    </p>
                  </div>
                )}
                
                <div className="bg-eva-terracotta/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-eva-green mb-3">Plant Features</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={plant.drought_tolerant ? 'text-green-600' : 'text-gray-400'}>
                        {plant.drought_tolerant ? '✅' : '❌'}
                      </span>
                      <span>Drought Tolerant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={plant.salt_tolerant ? 'text-green-600' : 'text-gray-400'}>
                        {plant.salt_tolerant ? '✅' : '❌'}
                      </span>
                      <span>Salt Tolerant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={plant.tropical ? 'text-green-600' : 'text-gray-400'}>
                        {plant.tropical ? '✅' : '❌'}
                      </span>
                      <span>Tropical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={plant.invasive ? 'text-red-600' : 'text-green-600'}>
                        {plant.invasive ? '⚠️' : '✅'}
                      </span>
                      <span>Non-Invasive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}