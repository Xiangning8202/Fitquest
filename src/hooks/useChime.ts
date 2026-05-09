import { useCallback } from 'react'

/**
 * 清脆欢快的提示音效，用 Web Audio API 合成，不需要任何音频文件。
 * 每个模式对应一个短促的音符序列（类似 App 通知音 / 游戏得分音）。
 */

interface NoteEvent {
  freq: number   // Hz
  delay: number  // seconds from now
  vol?: number   // 0–1, default 0.28
  dur?: number   // seconds, default 0.45
}

const PATTERNS: Record<string, NoteEvent[]> = {
  // 运动开始 — C5 E5 G5 上行大三和弦，明亮有力
  start: [
    { freq: 523.25, delay: 0,    vol: 0.28 },
    { freq: 659.25, delay: 0.11, vol: 0.26 },
    { freq: 783.99, delay: 0.22, vol: 0.24 },
  ],
  // 进入主运动 — E5 G5 C6 更高阶的上行，充满能量
  phaseMain: [
    { freq: 659.25,  delay: 0,    vol: 0.28 },
    { freq: 783.99,  delay: 0.11, vol: 0.26 },
    { freq: 1046.50, delay: 0.22, vol: 0.24 },
  ],
  // 进入放松 — G5 E5 C5 下行，舒缓柔和
  phaseCooldown: [
    { freq: 783.99, delay: 0,    vol: 0.22 },
    { freq: 659.25, delay: 0.12, vol: 0.20 },
    { freq: 523.25, delay: 0.24, vol: 0.18 },
  ],
  // 过半提醒 — 两声 C6 清脆双响
  half: [
    { freq: 1046.50, delay: 0,   vol: 0.25, dur: 0.3 },
    { freq: 1046.50, delay: 0.22, vol: 0.22, dur: 0.3 },
  ],
  // 最后一分钟 — G5 A5 G5 急促三连，紧迫感
  lastMin: [
    { freq: 783.99, delay: 0,    vol: 0.30, dur: 0.25 },
    { freq: 880.00, delay: 0.13, vol: 0.30, dur: 0.25 },
    { freq: 783.99, delay: 0.26, vol: 0.28, dur: 0.25 },
  ],
  // 最后10秒 — C6 单声高频清脆，简洁
  tenSec: [
    { freq: 1046.50, delay: 0, vol: 0.30, dur: 0.20 },
  ],
  // 任务完成 — C5 E5 G5 C6 四音上行琶音，庆祝感
  done: [
    { freq: 523.25,  delay: 0,    vol: 0.28 },
    { freq: 659.25,  delay: 0.10, vol: 0.28 },
    { freq: 783.99,  delay: 0.20, vol: 0.28 },
    { freq: 1046.50, delay: 0.30, vol: 0.30, dur: 0.6 },
  ],
  // 暂停 — E5 C5 下行，柔和告别
  pause: [
    { freq: 659.25, delay: 0,    vol: 0.20, dur: 0.30 },
    { freq: 523.25, delay: 0.16, vol: 0.18, dur: 0.30 },
  ],
  // 继续 — C5 E5 上行，重新出发
  resume: [
    { freq: 523.25, delay: 0,    vol: 0.22, dur: 0.30 },
    { freq: 659.25, delay: 0.16, vol: 0.24, dur: 0.30 },
  ],
  // 我累了 — G4 单声偏低，温和回应
  tired: [
    { freq: 392.00, delay: 0, vol: 0.18, dur: 0.40 },
  ],
}

export type ChimePattern = keyof typeof PATTERNS

export function useChime() {
  const play = useCallback((pattern: ChimePattern) => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    const notes = PATTERNS[pattern] ?? PATTERNS.start

    notes.forEach(({ freq, delay, vol = 0.28, dur = 0.45 }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(gain)
      gain.connect(ctx.destination)

      const when = ctx.currentTime + delay
      // Sharp attack (8 ms) → exponential decay → silence
      gain.gain.setValueAtTime(0, when)
      gain.gain.linearRampToValueAtTime(vol, when + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.001, when + dur)

      osc.start(when)
      osc.stop(when + dur + 0.01)
    })

    // Release the AudioContext after all notes finish
    const lastEnd = Math.max(...notes.map(n => n.delay + (n.dur ?? 0.45))) + 0.1
    setTimeout(() => ctx.close(), lastEnd * 1000 + 200)
  }, [])

  return { play }
}
