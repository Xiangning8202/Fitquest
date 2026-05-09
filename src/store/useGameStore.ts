import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, Task, Badge, Boss, Teammate, UserPreferences } from '../types'
import { INITIAL_BADGES } from '../data/badgeDefinitions'
import { INITIAL_BOSS, INITIAL_TEAMMATES, BOSS_SEQUENCE } from '../data/squadData'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function xpForNextLevel(level: number) {
  return 100 + level * 50
}

function addXP(xp: number, level: number, amount: number) {
  let newXp = xp + amount
  let newLevel = level
  while (newXp >= xpForNextLevel(newLevel)) {
    newXp -= xpForNextLevel(newLevel)
    newLevel++
  }
  return { xp: newXp, level: newLevel }
}

function getLevelTitle(level: number) {
  if (level <= 2) return '运动小白'
  if (level <= 4) return '健身新手'
  if (level <= 6) return '运动达人'
  if (level <= 8) return '健身勇士'
  if (level <= 10) return '运动精英'
  return '传奇战士'
}

const INITIAL_USER: UserProfile = {
  name: '',
  avatarColor: 'purple',
  level: 1,
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  totalTasksDone: 0,
  totalDamageDealt: 0,
  bossesDefeated: 0,
  sportsCount: {},
  uniqueSportsCount: 0,
  allTasksDaysCount: 0,
  preferences: { sports: [], timeSlot: '', intensity: '', goal: '' },
  isOnboarded: false,
}

interface GameState {
  user: UserProfile
  todayTasks: Task[]
  tasksGeneratedDate: string
  badges: Badge[]
  boss: Boss
  teammates: Teammate[]
  recentUnlockedBadge: Badge | null

  getLevelTitle: () => string
  getXpForNextLevel: () => number
  completeOnboarding: (name: string, avatarColor: string, prefs: UserPreferences) => void
  setTodayTasks: (tasks: Task[]) => void
  completeTask: (taskId: string) => void
  clearRecentBadge: () => void
  checkStreak: () => void
  resetProgress: () => void
}

