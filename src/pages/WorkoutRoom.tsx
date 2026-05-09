import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { useAICoach, COACH_LINES } from '../hooks/useAICoach'
import { useMusicPlayer } from '../hooks/useMusicPlayer'
import { SettlementModal } from '../components/SettlementModal'
import type { Task } from '../types'

// ─── Phase definitions ────────────────────────────────────────────────────────

interface Phase {
  id: string
  name: string
  emoji: string
  duration: number
  tips: string[]
  gradient: string
  textColor: string
}

const FALLBACK_PHASE: Phase = {
  id: 'loading', name: '加载中', emoji: '⏳', duration: 60,
  tips: [], gradient: 'from-gray-700 to-gray-800', textColor: 'text-gray-400',
}

const MAIN_TIPS: Record<string, string[]> = {
  跑步: ['保持稳定步频，不要冲太快', '放松上身，自然摆臂', '鼻吸口呼，找到舒适节奏'],
  健身: ['核心收紧，控制每个动作', '宁慢勿快，感受肌肉发力', '组间深呼吸充分恢复'],
  瑜伽: ['专注呼吸，顺应身体感受', '不强迫到达极限位置', '保持每个体式感受当下'],
  游泳: ['保持流畅划水节奏', '换气自然，不要憋气', '专注技术动作质量'],
  篮球: ['享受运动的乐趣', '专注技术动作细节', '保持运动热度不松懈'],
  骑行: ['保持稳定踏频', '放松上身，握把轻松', '跟着呼吸找到节奏'],
  跳绳: ['保持轻盈脚步', '手腕发力而非手臂', '找到自己舒适的节奏'],
  HIIT: ['全力完成每个动作', '休息时充分恢复', '感受心肺的积极变化'],
}

