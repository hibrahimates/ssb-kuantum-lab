import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import { histogramToSortedEntries, sampleComputationalBasis } from '../../lib/quantum/qaoa'
import { applyHadamardAll, type Complex } from '../../lib/quantum/statevector'

function uniformSuperposition(n: number): Complex[] {
  const dim = 1 << n
  const amp = 1 / Math.sqrt(dim)
  let state: Complex[] = [{ re: amp, im: 0 }]
  while (state.length < dim) state.push({ re: amp, im: 0 })
  return state
}

function biasedSuperposition(n: number, biasIdx: number, biasWeight: number): Complex[] {
  let state = uniformSuperposition(n)
  state = applyHadamardAll(state, n)
  const total = state.reduce((s, a) => s + a.re * a.re + a.im * a.im, 0)
  const scale = Math.sqrt(total)
  return state.map((a, idx) => ({
    re: (a.re / scale) * (idx === biasIdx ? biasWeight : 1),
    im: (a.im / scale) * (idx === biasIdx ? biasWeight : 1),
  }))
}

export function ShotHistogramLab() {
  const [shots, setShots] = useState(32)
  const n = 3

  const trueProbs = useMemo(() => {
    const state = biasedSuperposition(n, 5, 1.8)
    return state.map((a) => a.re * a.re + a.im * a.im)
  }, [])

  const hist = useMemo(() => {
    const state = biasedSuperposition(n, 5, 1.8)
    const total = state.reduce((s, a) => s + a.re * a.re + a.im * a.im, 0)
    const normalized = state.map((a) => ({ re: a.re / Math.sqrt(total), im: a.im / Math.sqrt(total) }))
    const raw = sampleComputationalBasis(normalized, shots, n, () => Math.random())
    return histogramToSortedEntries(raw)
  }, [shots])

  const maxTrue = Math.max(...trueProbs)

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="1000 kez zar atmak gibi: tek atış rastgele, ama çok atışta yüzde dağılımı teoriye yaklaşır. Kuantumda her shot bir ölçüm — tek bir bitstring üretir; histogram bu tekrarların sayımıdır."
        steps={[
          'Kuantum devresi bitstring olasılıklarını belirler (teorik çubuklar sağda).',
          'Her shot bir kez ölçüm yapar ve tek sonuç verir — örn. |101⟩.',
          'Aynı shot sayısını tekrarlarsan histogram farklı görünür (örnekleme gürültüsü).',
          'Shot sayısı arttıkça histogram teorik olasılıklara yaklaşır.',
          'Az shot = hızlı ama yanıltıcı; çok shot = yavaş ama güvenilir istatistik.',
        ]}
        symbols={[
          { symbol: 'Shot', meaning: 'Tek bir ölçüm denemesi' },
          { symbol: '|101⟩', meaning: '3 kübitlik ölçüm sonucu (bitstring)' },
          { symbol: 'Born olasılığı', meaning: 'Her sonucun teorik çıkma yüzdesi' },
        ]}
        example="|101⟩ teorik olasılığı en yüksek (~%18 civarı). 32 shot ile histogram dalgalı görünür; 512 ve 2048 shot'ta |101⟩ çubuğu teorik çizgiye oturur."
        watch="Shot kaydırıcısını 32 → 512 → 2048 yap. Sol histogram ile sağdaki teorik olasılık çubuklarını karşılaştır — en yüksek olasılıklı |101⟩ ne zaman teorik değere yaklaşıyor?"
      />

      <label className="mb-4 block max-w-md text-sm">
        <span className="text-slate-300">Shot sayısı: {shots}</span>
        <input
          type="range"
          min={8}
          max={2048}
          step={8}
          value={shots}
          onChange={(e) => setShots(Number(e.target.value))}
          className="mt-1 w-full accent-cyan-electric"
        />
      </label>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-sm font-medium text-white">Örnek histogram</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hist}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f2137', border: '1px solid rgba(6,182,212,0.3)' }}
                  formatter={(v) => [`${v} shot`, 'Sayım']}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-display text-sm font-medium text-white">Teorik olasılıklar</h3>
          <div className="space-y-1.5">
            {trueProbs.map((p, idx) => {
              const label = idx.toString(2).padStart(n, '0')
              return (
                <div key={label}>
                  <div className="mb-0.5 flex justify-between font-mono text-xs">
                    <span className="text-slate-400">|{label}⟩</span>
                    <span className="text-cyan-glow">{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-navy-900">
                    <motion.div
                      className="h-full rounded-full bg-cyan-electric/60"
                      animate={{ width: `${(p / maxTrue) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <ChallengeTip>
        Shot sayısını 32 → 512 → 2048 yap. En yüksek olasılıklı |101⟩ çubuğunun teorik çizgiye
        ne zaman oturduğunu gözle.
      </ChallengeTip>
    </div>
  )
}
