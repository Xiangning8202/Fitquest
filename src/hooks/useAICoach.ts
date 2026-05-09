import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Voice selection ──────────────────────────────────────────────────────────

// Keywords to match, in preference order.
// Microsoft "Online (Natural)" voices > Google > Apple > anything zh-CN
const VOICE_KEYWORDS = [
  'Xiaoxiao',       // Microsoft Edge natural zh voice (best quality)
  'Yunxi',          // Microsoft Edge natural zh voice
  'Yunyang',        // Microsoft Edge natural zh voice
  'Google 普通话',  // Chrome on Windows/Android
  'Google 中文',    // Chrome alternative
  'Tingting',       // Apple / Safari macOS
  'Mei-Jia',        // Apple / Safari macOS
  'Sin-ji',         // Apple Cantonese (fallback)
]

function selectBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null

  for (const kw of VOICE_KEYWORDS) {
    const v = voices.find(v => v.name.includes(kw))
    if (v) return v
  }
  // Fallback: any zh-CN → any zh → first available
  return (
    voices.find(v => v.lang === 'zh-CN') ??
    voices.find(v => v.lang.startsWith('zh')) ??
    voices[0] ??
    null
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const isBrowserSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window

export function useAICoach() {
  const [voiceOn, setVoiceOn] = useState(true)
  const voiceOnRef = useRef(true) // keep ref in sync for closures
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  // Voices may load asynchronously – pre-select the best one
  useEffect(() => {
    if (!isBrowserSupported) return
    const load = () => { voiceRef.current = selectBestVoice() }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = useCallback((text: string) => {
    if (!isBrowserSupported || !voiceOnRef.current) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'zh-CN'
    utt.rate = 0.92   // natural conversational speed
    utt.pitch = 1.0   // keep default pitch – avoids robotic high-pitch
    utt.volume = 1.0
    const voice = voiceRef.current ?? selectBestVoice()
    if (voice) utt.voice = voice
    window.speechSynthesis.speak(utt)
  }, [])

  const cancel = useCallback(() => {
    if (isBrowserSupported) window.speechSynthesis.cancel()
  }, [])

  const toggleVoice = useCallback(() => {
    const next = !voiceOnRef.current
    voiceOnRef.current = next
    setVoiceOn(next)
    if (!next && isBrowserSupported) window.speechSynthesis.cancel()
  }, [])

  return { speak, cancel, toggleVoice, voiceOn, supported: isBrowserSupported }
}

// ─── Coach script library ─────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const COACH_LINES = {
  warmupStart: () => pick([
    '好，热身开始。先慢慢活动一下关节，肩膀、手腕、膝盖都转一转，让血液流动起来。',
    '开始热身吧。深吸一口气，放松全身，用轻柔的动作慢慢唤醒身体，不要着急。',
    '热身很重要，别跳过它。先让肌肉温热，能有效避免受伤，跟着节奏来就好。',
    '来，我们先热身。活动关节，甩甩手臂，感受身体开始发热，这就是状态在来了。',
  ]),
  mainStart: () => pick([
    '热身完成，进入主运动。现在是关键时刻，保持节奏，注意呼吸，动作稳一点。',
    '正式开始。记住，质量比速度重要，控制好每个动作，感受肌肉在发力。',
    '主运动开始，状态来了！找到自己的节奏，不用管别人，专注在自己的感受上。',
    '进入主运动。吸气准备，呼气发力。坚持下去，汗水就是进步的证明。',
  ]),
  cooldownStart: () => pick([
    '最难的部分过去了。现在开始放松，慢慢拉伸，让肌肉舒展，享受这个过程。',
    '主运动完成，做得很好！放松阶段开始，深呼吸，感受身体慢慢降温。',
    '进入放松整理，不要跳过这个环节。好好拉伸能减少明天的酸痛感。',
    '棒！现在放松。闭上眼睛，深呼吸三次，让心率慢慢恢复，感受运动后的满足。',
  ]),
  start: (phaseName: string) => pick([
    `${phaseName}开始，调整好呼吸，我们一步一步来。`,
    `进入${phaseName}，保持专注，感受身体的变化。`,
  ]),
  phaseChange: (from: string, to: string) => pick([
    `${from}完成，干得漂亮！稍微调整一下，准备进入${to}。`,
    `${from}结束，你坚持下来了！接下来是${to}，继续保持这个状态。`,
    `很好，${from}顺利完成。${to}马上开始，深呼吸，准备好了吗？`,
  ]),
  halfTime: () => pick([
    '已经过半了！你正在做到很多人坚持不下来的事，继续保持这个劲儿。',
    '中场到了，可以稍微喝口水，调整一下呼吸，后半程同样重要。',
    '一半完成，状态不错。保持节奏，不要加速也不要减速，就这样匀速跑完。',
    '过半了！记住你为什么开始运动，带着这个动力完成剩下的部分。',
  ]),
  lastMinute: () => pick([
    '最后一分钟！深呼吸，全力以赴，完成这最后一段，你就赢了。',
    '倒计时一分钟。坚持！完成这一段，你就为小队贡献了宝贵的 Boss 伤害。',
    '还剩最后一分钟，这是最考验意志力的时刻。别放弃，胜利就在前面。',
    '最后冲刺！想象你击中 Boss 的那一刻，把剩余的能量全部燃烧掉。',
  ]),
  tenSeconds: () => pick([
    '最后十秒，加油！',
    '十秒，坚持住！',
    '快到了，不要停！',
  ]),
  pause: () => pick([
    '已暂停。喝口水，调整一下呼吸，别让身体冷却太久哦。',
    '休息一下，补充水分，随时准备好了就继续。',
    '暂停了。如果只是需要喝水，很好；准备好了随时继续。',
  ]),
  resume: () => pick([
    '继续！深吸一口气，找回节奏，你已经付出了这么多，值得坚持到最后。',
    '重新开始。不管之前怎样，从现在这一秒，全力以赴。',
    '欢迎回来，状态调整好了吗？我们接着来。',
  ]),
  tired: () => pick([
    '听到了，先喘口气没关系。休息几秒，调整呼吸，然后我们继续，你能行的。',
    '累了很正常，这说明你在认真练！稍微降低强度，但不要完全停，慢慢来。',
    '感觉到累，是因为你在突破自己的极限。深呼吸，放松一点，不要和身体对抗。',
    '稍微休息一下。运动本来就是辛苦的，哪怕慢一点也比停下来强，继续吧。',
  ]),
  done: (xp: number, damage: number) => pick([
    `任务完成！你获得了 ${xp} 点经验值，同时为小队 Boss 战造成了 ${damage} 点伤害。今天的你，比昨天更强。`,
    `完成了，你做到了！${xp} 点经验到手，Boss 被你打了 ${damage} 点。这就是坚持运动的力量。`,
    `厉害！运动结束，收获满满。${xp} 经验值，${damage} 点 Boss 伤害，全是你拼来的。去跟队友说你没让他们失望！`,
  ]),
}
