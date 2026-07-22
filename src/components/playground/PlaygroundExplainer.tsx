export type PlaygroundExplainerProps = {
  title?: string
  analogy: string
  steps: string[]
  symbols?: { symbol: string; meaning: string }[]
  example?: string
  watch: string
}

export function PlaygroundExplainer({
  title = 'Bu lab ne anlatıyor?',
  analogy,
  steps,
  symbols,
  example,
  watch,
}: PlaygroundExplainerProps) {
  const hasDetails = (symbols && symbols.length > 0) || example

  return (
    <div className="mb-4 rounded-lg border border-cyan-electric/25 bg-navy-900/60">
      <div className="px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-cyan-glow/80">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">{analogy}</p>

        <ol className="mt-3 space-y-1.5 text-sm text-slate-300">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-electric/15 text-xs font-medium text-cyan-glow">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-3 rounded-md border border-cyan-electric/15 bg-navy-950/50 px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-cyan-glow/70">Kaydırınca ne olur?</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{watch}</p>
        </div>
      </div>

      {hasDetails && (
        <details className="group border-t border-cyan-electric/10">
          <summary className="cursor-pointer list-none px-4 py-2 text-xs font-medium text-cyan-glow/90 transition-colors hover:bg-cyan-electric/5 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-cyan-electric/60 transition-transform group-open:rotate-90">▶</span>
              Daha fazla açıkla
            </span>
          </summary>
          <div className="space-y-3 px-4 pb-3 pt-1">
            {symbols && symbols.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Semboller
                </p>
                <dl className="space-y-1">
                  {symbols.map(({ symbol, meaning }) => (
                    <div key={symbol} className="flex gap-2 text-sm">
                      <dt className="shrink-0 font-mono text-cyan-glow">{symbol}</dt>
                      <dd className="text-slate-400">{meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {example && (
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Sayısal örnek
                </p>
                <p className="text-sm leading-relaxed text-slate-300">{example}</p>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  )
}
