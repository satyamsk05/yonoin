// Global State
let currentFilter = 'All';
let searchQuery = '';

// DOM Elements
const appsGrid = document.getElementById('appsGrid');
const appSearch = document.getElementById('appSearch');
const searchClear = document.getElementById('searchClear');
const appCountDisplay = document.getElementById('appCountDisplay');

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  // Listen for hash changes to navigate categories
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
  
  // Initial Render
  renderGrid();
});

// Parse URL hash for category navigation
function handleHashChange() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const tabs = document.querySelectorAll('.filter-tab');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  
  let targetCategory = 'All';
  let targetTab = document.getElementById('tabAll');
  let targetBottomItem = document.getElementById('btnNavHome');
  
  if (hash === 'rummy') {
    targetCategory = 'Rummy';
    targetTab = document.getElementById('tabRummy');
    targetBottomItem = document.getElementById('btnNavRummy');
  } else if (hash === 'slots') {
    targetCategory = 'Slots';
    targetTab = document.getElementById('tabSlots');
    targetBottomItem = document.getElementById('btnNavSlots');
  } else if (hash === 'spin') {
    targetCategory = 'Spin';
    targetTab = document.getElementById('tabSpin');
    targetBottomItem = document.getElementById('btnNavSpin');
  } else if (hash === 'bet') {
    targetCategory = 'Bet';
    targetTab = document.getElementById('tabBet');
  } else if (hash === 'jackpot') {
    targetCategory = 'Jackpot';
    targetTab = document.getElementById('tabJackpot');
  }
  
  // Update state and active button classes
  currentFilter = targetCategory;
  tabs.forEach(tab => tab.classList.remove('active'));
  if (targetTab) {
    targetTab.classList.add('active');
  }
  
  // Update mobile bottom nav active classes
  bottomNavItems.forEach(item => item.classList.remove('active'));
  if (targetBottomItem) {
    targetBottomItem.classList.add('active');
  }
  
  renderGrid();
}

// Category filter action (button click)
function filterCategory(category, buttonEl) {
  // Update hash which triggers handleHashChange
  const hashVal = category === 'All' ? '' : category.toLowerCase();
  window.location.hash = hashVal;
}

// Mobile bottom nav filter action
function setMobileFilter(category, buttonEl) {
  filterCategory(category, null);
}

// Filter programmatically (nav menu links)
function setFilter(category) {
  filterCategory(category, null);
}

// Real-time Search Handler
function handleSearch(input) {
  if (!input) return;
  searchQuery = input.value.trim().toLowerCase();
  
  // Toggle clear button
  if (searchClear) {
    if (searchQuery.length > 0) {
      searchClear.style.display = 'flex';
    } else {
      searchClear.style.display = 'none';
    }
  }
  
  renderGrid();
}

// Clear Search Input
function clearSearch() {
  if (appSearch) appSearch.value = '';
  searchQuery = '';
  if (searchClear) searchClear.style.display = 'none';
  if (appSearch) appSearch.focus();
  renderGrid();
}

// Render App Grid
function renderGrid() {
  // Filter apps
  const filteredApps = APPS_DATA.filter(app => {
    // Check search match
    const nameMatch = app.name.toLowerCase().includes(searchQuery);
    
    // Check category match
    let categoryMatch = false;
    if (currentFilter === 'All') {
      categoryMatch = true;
    } else if (currentFilter === 'Bet') {
      categoryMatch = (app.category === 'Bet' || app.category === 'Arcade');
    } else {
      categoryMatch = (app.category === currentFilter);
    }
    
    return nameMatch && categoryMatch;
  });
  
  // Update App Count Text
  appCountDisplay.textContent = `Showing ${filteredApps.length} apps`;
  
  // Clear previous cards
  appsGrid.innerHTML = '';
  
  if (filteredApps.length === 0) {
    // Render Empty State
    appsGrid.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state-title">No Apps Found</h3>
        <p class="empty-state-desc">We couldn't find any gaming applications matching "${searchQuery}" in this category.</p>
        <button class="reset-btn" onclick="resetSearchAndFilter()">View All Games</button>
      </div>
    `;
    return;
  }
  
  // Helper to generate game slug
  function generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  // Render cards
  filteredApps.forEach(app => {
    const card = document.createElement('div');
    card.className = 'app-card animate-fade-in';
    
    // Fallback logo if missing
    const logoSrc = app.logo ? `logos/${app.logo}` : 'logos/65_Yono_Games.webp';
    const slug = generateSlug(app.name);
    const pageUrl = `games/${slug}.html`;
    
    // Make entire card clickable on mobile to open page (except download button)
    card.onclick = (e) => {
      if (e.target.closest('.btn-primary')) {
        return; // let download link trigger naturally
      }
      window.location.href = pageUrl;
    };
    
    // Format card body
    card.innerHTML = `
      <div class="app-card-header">
        <div class="app-logo-wrapper">
          <img src="${logoSrc}" alt="${app.name} logo" class="app-logo" loading="lazy">
        </div>
        <div class="app-info">
          <h3 class="app-name">${app.name}</h3>
          <span class="app-category-badge">${app.category}</span>
        </div>
      </div>
      
      <div class="app-badges">
        <div class="badge-item">
          <span class="badge-label">Sign Up</span>
          <span class="badge-val">${app.signup_bonus || 'Rs. 51'}</span>
        </div>
        <div class="badge-item">
          <span class="badge-label">Deposit</span>
          <span class="badge-val">${app.deposit_bonus || '100% Match'}</span>
        </div>
      </div>
      
      <div class="app-actions">
        <a href="${app.primary_link}" target="_blank" class="btn btn-primary" rel="noopener noreferrer">Download Now</a>
        <a href="${pageUrl}" class="btn btn-secondary">Details & Rewards</a>
      </div>
    `;
    
    appsGrid.appendChild(card);
  });
}

// Reset filters and search
function resetSearchAndFilter() {
  if (appSearch) appSearch.value = '';
  searchQuery = '';
  if (searchClear) searchClear.style.display = 'none';
  window.location.hash = ''; // triggers reset to 'All'
}