function buildPhases(task: Task): Phase[] {
  const d = { easy: [45, 120, 45], medium: [60, 240, 60], hard: [90, 420, 90] }[task.difficulty]
  return [
    {
      id: 'warmup', name: '热身阶段', emoji: '🌡️', duration: d[0],
      tips: ['轻松活动各关节，不要急', '深呼吸，让身体进入状态', '感受体温上升，肌肉活跃'],
      gradient: 'from-yellow-700 to-orange-600', textColor: 'text-orange-400',
    },
    {
      id: 'main', name: '主运动', emoji: task.sportEmoji, duration: d[1],
      tips: MAIN_TIPS[task.sport] ?? ['保持稳定节奏', '感受身体的变化', '遇到困难适当降低强度'],
      gradient: 'from-purple-700 to-pink-600', textColor: 'text-purple-400',
    },
    {
      id: 'cooldown', name: '放松整理', emoji: '🧘', duration: d[2],
      tips: ['慢慢降低运动强度', '拉伸主要运动肌群', '深呼吸，让心率恢复平稳'],
      gradient: 'from-blue-700 to-teal-600', textColor: 'text-blue-400',
    },
  ]
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SQUAD_FEED = [
  { name: 'Leo', msg: '正在运动中 💪', color: 'blue' },
  { name: 'Mia', msg: '刚加入房间 🔥', color: 'pink' },
  { name: '小林', msg: '完成了今日任务 ✅', color: 'teal' },
  { name: 'Leo', msg: '进入主运动阶段', color: 'blue' },
  { name: 'Mia', msg: '拉伸任务完成，Boss -20 HP ⚔️', color: 'pink' },
  { name: '阿诚', msg: '今天状态不好，做轻量版 😅', color: 'green' },
  { name: 'Leo', msg: '进入最后 1 分钟 ⏰', color: 'blue' },
  { name: '系统', msg: '你完成后合击进度 +1 ⚡', color: 'purple' },
]

const AVATAR_COLORS: Record<string, string> = {
  blue: 'bg-blue-500', pink: 'bg-pink-500', teal: 'bg-teal-500',
  green: 'bg-green-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
}

const MUSIC_MODES = [
  { id: 'stretch', name: '轻松拉伸', emoji: '🎵', desc: '舒缓放松' },
  { id: 'walk', name: '校园慢走', emoji: '🎶', desc: '轻松节奏' },
  { id: 'burn', name: '燃脂节奏', emoji: '🔥', desc: '高能燃脂' },
  { id: 'focus', name: '专注训练', emoji: '⚡', desc: '深度专注' },
]

const COMBO_NEEDED = 3

// ─── WorkoutRoom component ────────────────────────────────────────────────────

export function WorkoutRoom() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const { speak, cancel, toggleVoice, voiceOn } = useAICoach()
  const { start: startAudio, stop: stopAudio, setMode: setAudioMode } = useMusicPlayer()

  // ── Store selectors (hooks) ──
  const todayTasks = useGameStore(s => s.todayTasks)
  const completeTask = useGameStore(s => s.completeTask)
  const lastSettlement = useGameStore(s => s.lastSettlement)
  const clearSettlement = useGameStore(s => s.clearSettlement)
  const squadCompleted = useGameStore(s => s.squadCompletedToday)
  const incrementSquadCompleted = useGameStore(s => s.incrementSquadCompleted)
  const userName = useGameStore(s => s.user.name)

  // ── Derived values (non-hook, but used by hooks below) ──
  const task = todayTasks.find(t => t.id === taskId)
  const phases = useMemo(() => (task ? buildPhases(task) : []), [task])

  // ── State (all useState must be before any conditional return) ──
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(() => phases[0]?.duration ?? 60)
  const [running, setRunning] = useState(false)
  const [started, setStarted] = useState(false)
  const [settled, setSettled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [feedItems, setFeedItems] = useState<{ id: number; text: string; color: string }[]>([])
  const [musicMode, setMusicMode] = useState('focus')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // ── Refs ──
  const feedCounter = useRef(0)
  const halfFired = useRef(false)
  const lastMinFired = useRef(false)

  // ── Safe current phase (always defined) ──
  const currentPhase = phases[phaseIdx] ?? FALLBACK_PHASE
  const phaseDuration = currentPhase.duration

  // ── Helpers (must be before effects that use them) ──
  const showToast = useCallback((text: string) => {
    setToast(text)
    setTimeout(() => setToast(null), 4000)
  }, [])

  const handleNextPhase = useCallback(() => {
    setPhaseIdx(prev => {
      const next = prev + 1
      if (next < phases.length) {
        setTimeLeft(phases[next].duration)
        halfFired.current = false
        lastMinFired.current = false
        // 根据目标阶段选不同的开场语
        const phaseId = phases[next].id
        const line = phaseId === 'main'
          ? COACH_LINES.mainStart()
          : phaseId === 'cooldown'
          ? COACH_LINES.cooldownStart()
          : COACH_LINES.phaseChange(phases[prev].name, phases[next].name)
        showToast(line)
        speak(line)
        return next
      }
      return prev
    })
  }, [phases, speak, showToast])

  const handleEndSettle = useCallback(() => {
    if (!task) return
    setRunning(false)
    cancel()
    const line = COACH_LINES.done(task.xpReward, task.damage)
    showToast(line)
    speak(line)
    completeTask(task.id)
    setSettled(true)
  }, [task, completeTask, speak, cancel, showToast])

  const handlePauseResume = useCallback(() => {
    setRunning(r => {
      const next = !r
      if (!next) {
        const line = COACH_LINES.pause()
        showToast(line)
        speak(line)
      } else {
        const line = COACH_LINES.resume()
        showToast(line)
        speak(line)
      }
      return next
    })
  }, [speak, showToast])

  const handleTired = useCallback(() => {
    const line = COACH_LINES.tired()
    showToast(line)
    speak(line)
  }, [speak, showToast])

  const handleStart = useCallback(() => {
    if (phases.length === 0) return
    setStarted(true)
    setRunning(true)
    setTimeLeft(phases[0].duration)
    halfFired.current = false
    lastMinFired.current = false
    const line = COACH_LINES.warmupStart()
    showToast(line)
    speak(line)
  }, [phases, speak, showToast])

  // ── Effects (ALL useEffect must be before any conditional return) ──

  // Timer countdown
  useEffect(() => {
    if (!running || !started) return
    const halfPoint = Math.floor(phaseDuration / 2)
    const interval = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1
        if (phaseIdx === 1 && !halfFired.current && next === halfPoint) {
          halfFired.current = true
          const line = COACH_LINES.halfTime()
          showToast(line)
          speak(line)
        }
        if (!lastMinFired.current && next === 60 && phaseDuration > 90) {
          lastMinFired.current = true
          const line = COACH_LINES.lastMinute()
          showToast(line)
          speak(line)
        }
        if (next === 10 && next > 0) {
          const line = COACH_LINES.tenSeconds()
          speak(line)
        }
        return next <= 0 ? 0 : next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running, started, phaseIdx, phaseDuration, speak, showToast])

  // Auto-advance phase when timer hits 0
  useEffect(() => {
    if (!started || !running || timeLeft !== 0) return
    if (phaseIdx < phases.length - 1) {
      handleNextPhase()
    }
  }, [timeLeft, started, running, phaseIdx, phases.length, handleNextPhase])

  // Squad feed rotation
  useEffect(() => {
    if (!started) return
    let idx = 0
    const add = () => {
      const item = SQUAD_FEED[idx % SQUAD_FEED.length]
      setFeedItems(prev => [
        ...prev.slice(-4),
        { id: feedCounter.current++, text: `${item.name}：${item.msg}`, color: item.color },
      ])
      idx++
    }
    add()
    const interval = setInterval(add, 5000)
    return () => clearInterval(interval)
  }, [started])

  // Mia joins after 12 s → squadCompleted: 1→2
  useEffect(() => {
    if (!started) return
    const t = setTimeout(incrementSquadCompleted, 12000)
    return () => clearTimeout(t)
  }, [started, incrementSquadCompleted])

  // Show settlement modal when store has settlement and user settled
  useEffect(() => {
    if (lastSettlement && settled) setShowModal(true)
  }, [lastSettlement, settled])

  // Stop audio on unmount
  useEffect(() => () => { stopAudio() }, [stopAudio])

  // ── NOW it is safe to do conditional returns ──

  if (!task) return <Navigate to="/quest" replace />
  // task.completed 时不再自动跳转，改为在预览页展示"已完成"态，避免页面一闪而过

  // ── Computed values (after redirect guards) ──
  const comboProgress = Math.min(squadCompleted, COMBO_NEEDED)
  const totalDuration = phases.reduce((s, p) => s + p.duration, 0)
  const completedSecs = phases.slice(0, phaseIdx).reduce((s, p) => s + p.duration, 0)
  const overallProgress = totalDuration > 0
    ? Math.min(((completedSecs + phaseDuration - timeLeft) / totalDuration) * 100, 100)
    : 0

  const handleCloseSettlement = () => {
    clearSettlement()
    setShowModal(false)
    navigate('/quest')
  }

  // ── JSX ──────────────────────────────────────────────────────────────────────

  return (
    <div className="h-dvh sm:h-full bg-gray-950 flex flex-col">
      {/* Phase-colored background */}
      <motion.div
        key={phaseIdx}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className={`fixed inset-0 z-[-1] bg-gradient-to-br ${currentPhase.gradient} pointer-events-none`}
      />

      {/* AI Coach toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 z-40 bg-gray-800/95 backdrop-blur border border-gray-700 rounded-2xl px-4 py-3 text-center shadow-xl"
          >
            <span className="text-sm text-gray-400 mr-1">🤖 AI Coach：</span>
            <span className="text-white text-sm font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed header */}
      <header className="fixed left-0 right-0 top-0 z-30 sm:relative sm:top-auto sm:left-auto sm:right-auto flex-shrink-0 bg-gray-950/85 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => { cancel(); navigate('/quest') }}
          className="text-gray-400 hover:text-white transition-colors text-sm px-1"
        >
          ← 返回
        </button>
        <div className="flex-1 text-center">
          <p className="text-white font-bold text-sm truncate">{task.title}</p>
          <p className="text-gray-500 text-xs">{task.sportEmoji} {task.sport} · 预计 {task.duration} 分钟</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoice}
            title={voiceOn ? '关闭语音提示' : '开启语音提示'}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all ${
              voiceOn
                ? 'bg-purple-600/30 text-purple-300 hover:bg-purple-600/50'
                : 'bg-gray-800 text-gray-600 hover:bg-gray-700'
            }`}
          >
            {voiceOn ? '🔊' : '🔇'}
          </button>
          <span className="text-xs text-gray-500">{phaseIdx + 1}/{phases.length}</span>
        </div>
      </header>

      {/* Overall progress bar */}
      <div className="fixed top-[57px] left-0 right-0 z-30 sm:relative sm:top-auto sm:left-auto sm:right-auto flex-shrink-0 h-0.5 bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-40 sm:pt-4 sm:pb-6 px-4 max-w-lg mx-auto w-full space-y-4">

        {/* ── Pre-start screen ── */}
        {!started ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-[65vh] text-center"
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="text-8xl mb-5"
            >
              {task.sportEmoji}
            </motion.div>
            <h2 className="text-white font-black text-2xl mb-2">{task.title}</h2>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed max-w-xs">{task.description}</p>

            <div className="flex gap-2 mb-7 flex-wrap justify-center">
              <span className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-3 py-1">获得 +{task.xpReward} XP</span>
              <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-3 py-1">Boss ⚔️ -{task.damage} HP</span>
              <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-3 py-1">⏱ {task.duration} 分钟</span>
              <span className="text-xs text-gray-400 bg-gray-800 rounded-full px-3 py-1">🔥 {task.calories} 千卡</span>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-7 w-full max-w-xs text-left">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">训练阶段</p>
              {phases.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 py-1.5">
                  <span className="text-lg w-7">{p.emoji}</span>
                  <span className={`text-sm font-medium ${i === 0 ? 'text-orange-400' : i === 1 ? 'text-purple-400' : 'text-blue-400'}`}>{p.name}</span>
                  <span className="ml-auto text-gray-500 text-xs">
                    {Math.floor(p.duration / 60) > 0 ? `${Math.floor(p.duration / 60)}分` : ''}{p.duration % 60 > 0 ? `${p.duration % 60}秒` : ''}
                  </span>
                </div>
              ))}
            </div>

            {task.completed ? (
              <div className="flex flex-col items-center gap-3">
                <div className="px-6 py-3 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-400 font-bold text-base">
                  ✓ 今日已完成打卡
                </div>
                <button
                  onClick={() => navigate('/quest')}
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  ← 返回任务列表
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-black shadow-lg shadow-purple-500/30"
              >
                开始运动 🚀
              </motion.button>
            )}
          </motion.div>
        ) : (
          /* ── Workout active screen ── */
          <>
            {/* Phase display + timer */}
            <motion.div
              key={`phase-${phaseIdx}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-gradient-to-br ${currentPhase.gradient} rounded-2xl p-5 text-center border border-white/10 overflow-hidden`}
            >
              <div className="flex justify-center gap-2 mb-3">
                {phases.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i < phaseIdx ? 'bg-white/60 w-5' : i === phaseIdx ? 'bg-white w-10' : 'bg-white/20 w-5'
                    }`}
                  />
                ))}
              </div>
              <div className="text-3xl mb-0.5">{currentPhase.emoji}</div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-widest">{currentPhase.name}</div>

              <motion.div
                key={timeLeft <= 10 ? timeLeft : 'stable'}
                animate={timeLeft <= 10 && timeLeft > 0 ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="text-white font-black text-7xl my-3 tabular-nums"
              >
                {formatTime(timeLeft)}
              </motion.div>

              <div className="h-1.5 bg-black/25 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/65 rounded-full"
                  animate={{ width: `${phaseDuration > 0 ? ((phaseDuration - timeLeft) / phaseDuration) * 100 : 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {!running && <p className="mt-2 text-white/50 text-xs animate-pulse">已暂停</p>}
            </motion.div>

            {/* Phase tips */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${currentPhase.textColor}`}>
                阶段提示
              </p>
              <div className="space-y-1.5">
                {currentPhase.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className={`flex-shrink-0 mt-0.5 ${currentPhase.textColor}`}>•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Squad online */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold text-sm">👥 宿舍燃脂小队</p>
                <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">在线</span>
              </div>
              <div className="flex gap-3 mb-3">
                {[
                  { name: 'Leo', color: 'blue', status: '运动中' },
                  { name: 'Mia', color: 'pink', status: '运动中' },
                  { name: userName || '你', color: 'purple', status: '运动中', isMe: true },
                  { name: '阿诚', color: 'green', status: '轻量版' },
                ].map(m => (
                  <div key={m.name} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`relative w-10 h-10 rounded-full ${AVATAR_COLORS[m.color]} flex items-center justify-center text-white text-sm font-bold ${m.isMe ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-900' : ''}`}>
                      {m.name[0]}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900" />
                    </div>
                    <span className="text-gray-400 text-xs truncate w-full text-center">{m.isMe ? '你' : m.name}</span>
                    <span className="text-gray-600 text-xs">{m.status}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 min-h-[64px]">
                {feedItems.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${AVATAR_COLORS[item.color] ?? 'bg-gray-500'}`} />
                    <span className="text-gray-300">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Music player */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold text-sm">🎵 运动音乐</p>
                <button
                  onClick={() => {
                    if (musicPlaying) {
                      stopAudio()
                      setMusicPlaying(false)
                    } else {
                      startAudio(musicMode)
                      setMusicPlaying(true)
                    }
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-sm ${
                    musicPlaying ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {musicPlaying ? '⏸' : '▶'}
                </button>
              </div>
              {musicPlaying && (
                <div className="flex items-end gap-0.5 h-6 mb-3 justify-center">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${4 + (i % 3) * 3}px`, `${10 + (i % 5) * 4}px`, `${4 + (i % 3) * 3}px`] }}
                      transition={{ duration: 0.4 + (i % 4) * 0.1, repeat: Infinity, delay: i * 0.04 }}
                      className="w-1 bg-purple-500 rounded-full"
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-4 gap-2">
                {MUSIC_MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMusicMode(m.id)
                      if (musicPlaying) {
                        setAudioMode(m.id) // 无缝切换，不重启 AudioContext
                      } else {
                        startAudio(m.id)
                        setMusicPlaying(true)
                      }
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-center border ${
                      musicMode === m.id
                        ? 'bg-purple-600/25 border-purple-500/50 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-base">{m.emoji}</span>
                    <span className="text-xs leading-tight">{m.name}</span>
                  </button>
                ))}
              </div>
              {musicPlaying && (
                <p className="text-center text-purple-400 text-xs mt-2">
                  {MUSIC_MODES.find(m => m.id === musicMode)?.name} · {MUSIC_MODES.find(m => m.id === musicMode)?.desc}
                </p>
              )}
            </div>
          </>
        )}
      </main>

      {/* Fixed bottom controls (only when started) */}
      {started && (
        <div className="fixed left-0 right-0 bottom-0 z-30 sm:relative sm:bottom-auto sm:left-auto sm:right-auto flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-t border-gray-800 p-4 space-y-3 nav-safe">
          <div className="flex gap-2 max-w-lg mx-auto">
            <button
              onClick={handlePauseResume}
              className={`flex-1 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                running
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-green-500/50 text-green-400 bg-green-500/10'
              }`}
            >
              {running ? '⏸ 暂停' : '▶ 继续'}
            </button>
            {phaseIdx < phases.length - 1 && (
              <button
                onClick={handleNextPhase}
                className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold text-sm transition-all"
              >
                跳过阶段 →
              </button>
            )}
            <button
              onClick={handleTired}
              title="我有点累"
              className="px-3 py-2.5 rounded-xl border border-gray-700 text-gray-500 hover:text-gray-300 text-lg transition-all"
            >
              😮‍💨
            </button>
          </div>
          <div className="max-w-lg mx-auto">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleEndSettle}
              disabled={settled}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-base shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {settled ? '结算中...' : '结束并结算 🏆'}
            </motion.button>
          </div>
        </div>
      )}

      {/* Settlement modal */}
      <AnimatePresence>
        {showModal && lastSettlement && (
          <SettlementModal settlement={lastSettlement} onClose={handleCloseSettlement} />
        )}
      </AnimatePresence>
    </div>
  )
}
