import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import '../styles/integrations.css'

const INITIAL_APPS = [
  { id: 'spotify',  name: 'Spotify',         category: 'Music & Audio',      icon: '🎵', color: '#1DB954', connected: true,  lastSync: '2 hours ago',           features: ['Mood Sync','Soundtrack Match','Auto Playlists'] },
  { id: 'google',   name: 'Google Account',   category: 'Authentication',     icon: 'G',  color: '#4285F4', connected: true,  lastSync: 'ravikumar@gmail.com',   features: ['Single Sign-On','Secure Login','Auto Fill'] },
  { id: 'alexa',    name: 'Amazon Alexa',     category: 'Voice Assistant',    icon: '🔊', color: '#FF9900', connected: true,  lastSync: 'Yesterday',             features: ['Voice Control','Smart TV','Hands-Free'] },
  { id: 'youtube',  name: 'YouTube',          category: 'Video Platform',     icon: '▶',  color: '#FF0000', connected: false, lastSync: 'Never connected',       features: ['Share Trailers','Clip Sharing','Community Post'] },
  { id: 'facebook', name: 'Facebook',         category: 'Social Media',       icon: 'f',  color: '#1877F2', connected: false, lastSync: 'Never connected',       features: ['Social Sharing','Friend Activity','Watch Together'] },
  { id: 'apple',    name: 'Apple ID',         category: 'Authentication',     icon: '🍎', color: '#888',    connected: false, lastSync: 'Never connected',       features: ['Sign in with Apple','iCloud Sync','AirPlay'] },
  { id: 'discord',  name: 'Discord',          category: 'Community',          icon: '💬', color: '#5865F2', connected: false, lastSync: 'Never connected',       features: ['Rich Presence','Watch Party','Status Sync'] },
  { id: 'twitter',  name: 'X (Twitter)',      category: 'Social Media',       icon: '𝕏', color: '#1DA1F2', connected: false, lastSync: 'Never connected',       features: ['Auto Tweet','Share Reviews','Trending Sync'] },
  { id: 'twitch',   name: 'Twitch',           category: 'Live Streaming',     icon: '🎮', color: '#9146FF', connected: false, lastSync: 'Never connected',       features: ['Live Reactions','Channel Panel','Watch Events'] },
]

const INITIAL_DEVICES = [
  { id: 'pc',      icon: '💻', name: 'Windows PC – Chrome',    location: 'Chennai, Tamil Nadu',     time: 'Active now',          current: true  },
  { id: 'tv',      icon: '📺', name: 'Samsung Smart TV',       location: 'Home Network',            time: '2 hours ago',         current: false },
  { id: 'iphone',  icon: '📱', name: 'iPhone 14 Pro',          location: 'Mumbai, Maharashtra',     time: 'Yesterday 9:42 PM',   current: false },
  { id: 'tablet',  icon: '📟', name: 'Samsung Galaxy Tab S9',  location: 'Bangalore, Karnataka',   time: '3 days ago',          current: false },
]

function IntegrationCard({ app, onToggle }) {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    if (app.connected) {
      if (!window.confirm(`Disconnect ${app.name}?\nYou can reconnect anytime.`)) return
      onToggle(app.id, false)
    } else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        onToggle(app.id, true)
      }, 1200)
    }
  }

  return (
    <div className="integration-card" style={{ '--card-accent': app.color }}>
      <div className="integration-header">
        <div className="integration-logo-wrap">
          <div className="integration-logo" style={{ background: `${app.color}22`, color: app.color }}>
            {app.icon}
          </div>
          <div className="integration-name-group">
            <h3>{app.name}</h3>
            <span className="integration-category">{app.category}</span>
          </div>
        </div>
        <span className={`status-badge ${app.connected ? 'connected' : 'disconnected'}`}>
          {app.connected ? 'Connected' : 'Not Connected'}
        </span>
      </div>

      <div className="integration-features">
        {app.features.map(f => <span key={f} className="feature-tag">{f}</span>)}
      </div>

      <div className="integration-footer">
        <div className="last-sync">
          {app.connected ? <>Last synced: <span>{app.lastSync}</span></> : app.lastSync}
        </div>
        <button
          className={`connect-btn ${app.connected ? 'connected' : 'disconnected'}`}
          onClick={handleClick}
          disabled={loading}
          aria-label={`${app.connected ? 'Disconnect' : 'Connect'} ${app.name}`}
        >
          {loading ? '⏳ Connecting...' : app.connected ? '✓ Disconnect' : '+ Connect'}
        </button>
      </div>
    </div>
  )
}

