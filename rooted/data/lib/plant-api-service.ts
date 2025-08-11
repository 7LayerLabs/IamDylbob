// Combined Plant API Service
// Uses local NH database as primary, with Trefle and OpenFarm as supplements

import nhPlantsData from '@/data/nh-houseplants.json'

// Trefle API configuration
const TREFLE_API_KEY = process.env.NEXT_PUBLIC_TREFLE_API_KEY || ''
const TREFLE_BASE_URL = 'https://trefle.io/api/v1'

// OpenFarm API (service shut down April 2025)
// const OPENFARM_BASE_URL = 'https://openfarm.cc/api/v1'

export interface Plant {
  id: string
  common_name: string
  scientific_name: string
  family?: string
  light: string
  water: string
  humidity?: string
  temperature?: string
  pet_safe: boolean
  air_purifying: boolean
  difficulty: string
  growth_rate?: string
  mature_size?: string
  nh_tips?: string
  description: string
  image?: string
  source: 'local' | 'trefle' | 'openfarm'
  care_guides?: any
}

// Search local NH plants database
export function searchLocalPlants(query: string): Plant[] {
  const searchLower = query.toLowerCase()
  return nhPlantsData
    .filter(plant => 
      plant.common_name.toLowerCase().includes(searchLower) ||
      plant.scientific_name.toLowerCase().includes(searchLower) ||
      plant.family.toLowerCase().includes(searchLower) ||
      plant.description.toLowerCase().includes(searchLower)
    )
    .map(plant => ({
      ...plant,
      source: 'local' as const
    }))
}

// Search Trefle API (if API key is configured)
export async function searchTreflePlants(query: string): Promise<Plant[]> {
  if (!TREFLE_API_KEY) {
    return [] // Skip if no API key
  }

  try {
    const response = await fetch(
      `${TREFLE_BASE_URL}/plants/search?token=${TREFLE_API_KEY}&q=${query}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!response.ok) {
      console.error('Trefle API error:', response.status)
      return []
    }

    const data = await response.json()
    
    return data.data.map((plant: any) => ({
      id: `trefle-${plant.id}`,
      common_name: plant.common_name || plant.scientific_name,
      scientific_name: plant.scientific_name,
      family: plant.family,
      light: mapTrefleLight(plant.light),
      water: mapTrefleWater(plant.minimum_precipitation?.mm),
      pet_safe: false, // Trefle doesn't provide this directly
      air_purifying: false,
      difficulty: 'Moderate',
      description: `${plant.common_name} is a ${plant.family_common_name || plant.family} plant.`,
      image: plant.image_url,
      source: 'trefle' as const
    }))
  } catch (error) {
    console.error('Trefle API error:', error)
    return []
  }
}

// OpenFarm API - Service shut down April 2025
export async function searchOpenFarmCrops(query: string): Promise<Plant[]> {
  // OpenFarm has been shut down, returning empty array
  return []
}

// Combined search across all sources
export async function searchAllPlants(query: string): Promise<Plant[]> {
  // Always search local first
  const localResults = searchLocalPlants(query)
  
  // If we have good local results, just return those
  if (localResults.length >= 5) {
    return localResults
  }

  // Otherwise, supplement with Trefle API
  const trefleResults = await searchTreflePlants(query)

  // Combine and deduplicate results
  const allResults = [...localResults]
  const seenNames = new Set(localResults.map(p => p.common_name.toLowerCase()))

  // Add Trefle results that aren't duplicates
  for (const plant of trefleResults) {
    if (!seenNames.has(plant.common_name.toLowerCase())) {
      allResults.push(plant)
      seenNames.add(plant.common_name.toLowerCase())
    }
  }

  return allResults
}

// Get plant by ID
export async function getPlantById(id: string): Promise<Plant | null> {
  // Check if it's a local plant
  const localPlant = nhPlantsData.find(p => p.id === id)
  if (localPlant) {
    return { ...localPlant, source: 'local' as const }
  }

  // Check if it's a Trefle plant
  if (id.startsWith('trefle-')) {
    const trefleId = id.replace('trefle-', '')
    return getTreflePlantById(trefleId)
  }

  // OpenFarm has been shut down
  // if (id.startsWith('openfarm-')) {
  //   const openFarmId = id.replace('openfarm-', '')
  //   return getOpenFarmCropById(openFarmId)
  // }

  return null
}

// Get Trefle plant details
async function getTreflePlantById(id: string): Promise<Plant | null> {
  if (!TREFLE_API_KEY) {
    return null
  }

  try {
    const response = await fetch(
      `${TREFLE_BASE_URL}/plants/${id}?token=${TREFLE_API_KEY}`
    )
    
    if (!response.ok) return null

    const data = await response.json()
    const plant = data.data

    return {
      id: `trefle-${plant.id}`,
      common_name: plant.common_name || plant.scientific_name,
      scientific_name: plant.scientific_name,
      family: plant.family,
      light: mapTrefleLight(plant.main_species.light),
      water: mapTrefleWater(plant.main_species.minimum_precipitation?.mm),
      humidity: plant.main_species.atmospheric_humidity ? `${plant.main_species.atmospheric_humidity}%` : 'Average',
      temperature: plant.main_species.minimum_temperature ? 
        `${plant.main_species.minimum_temperature.deg_c}°C - ${plant.main_species.maximum_temperature?.deg_c}°C` : 
        '65-75°F',
      pet_safe: plant.main_species.toxicity === 'none',
      air_purifying: false,
      difficulty: plant.main_species.growth_rate === 'slow' ? 'Hard' : 'Moderate',
      growth_rate: plant.main_species.growth_rate,
      mature_size: plant.main_species.maximum_height?.cm ? 
        `${plant.main_species.maximum_height.cm} cm` : 
        'Variable',
      description: plant.main_species.observations || `${plant.common_name} care information`,
      image: plant.image_url,
      source: 'trefle' as const
    }
  } catch (error) {
    console.error('Trefle API error:', error)
    return null
  }
}

// OpenFarm service has been shut down April 2025
// async function getOpenFarmCropById(id: string): Promise<Plant | null> {
//   return null
// }

// Helper functions to map API data
function mapTrefleLight(light: number | null): string {
  if (!light) return 'Moderate'
  if (light <= 3) return 'Low'
  if (light <= 6) return 'Moderate'
  if (light <= 8) return 'Bright Indirect'
  return 'Bright Direct'
}

function mapTrefleWater(mm: number | null): string {
  if (!mm) return 'Weekly'
  if (mm < 100) return 'Monthly'
  if (mm < 500) return 'Biweekly'
  if (mm < 1000) return 'Weekly'
  return 'Daily'
}

function mapOpenFarmSunRequirements(req: string | null): string {
  if (!req) return 'Moderate'
  const lower = req.toLowerCase()
  if (lower.includes('full shade')) return 'Low'
  if (lower.includes('partial')) return 'Bright Indirect'
  if (lower.includes('full sun')) return 'Bright Direct'
  return 'Moderate'
}

// Get placeholder image for plants without images
export function getPlantPlaceholderImage(plantName: string): string {
  // Use a stable placeholder service
  return `https://via.placeholder.com/400x400/C8E6C9/2E7D32?text=${encodeURIComponent(plantName)}`
}