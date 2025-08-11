// Initialize D.Y.L.B.O.B OS
document.addEventListener('DOMContentLoaded', () => {
    initializeSystem();
    initializeWindows();
    initializeAI();
    initializeDock();
    initializeNotepad();
    initializeBrowser();
    initializeCalculator();
    initializePlantation();
});

// System Initialization
function initializeSystem() {
    // Remove boot sequence after animation
    setTimeout(() => {
        const bootSequence = document.getElementById('boot-sequence');
        if (bootSequence) {
            bootSequence.style.display = 'none';
        }
    }, 3500);

    // Update time and date
    setInterval(updateDateTime, 1000);
    updateDateTime();
}

function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('system-time');
    const dateElement = document.getElementById('system-date');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
}

// Window Management
let activeWindow = null;
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

function initializeWindows() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        const header = window.querySelector('.window-header');
        const minimizeBtn = window.querySelector('.minimize-btn');
        const maximizeBtn = window.querySelector('.maximize-btn');
        const closeBtn = window.querySelector('.close-btn');
        
        // Make window draggable
        header.addEventListener('mousedown', dragStart);
        
        // Window controls
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => minimizeWindow(window));
        }
        
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => maximizeWindow(window));
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeWindow(window));
        }
        
        // Bring window to front on click
        window.addEventListener('mousedown', () => bringToFront(window));
    });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
}

function dragStart(e) {
    const window = e.target.closest('.window');
    
    if (e.target.closest('.window-controls')) {
        return;
    }
    
    activeWindow = window;
    bringToFront(window);
    
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    
    const rect = window.getBoundingClientRect();
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    isDragging = true;
}

function drag(e) {
    if (!isDragging || !activeWindow) return;
    
    e.preventDefault();
    
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    
    // Keep window within viewport
    const maxX = window.innerWidth - activeWindow.offsetWidth;
    const maxY = window.innerHeight - activeWindow.offsetHeight - 60; // Account for dock
    
    currentX = Math.max(0, Math.min(currentX, maxX));
    currentY = Math.max(40, Math.min(currentY, maxY)); // Account for top bar
    
    activeWindow.style.left = currentX + 'px';
    activeWindow.style.top = currentY + 'px';
}

function dragEnd() {
    isDragging = false;
    activeWindow = null;
}

let zIndex = 1000;
function bringToFront(window) {
    window.style.zIndex = ++zIndex;
}

function minimizeWindow(window) {
    window.classList.add('minimized');
}

function maximizeWindow(window) {
    window.classList.toggle('maximized');
}

function closeWindow(window) {
    window.style.animation = 'windowAppear 0.3s ease reverse';
    setTimeout(() => {
        window.style.display = 'none';
    }, 300);
}

function restoreWindow(windowId) {
    const window = document.getElementById(windowId);
    if (window) {
        window.style.display = 'block';
        window.classList.remove('minimized');
        bringToFront(window);
        
        // Center window if it was closed
        if (window.style.left === '' || window.style.top === '') {
            const x = (document.body.clientWidth - window.offsetWidth) / 2;
            const y = (document.body.clientHeight - window.offsetHeight) / 2;
            window.style.left = x + 'px';
            window.style.top = y + 'px';
        }
    }
}

// Dock functionality
function initializeDock() {
    const dockItems = document.querySelectorAll('.dock-item[data-window]');
    
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            const windowId = item.getAttribute('data-window');
            restoreWindow(windowId);
        });
    });
}

// AI Assistant - Derek's Personalized Responses
let aiResponses = [
    "System diagnostics complete. All systems operational, Derek.",
    "IamDylbob.com traffic is up 15% this week.",
    "Market futures are looking bullish for tomorrow's open.",
    "Your AAPL options are up 23% since yesterday.",
    "Bobola's weekend revenue exceeded projections by 12%.",
    "The Pour Plan beta testing is showing positive feedback.",
    "Meet the Feed has 47 new user signups today.",
    "Your trading portfolio is outperforming the S&P by 8.3%.",
    "Reminder: Kids' soccer game this Saturday at 3pm.",
    "All seven kids' schedules have been synchronized.",
    "Restaurant inventory system shows optimal stock levels.",
    "Your futures position on ES is showing a profit of $2,340."
];

