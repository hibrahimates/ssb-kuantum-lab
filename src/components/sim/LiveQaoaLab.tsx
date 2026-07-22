import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import {
  cutFromBitstring,
  histogramToSortedEntries,
  runQaoaStatevector,
  sampleComputationalBasis,
} from '../../lib/quantum/qaoa'
import { bestClassicalQubo, maxCutToQubo } from '../../lib/quantum/qubo'
import { GRAPH_PRESETS } from '../../lib/quantum/graphParse'

const PRESET_KEYS = Object.keys(GRAPH_PRESETS)

export function LiveQaoaLab() {
  const [preset, setPreset] = useState<string>('diamond')
  const [gamma, setGamma] = useState(0.75)
  const [beta, setBeta] = useState(0.55)
  const [pLayers, setPLayers] = useState<1 | 2>(1)
  const [shots, setShots] = useState(512)

  const graph = GRAPH_PRESETS[preset] ?? GRAPH_PRESETS.diamond
  const graphReady = graph.nodes > 0 && graph.edges.length > 0

  const params = useMemo(() => {
    if (!graphReady) return { gamma: [gamma], beta: [beta] }
    if (pLayers === 1) return { gamma: [gamma], beta: [beta] }
    return { gamma: [gamma * 0.65, gamma], beta: [beta * 0.75, beta] }
  }, [gamma, beta, pLayers, graphReady])

  const qaoa = useMemo(
    () => (graphReady ? runQaoaStatevector(graph, params) : null),
    [graph, params, graphReady],
  )

  const classicalOpt = useMemo(() => {
    if (!graphReady) return null
    const Q = maxCutToQubo(graph)
    return bestClassicalQubo(Q, graph)
  }, [graph, graphReady])

  const hist = useMemo(() => {
    if (!graphReady || !qaoa) return []
    const raw = sampleComputationalBasis(qaoa.state, shots, graph.nodes)
    return histogramToSortedEntries(raw).slice(0, 10)
  }, [qaoa, shots, graph.nodes, graphReady])

  const paramCode = `# QAOA parametreleri (canlı)
p = ${pLayers}
gamma = [${params.gamma.map((g) => g.toFixed(2)).join(', ')}]
beta  = [${params.beta.map((b) => b.toFixed(2)).join(', ')}]
graph = "${preset}"  # ${graph.nodes} düğüm, ${graph.edges.length} kenar
shots = ${shots}`

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Canlı radyo ayarı: graf presetini seç, γ/β ibrelerini çevir — beklenen cut ve histogram anında değişir. Python çalıştırmadan parametre duyarlılığını hissetmek için."
        steps={[
          'Graf presetleri (diamond, chain vb.) farklı Max-Cut problemleri sunar.',
          'γ cost katmanını, β mixer katmanını kontrol eder; p katman sayısı derinliği artırır.',
          'Beklenen cut olasılıklarla ağırlıklı ortalama kesimdir — klasik optimum referans olarak gösterilir.',
          'Shot histogramı simüle ölçüm sonuçlarını sayar.',
          'Doğru parametreler iyi bitstringlerin payını artırır; yanlış parametreler dağılımı düzleştirir.',
        ]}
        symbols={[
          { symbol: 'γ, β', meaning: 'QAOA cost ve mixer açıları (radyan)' },
          { symbol: 'p', meaning: 'Cost+mixer tekrar katman sayısı' },
          { symbol: 'Shots', meaning: 'Simüle ölçüm tekrar sayısı' },
          { symbol: 'Beklenen cut', meaning: 'Olasılıklarla ağırlıklı ortalama kesim' },
        ]}
        example="Diamond grafta γ≈0.8, β≈0.55 civarında beklenen cut klasik optimuma yaklaşabilir. p=2'ye geçince daha fazla katman eklenir — cut artabilir ama garanti değildir."
        watch="Preset değiştir, γ/β kaydır, p=1↔p=2 dene. Beklenen cut ile klasik optimumu karşılaştır. Shot sayısını artırınca histogram daha stabil mi?"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <pre className="overflow-x-auto rounded-lg border border-navy-700 bg-navy-950/90 p-3 font-mono text-xs text-cyan-glow/90">
            {paramCode}
          </pre>

          <div className="flex flex-wrap gap-2">
            {PRESET_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPreset(key)}
                className={`rounded-lg px-3 py-1 text-sm ${
                  preset === key
                    ? 'bg-cyan-electric/20 text-cyan-glow'
                    : 'border border-slate-600 text-slate-400'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPLayers(1)}
              className={`rounded-lg px-3 py-1 text-sm ${pLayers === 1 ? 'bg-cyan-electric/20 text-cyan-glow' : 'border border-slate-600 text-slate-400'}`}
            >
              p = 1
            </button>
            <button
              type="button"
              onClick={() => setPLayers(2)}
              className={`rounded-lg px-3 py-1 text-sm ${pLayers === 2 ? 'bg-cyan-electric/20 text-cyan-glow' : 'border border-slate-600 text-slate-400'}`}
            >
              p = 2
            </button>
          </div>

          <label className="block text-sm">
            <span className="text-slate-300">γ = {gamma.toFixed(2)} rad</span>
            <input
              type="range"
              min={0}
              max={Math.PI}
              step={0.02}
              value={gamma}
              onChange={(e) => setGamma(Number(e.target.value))}
              className="mt-1 w-full accent-cyan-electric"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">β = {beta.toFixed(2)} rad</span>
            <input
              type="range"
              min={0}
              max={Math.PI / 2}
              step={0.02}
              value={beta}
              onChange={(e) => setBeta(Number(e.target.value))}
              className="mt-1 w-full accent-cyan-electric"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">Shots = {shots}</span>
            <input
              type="range"
              min={64}
              max={1024}
              step={64}
              value={shots}
              onChange={(e) => setShots(Number(e.target.value))}
              className="mt-1 w-full accent-cyan-electric"
            />
          </label>
        </div>

        <div className="space-y-4">
          {!graphReady ? (
            <div className="flex min-h-[16rem] items-center justify-center rounded-lg border border-dashed border-cyan-electric/20 bg-navy-900/50 px-4 py-8 text-center text-sm text-slate-500">
              Graf seçilemedi veya kenar listesi boş. Bir preset düğmesine basın.
            </div>
          ) : (
          <>
          <motion.div
            key={qaoa!.expectedCut}
            initial={{ scale: 0.98, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-lg border border-cyan-electric/30 bg-navy-900/70 px-4 py-3"
          >
            <p className="text-sm text-slate-400">
              Beklenen cut:{' '}
              <span className="font-display text-xl font-semibold text-cyan-glow">
                {qaoa!.expectedCut.toFixed(3)}
              </span>
              <span className="text-slate-500">
                {' '}
                / {graph.edges.length} (klasik opt {classicalOpt!.cutValue})
              </span>
            </p>
          </motion.div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hist}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#0f2137', border: '1px solid rgba(6,182,212,0.3)' }}
                  formatter={(v, _n, item) => {
                    const label = (item as { payload?: { label?: string } }).payload?.label ?? ''
                    const cut = label ? cutFromBitstring(graph, label) : 0
                    return [`${v} shot · cut ${cut}`, 'Sayım']
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </>
          )}
        </div>
      </div>

      <ChallengeTip>
        diamond grafında γ ≈ 0.8 bul. p=2&apos;ye geçince beklenen cut klasik optimuma yaklaşıyor mu?
      </ChallengeTip>
    </div>
  )
}
