import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore, getLevelTitle, xpForNextLevel } from '../store/useGameStore'
import { XPBar } from '../components/XPBar'
import { QuestCard } from '../components/QuestCard'
import { AvatarIcon } from '../components/AvatarIcon'
import { LEADERBOARD_MOCK } from '../data/squadData'

function card(className = '') {
  return `bg-gray-900 border border-gray-800 rounded-2xl ${className}`
}

export function Dashboard() {
  const user = useGameStore(s => s.user)
  const boss = useGameStore(s => s.boss)
  const todayTasks = useGameStore(s => s.todayTasks)
  const tasksGeneratedDate = useGameStore(s => s.tasksGeneratedDate)
  const badges = useGameStore(s => s.badges)
  const checkStreak = useGameStore(s => s.checkStreak)

  useEffect(() => { checkStreak() }, [checkStreak])

  const today = new Date().toISOString().slice(0, 10)
  const tasksReady = tasksGeneratedDate === today && todayTasks.length > 0
  const doneTasks = todayTasks.filter(t => t.completed).length
  const bossHpPct = Math.round((boss.currentHp / boss.maxHp) * 100)

  const allEntries = [
    ...LEADERBOARD_MOCK,
    { id: 'me', name: user.name, avatarColor: user.avatarColor, level: user.level, weeklyXp: user.xp },
  ].sort((a, b) => b.weeklyXp - a.weeklyXp)

  const myRank = allEntries.findIndex(e => e.id === 'me') + 1
  const top3 = allEntries.slice(0, 3)

  return (
    <div className="min-h-full bg-gray-950 app-page">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/30 via-gray-950 to-blue-950/20 pointer-events-none" />

      <div className="relative max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${card('p-5')} bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-800/30`}
        >
          <div className="flex items-center gap-4 mb-4">
            <AvatarIcon color={user.avatarColor} className="w-14 h-14 rounded-2xl shadow-lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg">{user.name}</h2>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
                  Lv.{user.level}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{getLevelTitle(user.level)}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <span className="text-orange-400">🔥</span>
                <span className="text-white font-black text-xl">{user.streak}</span>
              </div>
              <p className="text-gray-500 text-xs">连续天数</p>
            </div>
          </div>
          <XPBar xp={user.xp} maxXp={xpForNextLevel(user.level)} level={user.level} title={getLevelTitle(user.level)} />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: '累计任务', value: user.totalTasksDone, icon: '⚡' },
            { label: '总伤害', value: user.totalDamageDealt, icon: '⚔️' },
            { label: '徽章数', value: badges.filter(b => b.unlocked).length, icon: '🏆' },
          ].map(s => (
            <div key={s.label} className={`${card('p-3 text-center')}`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-white font-black text-xl">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Today's quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-base">今日任务</h3>
            {tasksReady && (
              <span className="text-gray-400 text-sm">{doneTasks}/{todayTasks.length} 完成</span>
            )}
          </div>

          {tasksReady ? (
            <div className="space-y-3">
              {todayTasks.map((t, i) => <QuestCard key={t.id} task={t} index={i} />)}
            </div>
          ) : (
            <Link to="/quest">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`${card('p-6 text-center cursor-pointer hover:border-purple-500/50 transition-colors')}`}
              >
                <div className="text-4xl mb-3">🤖</div>
                <p className="text-white font-semibold mb-1">AI 还没生成今日任务</p>
                <p className="text-gray-400 text-sm mb-4">点击前往任务中心，获取个性化运动方案</p>
                <span className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold">
                  立即生成 ⚡
                </span>
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* Boss status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/squad">
            <div className={`${card('p-4 hover:border-red-800/50 transition-colors cursor-pointer')}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-base">⚔️ Boss 战</h3>
                <span className="text-gray-400 text-xs">{boss.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{boss.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{boss.title}</span>
                    <span className="text-red-400 font-semibold">{bossHpPct}% HP</span>
                  </div>
                  <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${boss.gradient}`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${bossHpPct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">{boss.currentHp} / {boss.maxHp} HP</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Leaderboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-base">🏆 本周排行</h3>
            <Link to="/profile" className="text-purple-400 text-sm">查看全部</Link>
          </div>
          <div className={`${card('p-4')} space-y-2`}>
            {top3.map((entry, i) => {
              const isMe = entry.id === 'me'
              const medals = ['🥇', '🥈', '🥉']
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 p-2 rounded-xl ${isMe ? 'bg-purple-500/15 border border-purple-500/30' : ''}`}
                >
                  <span className="text-xl w-7 text-center">{medals[i]}</span>
                  <AvatarIcon color={entry.avatarColor} className="w-8 h-8" animate={false} />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isMe ? 'text-purple-300' : 'text-white'}`}>
                      {entry.name} {isMe && '(我)'}
                    </p>
                    <p className="text-gray-500 text-xs">Lv.{entry.level}</p>
                  </div>
                  <span className="text-blue-400 text-sm font-bold">{entry.weeklyXp} XP</span>
                </div>
              )
            })}
            {myRank > 3 && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-purple-500/15 border border-purple-500/30">
                <span className="text-gray-400 text-sm w-7 text-center font-bold">#{myRank}</span>
                <AvatarIcon color={user.avatarColor} className="w-8 h-8" animate={false} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-300">{user.name} (我)</p>
                  <p className="text-gray-500 text-xs">Lv.{user.level}</p>
                </div>
                <span className="text-blue-400 text-sm font-bold">{user.xp} XP</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
