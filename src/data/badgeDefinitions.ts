import type { Badge } from '../types'

export const BADGE_DEFINITIONS: Omit<Badge, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_step',
    name: '初心者之星',
    description: '完成了人生中第一个运动任务',
    icon: '🌟',
    rarity: 'common',
  },
  {
    id: 'streak_3',
    name: '连续燃烧',
    description: '连续打卡运动 3 天，习惯正在养成',
    icon: '🔥',
    rarity: 'common',
  },
  {
    id: 'tasks_10',
    name: '任务达人',
    description: '累计完成 10 个运动任务',
    icon: '⚡',
    rarity: 'rare',
  },
  {
    id: 'fitness_5',
    name: '力量觉醒',
    description: '完成 5 个健身类任务，肌肉在呐喊',
    icon: '💪',
    rarity: 'rare',
  },
  {
    id: 'running_5',
    name: '奔跑的风',
    description: '完成 5 个跑步类任务，风一样的存在',
    icon: '🏃',
    rarity: 'rare',
  },
  {
    id: 'boss_first',
    name: '战场英雄',
    description: '首次参与宿舍 Boss 战，踏上征途',
    icon: '⚔️',
    rarity: 'common',
  },
  {
    id: 'boss_defeated',
    name: '屠龙勇士',
    description: '与队友合力击败了第一个 Boss！',
    icon: '🏆',
    rarity: 'epic',
  },
  {
    id: 'multi_sport',
    name: '全能运动员',
    description: '完成了 3 种不同类型的运动任务',
    icon: '🌈',
    rarity: 'rare',
  },
  {
    id: 'level_5',
    name: '等级传说',
    description: '达到 5 级，运动达人实至名归',
    icon: '👑',
    rarity: 'epic',
  },
  {
    id: 'streak_7',
    name: '周间勇士',
    description: '连续打卡运动 7 天，意志力爆表',
    icon: '📅',
    rarity: 'legendary',
  },
  {
    id: 'perfect_day',
    name: '完美完成',
    description: '单日完成全部 3 个每日任务',
    icon: '💯',
    rarity: 'rare',
  },
  {
    id: 'damage_300',
    name: '伤害狂魔',
    description: '累计对 Boss 造成 300 点伤害',
    icon: '🚀',
    rarity: 'epic',
  },
]

export const INITIAL_BADGES: Badge[] = BADGE_DEFINITIONS.map(def => ({
  ...def,
  unlocked: false,
}))
