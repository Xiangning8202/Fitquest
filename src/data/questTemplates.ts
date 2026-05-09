export interface QuestTemplate {
  title: string
  description: string
  duration: number
  calories: number
  difficulty: 'easy' | 'medium' | 'hard'
  sport: string
  sportEmoji: string
  xpReward: number
  damage: number
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // 跑步
  {
    title: '晨跑挑战',
    description: '早起来一场5分钟热身+20分钟轻松慢跑，感受清晨的空气，让一天从活力开始。',
    duration: 25, calories: 180, difficulty: 'easy', sport: '跑步', sportEmoji: '🏃',
    xpReward: 30, damage: 30,
  },
  {
    title: '操场速跑',
    description: '在操场跑道上进行6×100m冲刺跑，每组间休息1分钟，感受速度与力量的结合。',
    duration: 20, calories: 220, difficulty: 'medium', sport: '跑步', sportEmoji: '🏃',
    xpReward: 50, damage: 50,
  },
  {
    title: '长距离耐力跑',
    description: '保持匀速跑步30分钟，心率维持在最大心率的65%-75%，专注呼吸节奏。',
    duration: 30, calories: 280, difficulty: 'medium', sport: '跑步', sportEmoji: '🏃',
    xpReward: 50, damage: 55,
  },
  {
    title: '楼梯冲刺',
    description: '找一段宿舍楼梯，快速上楼+慢速下楼，重复10次，下肢肌肉深度燃烧！',
    duration: 15, calories: 160, difficulty: 'hard', sport: '跑步', sportEmoji: '🏃',
    xpReward: 80, damage: 80,
  },
  {
    title: '5公里挑战跑',
    description: '挑战完整5公里！带上耳机，找一条喜欢的路线，用你自己的节奏完成它。',
    duration: 35, calories: 320, difficulty: 'hard', sport: '跑步', sportEmoji: '🏃',
    xpReward: 80, damage: 85,
  },

  // 健身
  {
    title: '全身力量训练',
    description: '深蹲×20+俯卧撑×15+仰卧起坐×20，循环3组，组间休息60秒，全身激活！',
    duration: 25, calories: 200, difficulty: 'medium', sport: '健身', sportEmoji: '💪',
    xpReward: 50, damage: 50,
  },
  {
    title: '上肢训练日',
    description: '俯卧撑×20+三头肌撑体×15+平板支撑60秒，循环3组，塑造完美上肢线条。',
    duration: 20, calories: 170, difficulty: 'medium', sport: '健身', sportEmoji: '💪',
    xpReward: 50, damage: 45,
  },
  {
    title: '下肢爆发力',
    description: '深蹲跳×15+弓步跳×10（每侧）+臀桥×20，循环3组，让腿部充满爆发力！',
    duration: 22, calories: 240, difficulty: 'hard', sport: '健身', sportEmoji: '💪',
    xpReward: 80, damage: 80,
  },
  {
    title: '核心肌群强化',
    description: '平板支撑3×60秒+俄罗斯转体×30+腿部上举×20，打造钢铁核心。',
    duration: 20, calories: 160, difficulty: 'medium', sport: '健身', sportEmoji: '💪',
    xpReward: 50, damage: 50,
  },
  {
    title: '7分钟健身挑战',
    description: '经典7分钟高强度循环：12个动作每个30秒，休息10秒，做完感觉整个人都升华了。',
    duration: 10, calories: 120, difficulty: 'easy', sport: '健身', sportEmoji: '💪',
    xpReward: 30, damage: 30,
  },
  {
    title: '俯卧撑百次挑战',
    description: '今天就一个目标：完成100个俯卧撑。可以分组，但要在20分钟内全部完成！',
    duration: 20, calories: 180, difficulty: 'hard', sport: '健身', sportEmoji: '💪',
    xpReward: 80, damage: 85,
  },

  // 瑜伽
  {
    title: '晨间唤醒流',
    description: '10分钟太阳式A/B流动序列，唤醒身体能量，让清晨的你充满柔软与力量。',
    duration: 10, calories: 60, difficulty: 'easy', sport: '瑜伽', sportEmoji: '🧘',
    xpReward: 30, damage: 25,
  },
  {
    title: '缓解久坐疲劳',
    description: '专为久坐的你设计：15分钟背部和颈部拉伸序列，告别僵硬，找回灵活。',
    duration: 15, calories: 50, difficulty: 'easy', sport: '瑜伽', sportEmoji: '🧘',
    xpReward: 30, damage: 25,
  },
  {
    title: '战士系列挑战',
    description: '下犬式保持5×30秒+战士一/二/三各5次，感受力量与平衡的完美结合。',
    duration: 20, calories: 90, difficulty: 'medium', sport: '瑜伽', sportEmoji: '🧘',
    xpReward: 50, damage: 40,
  },
  {
    title: '深度放松冥想',
    description: '10分钟呼吸冥想+5分钟全身扫描放松，在压力中找到内心的宁静。',
    duration: 15, calories: 30, difficulty: 'easy', sport: '瑜伽', sportEmoji: '🧘',
    xpReward: 30, damage: 20,
  },
  {
    title: '柔韧性极限训练',
    description: '分腿伸展+坐姿前弯+蜥蜴式+鸽子式，每个保持45秒，挑战你的柔韧边界。',
    duration: 25, calories: 80, difficulty: 'medium', sport: '瑜伽', sportEmoji: '🧘',
    xpReward: 50, damage: 40,
  },

  // 游泳
  {
    title: '自由泳间歇训练',
    description: '连续游4×50米自由泳，每组间休息30秒，专注划水节奏与呼吸配合。',
    duration: 20, calories: 200, difficulty: 'medium', sport: '游泳', sportEmoji: '🏊',
    xpReward: 50, damage: 55,
  },
  {
    title: '四式综合游泳',
    description: '各游一个来回：自由泳+蛙泳+仰泳+蝶泳，感受不同泳姿对身体的挑战。',
    duration: 30, calories: 280, difficulty: 'hard', sport: '游泳', sportEmoji: '🏊',
    xpReward: 80, damage: 80,
  },
  {
    title: '水中有氧运动',
    description: '在浅水区进行15分钟水中慢跑和跳跃，低冲击高燃脂，膝盖友好型选择。',
    duration: 15, calories: 130, difficulty: 'easy', sport: '游泳', sportEmoji: '🏊',
    xpReward: 30, damage: 30,
  },
  {
    title: '500米耐力游',
    description: '不计时连续游500米，专注呼吸节奏，感受水流划过皮肤的丝滑感。',
    duration: 25, calories: 230, difficulty: 'medium', sport: '游泳', sportEmoji: '🏊',
    xpReward: 50, damage: 55,
  },

  // 篮球
  {
    title: '投篮命中挑战',
    description: '从5个固定位置各投10球，共50次投篮，追求更高的命中率，挑战自我记录。',
    duration: 20, calories: 150, difficulty: 'easy', sport: '篮球', sportEmoji: '🏀',
    xpReward: 30, damage: 30,
  },
  {
    title: '运球技术特训',
    description: '基础运球×5分钟+胯下运球×3分钟+背后运球×2分钟，让球成为你手的延伸。',
    duration: 15, calories: 120, difficulty: 'easy', sport: '篮球', sportEmoji: '🏀',
    xpReward: 30, damage: 25,
  },
  {
    title: '1v1 单挑对决',
    description: '找一个队友进行5局1v1，每局先得5分获胜，在对抗中提升球感和判断力。',
    duration: 30, calories: 280, difficulty: 'hard', sport: '篮球', sportEmoji: '🏀',
    xpReward: 80, damage: 80,
  },
  {
    title: '三步上篮精进',
    description: '从左右两侧各练习20次三步上篮，掌握节奏感，让上篮如行云流水般流畅。',
    duration: 15, calories: 130, difficulty: 'easy', sport: '篮球', sportEmoji: '🏀',
    xpReward: 30, damage: 30,
  },
  {
    title: '篮球体能训练',
    description: '防守滑步×3分钟+快攻折返跑×5组+三分线冲刺投篮×10次，全面提升球场体能。',
    duration: 25, calories: 250, difficulty: 'medium', sport: '篮球', sportEmoji: '🏀',
    xpReward: 50, damage: 55,
  },

  // 骑行
  {
    title: '校园环线骑行',
    description: '骑行环绕校园3圈，保持中等强度，享受骑行的自由感和清风的陪伴。',
    duration: 20, calories: 160, difficulty: 'easy', sport: '骑行', sportEmoji: '🚴',
    xpReward: 30, damage: 30,
  },
  {
    title: '坡道燃脂挑战',
    description: '找一段上坡路来回骑行5次，感受腿部肌肉的燃烧感，坡道是最好的教练。',
    duration: 25, calories: 280, difficulty: 'hard', sport: '骑行', sportEmoji: '🚴',
    xpReward: 80, damage: 80,
  },
  {
    title: '骑行间歇训练',
    description: '30秒冲刺+90秒慢速恢复，重复8组，科学的间歇训练让心肺功能飞速提升。',
    duration: 20, calories: 220, difficulty: 'medium', sport: '骑行', sportEmoji: '🚴',
    xpReward: 50, damage: 55,
  },
  {
    title: '探索骑行打卡',
    description: '骑行到附近一个你从未去过的地方打卡，单程至少20分钟，顺便探索城市！',
    duration: 45, calories: 320, difficulty: 'medium', sport: '骑行', sportEmoji: '🚴',
    xpReward: 50, damage: 50,
  },

  // 跳绳
  {
    title: '跳绳基础训练',
    description: '连续跳绳200下，休息1分钟，共3组。简单有效，随时随地都能做！',
    duration: 10, calories: 120, difficulty: 'easy', sport: '跳绳', sportEmoji: '⚡',
    xpReward: 30, damage: 30,
  },
  {
    title: '花样跳绳挑战',
    description: '基础跳100下+交叉跳50下+双摇跳30下，从基础到进阶，挑战更高难度！',
    duration: 12, calories: 150, difficulty: 'medium', sport: '跳绳', sportEmoji: '⚡',
    xpReward: 50, damage: 45,
  },
  {
    title: '30秒极速挑战',
    description: '30秒内尽量多跳，记录次数，每次都要挑战自己的最高纪录，超越昨天的自己！',
    duration: 5, calories: 60, difficulty: 'easy', sport: '跳绳', sportEmoji: '⚡',
    xpReward: 30, damage: 25,
  },
  {
    title: '跳绳有氧15分钟',
    description: '持续跳绳15分钟，中间可适当减速恢复，全程保持节奏，坚持就是胜利！',
    duration: 15, calories: 180, difficulty: 'medium', sport: '跳绳', sportEmoji: '⚡',
    xpReward: 50, damage: 50,
  },
  {
    title: '跳绳HIIT训练',
    description: '40秒全力跳+20秒休息，重复10组，高强度间歇燃脂模式开启，全力以赴！',
    duration: 15, calories: 200, difficulty: 'hard', sport: '跳绳', sportEmoji: '⚡',
    xpReward: 80, damage: 80,
  },

  // HIIT
  {
    title: '塔巴塔极限',
    description: '经典4分钟塔巴塔：20秒全力冲刺+10秒休息×8组，4分钟内消耗惊人热量！',
    duration: 8, calories: 120, difficulty: 'hard', sport: 'HIIT', sportEmoji: '🔥',
    xpReward: 80, damage: 75,
  },
  {
    title: '全身燃脂爆破',
    description: '6个动作×50秒，动作间10秒换姿势，共5轮。30分钟燃烧脂肪，不留余地！',
    duration: 30, calories: 340, difficulty: 'hard', sport: 'HIIT', sportEmoji: '🔥',
    xpReward: 80, damage: 90,
  },
  {
    title: '爆发力组合训练',
    description: '波比跳×10+跳跃深蹲×15+冲刺跑30秒，循环4组，全身肌肉全面激活！',
    duration: 20, calories: 260, difficulty: 'hard', sport: 'HIIT', sportEmoji: '🔥',
    xpReward: 80, damage: 85,
  },
  {
    title: '10分钟快速燃脂',
    description: '超高效训练：每个动作1分钟，不休息。10个动作10分钟，没时间？这就是你的解药。',
    duration: 10, calories: 150, difficulty: 'medium', sport: 'HIIT', sportEmoji: '🔥',
    xpReward: 50, damage: 55,
  },
  {
    title: '波比跳百次挑战',
    description: '今日目标：100个波比跳。可以分组完成，但要计时，每次都要挑战更短时间！',
    duration: 18, calories: 230, difficulty: 'hard', sport: 'HIIT', sportEmoji: '🔥',
    xpReward: 80, damage: 90,
  },
]
