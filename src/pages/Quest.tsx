import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { QuestCard } from '../components/QuestCard'
import { generateTasks, AI_LOADING_MESSAGES } from '../utils/fakeAI'

export function Quest() {
  const user = useGameStore(s => s.user)
  const todayTasks = useGameStore(s => s.todayTasks)
  const tasksGeneratedDate = useGameStore(s => s.tasksGeneratedDate)
  const setTodayTasks = useGameStore(s => s.setTodayTasks)

  const [generating, setGenerating] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const alreadyGenerated = tasksGeneratedDate === today && todayTasks.length > 0
  const doneTasks = todayTasks.filter(t => t.completed).length

  // Reset revealed when tasks change
  useEffect(() => {
    if (alreadyGenerated) setRevealed(true)
  }, [alreadyGenerated])

  const handleGenerate = () => {
    setGenerating(true)
    setMsgIdx(0)
    setRevealed(false)

    const intervals: ReturnType<typeof setTimeout>[] = []
    AI_LOADING_MESSAGES.forEach((_, i) => {
      intervals.push(setTimeout(() => setMsgIdx(i), i * 900))
    })

    setTimeout(() => {
      const tasks = generateTasks(user.preferences)
      setTodayTasks(tasks)
      setGenerating(false)
      setTimeout(() => setRevealed(true), 100)
    }, AI_LOADING_MESSAGES.length * 900 + 200)

    return () => intervals.forEach(clearTimeout)
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20 pt-16">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/20 via-gray-950 to-purple-950/30 pointer-events-none" />

      <div className="relative max-w-lg mx-auto px-4 py-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-black text-white mb-1">⚡ AI 任务中心</h1>
          <p className="text-gray-400 text-sm">
            根据你的偏好，AI 为你生成个性化运动方案
          </p>
          {user.preferences.sports.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {user.preferences.sports.map(s => (
                <span key={s} className="text-xs text-purple-300 bg-purple-500/15 border border-purple-500/20 rounded-full px-2 py-0.5">
                  {s}
                </span>
              ))}
              <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                {user.preferences.intensity}
              </span>
              <span className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5">
                {user.preferences.goal}
              </span>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Generating state */}
          {generating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 mx-auto mb-6"
              />
              <div className="text-4xl mb-4">🤖</div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white font-semibold text-lg"
                >
                  {AI_LOADING_MESSAGES[msgIdx]}
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center gap-1.5 mt-4">
                {AI_LOADING_MESSAGES.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: i <= msgIdx ? 1 : 0.3 }}
                    className="w-2 h-2 rounded-full bg-purple-500"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* No tasks yet */}
          {!generating && !alreadyGenerated && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden"
            >
              {/* Animated gradient bg */}
              <div className="relative p-8 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                />
                <div className="relative">
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🤖
                  </motion.div>
                  <h2 className="text-white font-bold text-xl mb-2">AI 等你发号施令</h2>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    点击下方按钮，AI 将根据你的偏好<br />为你量身定制今日运动计划
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGenerate}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30"
                  >
                    让 AI 生成今日任务 ✨
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tasks generated */}
          {!generating && alreadyGenerated && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">今日任务已生成</p>
                  <p className="text-white font-semibold text-sm mt-0.5">
                    完成 {doneTasks} / {todayTasks.length} 个任务
                  </p>
                </div>
                {doneTasks === todayTasks.length && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-sm bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-semibold"
                  >
                    🎉 全部完成！
                  </motion.span>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-gray-800 rounded-full mb-5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                  animate={{ width: `${(doneTasks / todayTasks.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              <div className="space-y-4">
                {todayTasks.map((t, i) => (
                  <QuestCard key={t.id} task={t} index={i} reveal={revealed} />
                ))}
              </div>

              {doneTasks === todayTasks.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-700/30 text-center"
                >
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-white font-bold text-lg">今日任务全部完成！</p>
                  <p className="text-gray-400 text-sm mt-1">你正在击败懒惰，明天继续加油！</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
