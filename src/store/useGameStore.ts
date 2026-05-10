import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, Task, Badge, Boss, Teammate, UserPreferences, Settlement } from '../types'
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

function computeEncouragement(totalDone: number, streak: number, combo: boolean, leveledUp: boolean, newLevel: number): string {
  if (totalDone === 1) return '欢迎来到 FitQuest！第一步永远是最重要的！'
  if (combo) return '小队合击触发！你是小队今日的关键力量！'
  if (leveledUp) return `恭喜升到 Lv.${newLevel}！你变得更强大了！`
  if (streak >= 7) return `连续打卡 ${streak} 天，你就是大家的榜样！`
  if (streak >= 3) return `连续打卡 ${streak} 天，习惯正在悄悄养成！`
  return '太棒了！每一次坚持都在重塑更好的你！'
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

interface GameState {
  user: UserProfile
  todayTasks: Task[]
  tasksGeneratedDate: string
  badges: Badge[]
  boss: Boss
  teammates: Teammate[]
  recentUnlockedBadge: Badge | null
  lastSettlement: Settlement | null
  squadCompletedToday: number
  squadCompletedDate: string

  getLevelTitle: () => string
  getXpForNextLevel: () => number
  completeOnboarding: (name: string, avatarColor: string, prefs: UserPreferences) => void
  setTodayTasks: (tasks: Task[]) => void
  completeTask: (taskId: string) => void
  clearRecentBadge: () => void
  clearSettlement: () => void
  incrementSquadCompleted: () => void
  checkStreak: () => void
  resetProgress: () => void
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
      lastSettlement: null,
      squadCompletedToday: 1,
      squadCompletedDate: todayStr(),

      getLevelTitle: () => getLevelTitle(get().user.level),
      getXpForNextLevel: () => xpForNextLevel(get().user.level),

      completeOnboarding: (name, avatarColor, prefs) => {
        set(s => ({ user: { ...s.user, name, avatarColor, preferences: prefs, isOnboarded: true } }))
      },

      setTodayTasks: tasks => {
        set({ todayTasks: tasks, tasksGeneratedDate: todayStr() })
      },

      completeTask: taskId => {
        const state = get()
        const task = state.todayTasks.find(t => t.id === taskId)
        if (!task || task.completed) return

        const today = todayStr()
        const { user, boss, teammates, squadCompletedToday } = state

        // XP + level
        const { xp: newXp, level: newLevel } = addXP(user.xp, user.level, task.xpReward)
        const leveledUp = newLevel > user.level

        // Streak
        let newStreak = user.streak
        if (user.lastActiveDate !== today) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yStr = yesterday.toISOString().slice(0, 10)
          newStreak = user.lastActiveDate === yStr ? user.streak + 1 : 1
        }

        // Sports
        const sportsCount = { ...user.sportsCount }
        sportsCount[task.sport] = (sportsCount[task.sport] ?? 0) + 1
        const uniqueSportsCount = Object.keys(sportsCount).length

        // Damage
        const teammateDamage = teammates.reduce((sum) => sum + Math.floor(Math.random() * 12 + 5), 0)
        const bossDefeatedNow = Math.max(0, boss.currentHp - task.damage - teammateDamage) === 0

        // Combo strike: need 3 total, squadCompletedToday starts at 1 (Leo done)
        const newSquadCount = squadCompletedToday + 1
        const comboTriggered = newSquadCount >= 3
        const comboDamage = comboTriggered ? 80 : 0
        const totalDamage = task.damage + teammateDamage + comboDamage

        const newBossHp = Math.max(0, boss.currentHp - totalDamage)
        const actualBossDefeated = newBossHp === 0

        // Teammates contribution update
        const newTeammates = teammates.map(tm => ({
          ...tm,
          contribution: tm.contribution + Math.floor(Math.random() * 12 + 5),
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
          totalDamageDealt: user.totalDamageDealt + task.damage + comboDamage,
          bossesDefeated: user.bossesDefeated + (actualBossDefeated ? 1 : 0),
          sportsCount,
          uniqueSportsCount,
          allTasksDaysCount: user.allTasksDaysCount + (allDone ? 1 : 0),
        }

        // Next boss
        let updatedBoss: Boss
        if (actualBossDefeated) {
          const nextBossData = BOSS_SEQUENCE[boss.id % BOSS_SEQUENCE.length]
          updatedBoss = { ...nextBossData, currentHp: nextBossData.maxHp, defeated: false }
        } else {
          updatedBoss = { ...boss, currentHp: newBossHp }
        }

        const { badges: updatedBadges, newBadge } = checkBadges(updatedUser, state.badges, actualBossDefeated)

        const encouragement = computeEncouragement(
          updatedUser.totalTasksDone,
          newStreak,
          comboTriggered,
          leveledUp,
          newLevel
        )

        const settlement: Settlement = {
          taskTitle: task.title,
          taskEmoji: task.sportEmoji,
          xpGained: task.xpReward,
          damageDealt: task.damage + teammateDamage,
          comboDamage,
          comboTriggered,
          newStreak,
          newLevel,
          leveledUp,
          unlockedBadge: newBadge,
          encouragement,
        }

        set({
          user: updatedUser,
          todayTasks: updatedTasks,
          boss: updatedBoss,
          teammates: newTeammates,
          badges: updatedBadges,
          recentUnlockedBadge: newBadge,
          lastSettlement: settlement,
          squadCompletedToday: newSquadCount,
          squadCompletedDate: today,
        })
      },

      clearRecentBadge: () => set({ recentUnlockedBadge: null }),
      clearSettlement: () => set({ lastSettlement: null }),

      incrementSquadCompleted: () => {
        const today = todayStr()
        set(s => ({
          squadCompletedToday: s.squadCompletedDate === today ? s.squadCompletedToday + 1 : 2,
          squadCompletedDate: today,
        }))
      },

      checkStreak: () => {
        const { user, squadCompletedDate } = get()
        const today = todayStr()

        // Reset squad count if new day (keep 1 for Leo mock)
        if (squadCompletedDate !== today) {
          set({ squadCompletedToday: 1, squadCompletedDate: today })
        }

        if (!user.isOnboarded || !user.lastActiveDate) return
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
          lastSettlement: null,
          squadCompletedToday: 1,
          squadCompletedDate: todayStr(),
        })
      },
    }),
    { name: 'fitquest-storage', version: 2 }
  )
)

export { getLevelTitle, xpForNextLevel }
