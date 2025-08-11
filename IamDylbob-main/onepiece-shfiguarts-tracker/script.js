// One Piece SH Figuarts Tracker - Simple version without authentication complexity
let figures = [];
let nextId = 1;

// Load from storage
function loadFromStorage() {
    const stored = localStorage.getItem('onePieceFigurartsFigures');
    if (stored) {
        figures = JSON.parse(stored);
        if (figures.length > 0) {
            nextId = Math.max(...figures.map(f => f.id)) + 1;
        }
    }
    updateWaveFilter();
    displayFigures();
    updateStats();
}

function saveToStorage() {
    localStorage.setItem('onePieceFigurartsFigures', JSON.stringify(figures));
}

function updateStats() {
    document.getElementById('totalCount').textContent = figures.length;
    document.getElementById('ownedCount').textContent = figures.filter(f => f.status === 'owned').length;
    document.getElementById('wishlistCount').textContent = figures.filter(f => f.status === 'wishlist').length;
}

function updateWaveFilter() {
    const waves = [...new Set(figures.map(f => f.wave).filter(w => w))];
    const filterWave = document.getElementById('filterWave');
    filterWave.innerHTML = '<option value="all">All Series</option>';
    waves.sort().forEach(wave => {
        const option = document.createElement('option');
        option.value = wave;
        option.textContent = wave;
        filterWave.appendChild(option);
    });
}

function displayFigures() {
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterWave = document.getElementById('filterWave');
    const figuresGrid = document.getElementById('figuresGrid');
    
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    const waveFilter = filterWave.value;
    
    let filtered = figures.filter(figure => {
        const matchesSearch = figure.name.toLowerCase().includes(searchTerm) ||
                             (figure.wave && figure.wave.toLowerCase().includes(searchTerm)) ||
                             (figure.notes && figure.notes.toLowerCase().includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || figure.status === statusFilter;
        const matchesWave = waveFilter === 'all' || figure.wave === waveFilter;
        
        return matchesSearch && matchesStatus && matchesWave;
    });
    
    filtered.sort((a, b) => b.id - a.id);
    
    figuresGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        figuresGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h2>No figures found</h2>
                <p>${figures.length === 0 ? 'Start adding figures to your collection!' : 'Try adjusting your search or filters'}</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(figure => {
        const card = createFigureCard(figure);
        figuresGrid.appendChild(card);
    });
}

function createFigureCard(figure) {
    const card = document.createElement('div');
    card.className = 'figure-card';
    
    const catalogMatch = typeof onePieceFigurartsCatalog !== 'undefined' ? 
        onePieceFigurartsCatalog.find(f => f.name.toLowerCase() === figure.name.toLowerCase()) : null;
    const imagePath = catalogMatch && catalogMatch.image ? 
        catalogMatch.image : 'images/figures/no-image.svg';
    
    let detailsHTML = '';
    if (figure.year) detailsHTML += `<div>Year: ${figure.year}</div>`;
    if (figure.accessories) detailsHTML += `<div>Accessories: ${figure.accessories}</div>`;
    if (figure.price) detailsHTML += `<div>Price: $${figure.price}</div>`;
    if (figure.notes) detailsHTML += `<div>Notes: ${figure.notes}</div>`;
    
    card.innerHTML = `
        <img src="${imagePath}" alt="${figure.name}" class="figure-image" onerror="this.src='images/figures/no-image.svg'">
        <div class="figure-name">${figure.name}</div>
        ${figure.wave ? `<div class="figure-wave">${figure.wave}</div>` : ''}
        <span class="figure-status status-${figure.status}">${figure.status.toUpperCase()}</span>
        ${detailsHTML ? `<div class="figure-details">${detailsHTML}</div>` : ''}
        <div class="figure-actions">
            <button class="btn btn-small btn-edit" onclick="editFigure(${figure.id})">Edit</button>
            <button class="btn btn-small btn-delete" onclick="deleteFigure(${figure.id})">Remove</button>
            ${figure.status === 'wishlist' ? `
                <button class="btn btn-small btn-got-it" onclick="markAsOwned(${figure.id})">Got It!</button>
            ` : ''}
        </div>
    `;
    
    return card;
}

function addFigure(figureData) {
    const figure = {
        id: nextId++,
        ...figureData,
        dateAdded: new Date().toISOString()
    };
    figures.push(figure);
    saveToStorage();
    updateWaveFilter();
    displayFigures();
    updateStats();
}

function deleteFigure(id) {
    const figure = figures.find(f => f.id === id);
    if (!figure) return;
    
    const message = figure.status === 'owned' 
        ? `Remove "${figure.name}" from your collection?\n\nThis will only remove it from your personal collection. You can add it again from the Full Inventory tab.`
        : `Remove "${figure.name}" from your wishlist?\n\nYou can add it again from the Full Inventory tab.`;
    
    if (confirm(message)) {
        figures = figures.filter(f => f.id !== id);
        saveToStorage();
        updateWaveFilter();
        displayFigures();
        displayInventory();
        updateStats();
    }
}

function editFigure(id) {
    const figure = figures.find(f => f.id === id);
    if (!figure) return;
    
    const modal = document.getElementById('addFigureModal');
    const form = document.getElementById('addFigureForm');
    
    document.getElementById('figureName').value = figure.name;
    document.getElementById('figureWave').value = figure.wave || '';
    document.getElementById('figureYear').value = figure.year || '';
    document.getElementById('figureStatus').value = figure.status;
    document.getElementById('figureAccessories').value = figure.accessories || '';
    document.getElementById('figurePrice').value = figure.price || '';
    document.getElementById('figureNotes').value = figure.notes || '';
    
    modal.style.display = 'block';
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        figure.name = document.getElementById('figureName').value;
        figure.wave = document.getElementById('figureWave').value;
        figure.year = document.getElementById('figureYear').value;
        figure.status = document.getElementById('figureStatus').value;
        figure.accessories = document.getElementById('figureAccessories').value;
        figure.price = document.getElementById('figurePrice').value;
        figure.notes = document.getElementById('figureNotes').value;
        
        saveToStorage();
        updateWaveFilter();
        displayFigures();
        updateStats();
        modal.style.display = 'none';
        form.reset();
        form.onsubmit = handleAddFigure;
    };
}

