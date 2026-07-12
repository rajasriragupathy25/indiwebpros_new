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
          <svg viewBox="0 0 111 30" aria-hidden="true">
            <path
              d="M105.06 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.937-3.437 7.517c-1.687-.282-3.344-.376-5.031-.595l6.188-13.447L94.883 0h5.386l3.064 8.01L106.49 0h5.42zM90.314 0v27.899c-1.75.094-3.53.188-5.28.313V0zM80.508 0v26.27c-1.719.157-3.469.313-5.188.5V0zM71.1 0v28.5c-1.719.188-3.5.375-5.219.594V0h5.22zM60.63 0v30c-1.72.25-3.47.5-5.22.75V0h5.22zM50.19 0v31.5c-1.72.313-3.47.626-5.22.938V0h5.22zM39.72 0v33c-1.73.375-3.47.75-5.22 1.125V0h5.22zM29.25 0v34.5c-1.72.438-3.47.875-5.22 1.344V0h5.22zM18.78 0v36.094c-1.72.5-3.47 1-5.22 1.531V0h5.22zM8.31 0v37.72c-1.72.594-3.47 1.219-5.22 1.875V0H8.31z"
              fill="#e50914"
            />
          </svg>
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
