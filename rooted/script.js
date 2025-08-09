// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Plant Water Tracker
let plants = JSON.parse(localStorage.getItem('plants')) || [];
window.plants = plants; // Make accessible globally for auth module

async function addPlant() {
    const nameInput = document.getElementById('plantName');
    const daysInput = document.getElementById('wateringDays');
    
    if (!nameInput.value || !daysInput.value) {
        alert('Please fill in both fields!');
        return;
    }
    
    const plant = {
        id: Date.now(),
        name: nameInput.value,
        wateringInterval: parseInt(daysInput.value),
        lastWatered: new Date().toISOString(),
        nextWatering: calculateNextWatering(new Date(), parseInt(daysInput.value))
    };
    
    plants.push(plant);
    savePlants();
    renderPlants();
    updateCalendar();
    
    // Sync to cloud if signed in
    if (window.authModule && window.authModule.isSignedIn()) {
        await window.authModule.saveToCloud(plant);
    }
    
    nameInput.value = '';
    daysInput.value = '';
    
    showNotification(`${plant.name} added to your plant collection! 🌱`);
}
window.addPlant = addPlant; // Make accessible globally

function calculateNextWatering(lastDate, interval) {
    const next = new Date(lastDate);
    next.setDate(next.getDate() + interval);
    return next.toISOString();
}

async function waterPlant(plantId) {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
        plant.lastWatered = new Date().toISOString();
        plant.nextWatering = calculateNextWatering(new Date(), plant.wateringInterval);
        savePlants();
        renderPlants();
        updateCalendar();
        
        // Sync to cloud if signed in
        if (window.authModule && window.authModule.isSignedIn()) {
            await window.authModule.saveToCloud(plant);
        }
        
        showNotification(`${plant.name} has been watered! 💧`);
    }
}
window.waterPlant = waterPlant; // Make accessible globally

async function deletePlant(plantId) {
    plants = plants.filter(p => p.id !== plantId);
    savePlants();
    renderPlants();
    updateCalendar();
    
    // Delete from cloud if signed in
    if (window.authModule && window.authModule.isSignedIn()) {
        await window.authModule.deleteFromCloud(plantId);
    }
}
window.deletePlant = deletePlant; // Make accessible globally

function savePlants() {
    localStorage.setItem('plants', JSON.stringify(plants));
}

function renderPlants() {
    const plantsList = document.getElementById('plantsList');
    if (!plantsList) return;
    window.renderPlants = renderPlants; // Make accessible globally
    
    if (plants.length === 0) {
        plantsList.innerHTML = '<p style="text-align: center; color: #87a96b;">No plants added yet. Add your first plant above!</p>';
        return;
    }
    
    plantsList.innerHTML = plants.map(plant => {
        const nextDate = new Date(plant.nextWatering);
        const today = new Date();
        const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        
        let statusColor = '#2d5016';
        let statusText = `Water in ${daysUntil} days`;
        
        if (daysUntil <= 0) {
            statusColor = '#c65d00';
            statusText = 'Needs water today!';
        } else if (daysUntil <= 2) {
            statusColor = '#ff9800';
            statusText = `Water in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`;
        }
        
        return `
            <div class="plant-item">
                <div class="plant-info">
                    <div class="plant-name">${plant.name}</div>
                    <div class="water-status" style="color: ${statusColor};">${statusText}</div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="water-btn" onclick="waterPlant(${plant.id})">💧 Water</button>
                    <button class="water-btn" style="background: #cc0000;" onclick="deletePlant(${plant.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateCalendar() {
    const calendarContent = document.getElementById('calendarContent');
    if (!calendarContent) return;
    window.updateCalendar = updateCalendar; // Make accessible globally
    
    if (plants.length === 0) {
        calendarContent.innerHTML = '<p>Add plants to see your watering schedule!</p>';
        return;
    }
    
    const sortedPlants = [...plants].sort((a, b) => 
        new Date(a.nextWatering) - new Date(b.nextWatering)
    );
    
    const schedule = sortedPlants.slice(0, 5).map(plant => {
        const date = new Date(plant.nextWatering);
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <div style="padding: 10px; margin-bottom: 10px; background: linear-gradient(135deg, #a8d5a8 0%, #87a96b 100%); color: white; border-radius: 8px;">
                <strong>${dateStr}</strong> - Water ${plant.name}
            </div>
        `;
    }).join('');
    
    calendarContent.innerHTML = schedule;
}

