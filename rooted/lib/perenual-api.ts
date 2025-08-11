const API_KEY = 'sk-QF8768996e7f555c711788';
const BASE_URL = 'https://perenual.com/api';

export interface PerenualPlant {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name: string[];
  family: string | null;
  origin: string[] | null;
  type: string;
  dimension: string;
  dimensions: {
    type: string | null;
    min_value: number | null;
    max_value: number | null;
    unit: string | null;
  };
  cycle: string;
  attracts: string[] | null;
  propagation: string[];
  hardiness: {
    min: string;
    max: string;
  };
  hardiness_location: {
    full_url: string;
    full_iframe: string;
  };
  watering: string;
  depth_water_requirement: {
    unit: string;
    value: string;
  } | null;
  volume_water_requirement: {
    unit: string;
    value: string;
  } | null;
  watering_period: string | null;
  watering_general_benchmark: {
    value: string;
    unit: string;
  };
  plant_anatomy: {
    bark: string | null;
    leaves: string | null;
  }[];
  sunlight: string[];
  pruning_month: string[] | null;
  pruning_count: {
    amount: number | null;
    interval: string | null;
  };
  seeds: number | null;
  maintenance: string | null;
  care_guides: string;
  soil: string[] | null;
  growth_rate: string;
  drought_tolerant: boolean;
  salt_tolerant: boolean;
  thorny: boolean;
  invasive: boolean;
  tropical: boolean;
  indoor: boolean;
  care_level: string | null;
  pest_susceptibility: string[] | null;
  pest_susceptibility_api: string;
  flowers: boolean;
  flowering_season: string | null;
  flower_color: string;
  cones: boolean;
  fruits: boolean;
  edible_fruit: boolean;
  edible_fruit_taste_profile: string | null;
  fruit_nutritional_value: string | null;
  fruit_color: string[] | null;
  harvest_season: string | null;
  leaf: boolean;
  leaf_color: string[];
  edible_leaf: boolean;
  cuisine: boolean;
  medicinal: boolean;
  poisonous_to_humans: number;
  poisonous_to_pets: number;
  description: string;
  default_image: {
    license: number;
    license_name: string;
    license_url: string;
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
  } | null;
  other_images: string;
}

export interface PerenualListResponse {
  data: PerenualPlant[];
  to: number;
  per_page: number;
  current_page: number;
  from: number;
  last_page: number;
  total: number;
}

export interface PerenualDetailResponse extends PerenualPlant {
  watering_info?: string;
  sunlight_info?: string;
  pruning_info?: string;
  care_guides_data?: {
    id: number;
    species_id: number;
    common_name: string;
    scientific_name: string[];
    section: {
      id: number;
      type: string;
      description: string;
    }[];
  };
}

// Fetch list of plants with pagination and filters
export async function fetchPlants(
  page: number = 1,
  options: {
    q?: string; // search query
    indoor?: boolean;
    edible?: boolean;
    poisonous?: boolean;
    cycle?: string;
    watering?: string;
    sunlight?: string;
  } = {}
): Promise<PerenualListResponse> {
  const params = new URLSearchParams({
    key: API_KEY,
    page: page.toString(),
    per_page: '30',
    // Always filter for indoor plants by default
    indoor: 'true',
  });

  // Add optional filters
  if (options.q) params.append('q', options.q);
  // Override indoor filter if explicitly set to false
  if (options.indoor === false) {
    params.set('indoor', 'false');
  }
  if (options.edible !== undefined) params.append('edible', options.edible.toString());
  if (options.poisonous !== undefined) params.append('poisonous', options.poisonous.toString());
  if (options.cycle) params.append('cycle', options.cycle);
  if (options.watering) params.append('watering', options.watering);
  if (options.sunlight) params.append('sunlight', options.sunlight);

  const response = await fetch(`${BASE_URL}/species-list?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Fetch detailed information about a specific plant
export async function fetchPlantDetails(id: number): Promise<PerenualDetailResponse> {
  const response = await fetch(`${BASE_URL}/species/details/${id}?key=${API_KEY}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Fetch care guide for a specific plant
export async function fetchPlantCareGuide(id: number) {
  const response = await fetch(`${BASE_URL}/species-care-guide/${id}?key=${API_KEY}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Search for plants by name
export async function searchPlants(query: string, page: number = 1): Promise<PerenualListResponse> {
  return fetchPlants(page, { q: query });
}

// Get indoor plants
export async function fetchIndoorPlants(page: number = 1): Promise<PerenualListResponse> {
  return fetchPlants(page, { indoor: true });
}

// Get pet-safe plants
export async function fetchPetSafePlants(page: number = 1): Promise<PerenualListResponse> {
  return fetchPlants(page, { poisonous: false });
}