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

function addPlant() {
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
    
    nameInput.value = '';
    daysInput.value = '';
    
    showNotification(`${plant.name} added to your plant collection! 🌱`);
}

function calculateNextWatering(lastDate, interval) {
    const next = new Date(lastDate);
    next.setDate(next.getDate() + interval);
    return next.toISOString();
}

function waterPlant(plantId) {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
        plant.lastWatered = new Date().toISOString();
        plant.nextWatering = calculateNextWatering(new Date(), plant.wateringInterval);
        savePlants();
        renderPlants();
        updateCalendar();
        showNotification(`${plant.name} has been watered! 💧`);
    }
}

function deletePlant(plantId) {
    plants = plants.filter(p => p.id !== plantId);
    savePlants();
    renderPlants();
    updateCalendar();
}

function savePlants() {
    localStorage.setItem('plants', JSON.stringify(plants));
}

function renderPlants() {
    const plantsList = document.getElementById('plantsList');
    if (!plantsList) return;
    
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderPlants();
    updateCalendar();
    checkWateringReminders();
    
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