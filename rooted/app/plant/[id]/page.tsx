'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import nhPlantsData from '@/data/nh-houseplants.json'
import { getPlantById, Plant } from '@/data/lib/plant-api-service'

export default function PlantDetail({ params }: { params: { id: string } }) {
  const [plant, setPlant] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPlant() {
      setIsLoading(true)
      try {
        // Try to get plant from hybrid service (handles local, Trefle, and OpenFarm)
        const hybridPlant = await getPlantById(params.id)
        if (hybridPlant) {
          setPlant(hybridPlant)
        } else {
          // Fallback to local data
          const foundPlant = nhPlantsData.find(p => p.id === params.id)
          setPlant(foundPlant)
        }
      } catch (error) {
        console.error('Error loading plant:', error)
        // Fallback to local data
        const foundPlant = nhPlantsData.find(p => p.id === params.id)
        setPlant(foundPlant)
      } finally {
        setIsLoading(false)
      }
    }
    loadPlant()
  }, [params.id])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-eva-beige">
        <Navigation />
        <div className="px-8 lg:px-16 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-eva-greenLight/20 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-eva-greenLight/20 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </main>
    )
  }

  if (!plant) {
    return (
      <main className="min-h-screen bg-eva-beige">
        <Navigation />
        <div className="px-8 lg:px-16 py-12 text-center">
          <h1 className="text-2xl font-bold text-eva-green mb-4">Plant Not Found</h1>
          <Link href="/rooted/plant-database" className="text-eva-terracotta hover:underline">
            Return to Plant Database
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-eva-beige">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/rooted/plant-database"
            className="inline-flex items-center gap-2 text-eva-terracotta hover:text-eva-terracotta/80 mb-6"
          >
            ← Back to Plant Library
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left side - Image and Quick Facts */}
            <div>
              {plant.image ? (
                <div className="relative h-96 w-full overflow-hidden bg-eva-greenLight/10 rounded-2xl">
                  <Image
                    src={plant.image}
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
              
              {/* Quick Facts Card */}
              <div className="mt-6 bg-white rounded-2xl p-6 border border-eva-greenLight/20">
                <h3 className="font-headline font-semibold text-lg text-eva-green mb-4">Quick Facts</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-eva-ink/60">Scientific Name</dt>
                    <dd className="font-medium italic">{plant.scientific_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-eva-ink/60">Family</dt>
                    <dd className="font-medium">{plant.family}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-eva-ink/60">Mature Size</dt>
                    <dd className="font-medium">{plant.mature_size}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-eva-ink/60">Growth Rate</dt>
                    <dd className="font-medium">{plant.growth_rate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-eva-ink/60">Difficulty</dt>
                    <dd className="font-medium">{plant.difficulty}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Right side - Plant Information */}
            <div>
              <h1 className="text-[36px] font-headline font-bold text-eva-green mb-2">
                {plant.common_name}
              </h1>
              <p className="text-lg text-eva-ink/60 italic mb-4">
                {plant.scientific_name}
              </p>
              
              {/* Source Indicator */}
              {'source' in plant && plant.source !== 'local' && (
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full ${
                    plant.source === 'trefle' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    '🌿 Data from Trefle'
                  </span>
                </div>
              )}
              
              {/* Safety and Features Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {plant.pet_safe ? (
                  <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full font-semibold">
                    ✅ Pet & Human Safe
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full">
                    ⚠️ Not Pet Safe
                  </span>
                )}
                {plant.air_purifying && (
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full">
                    🍃 Air Purifying
                  </span>
                )}
                <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full">
                  {plant.difficulty === 'Easy' ? '👶' : plant.difficulty === 'Moderate' ? '👍' : '👨‍🌾'} {plant.difficulty}
                </span>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-eva-green mb-3">About This Plant</h2>
                <p className="text-eva-ink/80 leading-relaxed">{plant.description}</p>
              </div>
              
              {/* NH Growing Tips */}
              <div className="mb-8 bg-eva-greenLight/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-eva-green mb-3 flex items-center gap-2">
                  🏔️ New Hampshire Growing Tips
                </h2>
                <p className="text-eva-ink/80 leading-relaxed">{plant.nh_tips}</p>
              </div>
              
              {/* Care Information Grid */}
              <div className="space-y-6">
                {/* Light Requirements */}
                <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                  <h3 className="font-semibold text-eva-green mb-3 flex items-center gap-2">
                    ☀️ Light Requirements
                  </h3>
                  <p className="text-eva-ink/80 font-medium mb-2">{plant.light}</p>
                  <p className="text-sm text-eva-ink/60">
                    {plant.light.includes('Low') && 'Can tolerate darker corners and north-facing windows.'}
                    {plant.light.includes('Moderate') && 'Prefers east or west-facing windows with filtered light.'}
                    {plant.light.includes('Bright Indirect') && 'Needs bright light but avoid direct sun which can burn leaves.'}
                    {plant.light.includes('Bright Direct') && 'Loves direct sunlight - perfect for south-facing windows.'}
                  </p>
                </div>
                
                {/* Watering */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-eva-green mb-3 flex items-center gap-2">
                    💧 Watering Schedule
                  </h3>
                  <p className="text-eva-ink/80 font-medium mb-2">{plant.water}</p>
                  <p className="text-sm text-eva-ink/60">
                    {plant.water.includes('Daily') && 'Keep soil consistently moist. Check daily, especially in NH\'s dry winter air.'}
                    {plant.water.includes('Weekly') && 'Water when top inch of soil is dry, typically once a week.'}
                    {plant.water.includes('Biweekly') && 'Allow soil to dry out partially between waterings.'}
                    {plant.water.includes('Monthly') && 'Very drought tolerant. Let soil dry completely between waterings.'}
                  </p>
                </div>
                
                {/* Environment */}
                <div className="bg-eva-greenLight/20 rounded-2xl p-6">
                  <h3 className="font-semibold text-eva-green mb-3">🌡️ Environment</h3>
                  <div className="grid grid-cols-2 gap-4 text-eva-ink/80">
                    <div>
                      <span className="font-medium">Temperature:</span>
                      <p className="text-sm">{plant.temperature}</p>
                    </div>
                    <div>
                      <span className="font-medium">Humidity:</span>
                      <p className="text-sm">{plant.humidity}</p>
                      {plant.humidity.includes('High') && (
                        <p className="text-xs text-eva-ink/60 mt-1">Use humidifier or pebble tray in dry NH winters</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Care Tips */}
                <div className="bg-eva-terracotta/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-eva-green mb-3">💡 Care Tips</h3>
                  <ul className="space-y-2 text-sm text-eva-ink/80">
                    {plant.difficulty === 'Easy' && (
                      <>
                        <li>• Perfect for beginners - very forgiving</li>
                        <li>• Tolerates occasional neglect</li>
                      </>
                    )}
                    {plant.difficulty === 'Moderate' && (
                      <>
                        <li>• Requires regular attention but not fussy</li>
                        <li>• Monitor watering and light conditions</li>
                      </>
                    )}
                    {plant.difficulty === 'Hard' && (
                      <>
                        <li>• Needs consistent care and attention</li>
                        <li>• Monitor humidity and temperature closely</li>
                      </>
                    )}
                    {plant.air_purifying && <li>• Helps clean indoor air of toxins</li>}
                    {plant.pet_safe && <li>• Safe around curious pets and children</li>}
                    {!plant.pet_safe && <li>• ⚠️ Keep away from pets and children</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}