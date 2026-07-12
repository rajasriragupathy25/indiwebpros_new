import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import '../styles/settings.css'

const SIDEBAR_ITEMS = [
  { id: 'profile',      icon: '👤', label: 'Profile' },
  { id: 'subscription', icon: '💳', label: 'Subscription' },
  { id: 'playback',     icon: '▶️', label: 'Playback' },
  { id: 'notifications',icon: '🔔', label: 'Notifications' },
  { id: 'privacy',      icon: '🔒', label: 'Privacy' },
  { id: 'security',     icon: '🛡️', label: 'Security' },
  { id: 'danger',       icon: '⚠️', label: 'Danger Zone' },
]

const PLANS = [
  { id: 'mobile',   name: 'Mobile',   price: '₹149', quality: '480p',           screens: '1 Screen • Mobile Only',       current: false },
  { id: 'standard', name: 'Standard', price: '₹499', quality: '1080p Full HD',   screens: '2 Screens simultaneously',     current: false },
  { id: 'premium',  name: 'Premium',  price: '₹649', quality: '4K Ultra HD + HDR', screens: '4 Screens simultaneously',   current: true  },
]

function ToggleSwitch({ id, checked, onChange, label }) {
  return (
    <label className="toggle-switch" aria-label={label}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  )
}

function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [toast, setToast]                 = useState({ show: false, message: '', type: 'default' })
  const [displayName, setDisplayName]     = useState('Ravi Kumar')
  const [selectedPlan, setSelectedPlan]   = useState('premium')
  const [saving, setSaving]               = useState(false)

  // Toggle states
  const [toggles, setToggles] = useState({
    autoplayEpisode:  true,
    autoplayPreviews: false,
    notifNewArrivals: true,
    notifWatchlist:   true,
    notifBilling:     true,
    notifPromo:       false,
    watchHistory:     true,
    continueWatching: true,
    twoFactorAuth:    false,
  })

  const showToast = useCallback((message, type = 'default') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }, [])

  const handleToggle = (key, label) => {
    setToggles(prev => {
      const val = !prev[key]
      showToast(`${val ? '✓' : '✕'} ${label} ${val ? 'enabled' : 'disabled'}`, val ? 'success' : 'default')
      return { ...prev, [key]: val }
    })
  }

  const handleSaveProfile = () => {
    if (!displayName.trim()) { showToast('⚠ Name cannot be empty', 'warning'); return }
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      showToast('✓ Profile saved successfully', 'success')
    }, 900)
  }

  const handlePlanSelect = (planId) => {
    const plan = PLANS.find(p => p.id === planId)
    setSelectedPlan(planId)
    showToast(`✓ Switched to ${plan.name} Plan — ${plan.price}/mo`, 'success')
  }

  const handleLogout = () => {
    if (window.confirm('Sign out of Netflix?')) {
      showToast('👋 Signing out...', 'success')
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">

          <div className="page-header">
            <h1>Account Settings</h1>
            <p>Manage your profile, subscription, and preferences</p>
          </div>

          <div className="settings-layout">

            {/* Sidebar */}
            <aside className="settings-sidebar">
              <nav className="sidebar-nav">
                {SIDEBAR_ITEMS.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveSection(item.id) }}
                  >
                    <span className="nav-icon">{item.icon}</span> {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <main className="settings-content">

              {/* ── PROFILE ── */}
              <section className="settings-card" id="profile">
                <div className="settings-card-header">
                  <h2><span className="icon">👤</span> Profile Details</h2>
                  <button className="btn btn-secondary" onClick={() => showToast('✏ Edit your details below')}>Edit Profile</button>
                </div>
                <div className="settings-card-body">
                  <div className="profile-section">
                    <div className="profile-avatar-wrapper">
                      <div className="profile-avatar">R</div>
                      <button className="avatar-edit-btn" onClick={() => showToast('🖼 Avatar customization coming soon!')}>✏</button>
                    </div>
                    <div className="profile-info">
                      <h3>{displayName}</h3>
                      <span className="profile-plan">Premium Plan</span>
                      <p className="profile-email">ravikumar@email.com</p>
                    </div>
                  </div>

                  <div className="setting-row">
                    <div className="setting-label">
                      <strong>Display Name</strong>
                      <span>Your name shown on this profile</span>
                    </div>
                    <input
                      type="text"
                      className="setting-input"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      aria-label="Display name"
                    />
                  </div>

                  <div className="setting-row">
                    <div className="setting-label">
                      <strong>Display Language</strong>
                    </div>
                    <select className="setting-select" onChange={() => showToast('✓ Language updated')}>
                      <option>English</option>
                      <option>தமிழ் (Tamil)</option>
                      <option>हिन्दी (Hindi)</option>
                    </select>
                  </div>

                  <div className="setting-row">
                    <div className="setting-label" />
                    <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </section>

              {/* ── SUBSCRIPTION ── */}
              <section className="settings-card" id="subscription">
                <div className="settings-card-header">
                  <h2><span className="icon">💳</span> Subscription &amp; Billing</h2>
                  <button className="btn btn-ghost" onClick={() => showToast('💳 Redirecting to billing...')}>Manage Billing</button>
                </div>
                <div className="settings-card-body">
                  <div className="subscription-info">
                    <div className="sub-detail"><label>Current Plan</label><span className="value plan-name">PREMIUM</span></div>
                    <div className="sub-detail"><label>Monthly Price</label><span className="value">₹649 / month</span></div>
                    <div className="sub-detail"><label>Next Billing Date</label><span className="value">July 28, 2026</span></div>
                    <div className="sub-detail"><label>Payment Status</label><span className="value success">✓ Active</span></div>
                    <div className="sub-detail"><label>Payment Method</label><span className="value">Visa •••• 4242</span></div>
                    <div className="sub-detail"><label>Member Since</label><span className="value">March 2022</span></div>
                  </div>

                  <div className="plan-cards">
                    {PLANS.map(plan => (
                      <div
                        key={plan.id}
                        className={`plan-card ${selectedPlan === plan.id ? 'current' : ''}`}
                        role="radio"
                        aria-checked={selectedPlan === plan.id}
                        tabIndex={0}
                        onClick={() => handlePlanSelect(plan.id)}
                        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handlePlanSelect(plan.id)}
                      >
                        {selectedPlan === plan.id && <div className="current-badge">Current Plan</div>}
                        <div className="plan-name">{plan.name}</div>
                        <div className="plan-price">{plan.price}<small>/mo</small></div>
                        <div className="plan-quality">{plan.quality}</div>
                        <div className="plan-screens">{plan.screens}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── PLAYBACK ── */}
              <section className="settings-card" id="playback">
                <div className="settings-card-header">
                  <h2><span className="icon">▶️</span> Playback Settings</h2>
                </div>
                <div className="settings-card-body">
                  {[
                    { key: 'autoplayEpisode',  label: 'Auto-play next episode',  desc: 'Automatically start next episode' },
                    { key: 'autoplayPreviews', label: 'Auto-play previews',      desc: 'Play previews while browsing' },
                  ].map(item => (
                    <div className="setting-row" key={item.key}>
                      <div className="setting-label"><strong>{item.label}</strong><span>{item.desc}</span></div>
                      <ToggleSwitch id={item.key} checked={toggles[item.key]} onChange={() => handleToggle(item.key, item.label)} label={item.label} />
                    </div>
                  ))}
                  <div className="setting-row">
                    <div className="setting-label"><strong>Video Quality</strong><span>Adjust quality to manage data</span></div>
                    <select className="setting-select" onChange={() => showToast('✓ Quality updated')}>
                      <option>Auto (Recommended)</option>
                      <option selected>High (4K)</option>
                      <option>Medium (1080p)</option>
                      <option>Low (480p)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* ── NOTIFICATIONS ── */}
              <section className="settings-card" id="notifications">
                <div className="settings-card-header">
                  <h2><span className="icon">🔔</span> Notifications</h2>
                </div>
                <div className="settings-card-body">
                  {[
                    { key: 'notifNewArrivals', label: 'New Arrivals',        desc: 'Get notified about new titles' },
                    { key: 'notifWatchlist',   label: 'Watchlist Reminders', desc: 'Reminders for saved titles' },
                    { key: 'notifBilling',     label: 'Account & Billing',   desc: 'Payment receipts and updates' },
                    { key: 'notifPromo',       label: 'Promotional Emails',  desc: 'Offers and discounts' },
                  ].map(item => (
                    <div className="setting-row" key={item.key}>
                      <div className="setting-label"><strong>{item.label}</strong><span>{item.desc}</span></div>
                      <ToggleSwitch id={item.key} checked={toggles[item.key]} onChange={() => handleToggle(item.key, item.label)} label={item.label} />
                    </div>
                  ))}
                </div>
              </section>

              {/* ── PRIVACY ── */}
              <section className="settings-card" id="privacy">
                <div className="settings-card-header">
                  <h2><span className="icon">🔒</span> Privacy</h2>
                </div>
                <div className="settings-card-body">
                  {[
                    { key: 'watchHistory',     label: 'Watch History',       desc: 'Use history for recommendations' },
                    { key: 'continueWatching', label: 'Continue Watching',   desc: 'Show resume progress across devices' },
                  ].map(item => (
                    <div className="setting-row" key={item.key}>
                      <div className="setting-label"><strong>{item.label}</strong><span>{item.desc}</span></div>
                      <ToggleSwitch id={item.key} checked={toggles[item.key]} onChange={() => handleToggle(item.key, item.label)} label={item.label} />
                    </div>
                  ))}
                  <div className="setting-row">
                    <div className="setting-label"><strong>Download My Data</strong><span>Request a copy of all your data</span></div>
                    <button className="btn btn-secondary" onClick={() => showToast('✓ Data export submitted. Email in 24hrs.', 'success')}>⬇ Request Data</button>
                  </div>
                </div>
              </section>

              {/* ── SECURITY ── */}
              <section className="settings-card" id="security">
                <div className="settings-card-header">
                  <h2><span className="icon">🛡️</span> Security</h2>
                </div>
                <div className="settings-card-body">
                  <div className="setting-row">
                    <div className="setting-label"><strong>Email Address</strong><span>ravikumar@email.com</span></div>
                    <button className="btn btn-secondary" onClick={() => showToast('📧 Verification link sent')}>Change Email</button>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label"><strong>Password</strong><span>Last changed 3 months ago</span></div>
                    <button className="btn btn-secondary" onClick={() => showToast('🔑 Password reset email sent')}>Change Password</button>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label"><strong>Two-Factor Authentication</strong><span>Extra security layer</span></div>
                    <ToggleSwitch id="twoFactorAuth" checked={toggles.twoFactorAuth} onChange={() => handleToggle('twoFactorAuth', '2FA')} label="Two-Factor Authentication" />
                  </div>
                  <div className="setting-row">
                    <div className="setting-label"><strong>Sign out of all devices</strong></div>
                    <button className="btn btn-secondary" onClick={() => { if(window.confirm('Sign out all devices?')) showToast('✓ Signed out from all devices', 'success') }}>Sign Out All</button>
                  </div>
                </div>
              </section>

              {/* ── DANGER ZONE ── */}
              <section className="settings-card danger-zone" id="danger">
                <div className="settings-card-header">
                  <h2><span className="icon">⚠️</span> Danger Zone</h2>
                </div>
                <div className="settings-card-body">
                  <div className="setting-row">
                    <div className="setting-label"><strong>Cancel Membership</strong><span>Lose access at end of billing period</span></div>
                    <button className="btn btn-danger" onClick={() => { if(window.confirm('Cancel membership?')) showToast('⚠ Cancellation requested', 'warning') }}>Cancel Membership</button>
                  </div>
                  <div className="setting-row">
                    <div className="setting-label"><strong>Delete Account</strong><span>Permanently delete all data. Cannot be undone.</span></div>
                    <button className="btn btn-danger" onClick={() => { const v = window.prompt('Type "DELETE" to confirm:'); if(v==='DELETE') showToast('⚠ Account deletion initiated', 'error') }}>Delete Account</button>
                  </div>
                </div>
              </section>

              {/* ── LOGOUT ── */}
              <div className="settings-card">
                <div className="logout-section">
                  <div className="logout-info">Signed in as <strong>ravikumar@email.com</strong></div>
                  <button className="btn-logout" onClick={handleLogout}>
                    <span>🚪</span> Sign out of Netflix
                  </button>
                </div>
              </div>

            </main>
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} show={toast.show} />
    </>
  )
}

export default Settings