// Plant Jokes
const plantJokes = [
    "Why did the gardener plant light bulbs? He wanted to grow a power plant!",
    "What do you call a grumpy and short-tempered gardener? A snap dragon!",
    "Why do potatoes make good detectives? Because they keep their eyes peeled!",
    "What's a plant's favorite drink? Root beer!",
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "What do you call a plant that roars? A dandelion!",
    "Why don't plants like math? It gives them square roots!",
    "What's a tree's least favorite month? Sep-timber!",
    "How do trees get online? They log in!",
    "What did the big flower say to the little flower? Hi, bud!",
    "Why did the cactus cross the road? It was stuck to the chicken!",
    "What's a plant's favorite subject? Stem class!",
    "Why are plants bad at boxing? They're always rooted to the spot!",
    "What do you call a plant that's good at archery? A shooting star!",
    "Why did the gardener quit? His celery wasn't high enough!"
];

function getNewJoke() {
    const jokeElement = document.getElementById('plantJoke');
    if (jokeElement) {
        const randomJoke = plantJokes[Math.floor(Math.random() * plantJokes.length)];
        jokeElement.style.opacity = '0';
        setTimeout(() => {
            jokeElement.textContent = randomJoke;
            jokeElement.style.opacity = '1';
        }, 300);
    }
}

// Plant Facts
const plantFacts = [
    "The oldest known potted plant is over 200 years old! It's a Eastern Cape cycad at Kew Gardens in London.",
    "Plants can communicate with each other through their root systems using fungi networks called mycorrhizae.",
    "The Snake Plant releases oxygen at night, making it perfect for bedrooms!",
    "A single mature tree can absorb 48 pounds of CO2 per year.",
    "Banana plants are not trees - they're the world's largest herbs!",
    "The Titan Arum is the world's smelliest plant, smelling like rotting flesh.",
    "Bamboo is the fastest-growing plant on Earth - it can grow 35 inches in a single day!",
    "There are more than 80,000 edible plants on Earth, but we only eat about 30 of them regularly.",
    "Plants can 'hear' - they respond to vibrations and sounds, growing toward certain frequencies.",
    "The Peace Lily can clean the air of harmful toxins like formaldehyde and benzene.",
    "Sunflowers can be used to clean up radioactive soil - they were planted after Chernobyl!",
    "The world's smallest flowering plant is Wolffia, only 0.3mm long!",
    "Mint plants can take over your entire garden - they spread through underground runners!",
    "Coffee and chocolate both come from plants - coffee beans and cacao pods!",
    "Some plants can live for thousands of years - the oldest tree is over 5,000 years old!"
];

function getNewFact() {
    const factElement = document.getElementById('plantFact');
    if (factElement) {
        const randomFact = plantFacts[Math.floor(Math.random() * plantFacts.length)];
        factElement.style.opacity = '0';
        setTimeout(() => {
            factElement.textContent = randomFact;
            factElement.style.opacity = '1';
        }, 300);
    }
}

