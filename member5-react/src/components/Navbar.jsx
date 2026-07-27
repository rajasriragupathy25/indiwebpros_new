import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <Link to="/watchlist" aria-label="Netflix Home">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix"
            style={{ height: '32px', width: 'auto', display: 'block' }}
          />
        </Link>
      </div>

      {/* Nav Links */}
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">TV Shows</a></li>
        <li><a href="#">Movies</a></li>
        <li><a href="#">New &amp; Popular</a></li>
        <li>
          <Link to="/watchlist" className={isActive('/watchlist') ? 'active' : ''}>
            My List
          </Link>
        </li>
      </ul>

      {/* Nav Right */}
      <div className="nav-right">
        {/* Search */}
        <span className="nav-search-icon" title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        {/* Bell */}
        <span className="nav-bell-icon" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </span>

        {/* Profile Dropdown */}
        <div
          className="nav-profile"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className="nav-profile-img">R</div>
          <span className="nav-caret">▼</span>

          {dropdownOpen && (
            <div className="nav-dropdown">
              <div className="dropdown-profile-item">
                <div className="profile-icon">R</div>
                <span>Ravi Kumar</span>
              </div>
              <div className="dropdown-divider" />
              <Link to="/watchlist" className="dropdown-link">
                <span className="icon">📋</span> My List
              </Link>
              <Link to="/settings" className="dropdown-link">
                <span className="icon">⚙️</span> Account
              </Link>
              <Link to="/integrations" className="dropdown-link">
                <span className="icon">🔗</span> Integrations
              </Link>
              <div className="dropdown-divider" />
              <span className="dropdown-link">
                <span className="icon">🚪</span> Sign out
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
