import { useEffect, useState } from 'react'
import { PROGRESS_EVENT } from '../lib/progress'

/** Progress / kilit değişince bileşeni yeniden çiz. */
export function useProgressTick(): number {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1)
    window.addEventListener(PROGRESS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return tick
}