// Quiz functionality
const quizQuestions = [
    {
        question: "What's the best way to check if your plant needs water?",
        options: [
            { text: "Stick your finger in the soil", correct: true },
            { text: "Water on a strict schedule", correct: false },
            { text: "Wait until leaves droop", correct: false }
        ]
    },
    {
        question: "Which direction should NH windows face for best plant light?",
        options: [
            { text: "North", correct: false },
            { text: "South", correct: true },
            { text: "It doesn't matter", correct: false }
        ]
    },
    {
        question: "When should you fertilize houseplants less frequently?",
        options: [
            { text: "Summer", correct: false },
            { text: "Spring", correct: false },
            { text: "Winter", correct: true }
        ]
    },
    {
        question: "What's the most common cause of houseplant death?",
        options: [
            { text: "Underwatering", correct: false },
            { text: "Overwatering", correct: true },
            { text: "Too much sun", correct: false }
        ]
    },
    {
        question: "How often should you rotate your plants?",
        options: [
            { text: "Daily", correct: false },
            { text: "Weekly", correct: true },
            { text: "Monthly", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;

function loadNewQuiz() {
    currentQuestionIndex = (currentQuestionIndex + 1) % quizQuestions.length;
    const question = quizQuestions[currentQuestionIndex];
    const container = document.getElementById('quizContainer');
    
    if (container) {
        container.innerHTML = `
            <p class="quiz-question">${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => 
                    `<button class="quiz-btn" onclick="checkAnswer(this, ${option.correct})">${option.text}</button>`
                ).join('')}
            </div>
            <p id="quizFeedback"></p>
        `;
    }
}

function checkAnswer(button, isCorrect) {
    const buttons = document.querySelectorAll('.quiz-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
    });
    
    if (isCorrect) {
        button.classList.add('correct');
        document.getElementById('quizFeedback').textContent = '✅ Correct! Great job!';
        document.getElementById('quizFeedback').style.color = '#2d5016';
    } else {
        button.classList.add('incorrect');
        document.getElementById('quizFeedback').textContent = '❌ Not quite. Try the next question!';
        document.getElementById('quizFeedback').style.color = '#cc0000';
    }
    
    setTimeout(() => {
        loadNewQuiz();
    }, 2500);
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2d5016 0%, #87a96b 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Check for plants that need watering today
function checkWateringReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    plants.forEach(plant => {
        const nextWatering = new Date(plant.nextWatering);
        nextWatering.setHours(0, 0, 0, 0);
        
        if (nextWatering <= today) {
            showNotification(`🚨 ${plant.name} needs water today!`);
        }
    });
}

// Plant Database Search Functions
async function searchPlantDatabase() {
    const searchInput = document.getElementById('plantSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput.value.trim()) {
        searchResults.innerHTML = '<p style="color: #cc0000;">Please enter a plant name to search</p>';
        return;
    }
    
    searchResults.innerHTML = '<p style="color: #87a96b;">Searching plant database...</p>';
    
    try {
        const results = await window.plantAPI.searchPlants(searchInput.value);
        
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<p style="color: #cc0000;">No plants found. Try a different name.</p>';
            return;
        }
        
        // Display search results - use proper event handlers
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'search-results-grid';
        
        results.slice(0, 6).forEach(plant => {
            const card = document.createElement('div');
            card.className = 'plant-result-card';
            card.innerHTML = `
                ${plant.image ? `<img src="${plant.image}" alt="${plant.common_name}" class="plant-thumb">` : '<div class="plant-thumb-placeholder">🌿</div>'}
                <h4>${plant.common_name}</h4>
                <p class="scientific-name">${Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name || ''}</p>
                <button class="btn-select">View Care Info</button>
            `;
            
            card.addEventListener('click', () => {
                selectPlantFromSearch(plant.common_name, plant.id, plant.source);
            });
            
            resultsGrid.appendChild(card);
        });
        
        searchResults.innerHTML = '';
        searchResults.appendChild(resultsGrid);
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<p style="color: #cc0000;">Error searching database. Please try again.</p>';
    }
}

async function selectPlantFromSearch(plantName, plantId, source) {
    const suggestedCare = document.getElementById('suggestedCare');
    const plantNameInput = document.getElementById('plantName');
    const wateringDaysInput = document.getElementById('wateringDays');
    
    // Set the plant name
    plantNameInput.value = plantName;
    
    // Show loading message
    suggestedCare.innerHTML = '<p style="color: #87a96b;">Loading care information...</p>';
    suggestedCare.style.display = 'block';
    
    try {
        // Get detailed plant information
        const details = await window.plantAPI.getPlantDetails(plantId, source);
        
        if (details) {
            // Set watering frequency based on API data
            let wateringDays = 7; // default
            if (details.watering === 'Frequent') wateringDays = 3;
            else if (details.watering === 'Moderate') wateringDays = 7;
            else if (details.watering === 'Low') wateringDays = 10;
            else if (details.watering === 'Minimal') wateringDays = 14;
            
            wateringDaysInput.value = wateringDays;
            
            // Display care information
            suggestedCare.innerHTML = `
                <div class="care-info-card">
                    <h4>Care Guide for ${plantName}</h4>
                    ${details.image ? `<img src="${details.image}" alt="${plantName}" class="care-plant-image">` : ''}
                    <div class="care-details">
                        <p><strong>💧 Watering:</strong> ${details.watering || 'Moderate'} ${details.watering_period ? `(${details.watering_period})` : ''}</p>
                        <p><strong>☀️ Sunlight:</strong> ${Array.isArray(details.sunlight) ? details.sunlight.join(', ') : details.sunlight || 'Partial sun'}</p>
                        ${details.care_level ? `<p><strong>📊 Care Level:</strong> ${details.care_level}</p>` : ''}
                        ${details.indoor !== undefined ? `<p><strong>🏠 Indoor Plant:</strong> ${details.indoor ? 'Yes' : 'No'}</p>` : ''}
                        ${details.poisonous_to_pets ? `<p><strong>⚠️ Pet Safe:</strong> No - Toxic to pets</p>` : ''}
                        ${details.description ? `<p><strong>About:</strong> ${details.description.substring(0, 200)}...</p>` : ''}
                        ${details.maintenance ? `<p><strong>Maintenance:</strong> ${details.maintenance}</p>` : ''}
                        ${details.humidity ? `<p><strong>💦 Humidity:</strong> ${details.humidity}%</p>` : ''}
                        ${details.temperature_min ? `<p><strong>🌡️ Min Temp:</strong> ${details.temperature_min}°C</p>` : ''}
                    </div>
                    <button class="btn-secondary" onclick="hideCareInfo()">Close</button>
                </div>
            `;
            
            // Store the care info for later use
            window.lastPlantCareInfo = details;
        }
    } catch (error) {
        console.error('Error getting plant details:', error);
        suggestedCare.innerHTML = '<p style="color: #cc0000;">Could not load care information</p>';
    }
}

function hideCareInfo() {
    const suggestedCare = document.getElementById('suggestedCare');
    suggestedCare.style.display = 'none';
    suggestedCare.innerHTML = '';
}

// Auto-suggest care when typing plant name
let searchTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const plantNameInput = document.getElementById('plantName');
    if (plantNameInput) {
        plantNameInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const value = e.target.value.trim();
            
            if (value.length > 2) {
                searchTimeout = setTimeout(async () => {
                    const suggestedCare = document.getElementById('suggestedCare');
                    suggestedCare.innerHTML = '<p style="color: #87a96b; font-size: 12px;">Searching for care tips...</p>';
                    suggestedCare.style.display = 'block';
                    
                    try {
                        const careGuide = await window.plantAPI.getPlantCareGuide(value);
                        if (careGuide) {
                            // Auto-fill watering days
                            const wateringDaysInput = document.getElementById('wateringDays');
                            let wateringDays = 7;
                            if (careGuide.watering === 'Frequent') wateringDays = 3;
                            else if (careGuide.watering === 'Moderate') wateringDays = 7;
                            else if (careGuide.watering === 'Low') wateringDays = 10;
                            else if (careGuide.watering === 'Minimal') wateringDays = 14;
                            
                            if (!wateringDaysInput.value) {
                                wateringDaysInput.value = wateringDays;
                            }
                            
                            suggestedCare.innerHTML = `
                                <div class="mini-care-tip">
                                    <strong>Suggested care for ${careGuide.name}:</strong>
                                    Water every ${wateringDays} days, ${careGuide.sunlight.join(', ')}
                                </div>
                            `;
                        } else {
                            suggestedCare.style.display = 'none';
                        }
                    } catch (error) {
                        suggestedCare.style.display = 'none';
                    }
                }, 1000);
            }
        });
    }
});

