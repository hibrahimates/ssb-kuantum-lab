import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import { evaluateSelectionConfigs, type SelectionAsset } from '../../lib/quantum/constraint'

const ASSETS: SelectionAsset[] = [
  { id: 'a', name: 'Tahvil A', return: 3 },
  { id: 'b', name: 'Hisse B', return: 8 },
  { id: 'c', name: 'Emtia C', return: 5 },
  { id: 'd', name: 'Nakit D', return: 1 },
]

export function ConstraintPenaltyLab() {
  const [penalty, setPenalty] = useState(4)

  const rows = useMemo(() => evaluateSelectionConfigs(ASSETS, penalty, 16), [penalty])

  const bestFeasible = rows.find((r) => r.feasible)

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Hızlı kasada tam bir ürün kuralı gibi düşün: sepete ya hiç ürün koyamazsın ya da birden fazla — ama kural tam 1 ürün. Kuralı çiğnersen trafik cezası (penalty) ödersin; ceza düşükse yüksek getirili ama kuralsız seçimler hâlâ cazip görünebilir."
        steps={[
          'Her varlık için bir anahtar xᵢ vardır: 0 = seçme, 1 = seç.',
          'Σx toplamı kaç varlık seçtiğini sayar; hedefimiz Σx = 1 (tam bir portföy).',
          'Kural bozulursa ceza terimi P·(Σx−1)² eklenir: 0 veya 2+ seçimde fark karesi büyür, maliyet artar.',
          'QUBO −getiri + ceza toplamını minimize eder; en düşük satır algoritmanın tercih ettiği çözümdür.',
          'Tablodaki "Uygun" satırlar kurala uyanlar; "Uygunsuz" satırlar cezalı olsa bile düşük QUBO ile üst sıralara çıkabilir.',
        ]}
        symbols={[
          { symbol: 'xᵢ', meaning: 'i. varlık için 0/1 seçim değişkeni (0 = alma, 1 = al)' },
          { symbol: 'Σx', meaning: 'Seçilen varlık sayısı (toplam)' },
          { symbol: 'P', meaning: 'Ceza ağırlığı — kural ihlalinin ne kadar pahalı sayılacağı' },
          { symbol: 'P·(Σx−1)²', meaning: 'Tam 1 seçim dışında kare ceza; Σx=1 iken sıfır' },
          { symbol: 'QUBO', meaning: 'Minimize edilen skor: −getiri + ceza (düşük = daha iyi)' },
        ]}
        example="P=0 iken ceza yoktur: dört varlığın hepsi seçilirse QUBO −17 olur ve tabloyu domine eder (kural ihlali kazanır gibi görünür). Hisse B + Emtia C (Σx=2) ham getiri +13 gibi görünür — (2−1)²=1 olduğu için ceza P×1 eklenir. P=4 iken B+C QUBO −13+4=−9, tek Hisse B ise −8; minimizasyonda −9 daha düşük olduğu için uygunsuz B+C hâlâ üsttedir. P=6 veya P=10 iken ceza yeterince büyür: B+C −13+6=−7 veya −13+10=−3; tek Hisse B −8 artık daha düşük QUBO ile kazanır. Boş seçim (Σx=0) ise QUBO 0+P×1=P olur."
        watch="P kaydırıcısını soldan sağa (düşük→yüksek) hareket ettir. P=0'da uygunsuz çoklu seçimler üstte kalır; P=4 civarında B+C (−9) hâlâ tek Hisse B'den (−8) daha düşük QUBO ile öndedir. Ceza P>5 olunca tek Hisse B kazanır; P≈10'da en üst satır Hisse B (tek seçim) olmalı."
      />

      <label className="mb-4 block max-w-md text-sm">
        <span className="text-slate-300">Ceza ağırlığı P = {penalty.toFixed(1)}</span>
        <input
          type="range"
          min={0}
          max={20}
          step={0.5}
          value={penalty}
          onChange={(e) => setPenalty(Number(e.target.value))}
          className="mt-1 w-full accent-cyan-electric"
        />
      </label>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-navy-700 bg-navy-900/60 p-3 text-sm">
          <p className="text-xs text-slate-500">Varlık getirileri (maximize)</p>
          <ul className="mt-1 space-y-0.5 text-slate-300">
            {ASSETS.map((a) => (
              <li key={a.id}>
                {a.name}: <span className="text-cyan-glow">+{a.return}</span>
              </li>
            ))}
          </ul>
        </div>
        <motion.div
          key={bestFeasible?.label ?? 'none'}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-cyan-electric/25 bg-cyan-electric/5 p-3 text-sm"
        >
          <p className="text-xs text-slate-500">En iyi uygulanabilir (tabloda)</p>
          {bestFeasible ? (
            <>
              <p className="font-mono text-cyan-glow">{bestFeasible.label}</p>
              <p className="text-slate-400">
                Seçilen: {bestFeasible.selected.join(', ')} · QUBO {bestFeasible.totalQubo.toFixed(1)}
              </p>
            </>
          ) : (
            <p className="text-slate-500">—</p>
          )}
        </motion.div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-navy-700">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-navy-700 bg-navy-900/80 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Bitstring</th>
              <th className="px-3 py-2">Seçim</th>
              <th className="px-3 py-2">Getiri (−obj)</th>
              <th className="px-3 py-2">Ceza</th>
              <th className="px-3 py-2">QUBO</th>
              <th className="px-3 py-2">Durum</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className={`border-b border-navy-800/80 ${row.feasible ? 'bg-cyan-electric/5' : ''}`}
              >
                <td className="px-3 py-2 font-mono text-slate-300">{row.label}</td>
                <td className="px-3 py-2 text-slate-400">
                  {row.selected.length ? row.selected.join(', ') : '—'}
                </td>
                <td className="px-3 py-2 text-slate-300">{(-row.objective).toFixed(0)}</td>
                <td className="px-3 py-2 text-slate-400">{row.penaltyTerm.toFixed(1)}</td>
                <td className="px-3 py-2 font-medium text-white">{row.totalQubo.toFixed(1)}</td>
                <td className="px-3 py-2">
                  {row.feasible ? (
                    <span className="text-cyan-glow">Uygun</span>
                  ) : (
                    <span className="text-amber-400/90">Uygunsuz</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        P artınca çoklu/boş seçimler ceza alır; QUBO minimizasyonu yalnızca uygun çözümlere kayar.
      </p>

      <ChallengeTip>
        P = 0 iken tablonun birinci satırına bak — uygunsuz mu? P&apos;yi 10&apos;a çıkar; en üst
        satır artık Hisse B (tek seçim) olmalı.
      </ChallengeTip>
    </div>
  )
}
