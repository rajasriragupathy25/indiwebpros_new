/* ================================================
   NETFLIX MEMBER 5 - SETTINGS PAGE JS
   ================================================ */

'use strict';

/* ---- NAVBAR SCROLL ---- */
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
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ================================================
   SIDEBAR NAVIGATION — active + smooth scroll
   ================================================ */
const sidebarItems = document.querySelectorAll('.sidebar-nav-item');

sidebarItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const target = document.querySelector(item.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Auto highlight sidebar on scroll
const sections = document.querySelectorAll('.settings-card[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.id; });
  sidebarItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
  });
});

/* ================================================
   PLAN CARD SELECTION
   ================================================ */
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.plan-card').forEach(c => {
      c.classList.remove('current');
      c.setAttribute('aria-checked','false');
      c.querySelector('.current-badge')?.remove();
    });
    card.classList.add('current');
    card.setAttribute('aria-checked','true');
    const badge = document.createElement('div');
    badge.className = 'current-badge';
    badge.textContent = 'Current Plan';
    card.insertBefore(badge, card.firstChild);
    const name  = card.querySelector('.plan-name').textContent;
    const price = card.querySelector('.plan-price').textContent.trim();
    showToast(`✓ Switched to ${name} Plan — ${price}`, 'success');
  });
  card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); card.click(); } });
});

/* ================================================
   TOGGLE SWITCHES
   ================================================ */
const toggleMap = {
  autoplayEpisode:  'Auto-play next episode',
  autoplayPreviews: 'Auto-play previews',
  notifNewArrivals: 'New arrivals notifications',
  notifWatchlist:   'Watchlist reminders',
  notifBilling:     'Billing notifications',
  notifPromo:       'Promotional emails',
  watchHistory:     'Watch history tracking',
  continueWatching: 'Continue watching',
  twoFactorAuth:    'Two-factor authentication'
};

Object.entries(toggleMap).forEach(([id, label]) => {
  document.getElementById(id)?.addEventListener('change', function () {
    const on   = this.checked;
    showToast(`${on ? '✓' : '✕'} ${label} ${on ? 'enabled' : 'disabled'}`, on ? 'success' : 'default');
  });
});

/* ================================================
   SAVE PROFILE
   ================================================ */
document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
  const name = document.getElementById('displayName')?.value.trim();
  if (!name) { showToast('⚠ Display name cannot be empty', 'warning'); return; }
  const btn = document.getElementById('saveProfileBtn');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Saved!';
    showToast('✓ Profile updated successfully', 'success');
    setTimeout(() => { btn.textContent = 'Save Changes'; btn.disabled = false; }, 2000);
  }, 900);
});

document.getElementById('editProfileBtn')?.addEventListener('click', () => {
  document.getElementById('displayName')?.focus();
  document.getElementById('displayName')?.select();
  showToast('✏ Edit your profile details below');
});

document.querySelector('.avatar-edit-btn')?.addEventListener('click', () => {
  showToast('🖼 Avatar customization coming soon!');
});

/* ================================================
   SECURITY BUTTONS
   ================================================ */
document.getElementById('changeEmailBtn')?.addEventListener('click', () => {
  showToast('📧 Verification link sent to your email');
});
document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
  showToast('🔑 Password reset email sent');
});
document.getElementById('signOutAllBtn')?.addEventListener('click', () => {
  if (confirm('Sign out from all devices?')) showToast('✓ Signed out from all devices', 'success');
});

/* ================================================
   PRIVACY BUTTONS
   ================================================ */
document.getElementById('viewActivityBtn')?.addEventListener('click', () => {
  showToast('📊 Loading your viewing activity...');
});
document.getElementById('downloadDataBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('downloadDataBtn');
  btn.textContent = '⏳ Preparing...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '⬇ Request Data';
    btn.disabled = false;
    showToast('✓ Data export submitted. Email in 24hrs.', 'success');
  }, 1500);
});

/* ================================================
   DANGER ZONE
   ================================================ */
document.getElementById('cancelMembershipBtn')?.addEventListener('click', () => {
  if (confirm('Cancel Netflix membership?\nYou can still watch until your billing date.')) {
    showToast('⚠ Membership cancellation requested', 'warning');
  }
});
document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
  const val = prompt('Type "DELETE" to permanently delete your account:');
  if (val === 'DELETE') showToast('⚠ Account deletion initiated. Check your email.', 'error');
  else if (val !== null) showToast('✕ Account deletion cancelled');
});

/* ================================================
   LOGOUT
   ================================================ */
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (confirm('Sign out of Netflix?')) {
    showToast('👋 Signing out...', 'success');
    setTimeout(() => { window.location.href = 'indiwebpros_new/login.html'; }, 1500);
  }
});

console.log('%c⚙️ Settings JS Loaded', 'color:#e50914;font-weight:bold;');
