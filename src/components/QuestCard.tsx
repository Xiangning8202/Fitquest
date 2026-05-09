import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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

export function QuestCard({ task, index, reveal = false }: QuestCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={reveal ? { opacity: 0, y: 30 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reveal ? index * 0.2 : 0, duration: 0.5 }}
      className={`relative rounded-2xl border p-4 transition-all ${
        task.completed
          ? 'bg-gray-800/40 border-gray-700/50 opacity-70'
          : 'bg-gray-900 border-gray-700 hover:border-purple-500/50'
      }`}
    >
      {task.completed && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
          <span className="text-green-400 text-sm">✓</span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{task.sportEmoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-base ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {task.title}
          </h3>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">{task.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${DIFF_COLORS[task.difficulty]}`}>
          {DIFF_LABELS[task.difficulty]}
        </span>
        <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-2 py-0.5">
          ⏱ 预计 {task.duration} 分钟
        </span>
        <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-2 py-0.5">
          🔥 消耗 {task.calories} 千卡
        </span>
        <span className="text-xs text-blue-400 bg-blue-400/10 rounded-full px-2 py-0.5 border border-blue-400/20">
          获得 +{task.xpReward} XP
        </span>
        <span className="text-xs text-red-400 bg-red-400/10 rounded-full px-2 py-0.5 border border-red-400/20">
          Boss ⚔️ -{task.damage}
        </span>
      </div>

      {task.completed ? (
        <div className="w-full py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-green-400 text-sm font-semibold">
          ✓ 已完成打卡
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/workout/${task.id}`)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          开始任务 🚀
        </motion.button>
      )}
    </motion.div>
  )
}
