/* ================================================
   NETFLIX MEMBER 5 - WATCHLIST PAGE JS
   ================================================ */

'use strict';

/* ---- NAVBAR SCROLL EFFECT ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ================================================
   TOAST NOTIFICATION
   ================================================ */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message, type = 'default') {
  toast.textContent = message;
  toast.style.borderLeftColor =
    type === 'error' ? '#ff4444' :
    type === 'success' ? '#46d369' : '#e50914';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ================================================
   FILTER TABS
   ================================================ */
const filterTabs = document.querySelectorAll('.filter-tab');
const movieCards = document.querySelectorAll('.movie-grid .movie-card');
const countSpan = document.querySelector('.watchlist-count span');

// Store data-type on each card
const cardTypes = [
  'movie', 'show', 'movie', 'show', 'show',
  'show', 'movie', 'show', 'show', 'show',
  'show', 'documentary'
];

movieCards.forEach((card, i) => {
  card.setAttribute('data-type', cardTypes[i] || 'movie');
});

function filterCards(type) {
  let visible = 0;
  movieCards.forEach(card => {
    const cardType = card.getAttribute('data-type');
    const show = type === 'all' || cardType === type;
    card.style.display = show ? 'block' : 'none';
    if (show) visible++;
  });

  // Update count
  if (countSpan) countSpan.textContent = visible;

  // Show empty state if none visible
  const emptyState = document.getElementById('emptyState');
  if (emptyState) {
    emptyState.classList.toggle('show', visible === 0);
  }
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const id = tab.id;
    const typeMap = {
      'tab-all': 'all',
      'tab-movies': 'movie',
      'tab-shows': 'show',
      'tab-documentary': 'documentary'
    };
    filterCards(typeMap[id] || 'all');
  });
});

/* ================================================
   REMOVE CARD (animate out)
   ================================================ */
const grid = document.getElementById('watchlistGrid');

function removeCard(card) {
  card.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
  card.style.transform = 'scale(0.85)';
  card.style.opacity = '0';
  setTimeout(() => {
    card.remove();
    updateCount();
    checkEmpty();
  }, 350);
  showToast('✓ Removed from My List');
}

function updateCount() {
  const remaining = document.querySelectorAll('.movie-grid .movie-card');
  if (countSpan) countSpan.textContent = remaining.length;
}

function checkEmpty() {
  const remaining = document.querySelectorAll('.movie-grid .movie-card');
  const emptyState = document.getElementById('emptyState');
  if (emptyState) {
    emptyState.classList.toggle('show', remaining.length === 0);
  }
}

// Delegate click events on grid
if (grid) {
  grid.addEventListener('click', (e) => {
    const removeTop = e.target.closest('.remove-btn-top');
    const removeBtn = e.target.closest('.card-btn.remove');

    if (removeTop || removeBtn) {
      const card = e.target.closest('.movie-card');
      if (card) removeCard(card);
    }

    // Play button click
    const playBtn = e.target.closest('.card-btn.play');
    if (playBtn) {
      const titleEl = e.target.closest('.movie-card').querySelector('.card-title');
      const title = titleEl ? titleEl.textContent : 'Title';
      showToast(`▶ Playing: ${title}`, 'success');
    }

    // Info button click
    const infoBtn = e.target.closest('.card-btn.info');
    if (infoBtn) {
      const titleEl = e.target.closest('.movie-card').querySelector('.card-title');
      const title = titleEl ? titleEl.textContent : 'Title';
      showToast(`ℹ More info: ${title}`);
    }
  });
}

/* ================================================
   CONTINUE WATCHING — PLAY OVERLAY CLICK
   ================================================ */
document.querySelectorAll('.continue-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('.card-title');
    const name = title ? title.textContent : 'Episode';
    showToast(`▶ Resuming: ${name}`, 'success');
  });
});

/* ================================================
   SORT DROPDOWN
   ================================================ */
const sortSelect = document.querySelector('.sort-select');
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    const val = sortSelect.value;
    const labelMap = {
      date: 'Sorted by Date Added',
      az: 'Sorted A–Z',
      year: 'Sorted by Release Year',
      rating: 'Sorted by Rating'
    };
    showToast(`📋 ${labelMap[val] || 'Sorted'}`);
  });
}

/* ================================================
   PROGRESS BAR ANIMATE ON LOAD
   ================================================ */
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1s ease';
      bar.style.width = target;
    }, 400);
  });
});

/* ================================================
   KEYBOARD ACCESSIBILITY — ESC closes dropdown
   ================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toast.classList.remove('show');
  }
});

console.log('%c🎬 Watchlist JS Loaded — Netflix Member 5', 'color:#e50914; font-weight:bold;');
