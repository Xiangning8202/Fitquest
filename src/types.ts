export interface UserPreferences {
  sports: string[]
  timeSlot: string
  intensity: string
  goal: string
}

export interface UserProfile {
  name: string
  avatarColor: string
  level: number
  xp: number
  streak: number
  lastActiveDate: string
  totalTasksDone: number
  totalDamageDealt: number
  bossesDefeated: number
  sportsCount: Record<string, number>
  uniqueSportsCount: number
  allTasksDaysCount: number
  preferences: UserPreferences
  isOnboarded: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  duration: number
  calories: number
  difficulty: 'easy' | 'medium' | 'hard'
  sport: string
  sportEmoji: string
  xpReward: number
  damage: number
  completed: boolean
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Boss {
  id: number
  name: string
  title: string
  emoji: string
  maxHp: number
  currentHp: number
  gradient: string
  defeated: boolean
}

export interface Teammate {
  id: string
  name: string
  avatarColor: string
  level: number
  contribution: number
  status: 'active' | 'resting' | 'offline'
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatarColor: string
  level: number
  weeklyXp: number
  isCurrentUser?: boolean
}