function initializeAI() {
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send');
    const messagesContainer = document.getElementById('ai-messages');
    
    function sendMessage() {
        const message = input.value.trim();
        if (!message) return;
        
        // Check for EXECUTE commands
        const upperMessage = message.toUpperCase();
        const commands = {
            'MARVEL': 'https://iamdylbob.com/marvel',
            'ONE PIECE': 'https://iamdylbob.com/onepiece',
            'DYLBOB': 'https://iamdylbob.com',
            'BOBOLAS': 'https://bobolasrestaurant.com',
            'POUR PLAN': 'https://thepourplan.com',
            'MEET THE FEED': 'https://meetthefeed.com'
        };
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user-message';
        userMsg.textContent = message;
        messagesContainer.appendChild(userMsg);
        
        // Clear input
        input.value = '';
        
        // Check if it's a command
        if (commands[upperMessage]) {
            // Open browser with the URL
            const browserWindow = document.getElementById('web-browser');
            const urlInput = document.getElementById('browser-url');
            const frame = document.getElementById('browser-frame');
            
            if (browserWindow && urlInput && frame) {
                // Show browser window
                restoreWindow('web-browser');
                bringToFront(browserWindow);
                
                // Navigate to URL
                urlInput.value = commands[upperMessage];
                navigateToUrl(commands[upperMessage]);
                
                // AI response
                setTimeout(() => {
                    const aiMsg = document.createElement('div');
                    aiMsg.className = 'ai-message';
                    aiMsg.textContent = `Executing command: Opening ${upperMessage} in Sargent Dylan Web Activity...`;
                    messagesContainer.appendChild(aiMsg);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 500);
            }
        } else {
            // Normal AI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'ai-message';
                
                // Generate contextual response for Derek
                if (message.toLowerCase().includes('status')) {
                    aiMsg.textContent = "All systems operational. IamDylbob.com, trading platforms, and restaurant systems online.";
                } else if (message.toLowerCase().includes('trade') || message.toLowerCase().includes('market')) {
                    aiMsg.textContent = "Markets are showing positive momentum. Your options positions are up 15% today.";
                } else if (message.toLowerCase().includes('dylbob') || message.toLowerCase().includes('website')) {
                    aiMsg.textContent = "IamDylbob.com is running smoothly. All systems operational.";  
            } else if (message.toLowerCase().includes('restaurant')) {
                    aiMsg.textContent = "Bobola's seeing 20% increase in high-margin items this week.";
                } else if (message.toLowerCase().includes('kids') || message.toLowerCase().includes('family')) {
                    aiMsg.textContent = "All seven kids are doing great. Soccer game Saturday, dance recital next Tuesday.";
                } else if (message.toLowerCase().includes('portfolio')) {
                    aiMsg.textContent = "Your portfolio is up 12.3% this month. Futures positions looking strong.";
                } else {
                    aiMsg.textContent = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                }
                
                messagesContainer.appendChild(aiMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000);
        }
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Removed system monitoring functions since diagnostics window is removed

// Notepad Functionality
function initializeNotepad() {
    const notepadArea = document.getElementById('notepad-area');
    const wordCount = document.getElementById('word-count');
    const saveBtn = document.getElementById('note-save');
    const clearBtn = document.getElementById('note-clear');
    
    // Start with empty notepad
    if (notepadArea) {
        notepadArea.value = '';
    }
    
    // Update word count
    function updateWordCount() {
        if (notepadArea && wordCount) {
            const text = notepadArea.value.trim();
            const words = text ? text.split(/\s+/).length : 0;
            wordCount.textContent = words;
        }
    }
    
    if (notepadArea) {
        notepadArea.addEventListener('input', updateWordCount);
        updateWordCount();
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (notepadArea) {
                localStorage.setItem('dylbob-notes', notepadArea.value);
                // Flash save button
                saveBtn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
                setTimeout(() => {
                    saveBtn.style.background = '';
                }, 300);
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (notepadArea && confirm('Clear all notes?')) {
                notepadArea.value = '';
                updateWordCount();
            }
        });
    }
}

// Browser Functionality
let browserHistory = [];
let historyIndex = -1;

function navigateToUrl(url) {
    const frame = document.getElementById('browser-frame');
    const urlInput = document.getElementById('browser-url');
    
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    
    urlInput.value = url;
    
    // List of sites that work in iframes (your sites)
    const iframeSafeSites = [
        'iamdylbob.com',
        'thepourplan.com',
        'meetthefeed.com',
        'bobolasrestaurant.com',
        'wikipedia.org',
        'example.com'
    ];
    
    // Check if this site typically works in iframes
    const domain = new URL(url).hostname.replace('www.', '');
    const canEmbed = iframeSafeSites.some(site => domain.includes(site));
    
    if (canEmbed) {
        // Try to load in iframe
        frame.innerHTML = `
            <div class="browser-iframe-container">
                <iframe src="${url}" 
                        onerror="showBrowserError('${url}')" 
                        onload="this.style.display='block'"
                        style="display:none;"></iframe>
            </div>
        `;
        
        // Show iframe after a moment if it loads
        setTimeout(() => {
            const iframe = frame.querySelector('iframe');
            if (iframe) {
                iframe.style.display = 'block';
            }
        }, 1000);
    } else {
        // For sites that block iframes, show a preview/link
        frame.innerHTML = `
            <div class="browser-content">
                <div class="browser-error">
                    <h3>EXTERNAL SITE DETECTED</h3>
                    <p>🔒 ${domain} requires opening in a new tab for security</p>
                    <p style="color: #00d4ff; margin-top: 20px;">URL: ${url}</p>
                    <a href="${url}" target="_blank" class="open-external">OPEN IN NEW TAB</a>
                </div>
            </div>
        `;
    }
    
    // Update history
    browserHistory = browserHistory.slice(0, historyIndex + 1);
    browserHistory.push(url);
    historyIndex++;
}

function showBrowserError(url) {
    const frame = document.getElementById('browser-frame');
    const domain = new URL(url).hostname;
    
    frame.innerHTML = `
        <div class="browser-content">
            <div class="browser-error">
                <h3>SITE BLOCKED EMBEDDING</h3>
                <p>⚠️ ${domain} doesn't allow iframe display</p>
                <p style="color: #00d4ff; margin-top: 20px;">This is a security feature of the website</p>
                <a href="${url}" target="_blank" class="open-external">OPEN IN NEW TAB</a>
            </div>
        </div>
    `;
}

function initializeBrowser() {
    const urlInput = document.getElementById('browser-url');
    const frame = document.getElementById('browser-frame');
    const goBtn = document.getElementById('browser-go');
    const backBtn = document.getElementById('browser-back');
    const forwardBtn = document.getElementById('browser-forward');
    const refreshBtn = document.getElementById('browser-refresh');
    
    if (goBtn && urlInput) {
        goBtn.addEventListener('click', () => {
            navigateToUrl(urlInput.value);
        });
        
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                navigateToUrl(urlInput.value);
            }
        });
    }
    
    // Quick links
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-link')) {
            const url = e.target.getAttribute('data-url');
            navigateToUrl(url);
        }
    });
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (historyIndex > 0) {
                historyIndex--;
                navigateToUrl(browserHistory[historyIndex]);
            }
        });
    }
    
    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            if (historyIndex < browserHistory.length - 1) {
                historyIndex++;
                navigateToUrl(browserHistory[historyIndex]);
            }
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (historyIndex >= 0 && browserHistory[historyIndex]) {
                navigateToUrl(browserHistory[historyIndex]);
            }
        });
    }
}

