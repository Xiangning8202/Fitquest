import { useRef, useCallback } from 'react'

interface Beat { f: number; v: number; t: OscillatorType; d: number }

// Each mode: bpm + a beat sequence that loops
const PATTERNS: Record<string, { bpm: number; seq: Beat[] }> = {
  stretch: {
    bpm: 55,
    seq: [
      { f: 261.63, v: 0.09, t: 'sine', d: 0.75 },
      { f: 0,      v: 0,    t: 'sine', d: 0    },
      { f: 329.63, v: 0.07, t: 'sine', d: 0.65 },
      { f: 0,      v: 0,    t: 'sine', d: 0    },
    ],
  },
  walk: {
    bpm: 82,
    seq: [
      { f: 160, v: 0.18, t: 'triangle', d: 0.14 },
      { f: 392, v: 0.07, t: 'sine',     d: 0.09 },
      { f: 160, v: 0.13, t: 'triangle', d: 0.11 },
      { f: 392, v: 0.07, t: 'sine',     d: 0.09 },
    ],
  },
  burn: {
    bpm: 128,
    seq: [
      { f: 85,  v: 0.26, t: 'square',   d: 0.07 },
      { f: 440, v: 0.10, t: 'sawtooth', d: 0.04 },
      { f: 85,  v: 0.20, t: 'square',   d: 0.06 },
      { f: 660, v: 0.10, t: 'sawtooth', d: 0.04 },
    ],
  },
  focus: {
    bpm: 90,
    seq: [
      { f: 174.61, v: 0.12, t: 'sine', d: 0.22 },
      { f: 0,      v: 0,    t: 'sine', d: 0    },
      { f: 261.63, v: 0.08, t: 'sine', d: 0.15 },
      { f: 0,      v: 0,    t: 'sine', d: 0    },
    ],
  },
}

export function useMusicPlayer() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const nextTimeRef = useRef(0)
  const beatIdxRef = useRef(0)
  const modeRef = useRef('focus')

  const fireBeat = useCallback(
    (ctx: AudioContext, master: GainNode, beat: Beat, when: number) => {
      if (beat.f === 0 || beat.v === 0) return
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = beat.t
      osc.frequency.value = beat.f
      osc.connect(g)
      g.connect(master)
      g.gain.setValueAtTime(0, when)
      g.gain.linearRampToValueAtTime(beat.v, when + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, when + beat.d)
      osc.start(when)
      osc.stop(when + beat.d + 0.01)
    },
    []
  )

  const stop = useCallback(() => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current)
      tickerRef.current = null
    }
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.linearRampToValueAtTime(
        0,
        ctxRef.current.currentTime + 0.25
      )
    }
    setTimeout(() => {
      ctxRef.current?.close()
      ctxRef.current = null
      masterRef.current = null
    }, 300)
  }, [])

  const start = useCallback(
    (mode: string) => {
      // Tear down any previous context first
      if (tickerRef.current) clearInterval(tickerRef.current)
      ctxRef.current?.close()

      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      const ctx = new AudioCtx()
      const master = ctx.createGain()
      master.gain.setValueAtTime(0, ctx.currentTime)
      master.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.4)
      master.connect(ctx.destination)

      ctxRef.current = ctx
      masterRef.current = master
      modeRef.current = mode
      nextTimeRef.current = ctx.currentTime + 0.05
      beatIdxRef.current = 0

      const tick = () => {
        const c = ctxRef.current
        const m = masterRef.current
        if (!c || !m) return
        const pat = PATTERNS[modeRef.current] ?? PATTERNS.focus
        const beatDur = 60 / pat.bpm

        while (nextTimeRef.current < c.currentTime + 0.15) {
          const idx = beatIdxRef.current % pat.seq.length
          fireBeat(c, m, pat.seq[idx], nextTimeRef.current)
          nextTimeRef.current += beatDur
          beatIdxRef.current++
        }
      }

      tick()
      tickerRef.current = setInterval(tick, 30)
    },
    [fireBeat]
  )

  // Switch mode without restarting the context
  const setMode = useCallback((mode: string) => {
    modeRef.current = mode
  }, [])

  return { start, stop, setMode }
}
