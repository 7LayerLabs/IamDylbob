'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SearchBar from '@/components/SearchBar'
import nhPlantsData from '@/data/nh-houseplants.json'
import { searchAllPlants, Plant } from '@/data/lib/plant-api-service'

export default function PlantDatabase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hybridResults, setHybridResults] = useState<Plant[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [useHybridSearch, setUseHybridSearch] = useState(false)
  const [filters, setFilters] = useState({
    difficulty: '',
    light: '',
    petSafe: '',
    waterFreq: ''
  })

  const ITEMS_PER_PAGE = 12

  // Initialize search from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const search = params.get('search')
    if (search) {
      setSearchTerm(search)
    }
  }, [])

  // Hybrid search with Trefle and OpenFarm
  useEffect(() => {
    if (!useHybridSearch || !searchTerm || searchTerm.length < 2) {
      setHybridResults([])
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await searchAllPlants(searchTerm)
        setHybridResults(results)
      } catch (error) {
        console.error('Hybrid search error:', error)
        setHybridResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, useHybridSearch])

  // Use hybrid results if available, otherwise filter local data
  const plantsToFilter = useHybridSearch && hybridResults.length > 0 ? hybridResults : nhPlantsData
  
  // Filter plants based on search and filters
  const filteredPlants = plantsToFilter.filter(plant => {
    // Search filter (skip for hybrid search as it's already filtered)
    if (searchTerm && !useHybridSearch) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = 
        plant.common_name.toLowerCase().includes(searchLower) ||
        plant.scientific_name.toLowerCase().includes(searchLower) ||
        (plant.family?.toLowerCase().includes(searchLower) || false) ||
        plant.description.toLowerCase().includes(searchLower)
      
      if (!matchesSearch) return false
    }

    // Difficulty filter
    if (filters.difficulty && plant.difficulty !== filters.difficulty) {
      return false
    }

    // Light filter
    if (filters.light) {
      if (!plant.light.toLowerCase().includes(filters.light.toLowerCase())) {
        return false
      }
    }

    // Pet safe filter
    if (filters.petSafe !== '') {
      const isPetSafe = plant.pet_safe
      if (filters.petSafe === 'true' && !isPetSafe) return false
      if (filters.petSafe === 'false' && isPetSafe) return false
    }

    // Water frequency filter
    if (filters.waterFreq && !plant.water.toLowerCase().includes(filters.waterFreq.toLowerCase())) {
      return false
    }

    return true
  })

  // Pagination
  const totalPages = Math.ceil(filteredPlants.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPlants = filteredPlants.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  const resetFilters = () => {
    setFilters({
      difficulty: '',
      light: '',
      petSafe: '',
      waterFreq: ''
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-eva-beige">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/rooted/images/textlogo.png"
              alt="Rooted with Eva"
              width={300}
              height={75}
              className="h-16 w-auto"
            />
          </div>
          
          <h1 className="text-[40px] font-headline font-bold text-eva-green text-center mb-4">
            NH Houseplant Library
          </h1>
          <p className="text-lg text-eva-ink/80 text-center mb-8">
            {nhPlantsData.length}+ plants perfect for New Hampshire homes
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm}
              placeholder="Search plants by name, family, or description..."
            />
            
            {/* Hybrid Search Toggle */}
            <div className="flex items-center justify-center mt-4 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useHybridSearch}
                  onChange={(e) => setUseHybridSearch(e.target.checked)}
                  className="w-4 h-4 text-eva-green rounded focus:ring-eva-green"
                />
                <span className="text-sm text-eva-ink/70">
                  🌐 Search Trefle botanical database
                </span>
              </label>
              {isSearching && (
                <span className="text-sm text-eva-terracotta animate-pulse">
                  Searching external sources...
                </span>
              )}
            </div>
          </div>
          
          {/* Filters */}
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
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">🌱 All Difficulty Levels</option>
                <option value="Easy">👶 Easy - Beginner Friendly</option>
                <option value="Moderate">👍 Moderate Care</option>
                <option value="Hard">👨‍🌾 Hard - Expert Level</option>
                <option value="Very Hard">🏆 Very Hard - Challenge</option>
              </select>
              
              <select
                value={filters.light}
                onChange={(e) => setFilters({...filters, light: e.target.value})}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">☀️ All Light Conditions</option>
                <option value="Low">🌑 Low Light</option>
                <option value="Moderate">⛅ Moderate Light</option>
                <option value="Bright Indirect">🌤️ Bright Indirect</option>
                <option value="Bright Direct">☀️ Direct Sun</option>
              </select>
              
              <select
                value={filters.petSafe}
                onChange={(e) => setFilters({...filters, petSafe: e.target.value})}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">🐾 All Pet Safety Levels</option>
                <option value="true">✅ Pet Safe Only</option>
                <option value="false">⚠️ Not Pet Safe</option>
              </select>
              
              <select
                value={filters.waterFreq}
                onChange={(e) => setFilters({...filters, waterFreq: e.target.value})}
                className="px-4 py-2 border border-eva-greenLight/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-eva-green/20"
              >
                <option value="">💧 All Watering Needs</option>
                <option value="Daily">💧💧💧 Daily</option>
                <option value="Weekly">💧💧 Weekly</option>
                <option value="Biweekly">💧 Biweekly</option>
                <option value="Monthly">🌵 Monthly</option>
              </select>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mb-4">
            <p className="text-eva-ink/60">
              {searchTerm ? (
                <>Found {filteredPlants.length} plants matching "{searchTerm}"</>
              ) : (
                <>Showing {paginatedPlants.length} of {filteredPlants.length} plants</>
              )}
              {totalPages > 1 && <> (Page {currentPage} of {totalPages})</>}
            </p>
          </div>
          
          {/* Plant Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedPlants.map(plant => (
              <Link
                key={plant.id}
                href={`/rooted/plant/${plant.id}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-eva-greenLight/20 group relative"
              >
                {/* Source Badge */}
                {'source' in plant && plant.source !== 'local' && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      plant.source === 'trefle' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      '🌿 Trefle'
                    </span>
                  </div>
                )}
                <div className="relative h-48 w-full overflow-hidden bg-eva-greenLight/10">
                  {plant.image ? (
                    <Image
                      src={plant.image}
                      alt={plant.common_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-6xl opacity-20">🌿</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-headline font-semibold text-lg text-eva-green mb-1 line-clamp-1">
                    {plant.common_name}
                  </h3>
                  <p className="text-sm text-eva-ink/60 italic mb-3 line-clamp-1">
                    {plant.scientific_name}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {plant.pet_safe && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                        ✅ Pet Safe
                      </span>
                    )}
                    {!plant.pet_safe && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                        ⚠️ Not Pet Safe
                      </span>
                    )}
                    {plant.air_purifying && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        🍃 Air Purifying
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                      ☀️ {plant.light.split(' ')[0]}
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      💧 {plant.water.split(' ')[0]}
                    </span>
                    {plant.difficulty === 'Easy' && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        👶 Easy
                      </span>
                    )}
                  </div>
                  
                  {/* NH Tip Preview */}
                  <p className="text-xs text-eva-ink/60 line-clamp-2 mb-2">
                    {plant.nh_tips}
                  </p>
                  
                  <div className="text-eva-terracotta font-medium text-sm">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* No results */}
          {filteredPlants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-eva-ink/60 text-lg mb-4">
                No plants found matching your criteria.
              </p>
              <p className="text-eva-ink/50">
                Try different search terms or adjust your filters.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {['Pothos', 'Snake Plant', 'Monstera', 'Peace Lily', 'Spider Plant'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchTerm(suggestion.toLowerCase())}
                    className="px-3 py-1 bg-eva-greenLight/20 hover:bg-eva-greenLight/30 rounded-full text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Pagination */}
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
        </div>
      </div>
    </main>
  )
}