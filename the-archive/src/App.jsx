import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Scanner from './pages/Scanner'
import Archive from './pages/Archive'
import Tabletop from './pages/Tabletop'
import CardDetail from './pages/CardDetail'
import ConnectionSetup from './pages/ConnectionSetup'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Scanner />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/tabletop" element={<Tabletop />} />
        <Route path="/card/:id" element={<CardDetail />} />
        <Route path="/setup" element={<ConnectionSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
