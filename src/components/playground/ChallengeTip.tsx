import type { ReactNode } from 'react'

export function ChallengeTip({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-amber-400/25 bg-amber-400/5 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-300/90">Meydan okuma</p>
      <p className="mt-1 text-sm text-slate-300">{children}</p>
    </div>
  )
}
