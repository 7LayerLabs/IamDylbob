// Marvel Legends Figure Data
// This is a curated list of popular Marvel Legends figures from recent waves
// In production, this could be fetched from a scraper or API

const marvelLegendsCatalog = [
    // Spider-Man Waves
    {
        name: "Spider-Man (Classic Suit)",
        wave: "Amazing Fantasy Wave",
        year: 2024,
        baf: "Marvel's Rhino - Right Leg",
        category: "Spider-Man",
        retail: 24.99,
        image: "spider-man-classic.jpg"
    },
    {
        name: "Miles Morales Spider-Man",
        wave: "Across the Spider-Verse",
        year: 2023,
        baf: "Spider-Man 2099 - Torso",
        category: "Spider-Man",
        retail: 24.99,
        image: "miles-morales.jpg"
    },
    {
        name: "Spider-Gwen",
        wave: "Across the Spider-Verse",
        year: 2023,
        baf: "Spider-Man 2099 - Left Arm",
        category: "Spider-Man",
        retail: 24.99,
        image: "spider-gwen.jpg"
    },
    {
        name: "Symbiote Spider-Man",
        wave: "King in Black Wave",
        year: 2023,
        baf: "Knull - Head",
        category: "Spider-Man",
        retail: 24.99,
        image: "symbiote-spider-man.jpg"
    },
    {
        name: "Scarlet Spider (Ben Reilly)",
        wave: "Retro Spider-Man",
        year: 2023,
        baf: "None",
        category: "Spider-Man",
        retail: 24.99,
        image: "scarlet-spider.jpg"
    },
    
    // X-Men Waves
    {
        name: "Wolverine (Yellow & Blue)",
        wave: "X-Men 97 Wave",
        year: 2024,
        baf: "Sentinel - Right Arm",
        category: "X-Men",
        retail: 24.99,
        image: "wolverine-yellow-blue.jpg"
    },
    {
        name: "Cyclops (Jim Lee)",
        wave: "X-Men 97 Wave",
        year: 2024,
        baf: "Sentinel - Left Arm",
        category: "X-Men",
        retail: 24.99,
        image: "cyclops-jim-lee.jpg"
    },
    {
        name: "Storm (Mohawk)",
        wave: "X-Men 97 Wave",
        year: 2024,
        baf: "Sentinel - Torso",
        category: "X-Men",
        retail: 24.99,
        image: "storm-mohawk.jpg"
    },
    {
        name: "Rogue (90s Animated)",
        wave: "X-Men 97 Wave",
        year: 2024,
        baf: "Sentinel - Head",
        category: "X-Men",
        retail: 24.99,
        image: "rogue-90s.jpg"
    },
    {
        name: "Gambit",
        wave: "X-Men 97 Wave",
        year: 2024,
        baf: "Sentinel - Left Leg",
        category: "X-Men",
        retail: 24.99,
        image: "gambit.jpg"
    },
    {
        name: "Magneto (Classic)",
        wave: "Age of Apocalypse Wave",
        year: 2023,
        baf: "Apocalypse - Right Arm",
        category: "X-Men",
        retail: 24.99,
        image: "magneto-classic.jpg"
    },
    {
        name: "Beast",
        wave: "Age of Apocalypse Wave",
        year: 2023,
        baf: "Apocalypse - Left Arm",
        category: "X-Men",
        retail: 24.99,
        image: "beast.jpg"
    },
    
    // MCU Waves
    {
        name: "Iron Man Mark 85",
        wave: "Avengers Endgame Wave 2",
        year: 2023,
        baf: "Thanos - Right Arm",
        category: "MCU",
        retail: 24.99,
        image: "iron-man-mark-85.jpg"
    },
    {
        name: "Captain America (Endgame)",
        wave: "Avengers Endgame Wave 2",
        year: 2023,
        baf: "Thanos - Left Arm",
        category: "MCU",
        retail: 24.99,
        image: "captain-america-endgame.jpg"
    },
    {
        name: "Thor (Love and Thunder)",
        wave: "Thor Love and Thunder Wave",
        year: 2023,
        baf: "Korg - Torso",
        category: "MCU",
        retail: 24.99,
        image: "thor-love-thunder.jpg"
    },
    {
        name: "Mighty Thor (Jane Foster)",
        wave: "Thor Love and Thunder Wave",
        year: 2023,
        baf: "Korg - Head",
        category: "MCU",
        retail: 24.99,
        image: "mighty-thor.jpg"
    },
    {
        name: "Black Panther (Wakanda Forever)",
        wave: "Black Panther Wave 2",
        year: 2023,
        baf: "Attuma - Right Leg",
        category: "MCU",
        retail: 24.99,
        image: "black-panther-wakanda.jpg"
    },
    {
        name: "Shuri (Black Panther)",
        wave: "Black Panther Wave 2",
        year: 2023,
        baf: "Attuma - Left Leg",
        category: "MCU",
        retail: 24.99,
        image: "shuri-black-panther.jpg"
    },
    {
        name: "Star-Lord",
        wave: "Guardians Vol. 3 Wave",
        year: 2023,
        baf: "Cosmo - Full Figure",
        category: "MCU",
        retail: 24.99,
        image: "star-lord.jpg"
    },
    {
        name: "Groot & Rocket (2-Pack)",
        wave: "Guardians Vol. 3 Wave",
        year: 2023,
        baf: "None",
        category: "MCU",
        retail: 34.99,
        image: "groot-rocket.jpg"
    },
    {
        name: "Ant-Man (Quantumania)",
        wave: "Ant-Man Wave",
        year: 2023,
        baf: "Cassie Lang - Torso",
        category: "MCU",
        retail: 24.99,
        image: "ant-man-quantumania.jpg"
    },
    
    // Fantastic Four
    {
        name: "Mr. Fantastic",
        wave: "Fantastic Four Retro Wave",
        year: 2024,
        baf: "None",
        category: "Fantastic Four",
        retail: 24.99,
        image: "mr-fantastic.jpg"
    },
    {
        name: "Invisible Woman",
        wave: "Fantastic Four Retro Wave",
        year: 2024,
        baf: "None",
        category: "Fantastic Four",
        retail: 24.99,
        image: "invisible-woman.jpg"
    },
    {
        name: "Human Torch",
        wave: "Fantastic Four Retro Wave",
        year: 2024,
        baf: "None",
        category: "Fantastic Four",
        retail: 24.99,
        image: "human-torch.jpg"
    },
    {
        name: "The Thing",
        wave: "Fantastic Four Retro Wave",
        year: 2024,
        baf: "None",
        category: "Fantastic Four",
        retail: 27.99,
        image: "the-thing.jpg"
    },
    {
        name: "Doctor Doom",
        wave: "Fantastic Four Retro Wave",
        year: 2024,
        baf: "None",
        category: "Fantastic Four",
        retail: 24.99,
        image: "doctor-doom.jpg"
    },
    
    // Deadpool
    {
        name: "Deadpool",
        wave: "Deadpool & Wolverine Wave",
        year: 2024,
        baf: "None",
        category: "Deadpool",
        retail: 24.99,
        image: "deadpool.jpg"
    },
    {
        name: "Lady Deadpool",
        wave: "Deadpool & Wolverine Wave",
        year: 2024,
        baf: "None",
        category: "Deadpool",
        retail: 24.99,
        image: "lady-deadpool.jpg"
    },
    {
        name: "Wolverine (Brown Suit)",
        wave: "Deadpool & Wolverine Wave",
        year: 2024,
        baf: "None",
        category: "Deadpool",
        retail: 24.99,
        image: "wolverine-brown.jpg"
    },
    
    // Villains
    {
        name: "Green Goblin",
        wave: "Spider-Man No Way Home Wave",
        year: 2023,
        baf: "Armadillo - Right Arm",
        category: "Villains",
        retail: 24.99,
        image: "green-goblin.jpg"
    },
    {
        name: "Doctor Octopus",
        wave: "Spider-Man No Way Home Wave",
        year: 2023,
        baf: "Armadillo - Left Arm",
        category: "Villains",
        retail: 27.99,
        image: "doctor-octopus.jpg"
    },
    {
        name: "Venom",
        wave: "King in Black Wave",
        year: 2023,
        baf: "Knull - Torso",
        category: "Villains",
        retail: 27.99,
        image: "venom.jpg"
    },
    {
        name: "Carnage",
        wave: "King in Black Wave",
        year: 2023,
        baf: "Knull - Right Arm",
        category: "Villains",
        retail: 24.99,
        image: "carnage.jpg"
    },
    {
        name: "Thanos (Infinity Saga)",
        wave: "Avengers Infinity War Wave",
        year: 2023,
        baf: "None - Deluxe Figure",
        category: "Villains",
        retail: 34.99,
        image: "thanos-infinity.jpg"
    },
    {
        name: "Loki (TVA)",
        wave: "Disney+ Wave",
        year: 2023,
        baf: "The Watcher - Head",
        category: "Villains",
        retail: 24.99,
        image: "loki-tva.jpg"
    },
    
    // Comic Legends
    {
        name: "Captain America (First Appearance)",
        wave: "80 Years of Marvel",
        year: 2023,
        baf: "None",
        category: "Comic Legends",
        retail: 24.99,
        image: "captain-america-first.jpg"
    },
    {
        name: "Iron Man (Model 70)",
        wave: "Iron Man Wave",
        year: 2024,
        baf: "Iron Monger - Torso",
        category: "Comic Legends",
        retail: 24.99,
        image: "iron-man-model-70.jpg"
    },
    {
        name: "Hulk (Classic)",
        wave: "80 Years of Marvel",
        year: 2023,
        baf: "None - Deluxe Figure",
        category: "Comic Legends",
        retail: 34.99,
        image: "hulk-classic.jpg"
    },
    {
        name: "Black Widow",
        wave: "Black Widow Wave",
        year: 2023,
        baf: "Crimson Dynamo - Right Leg",
        category: "Comic Legends",
        retail: 24.99,
        image: "black-widow.jpg"
    },
    {
        name: "Hawkeye (Classic)",
        wave: "Avengers Wave",
        year: 2023,
        baf: "None",
        category: "Comic Legends",
        retail: 24.99,
        image: "hawkeye-classic.jpg"
    },
    
    // Disney+ Series
    {
        name: "Scarlet Witch (WandaVision)",
        wave: "Disney+ Wave",
        year: 2023,
        baf: "The Watcher - Torso",
        category: "Disney+",
        retail: 24.99,
        image: "scarlet-witch.jpg"
    },
    {
        name: "Vision (WandaVision)",
        wave: "Disney+ Wave",
        year: 2023,
        baf: "The Watcher - Right Arm",
        category: "Disney+",
        retail: 24.99,
        image: "vision-wandavision.jpg"
    },
    {
        name: "Captain America (Sam Wilson)",
        wave: "Disney+ Wave",
        year: 2023,
        baf: "The Watcher - Left Arm",
        category: "Disney+",
        retail: 24.99,
        image: "captain-america-sam.jpg"
    },
    {
        name: "Winter Soldier",
        wave: "Disney+ Wave",
        year: 2023,
        baf: "The Watcher - Right Leg",
        category: "Disney+",
        retail: 24.99,
        image: "winter-soldier.jpg"
    },
    {
        name: "Moon Knight",
        wave: "Disney+ Wave",
        year: 2023,
        baf: "The Watcher - Left Leg",
        category: "Disney+",
        retail: 24.99,
        image: "moon-knight.jpg"
    },
    {
        name: "Ms. Marvel (Kamala Khan)",
        wave: "Disney+ Wave 2",
        year: 2023,
        baf: "None",
        category: "Disney+",
        retail: 24.99,
        image: "ms-marvel.jpg"
    },
    {
        name: "She-Hulk",
        wave: "Disney+ Wave 2",
        year: 2023,
        baf: "None - Deluxe Figure",
        category: "Disney+",
        retail: 34.99,
        image: "she-hulk.jpg"
    }
];

// Function to get all figures
function getAllFigures() {
    return marvelLegendsCatalog;
}

// Function to get figures by category
function getFiguresByCategory(category) {
    return marvelLegendsCatalog.filter(fig => fig.category === category);
}

// Function to get all unique categories
function getCategories() {
    return [...new Set(marvelLegendsCatalog.map(fig => fig.category))];
}

// Function to get all unique waves
function getWaves() {
    return [...new Set(marvelLegendsCatalog.map(fig => fig.wave))];
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllFigures,
        getFiguresByCategory,
        getCategories,
        getWaves,
        marvelLegendsCatalog
    };
}