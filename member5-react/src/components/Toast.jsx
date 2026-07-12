import { useEffect } from 'react'

function Toast({ message, type, show }) {
  const borderColor =
    type === 'error'   ? '#ff4444' :
    type === 'success' ? '#46d369' :
    type === 'warning' ? '#f5a623' : '#e50914'

  return (
    <div
      className={`toast ${show ? 'show' : ''}`}
      style={{ borderLeftColor: borderColor }}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  )
}

export default Toast