function Integrations() {
  const [apps, setApps]       = useState(INITIAL_APPS)
  const [devices, setDevices] = useState(INITIAL_DEVICES)
  const [toast, setToast]     = useState({ show: false, message: '', type: 'default' })

  const showToast = useCallback((message, type = 'default') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }, [])

  const handleToggleApp = (id, newConnected) => {
    const app = apps.find(a => a.id === id)
    setApps(prev => prev.map(a =>
      a.id === id
        ? { ...a, connected: newConnected, lastSync: newConnected ? 'Just now' : 'Disconnected just now' }
        : a
    ))
    if (newConnected) showToast(`✓ ${app.name} connected!`, 'success')
    else              showToast(`✕ ${app.name} disconnected`)
  }

  const handleRemoveDevice = (id) => {
    const device = devices.find(d => d.id === id)
    if (!window.confirm(`Sign out "${device.name}"?`)) return
    setDevices(prev => prev.filter(d => d.id !== id))
    showToast(`✓ ${device.name} signed out`, 'success')
  }

  const handleSignOutAll = () => {
    if (!window.confirm('Sign out from ALL other devices?')) return
    setDevices(prev => prev.filter(d => d.current))
    showToast('✓ All other devices signed out', 'success')
  }

  const connectedCount    = apps.filter(a => a.connected).length
  const disconnectedCount = apps.length - connectedCount

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">

          <div className="page-header">
            <h1>Integrations &amp; Connected Apps</h1>
            <p>Manage third-party apps, connected devices, and data sharing preferences</p>
          </div>

          {/* Stats */}
          <div className="integrations-stats">
            <div className="stat-item"><div className="stat-number">{apps.length}</div><div className="stat-label">Total Apps</div></div>
            <div className="stat-item"><div className="stat-number green">{connectedCount}</div><div className="stat-label">Connected</div></div>
            <div className="stat-item"><div className="stat-number">{devices.length}</div><div className="stat-label">Active Devices</div></div>
            <div className="stat-item"><div className="stat-number red">{disconnectedCount}</div><div className="stat-label">Not Connected</div></div>
          </div>

          {/* App Integrations */}
          <section>
            <h2 className="section-title">
              Third-Party App Integrations <span className="badge">{apps.length} apps</span>
            </h2>
            <div className="integrations-grid">
              {apps.map(app => (
                <IntegrationCard key={app.id} app={app} onToggle={handleToggleApp} />
              ))}
            </div>
          </section>

          {/* Connected Devices */}
          <section>
            <h2 className="section-title">
              Connected Devices <span className="badge">{devices.length} active</span>
            </h2>
            <div className="settings-card" style={{ marginBottom: '36px' }}>
              <div className="settings-card-header">
                <h2><span className="icon">📱</span> Your Devices</h2>
                <button className="btn btn-ghost" onClick={handleSignOutAll}>Sign out all devices</button>
              </div>
              <div className="settings-card-body">
                <div className="device-list">
                  {devices.map(device => (
                    <div className="device-item" key={device.id}>
                      <div className="device-info">
                        <div className="device-icon">{device.icon}</div>
                        <div className="device-details">
                          <h4>{device.name}</h4>
                          <div className="device-meta">
                            <span>{device.location}</span>
                            <span className="dot" />
                            <span>{device.time}</span>
                          </div>
                          {device.current && <span className="current-device">✓ This Device</span>}
                        </div>
                      </div>
                      {device.current
                        ? <button className="btn btn-ghost" disabled style={{ opacity: 0.4 }}>Current</button>
                        : <button className="btn btn-danger" onClick={() => handleRemoveDevice(device.id)}>Sign Out</button>
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Data & Privacy */}
          <section>
            <h2 className="section-title">Data &amp; Privacy Controls</h2>
            <div className="settings-card" style={{ marginBottom: '60px' }}>
              <div className="settings-card-header"><h2><span className="icon">🔒</span> Your Data Controls</h2></div>
              <div className="settings-card-body">
                <div className="privacy-grid">
                  {[
                    { icon: '📊', title: 'Usage Analytics',    desc: 'Control anonymized usage data collection.',       btn: 'Manage',       action: () => showToast('📊 Analytics preferences saved') },
                    { icon: '🎯', title: 'Personalized Ads',   desc: 'Manage third-party ad personalization.',          btn: 'Manage',       action: () => showToast('🎯 Ad settings updated') },
                    { icon: '📋', title: 'Watch History',      desc: 'View or clear your viewing history.',             btn: 'View History', action: () => showToast('📋 247 titles watched', 'success') },
                    { icon: '📤', title: 'Export My Data',     desc: 'Download all your Netflix data.',                 btn: '⬇ Export',     action: () => showToast('✓ Export ready! Check email.', 'success') },
                    { icon: '🔗', title: 'App Permissions',    desc: 'Review and revoke app access permissions.',       btn: 'Review',       action: () => showToast('🔗 Scroll up to manage apps') },
                    { icon: '🗑️', title: 'Delete All Data',   desc: 'Permanently remove all data. Cannot be undone.', btn: 'Delete All',   action: () => { const v = window.prompt('Type "DELETE ALL":'); if(v==='DELETE ALL') showToast('⚠ Deletion scheduled', 'error') }, danger: true },
                  ].map(item => (
                    <div className="privacy-item" key={item.title}>
                      <div className="privacy-icon">{item.icon}</div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                      <button className={`btn ${item.danger ? 'btn-danger' : 'btn-secondary'}`} onClick={item.action}>
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Toast message={toast.message} type={toast.type} show={toast.show} />
    </>
  )
}

export default Integrations
