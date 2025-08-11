'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SearchBar from '@/components/SearchBar'
import { fetchPlants, PerenualPlant, PerenualListResponse } from '@/data/lib/perenual-api'

export default function PlantDatabase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [plants, setPlants] = useState<PerenualPlant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPlants, setTotalPlants] = useState(0)
  
  const [filters, setFilters] = useState({
    watering: '',
    sunlight: '',
    petSafe: '',
    care_level: ''
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const search = params.get('search')
    if (search) {
      setSearchTerm(search)
    }
    loadPlants()
  }, [currentPage, filters])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1)
      loadPlants()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const loadPlants = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const options: any = {}
      
      if (searchTerm) options.q = searchTerm
      // Always show indoor plants (set in API service)
      if (filters.watering) options.watering = filters.watering
      if (filters.sunlight) options.sunlight = filters.sunlight
      if (filters.petSafe) options.poisonous = filters.petSafe === 'false'
      
      const response: PerenualListResponse = await fetchPlants(currentPage, options)
      setPlants(response.data)
      setTotalPages(response.last_page)
      setTotalPlants(response.total)
    } catch (err) {
      setError('Failed to load plants. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      watering: '',
      sunlight: '',
      petSafe: '',
      care_level: ''
    })
    setCurrentPage(1)
  }

  const getPoisonousLabel = (poisonousToHumans: number, poisonousToPets: number) => {
    if (poisonousToHumans === 0 && poisonousToPets === 0) return '✅ Pet Safe'
    if (poisonousToPets > 0 && poisonousToHumans > 0) return '⚠️ Toxic'
    if (poisonousToPets > 0) return '🐾 Toxic to Pets'
    if (poisonousToHumans > 0) return '👤 Toxic to Humans'
    return 'Unknown'
  }

  const getPoisonousColor = (poisonousToHumans: number, poisonousToPets: number) => {
    if (poisonousToHumans === 0 && poisonousToPets === 0) return 'bg-green-100 text-green-800 font-semibold'
    return 'bg-red-100 text-red-800'
  }

  return (
    <main className="min-h-screen bg-eva-beige">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/textlogo.png"
              alt="Rooted with Eva"
              width={300}
              height={75}
              className="h-16 w-auto"
            />
          </div>
          
          <h1 className="text-[40px] font-headline font-bold text-eva-green text-center mb-4">
            Houseplant Database
          </h1>
          <p className="text-lg text-eva-ink/80 text-center mb-8">
            Discover the perfect indoor plants for your home from thousands of varieties
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm}
              placeholder="Search plants by name..."
            />
          </div>
          
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-eva-greenLight/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-eva-green">Filter Plants</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-eva-terracotta hover:text-eva-terracotta/80"
              >
                Clear Filters
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.petSafe}
                onChange={(e) => {
                  setFilters({...filters, petSafe: e.target.value})
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">🐾 All Pet Safety Levels</option>
                <option value="true">✅ Pet Safe Only</option>
                <option value="false">⚠️ Include Toxic Plants</option>
              </select>
              
              <select
                value={filters.sunlight}
                onChange={(e) => {
                  setFilters({...filters, sunlight: e.target.value})
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">☀️ All Light Conditions</option>
                <option value="full_shade">🌑 Low Light</option>
                <option value="part_shade">⛅ Medium Light</option>
                <option value="sun-part_shade">🌤️ Bright Indirect</option>
                <option value="full_sun">☀️ Direct Sun</option>
              </select>
              
              <select
                value={filters.watering}
                onChange={(e) => {
                  setFilters({...filters, watering: e.target.value})
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">💧 All Watering Needs</option>
                <option value="frequent">💧💧💧 High (Frequent)</option>
                <option value="average">💧💧 Medium (Weekly)</option>
                <option value="minimum">💧 Low (Biweekly)</option>
                <option value="none">🌵 Very Low (Monthly)</option>
              </select>
              
              <select
                value={filters.care_level}
                onChange={(e) => {
                  setFilters({...filters, care_level: e.target.value})
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">🌱 All Care Levels</option>
                <option value="easy">👶 Beginner Friendly</option>
                <option value="moderate">👍 Moderate Care</option>
                <option value="high">👨‍🌾 Expert Level</option>
              </select>
            </div>
          </div>
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-eva-green"></div>
              <p className="mt-4 text-eva-ink/60">Loading plants...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <>
              <div className="mb-4">
                <p className="text-eva-ink/60">
                  Showing {plants.length} plants (Page {currentPage} of {totalPages})
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plants.map(plant => (
                  <Link
                    key={plant.id}
                    href={`/plant/${plant.id}`}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-eva-greenLight/20 group"
                  >
                    {plant.default_image ? (
                      <div className="relative h-48 w-full overflow-hidden bg-eva-greenLight/10">
                        <Image
                          src={plant.default_image.medium_url}
                          alt={plant.common_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-eva-greenLight/10 flex items-center justify-center">
                        <span className="text-6xl opacity-20">🌿</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-headline font-semibold text-lg text-eva-green mb-1 line-clamp-1">
                        {plant.common_name}
                      </h3>
                      <p className="text-sm text-eva-ink/60 italic mb-3 line-clamp-1">
                        {plant.scientific_name?.[0] || 'Unknown species'}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          getPoisonousColor(plant.poisonous_to_humans, plant.poisonous_to_pets)
                        }`}>
                          {getPoisonousLabel(plant.poisonous_to_humans, plant.poisonous_to_pets)}
                        </span>
                        {plant.indoor && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                            🏠 Indoor
                          </span>
                        )}
                        {plant.sunlight?.[0] && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            ☀️ {plant.sunlight[0].replace(/_/g, ' ')}
                          </span>
                        )}
                        {plant.watering && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            💧 {plant.watering}
                          </span>
                        )}
                        {plant.care_level && (
                          <span className="text-xs px-2 py-1 bg-eva-greenLight/30 rounded-full">
                            {plant.care_level} care
                          </span>
                        )}
                        {plant.edible_fruit && (
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                            🍎 Edible
                          </span>
                        )}
                        {plant.medicinal && (
                          <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                            💊 Medicinal
                          </span>
                        )}
                        {plant.flowers && (
                          <span className="text-xs px-2 py-1 bg-pink-100 text-pink-800 rounded-full">
                            🌸 Flowers
                          </span>
                        )}
                      </div>
                      
                      <div className="text-eva-terracotta font-medium text-sm">
                        View Details →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {plants.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-eva-ink/60">
                    No plants found. Try adjusting your search or filters.
                  </p>
                </div>
              )}
              
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white rounded-xl border border-eva-greenLight/30 disabled:opacity-50 hover:bg-eva-greenLight/10"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = currentPage <= 3 
                        ? i + 1 
                        : currentPage >= totalPages - 2 
                          ? totalPages - 4 + i
                          : currentPage - 2 + i;
                      
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-eva-green text-white'
                              : 'bg-white hover:bg-eva-greenLight/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white rounded-xl border border-eva-greenLight/30 disabled:opacity-50 hover:bg-eva-greenLight/10"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}