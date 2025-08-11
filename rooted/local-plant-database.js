// Local Plant Database - Fallback when APIs are unavailable
const localPlantDatabase = {
    plants: [
        {
            id: 'local-1',
            common_name: 'Pothos',
            scientific_name: 'Epipremnum aureum',
            watering: 'Moderate',
            watering_days: 7,
            sunlight: ['Indirect light', 'Low light tolerant'],
            care_level: 'Easy',
            description: 'Pothos is one of the easiest houseplants to grow. It thrives in various light conditions and is very forgiving if you forget to water occasionally.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            humidity: 40,
            soil: ['Well-draining potting mix'],
            pruning_tips: 'Trim to control length and promote bushiness. Cut just below a node.',
            propagation: ['Stem cuttings in water or soil']
        },
        {
            id: 'local-2',
            common_name: 'Snake Plant',
            scientific_name: 'Sansevieria trifasciata',
            watering: 'Low',
            watering_days: 14,
            sunlight: ['Full sun', 'Partial shade', 'Low light tolerant'],
            care_level: 'Easy',
            description: 'Snake plants are nearly indestructible. They can survive weeks without water and thrive in various light conditions.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            drought_tolerant: true,
            soil: ['Well-draining', 'Cactus mix', 'Sandy'],
            pruning_tips: 'Remove damaged leaves at the base. Divide when overcrowded.'
        },
        {
            id: 'local-3',
            common_name: 'Monstera',
            scientific_name: 'Monstera deliciosa',
            watering: 'Moderate',
            watering_days: 7,
            sunlight: ['Bright indirect light'],
            care_level: 'Easy',
            description: 'Monstera is a popular tropical plant with distinctive split leaves. It grows quickly and can become quite large.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            humidity: 60,
            soil: ['Well-draining potting mix', 'Rich in organic matter'],
            pruning_tips: 'Prune in spring to control size. Cut above a node for bushier growth.'
        },
        {
            id: 'local-4',
            common_name: 'Peace Lily',
            scientific_name: 'Spathiphyllum',
            watering: 'Frequent',
            watering_days: 5,
            sunlight: ['Low to medium light'],
            care_level: 'Easy',
            description: 'Peace lilies are known for their white flowers and ability to thrive in low light. They droop when thirsty, making watering easy.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            humidity: 50,
            flowering_season: 'Spring and Summer'
        },
        {
            id: 'local-5',
            common_name: 'Spider Plant',
            scientific_name: 'Chlorophytum comosum',
            watering: 'Moderate',
            watering_days: 7,
            sunlight: ['Bright indirect light'],
            care_level: 'Easy',
            description: 'Spider plants are great for beginners. They produce baby plants (spiderettes) that can be easily propagated.',
            indoor: true,
            poisonous_to_pets: false,
            maintenance: 'Low',
            propagation: ['Plantlets', 'Division']
        },
        {
            id: 'local-6',
            common_name: 'Rubber Plant',
            scientific_name: 'Ficus elastica',
            watering: 'Moderate',
            watering_days: 7,
            sunlight: ['Bright indirect light'],
            care_level: 'Easy',
            description: 'Rubber plants have glossy, thick leaves and can grow into small indoor trees. They prefer consistent moisture.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            humidity: 50
        },
        {
            id: 'local-7',
            common_name: 'Aloe Vera',
            scientific_name: 'Aloe barbadensis miller',
            watering: 'Low',
            watering_days: 14,
            sunlight: ['Bright indirect light', 'Some direct sun'],
            care_level: 'Easy',
            description: 'Aloe vera is a succulent with medicinal properties. The gel from its leaves can soothe burns and skin irritations.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            drought_tolerant: true,
            medicinal: true,
            soil: ['Cactus mix', 'Well-draining sandy soil']
        },
        {
            id: 'local-8',
            common_name: 'ZZ Plant',
            scientific_name: 'Zamioculcas zamiifolia',
            watering: 'Low',
            watering_days: 14,
            sunlight: ['Low to bright indirect light'],
            care_level: 'Easy',
            description: 'ZZ plants are extremely drought-tolerant and can survive in low light. Perfect for offices and low-maintenance spaces.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            drought_tolerant: true
        },
        {
            id: 'local-9',
            common_name: 'Philodendron',
            scientific_name: 'Philodendron hederaceum',
            watering: 'Moderate',
            watering_days: 7,
            sunlight: ['Medium to bright indirect light'],
            care_level: 'Easy',
            description: 'Philodendrons are fast-growing vines with heart-shaped leaves. They are very adaptable and easy to care for.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            propagation: ['Stem cuttings']
        },
        {
            id: 'local-10',
            common_name: 'Fiddle Leaf Fig',
            scientific_name: 'Ficus lyrata',
            watering: 'Moderate',
            watering_days: 7,
            sunlight: ['Bright indirect light'],
            care_level: 'Moderate',
            description: 'Fiddle leaf figs are trendy plants with large, violin-shaped leaves. They need consistent care but are worth the effort.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Moderate',
            humidity: 50
        },
        {
            id: 'local-11',
            common_name: 'Boston Fern',
            scientific_name: 'Nephrolepis exaltata',
            watering: 'Frequent',
            watering_days: 3,
            sunlight: ['Indirect light'],
            care_level: 'Moderate',
            description: 'Boston ferns love humidity and need consistent moisture. They are excellent air purifiers.',
            indoor: true,
            poisonous_to_pets: false,
            maintenance: 'Moderate',
            humidity: 70
        },
        {
            id: 'local-12',
            common_name: 'Orchid',
            scientific_name: 'Orchidaceae',
            watering: 'Moderate',
            watering_days: 7,
            sunlight: ['Bright indirect light'],
            care_level: 'Moderate',
            description: 'Orchids are exotic flowering plants that can bloom for months. They need special orchid potting mix and careful watering.',
            indoor: true,
            poisonous_to_pets: false,
            maintenance: 'Moderate',
            humidity: 60,
            soil: ['Orchid bark mix'],
            flowering_season: 'Varies by species'
        },
        {
            id: 'local-13',
            common_name: 'Succulent',
            scientific_name: 'Various species',
            watering: 'Low',
            watering_days: 14,
            sunlight: ['Full sun', 'Bright light'],
            care_level: 'Easy',
            description: 'Succulents store water in their leaves and need very little care. Perfect for sunny windowsills.',
            indoor: true,
            poisonous_to_pets: false,
            maintenance: 'Low',
            drought_tolerant: true,
            soil: ['Cactus mix', 'Sandy, well-draining soil']
        },
        {
            id: 'local-14',
            common_name: 'English Ivy',
            scientific_name: 'Hedera helix',
            watering: 'Moderate',
            watering_days: 5,
            sunlight: ['Bright indirect light', 'Partial shade'],
            care_level: 'Easy',
            description: 'English ivy is a climbing vine that can be grown indoors or outdoors. It is an excellent air purifier.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            propagation: ['Stem cuttings']
        },
        {
            id: 'local-15',
            common_name: 'Jade Plant',
            scientific_name: 'Crassula ovata',
            watering: 'Low',
            watering_days: 14,
            sunlight: ['Bright light', 'Some direct sun'],
            care_level: 'Easy',
            description: 'Jade plants are succulents with thick, glossy leaves. They can live for decades and are considered lucky plants.',
            indoor: true,
            poisonous_to_pets: true,
            maintenance: 'Low',
            drought_tolerant: true,
            soil: ['Cactus mix']
        }
    ],

    // Search function that mimics the API
    searchPlants: function(query) {
        const searchTerm = query.toLowerCase().trim();
        
        // Return all plants if search is empty
        if (!searchTerm) {
            return this.plants.slice(0, 6);
        }
        
        // Filter plants by name (common or scientific)
        const results = this.plants.filter(plant => {
            return plant.common_name.toLowerCase().includes(searchTerm) ||
                   plant.scientific_name.toLowerCase().includes(searchTerm);
        });
        
        // Return results or empty array
        return results.length > 0 ? results : [];
    },

    // Get plant details by ID
    getPlantDetails: function(plantId) {
        return this.plants.find(plant => plant.id === plantId) || null;
    },

    // Get plant by name (for direct lookup)
    getPlantByName: function(name) {
        const searchName = name.toLowerCase().trim();
        return this.plants.find(plant => 
            plant.common_name.toLowerCase() === searchName
        ) || null;
    }
};

// Export for use
window.localPlantDatabase = localPlantDatabase;