// Hero Search Functions
let heroSearchTimeout;
async function heroSearchPlant() {
    const searchInput = document.getElementById('heroPlantSearch');
    const searchResults = document.getElementById('heroSearchResults');
    
    // Clear previous timeout
    clearTimeout(heroSearchTimeout);
    
    if (!searchInput.value.trim()) {
        searchResults.innerHTML = '';
        return;
    }
    
    searchResults.innerHTML = '<p style="color: white; text-align: center;">🔍 Searching plant database...</p>';
    
    // Debounce the search
    heroSearchTimeout = setTimeout(async () => {
    
    try {
        const results = await window.plantAPI.searchPlants(searchInput.value);
        
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<p style="color: white; text-align: center;">No plants found. Try a different name.</p>';
            return;
        }
        
        // Display search results - use data attributes instead of onclick
        const resultsHTML = document.createElement('div');
        resultsHTML.className = 'search-results-grid';
        resultsHTML.innerHTML = `
            <h3 style="grid-column: 1/-1; text-align: center; color: #2d5016; margin-bottom: 20px;">
                Found ${results.length} plants matching "${searchInput.value}"
            </h3>
        `;
        
        // Create cards with event listeners instead of inline onclick
        results.slice(0, 6).forEach(plant => {
            const card = document.createElement('div');
            card.className = 'plant-result-card';
            card.innerHTML = `
                ${plant.image ? `<img src="${plant.image}" alt="${plant.common_name}" class="plant-thumb">` : '<div class="plant-thumb-placeholder">🌿</div>'}
                <h4>${plant.common_name}</h4>
                <p class="scientific-name">${Array.isArray(plant.scientific_name) ? plant.scientific_name[0] : plant.scientific_name || ''}</p>
                <button class="btn-select">View Details</button>
            `;
            
            // Add click handler properly
            card.addEventListener('click', () => {
                viewPlantDetails(plant.common_name, plant.id, plant.source);
            });
            
            resultsHTML.appendChild(card);
        });
        
        searchResults.innerHTML = '';
        searchResults.appendChild(resultsHTML);
        
        // Smooth scroll to results
        searchResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<p style="color: white; text-align: center;">Error searching database. Please try again.</p>';
    }
    }, 300); // Wait 300ms after user stops typing
}

