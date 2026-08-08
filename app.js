// Global State
let currentFilter = 'All';
let searchQuery = '';

// DOM Elements
let appsGrid;
let appCountDisplay;
let ageGateOverlay;
let interstitialOverlay;
let interstitialConfirmBtn;
let appSearch;
let searchClearBtn;

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  appsGrid = document.getElementById('appsGrid');
  appCountDisplay = document.getElementById('appCountDisplay');
  ageGateOverlay = document.getElementById('ageGateOverlay');
  interstitialOverlay = document.getElementById('interstitialOverlay');
  interstitialConfirmBtn = document.getElementById('interstitialConfirmBtn');
  appSearch = document.getElementById('appSearch');
  searchClearBtn = document.getElementById('searchClearBtn');

  // Age Gate Memory Check
  const isVerified = localStorage.getItem('age_verified_18');
  if (isVerified !== 'true' && ageGateOverlay) {
    ageGateOverlay.classList.add('open');
  }

  // Intercept all outbound links for Interstitial warn step
  setupOutboundLinkInterception();

  // Navigation Click listeners for smooth scrolling
  setupNavigationSmoothScroll();

  // Search & Filter Tab listeners
  setupSearchAndFilters();

  // Listen for hash changes to navigate categories
  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
});

// Setup Intercept outbound download triggers
function setupOutboundLinkInterception() {
  document.addEventListener('click', (e) => {
    const outboundLink = e.target.closest('.outbound-link');
    if (outboundLink) {
      e.preventDefault();
      const targetUrl = outboundLink.getAttribute('href');
      triggerInterstitial(targetUrl);
    }
  });
}

// Age Gate confirm controls
function confirmAge(verified) {
  if (verified) {
    localStorage.setItem('age_verified_18', 'true');
    if (ageGateOverlay) ageGateOverlay.classList.remove('open');
  } else {
    window.location.href = 'https://www.google.com';
  }
}

// Redirect Interstitial Logic
let redirectTimer = null;
function triggerInterstitial(url) {
  if (!interstitialOverlay || !interstitialConfirmBtn) return;
  
  interstitialConfirmBtn.setAttribute('href', url);
  interstitialOverlay.classList.add('open');
  
  // Auto redirect after 3 seconds
  redirectTimer = setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
    closeInterstitial();
  }, 3000);
}

function closeInterstitial() {
  if (interstitialOverlay) interstitialOverlay.classList.remove('open');
  if (redirectTimer) clearTimeout(redirectTimer);
}

// Card click handler for routing to SSG pages
function handleCardClick(event, url) {
  if (event.target.closest('.btn-primary') || event.target.closest('.btn-secondary')) {
    return; // let buttons trigger naturally
  }
  window.location.href = url;
}

// Search and Category Tabs
function setupSearchAndFilters() {
  if (appSearch) {
    appSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (searchQuery.length > 0) {
        if (searchClearBtn) searchClearBtn.style.display = 'flex';
      } else {
        if (searchClearBtn) searchClearBtn.style.display = 'none';
      }
      filterListings();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (appSearch) {
        appSearch.value = '';
      }
      searchQuery = '';
      searchClearBtn.style.display = 'none';
      filterListings();
    });
  }

  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      currentFilter = category;
      
      // Update tabs active state
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update Hash if matching home page nav categories
      if (category === 'Rummy') {
        window.location.hash = '#rummy';
      } else if (category === 'Slots') {
        window.location.hash = '#slots';
      } else if (category === 'All') {
        window.location.hash = '';
      }

      filterListings();
    });
  });
}

// Parse URL hash for category navigation
function handleHashChange() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  
  let targetCategory = 'All';
  if (hash === 'rummy') {
    targetCategory = 'Rummy';
  } else if (hash === 'slots') {
    targetCategory = 'Slots';
  } else if (hash === 'spin') {
    targetCategory = 'Spin';
  } else if (hash === 'bet') {
    targetCategory = 'Bet';
  } else if (hash === 'jackpot') {
    targetCategory = 'Jackpot';
  }
  
  currentFilter = targetCategory;

  // Sync Category Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    if (tab.getAttribute('data-category') === targetCategory) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Sync Header links active class
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
  
  if (hash === 'rummy') {
    const link = document.getElementById('navRummy');
    if (link) link.classList.add('active');
  } else if (hash === 'slots') {
    const link = document.getElementById('navSlots');
    if (link) link.classList.add('active');
  } else {
    const link = document.getElementById('navHome');
    if (link) link.classList.add('active');
  }

  // Sync Mobile Bottom Nav active class
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
  bottomNavItems.forEach(item => item.classList.remove('active'));

  if (hash === 'rummy') {
    const item = document.getElementById('bottomNavRummy');
    if (item) item.classList.add('active');
  } else if (hash === 'slots') {
    const item = document.getElementById('bottomNavSlots');
    if (item) item.classList.add('active');
  } else {
    const item = document.getElementById('bottomNavHome');
    if (item) item.classList.add('active');
  }
  
  filterListings();
}

// Setup Navigation clicks
function setupNavigationSmoothScroll() {
  const homeLink = document.getElementById('navHome');
  const rummyLink = document.getElementById('navRummy');
  const slotsLink = document.getElementById('navSlots');
  
  const bottomHome = document.getElementById('bottomNavHome');
  const bottomRummy = document.getElementById('bottomNavRummy');
  const bottomSlots = document.getElementById('bottomNavSlots');

  const links = [
    { el: homeLink, hash: '' },
    { el: bottomHome, hash: '' },
    { el: rummyLink, hash: '#rummy' },
    { el: bottomRummy, hash: '#rummy' },
    { el: slotsLink, hash: '#slots' },
    { el: bottomSlots, hash: '#slots' }
  ];

  links.forEach(item => {
    if (item.el) {
      item.el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = item.hash;
        
        if (item.hash === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Scroll to controls or grid smoothly
          const mainContent = document.getElementById('mainContent');
          if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  });
}

// Filter cards in the DOM based on active category & search query
function filterListings() {
  const cards = document.querySelectorAll('.app-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const category = card.getAttribute('data-category');
    const name = card.getAttribute('data-name');
    
    // Category check
    let matchesCategory = false;
    if (currentFilter === 'All') {
      matchesCategory = true;
    } else {
      matchesCategory = (category === currentFilter);
    }
    
    // Search query check
    let matchesSearch = true;
    if (searchQuery.length > 0) {
      matchesSearch = name.includes(searchQuery) || category.toLowerCase().includes(searchQuery);
    }
    
    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  if (appCountDisplay) {
    appCountDisplay.textContent = `Showing ${visibleCount} apps`;
  }
}
