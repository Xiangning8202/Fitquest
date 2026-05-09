import { motion } from 'framer-motion'

/** 每种颜色对应一个运动主题的平面 emoji */
const EMOJI: Record<string, string> = {
  purple: '🏋️',
  blue:   '🏃',
  green:  '🧘',
  orange: '🚴',
  pink:   '🤸',
  teal:   '🏊',
}

const BG: Record<string, string> = {
  purple: 'bg-purple-500',
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  orange: 'bg-orange-500',
  pink:   'bg-pink-500',
  teal:   'bg-teal-500',
}

/** 每种颜色有不同延迟，防止所有头像同步弹跳 */
const DELAY: Record<string, number> = {
  purple: 0,
  blue:   0.5,
  green:  1.0,
  orange: 0.25,
  pink:   0.75,
  teal:   1.25,
}

interface AvatarIconProps {
  /** 头像颜色 id，对应颜色和 emoji */
  color: string
  /** Tailwind 尺寸类，例如 "w-8 h-8" */
  className?: string
  /** 是否播放悬浮动画，默认 true */
  animate?: boolean
}

export function AvatarIcon({ color, className = 'w-10 h-10', animate = true }: AvatarIconProps) {
  const emoji = EMOJI[color] ?? '🏋️'
  const bg = BG[color] ?? 'bg-purple-500'
  const delay = DELAY[color] ?? 0

  return (
    <div className={`${bg} ${className} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}>
      <motion.span
        animate={animate ? { y: [0, -3, 0, -1.5, 0] } : {}}
        transition={animate ? {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
          repeatDelay: 0.5,
        } : {}}
        className="leading-none select-none"
        style={{ fontSize: '62%' }}
      >
        {emoji}
      </motion.span>
    </div>
  )
}

/** 颜色→背景 class（其他地方仍需要时可直接用） */
export const AVATAR_BG: Record<string, string> = BG
