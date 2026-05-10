import { motion } from 'framer-motion'

export type MascotVariant = 'idle' | 'running' | 'celebrating'

interface MascotProps {
  variant?: MascotVariant
  size?: number
  className?: string
}

// Shared palette (picks up CSS variables at runtime)
const B  = 'var(--mascot-body)'
const BL = 'var(--mascot-belly)'
const SH = 'var(--mascot-shoe)'
const EW = 'oklch(96% 0.006 280)'   // eye white (slightly purple-tinted)
const EP = 'oklch(12% 0.015 280)'   // eye pupil
const CK = 'oklch(70% 0.18 340 / 0.35)' // cheek blush

// ── Idle ─────────────────────────────────────────────────────────────────────
function IdlePaths() {
  return (
    <>
      {/* Ears */}
      <ellipse cx="22" cy="20" rx="10" ry="13" fill={B} />
      <ellipse cx="58" cy="20" rx="10" ry="13" fill={B} />
      <ellipse cx="22" cy="21" rx="6"  ry="8"  fill={BL} opacity=".55" />
      <ellipse cx="58" cy="21" rx="6"  ry="8"  fill={BL} opacity=".55" />
      {/* Head */}
      <circle cx="40" cy="44" r="28" fill={B} />
      {/* Belly on head (chin area) */}
      <ellipse cx="40" cy="55" rx="14" ry="10" fill={BL} opacity=".45" />
      {/* Eyes */}
      <circle cx="30" cy="40" r="7" fill={EW} />
      <circle cx="50" cy="40" r="7" fill={EW} />
      <circle cx="31" cy="41" r="4" fill={EP} />
      <circle cx="51" cy="41" r="4" fill={EP} />
      {/* Shine */}
      <circle cx="33" cy="39" r="1.8" fill={EW} />
      <circle cx="53" cy="39" r="1.8" fill={EW} />
      {/* Cheeks */}
      <ellipse cx="22" cy="48" rx="5" ry="3" fill={CK} />
      <ellipse cx="58" cy="48" rx="5" ry="3" fill={CK} />
      {/* Smile — slight, expectant */}
      <path d="M33 52 Q40 57 47 52" stroke={EP} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="40" cy="82" rx="22" ry="20" fill={B} />
      <ellipse cx="40" cy="88" rx="12" ry="12" fill={BL} opacity=".45" />
      {/* Feet */}
      <ellipse cx="28" cy="100" rx="11" ry="6" fill={SH} />
      <ellipse cx="52" cy="100" rx="11" ry="6" fill={SH} />
    </>
  )
}

// ── Running ──────────────────────────────────────────────────────────────────
function RunningPaths() {
  return (
    <>
      {/* Ears — angled back */}
      <ellipse cx="20" cy="14" rx="8" ry="12" fill={B} transform="rotate(-15 20 14)" />
      <ellipse cx="54" cy="12" rx="8" ry="12" fill={B} transform="rotate(-15 54 12)" />
      <ellipse cx="20" cy="15" rx="4.5" ry="7" fill={BL} opacity=".55" transform="rotate(-15 20 15)" />
      <ellipse cx="54" cy="13" rx="4.5" ry="7" fill={BL} opacity=".55" transform="rotate(-15 54 13)" />
      {/* Head — tilted forward */}
      <circle cx="42" cy="40" r="26" fill={B} />
      {/* Eyes — squinting slightly with effort */}
      <circle cx="33" cy="37" r="6.5" fill={EW} />
      <circle cx="51" cy="37" r="6.5" fill={EW} />
      <circle cx="34" cy="38" r="3.5" fill={EP} />
      <circle cx="52" cy="38" r="3.5" fill={EP} />
      <circle cx="35" cy="36" r="1.5" fill={EW} />
      <circle cx="53" cy="36" r="1.5" fill={EW} />
      {/* Determined mouth */}
      <path d="M35 49 Q42 52 49 49" stroke={EP} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Cheeks */}
      <ellipse cx="25" cy="44" rx="4.5" ry="2.5" fill={CK} />
      <ellipse cx="59" cy="44" rx="4.5" ry="2.5" fill={CK} />
      {/* Body — leaning */}
      <ellipse cx="40" cy="78" rx="18" ry="17" fill={B} transform="rotate(-8 40 78)" />
      {/* Arms */}
      <path d="M26 68 Q16 60 18 52" stroke={B} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M54 72 Q64 78 66 68" stroke={B} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* Feet — stride */}
      <ellipse cx="24" cy="96" rx="12" ry="6" fill={SH} transform="rotate(-15 24 96)" />
      <ellipse cx="54" cy="100" rx="12" ry="6" fill={SH} transform="rotate(10 54 100)" />
    </>
  )
}

// ── Celebrating ───────────────────────────────────────────────────────────────
function CelebratingPaths() {
  return (
    <>
      {/* Ears — perked up */}
      <ellipse cx="22" cy="16" rx="10" ry="14" fill={B} />
      <ellipse cx="58" cy="16" rx="10" ry="14" fill={B} />
      <ellipse cx="22" cy="17" rx="6"  ry="8"  fill={BL} opacity=".55" />
      <ellipse cx="58" cy="17" rx="6"  ry="8"  fill={BL} opacity=".55" />
      {/* Head */}
      <circle cx="40" cy="43" r="27" fill={B} />
      {/* Happy squinting eyes */}
      <path d="M24 39 Q30 33 36 39" stroke={EP} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 39 Q50 33 56 39" stroke={EP} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Big smile */}
      <path d="M28 52 Q40 63 52 52" stroke={EP} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Cheeks — flushed with joy */}
      <ellipse cx="22" cy="48" rx="6" ry="4" fill={CK} />
      <ellipse cx="58" cy="48" rx="6" ry="4" fill={CK} />
      {/* Body */}
      <ellipse cx="40" cy="80" rx="20" ry="18" fill={B} />
      {/* Arms raised */}
      <path d="M24 70 Q12 54 16 42" stroke={B} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M56 70 Q68 54 64 42" stroke={B} strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="30" cy="97" rx="11" ry="6" fill={SH} />
      <ellipse cx="50" cy="97" rx="11" ry="6" fill={SH} />
      {/* Star sparkles */}
      <g stroke={SH} strokeWidth="2" strokeLinecap="round">
        <line x1="10" y1="30" x2="10" y2="38" />
        <line x1="6"  y1="34" x2="14" y2="34" />
        <line x1="70" y1="20" x2="70" y2="28" />
        <line x1="66" y1="24" x2="74" y2="24" />
        <line x1="14" y1="12" x2="16" y2="18" />
        <line x1="11" y1="15" x2="19" y2="15" />
      </g>
    </>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

const ANIM: Record<MascotVariant, object> = {
  idle: {
    animate: { y: [0, -3, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 },
  },
  running: {
    animate: { rotate: [-2, 2, -2], y: [0, -2, 0] },
    transition: { duration: 0.4, repeat: Infinity, ease: 'easeInOut' },
  },
  celebrating: {
    animate: { y: [0, -6, 0], rotate: [-4, 4, -4] },
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.1 },
  },
}

export function Mascot({ variant = 'idle', size = 80, className = '' }: MascotProps) {
  const anim = ANIM[variant]

  return (
    <motion.svg
      viewBox="0 0 80 108"
      width={size}
      height={Math.round(size * 1.35)}
      className={`select-none ${className}`}
      style={{ overflow: 'visible' }}
      {...anim}
    >
      {variant === 'idle'        && <IdlePaths />}
      {variant === 'running'     && <RunningPaths />}
      {variant === 'celebrating' && <CelebratingPaths />}
    </motion.svg>
  )
}
