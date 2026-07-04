/* ================================================
   NETFLIX MEMBER 5 - WATCHLIST PAGE JS
   ================================================ */

'use strict';

/* ---- NAVBAR SCROLL EFFECT ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ================================================
   TOAST NOTIFICATION
   ================================================ */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message, type = 'default') {
  toast.textContent = message;
  toast.style.borderLeftColor =
    type === 'error'   ? '#ff4444' :
    type === 'success' ? '#46d369' :
    type === 'warning' ? '#f5a623' : '#e50914';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ================================================
   FILTER TABS
   ================================================ */
const filterTabs   = document.querySelectorAll('.filter-tab');
const movieCards   = document.querySelectorAll('.movie-grid .movie-card');
const countSpan    = document.querySelector('.watchlist-count span');

// Assign data-type to each card
const cardTypes = [
  'movie','show','movie','show','show',
  'show','movie','show','show','show',
  'show','documentary'
];
movieCards.forEach((card, i) => {
  card.setAttribute('data-type', cardTypes[i] || 'movie');
});

function filterCards(type) {
  let visible = 0;
  movieCards.forEach(card => {
    const show = (type === 'all' || card.getAttribute('data-type') === type);
    card.style.display = show ? 'block' : 'none';
    if (show) visible++;
  });
  if (countSpan) countSpan.textContent = visible;
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.classList.toggle('show', visible === 0);
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    const typeMap = { 'tab-all':'all','tab-movies':'movie','tab-shows':'show','tab-documentary':'documentary' };
    filterCards(typeMap[tab.id] || 'all');
  });
});

/* ================================================
   REMOVE CARD — animate out
   ================================================ */
const grid = document.getElementById('watchlistGrid');

function removeCard(card) {
  card.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
  card.style.transform  = 'scale(0.8)';
  card.style.opacity    = '0';
  setTimeout(() => {
    card.remove();
    if (countSpan) countSpan.textContent = document.querySelectorAll('.movie-grid .movie-card').length;
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.classList.toggle('show', document.querySelectorAll('.movie-grid .movie-card').length === 0);
  }, 350);
  showToast('✓ Removed from My List');
}

if (grid) {
  grid.addEventListener('click', e => {
    if (e.target.closest('.remove-btn-top') || e.target.closest('.card-btn.remove')) {
      removeCard(e.target.closest('.movie-card'));
    }
    if (e.target.closest('.card-btn.play')) {
      const t = e.target.closest('.movie-card').querySelector('.card-title')?.textContent || 'Title';
      showToast(`▶ Playing: ${t}`, 'success');
    }
    if (e.target.closest('.card-btn.info')) {
      const t = e.target.closest('.movie-card').querySelector('.card-title')?.textContent || 'Title';
      showToast(`ℹ More info: ${t}`);
    }
  });
}

/* ================================================
   CONTINUE WATCHING — click to play
   ================================================ */
document.querySelectorAll('.continue-card').forEach(card => {
  card.addEventListener('click', () => {
    const t = card.querySelector('.card-title')?.textContent || 'Episode';
    showToast(`▶ Resuming: ${t}`, 'success');
  });
});

/* ================================================
   SORT DROPDOWN
   ================================================ */
const sortSelect = document.querySelector('.sort-select');
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    const labels = { date:'Date Added', az:'A–Z', year:'Release Year', rating:'Rating' };
    showToast(`📋 Sorted by ${labels[sortSelect.value] || ''}`);
  });
}

/* ================================================
   PROGRESS BAR — animate on page load
   ================================================ */
window.addEventListener('load', () => {
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const target = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.transition = 'width 1s ease'; bar.style.width = target; }, 400);
  });
});

console.log('%c🎬 Watchlist JS Loaded', 'color:#e50914;font-weight:bold;');
