import { motion } from 'framer-motion'
import type { Badge } from '../types'

const RARITY_STYLES: Record<Badge['rarity'], string> = {
  common: 'border-gray-600 bg-gray-800/60',
  rare: 'border-blue-500/50 bg-blue-500/10',
  epic: 'border-purple-500/50 bg-purple-500/10',
  legendary: 'border-yellow-500/50 bg-yellow-500/10',
}
const RARITY_LABELS: Record<Badge['rarity'], string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
}
const RARITY_TEXT: Record<Badge['rarity'], string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
}

interface BadgeCardProps {
  badge: Badge
}

export function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <motion.div
      whileHover={badge.unlocked ? { scale: 1.05 } : {}}
      className={`relative rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center transition-all ${
        badge.unlocked
          ? RARITY_STYLES[badge.rarity]
          : 'border-gray-700/50 bg-gray-800/30 opacity-50 grayscale'
      }`}
    >
      {badge.unlocked && badge.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-xl bg-yellow-500/5 animate-pulse" />
      )}

      <div className={`text-3xl ${!badge.unlocked ? 'filter grayscale' : ''}`}>
        {badge.unlocked ? badge.icon : '🔒'}
      </div>
      <div className="font-semibold text-xs text-white leading-tight">{badge.name}</div>
      <div className={`text-xs font-medium ${RARITY_TEXT[badge.rarity]}`}>
        {RARITY_LABELS[badge.rarity]}
      </div>
      {badge.unlocked && (
        <p className="text-gray-400 text-xs leading-snug">{badge.description}</p>
      )}
      {!badge.unlocked && (
        <p className="text-gray-600 text-xs">???</p>
      )}
    </motion.div>
  )
}
