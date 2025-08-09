// Plant API Service - Combines Perenual and Trefle APIs
const PERENUAL_API_KEY = 'sk-wVqv6896adbe8276911757';
const TREFLE_API_KEY = 'UNjljjfkmiIhT5QgTjAUyjQm5pl0aC51fCF93l6J4yI';

// Cache to store API results and reduce calls
const plantCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class PlantAPIService {
    constructor() {
        this.perenualBase = 'https://perenual.com/api';
        this.trefleBase = 'https://trefle.io/api/v1';
    }

    // Search for plants by name using both APIs
    async searchPlants(query) {
        const cacheKey = `search_${query.toLowerCase()}`;
        
        // Check cache first
        if (this.getCached(cacheKey)) {
            return this.getCached(cacheKey);
        }

        let results = {
            perenual: [],
            trefle: [],
            combined: []
        };

        // Search Perenual (primary)
        try {
            const perenualResponse = await fetch(
                `${this.perenualBase}/species-list?key=${PERENUAL_API_KEY}&q=${encodeURIComponent(query)}`
            );
            if (perenualResponse.ok) {
                const data = await perenualResponse.json();
                results.perenual = data.data || [];
            }
        } catch (error) {
            console.error('Perenual search error:', error);
        }

        // Search Trefle (secondary/fallback)
        try {
            const trefleResponse = await fetch(
                `${this.trefleBase}/plants/search?token=${TREFLE_API_KEY}&q=${encodeURIComponent(query)}`
            );
            if (trefleResponse.ok) {
                const data = await trefleResponse.json();
                results.trefle = data.data || [];
            }
        } catch (error) {
            console.error('Trefle search error:', error);
        }

        // Combine and deduplicate results
        results.combined = this.combineSearchResults(results.perenual, results.trefle);
        
        // Cache the results
        this.setCache(cacheKey, results.combined);
        
        return results.combined;
    }

    // Get detailed plant information by ID or name
    async getPlantDetails(plantId, source = 'perenual') {
        const cacheKey = `details_${source}_${plantId}`;
        
        // Check cache
        if (this.getCached(cacheKey)) {
            return this.getCached(cacheKey);
        }

        let details = null;

        if (source === 'perenual') {
            try {
                const response = await fetch(
                    `${this.perenualBase}/species/details/${plantId}?key=${PERENUAL_API_KEY}`
                );
                if (response.ok) {
                    const data = await response.json();
                    details = this.formatPerenualDetails(data);
                }
            } catch (error) {
                console.error('Perenual details error:', error);
            }
        } else if (source === 'trefle') {
            try {
                const response = await fetch(
                    `${this.trefleBase}/plants/${plantId}?token=${TREFLE_API_KEY}`
                );
                if (response.ok) {
                    const data = await response.json();
                    details = this.formatTrefleDetails(data.data);
                }
            } catch (error) {
                console.error('Trefle details error:', error);
            }
        }

        if (details) {
            this.setCache(cacheKey, details);
        }

        return details;
    }

    // Get care guide for a plant
    async getPlantCareGuide(plantName) {
        const cacheKey = `care_${plantName.toLowerCase()}`;
        
        if (this.getCached(cacheKey)) {
            return this.getCached(cacheKey);
        }

        // First search for the plant
        const searchResults = await this.searchPlants(plantName);
        if (!searchResults || searchResults.length === 0) {
            return null;
        }

        // Get the first/best match
        const plant = searchResults[0];
        
        // Get detailed care information
        const details = await this.getPlantDetails(plant.id, plant.source);
        
        if (details) {
            const careGuide = {
                name: details.common_name,
                scientific_name: details.scientific_name,
                watering: details.watering || 'Moderate',
                watering_period: details.watering_period || 'Weekly',
                sunlight: details.sunlight || ['Partial sun'],
                care_level: details.care_level || 'Medium',
                description: details.description,
                maintenance: details.maintenance,
                growth_rate: details.growth_rate,
                drought_tolerant: details.drought_tolerant,
                indoor: details.indoor,
                poisonous_to_pets: details.poisonous_to_pets,
                poisonous_to_humans: details.poisonous_to_humans,
                temperature_min: details.temperature_min,
                humidity: details.humidity,
                soil_type: details.soil,
                fertilizer: details.fertilizer,
                pruning: details.pruning_tips,
                propagation: details.propagation,
                image: details.image
            };
            
            this.setCache(cacheKey, careGuide);
            return careGuide;
        }

        return null;
    }

    // Format Perenual API response
    formatPerenualDetails(data) {
        return {
            id: data.id,
            common_name: data.common_name,
            scientific_name: data.scientific_name || [],
            other_names: data.other_name || [],
            watering: data.watering,
            watering_period: data.watering_period,
            sunlight: data.sunlight || [],
            care_level: data.care_level,
            description: data.description,
            maintenance: data.maintenance,
            growth_rate: data.growth_rate,
            drought_tolerant: data.drought_tolerant,
            indoor: data.indoor,
            poisonous_to_pets: data.poisonous_to_pets,
            poisonous_to_humans: data.poisonous_to_humans,
            humidity: data.humidity,
            soil: data.soil || [],
            fertilizer: data.fertilizing,
            pruning_tips: data.pruning_tips,
            propagation: data.propagation || [],
            image: data.default_image?.original_url || data.default_image?.medium_url,
            source: 'perenual'
        };
    }

    // Format Trefle API response
    formatTrefleDetails(data) {
        return {
            id: data.id,
            common_name: data.common_name,
            scientific_name: data.scientific_name,
            family: data.family_common_name,
            watering: this.getTrefleWatering(data.growth),
            sunlight: this.getTrefleSunlight(data.growth),
            temperature_min: data.growth?.minimum_temperature?.deg_c,
            growth_rate: data.specifications?.growth_rate,
            drought_tolerant: data.growth?.drought_tolerance,
            soil_ph_min: data.growth?.ph_minimum,
            soil_ph_max: data.growth?.ph_maximum,
            fertilizer: data.growth?.fertility_requirement,
            image: data.image_url,
            source: 'trefle'
        };
    }

    // Convert Trefle growth data to watering recommendation
    getTrefleWatering(growth) {
        if (!growth) return 'Moderate';
        
        const moisture = growth.minimum_precipitation?.mm || 0;
        if (moisture < 200) return 'Minimal';
        if (moisture < 500) return 'Low';
        if (moisture < 1000) return 'Moderate';
        return 'Frequent';
    }

    // Convert Trefle light data to sunlight requirement
    getTrefleSunlight(growth) {
        if (!growth) return ['Partial sun'];
        
        const light = growth.light;
        if (light === 0) return ['Full shade'];
        if (light <= 3) return ['Partial shade'];
        if (light <= 6) return ['Partial sun'];
        if (light <= 8) return ['Full sun to partial shade'];
        return ['Full sun'];
    }

    // Combine search results from both APIs
    combineSearchResults(perenualResults, trefleResults) {
        const combined = [];
        const seen = new Set();

        // Add Perenual results (primary)
        perenualResults.forEach(plant => {
            const formatted = {
                id: plant.id,
                common_name: plant.common_name,
                scientific_name: plant.scientific_name || [],
                image: plant.default_image?.thumbnail || plant.default_image?.small_url,
                source: 'perenual'
            };
            combined.push(formatted);
            seen.add(plant.common_name.toLowerCase());
        });

        // Add unique Trefle results
        trefleResults.forEach(plant => {
            if (!seen.has(plant.common_name?.toLowerCase())) {
                combined.push({
                    id: plant.id,
                    common_name: plant.common_name,
                    scientific_name: plant.scientific_name,
                    image: plant.image_url,
                    source: 'trefle'
                });
            }
        });

        return combined;
    }

    // Cache management
    getCached(key) {
        const cached = plantCache.get(key);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        plantCache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        plantCache.clear();
    }
}

// Create singleton instance
const plantAPI = new PlantAPIService();

// Export for use in other modules
window.plantAPI = plantAPI;