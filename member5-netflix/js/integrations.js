/* ================================================
   NETFLIX MEMBER 5 - INTEGRATIONS PAGE JS
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
   STATS COUNTER — Animate numbers on load
   ================================================ */
function animateCounter(el, target, duration = 1000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

window.addEventListener('load', () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(el => {
    const val = parseInt(el.textContent);
    el.textContent = '0';
    setTimeout(() => animateCounter(el, val, 800), 300);
  });
});

/* ================================================
   CONNECT / DISCONNECT BUTTONS
   ================================================ */

// Track state per app
const appState = {
  spotify:  { connected: true,  name: 'Spotify' },
  google:   { connected: true,  name: 'Google Account' },
  alexa:    { connected: true,  name: 'Amazon Alexa' },
  youtube:  { connected: false, name: 'YouTube' },
  facebook: { connected: false, name: 'Facebook' },
  apple:    { connected: false, name: 'Apple ID' },
  discord:  { connected: false, name: 'Discord' },
  twitter:  { connected: false, name: 'X (Twitter)' },
  twitch:   { connected: false, name: 'Twitch' }
};

// Stats tracking
let connectedCount = 3;
const statConnected  = document.querySelector('.stat-number.green');
const statDisconnected = document.querySelector('.stat-number.red');

function updateStats() {
  const total = Object.keys(appState).length;
  const connected = Object.values(appState).filter(a => a.connected).length;
  const disconnected = total - connected;

  if (statConnected)     statConnected.textContent = connected;
  if (statDisconnected)  statDisconnected.textContent = disconnected;
}

function toggleApp(appKey, btn, card) {
  const app = appState[appKey];
  if (!app) return;

  const badge = card.querySelector('.status-badge');

  if (app.connected) {
    // Disconnect
    if (!confirm(`Disconnect ${app.name} from Netflix?\n\nYou can reconnect anytime.`)) return;

    app.connected = false;
    btn.className = 'connect-btn disconnected';
    btn.textContent = '+ Connect';
    btn.setAttribute('aria-label', `Connect ${app.name}`);

    if (badge) {
      badge.className = 'status-badge disconnected';
      badge.textContent = 'Not Connected';
      badge.setAttribute('aria-label', `${app.name} is not connected`);
    }

    // Update last sync text
    const syncEl = card.querySelector('.last-sync');
    if (syncEl) syncEl.innerHTML = 'Disconnected just now';

    showToast(`✕ ${app.name} disconnected`, 'default');
  } else {
    // Connect — loading animation
    btn.textContent = '⏳ Connecting...';
    btn.disabled = true;

    setTimeout(() => {
      app.connected = true;
      btn.className = 'connect-btn connected';
      btn.textContent = '✓ Disconnect';
      btn.disabled = false;
      btn.setAttribute('aria-label', `Disconnect ${app.name}`);

      if (badge) {
        badge.className = 'status-badge connected';
        badge.textContent = 'Connected';
        badge.setAttribute('aria-label', `${app.name} is connected`);
      }

      const syncEl = card.querySelector('.last-sync');
      if (syncEl) syncEl.innerHTML = 'Last synced: <span>Just now</span>';

      showToast(`✓ ${app.name} connected successfully!`, 'success');
      updateStats();
    }, 1200);

    return; // Don't call updateStats until async done
  }

  updateStats();
}

// Wire up each button
const btnIds = [
  'spotifyBtn', 'googleBtn', 'alexaBtn',
  'youtubeBtn', 'facebookBtn', 'appleBtn',
  'discordBtn', 'twitterBtn', 'twitchBtn'
];
const appKeys = Object.keys(appState);

btnIds.forEach((btnId, i) => {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const card = btn.closest('.integration-card');
  btn.addEventListener('click', () => toggleApp(appKeys[i], btn, card));
});

/* ================================================
   DEVICE SIGN OUT
   ================================================ */
const deviceButtons = {
  removeTVBtn:     'Samsung Smart TV',
  removeIphoneBtn: 'iPhone 14 Pro',
  removeTabletBtn: 'Samsung Galaxy Tab S9'
};

