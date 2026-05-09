import { motion } from 'framer-motion'

interface XPBarProps {
  xp: number
  maxXp: number
  level: number
  title: string
  compact?: boolean
}

export function XPBar({ xp, maxXp, level, title, compact = false }: XPBarProps) {
  const pct = Math.min((xp / maxXp) * 100, 100)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{xp}/{maxXp}</span>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-purple-300">Lv.{level} {title}</span>
        <span className="text-xs text-gray-400">{xp} / {maxXp} XP</span>
      </div>
      <div className="h-3 bg-gray-700/60 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
        </motion.div>
      </div>
    </div>
  )
}
