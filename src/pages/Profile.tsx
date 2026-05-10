import { motion } from 'framer-motion'
import { useGameStore, getLevelTitle, xpForNextLevel } from '../store/useGameStore'
import { XPBar } from '../components/XPBar'
import { BadgeCard } from '../components/BadgeCard'
import { AvatarIcon } from '../components/AvatarIcon'
import { LEADERBOARD_MOCK } from '../data/squadData'

const MEDALS = ['🥇', '🥈', '🥉']

// ─── Streak encouragement copy ────────────────────────────────────────────────

function getStreakMsg(streak: number, completedToday: boolean): string {
  if (streak === 0) return '今天就开始，迈出第一步！🚀'
  if (!completedToday) return '今天还没打卡，趁现在去动一下！'
  if (streak === 1) return '好的开始！明天继续，别停！'
  if (streak < 3) return `连续 ${streak} 天，习惯正在养成！`
  if (streak < 7) return '今天也别断，保持节奏！'
  if (streak < 14) return '整整一周！你在建立真正的习惯。'
  if (streak < 30) return '半个月了，运动已经是你的一部分。'
  return '你太厉害了，继续写下自己的传说！🔥'
}

// ─── 7-day Streak Card ────────────────────────────────────────────────────────

function StreakCard({ streak }: { streak: number }) {
  const todayStr = new Date().toISOString().slice(0, 10)
  const lastActive = useGameStore(s => s.user.lastActiveDate)
  const completedToday = lastActive === todayStr

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const isToday = i === 6
    let done = false
    if (completedToday) {
      done = i >= Math.max(0, 7 - streak)
    } else {
      done = !isToday && i >= Math.max(0, 6 - streak)
    }
    return {
      label: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
      done,
      isToday,
      isPulsing: isToday && !completedToday,
    }
  })

  const msg = getStreakMsg(streak, completedToday)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.07 }}
      className="relative overflow-hidden rounded-2xl border border-orange-500/25 p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(124,45,18,0.35) 0%, rgba(17,17,27,0.9) 50%, rgba(59,7,100,0.35) 100%)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-6 -left-6 w-36 h-36 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-4 w-28 h-28 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex gap-4">
        {/* Left: emoji + big number */}
        <div className="flex flex-col items-center justify-center gap-0.5 min-w-[68px]">
          <motion.span
            animate={{ y: [0, -5, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-4xl leading-none select-none"
          >
            🔥
          </motion.span>
          <span
            className="font-black leading-none"
            style={{
              fontSize: streak >= 100 ? '2.6rem' : '3.5rem',
              background: 'linear-gradient(180deg, #fdba74 0%, #f97316 60%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {streak}
          </span>
          <span className="text-gray-500 text-xs">连续天数</span>
        </div>

        {/* Divider */}
        <div className="w-px bg-orange-500/15 self-stretch" />

        {/* Right: message + dots */}
        <div className="flex-1 flex flex-col justify-between gap-3">
          <p className="text-white text-sm font-semibold leading-snug">{msg}</p>

          {/* 7-day dot row */}
          <div className="flex gap-1 items-end">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                {d.done ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                    className="w-full aspect-square rounded-full flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #fb923c, #ea580c)',
                      boxShadow: '0 0 8px rgba(251,146,60,0.55)',
                    }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: '0.55rem' }}>✓</span>
                  </motion.div>
                ) : d.isPulsing ? (
                  <motion.div
                    animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.05, 0.9] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-full aspect-square rounded-full border-2 border-orange-400"
                  />
                ) : (
                  <div className="w-full aspect-square rounded-full border border-gray-700 bg-gray-800/50" />
                )}
                <span
                  className="text-center font-medium leading-none"
                  style={{
                    fontSize: '0.6rem',
                    color: d.isToday ? '#fb923c' : d.done ? '#9ca3af' : '#4b5563',
                  }}
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-xs">最近 7 天打卡记录</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Profile page ─────────────────────────────────────────────────────────────

export function Profile() {
  const user = useGameStore(s => s.user)
  const badges = useGameStore(s => s.badges)
  const resetProgress = useGameStore(s => s.resetProgress)

  const unlockedCount = badges.filter(b => b.unlocked).length

  const allEntries = [
    ...LEADERBOARD_MOCK,
    { id: 'me', name: user.name, avatarColor: user.avatarColor, level: user.level, weeklyXp: user.xp },
  ].sort((a, b) => b.weeklyXp - a.weeklyXp)

  const myRank = allEntries.findIndex(e => e.id === 'me') + 1

  const stats = [
    { label: '累计任务', value: user.totalTasksDone, icon: '⚡' },
    { label: '总伤害', value: user.totalDamageDealt, icon: '⚔️' },
    { label: '击败Boss', value: user.bossesDefeated, icon: '🏆' },
    { label: '全勤天数', value: user.allTasksDaysCount, icon: '💯' },
    { label: '运动种类', value: user.uniqueSportsCount, icon: '🌈' },
    { label: '获得徽章', value: unlockedCount, icon: '🏅' },
  ]

  return (
    <div className="min-h-full bg-gray-950 app-page">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/20 via-gray-950 to-pink-950/20 pointer-events-none" />

      <div className="relative max-w-lg mx-auto px-4 py-5 space-y-5">

        {/* User hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5 bg-gradient-to-br from-purple-900/30 to-gray-900"
        >
          <div className="flex items-center gap-4 mb-4">
            <AvatarIcon color={user.avatarColor} className="w-16 h-16 rounded-2xl shadow-lg" />
            <div className="flex-1">
              <h2 className="text-white font-black text-xl">{user.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-purple-300 text-sm font-semibold">Lv.{user.level}</span>
                <span className="text-gray-500 text-xs">·</span>
                <span className="text-gray-400 text-sm">{getLevelTitle(user.level)}</span>
              </div>
            </div>
            {/* Compact streak badge */}
            <div className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/25 rounded-full px-2.5 py-1">
              <span className="text-base">🔥</span>
              <span className="text-orange-400 font-black text-sm">{user.streak}</span>
            </div>
          </div>
          <XPBar xp={user.xp} maxXp={xpForNextLevel(user.level)} level={user.level} title={getLevelTitle(user.level)} />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
            <span className="text-gray-500 text-xs">目标：{user.preferences.goal || '保持健康'}</span>
            <span className="text-gray-500 text-xs">偏好：{user.preferences.intensity || '适中'} · {user.preferences.timeSlot || '自由'}</span>
          </div>
        </motion.div>

        {/* ── Streak Card — main event ── */}
        <StreakCard streak={user.streak} />

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
                  <AvatarIcon color={entry.avatarColor} className="w-9 h-9" animate={false} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isMe ? 'text-purple-300' : 'text-white'}`}>
                      {entry.name}{isMe && ' (我)'}
                    </p>
                    <p className="text-gray-500 text-xs">Lv.{entry.level}</p>
                  </div>
                  <div className="text-blue-400 font-bold text-sm">{entry.weeklyXp} XP</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Reset */}
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
