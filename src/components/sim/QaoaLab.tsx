import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  cutFromBitstring,
  DEMO_MAX_CUT_GRAPH,
  histogramToSortedEntries,
  runQaoaStatevector,
  sampleComputationalBasis,
  scanGammaLandscape,
} from '../../lib/quantum/qaoa'

const GRAPH = DEMO_MAX_CUT_GRAPH
const SHOTS = 512

export function QaoaLab() {
  const [gamma, setGamma] = useState(0.8)
  const [beta, setBeta] = useState(0.6)
  const [pLayers, setPLayers] = useState<1 | 2>(1)

  const params = useMemo(() => {
    if (pLayers === 1) return { gamma: [gamma], beta: [beta] }
    return { gamma: [gamma * 0.7, gamma], beta: [beta * 0.8, beta] }
  }, [gamma, beta, pLayers])

  const qaoa = useMemo(() => runQaoaStatevector(GRAPH, params), [params])

  const landscape = useMemo(
    () => scanGammaLandscape(GRAPH, beta, 0, Math.PI, 40),
    [beta],
  )

  const hist = useMemo(() => {
    const raw = sampleComputationalBasis(qaoa.state, SHOTS, GRAPH.nodes)
    return histogramToSortedEntries(raw).slice(0, 8)
  }, [qaoa.state])

  const classicalMaxCut = 4

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Radyo frekansı ayarı gibi: γ ve β ibrelerini doğru konuma getirince istasyon (iyi Max-Cut) netleşir. QAOA, kuantum devresiyle olası bitstring dağılımını eğerek iyi kesimlere ağırlık verir."
        steps={[
          'Başlangıçta tüm bitstringler eşit olasılıkta süperpozisyondadır (Hadamard).',
          'Cost katmanı U_C(γ) iyi kesimleri güçlendirir — γ problemle ilişkili açıdır.',
          'Mixer katmanı U_B(β) süperpozisyonu korur, farklı çözümleri keşfettirir.',
          'Devre sonunda ölçüm yapılırsa her bitstring belirli olasılıkla çıkar (histogram).',
          'Beklenen cut, olasılıklarla ağırlıklı ortalama kesim değeridir — klasik optimumdan küçük kalabilir.',
        ]}
        symbols={[
          { symbol: 'γ (gamma)', meaning: 'Cost katmanı açısı — problem maliyetini kodlar' },
          { symbol: 'β (beta)', meaning: 'Mixer katmanı açısı — keşif/süperpozisyon dengesi' },
          { symbol: 'p', meaning: 'QAOA katman sayısı (cost+mixer tekrarı)' },
          { symbol: 'Shot', meaning: 'Tek ölçüm denemesi; çok shot = daha net histogram' },
        ]}
        example="4 kenarlı demo grafta klasik optimum cut≈4. γ≈0.8, β≈0.6 civarında beklenen cut yükselir ve histogram en iyi bitstringlerde yoğunlaşır. Yanlış açılarda dağılım düzleşir, cut düşer."
        watch="γ kaydırıcısını hareket ettir; γ taraması grafiğindeki tepe noktasına getir. Histogramın en yüksek cut'lu bitstringlerde toplanıp toplanmadığını ve beklenen cut değerinin nasıl değiştiğini izle. p=2 ile p=1 farkını dene."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPLayers(1)}
          className={`rounded-lg px-3 py-1 text-sm ${pLayers === 1 ? 'bg-cyan-electric/20 text-cyan-glow' : 'text-slate-400 border border-slate-600'}`}
        >
          p = 1
        </button>
        <button
          type="button"
          onClick={() => setPLayers(2)}
          className={`rounded-lg px-3 py-1 text-sm ${pLayers === 2 ? 'bg-cyan-electric/20 text-cyan-glow' : 'text-slate-400 border border-slate-600'}`}
        >
          p = 2 (deneysel)
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

      <motion.div
        key={qaoa.expectedCut}
        initial={{ scale: 0.98, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        className="my-4 rounded-lg border border-cyan-electric/30 bg-navy-900/70 px-4 py-3"
      >
        <p className="text-sm text-slate-400">
          Beklenen Max-Cut:{' '}
          <span className="font-display text-xl font-semibold text-cyan-glow">
            {qaoa.expectedCut.toFixed(3)}
          </span>{' '}
          <span className="text-slate-500">/ {GRAPH.edges.length} kenar (klasik opt ≈ {classicalMaxCut})</span>
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-sm font-medium text-white">γ taraması (sabit β)</h3>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={landscape}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" />
                <XAxis
                  dataKey="gamma"
                  tickFormatter={(v) => Number(v).toFixed(1)}
                  stroke="#64748b"
                  fontSize={11}
                />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#0f2137', border: '1px solid rgba(6,182,212,0.3)' }}
                  labelFormatter={(v) => `γ = ${Number(v).toFixed(2)}`}
                  formatter={(v) => [Number(v).toFixed(3), 'Beklenen cut']}
                />
                <Line type="monotone" dataKey="expectedCut" stroke="#22d3ee" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-display text-sm font-medium text-white">Örnek bitstring histogramı ({SHOTS} shot)</h3>
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
                    const cut = label ? cutFromBitstring(GRAPH, label) : 0
                    return [`${v} shot · cut ${cut}`, 'Sayım']
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <ChallengeTip>
        γ taramasında tepe noktasını bul, sonra kaydırıcıyı o γ değerine getir. Histogram en yüksek
        cut&apos;lu bitstringlerde yoğunlaşıyor mu?
      </ChallengeTip>
    </div>
  )
}
