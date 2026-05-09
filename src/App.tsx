import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useGameStore } from './store/useGameStore'
import { Navbar } from './components/Navbar'
import { AchievementModal } from './components/AchievementModal'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Quest } from './pages/Quest'
import { Squad } from './pages/Squad'
import { Profile } from './pages/Profile'

export default function App() {
  const isOnboarded = useGameStore(s => s.user.isOnboarded)

  if (!isOnboarded) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Navbar />
      <AchievementModal />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quest" element={<Quest />} />
        <Route path="/squad" element={<Squad />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
