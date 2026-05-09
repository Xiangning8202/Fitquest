import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed = 25, startDelay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    let timer: ReturnType<typeof setTimeout>

    const start = () => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, speed)
      return interval
    }

    if (startDelay > 0) {
      timer = setTimeout(() => {
        const interval = start()
        return () => clearInterval(interval)
      }, startDelay)
    } else {
      const interval = start()
      return () => clearInterval(interval)
    }

    return () => clearTimeout(timer)
  }, [text, speed, startDelay])

  return { displayed, done }
}
