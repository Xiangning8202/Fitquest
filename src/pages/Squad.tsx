import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'

const AVATAR_COLORS: Record<string, string> = {
  purple: 'bg-purple-500', blue: 'bg-blue-500', green: 'bg-green-500',
  orange: 'bg-orange-500', pink: 'bg-pink-500', teal: 'bg-teal-500',
}
const STATUS_COLORS = { active: 'bg-green-400', resting: 'bg-yellow-400', offline: 'bg-gray-600' }
const STATUS_LABELS = { active: '今日已训练', resting: '休息中', offline: '未上线' }

const ACTIVITY_FEED = [
  { name: '李子晨', action: '完成了「操场速跑」', xp: 50, time: '3分钟前', emoji: '🏃' },
  { name: '陈明阳', action: '完成了「全身力量训练」', xp: 50, time: '18分钟前', emoji: '💪' },
  { name: '王晓雨', action: '完成了「晨间唤醒流」', xp: 30, time: '41分钟前', emoji: '🧘' },
  { name: '系统', action: 'Boss 受到了 85 点伤害', xp: null, time: '1小时前', emoji: '⚔️' },
]

export function Squad() {
  const user = useGameStore(s => s.user)
  const boss = useGameStore(s => s.boss)
  const teammates = useGameStore(s => s.teammates)

  const bossHpPct = Math.round((boss.currentHp / boss.maxHp) * 100)
  const totalContribution = teammates.reduce((s, t) => s + t.contribution, 0) + user.totalDamageDealt
  const maxContrib = Math.max(...teammates.map(t => t.contribution), user.totalDamageDealt, 1)

  return (
    <div className="min-h-screen bg-gray-950 pb-20 pt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-red-950/20 via-gray-950 to-purple-950/20 pointer-events-none" />

      <div className="relative max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-white mb-1">⚔️ 宿舍 Boss 战</h1>
          <p className="text-gray-400 text-sm">与队友合力击败 Boss，守护宿舍荣耀</p>
        </motion.div>

        {/* Boss card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${boss.gradient} p-5 border border-white/10`}
        >
          <motion.div
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-white"
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-0.5">
                  当前 Boss · 第 {boss.id} 关
                </div>
                <h2 className="text-white font-black text-2xl">{boss.name}</h2>
                <p className="text-white/70 text-sm">{boss.title}</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl"
              >
                {boss.emoji}
              </motion.div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">生命值</span>
                <span className="text-white font-bold">{boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/80 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${bossHpPct}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>剩余 {bossHpPct}%</span>
                <span>已造成 {user.totalDamageDealt} 伤害</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
        >
          <h3 className="text-white font-bold mb-4">队伍贡献</h3>

          <div className="space-y-3">
            {/* Current user */}
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[user.avatarColor] ?? 'bg-purple-500'} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {user.name?.[0] ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white text-sm font-semibold">{user.name} <span className="text-purple-400 text-xs">(我)</span></span>
                  <span className="text-red-400 text-xs font-bold">{user.totalDamageDealt}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    animate={{ width: `${Math.min((user.totalDamageDealt / maxContrib) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Teammates */}
            {teammates.map(tm => (
              <div key={tm.id} className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[tm.avatarColor] ?? 'bg-gray-600'} flex items-center justify-center text-white text-sm font-bold`}>
                    {tm.name[0]}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${STATUS_COLORS[tm.status]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white text-sm font-semibold">{tm.name}</span>
                      <span className="text-gray-500 text-xs">Lv.{tm.level}</span>
                    </div>
                    <span className="text-gray-400 text-xs">{STATUS_LABELS[tm.status]}</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${AVATAR_COLORS[tm.avatarColor]?.replace('bg-', 'bg-').replace('500', '400') ?? 'bg-blue-400'}`}
                      animate={{ width: `${Math.min((tm.contribution / maxContrib) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-gray-600 text-xs mt-0.5 text-right">{tm.contribution} 伤害</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between text-sm">
            <span className="text-gray-400">队伍总伤害</span>
            <span className="text-white font-bold">{totalContribution.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
        >
          <h3 className="text-white font-bold mb-3">最新动态</h3>
          <div className="space-y-3">
            {ACTIVITY_FEED.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">
                    <span className="text-white font-semibold">{item.name}</span>
                    {' '}{item.action}
                    {item.xp && <span className="text-blue-400 ml-1">+{item.xp} XP</span>}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}

            {/* User's own contributions */}
            {user.totalTasksDone > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
                className="flex items-start gap-3 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">⚡</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">
                    <span className="text-purple-300 font-semibold">{user.name}</span>
                    {' '}累计完成 {user.totalTasksDone} 个任务，造成 {user.totalDamageDealt} 点伤害
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">本次游戏记录</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Rules card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
        >
          <h3 className="text-white font-bold mb-3">⚔️ Boss 战规则</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex gap-2">
              <span className="text-purple-400 flex-shrink-0">•</span>
              <span>每完成一个运动任务，对 Boss 造成对应伤害</span>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-400 flex-shrink-0">•</span>
              <span>队友同时训练，你的行动将触发队友协同攻击</span>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-400 flex-shrink-0">•</span>
              <span>Boss 血量归零后，解锁「屠龙勇士」徽章，新 Boss 刷新</span>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-400 flex-shrink-0">•</span>
              <span>共 4 个 Boss，每个血量更高、挑战更大</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
