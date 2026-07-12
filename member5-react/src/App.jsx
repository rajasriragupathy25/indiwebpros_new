import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Watchlist from './pages/Watchlist'
import Settings from './pages/Settings'
import Integrations from './pages/Integrations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/watchlist" replace />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/integrations" element={<Integrations />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
