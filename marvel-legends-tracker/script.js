// Simple version without authentication complexity
let figures = [];
let nextId = 1;

// Load from storage
function loadFromStorage() {
    const stored = localStorage.getItem('marvelLegendsFigures');
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
    localStorage.setItem('marvelLegendsFigures', JSON.stringify(figures));
}

function updateStats() {
    document.getElementById('totalCount').textContent = figures.length;
    document.getElementById('ownedCount').textContent = figures.filter(f => f.status === 'owned').length;
    document.getElementById('wishlistCount').textContent = figures.filter(f => f.status === 'wishlist').length;
}

function updateWaveFilter() {
    const waves = [...new Set(figures.map(f => f.wave).filter(w => w))];
    const filterWave = document.getElementById('filterWave');
    filterWave.innerHTML = '<option value="all">All Waves</option>';
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
    
    const catalogMatch = typeof marvelLegendsCatalog !== 'undefined' ? 
        marvelLegendsCatalog.find(f => f.name.toLowerCase() === figure.name.toLowerCase()) : null;
    const imagePath = catalogMatch && catalogMatch.image ? 
        `images/figures/${catalogMatch.image}` : 'images/figures/no-image.svg';
    
    let detailsHTML = '';
    if (figure.year) detailsHTML += `<div>Year: ${figure.year}</div>`;
    if (figure.baf) detailsHTML += `<div>BAF: ${figure.baf}</div>`;
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
    document.getElementById('figureBaf').value = figure.baf || '';
    document.getElementById('figurePrice').value = figure.price || '';
    document.getElementById('figureNotes').value = figure.notes || '';
    
    modal.style.display = 'block';
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        figure.name = document.getElementById('figureName').value;
        figure.wave = document.getElementById('figureWave').value;
        figure.year = document.getElementById('figureYear').value;
        figure.status = document.getElementById('figureStatus').value;
        figure.baf = document.getElementById('figureBaf').value;
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
        baf: document.getElementById('figureBaf').value,
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
    const catalog = typeof marvelLegendsCatalog !== 'undefined' ? marvelLegendsCatalog : [];
    
    document.getElementById('totalInventory').textContent = catalog.length;
    document.getElementById('totalCategories').textContent = [...new Set(catalog.map(f => f.category))].length;
    document.getElementById('totalWaves').textContent = [...new Set(catalog.map(f => f.wave))].length;
    
    const categories = [...new Set(catalog.map(f => f.category))];
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
    
    displayInventory();
}

function displayInventory() {
    const catalog = typeof marvelLegendsCatalog !== 'undefined' ? marvelLegendsCatalog : [];
    const inventoryGrid = document.getElementById('inventoryGrid');
    if (!inventoryGrid) return;
    
    const searchTerm = (document.getElementById('inventorySearch')?.value || '').toLowerCase();
    const categoryValue = document.getElementById('categoryFilter')?.value || 'all';
    const yearValue = document.getElementById('yearFilter')?.value || 'all';
    const sortValue = document.getElementById('sortBy')?.value || 'name';
    
    let filtered = catalog.filter(figure => {
        const matchesSearch = figure.name.toLowerCase().includes(searchTerm) ||
                             figure.wave.toLowerCase().includes(searchTerm) ||
                             figure.category.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryValue === 'all' || figure.category === categoryValue;
        const matchesYear = yearValue === 'all' || figure.year.toString() === yearValue;
        
        return matchesSearch && matchesCategory && matchesYear;
    });
    
    // Simple sorting
    filtered.sort((a, b) => {
        switch(sortValue) {
            case 'year-new': return b.year - a.year;
            case 'year-old': return a.year - b.year;
            case 'category': return a.category.localeCompare(b.category);
            case 'wave': return a.wave.localeCompare(b.wave);
            case 'price-low': return a.retail - b.retail;
            case 'price-high': return b.retail - a.retail;
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
        
        const imagePath = `images/figures/${figure.image || 'no-image.jpg'}`;
        const amazonSearch = `https://www.amazon.com/s?k=${encodeURIComponent('Marvel Legends ' + figure.name)}`;
        const ebaySearch = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent('Marvel Legends ' + figure.name)}`;
        
        card.innerHTML = `
            ${isOwned ? '<div class="collection-ribbon">OWNED</div>' : ''}
            ${isWishlisted ? '<div class="collection-ribbon wishlist-ribbon">WISHLIST</div>' : ''}
            <img src="${imagePath}" alt="${figure.name}" class="inventory-image" onerror="this.src='images/figures/no-image.jpg'">
            <div class="inventory-name">${figure.name}</div>
            <div class="inventory-wave">${figure.wave}</div>
            ${figure.baf !== 'None' ? `<div style="color: #666; font-size: 0.85em; margin-bottom: 5px;">BAF: ${figure.baf}</div>` : ''}
            <div class="inventory-details">
                <span class="inventory-category">${figure.category}</span>
                <span class="inventory-price">$${figure.retail}</span>
            </div>
            ${!inCollection ? `
                <div class="purchase-links">
                    <a href="${amazonSearch}" target="_blank" class="purchase-link amazon-link">Amazon</a>
                    <a href="${ebaySearch}" target="_blank" class="purchase-link ebay-link">eBay</a>
                </div>
                <div class="action-buttons">
                    <button class="add-to-collection owned-btn" onclick="addFromInventory('${figure.name.replace(/'/g, "\\'")}', '${figure.wave.replace(/'/g, "\\'")}', '${figure.year}', '${figure.baf.replace(/'/g, "\\'")}', '${figure.retail}', 'owned')">
                        + I OWN THIS
                    </button>
                    <button class="add-to-collection wishlist-btn" onclick="addFromInventory('${figure.name.replace(/'/g, "\\'")}', '${figure.wave.replace(/'/g, "\\'")}', '${figure.year}', '${figure.baf.replace(/'/g, "\\'")}', '${figure.retail}', 'wishlist')">
                        + WISHLIST
                    </button>
                </div>
            ` : (isWishlisted ? `
                <div class="action-buttons">
                    <button class="add-to-collection owned-btn" onclick="addFromInventory('${figure.name.replace(/'/g, "\\'")}', '${figure.wave.replace(/'/g, "\\'")}', '${figure.year}', '${figure.baf.replace(/'/g, "\\'")}', '${figure.retail}', 'owned')">
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

function addFromInventory(name, wave, year, baf, price, status) {
    figures = figures.filter(f => f.name.toLowerCase() !== name.toLowerCase());
    saveToStorage();
    
    const figureData = {
        name: name,
        wave: wave,
        year: year,
        status: status || 'owned',
        baf: baf !== 'None' ? baf : '',
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