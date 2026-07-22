import { useEffect, useState } from 'react'
import {
  isDevUnlockActive,
  setDevUnlockActive,
} from '../../lib/devUnlock'

export function UnlockToggle() {
  const [active, setActive] = useState(isDevUnlockActive)

  useEffect(() => {
    const sync = (event: Event) => {
      if (event instanceof CustomEvent && typeof event.detail?.active === 'boolean') {
        setActive(event.detail.active)
        return
      }
      setActive(isDevUnlockActive())
    }
    window.addEventListener('kuantum-lab-dev-unlock', sync)
    return () => window.removeEventListener('kuantum-lab-dev-unlock', sync)
  }, [])

  return (
    <div className="ml-auto flex items-center gap-2 select-none">
      <span className="hidden text-xs font-medium text-slate-500 sm:inline">
        {active ? 'Kilitler açık' : 'Kilitleri aç'}
      </span>
      <span className="text-xs font-medium text-slate-500 sm:hidden">
        {active ? 'Açık' : 'Kilit'}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={active ? 'Kilitleri kapat' : 'Tüm kilitleri aç'}
        onClick={() => setDevUnlockActive(!active)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          active
            ? 'bg-cyan-electric/40'
            : 'bg-navy-800 ring-1 ring-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] shadow transition-transform ${
            active
              ? 'translate-x-5 bg-cyan-glow text-navy-950'
              : 'translate-x-0 bg-slate-500 text-navy-950'
          }`}
        >
          {active ? '✓' : '🔒'}
        </span>
      </button>
    </div>
  )
}