// Calculator Functionality
function initializeCalculator() {
    const display = document.getElementById('calc-display');
    const buttons = document.querySelectorAll('.calc-btn');
    
    let currentValue = '0';
    let previousValue = null;
    let operation = null;
    let shouldResetDisplay = false;
    
    function updateDisplay() {
        if (display) {
            display.value = currentValue;
        }
    }
    
    function handleNumber(num) {
        if (shouldResetDisplay) {
            currentValue = '0';
            shouldResetDisplay = false;
        }
        
        if (currentValue === '0' && num !== '.') {
            currentValue = num;
        } else if (num === '.' && currentValue.includes('.')) {
            return;
        } else {
            currentValue += num;
        }
        updateDisplay();
    }
    
    function handleOperation(op) {
        const current = parseFloat(currentValue);
        
        if (previousValue === null) {
            previousValue = current;
        } else if (operation) {
            const result = calculate();
            currentValue = String(result);
            previousValue = result;
            updateDisplay();
        }
        
        operation = op;
        shouldResetDisplay = true;
    }
    
    function calculate() {
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);
        
        switch(operation) {
            case 'add': return prev + current;
            case 'subtract': return prev - current;
            case 'multiply': return prev * current;
            case 'divide': return current !== 0 ? prev / current : 0;
            default: return current;
        }
    }
    
    function handleEquals() {
        if (operation && previousValue !== null) {
            currentValue = String(calculate());
            operation = null;
            previousValue = null;
            shouldResetDisplay = true;
            updateDisplay();
        }
    }
    
    function handleClear() {
        currentValue = '0';
        previousValue = null;
        operation = null;
        shouldResetDisplay = false;
        updateDisplay();
    }
    
    function handleDelete() {
        if (currentValue.length > 1) {
            currentValue = currentValue.slice(0, -1);
        } else {
            currentValue = '0';
        }
        updateDisplay();
    }
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            const action = button.getAttribute('data-action');
            
            if (value) {
                handleNumber(value);
            } else if (action) {
                switch(action) {
                    case 'clear': handleClear(); break;
                    case 'delete': handleDelete(); break;
                    case 'equals': handleEquals(); break;
                    case 'add':
                    case 'subtract':
                    case 'multiply':
                    case 'divide':
                        handleOperation(action);
                        break;
                }
            }
        });
    });
    
    updateDisplay();
}

