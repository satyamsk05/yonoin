// Global State
let currentFilter = 'All';

// DOM Elements
let appsGrid;
let appCountDisplay;
let ageGateOverlay;
let interstitialOverlay;
let interstitialConfirmBtn;

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
  appsGrid = document.getElementById('appsGrid');
  appCountDisplay = document.getElementById('appCountDisplay');
  ageGateOverlay = document.getElementById('ageGateOverlay');
  interstitialOverlay = document.getElementById('interstitialOverlay');
  interstitialConfirmBtn = document.getElementById('interstitialConfirmBtn');

  // Age Gate Memory Check
  const isVerified = localStorage.getItem('age_verified_18');
  if (isVerified !== 'true' && ageGateOverlay) {
    ageGateOverlay.classList.add('open');
  }

  // Intercept all outbound links for Interstitial warn step
  setupOutboundLinkInterception();

  // Navigation Click listeners for smooth scrolling
  setupNavigationSmoothScroll();

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
  
  // Auto redirect after 3.5 seconds
  redirectTimer = setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
    closeInterstitial();
  }, 3500);
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

// Parse URL hash for category navigation
function handleHashChange() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  
  let targetCategory = 'All';
  if (hash === 'rummy') {
    targetCategory = 'Rummy';
  } else if (hash === 'slots') {
    targetCategory = 'Slots';
  }
  
  currentFilter = targetCategory;

  // Update navbar links active classes
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
  
  filterListings();
}

// Setup Navigation clicks
function setupNavigationSmoothScroll() {
  const homeLink = document.getElementById('navHome');
  const rummyLink = document.getElementById('navRummy');
  const slotsLink = document.getElementById('navSlots');
  
  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.hash = '';
    });
  }

  const scrollLinks = [rummyLink, slotsLink];
  scrollLinks.forEach(link => {
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        window.location.hash = targetId;
        
        // Scroll to grid smoothly
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}

// Filter the pre-rendered elements in DOM instead of rebuilding them (SEO friendly SSG)
function filterListings() {
  const cards = document.querySelectorAll('.app-card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const category = card.getAttribute('data-category');
    
    let isVisible = false;
    if (currentFilter === 'All') {
      isVisible = true;
    } else if (currentFilter === 'Rummy') {
      isVisible = (category === 'Rummy');
    } else if (currentFilter === 'Slots') {
      isVisible = (category === 'Slots');
    }
    
    if (isVisible) {
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