Object.entries(deviceButtons).forEach(([btnId, deviceName]) => {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!confirm(`Sign out "${deviceName}" from Netflix?`)) return;

    // Animate out
    const deviceItem = btn.closest('.device-item');
    deviceItem.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    deviceItem.style.opacity = '0';
    deviceItem.style.transform = 'translateX(30px)';

    setTimeout(() => {
      deviceItem.remove();
      showToast(`✓ ${deviceName} signed out`, 'success');

      // Update device count badge
      updateDeviceCount();
    }, 400);
  });
});

function updateDeviceCount() {
  const remaining = document.querySelectorAll('.device-item').length;
  const badge = document.querySelector('#devices-heading + .section-title .badge') ||
                document.querySelector('[id="devices-heading"]')?.nextElementSibling?.querySelector('.badge');

  // Find badge near "Connected Devices" heading
  document.querySelectorAll('.section-title').forEach(el => {
    if (el.textContent.includes('Connected Devices')) {
      const b = el.querySelector('.badge');
      if (b) b.textContent = `${remaining} active`;
    }
  });

  // Also update stats bar device count
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => {
    if (item.querySelector('.stat-label')?.textContent === 'Active Devices') {
      item.querySelector('.stat-number').textContent = remaining;
    }
  });
}

/* ================================================
   SIGN OUT ALL DEVICES BUTTON
   ================================================ */
document.getElementById('signOutAllDevicesBtn')?.addEventListener('click', () => {
  if (!confirm('Sign out from ALL devices?\n\nYou will need to log in again on each device.')) return;

  const allDeviceItems = document.querySelectorAll('.device-item');
  let delay = 0;

  allDeviceItems.forEach(item => {
    // Skip "This Device"
    if (item.querySelector('.current-device')) return;

    setTimeout(() => {
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      item.style.opacity = '0';
      item.style.transform = 'translateX(30px)';
      setTimeout(() => {
        item.remove();
        updateDeviceCount();
      }, 300);
    }, delay);

    delay += 200;
  });

  setTimeout(() => {
    showToast('✓ All other devices signed out', 'success');
  }, delay + 200);
});

/* ================================================
   DATA & PRIVACY BUTTONS
   ================================================ */
document.getElementById('analyticsBtn')?.addEventListener('click', () => {
  showToast('📊 Analytics settings updated');
});

document.getElementById('adsBtn')?.addEventListener('click', () => {
  showToast('🎯 Ad personalization settings saved');
});

document.getElementById('historyBtn')?.addEventListener('click', () => {
  showToast('📋 Loading your watch history...');
  setTimeout(() => showToast('📋 Watch history: 247 titles watched', 'success'), 1000);
});

document.getElementById('exportBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('exportBtn');
  btn.textContent = '⏳ Preparing export...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '⬇ Export';
    btn.disabled = false;
    showToast('✓ Data export ready! Check your email.', 'success');
  }, 2000);
});

document.getElementById('permissionsBtn')?.addEventListener('click', () => {
  showToast('🔗 Reviewing connected app permissions...');
  // Scroll to integrations section
  document.querySelector('.integrations-grid')?.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('deleteDataBtn')?.addEventListener('click', () => {
  const confirmed = prompt(
    '⚠ WARNING: This permanently deletes ALL your data.\n\nType "DELETE ALL" to confirm:'
  );
  if (confirmed === 'DELETE ALL') {
    showToast('⚠ Data deletion scheduled. Email confirmation sent.', 'error');
  } else if (confirmed !== null) {
    showToast('✕ Data deletion cancelled');
  }
});

/* ================================================
   CARD HOVER — Ripple effect on connect button
   ================================================ */
document.querySelectorAll('.connect-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,0.3);
      width:60px; height:60px;
      top:50%; left:50%;
      transform:translate(-50%,-50%) scale(0);
      animation: rippleAnim 0.5s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%,-50%) scale(3); opacity: 0; }
  }
`;
document.head.appendChild(style);

console.log('%c🔗 Integrations JS Loaded — Netflix Member 5', 'color:#e50914; font-weight:bold;');