function markAsOwned(id) {
    const figure = figures.find(f => f.id === id);
    if (figure) {
        figure.status = 'owned';
        figure.notes = (figure.notes || '') + ' (Got it!)';
        saveToStorage();
        displayFigures();
        displayInventory();
        updateStats();
    }
}

function handleAddFigure(e) {
    e.preventDefault();
    
    const figureData = {
        name: document.getElementById('figureName').value,
        wave: document.getElementById('figureWave').value,
        year: document.getElementById('figureYear').value,
        status: document.getElementById('figureStatus').value,
        accessories: document.getElementById('figureAccessories').value,
        price: document.getElementById('figurePrice').value,
        notes: document.getElementById('figureNotes').value
    };
    
    addFigure(figureData);
    const modal = document.getElementById('addFigureModal');
    const form = document.getElementById('addFigureForm');
    modal.style.display = 'none';
    form.reset();
}

// Modal functionality
const modal = document.getElementById('addFigureModal');
const addBtn = document.getElementById('addFigureBtn');
const closeBtn = document.getElementsByClassName('close')[0];
const form = document.getElementById('addFigureForm');

addBtn.onclick = function() {
    form.onsubmit = handleAddFigure;
    modal.style.display = 'block';
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
    form.reset();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        form.reset();
    }
}

// Search and filter listeners
document.getElementById('searchInput').addEventListener('input', displayFigures);
document.getElementById('filterStatus').addEventListener('change', displayFigures);
document.getElementById('filterWave').addEventListener('change', displayFigures);

// Tab functionality
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        navTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        tab.classList.add('active');
        
        if (targetTab === 'collection') {
            document.getElementById('collectionTab').classList.add('active');
        } else if (targetTab === 'inventory') {
            document.getElementById('inventoryTab').classList.add('active');
            loadInventory();
        }
    });
});

