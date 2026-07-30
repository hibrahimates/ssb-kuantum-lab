import { useEffect, useState } from 'react'
import {
  THEMES,
  applyTheme,
  getStoredTheme,
  type ThemeId,
} from '../../lib/theme'

export function ThemePicker() {
  const [theme, setTheme] = useState<ThemeId>(() => getStoredTheme())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-cyan-electric/20 bg-navy-800/50 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-electric/40 hover:text-cyan-glow"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Tema seç"
      >
        Tema
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Menüyü kapat"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-cyan-electric/20 bg-navy-900 py-1 shadow-xl"
          >
            {THEMES.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={theme === opt.id}
                  onClick={() => {
                    setTheme(opt.id)
                    setOpen(false)
                  }}
                  className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-navy-800 ${
                    theme === opt.id ? 'bg-cyan-electric/10' : ''
                  }`}
                >
                  <span className="text-sm font-medium text-white">{opt.label}</span>
                  <span className="text-[11px] text-slate-500">{opt.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}
