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
   SIDEBAR NAVIGATION — Smooth scroll + active
   ================================================ */
const sidebarItems = document.querySelectorAll('.sidebar-nav-item');

sidebarItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Smooth scroll to section
    const targetId = item.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Highlight sidebar item on scroll
const sections = document.querySelectorAll('.settings-card[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.id;
  });

  sidebarItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

/* ================================================
   PLAN CARD SELECTION
   ================================================ */
const planCards = document.querySelectorAll('.plan-card');

planCards.forEach(card => {
  card.addEventListener('click', () => {
    planCards.forEach(c => {
      c.classList.remove('current');
      c.setAttribute('aria-checked', 'false');
      // Remove current badge if any
      const badge = c.querySelector('.current-badge');
      if (badge) badge.remove();
    });

    card.classList.add('current');
    card.setAttribute('aria-checked', 'true');

    // Add badge
    const newBadge = document.createElement('div');
    newBadge.className = 'current-badge';
    newBadge.textContent = 'Current Plan';
    card.insertBefore(newBadge, card.firstChild);

    const planName = card.querySelector('.plan-name').textContent;
    const planPrice = card.querySelector('.plan-price').textContent.trim();
    showToast(`✓ Switched to ${planName} Plan — ${planPrice}`, 'success');
  });

  // Keyboard support
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

/* ================================================
   TOGGLE SWITCHES — Save feedback
   ================================================ */
const toggleMap = {
  autoplayEpisode:   'Auto-play next episode',
  autoplayPreviews:  'Auto-play previews',
  notifNewArrivals:  'New arrivals notifications',
  notifWatchlist:    'Watchlist reminders',
  notifBilling:      'Billing notifications',
  notifPromo:        'Promotional emails',
  watchHistory:      'Watch history tracking',
  continueWatching:  'Continue watching',
  twoFactorAuth:     'Two-factor authentication'
};

Object.entries(toggleMap).forEach(([id, label]) => {
  const toggle = document.getElementById(id);
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const state = toggle.checked ? 'enabled' : 'disabled';
    const icon  = toggle.checked ? '✓' : '✕';
    const type  = toggle.checked ? 'success' : 'default';
    showToast(`${icon} ${label} ${state}`, type);
  });
});

/* ================================================
   SAVE PROFILE BUTTON
   ================================================ */
const saveProfileBtn = document.getElementById('saveProfileBtn');
if (saveProfileBtn) {
  saveProfileBtn.addEventListener('click', () => {
    const name = document.getElementById('displayName')?.value.trim();
    if (!name) {
      showToast('⚠ Display name cannot be empty', 'warning');
      return;
    }
    // Animate button
    saveProfileBtn.textContent = 'Saving...';
    saveProfileBtn.disabled = true;
    setTimeout(() => {
      saveProfileBtn.textContent = '✓ Saved!';
      showToast('✓ Profile updated successfully', 'success');
      setTimeout(() => {
        saveProfileBtn.textContent = 'Save Changes';
        saveProfileBtn.disabled = false;
      }, 2000);
    }, 900);
  });
}

/* ================================================
   EDIT PROFILE BUTTON
   ================================================ */
const editProfileBtn = document.getElementById('editProfileBtn');
const displayNameInput = document.getElementById('displayName');

if (editProfileBtn && displayNameInput) {
  editProfileBtn.addEventListener('click', () => {
    displayNameInput.focus();
    displayNameInput.select();
    showToast('✏ Edit your profile details below');
  });
}

/* ================================================
   AVATAR EDIT BUTTON
   ================================================ */
const avatarEditBtn = document.querySelector('.avatar-edit-btn');
if (avatarEditBtn) {
  avatarEditBtn.addEventListener('click', () => {
    showToast('🖼 Avatar customization coming soon!');
  });
}

/* ================================================
   CHANGE EMAIL / PASSWORD BUTTONS
   ================================================ */
document.getElementById('changeEmailBtn')?.addEventListener('click', () => {
  showToast('📧 A verification link has been sent to your email');
});

document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
  showToast('🔑 Password reset email sent to ravikumar@email.com');
});

document.getElementById('signOutAllBtn')?.addEventListener('click', () => {
  if (confirm('Sign out from all devices? You will need to log in again everywhere.')) {
    showToast('✓ Signed out from all devices', 'success');
  }
});

/* ================================================
   VIEW ACTIVITY / DOWNLOAD DATA
   ================================================ */
document.getElementById('viewActivityBtn')?.addEventListener('click', () => {
  showToast('📊 Loading your viewing activity...');
});

document.getElementById('downloadDataBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('downloadDataBtn');
  btn.textContent = '⏳ Preparing...';
  setTimeout(() => {
    btn.textContent = '⬇ Request Data';
    showToast('✓ Data export request submitted. Email in 24 hrs.', 'success');
  }, 1500);
});

/* ================================================
   DANGER ZONE — Confirm dialogs
   ================================================ */
document.getElementById('cancelMembershipBtn')?.addEventListener('click', () => {
  if (confirm('Cancel your Netflix membership?\n\nYou can still watch until July 28, 2026.')) {
    showToast('⚠ Membership cancellation requested', 'warning');
  }
});

document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
  const confirmed = prompt(
    'This will PERMANENTLY delete your account.\n\nType "DELETE" to confirm:'
  );
  if (confirmed === 'DELETE') {
    showToast('⚠ Account deletion initiated. Check your email.', 'error');
  } else if (confirmed !== null) {
    showToast('✕ Account deletion cancelled');
  }
});

/* ================================================
   LOGOUT BUTTON
   ================================================ */
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (confirm('Sign out of Netflix?')) {
    showToast('👋 Signing out...', 'success');
    setTimeout(() => {
      // Redirect to login (other member's page)
      window.location.href = '../indiwebpros_new/login.html';
    }, 1500);
  }
});

console.log('%c⚙️ Settings JS Loaded — Netflix Member 5', 'color:#e50914; font-weight:bold;');
