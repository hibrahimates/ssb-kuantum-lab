type CalloutVariant = 'info' | 'tip' | 'warning'

interface CalloutProps {
  variant?: CalloutVariant
  title?: string
  children: React.ReactNode
}

const styles: Record<CalloutVariant, string> = {
  info: 'border-cyan-electric/30 bg-cyan-electric/5 text-cyan-100',
  tip: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-100',
  warning: 'border-amber-500/30 bg-amber-500/5 text-amber-100',
}

export function Callout({ variant = 'info', title, children }: CalloutProps) {
  return (
    <aside className={`my-4 rounded-lg border-l-4 p-4 ${styles[variant]}`}>
      {title && <p className="mb-1 text-sm font-semibold">{title}</p>}
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </aside>
  )
}