// Quick search from suggestions
function quickSearch(plantName) {
    const searchInput = document.getElementById('heroPlantSearch');
    searchInput.value = plantName;
    heroSearchPlant();
}

// View detailed plant information
async function viewPlantDetails(plantName, plantId, source) {
    const modal = document.createElement('div');
    modal.className = 'plant-modal';
    modal.innerHTML = '<div class="modal-content"><p>Loading plant details...</p></div>';
    document.body.appendChild(modal);
    
    try {
        const details = await window.plantAPI.getPlantDetails(plantId, source);
        
        if (details) {
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            // Calculate watering days
            let wateringDays = 7;
            if (details.watering === 'Frequent') wateringDays = 3;
            else if (details.watering === 'Low') wateringDays = 10;
            else if (details.watering === 'Minimal') wateringDays = 14;
            
            modalContent.innerHTML = `
                <button class="modal-close">×</button>
                <h2>${plantName}</h2>
                ${details.scientific_name ? `<p class="scientific-name" style="font-style: italic; color: #666; margin-top: -10px;">${Array.isArray(details.scientific_name) ? details.scientific_name[0] : details.scientific_name}</p>` : ''}
                ${details.family ? `<p style="color: #87a96b; font-size: 14px;">Family: ${details.family}</p>` : ''}
                
                ${details.image ? `<img src="${details.image}" alt="${plantName}" class="modal-plant-image">` : ''}
                
                <!-- Quick Stats -->
                <div class="quick-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin: 20px 0; padding: 15px; background: #f0f5e8; border-radius: 10px;">
                    ${details.care_level ? `<div><strong>📊 Care:</strong><br>${details.care_level}</div>` : ''}
                    ${details.growth_rate ? `<div><strong>📈 Growth:</strong><br>${details.growth_rate}</div>` : ''}
                    ${details.cycle ? `<div><strong>🔄 Cycle:</strong><br>${details.cycle}</div>` : ''}
                    ${details.type ? `<div><strong>🌿 Type:</strong><br>${details.type}</div>` : ''}
                </div>
                
                <!-- Essential Care -->
                <div class="modal-details">
                    <h3>🌱 Essential Care</h3>
                    <p><strong>💧 Watering:</strong> ${details.watering || 'Moderate'} ${details.watering_period ? `(${details.watering_period})` : ''}</p>
                    ${details.watering_general_benchmark?.value ? `<p style="margin-left: 20px; font-size: 14px;">→ About ${details.watering_general_benchmark.value} ${details.watering_general_benchmark.unit || ''} per watering</p>` : ''}
                    
                    <p><strong>☀️ Sunlight:</strong> ${Array.isArray(details.sunlight) ? details.sunlight.join(', ') : details.sunlight || 'Partial sun'}</p>
                    
                    ${details.humidity ? `<p><strong>💦 Humidity:</strong> ${details.humidity}%</p>` : ''}
                    ${details.atmospheric_humidity ? `<p><strong>💦 Humidity:</strong> ${details.atmospheric_humidity}</p>` : ''}
                    
                    <!-- Temperature -->
                    ${(details.temperature_min || details.hardiness?.min) ? `
                        <p><strong>🌡️ Temperature:</strong> 
                        ${details.temperature_min ? `Min ${details.temperature_min}°C` : ''}
                        ${details.hardiness?.min ? ` • Hardiness zones ${details.hardiness.min}-${details.hardiness.max}` : ''}
                        </p>
                    ` : ''}
                    
                    <!-- Soil -->
                    ${details.soil?.length ? `<p><strong>🪴 Soil:</strong> ${details.soil.join(', ')}</p>` : ''}
                    ${(details.soil_ph_min || details.growth?.ph_minimum) ? `
                        <p style="margin-left: 20px; font-size: 14px;">→ pH: ${details.soil_ph_min || details.growth?.ph_minimum} - ${details.soil_ph_max || details.growth?.ph_maximum}</p>
                    ` : ''}
                </div>
                
                <!-- Plant Characteristics -->
                ${(details.dimensions?.height || details.specifications?.average_height || details.flowering_season || details.leaf_color?.length) ? `
                <div class="modal-details">
                    <h3>📏 Plant Characteristics</h3>
                    ${details.dimensions?.height ? `<p><strong>Height:</strong> ${details.dimensions.min_value}-${details.dimensions.max_value} ${details.dimensions.unit}</p>` : ''}
                    ${details.specifications?.average_height ? `<p><strong>Average Height:</strong> ${details.specifications.average_height.cm} cm</p>` : ''}
                    ${details.specifications?.maximum_height ? `<p><strong>Max Height:</strong> ${details.specifications.maximum_height.cm} cm</p>` : ''}
                    ${details.flowering_season ? `<p><strong>🌸 Flowering:</strong> ${details.flowering_season}</p>` : ''}
                    ${details.flower_color ? `<p><strong>🎨 Flower Color:</strong> ${details.flower_color}</p>` : ''}
                    ${details.leaf_color?.length ? `<p><strong>🍃 Leaf Color:</strong> ${details.leaf_color.join(', ')}</p>` : ''}
                    ${details.attracts?.length ? `<p><strong>🦋 Attracts:</strong> ${details.attracts.join(', ')}</p>` : ''}
                </div>
                ` : ''}
                
                <!-- Maintenance & Care -->
                ${(details.maintenance || details.pruning_month?.length || details.fertilizer || details.propagation?.length) ? `
                <div class="modal-details">
                    <h3>🛠️ Maintenance & Care</h3>
                    ${details.maintenance ? `<p><strong>Maintenance Level:</strong> ${details.maintenance}</p>` : ''}
                    ${details.pruning_month?.length ? `<p><strong>✂️ Pruning Months:</strong> ${details.pruning_month.join(', ')}</p>` : ''}
                    ${details.pruning_count?.amount ? `<p style="margin-left: 20px; font-size: 14px;">→ Prune ${details.pruning_count.amount} times per ${details.pruning_count.interval}</p>` : ''}
                    ${details.fertilizer ? `<p><strong>🧪 Fertilizer:</strong> ${details.fertilizer}</p>` : ''}
                    ${details.propagation?.length ? `<p><strong>🌱 Propagation:</strong> ${details.propagation.join(', ')}</p>` : ''}
                </div>
                ` : ''}
                
                <!-- Special Features & Warnings -->
                <div class="modal-details">
                    <h3>⚠️ Important Information</h3>
                    ${details.indoor !== undefined ? `<p><strong>🏠 Indoor Suitable:</strong> ${details.indoor ? 'Yes ✅' : 'No ❌'}</p>` : ''}
                    ${details.poisonous_to_pets ? `<p style="color: #c65d00;"><strong>🐕 Pet Safe:</strong> No - Toxic to pets ⚠️</p>` : '<p style="color: #2d5016;"><strong>🐕 Pet Safe:</strong> Yes ✅</p>'}
                    ${details.poison_effects_to_pets ? `<p style="margin-left: 20px; font-size: 14px; color: #c65d00;">→ ${details.poison_effects_to_pets}</p>` : ''}
                    ${details.poisonous_to_humans ? `<p style="color: #c65d00;"><strong>👶 Child Safe:</strong> No - Toxic to humans ⚠️</p>` : ''}
                    ${details.edible ? `<p style="color: #2d5016;"><strong>🍽️ Edible:</strong> Yes ${details.edible_part?.length ? `(${details.edible_part.join(', ')})` : ''}</p>` : ''}
                    ${details.medicinal ? `<p><strong>💊 Medicinal:</strong> Yes</p>` : ''}
                    ${details.drought_tolerant ? `<p><strong>🏜️ Drought Tolerant:</strong> Yes</p>` : ''}
                    ${details.salt_tolerant ? `<p><strong>🌊 Salt Tolerant:</strong> Yes</p>` : ''}
                    ${details.invasive ? `<p style="color: #c65d00;"><strong>⚠️ Invasive:</strong> Yes - Control spread</p>` : ''}
                    ${details.thorny ? `<p><strong>🌹 Thorny:</strong> Yes - Handle with care</p>` : ''}
                    ${details.rare ? `<p style="color: #87a96b;"><strong>💎 Rare:</strong> Yes ${details.rare_level ? `(${details.rare_level})` : ''}</p>` : ''}
                </div>
                
                <!-- Detailed Description -->
                ${details.description ? `
                <div class="modal-details">
                    <h3>📖 About This Plant</h3>
                    <p>${details.description}</p>
                </div>
                ` : ''}
                
                <!-- Pests & Problems -->
                ${details.pest_susceptibility?.length ? `
                <div class="modal-details">
                    <h3>🐛 Common Pests</h3>
                    <p>${details.pest_susceptibility.join(', ')}</p>
                </div>
                ` : ''}
                
                <!-- Origin -->
                ${details.origin?.length ? `
                <div class="modal-details">
                    <h3>🌍 Native Origin</h3>
                    <p>${details.origin.join(', ')}</p>
                </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="btn-primary add-to-tracker">Add to My Tracker</button>
                    <button class="btn-secondary close-modal">Close</button>
                </div>
            `;
            
            // Add event listeners
            modalContent.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            modalContent.querySelector('.close-modal').addEventListener('click', () => modal.remove());
            modalContent.querySelector('.add-to-tracker').addEventListener('click', () => {
                addToTracker(plantName, wateringDays);
            });
            
            modal.innerHTML = '';
            modal.appendChild(modalContent);
        }
    } catch (error) {
        console.error('Error getting plant details:', error);
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.plant-modal').remove()">×</button>
                <p>Could not load plant details</p>
            </div>
        `;
    }
}

// Add plant to tracker from modal
function addToTracker(plantName, wateringDays) {
    document.getElementById('plantName').value = plantName;
    document.getElementById('wateringDays').value = wateringDays;
    document.querySelector('.plant-modal')?.remove();
    scrollToSection('tracker');
    showNotification(`${plantName} ready to add! Click "Add Plant" to save.`);
}

// Load featured plants on homepage
async function loadFeaturedPlants() {
    const featuredGrid = document.getElementById('featuredPlantsGrid');
    if (!featuredGrid) return;
    
    const featuredPlants = [
        'Monstera Deliciosa',
        'Snake Plant',
        'Pothos',
        'Peace Lily',
        'Rubber Plant',
        'ZZ Plant'
    ];
    
    featuredGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Loading featured plants...</p>';
    
    featuredGrid.innerHTML = '';
    
    for (const plantName of featuredPlants) {
        try {
            const results = await window.plantAPI.searchPlants(plantName);
            if (results && results[0]) {
                const plant = results[0];
                
                const card = document.createElement('div');
                card.className = 'featured-plant-card';
                card.innerHTML = `
                    ${plant.image ? `<img src="${plant.image}" alt="${plant.common_name}" class="featured-plant-image">` : '<div class="featured-plant-image" style="background: linear-gradient(135deg, #a8d5a8 0%, #87a96b 100%); display: flex; align-items: center; justify-content: center; font-size: 60px;">🌿</div>'}
                    <div class="featured-plant-info">
                        <div class="featured-plant-name">${plant.common_name}</div>
                        <div class="featured-plant-details">Click to view care guide</div>
                    </div>
                `;
                
                card.addEventListener('click', () => {
                    viewPlantDetails(plant.common_name, plant.id, plant.source);
                });
                
                featuredGrid.appendChild(card);
            }
        } catch (error) {
            console.error(`Error loading ${plantName}:`, error);
        }
    }
    
    if (featuredGrid.children.length === 0) {
        featuredGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Featured plants coming soon!</p>';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderPlants();
    updateCalendar();
    checkWateringReminders();
    loadFeaturedPlants();
    
    // Set up smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.tip-card, .season-card, .fun-card, .resource-category').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Auto-rotate jokes and facts
setInterval(getNewJoke, 30000); // New joke every 30 seconds
setInterval(getNewFact, 45000); // New fact every 45 seconds

// Add seasonal background changes based on current month
const month = new Date().getMonth();
const heroSection = document.querySelector('.hero');

if (heroSection) {
    if (month >= 11 || month <= 1) {
        // Winter
        heroSection.style.background = 'linear-gradient(135deg, #b8d4e3 0%, #6fa3c7 100%)';
    } else if (month >= 2 && month <= 4) {
        // Spring
        heroSection.style.background = 'linear-gradient(135deg, #ffb3d9 0%, #ff80bf 100%)';
    } else if (month >= 5 && month <= 7) {
        // Summer
        heroSection.style.background = 'linear-gradient(135deg, #a8d5a8 0%, #87a96b 100%)';
    } else {
        // Fall
        heroSection.style.background = 'linear-gradient(135deg, #ffb366 0%, #ff8c42 100%)';
    }
}