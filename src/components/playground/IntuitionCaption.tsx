import type { ReactNode } from 'react'

export function IntuitionCaption({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 rounded-lg border border-cyan-electric/20 bg-navy-900/50 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-cyan-glow/80">Ne oluyor?</p>
      <p className="mt-1 text-sm text-slate-300">{children}</p>
    </div>
  )
}
