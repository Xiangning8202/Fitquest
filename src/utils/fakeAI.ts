import { QUEST_TEMPLATES } from '../data/questTemplates'
import type { Task, UserPreferences } from '../types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const INTENSITY_DIFFICULTY_MAP: Record<string, ('easy' | 'medium' | 'hard')[]> = {
  '轻松': ['easy'],
  '适中': ['easy', 'medium'],
  '强度': ['medium', 'hard'],
}

export function generateTasks(preferences: UserPreferences): Task[] {
  const { sports, intensity } = preferences
  const allowedDifficulties = INTENSITY_DIFFICULTY_MAP[intensity] ?? ['easy', 'medium']

  // Filter templates that match preferred sports and intensity
  const preferred = QUEST_TEMPLATES.filter(
    t => sports.includes(t.sport) && allowedDifficulties.includes(t.difficulty)
  )

  // Fallback: if not enough preferred, pull from any sport with allowed difficulty
  const fallback = QUEST_TEMPLATES.filter(
    t => !sports.includes(t.sport) && allowedDifficulties.includes(t.difficulty)
  )

  const pool = shuffle(preferred.length >= 3 ? preferred : [...preferred, ...shuffle(fallback)])
  const picked = pool.slice(0, 3)

  return picked.map((t, i) => ({
    ...t,
    id: `task_${Date.now()}_${i}`,
    completed: false,
  }))
}

export const AI_LOADING_MESSAGES = [
  '正在分析你的运动偏好...',
  '根据你的目标生成方案...',
  '优化任务难度匹配...',
  '个性化任务生成完毕！',
]
