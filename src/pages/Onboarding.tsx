import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { AvatarIcon } from '../components/AvatarIcon'

const SPORTS = ['跑步', '健身', '瑜伽', '游泳', '篮球', '骑行', '跳绳', 'HIIT']
const SPORT_EMOJIS: Record<string, string> = {
  跑步: '🏃', 健身: '💪', 瑜伽: '🧘', 游泳: '🏊',
  篮球: '🏀', 骑行: '🚴', 跳绳: '⚡', HIIT: '🔥',
}
const AVATAR_COLORS = [
  { id: 'purple', bg: 'bg-purple-500', label: '紫色' },
  { id: 'blue', bg: 'bg-blue-500', label: '蓝色' },
  { id: 'green', bg: 'bg-green-500', label: '绿色' },
  { id: 'orange', bg: 'bg-orange-500', label: '橙色' },
  { id: 'pink', bg: 'bg-pink-500', label: '粉色' },
  { id: 'teal', bg: 'bg-teal-500', label: '青色' },
]
const TIME_SLOTS = ['早晨', '午间', '傍晚', '夜间']
const INTENSITIES = ['轻松', '适中', '强度']
const GOALS = ['减脂塑形', '增肌力量', '提升耐力', '保持健康']

const INTENSITY_DESC: Record<string, string> = {
  轻松: '入门友好，适合初学者',
  适中: '有点挑战，持续进步',
  强度: '高强度训练，极限挑战',
}

export function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatarColor, setAvatarColor] = useState('purple')
  const [sports, setSports] = useState<string[]>([])
  const [timeSlot, setTimeSlot] = useState('')
  const [intensity, setIntensity] = useState('')
  const [goal, setGoal] = useState('')
  const navigate = useNavigate()
  const completeOnboarding = useGameStore(s => s.completeOnboarding)

  const toggleSport = (s: string) => {
    setSports(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const canNext = [
    true,
    name.trim().length > 0,
    sports.length > 0,
    timeSlot && intensity && goal,
  ][step]

  const handleFinish = () => {
    completeOnboarding(name.trim(), avatarColor, {
      sports,
      timeSlot,
      intensity,
      goal,
    })
    navigate('/')
  }

  const avatarBg = AVATAR_COLORS.find(c => c.id === avatarColor)?.bg ?? 'bg-purple-500'

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950/40 via-gray-950 to-pink-950/30 pointer-events-none" />

      {/* Progress bar */}
      {step > 0 && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="text-center max-w-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                🏋️
              </motion.div>
              <h1 className="text-4xl font-black text-white mb-3">
                FitQuest
              </h1>
              <p className="text-gray-400 text-lg mb-2">把运动变成一场冒险</p>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed">
                AI 个性化任务 · 小队 Boss 战 · 成就徽章 · 荣耀排行榜
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(1)}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold shadow-lg shadow-purple-500/25"
              >
                开始冒险 ⚡
              </motion.button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="w-full max-w-sm"
            >
              <h2 className="text-2xl font-black text-white mb-1">创建你的角色</h2>
              <p className="text-gray-400 text-sm mb-6">起一个让队友记住的名字</p>

              <div className="mb-5">
                <label className="text-gray-300 text-sm font-medium mb-2 block">昵称</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="输入你的昵称..."
                  maxLength={12}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-3 block">选择头像颜色</label>
                <div className="flex gap-3 flex-wrap">
                  {AVATAR_COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setAvatarColor(c.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`transition-all ${avatarColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-110 rounded-full' : 'opacity-70 hover:opacity-100'}`}>
                        <AvatarIcon color={c.id} className="w-12 h-12" animate={avatarColor === c.id} />
                      </div>
                      <span className="text-gray-500 text-xs">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="sports"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="w-full max-w-sm"
            >
              <h2 className="text-2xl font-black text-white mb-1">选择运动偏好</h2>
              <p className="text-gray-400 text-sm mb-6">AI 会根据你的偏好生成个性化任务（可多选）</p>

              <div className="grid grid-cols-2 gap-3">
                {SPORTS.map(s => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSport(s)}
                    className={`flex items-center gap-2 p-3.5 rounded-xl border transition-all text-left ${
                      sports.includes(s)
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-xl">{SPORT_EMOJIS[s]}</span>
                    <span className="font-semibold text-sm">{s}</span>
                    {sports.includes(s) && <span className="ml-auto text-purple-400 text-xs">✓</span>}
                  </motion.button>
                ))}
              </div>
              {sports.length > 0 && (
                <p className="text-center text-purple-400 text-xs mt-3">已选 {sports.length} 项</p>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="w-full max-w-sm"
            >
              <h2 className="text-2xl font-black text-white mb-1">个性化设置</h2>
              <p className="text-gray-400 text-sm mb-5">最后一步，告诉我你的训练风格</p>

              <div className="space-y-5">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">运动时段</label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        onClick={() => setTimeSlot(t)}
                        className={`py-2 rounded-xl text-sm font-medium transition-all ${
                          timeSlot === t
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">训练强度</label>
                  <div className="space-y-2">
                    {INTENSITIES.map(i => (
                      <button
                        key={i}
                        onClick={() => setIntensity(i)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                          intensity === i
                            ? 'border-purple-500 bg-purple-500/15 text-white'
                            : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="font-semibold text-sm">{i}</span>
                        <span className="text-xs text-gray-500">{INTENSITY_DESC[i]}</span>
                        {intensity === i && <span className="text-purple-400 ml-2">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">健身目标</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOALS.map(g => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all text-left ${
                          goal === g
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        {step > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/90 backdrop-blur-md border-t border-gray-800 flex gap-3">
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-5 py-3 rounded-xl border border-gray-700 text-gray-400 font-medium hover:bg-gray-800 transition-colors"
            >
              返回
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!canNext}
              onClick={() => step < 3 ? setStep(s => s + 1) : handleFinish()}
              className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                canNext
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/20 hover:opacity-90'
                  : 'bg-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              {step < 3 ? '下一步 →' : '🚀 创建角色，开始冒险！'}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
