import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Toast from '../components/Toast'
import MovieModal from '../components/MovieModal'
import { getWatchlist, addToWatchlist, removeFromWatchlist, isWatchlistEmpty } from '../firebaseHelpers'
import '../styles/watchlist.css'
import '../styles/modal.css'

const DEFAULT_MOVIES = [
  { title: 'Oppenheimer',    type: 'movie',       match: '97%', rating: 'UA',  year: '2023', bg: 'linear-gradient(160deg,#0f0c29,#302b63,#24243e)' },
  { title: 'Money Heist',    type: 'show',        match: '99%', rating: '18+', year: 'Show', bg: 'linear-gradient(160deg,#1a0000,#8b0000,#2c0000)' },
  { title: 'The Matrix',     type: 'movie',       match: '94%', rating: 'UA',  year: '1999', bg: 'linear-gradient(160deg,#003300,#006600,#001a00)' },
  { title: 'Dark',           type: 'show',        match: '98%', rating: '18+', year: 'Show', bg: 'linear-gradient(160deg,#000033,#000099,#00001a)' },
  { title: 'Squid Game',     type: 'show',        match: '96%', rating: '18+', year: 'Show', bg: 'linear-gradient(160deg,#1a1a00,#666600,#0d0d00)' },
  { title: 'Wednesday',      type: 'show',        match: '91%', rating: '13+', year: 'Show', bg: 'linear-gradient(160deg,#1a000a,#660026,#0d0005)' },
  { title: 'Inception',      type: 'movie',       match: '95%', rating: 'UA',  year: '2010', bg: 'linear-gradient(160deg,#001a33,#004d99,#000d1a)' },
  { title: 'The Witcher',    type: 'show',        match: '93%', rating: '18+', year: 'Show', bg: 'linear-gradient(160deg,#1a1a1a,#4a4a4a,#0a0a0a)' },
  { title: 'Black Mirror',   type: 'show',        match: '88%', rating: '18+', year: 'Show', bg: 'linear-gradient(160deg,#001a1a,#006666,#000d0d)' },
  { title: 'Peaky Blinders', type: 'show',        match: '96%', rating: '18+', year: 'Show', bg: 'linear-gradient(160deg,#1a0d00,#5c3600,#0d0600)' },
  { title: 'Ozark',          type: 'show',        match: '97%', rating: '18+', year: 'Show', bg: 'linear-gradient(160deg,#0d001a,#3d0066,#060010)' },
  { title: 'Our Planet',     type: 'documentary', match: '90%', rating: 'U',   year: 'Doc',  bg: 'linear-gradient(160deg,#001a0d,#005c33,#000d06)' },
]

const CONTINUE_WATCHING = [
  { id: 1, title: 'Stranger Things', episode: 'S4 E8',  timeLeft: '45 min left',  duration: '1h 30m', progress: 62, bg: 'linear-gradient(135deg,#1a0533,#4a0072,#0d001a)' },
  { id: 2, title: 'The Crown',       episode: 'S5 E3',  timeLeft: '1h 12m left',  duration: '58m',    progress: 28, bg: 'linear-gradient(135deg,#001a33,#003d6e,#001122)' },
  { id: 3, title: 'Breaking Bad',    episode: 'S3 E12', timeLeft: '22 min left',  duration: '47m',    progress: 78, bg: 'linear-gradient(135deg,#1a0a00,#5c2e00,#1a0500)' },
]

