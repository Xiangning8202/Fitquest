import { motion } from 'framer-motion'
import { useGameStore, getLevelTitle, xpForNextLevel } from '../store/useGameStore'
import { XPBar } from '../components/XPBar'
import { BadgeCard } from '../components/BadgeCard'
import { LEADERBOARD_MOCK } from '../data/squadData'

const AVATAR_COLORS: Record<string, string> = {
  purple: 'bg-purple-500', blue: 'bg-blue-500', green: 'bg-green-500',
  orange: 'bg-orange-500', pink: 'bg-pink-500', teal: 'bg-teal-500',
}
const MEDALS = ['🥇', '🥈', '🥉']

export function Profile() {
  const user = useGameStore(s => s.user)
  const badges = useGameStore(s => s.badges)
  const resetProgress = useGameStore(s => s.resetProgress)

  const unlockedCount = badges.filter(b => b.unlocked).length

  const allEntries = [
    ...LEADERBOARD_MOCK,
    {
      id: 'me',
      name: user.name,
      avatarColor: user.avatarColor,
      level: user.level,
      weeklyXp: user.xp,
    },
  ].sort((a, b) => b.weeklyXp - a.weeklyXp)

  const myRank = allEntries.findIndex(e => e.id === 'me') + 1

  const stats = [
    { label: '累计任务', value: user.totalTasksDone, icon: '⚡' },
    { label: '最长连击', value: `${user.streak}天`, icon: '🔥' },
    { label: '总伤害', value: user.totalDamageDealt, icon: '⚔️' },
    { label: '击败Boss', value: user.bossesDefeated, icon: '🏆' },
    { label: '全勤天数', value: user.allTasksDaysCount, icon: '💯' },
    { label: '运动种类', value: user.uniqueSportsCount, icon: '🌈' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 app-page">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/20 via-gray-950 to-pink-950/20 pointer-events-none" />

      <div className="relative max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* User hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5 bg-gradient-to-br from-purple-900/30 to-gray-900"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${AVATAR_COLORS[user.avatarColor] ?? 'bg-purple-500'} flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-purple-500/20`}>
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1">
              <h2 className="text-white font-black text-xl">{user.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-purple-300 text-sm font-semibold">Lv.{user.level}</span>
                <span className="text-gray-500 text-xs">·</span>
                <span className="text-gray-400 text-sm">{getLevelTitle(user.level)}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-orange-400 text-2xl font-black">🔥{user.streak}</div>
              <div className="text-gray-500 text-xs">连续打卡</div>
            </div>
          </div>
          <XPBar xp={user.xp} maxXp={xpForNextLevel(user.level)} level={user.level} title={getLevelTitle(user.level)} />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
            <span className="text-gray-500 text-xs">目标：{user.preferences.goal || '保持健康'}</span>
            <span className="text-gray-500 text-xs">偏好：{user.preferences.intensity || '适中'} · {user.preferences.timeSlot || '自由'}</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-white font-bold mb-3">📊 运动数据</h3>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-white font-black text-xl">{s.value}</div>
                <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">🏅 成就徽章</h3>
            <span className="text-gray-400 text-sm">{unlockedCount} / {badges.length} 已解锁</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.04 }}
              >
                <BadgeCard badge={b} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">🏆 本周排行榜</h3>
            <span className="text-gray-400 text-sm">我的排名 #{myRank}</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {allEntries.map((entry, i) => {
              const isMe = entry.id === 'me'
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className={`flex items-center gap-3 px-4 py-3 ${i < allEntries.length - 1 ? 'border-b border-gray-800' : ''} ${isMe ? 'bg-purple-500/10' : ''}`}
                >
                  <span className="text-xl w-7 text-center flex-shrink-0">
                    {i < 3 ? MEDALS[i] : <span className="text-gray-500 text-sm font-bold">#{i + 1}</span>}
                  </span>
                  <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[entry.avatarColor] ?? 'bg-gray-600'} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {entry.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isMe ? 'text-purple-300' : 'text-white'}`}>
                      {entry.name}{isMe && ' (我)'}
                    </p>
                    <p className="text-gray-500 text-xs">Lv.{entry.level}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-bold text-sm">{entry.weeklyXp} XP</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Reset button for demo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-2 pb-4 text-center"
        >
          <button
            onClick={() => {
              if (window.confirm('确定要重置所有进度吗？（用于演示体验）')) {
                resetProgress()
                window.location.href = '/'
              }
            }}
            className="text-gray-600 text-xs hover:text-gray-400 transition-colors underline underline-offset-2"
          >
            重置进度（演示用）
          </button>
        </motion.div>
      </div>
    </div>
  )
}
