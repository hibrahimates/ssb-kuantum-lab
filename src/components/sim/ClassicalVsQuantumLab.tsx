import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import {
  bestClassicalQubo,
  bitsToLabel,
  enumerateBitstrings,
  maxCutToQubo,
  maxCutValue,
  type UnweightedGraph,
} from '../../lib/quantum/qubo'
import {
  histogramToSortedEntries,
  runQaoaStatevector,
  sampleComputationalBasis,
} from '../../lib/quantum/qaoa'

const GRAPH: UnweightedGraph = {
  nodes: 3,
  edges: [
    [0, 1],
    [1, 2],
    [2, 0],
  ],
}

const ALL_CONFIGS = enumerateBitstrings(GRAPH.nodes)
const Q = maxCutToQubo(GRAPH)
const OPTIMUM = bestClassicalQubo(Q, GRAPH)

export function ClassicalVsQuantumLab() {
  const [classicalIdx, setClassicalIdx] = useState(0)
  const [running, setRunning] = useState(true)
  const [gamma, setGamma] = useState(0.9)
  const [beta, setBeta] = useState(0.5)

  const currentBits = ALL_CONFIGS[classicalIdx]
  const currentCut = maxCutValue(GRAPH, currentBits)

  const qaoa = useMemo(
    () => runQaoaStatevector(GRAPH, { gamma: [gamma], beta: [beta] }),
    [gamma, beta],
  )

  const hist = useMemo(() => {
    const raw = sampleComputationalBasis(qaoa.state, 256, GRAPH.nodes)
    return histogramToSortedEntries(raw).map((e) => ({
      ...e,
      cut: maxCutValue(GRAPH, e.label.split('').map(Number)),
    }))
  }, [qaoa.state])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setClassicalIdx((i) => (i + 1) % ALL_CONFIGS.length)
    }, 700)
    return () => window.clearInterval(id)
  }, [running])

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Labirentte klasik arama tek tek yolları sırayla dener; QAOA ise birçok yolu aynı anda olasılıklı ağırlıklandırır — ama yine de en iyi yolu garanti etmez, iyi yollara şans verir."
        steps={[
          'Klasik tarama 2ⁿ bitstringi sırayla dener (bu labda 8 adet) — her adımda bir cut hesaplar.',
          'QAOA kuantum devresiyle olasılık dağılımı üretir; histogram hangi bitstringlerin sık çıktığını gösterir.',
          'γ ve β açıları dağılımı eğer — iyi kesimlerin payını artırabilir veya azaltabilir.',
          'Klasik yöntem küçük n için kesin optimumu bulur; QAOA heuristik bir yaklaşımdır.',
          'Yarışma bağlamında: QAOA hızlı aday üretir, klasik doğrulama ve ceza ayarı hâlâ kritiktir.',
        ]}
        symbols={[
          { symbol: 'Brute-force', meaning: 'Tüm olası bitstringleri tek tek deneme' },
          { symbol: 'γ, β', meaning: 'QAOA cost ve mixer açıları' },
          { symbol: 'Beklenen cut', meaning: 'Olasılıklarla ağırlıklı ortalama kesim değeri' },
        ]}
        example="3 düğümlü üçgende 8 bitstring var. Klasik tarama hepsini gezerken optimum cut=2 bulunur. QAOA doğru γ/β ile histogramda optimum bitstringin payı artar ama her zaman %100 olmayabilir."
        watch="Sol panelde klasik taramanın sırayla tüm bitstringleri gezdiğini izle. Sağda γ/β kaydır — QAOA histogramında optimum bitstringin çubuğu büyüyor mu? Klasik tarama hâlâ tüm uzayı geziyor mu?"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-300">γ = {gamma.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={Math.PI}
            step={0.05}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            className="mt-1 w-full accent-cyan-electric"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-300">β = {beta.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={Math.PI / 2}
            step={0.05}
            value={beta}
            onChange={(e) => setBeta(Number(e.target.value))}
            className="mt-1 w-full accent-cyan-electric"
          />
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-navy-700 bg-navy-900/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-medium text-white">Klasik tarama</h3>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="rounded border border-slate-600 px-2 py-0.5 text-xs text-slate-400 hover:border-cyan-electric/40"
            >
              {running ? 'Duraklat' : 'Devam'}
            </button>
          </div>
          <motion.div
            key={classicalIdx}
            initial={{ opacity: 0.5, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-2xl text-cyan-glow"
          >
            {bitsToLabel(currentBits)}
          </motion.div>
          <p className="mt-2 text-sm text-slate-400">
            Cut: <span className="text-white">{currentCut}</span> / {GRAPH.edges.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Adım {classicalIdx + 1}/{ALL_CONFIGS.length} · Optimum: {bitsToLabel(OPTIMUM.bits)} (cut{' '}
            {OPTIMUM.cutValue})
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {ALL_CONFIGS.map((bits, i) => (
              <span
                key={bitsToLabel(bits)}
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                  i === classicalIdx
                    ? 'bg-cyan-electric/25 text-cyan-glow'
                    : i < classicalIdx
                      ? 'bg-navy-800 text-slate-500'
                      : 'bg-navy-950 text-slate-600'
                }`}
              >
                {bitsToLabel(bits)}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-cyan-electric/25 bg-cyan-electric/5 p-4">
          <h3 className="mb-2 font-display text-sm font-medium text-white">QAOA dağılımı</h3>
          <p className="mb-2 text-sm text-slate-400">
            Beklenen cut:{' '}
            <span className="font-semibold text-cyan-glow">{qaoa.expectedCut.toFixed(2)}</span>
          </p>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hist}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f2137', border: '1px solid rgba(6,182,212,0.3)' }}
                  formatter={(v, _n, item) => {
                    const cut = (item as { payload?: { cut?: number } }).payload?.cut ?? 0
                    return [`${v} · cut ${cut}`, 'Shot']
                  }}
                />
                <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <ChallengeTip>
        γ ve β kaydırarak QAOA histogramında optimum {bitsToLabel(OPTIMUM.bits)} bitstringinin payının
        arttığı bir bölge bul. Klasik tarama hâlâ tüm uzayı geziyor mu?
      </ChallengeTip>
    </div>
  )
}
