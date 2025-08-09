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

    // Format Perenual API response with ALL available data
    formatPerenualDetails(data) {
        return {
            id: data.id,
            common_name: data.common_name,
            scientific_name: data.scientific_name || [],
            other_names: data.other_name || [],
            family: data.family,
            origin: data.origin || [],
            type: data.type,
            dimension: data.dimension,
            dimensions: {
                height: data.dimensions?.height || null,
                width: data.dimensions?.width || null,
                min_value: data.dimensions?.min_value,
                max_value: data.dimensions?.max_value,
                unit: data.dimensions?.unit
            },
            cycle: data.cycle,
            attracts: data.attracts || [],
            watering: data.watering,
            watering_period: data.watering_period,
            watering_general_benchmark: {
                value: data.watering_general_benchmark?.value,
                unit: data.watering_general_benchmark?.unit
            },
            depth_water_requirement: {
                value: data.depth_water_requirement?.value,
                unit: data.depth_water_requirement?.unit
            },
            volume_water_requirement: {
                value: data.volume_water_requirement?.value,
                unit: data.volume_water_requirement?.unit
            },
            sunlight: data.sunlight || [],
            pruning_month: data.pruning_month || [],
            pruning_count: {
                amount: data.pruning_count?.amount,
                interval: data.pruning_count?.interval
            },
            seeds: data.seeds,
            flowering_season: data.flowering_season,
            flower_color: data.flower_color,
            harvest_season: data.harvest_season,
            harvest_method: data.harvest_method,
            leaf: data.leaf,
            leaf_color: data.leaf_color || [],
            growth_rate: data.growth_rate,
            maintenance: data.maintenance,
            care_level: data.care_level,
            description: data.description,
            medicinal: data.medicinal,
            edible_leaf: data.edible_leaf,
            edible_fruit: data.edible_fruit,
            cuisine: data.cuisine,
            drought_tolerant: data.drought_tolerant,
            salt_tolerant: data.salt_tolerant,
            thorny: data.thorny,
            invasive: data.invasive,
            rare: data.rare,
            rare_level: data.rare_level,
            tropical: data.tropical,
            indoor: data.indoor,
            flowers: data.flowers,
            cones: data.cones,
            fruits: data.fruits,
            poisonous_to_pets: data.poisonous_to_pets,
            poisonous_to_humans: data.poisonous_to_humans,
            poison_effects_to_pets: data.poison_effects_to_pets,
            poison_effects_to_humans: data.poison_effects_to_humans,
            pest_susceptibility: data.pest_susceptibility || [],
            pest_susceptibility_api: data.pest_susceptibility_api,
            humidity: data.humidity,
            soil: data.soil || [],
            fertilizer: data.fertilizing,
            hardiness: {
                min: data.hardiness?.min,
                max: data.hardiness?.max
            },
            hardiness_location: {
                full_url: data.hardiness_location?.full_url,
                full_iframe: data.hardiness_location?.full_iframe
            },
            pruning_tips: data.pruning_tips,
            propagation: data.propagation || [],
            care_guides: data.care_guides,
            section: data.section || [],
            image: data.default_image?.original_url || data.default_image?.medium_url,
            images: {
                leaf: data.images?.leaf || [],
                flower: data.images?.flower || [],
                fruit: data.images?.fruit || [],
                bark: data.images?.bark || [],
                other: data.images?.other || []
            },
            source: 'perenual'
        };
    }

    // Format Trefle API response with ALL available data
    formatTrefleDetails(data) {
        return {
            id: data.id,
            common_name: data.common_name,
            scientific_name: data.scientific_name,
            slug: data.slug,
            family: data.family_common_name,
            family_scientific: data.family,
            genus: data.genus,
            year: data.year,
            bibliography: data.bibliography,
            author: data.author,
            status: data.status,
            rank: data.rank,
            synonyms: data.synonyms || [],
            observations: data.observations,
            vegetable: data.vegetable,
            edible: data.edible,
            edible_part: data.edible_part || [],
            
            // Distribution data
            distribution: {
                native: data.distribution?.native || [],
                introduced: data.distribution?.introduced || []
            },
            distributions: data.distributions,
            
            // Flower data
            flower: {
                color: data.flower?.color || [],
                conspicuous: data.flower?.conspicuous
            },
            
            // Foliage data  
            foliage: {
                texture: data.foliage?.texture,
                color: data.foliage?.color || [],
                leaf_retention: data.foliage?.leaf_retention,
                deciduous: data.foliage?.deciduous
            },
            
            // Fruit/Seed data
            fruit_or_seed: {
                conspicuous: data.fruit_or_seed?.conspicuous,
                color: data.fruit_or_seed?.color || [],
                shape: data.fruit_or_seed?.shape,
                seed_persistence: data.fruit_or_seed?.seed_persistence
            },
            
            // Growth specifications
            specifications: {
                ligneous_type: data.specifications?.ligneous_type,
                growth_form: data.specifications?.growth_form,
                growth_habit: data.specifications?.growth_habit,
                growth_rate: data.specifications?.growth_rate,
                average_height: data.specifications?.average_height,
                maximum_height: data.specifications?.maximum_height,
                nitrogen_fixation: data.specifications?.nitrogen_fixation,
                shape_orientation: data.specifications?.shape_orientation,
                toxicity: data.specifications?.toxicity
            },
            
            // Detailed growth data
            growth: {
                description: data.growth?.description,
                sowing: data.growth?.sowing,
                days_to_harvest: data.growth?.days_to_harvest,
                row_spacing: data.growth?.row_spacing,
                spread: data.growth?.spread,
                ph_minimum: data.growth?.ph_minimum,
                ph_maximum: data.growth?.ph_maximum,
                light: data.growth?.light,
                atmospheric_humidity: data.growth?.atmospheric_humidity,
                growth_months: data.growth?.growth_months || [],
                bloom_months: data.growth?.bloom_months || [],
                fruit_months: data.growth?.fruit_months || [],
                minimum_precipitation: data.growth?.minimum_precipitation,
                maximum_precipitation: data.growth?.maximum_precipitation,
                minimum_root_depth: data.growth?.minimum_root_depth,
                minimum_temperature: data.growth?.minimum_temperature,
                maximum_temperature: data.growth?.maximum_temperature,
                soil_nutriments: data.growth?.soil_nutriments,
                soil_salinity: data.growth?.soil_salinity,
                soil_texture: data.growth?.soil_texture,
                soil_humidity: data.growth?.soil_humidity,
                drought_tolerance: data.growth?.drought_tolerance,
                frost_tolerance: data.growth?.frost_tolerance,
                salinity_tolerance: data.growth?.salinity_tolerance,
                shade_tolerance: data.growth?.shade_tolerance,
                fertility_requirement: data.growth?.fertility_requirement
            },
            
            // Calculated/derived values
            watering: this.getTrefleWatering(data.growth),
            sunlight: this.getTrefleSunlight(data.growth),
            temperature_min: data.growth?.minimum_temperature?.deg_c,
            soil_ph_min: data.growth?.ph_minimum,
            soil_ph_max: data.growth?.ph_maximum,
            
            // Images
            image: data.image_url,
            images: data.images || {},
            
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