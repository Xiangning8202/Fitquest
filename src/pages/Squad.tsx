import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { AvatarIcon, AVATAR_BG } from '../components/AvatarIcon'

const COMBO_NEEDED = 3

const STATUS_COLORS = { active: 'bg-green-400', resting: 'bg-yellow-400', offline: 'bg-gray-600' }
const STATUS_LABELS = { active: '今日已训练', resting: '休息中', offline: '未上线' }

const ACTIVITY_FEED = [
  { name: '李子晨', action: '完成了「操场速跑」', xp: 50, time: '3分钟前', emoji: '🏃' },
  { name: '陈明阳', action: '完成了「全身力量训练」', xp: 50, time: '18分钟前', emoji: '💪' },
  { name: '王晓雨', action: '完成了「晨间唤醒流」', xp: 30, time: '41分钟前', emoji: '🧘' },
  { name: '系统', action: 'Boss 受到了 85 点伤害', xp: null, time: '1小时前', emoji: '⚔️' },
]

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const link = 'fitquest.app/invite/X7K2P9'

  const handleCopy = () => {
    navigator.clipboard?.writeText(`加入我的 FitQuest 小队，一起打 Boss！${link}`)
      .catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-3xl p-6"
      >
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🤝</div>
          <h3 className="text-white font-black text-lg">邀请队友加入小队</h3>
          <p className="text-gray-400 text-sm mt-1">分享链接，一起打 Boss、刷排行！</p>
        </div>

        {/* Invite link box */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
          <span className="text-purple-400 text-sm font-mono flex-1 truncate">{link}</span>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleCopy}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex-shrink-0 ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:bg-purple-600/50'
            }`}
          >
            {copied ? '✓ 已复制' : '复制'}
          </motion.button>
        </div>

        {/* Share options */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: '💬', label: '微信' },
            { icon: '🔗', label: '链接' },
            { icon: '📱', label: '二维码' },
          ].map(s => (
            <button
              key={s.label}
              onClick={handleCopy}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-gray-400 text-xs">{s.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl border border-gray-700 text-gray-400 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          关闭
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Squad page ───────────────────────────────────────────────────────────────

export function Squad() {
  const user = useGameStore(s => s.user)
  const boss = useGameStore(s => s.boss)
  const teammates = useGameStore(s => s.teammates)
  const squadCompleted = useGameStore(s => s.squadCompletedToday)
  const [showInvite, setShowInvite] = useState(false)

  const bossHpPct = Math.round((boss.currentHp / boss.maxHp) * 100)
  const totalContribution = teammates.reduce((s, t) => s + t.contribution, 0) + user.totalDamageDealt
  const maxContrib = Math.max(...teammates.map(t => t.contribution), user.totalDamageDealt, 1)
  const comboProgress = Math.min(squadCompleted, COMBO_NEEDED)

  return (
    <div className="min-h-full bg-gray-950 app-page">
      <div className="fixed inset-0 bg-gradient-to-br from-red-950/20 via-gray-950 to-purple-950/20 pointer-events-none" />

      <div className="relative max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-white mb-1">⚔️ 小队 Boss 战</h1>
          <p className="text-gray-400 text-sm">与队友合力击败 Boss，守护小队荣耀</p>
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
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">队伍贡献</h3>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/35 transition-colors"
              >
                <span>+</span>
                <span>添加队友</span>
              </motion.button>
            </div>

          <div className="space-y-3">
            {/* Current user */}
            <div className="flex items-center gap-3">
              <AvatarIcon color={user.avatarColor} className="w-9 h-9" />
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
                  <AvatarIcon color={tm.avatarColor} className="w-9 h-9" />
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
                      className={`h-full rounded-full ${(AVATAR_BG[tm.avatarColor] ?? 'bg-blue-500').replace('500', '400')}`}
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

        {/* Combo Strike card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.33 }}
          className={`bg-gray-900 border rounded-2xl p-4 ${comboProgress >= COMBO_NEEDED ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-gray-800'}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold">⚡ 今日小队合击</h3>
            <span className={`text-lg font-black ${comboProgress >= COMBO_NEEDED ? 'text-yellow-400' : 'text-gray-400'}`}>
              {comboProgress} / {COMBO_NEEDED}
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            {Array.from({ length: COMBO_NEEDED }).map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={i < comboProgress ? { scale: [1, 1.15, 1] } : {}}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`flex-1 h-3 rounded-full ${
                  i < comboProgress
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {comboProgress >= COMBO_NEEDED ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
              <p className="text-yellow-400 font-bold text-sm">🎉 合击条件已达成！</p>
              <p className="text-orange-300 text-xs mt-0.5">下次完成任务将额外造成 80 点 Boss 伤害</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              还差 <span className="text-white font-bold">{COMBO_NEEDED - comboProgress}</span> 名队友完成任务即可触发合击，额外造成 80 点 Boss 伤害
            </p>
          )}
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

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      </AnimatePresence>
    </div>
  )
}
