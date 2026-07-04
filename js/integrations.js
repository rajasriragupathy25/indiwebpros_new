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
   STATS — Animate counters on load
   ================================================ */
function animateCounter(el, target, duration = 900) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(start);
  }, 16);
}

window.addEventListener('load', () => {
  document.querySelectorAll('.stat-number').forEach(el => {
    const val = parseInt(el.textContent);
    el.textContent = '0';
    setTimeout(() => animateCounter(el, val), 300);
  });
});

/* ================================================
   APP STATE
   ================================================ */
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

function updateStats() {
  const connected    = Object.values(appState).filter(a => a.connected).length;
  const disconnected = Object.keys(appState).length - connected;
  const greenEl = document.querySelector('.stat-number.green');
  const redEl   = document.querySelector('.stat-number.red');
  if (greenEl) greenEl.textContent = connected;
  if (redEl)   redEl.textContent   = disconnected;
}

/* ================================================
   CONNECT / DISCONNECT TOGGLE
   ================================================ */
function toggleApp(appKey, btn, card) {
  const app   = appState[appKey];
  const badge = card.querySelector('.status-badge');

  if (app.connected) {
    if (!confirm(`Disconnect ${app.name}?\nYou can reconnect anytime.`)) return;
    app.connected = false;
    btn.className   = 'connect-btn disconnected';
    btn.textContent = '+ Connect';
    btn.setAttribute('aria-label', `Connect ${app.name}`);
    if (badge) { badge.className = 'status-badge disconnected'; badge.textContent = 'Not Connected'; }
    const sync = card.querySelector('.last-sync');
    if (sync) sync.innerHTML = 'Disconnected just now';
    showToast(`✕ ${app.name} disconnected`);
    updateStats();
  } else {
    btn.textContent = '⏳ Connecting...';
    btn.disabled    = true;
    setTimeout(() => {
      app.connected = true;
      btn.className   = 'connect-btn connected';
      btn.textContent = '✓ Disconnect';
      btn.disabled    = false;
      btn.setAttribute('aria-label', `Disconnect ${app.name}`);
      if (badge) { badge.className = 'status-badge connected'; badge.textContent = 'Connected'; }
      const sync = card.querySelector('.last-sync');
      if (sync) sync.innerHTML = 'Last synced: <span>Just now</span>';
      showToast(`✓ ${app.name} connected!`, 'success');
      updateStats();
    }, 1200);
  }
}

const btnIds  = ['spotifyBtn','googleBtn','alexaBtn','youtubeBtn','facebookBtn','appleBtn','discordBtn','twitterBtn','twitchBtn'];
const appKeys = Object.keys(appState);

btnIds.forEach((id, i) => {
  const btn  = document.getElementById(id);
  if (!btn) return;
  const card = btn.closest('.integration-card');
  btn.addEventListener('click', () => toggleApp(appKeys[i], btn, card));
});

/* ================================================
   RIPPLE EFFECT ON CONNECT BUTTONS
   ================================================ */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { transform:translate(-50%,-50%) scale(3); opacity:0; } }`;
document.head.appendChild(rippleStyle);

document.querySelectorAll('.connect-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const r = document.createElement('span');
    r.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);width:60px;height:60px;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);animation:rippleAnim 0.5s ease-out forwards;pointer-events:none;';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(r);
    setTimeout(() => r.remove(), 500);
  });
});

/* ================================================
   DEVICE SIGN OUT
   ================================================ */
const deviceBtns = {
  removeTVBtn:     'Samsung Smart TV',
  removeIphoneBtn: 'iPhone 14 Pro',
  removeTabletBtn: 'Samsung Galaxy Tab S9'
};

Object.entries(deviceBtns).forEach(([id, name]) => {
  document.getElementById(id)?.addEventListener('click', () => {
    if (!confirm(`Sign out "${name}" from Netflix?`)) return;
    const item = document.getElementById(id).closest('.device-item');
    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    item.style.opacity    = '0';
    item.style.transform  = 'translateX(30px)';
    setTimeout(() => {
      item.remove();
      showToast(`✓ ${name} signed out`, 'success');
      updateDeviceCount();
    }, 400);
  });
});

function updateDeviceCount() {
  const count = document.querySelectorAll('.device-item').length;
  document.querySelectorAll('.section-title').forEach(el => {
    if (el.textContent.includes('Connected Devices')) {
      const b = el.querySelector('.badge');
      if (b) b.textContent = `${count} active`;
    }
  });
  document.querySelectorAll('.stat-item').forEach(item => {
    if (item.querySelector('.stat-label')?.textContent === 'Active Devices') {
      item.querySelector('.stat-number').textContent = count;
    }
  });
}

/* ================================================
   SIGN OUT ALL DEVICES
   ================================================ */
document.getElementById('signOutAllDevicesBtn')?.addEventListener('click', () => {
  if (!confirm('Sign out from ALL other devices?')) return;
  let delay = 0;
  document.querySelectorAll('.device-item').forEach(item => {
    if (item.querySelector('.current-device')) return;
    setTimeout(() => {
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      item.style.opacity    = '0';
      item.style.transform  = 'translateX(30px)';
      setTimeout(() => { item.remove(); updateDeviceCount(); }, 300);
    }, delay);
    delay += 180;
  });
  setTimeout(() => showToast('✓ All other devices signed out', 'success'), delay + 200);
});

/* ================================================
   DATA & PRIVACY BUTTONS
   ================================================ */
document.getElementById('analyticsBtn')?.addEventListener('click',   () => showToast('📊 Analytics preferences saved'));
document.getElementById('adsBtn')?.addEventListener('click',         () => showToast('🎯 Ad personalization updated'));
document.getElementById('historyBtn')?.addEventListener('click',     () => {
  showToast('📋 Loading watch history...');
  setTimeout(() => showToast('📋 247 titles watched in total', 'success'), 1000);
});
document.getElementById('permissionsBtn')?.addEventListener('click', () => {
  document.querySelector('.integrations-grid')?.scrollIntoView({ behavior: 'smooth' });
  showToast('🔗 Scroll up to manage app permissions');
});
document.getElementById('exportBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('exportBtn');
  btn.textContent = '⏳ Preparing...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '⬇ Export';
    btn.disabled    = false;
    showToast('✓ Data export ready! Check your email.', 'success');
  }, 2000);
});
document.getElementById('deleteDataBtn')?.addEventListener('click', () => {
  const val = prompt('⚠ Type "DELETE ALL" to permanently remove all your data:');
  if (val === 'DELETE ALL') showToast('⚠ Data deletion scheduled. Email sent.', 'error');
  else if (val !== null) showToast('✕ Data deletion cancelled');
});

console.log('%c🔗 Integrations JS Loaded', 'color:#e50914;font-weight:bold;');