// Inventory functionality
function loadInventory() {
    const catalog = typeof onePieceFigurartsCatalog !== 'undefined' ? onePieceFigurartsCatalog : [];
    
    document.getElementById('totalInventory').textContent = catalog.length;
    // Get unique character names from catalog
    const uniqueCharacters = [...new Set(catalog.map(f => {
        // Extract character name from figure name
        const name = f.name;
        if (name.includes('LUFFY')) return 'Luffy';
        if (name.includes('ZORO')) return 'Zoro';
        if (name.includes('NAMI')) return 'Nami';
        if (name.includes('SANJI')) return 'Sanji';
        if (name.includes('USOPP')) return 'Usopp';
        if (name.includes('CHOPPER')) return 'Chopper';
        if (name.includes('ROBIN')) return 'Robin';
        if (name.includes('FRANKY')) return 'Franky';
        if (name.includes('BROOK')) return 'Brook';
        if (name.includes('JINBE')) return 'Jinbe';
        if (name.includes('ACE')) return 'Ace';
        if (name.includes('SABO')) return 'Sabo';
        if (name.includes('LAW')) return 'Law';
        if (name.includes('SHANKS')) return 'Shanks';
        if (name.includes('WHITEBEARD')) return 'Whitebeard';
        if (name.includes('KAIDO')) return 'Kaido';
        if (name.includes('YAMATO')) return 'Yamato';
        if (name.includes('MIHAWK')) return 'Mihawk';
        return 'Other';
    }))];
    document.getElementById('totalCategories').textContent = uniqueCharacters.length;
    document.getElementById('totalWaves').textContent = [...new Set(catalog.map(f => f.wave))].length;
    
    // Create category filter from character names
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Characters</option>';
    uniqueCharacters.sort().forEach(character => {
        const option = document.createElement('option');
        option.value = character;
        option.textContent = character;
        categoryFilter.appendChild(option);
    });
    
    displayInventory();
}

