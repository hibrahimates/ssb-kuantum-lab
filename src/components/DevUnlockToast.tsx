import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { isDevUnlockActive } from '../lib/devUnlock'

export function DevUnlockToast() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const onToggle = (event: Event) => {
      const active =
        event instanceof CustomEvent
          ? Boolean((event as CustomEvent<{ active: boolean }>).detail?.active)
          : isDevUnlockActive()
      setMessage(active ? 'Tüm kilitler açıldı' : 'Kilitler ilerlemeye göre geri alındı')
    }
    window.addEventListener('kuantum-lab-dev-unlock', onToggle)
    return () => window.removeEventListener('kuantum-lab-dev-unlock', onToggle)
  }, [])

  useEffect(() => {
    if (!message) return
    const id = window.setTimeout(() => setMessage(null), 2200)
    return () => window.clearTimeout(id)
  }, [message])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-lg border border-cyan-electric/30 bg-navy-900/95 px-4 py-2 text-sm text-cyan-glow shadow-lg backdrop-blur-md"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
