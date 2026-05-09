import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'

const RARITY_GRADIENT: Record<string, string> = {
  common: 'from-gray-700 to-gray-600',
  rare: 'from-blue-700 to-blue-500',
  epic: 'from-purple-700 to-pink-600',
  legendary: 'from-yellow-600 to-orange-500',
}

export function AchievementModal() {
  const badge = useGameStore(s => s.recentUnlockedBadge)
  const clearRecentBadge = useGameStore(s => s.clearRecentBadge)

  useEffect(() => {
    if (badge) {
      const t = setTimeout(clearRecentBadge, 4000)
      return () => clearTimeout(t)
    }
  }, [badge, clearRecentBadge])

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={clearRecentBadge}
        >
          <motion.div
            initial={{ scale: 0.3, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative"
          >
            {/* Glow rings */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl bg-purple-500/30 blur-xl"
            />
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="absolute inset-0 rounded-3xl bg-pink-500/20 blur-2xl"
            />

            <div className={`relative bg-gradient-to-br ${RARITY_GRADIENT[badge.rarity]} rounded-3xl p-8 shadow-2xl border border-white/10 text-center min-w-[260px]`}>
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-7xl mb-4"
              >
                {badge.icon}
              </motion.div>

              <div className="text-yellow-300 text-xs font-bold uppercase tracking-widest mb-1">
                🏆 徽章解锁！
              </div>
              <h2 className="text-white font-black text-2xl mb-2">{badge.name}</h2>
              <p className="text-white/70 text-sm leading-relaxed">{badge.description}</p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-white/40 text-xs"
              >
                点击任意处关闭
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
