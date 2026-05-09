import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { useGameStore } from '../store/useGameStore'
import type { Task } from '../types'

interface QuestCardProps {
  task: Task
  index: number
  reveal?: boolean
}

const DIFF_COLORS = {
  easy: 'text-green-400 bg-green-400/10 border-green-400/30',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  hard: 'text-red-400 bg-red-400/10 border-red-400/30',
}
const DIFF_LABELS = { easy: '轻松', medium: '适中', hard: '硬核' }

function CountdownTimer({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(t); onDone(); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [onDone])

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <motion.div
        key={count}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-5xl font-black text-purple-400"
      >
        {count > 0 ? count : '🎉'}
      </motion.div>
      <p className="text-gray-400 text-sm">正在记录打卡...</p>
    </div>
  )
}

export function QuestCard({ task, index, reveal = false }: QuestCardProps) {
  const completeTask = useGameStore(s => s.completeTask)
  const [showModal, setShowModal] = useState(false)
  const [completing, setCompleting] = useState(false)

  const delay = reveal ? index * 800 : 0
  const { displayed } = useTypewriter(reveal ? task.description : task.description, 20, delay)

  const handleComplete = () => {
    setShowModal(true)
  }

  const handleConfirm = () => {
    setCompleting(true)
  }

  const handleDone = () => {
    completeTask(task.id)
    setShowModal(false)
    setCompleting(false)
  }

  return (
    <>
      <motion.div
        initial={reveal ? { opacity: 0, y: 30 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay / 1000, duration: 0.5 }}
        className={`relative rounded-2xl border p-4 transition-all ${
          task.completed
            ? 'bg-gray-800/40 border-gray-700/50 opacity-70'
            : 'bg-gray-900 border-gray-700 hover:border-purple-500/50'
        }`}
      >
        {task.completed && (
          <div className="absolute top-3 right-3">
            <span className="text-green-400 text-xl">✓</span>
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{task.sportEmoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-base ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {task.title}
            </h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              {reveal && !task.completed ? displayed : task.description}
              {reveal && !task.completed && displayed.length < task.description.length && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFF_COLORS[task.difficulty]}`}>
            {DIFF_LABELS[task.difficulty]}
          </span>
          <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-2 py-0.5">
            ⏱ {task.duration}分钟
          </span>
          <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-2 py-0.5">
            🔥 {task.calories}千卡
          </span>
          <span className="text-xs text-blue-400 bg-blue-400/10 rounded-full px-2 py-0.5 border border-blue-400/20">
            +{task.xpReward} XP
          </span>
          <span className="text-xs text-red-400 bg-red-400/10 rounded-full px-2 py-0.5 border border-red-400/20">
            ⚔️ -{task.damage}
          </span>
        </div>

        {!task.completed && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            完成打卡 💪
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => !completing && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm"
            >
              {completing ? (
                <CountdownTimer onDone={handleDone} />
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{task.sportEmoji}</div>
                    <h3 className="text-white font-bold text-lg">{task.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">确认完成这个任务？</p>
                  </div>
                  <div className="flex gap-2 items-center justify-center mb-4 text-sm">
                    <span className="text-blue-400 bg-blue-400/10 rounded-full px-3 py-1">+{task.xpReward} XP</span>
                    <span className="text-red-400 bg-red-400/10 rounded-full px-3 py-1">⚔️ -{task.damage} Boss HP</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      取消
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleConfirm}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold"
                    >
                      已完成！
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
