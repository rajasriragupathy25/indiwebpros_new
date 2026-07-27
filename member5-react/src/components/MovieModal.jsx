import { useEffect } from 'react'

function MovieModal({ movie, onClose, onRemove }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!movie) return null

  const genres = {
    movie: ['Action', 'Drama', 'Thriller'],
    show:  ['Mystery', 'Crime', 'Suspense'],
    documentary: ['Nature', 'Science', 'Adventure'],
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={e => e.stopPropagation()}>

        {/* Hero */}
        <div className="modal-hero" style={{ background: movie.bg }}>
          <div className="modal-hero-gradient" />
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
          <div className="modal-hero-content">
            <h2 className="modal-title">{movie.title}</h2>
            <div className="modal-actions">
              <button className="modal-play-btn">
                ▶ Play
              </button>
              <button className="modal-add-btn" onClick={() => { onRemove(movie.id); onClose() }}>
                ✕ Remove
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="modal-body">
          <div className="modal-meta-row">
            <span className="match">{movie.match} Match</span>
            <span className="rating-badge">{movie.rating}</span>
            <span className="modal-year">{movie.year}</span>
            <span className="modal-type">{movie.type === 'show' ? 'TV Series' : movie.type === 'documentary' ? 'Documentary' : 'Film'}</span>
          </div>

          <p className="modal-desc">
            An acclaimed {movie.type === 'show' ? 'series' : 'film'} that captivates audiences worldwide.
            With stunning visuals and a gripping storyline, <strong>{movie.title}</strong> is a must-watch
            on your list. Rated <strong>{movie.rating}</strong> — {movie.match} match for you.
          </p>

          <div className="modal-details">
            <div className="modal-detail-item">
              <span className="detail-label">Genres:</span>
              <span>{(genres[movie.type] || genres.movie).join(', ')}</span>
            </div>
            <div className="modal-detail-item">
              <span className="detail-label">Rating:</span>
              <span>{movie.rating}</span>
            </div>
            <div className="modal-detail-item">
              <span className="detail-label">Match:</span>
              <span style={{ color: '#46d369' }}>{movie.match}</span>
            </div>
          </div>

          <div className="modal-tags">
            {(genres[movie.type] || genres.movie).map(g => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default MovieModal
