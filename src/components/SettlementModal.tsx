import { motion } from 'framer-motion'
import type { Settlement } from '../types'

interface Props {
  settlement: Settlement
  onClose: () => void
}

const RARITY_GLOW: Record<string, string> = {
  common: 'shadow-gray-500/30',
  rare: 'shadow-blue-500/40',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/60',
}

export function SettlementModal({ settlement, onClose }: Props) {
  const {
    taskTitle, taskEmoji, xpGained, damageDealt, comboDamage, comboTriggered,
    newStreak, leveledUp, newLevel, unlockedBadge, encouragement,
  } = settlement

  const totalDamage = damageDealt + comboDamage

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-700 to-pink-700 px-6 pt-6 pb-8 text-center relative">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl mb-2"
          >
            {taskEmoji}
          </motion.div>
          <div className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">任务完成</div>
          <h2 className="text-white font-black text-xl leading-tight">{taskTitle}</h2>
        </div>

        {/* Stats */}
        <div className="px-5 py-4 space-y-3 -mt-4">
          {/* XP + Damage */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-3 text-center"
            >
              <div className="text-blue-400 text-2xl font-black">+{xpGained}</div>
              <div className="text-gray-400 text-xs mt-0.5">获得 XP</div>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 text-center"
            >
              <div className="text-red-400 text-2xl font-black">-{damageDealt}</div>
              <div className="text-gray-400 text-xs mt-0.5">Boss 伤害</div>
            </motion.div>
          </div>

          {/* Combo */}
          {comboTriggered && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/40 rounded-2xl p-3 text-center"
            >
              <div className="text-yellow-400 font-black text-base">⚡ 小队合击触发！</div>
              <div className="text-orange-300 text-sm font-semibold mt-0.5">额外造成 +{comboDamage} Boss 伤害</div>
              <div className="text-gray-400 text-xs mt-0.5">本次总伤害 {totalDamage}</div>
            </motion.div>
          )}

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex justify-around py-2 border-t border-b border-gray-800"
          >
            <div className="text-center">
              <div className="text-orange-400 font-black text-lg">🔥{newStreak}</div>
              <div className="text-gray-500 text-xs">连续天数</div>
            </div>
            {leveledUp && (
              <div className="text-center">
                <div className="text-purple-400 font-black text-lg">⬆️Lv.{newLevel}</div>
                <div className="text-gray-500 text-xs">等级提升</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-green-400 font-black text-lg">✓</div>
              <div className="text-gray-500 text-xs">任务完成</div>
            </div>
          </motion.div>

          {/* Badge unlock */}
          {unlockedBadge && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.55, type: 'spring', stiffness: 300 }}
              className={`flex items-center gap-3 p-3 rounded-2xl bg-gray-800 border border-purple-500/30 shadow-lg ${RARITY_GLOW[unlockedBadge.rarity]}`}
            >
              <span className="text-3xl">{unlockedBadge.icon}</span>
              <div>
                <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">徽章解锁</div>
                <div className="text-white font-bold text-sm">{unlockedBadge.name}</div>
                <div className="text-gray-400 text-xs">{unlockedBadge.description}</div>
              </div>
            </motion.div>
          )}

          {/* Encouragement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-300 text-sm leading-relaxed py-1"
          >
            {encouragement}
          </motion.p>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base"
          >
            太棒了！继续冲 🚀
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
