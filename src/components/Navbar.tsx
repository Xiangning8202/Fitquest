import { NavLink } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: '主页' },
  { to: '/quest', icon: '⚡', label: '任务' },
  { to: '/squad', icon: '⚔️', label: '战队' },
  { to: '/profile', icon: '👤', label: '我的' },
]

const AVATAR_COLORS: Record<string, string> = {
  purple: 'bg-purple-500', blue: 'bg-blue-500', green: 'bg-green-500',
  orange: 'bg-orange-500', pink: 'bg-pink-500', teal: 'bg-teal-500',
}

/** Top bar — fixed on mobile, relative (in flex shell) on desktop */
export function NavHeader() {
  const user = useGameStore(s => s.user)
  return (
    <header className="
      fixed left-0 right-0 top-0 z-40
      sm:relative sm:top-auto sm:left-auto sm:right-auto sm:z-10
      header-safe bg-gray-950/90 backdrop-blur-md border-b border-gray-800
      flex-shrink-0
    ">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏋️</span>
          <span className="font-bold text-white text-lg tracking-tight">FitQuest</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1">
            <span className="text-orange-400 text-sm">🔥</span>
            <span className="text-white text-sm font-semibold">{user.streak}</span>
          </div>
          <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[user.avatarColor] ?? 'bg-purple-500'} flex items-center justify-center text-white font-bold text-sm`}>
            {user.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        </div>
      </div>
    </header>
  )
}

/** Bottom nav — fixed on mobile, relative (in flex shell) on desktop */
export function NavFooter() {
  return (
    <nav className="
      fixed left-0 right-0 bottom-0 z-40
      sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-10
      nav-safe bg-gray-950/90 backdrop-blur-md border-t border-gray-800
      flex-shrink-0
    ">
      <div className="flex">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
                isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

/** Combined export for backward compat if needed */
export function Navbar() {
  return (
    <>
      <NavHeader />
      <NavFooter />
    </>
  )
}