function displayInventory() {
    const catalog = typeof onePieceFigurartsCatalog !== 'undefined' ? onePieceFigurartsCatalog : [];
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;
    
    const searchTerm = (document.getElementById('inventorySearch')?.value || '').toLowerCase();
    const categoryValue = document.getElementById('categoryFilter')?.value || 'all';
    const yearValue = document.getElementById('yearFilter')?.value || 'all';
    const sortValue = document.getElementById('sortBy')?.value || 'name';
    
    let filtered = catalog.filter(figure => {
        // Extract character name for filtering
        const name = figure.name;
        let character = 'Other';
        if (name.includes('LUFFY')) character = 'Luffy';
        else if (name.includes('ZORO')) character = 'Zoro';
        else if (name.includes('NAMI')) character = 'Nami';
        else if (name.includes('SANJI')) character = 'Sanji';
        else if (name.includes('USOPP')) character = 'Usopp';
        else if (name.includes('CHOPPER')) character = 'Chopper';
        else if (name.includes('ROBIN')) character = 'Robin';
        else if (name.includes('FRANKY')) character = 'Franky';
        else if (name.includes('BROOK')) character = 'Brook';
        else if (name.includes('JINBE')) character = 'Jinbe';
        else if (name.includes('ACE')) character = 'Ace';
        else if (name.includes('SABO')) character = 'Sabo';
        else if (name.includes('LAW')) character = 'Law';
        else if (name.includes('SHANKS')) character = 'Shanks';
        else if (name.includes('WHITEBEARD')) character = 'Whitebeard';
        else if (name.includes('KAIDO')) character = 'Kaido';
        else if (name.includes('YAMATO')) character = 'Yamato';
        else if (name.includes('MIHAWK')) character = 'Mihawk';
        
        const matchesSearch = figure.name.toLowerCase().includes(searchTerm) ||
                             figure.wave.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryValue === 'all' || character === categoryValue;
        const matchesYear = yearValue === 'all' || figure.year.toString() === yearValue;
        
        return matchesSearch && matchesCategory && matchesYear;
    });
    
    // Simple sorting
    filtered.sort((a, b) => {
        switch(sortValue) {
            case 'year-new': return b.year - a.year;
            case 'year-old': return a.year - b.year;
            case 'category': 
                // Sort by character name
                const getChar = (n) => {
                    if (n.includes('LUFFY')) return 'Luffy';
                    if (n.includes('ZORO')) return 'Zoro';
                    if (n.includes('NAMI')) return 'Nami';
                    if (n.includes('SANJI')) return 'Sanji';
                    return n;
                };
                return getChar(a.name).localeCompare(getChar(b.name));
            case 'wave': return a.wave.localeCompare(b.wave);
            case 'price-low': return 0; // No price data available
            case 'price-high': return 0; // No price data available
            default: return a.name.localeCompare(b.name);
        }
    });
    
    inventoryGrid.innerHTML = '';
    inventoryGrid.className = 'inventory-grid';
    
    filtered.forEach(figure => {
        const isOwned = figures.some(f => 
            f.name.toLowerCase() === figure.name.toLowerCase() && 
            f.status === 'owned'
        );
        const isWishlisted = figures.some(f => 
            f.name.toLowerCase() === figure.name.toLowerCase() && 
            f.status === 'wishlist'
        );
        const inCollection = isOwned || isWishlisted;
        
        const card = document.createElement('div');
        card.className = `inventory-card ${isOwned ? 'owned' : ''} ${isWishlisted ? 'wishlisted' : ''}`;
        
        const imagePath = figure.image || 'images/figures/no-image.svg';
        const amazonSearch = `https://www.amazon.com/s?k=${encodeURIComponent('One Piece SH Figuarts ' + figure.name)}`;
        const ebaySearch = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent('One Piece SH Figuarts ' + figure.name)}`;
        
        card.innerHTML = `
            ${isOwned ? '<div class="collection-ribbon">OWNED</div>' : ''}
            ${isWishlisted ? '<div class="collection-ribbon wishlist-ribbon">WISHLIST</div>' : ''}
            <img src="${imagePath}" alt="${figure.name}" class="inventory-image" onerror="this.src='images/figures/no-image.svg'">
            <div class="inventory-name">${figure.name}</div>
            <div class="inventory-wave">${figure.wave}</div>
            ${figure.bafPart ? `<div style="color: #666; font-size: 0.85em; margin-bottom: 5px;">Accessories: ${figure.bafPart}</div>` : ''}
            <div class="inventory-details">
                <span class="inventory-year">Year: ${figure.year}</span>
            </div>
            ${!inCollection ? `
                <div class="purchase-links">
                    <a href="${amazonSearch}" target="_blank" class="purchase-link amazon-link">Amazon</a>
                    <a href="${ebaySearch}" target="_blank" class="purchase-link ebay-link">eBay</a>
                </div>
                <div class="action-buttons">
                    <button class="add-to-collection owned-btn" onclick="addFromInventory('${figure.name.replace(/'/g, "\\'")}', '${figure.wave.replace(/'/g, "\\'")}', '${figure.year}', '${figure.bafPart ? figure.bafPart.replace(/'/g, "\\'") : ''}', '', 'owned')">
                        + I OWN THIS
                    </button>
                    <button class="add-to-collection wishlist-btn" onclick="addFromInventory('${figure.name.replace(/'/g, "\\'")}', '${figure.wave.replace(/'/g, "\\'")}', '${figure.year}', '${figure.bafPart ? figure.bafPart.replace(/'/g, "\\'") : ''}', '', 'wishlist')">
                        + WISHLIST
                    </button>
                </div>
            ` : (isWishlisted ? `
                <div class="action-buttons">
                    <button class="add-to-collection owned-btn" onclick="addFromInventory('${figure.name.replace(/'/g, "\\'")}', '${figure.wave.replace(/'/g, "\\'")}', '${figure.year}', '${figure.bafPart ? figure.bafPart.replace(/'/g, "\\'") : ''}', '', 'owned')">
                        + I GOT THIS
                    </button>
                    <button class="add-to-collection remove-btn" onclick="removeFromWishlist('${figure.name.replace(/'/g, "\\'")}')">
                        - REMOVE
                    </button>
                </div>
            ` : `
                <button class="add-to-collection" disabled>
                    ✓ OWNED
                </button>
            `)}
        `;
        
        inventoryGrid.appendChild(card);
    });
}

function addFromInventory(name, wave, year, accessories, price, status) {
    figures = figures.filter(f => f.name.toLowerCase() !== name.toLowerCase());
    saveToStorage();
    
    const figureData = {
        name: name,
        wave: wave,
        year: year,
        status: status || 'owned',
        accessories: accessories !== 'None' ? accessories : '',
        price: price,
        notes: `Added from inventory as ${status || 'owned'}`
    };
    
    addFigure(figureData);
    displayInventory();
}

function removeFromWishlist(name) {
    if (confirm(`Remove "${name}" from your wishlist?`)) {
        figures = figures.filter(f => 
            !(f.name.toLowerCase() === name.toLowerCase() && f.status === 'wishlist')
        );
        saveToStorage();
        displayFigures();
        displayInventory();
        updateStats();
    }
}

// Event listeners for inventory
document.getElementById('inventorySearch')?.addEventListener('input', displayInventory);
document.getElementById('categoryFilter')?.addEventListener('change', displayInventory);
document.getElementById('yearFilter')?.addEventListener('change', displayInventory);
document.getElementById('sortBy')?.addEventListener('change', displayInventory);

// Initialize on page load
loadFromStorage();