function checkBadges(
  user: UserProfile,
  badges: Badge[],
  bossDefeated: boolean
): { badges: Badge[]; newBadge: Badge | null } {
  const today = todayStr()
  let newBadge: Badge | null = null

  const updated = badges.map(b => {
    if (b.unlocked) return b

    let shouldUnlock = false
    switch (b.id) {
      case 'first_step': shouldUnlock = user.totalTasksDone >= 1; break
      case 'streak_3': shouldUnlock = user.streak >= 3; break
      case 'tasks_10': shouldUnlock = user.totalTasksDone >= 10; break
      case 'fitness_5': shouldUnlock = (user.sportsCount['健身'] ?? 0) >= 5; break
      case 'running_5': shouldUnlock = (user.sportsCount['跑步'] ?? 0) >= 5; break
      case 'boss_first': shouldUnlock = user.totalDamageDealt > 0; break
      case 'boss_defeated': shouldUnlock = user.bossesDefeated >= 1 || bossDefeated; break
      case 'multi_sport': shouldUnlock = user.uniqueSportsCount >= 3; break
      case 'level_5': shouldUnlock = user.level >= 5; break
      case 'streak_7': shouldUnlock = user.streak >= 7; break
      case 'perfect_day': shouldUnlock = user.allTasksDaysCount >= 1; break
      case 'damage_300': shouldUnlock = user.totalDamageDealt >= 300; break
    }

    if (shouldUnlock) {
      const unlocked = { ...b, unlocked: true, unlockedAt: today }
      if (!newBadge) newBadge = unlocked
      return unlocked
    }
    return b
  })

  return { badges: updated, newBadge }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER,
      todayTasks: [],
      tasksGeneratedDate: '',
      badges: INITIAL_BADGES,
      boss: INITIAL_BOSS,
      teammates: INITIAL_TEAMMATES,
      recentUnlockedBadge: null,

      getLevelTitle: () => getLevelTitle(get().user.level),
      getXpForNextLevel: () => xpForNextLevel(get().user.level),

      completeOnboarding: (name, avatarColor, prefs) => {
        set(s => ({
          user: { ...s.user, name, avatarColor, preferences: prefs, isOnboarded: true },
        }))
      },

      setTodayTasks: tasks => {
        set({ todayTasks: tasks, tasksGeneratedDate: todayStr() })
      },

      completeTask: taskId => {
        const state = get()
        const task = state.todayTasks.find(t => t.id === taskId)
        if (!task || task.completed) return

        const today = todayStr()
        const { user, boss, teammates } = state

        // XP + level
        const { xp: newXp, level: newLevel } = addXP(user.xp, user.level, task.xpReward)

        // Streak
        let newStreak = user.streak
        if (user.lastActiveDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yStr = yesterday.toISOString().slice(0, 10)
          newStreak = user.lastActiveDate === yStr ? user.streak + 1 : 1
        }

        // Sports count
        const sportsCount = { ...user.sportsCount }
        sportsCount[task.sport] = (sportsCount[task.sport] ?? 0) + 1
        const uniqueSportsCount = Object.keys(sportsCount).length

        // Damage + teammate simulation
        const teammateDamage = teammates.reduce((sum, _) => sum + Math.floor(Math.random() * 12 + 5), 0)
        const totalDamage = task.damage + teammateDamage
        let newBossHp = Math.max(0, boss.currentHp - totalDamage)
        const bossDefeatedNow = newBossHp === 0 && !boss.defeated

        // Updated teammates contribution
        const newTeammates = teammates.map((tm, i) => ({
          ...tm,
          contribution: tm.contribution + Math.floor(Math.random() * 12 + 5) * (i === 0 ? 1 : 1),
        }))

        const updatedTasks = state.todayTasks.map(t =>
          t.id === taskId ? { ...t, completed: true } : t
        )
        const allDone = updatedTasks.every(t => t.completed)

        const updatedUser: UserProfile = {
          ...user,
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          lastActiveDate: today,
          totalTasksDone: user.totalTasksDone + 1,
          totalDamageDealt: user.totalDamageDealt + task.damage,
          bossesDefeated: user.bossesDefeated + (bossDefeatedNow ? 1 : 0),
          sportsCount,
          uniqueSportsCount,
          allTasksDaysCount: user.allTasksDaysCount + (allDone ? 1 : 0),
        }

        // Next boss
        let updatedBoss: Boss
        if (bossDefeatedNow) {
          const nextBossData = BOSS_SEQUENCE[boss.id % BOSS_SEQUENCE.length]
          updatedBoss = { ...nextBossData, currentHp: nextBossData.maxHp, defeated: false }
        } else {
          updatedBoss = { ...boss, currentHp: newBossHp }
        }

        const { badges: updatedBadges, newBadge } = checkBadges(updatedUser, state.badges, bossDefeatedNow)

        set({
          user: updatedUser,
          todayTasks: updatedTasks,
          boss: updatedBoss,
          teammates: newTeammates,
          badges: updatedBadges,
          recentUnlockedBadge: newBadge,
        })
      },

      clearRecentBadge: () => set({ recentUnlockedBadge: null }),

      checkStreak: () => {
        const { user } = get()
        if (!user.isOnboarded || !user.lastActiveDate) return
        const today = todayStr()
        if (user.lastActiveDate === today) return
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (user.lastActiveDate < yesterday.toISOString().slice(0, 10)) {
          set(s => ({ user: { ...s.user, streak: 0 } }))
        }
      },

      resetProgress: () => {
        set({
          user: INITIAL_USER,
          todayTasks: [],
          tasksGeneratedDate: '',
          badges: INITIAL_BADGES,
          boss: INITIAL_BOSS,
          teammates: INITIAL_TEAMMATES,
          recentUnlockedBadge: null,
        })
      },
    }),
    {
      name: 'fitquest-storage',
      version: 1,
    }
  )
)

export { getLevelTitle, xpForNextLevel }
