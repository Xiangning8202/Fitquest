import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useGameStore } from './store/useGameStore'
import { NavHeader, NavFooter } from './components/Navbar'
import { AchievementModal } from './components/AchievementModal'
import { InstallPrompt } from './components/InstallPrompt'
import { Onboarding } from './pages/Onboarding'
import { Dashboard } from './pages/Dashboard'
import { Quest } from './pages/Quest'
import { Squad } from './pages/Squad'
import { Profile } from './pages/Profile'
import { WorkoutRoom } from './pages/WorkoutRoom'

/**
 * App Shell layout.
 * Mobile  : NavHeader/NavFooter are `position:fixed` (CSS), pages add app-page padding.
 * Desktop : flex-column inside the 393×852px phone frame; NavHeader at top,
 *           scrollable content in middle, NavFooter at bottom.
 */
function MainLayout() {
  return (
    <div className="flex flex-col h-dvh sm:h-full">
      <NavHeader />

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        <AchievementModal />
        <InstallPrompt />
        <Outlet />
      </div>

      <NavFooter />
    </div>
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
        {/* WorkoutRoom: full-screen immersive, manages its own chrome */}
        <Route path="/workout/:taskId" element={<WorkoutRoom />} />

        {/* All other pages inside the App Shell */}
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
