import { NavLink } from 'react-router-dom'
import { Home, Zap, Swords, User } from 'lucide-react'
import { useGameStore } from '../store/useGameStore'
import { AvatarIcon } from './AvatarIcon'

const NAV_ITEMS = [
  { to: '/', icon: Home,   label: '主页', end: true  },
  { to: '/quest',   icon: Zap,    label: '任务', end: false },
  { to: '/squad',   icon: Swords, label: '战队', end: false },
  { to: '/profile', icon: User,   label: '我的', end: false },
]

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
          <span className="font-display font-bold text-white text-lg tracking-tight">FitQuest</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-800 rounded-full px-3 py-1">
            <span className="text-orange-400 text-sm">🔥</span>
            <span className="text-white text-sm font-semibold">{user.streak}</span>
          </div>
          <AvatarIcon color={user.avatarColor} className="w-8 h-8" />
        </div>
      </div>
    </header>
  )
}

export function NavFooter() {
  return (
    <nav className="
      fixed left-0 right-0 bottom-0 z-40
      sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:z-10
      nav-safe bg-gray-950/90 backdrop-blur-md border-t border-gray-800
      flex-shrink-0
    ">
      <div className="flex">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 pt-3 pb-2 transition-colors relative ${
                isActive ? 'text-[var(--neon)]' : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={1.75}
                  className="transition-all"
                  style={isActive
                    ? { stroke: 'var(--neon)', fill: 'oklch(60% 0.24 295 / 0.18)' }
                    : { stroke: 'var(--muted)', fill: 'none' }
                  }
                />
                <span className="text-xs font-medium">{label}</span>
                {/* Active dot indicator */}
                {isActive && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: 'var(--neon)', boxShadow: '0 0 4px var(--neon)' }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function Navbar() {
  return (
    <>
      <NavHeader />
      <NavFooter />
    </>
  )
}
