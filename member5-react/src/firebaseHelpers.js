// ════════════════════════════════════════════════════
//  localStorage Helpers — Watchlist, Settings, Integrations
//  (Works offline, no backend needed!)
// ════════════════════════════════════════════════════

const KEYS = {
  watchlist:    'netflix_m5_watchlist',
  settings:     'netflix_m5_settings',
  integrations: 'netflix_m5_integrations',
}

// ── WATCHLIST ──────────────────────────────────────

export function getWatchlist() {
  const data = localStorage.getItem(KEYS.watchlist)
  return data ? JSON.parse(data) : []
}

export function addToWatchlist(movie) {
  const list = getWatchlist()
  const newMovie = { ...movie, id: Date.now().toString(), addedAt: new Date().toISOString() }
  localStorage.setItem(KEYS.watchlist, JSON.stringify([...list, newMovie]))
  return newMovie.id
}

export function removeFromWatchlist(movieId) {
  const list = getWatchlist().filter(m => m.id !== movieId)
  localStorage.setItem(KEYS.watchlist, JSON.stringify(list))
}

export function isWatchlistEmpty() {
  return getWatchlist().length === 0
}

// ── SETTINGS ──────────────────────────────────────

const DEFAULT_SETTINGS = {
  displayName:      'Ravi Kumar',
  email:            'ravikumar@email.com',
  language:         'English',
  plan:             'premium',
  autoplayEpisode:  true,
  autoplayPreviews: false,
  notifNewArrivals: true,
  notifWatchlist:   true,
  notifBilling:     true,
  notifPromo:       false,
  watchHistory:     true,
  continueWatching: true,
  twoFactorAuth:    false,
}

export function getSettings() {
  const data = localStorage.getItem(KEYS.settings)
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS
}

export function saveSettings(data) {
  const current = getSettings()
  localStorage.setItem(KEYS.settings, JSON.stringify({ ...current, ...data }))
}

// ── INTEGRATIONS ──────────────────────────────────

const DEFAULT_INTEGRATIONS = {
  spotify:  true,
  google:   true,
  alexa:    true,
  youtube:  false,
  facebook: false,
  apple:    false,
  discord:  false,
  twitter:  false,
  twitch:   false,
}

export function getIntegrations() {
  const data = localStorage.getItem(KEYS.integrations)
  return data ? { ...DEFAULT_INTEGRATIONS, ...JSON.parse(data) } : DEFAULT_INTEGRATIONS
}

export function updateIntegration(appId, connected) {
  const current = getIntegrations()
  localStorage.setItem(KEYS.integrations, JSON.stringify({ ...current, [appId]: connected }))
}
