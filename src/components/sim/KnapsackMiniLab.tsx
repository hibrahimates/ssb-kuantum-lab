import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import {
  bestFeasibleKnapsack,
  bestKnapsackQubo,
  evaluateKnapsackConfigs,
  knapsackToQubo,
  type KnapsackItem,
} from '../../lib/quantum/knapsack'

const ITEMS: KnapsackItem[] = [
  { id: 'a', name: 'Radar', weight: 3, value: 12 },
  { id: 'b', name: 'Sensör', weight: 2, value: 8 },
  { id: 'c', name: 'Batarya', weight: 4, value: 15 },
  { id: 'd', name: 'Modül', weight: 1, value: 4 },
  { id: 'e', name: 'Anten', weight: 2, value: 7 },
]

export function KnapsackMiniLab() {
  const [capacity, setCapacity] = useState(6)
  const [penalty, setPenalty] = useState(3)
  const [showQubo, setShowQubo] = useState(false)

  const configs = useMemo(() => evaluateKnapsackConfigs(ITEMS, capacity, penalty), [capacity, penalty])
  const bestClassical = useMemo(() => bestFeasibleKnapsack(ITEMS, capacity), [capacity])
  const bestQubo = useMemo(() => bestKnapsackQubo(ITEMS, capacity, penalty), [capacity, penalty])
  const Q = useMemo(() => knapsackToQubo(ITEMS, capacity, penalty), [capacity, penalty])

  const feasible = configs.filter((c) => c.feasible)

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Sınırlı ağırlıklı sırt çantası: uçakta el bagajı kotası var, en değerli eşyaları seçmek istiyorsun. Kapasiteyi aşan paketler ya reddedilir ya da ekstra ücret (ceza) ödersin — QUBO ceza terimi bu ücreti sayıya çevirir."
        steps={[
          'Her eşya için xᵢ=1 seç, xᵢ=0 alma; toplam ağırlık kapasite W\'yi geçmemeli.',
          'Hedef: toplam değeri maksimize et (tabloda en yüksek değerli uygun satır).',
          'QUBO görünümünde değer terimleri + kapasite cezası tek matriste birleşir.',
          'P (ceza) düşükken aşırı yüklü paketler hâlâ düşük QUBO ile üstte görünebilir.',
          'P artınca yalnızca kapasiteye uyan çözümler rekabet eder.',
        ]}
        symbols={[
          { symbol: 'W', meaning: 'Sırt çantası kapasitesi (max ağırlık)' },
          { symbol: 'xᵢ', meaning: 'i. eşyayı al (1) veya alma (0)' },
          { symbol: 'P', meaning: 'Kapasite aşımı ceza ağırlığı' },
          { symbol: 'QUBO', meaning: 'Minimize edilen skor: −değer + aşım cezası' },
        ]}
        example="Kapasite W=6, Radar(3kg,12p)+Sensör(2kg,8p)+Modül(1kg,4p) toplam 6kg ve değer 24 — uygun. Batarya(4kg) tek başına uygun ama hepsini seçmek 10kg olur; P düşükken QUBO bu aşımı hafife alabilir."
        watch="Kapasite W kaydırıcısını değiştir — en iyi uygun seçim değişiyor mu? QUBO görünümünü aç, P'yi artır; aşırı yüklü satırlar tablodan nasıl düşüyor?"
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-300">Kapasite W = {capacity}</span>
          <input
            type="range"
            min={3}
            max={10}
            step={1}
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="mt-1 w-full accent-cyan-electric"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-300">Ceza P = {penalty.toFixed(1)}</span>
          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={penalty}
            onChange={(e) => setPenalty(Number(e.target.value))}
            className="mt-1 w-full accent-cyan-electric"
            disabled={!showQubo}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => setShowQubo((v) => !v)}
        className="mb-4 rounded-lg border border-cyan-electric/30 px-3 py-1.5 text-sm text-cyan-glow hover:bg-navy-900"
      >
        {showQubo ? 'QUBO görünümünü gizle' : 'QUBO ceza görünümünü göster'}
      </button>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <motion.div
          key={bestClassical?.label ?? 'none'}
          className="rounded-lg border border-cyan-electric/25 bg-cyan-electric/5 p-3 text-sm"
        >
          <p className="text-xs text-slate-500">En iyi uygulanabilir (klasik)</p>
          {bestClassical ? (
            <>
              <p className="font-mono text-cyan-glow">{bestClassical.label}</p>
              <p className="text-slate-400">
                Değer {bestClassical.value} · Ağırlık {bestClassical.weight}/{capacity}
              </p>
            </>
          ) : (
            <p className="text-slate-500">Uygun çözüm yok</p>
          )}
        </motion.div>
        {showQubo && (
          <motion.div
            key={bestQubo.label}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-navy-700 bg-navy-900/60 p-3 text-sm"
          >
            <p className="text-xs text-slate-500">QUBO minimum</p>
            <p className="font-mono text-cyan-glow">{bestQubo.label}</p>
            <p className="text-slate-400">
              QUBO {bestQubo.quboCost.toFixed(1)} ·{' '}
              {bestQubo.feasible ? (
                <span className="text-cyan-glow">Uygun</span>
              ) : (
                <span className="text-amber-400">Aşım ({bestQubo.weight} kg)</span>
              )}
            </p>
          </motion.div>
        )}
      </div>

      {showQubo && (
        <div className="mb-4 overflow-x-auto rounded-lg border border-navy-700 bg-navy-900/80 p-2">
          <table className="w-full text-center font-mono text-xs">
            <tbody>
              {Q.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className={`p-1 ${val !== 0 ? 'text-cyan-glow' : 'text-slate-600'}`}>
                      {j >= i ? (val === 0 ? '·' : val.toFixed(0)) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-navy-700">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-navy-700 bg-navy-900/80 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Bitstring</th>
              <th className="px-3 py-2">Seçilen</th>
              <th className="px-3 py-2">Ağırlık</th>
              <th className="px-3 py-2">Değer</th>
              {showQubo && <th className="px-3 py-2">QUBO</th>}
              <th className="px-3 py-2">Durum</th>
            </tr>
          </thead>
          <tbody>
            {feasible.map((row) => (
              <tr
                key={row.label}
                className={`border-b border-navy-800/80 ${
                  row.label === bestClassical?.label ? 'bg-cyan-electric/5' : ''
                }`}
              >
                <td className="px-3 py-2 font-mono text-slate-300">{row.label}</td>
                <td className="px-3 py-2 text-slate-400">
                  {ITEMS.filter((_, i) => row.bits[i]).map((it) => it.name).join(', ') || '—'}
                </td>
                <td className="px-3 py-2 text-slate-300">{row.weight}</td>
                <td className="px-3 py-2 text-cyan-glow">{row.value}</td>
                {showQubo && <td className="px-3 py-2 text-slate-400">{row.quboCost.toFixed(1)}</td>}
                <td className="px-3 py-2 text-cyan-glow">Uygun</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChallengeTip>
        Kapasiteyi 5&apos;e düşür. Klasik en iyi seçim değişiyor mu? QUBO görünümünde P&apos;yi
        artırınca aşırı yüklü çözümler tablodan nasıl düşüyor?
      </ChallengeTip>
    </div>
  )
}
