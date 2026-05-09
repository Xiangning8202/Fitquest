import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Mode = 'android' | 'ios' | null

export function InstallPrompt() {
  const [mode, setMode] = useState<Mode>(null)
  const [prompt, setPrompt] = useState<Event | null>(null)

  useEffect(() => {
    // Already installed as PWA — don't show
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // User previously dismissed
    if (localStorage.getItem('fq-install-dismissed')) return

    // Chrome / Android: browser fires this when PWA is installable
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      setMode('android')
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    // iOS Safari: no beforeinstallprompt, show manual instructions after 4 s
    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|Chrome/.test(ua)
    if (isIOS && isSafari) {
      const t = setTimeout(() => setMode('ios'), 4000)
      return () => { clearTimeout(t); window.removeEventListener('beforeinstallprompt', onPrompt) }
    }

    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    ;(prompt as any).prompt()
    await (prompt as any).userChoice
    setMode(null)
    setPrompt(null)
  }

  const handleDismiss = () => {
    setMode(null)
    localStorage.setItem('fq-install-dismissed', '1')
  }

  return (
    <AnimatePresence>
      {mode && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed-in-frame fixed bottom-20 left-3 right-3 z-50 bg-gray-900 border border-purple-500/30 rounded-2xl p-4 shadow-2xl"
          style={{ bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl flex-shrink-0">🏋️</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">添加到主屏幕</p>
              {mode === 'ios' ? (
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                  点击底部的 <span className="text-white font-medium">分享 □↑</span> 按钮，然后选择「添加到主屏幕」，像原生 App 一样使用。
                </p>
              ) : (
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                  安装到桌面，全屏使用，支持离线运行。
                </p>
              )}
            </div>
            <button onClick={handleDismiss} className="text-gray-500 text-lg flex-shrink-0 leading-none">✕</button>
          </div>
          {mode === 'android' && (
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm font-medium"
              >
                稍后
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold"
              >
                立即安装
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