// Eva's Garden Intelligence
function initializePlantation() {
    const plantFacts = [
        { 
            fact: "Spider plants can remove up to 90% of toxins from the air in just two days!",
            tip: "Water your plants in the morning! This gives them time to absorb water before the heat of the day."
        },
        { 
            fact: "The oldest known potted plant is over 290 years old and lives in Kew Gardens, London.",
            tip: "Yellow leaves often mean overwatering, while brown crispy leaves usually indicate underwatering."
        },
        { 
            fact: "Bamboo can grow up to 35 inches in a single day, making it the fastest-growing plant on Earth!",
            tip: "Group plants with similar water needs together to make care easier and more efficient."
        },
        { 
            fact: "A single tree can absorb 48 pounds of CO2 per year and produce enough oxygen for two people.",
            tip: "Use coffee grounds as fertilizer - they're rich in nitrogen and help acidify the soil."
        },
        { 
            fact: "The smell of freshly cut grass is actually a plant distress call to attract predators of grass-eating insects.",
            tip: "Rotate your houseplants quarter-turn weekly to ensure even growth on all sides."
        },
        { 
            fact: "Sunflowers can be used to clean up radioactive soil - they absorb heavy metals and toxins.",
            tip: "Bottom watering prevents fungus gnats and encourages deeper root growth."
        },
        { 
            fact: "The Venus Flytrap can count! It needs two trigger hair touches within 20 seconds to close.",
            tip: "Dust your plant leaves monthly - clean leaves photosynthesize more efficiently."
        },
        { 
            fact: "Plants can recognize their siblings and give them preferential treatment by sharing nutrients.",
            tip: "Use ice cubes for slow-release watering of orchids and other sensitive plants."
        }
    ];
    
    let currentFactIndex = 0;
    
    const factElement = document.getElementById('plant-fact');
    const tipElement = document.getElementById('plant-tip');
    const newFactBtn = document.getElementById('new-plant-fact');
    
    function updatePlantWisdom() {
        currentFactIndex = (currentFactIndex + 1) % plantFacts.length;
        const current = plantFacts[currentFactIndex];
        
        if (factElement) {
            factElement.style.opacity = '0';
            setTimeout(() => {
                factElement.textContent = current.fact;
                factElement.style.opacity = '1';
            }, 300);
        }
        
        if (tipElement) {
            tipElement.style.opacity = '0';
            setTimeout(() => {
                tipElement.textContent = current.tip;
                tipElement.style.opacity = '1';
            }, 300);
        }
    }
    
    if (newFactBtn) {
        newFactBtn.addEventListener('click', updatePlantWisdom);
    }
    
    // Change plant wisdom daily
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    currentFactIndex = dayOfYear % plantFacts.length;
    const todaysFact = plantFacts[currentFactIndex];
    
    if (factElement) factElement.textContent = todaysFact.fact;
    if (tipElement) tipElement.textContent = todaysFact.tip;
}

// Add glowing effect to armor parts on hover
document.querySelectorAll('.armor-part').forEach(part => {
    part.addEventListener('mouseenter', () => {
        part.style.fill = 'rgba(0,212,255,0.6)';
        part.style.filter = 'drop-shadow(0 0 20px #00d4ff)';
    });
    
    part.addEventListener('mouseleave', () => {
        part.style.fill = 'rgba(0,212,255,0.2)';
        part.style.filter = 'drop-shadow(0 0 10px #00d4ff)';
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + D: Focus D.Y.L.B.O.B
    if (e.altKey && e.key === 'd') {
        restoreWindow('ai-assistant');
        document.getElementById('ai-input').focus();
    }
    
    // Alt + N: Focus Notepad
    if (e.altKey && e.key === 'n') {
        restoreWindow('notepad');
        document.getElementById('notepad-area').focus();
    }
    
    // Alt + B: Focus Browser
    if (e.altKey && e.key === 'b') {
        restoreWindow('web-browser');
        document.getElementById('browser-url').focus();
    }
    
    // Alt + C: Focus Calculator
    if (e.altKey && e.key === 'c') {
        restoreWindow('calculator');
    }
    
    // Alt + P: Show Plantation
    if (e.altKey && e.key === 'p') {
        restoreWindow('plantation');
    }
});