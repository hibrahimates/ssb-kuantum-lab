import { useCallback, useEffect, useState } from 'react'
import type { TryItSpec } from '../../content/modules/types'
import { runTryIt } from '../../lib/tryit'

interface TryItLabProps {
  spec: TryItSpec
  unlocked?: boolean
}

function TryItLocked() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 text-center md:h-full md:min-h-[12rem]">
      <div>
        <p className="text-sm font-medium text-amber-200">Deneme alanı kilitli</p>
        <p className="mt-1 text-xs text-slate-500">
          Önceki modül quizini %70 ile geçince bu alan açılır.
        </p>
      </div>
    </div>
  )
}

export function TryItLab({ spec, unlocked = true }: TryItLabProps) {
  const [code, setCode] = useState(spec.starter)
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [ran, setRan] = useState(false)

  useEffect(() => {
    setCode(spec.starter)
    setOutput(null)
    setError(null)
    setShowHint(false)
    setRan(false)
  }, [spec.starter, spec.kind])

  const handleRun = useCallback(() => {
    const result = runTryIt(spec.kind, code)
    setRan(true)
    if (result.ok) {
      setOutput(result.output)
      setError(null)
    } else {
      setOutput(null)
      setError(result.error)
    }
  }, [spec.kind, code])

  const handleReset = useCallback(() => {
    setCode(spec.starter)
    setOutput(null)
    setError(null)
    setShowHint(false)
    setRan(false)
  }, [spec.starter])

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-cyan-electric/20 bg-navy-900/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-electric/15 px-4 py-2">
        <h4 className="font-display text-sm font-semibold text-cyan-glow">{spec.title}</h4>
        <div className="flex items-center gap-2">
          <span className="rounded bg-navy-800 px-2 py-0.5 font-mono text-[10px] uppercase text-slate-500">
            {spec.kind}
          </span>
          {unlocked ? (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleRun}
                className="rounded-md bg-cyan-electric/20 px-3 py-1 text-xs font-semibold text-cyan-glow transition-colors hover:bg-cyan-electric/35"
              >
                Çalıştır
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-slate-600/50 px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
              >
                Sıfırla
              </button>
              {spec.hint ? (
                <button
                  type="button"
                  onClick={() => setShowHint((v) => !v)}
                  className="rounded-md border border-slate-600/50 px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
                >
                  İpucu
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-cyan-electric/10 p-4 md:border-b-0 md:border-r">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Kod</p>
          {unlocked ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="h-48 w-full resize-y rounded-lg border border-cyan-electric/10 bg-navy-950/80 p-3 font-mono text-xs leading-relaxed text-slate-300 outline-none focus:border-cyan-electric/30 md:h-full md:min-h-[12rem]"
              aria-label={`${spec.title} kod editörü`}
            />
          ) : (
            <pre className="overflow-x-auto rounded-lg bg-navy-950/80 p-3 font-mono text-xs leading-relaxed text-slate-500">
              {spec.starter}
            </pre>
          )}
        </div>

        <div className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Çıktı</p>
          {!unlocked ? (
            <TryItLocked />
          ) : error ? (
            <pre
              className="h-48 overflow-auto rounded-lg border border-red-500/30 bg-red-950/20 p-3 font-mono text-xs leading-relaxed text-red-300 md:h-full md:min-h-[12rem]"
              role="alert"
            >
              {error}
            </pre>
          ) : output !== null ? (
            <pre className="h-48 overflow-auto rounded-lg border border-cyan-electric/10 bg-navy-950/80 p-3 font-mono text-xs leading-relaxed text-slate-300 md:h-full md:min-h-[12rem]">
              {output}
            </pre>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-700 bg-navy-950/50 text-sm text-slate-500 md:h-full md:min-h-[12rem]">
              {ran ? '(boş çıktı)' : 'Çalıştır — sonuç burada görünür'}
            </div>
          )}
        </div>
      </div>

      {showHint && spec.hint ? (
        <p className="border-t border-cyan-electric/10 px-4 py-2 text-xs text-slate-400">
          <span className="font-semibold text-cyan-electric/70">İpucu:</span> {spec.hint}
        </p>
      ) : null}
    </div>
  )
}
