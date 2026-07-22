import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import { DEMO_MAX_CUT_GRAPH, runQaoaStatevector } from '../../lib/quantum/qaoa'

type LoopStage = 'params' | 'circuit' | 'cost' | 'optimizer'

const STAGES: { id: LoopStage; label: string }[] = [
  { id: 'params', label: 'Parametreler (γ, β)' },
  { id: 'circuit', label: 'Devre' },
  { id: 'cost', label: 'Maliyet ölçümü' },
  { id: 'optimizer', label: 'Klasik adım' },
]

export function VariationalLoopLab() {
  const [gamma, setGamma] = useState(0.3)
  const [beta, setBeta] = useState(0.4)
  const [stageIdx, setStageIdx] = useState(0)
  const [running, setRunning] = useState(true)
  const [history, setHistory] = useState<{ iter: number; cut: number }[]>([])
  const iterRef = useRef(0)

  const qaoa = runQaoaStatevector(DEMO_MAX_CUT_GRAPH, { gamma: [gamma], beta: [beta] })

  const optimizerStep = useCallback(() => {
    const lr = 0.15
    const dg = (Math.random() - 0.5) * lr
    const db = (Math.random() - 0.5) * lr * 0.8
    setGamma((g) => Math.max(0, Math.min(Math.PI, g + dg)))
    setBeta((b) => Math.max(0, Math.min(Math.PI / 2, b + db)))
    iterRef.current += 1
    setHistory((h) => [...h.slice(-12), { iter: iterRef.current, cut: qaoa.expectedCut }])
  }, [qaoa.expectedCut])

  useEffect(() => {
    if (!running) return
    const stageTimer = window.setInterval(() => {
      setStageIdx((i) => {
        const next = (i + 1) % STAGES.length
        if (next === 0) optimizerStep()
        return next
      })
    }, 900)
    return () => window.clearInterval(stageTimer)
  }, [running, optimizerStep])

  const activeStage = STAGES[stageIdx].id

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Fitness antrenörü gibi: kuantum devre bir deneme yapar (maliyet ölçer), klasik bilgisayar sonuca bakıp γ/β ayarlarını günceller — tekrar dene, tekrar ölç, yavaş yavaş iyileştir."
        steps={[
          'Parametreler (γ, β) devrenin ayar düğmeleridir.',
          'Kuantum devre maliyeti ölçer — bu labda beklenen Max-Cut değeri.',
          'Klasik optimizer sonuca bakıp parametreleri küçük adımlarla günceller.',
          'Döngü tekrarlanır: parametre → devre → maliyet → optimizer.',
          'Bu oyuncak sürüm rastgele arama kullanır; gerçek VQE/QAOA gradyan tabanlı olabilir.',
        ]}
        symbols={[
          { symbol: 'VQE/QAOA', meaning: 'Variational (değişken parametreli) kuantum algoritmaları' },
          { symbol: 'γ, β', meaning: 'Her iterasyonda ayarlanan devre açıları' },
          { symbol: 'Maliyet', meaning: 'Minimize/maximize edilen hedef (burada Max-Cut)' },
        ]}
        example="Başlangıç γ=0.3, β=0.4 ile cut düşük olabilir. Birkaç tur sonra parametreler γ≈0.8, β≈0.6 civarına yaklaşırsa maliyet çubukları yükselir — ama her zaman monoton artış garanti değildir."
        watch="Döngüyü izle: dört aşama sırayla yanar (parametre → devre → maliyet → optimizer). Maliyet geçmişi çubukları yükseliyor mu? Döngüyü duraklatıp birkaç tur sonrası cut değerine bak."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="rounded-lg border border-cyan-electric/30 px-3 py-1.5 text-sm text-cyan-glow"
        >
          {running ? 'Döngüyü duraklat' : 'Devam et'}
        </button>
        <button
          type="button"
          onClick={() => {
            iterRef.current = 0
            setHistory([])
            setGamma(0.3)
            setBeta(0.4)
          }}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-400"
        >
          Sıfırla
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: stageIdx === i ? 1.05 : 1,
                borderColor: stageIdx === i ? 'rgba(34,211,238,0.8)' : 'rgba(51,65,85,0.8)',
                backgroundColor: stageIdx === i ? 'rgba(6,182,212,0.15)' : 'rgba(15,33,55,0.6)',
              }}
              className="rounded-lg border px-3 py-2 text-xs font-medium text-slate-300"
            >
              {s.label}
            </motion.div>
            {i < STAGES.length - 1 && (
              <motion.span
                animate={{ opacity: stageIdx === i ? 1 : 0.3 }}
                className="text-cyan-glow"
              >
                →
              </motion.span>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-lg border border-navy-700 bg-navy-900/70 p-4"
        >
          {activeStage === 'params' && (
            <div className="grid gap-2 font-mono text-sm text-slate-300">
              <p>γ = {gamma.toFixed(3)} rad</p>
              <p>β = {beta.toFixed(3)} rad</p>
              <p className="text-xs text-slate-500">p = 1 katman</p>
            </div>
          )}
          {activeStage === 'circuit' && (
            <div className="space-y-2 text-sm text-slate-300">
              <p>H → Cost(γ) → Mixer(β) → ölçüm hazırlığı</p>
              <div className="flex flex-wrap gap-1 font-mono text-xs text-cyan-glow">
                {['H₀', 'H₁', 'H₂', 'H₃', 'U_C(γ)', 'U_B(β)'].map((g) => (
                  <span key={g} className="rounded border border-cyan-electric/30 px-2 py-1">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
          {activeStage === 'cost' && (
            <p className="text-sm text-slate-300">
              Beklenen Max-Cut:{' '}
              <span className="font-display text-2xl font-semibold text-cyan-glow">
                {qaoa.expectedCut.toFixed(3)}
              </span>
              <span className="text-slate-500"> / {DEMO_MAX_CUT_GRAPH.edges.length}</span>
            </p>
          )}
          {activeStage === 'optimizer' && (
            <p className="text-sm text-slate-300">
              Klasik adım: γ ve β küçük rastgele güncelleme (iterasyon {iterRef.current})
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {history.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-slate-500">Maliyet geçmişi</p>
          <div className="flex h-16 items-end gap-1">
            {history.map((h) => (
              <motion.div
                key={h.iter}
                initial={{ height: 0 }}
                animate={{ height: `${(h.cut / DEMO_MAX_CUT_GRAPH.edges.length) * 100}%` }}
                className="min-w-[8px] flex-1 rounded-t bg-cyan-electric/70"
                title={`iter ${h.iter}: ${h.cut.toFixed(2)}`}
              />
            ))}
          </div>
        </div>
      )}

      <ChallengeTip>
        Döngüyü birkaç tur izle. Maliyet çubukları yükseliyor mu? γ ≈ 0.8, β ≈ 0.6 civarına
        yaklaşınca ne oluyor?
      </ChallengeTip>
    </div>
  )
}
