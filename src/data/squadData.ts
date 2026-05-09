import type { Teammate, Boss } from '../types'

export const INITIAL_TEAMMATES: Teammate[] = [
  {
    id: 'tm1',
    name: '李子晨',
    avatarColor: 'blue',
    level: 4,
    contribution: 85,
    status: 'active',
  },
  {
    id: 'tm2',
    name: '王晓雨',
    avatarColor: 'pink',
    level: 3,
    contribution: 60,
    status: 'active',
  },
  {
    id: 'tm3',
    name: '陈明阳',
    avatarColor: 'green',
    level: 5,
    contribution: 120,
    status: 'resting',
  },
  {
    id: 'tm4',
    name: '张若汐',
    avatarColor: 'orange',
    level: 2,
    contribution: 35,
    status: 'offline',
  },
]

export const BOSS_SEQUENCE: Omit<Boss, 'currentHp' | 'defeated'>[] = [
  {
    id: 1,
    name: '懒惰之魔',
    title: '拖延大王',
    emoji: '👾',
    maxHp: 500,
    gradient: 'from-red-600 to-orange-600',
  },
  {
    id: 2,
    name: '诱惑女王',
    title: '娱乐支配者',
    emoji: '🎮',
    maxHp: 800,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 3,
    name: '放弃恶魔',
    title: '意志破坏者',
    emoji: '🌀',
    maxHp: 1200,
    gradient: 'from-slate-600 to-red-700',
  },
  {
    id: 4,
    name: '终极懒惰',
    title: '舒适区守护者',
    emoji: '💀',
    maxHp: 2000,
    gradient: 'from-red-900 to-gray-900',
  },
]

export const INITIAL_BOSS: Boss = {
  ...BOSS_SEQUENCE[0],
  currentHp: BOSS_SEQUENCE[0].maxHp,
  defeated: false,
}

export const LEADERBOARD_MOCK = [
  { id: 'lm1', name: '李子晨', avatarColor: 'blue', level: 4, weeklyXp: 580 },
  { id: 'lm2', name: '王晓雨', avatarColor: 'pink', level: 3, weeklyXp: 420 },
  { id: 'lm3', name: '陈明阳', avatarColor: 'green', level: 5, weeklyXp: 310 },
  { id: 'lm4', name: '张若汐', avatarColor: 'orange', level: 2, weeklyXp: 180 },
  { id: 'lm5', name: '刘浩然', avatarColor: 'teal', level: 1, weeklyXp: 95 },
]