function MovieCard({ movie, onRemove, onPlay, onCardClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`movie-card ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCardClick(movie)}
      style={{ cursor: 'pointer' }}
    >
      <div className="poster-placeholder">
        <div className="poster-bg" style={{ background: movie.bg }} />
        <div className="poster-title">{movie.title}</div>
      </div>
      <button
        className="remove-btn-top"
        onClick={e => { e.stopPropagation(); onRemove(movie.id) }}
        aria-label={`Remove ${movie.title}`}
      >✕</button>
      <div className={`card-overlay ${hovered ? 'visible' : ''}`}>
        <div className="card-info">
          <div className="card-title">{movie.title}</div>
          <div className="card-meta">
            <span className="match">{movie.match}</span>
            <span className="rating-badge">{movie.rating}</span>
            <span>{movie.year}</span>
          </div>
          <div className="card-actions">
            <button className="card-btn play"   onClick={e => { e.stopPropagation(); onPlay(movie.title) }} aria-label="Play">▶</button>
            <button className="card-btn remove" onClick={e => { e.stopPropagation(); onRemove(movie.id) }}  aria-label="Remove">✕</button>
            <button className="card-btn info"   onClick={e => { e.stopPropagation(); onCardClick(movie) }}  aria-label="Info">ⓘ</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContinueCard({ item }) {
  return (
    <div className="continue-card">
      <div className="poster-bg" style={{ background: item.bg }} />
      <div className="card-overlay" style={{ opacity: 1 }}>
        <div className="card-info">
          <p className="time-left">{item.timeLeft}</p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${item.progress}%` }} />
          </div>
          <div className="card-title">{item.title}</div>
          <div className="card-meta">
            <span className="match">{item.episode}</span>
            <span>•</span>
            <span>{item.duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Watchlist() {
  const [movies, setMovies]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('all')
  const [toast, setToast]           = useState({ show: false, message: '', type: 'default' })
  const [selectedMovie, setSelectedMovie] = useState(null)

  const showToast = useCallback((message, type = 'default') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000)
  }, [])

  // Load from Firebase on mount
  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = () => {
    setLoading(true)
    try {
      // If localStorage empty — seed default movies
      if (isWatchlistEmpty()) {
        DEFAULT_MOVIES.forEach(movie => addToWatchlist(movie))
      }
      setMovies(getWatchlist())
    } catch (err) {
      console.error('Storage error:', err)
      setMovies(DEFAULT_MOVIES.map((m, i) => ({ ...m, id: String(i) })))
    }
    setLoading(false)
  }

  const handleRemove = (id) => {
    removeFromWatchlist(id)
    setMovies(prev => prev.filter(m => m.id !== id))
    showToast('✓ Removed from My List')
  }

  const handlePlay = (title) => showToast(`▶ Playing: ${title}`, 'success')
  const handleCardClick = (movie) => setSelectedMovie(movie)

  const filtered = filter === 'all' ? movies : movies.filter(m => m.type === filter)

  const tabs = [
    { key: 'all',         label: 'All' },
    { key: 'movie',       label: 'Movies' },
    { key: 'show',        label: 'TV Shows' },
    { key: 'documentary', label: 'Documentaries' },
  ]

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">

          <div className="page-header">
            <h1>My Watchlist</h1>
            <p>Movies and shows you've saved to watch later</p>
            {!loading && (
              <span style={{ fontSize: '12px', color: '#46d369', marginTop: '4px', display: 'block' }}>
                💾 Changes auto-saved to your browser!
              </span>
            )}
          </div>

          {/* Continue Watching */}
          <section aria-label="Continue Watching">
            <h2 className="section-title">
              Continue Watching <span className="badge">{CONTINUE_WATCHING.length}</span>
            </h2>
            <div className="continue-row">
              {CONTINUE_WATCHING.map(item => <ContinueCard key={item.id} item={item} />)}
            </div>
          </section>

          {/* Saved Titles */}
          <section aria-label="Saved Titles">
            <h2 className="section-title">Saved Titles</h2>

            <div className="filter-bar">
              <div className="filter-tabs" role="tablist">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                    role="tab"
                    aria-selected={filter === tab.key}
                    onClick={() => setFilter(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <select className="sort-select" onChange={e => showToast(`📋 Sorted by ${e.target.options[e.target.selectedIndex].text}`)}>
                <option value="date">Date Added</option>
                <option value="az">A–Z</option>
                <option value="year">Release Year</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <p className="watchlist-count"><span>{filtered.length}</span> titles saved</p>

            {/* Loading */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px', color: '#999' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <p>Loading from Firebase...</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="movie-grid" id="watchlistGrid">
                {filtered.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onRemove={handleRemove}
                    onPlay={handlePlay}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state show" role="status">
                <div className="empty-icon">📋</div>
                <h3>No titles found</h3>
                <p>Try a different filter or add more titles.</p>
                <button className="btn-browse" onClick={() => setFilter('all')}>Show All</button>
              </div>
            )}
          </section>

        </div>
      </div>
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onRemove={(id) => { handleRemove(id); setSelectedMovie(null) }}
        />
      )}
    </>
  )
}

export default Watchlist
