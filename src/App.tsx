import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useGameStore } from './store/useGameStore'
import { Navbar } from './components/Navbar'
import { AchievementModal } from './components/AchievementModal'
import { InstallPrompt } from './components/InstallPrompt'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Quest } from './pages/Quest'
import { Squad } from './pages/Squad'
import { Profile } from './pages/Profile'
import { WorkoutRoom } from './pages/WorkoutRoom'

function MainLayout() {
  return (
    <>
      <Navbar />
      <AchievementModal />
      <InstallPrompt />
      <Outlet />
    </>
  )
}

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
      <Routes>
        {/* WorkoutRoom: full-screen, no Navbar */}
        <Route path="/workout/:taskId" element={<WorkoutRoom />} />

        {/* All other pages: with Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quest" element={<Quest />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
