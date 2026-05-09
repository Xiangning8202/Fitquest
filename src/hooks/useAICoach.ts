import { useCallback } from 'react'

const supported =
  typeof window !== 'undefined' && 'speechSynthesis' in window

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang.startsWith('zh')) ??
    voices.find(v => v.lang.startsWith('en')) ??
    voices[0] ??
    null
  )
}

export function useAICoach() {
  const speak = useCallback((text: string) => {
    if (!supported) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'zh-CN'
    utt.rate = 0.88
    utt.pitch = 1.05
    utt.volume = 0.9
    const voice = pickVoice()
    if (voice) utt.voice = voice
    window.speechSynthesis.speak(utt)
  }, [])

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
  }, [])

  return { speak, cancel, supported }
}

export const COACH_LINES = {
  start: (phaseName: string) => `运动开始，先完成${phaseName}阶段，保持轻松节奏。`,
  phaseChange: (from: string, to: string) => `${from}完成，进入${to}阶段，继续加油！`,
  halfTime: '已经完成一半了，保持舒适节奏，你做得很好。',
  lastMinute: '还剩最后一分钟，完成后将为小队贡献 Boss 伤害，冲刺！',
  tired: '如果今天状态不好，切换轻量版本也完全可以。重要的是坚持运动。',
  done: (xp: number, damage: number) =>
    `任务完成！获得 ${xp} 经验值，并为小队造成 ${damage} 点 Boss 伤害，你是小队的英雄！`,
}
