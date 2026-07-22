import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import {
  bestClassicalQubo,
  bitsToLabel,
  enumerateBitstrings,
  evaluateQubo,
  maxCutToQubo,
  maxCutValue,
  type UnweightedGraph,
} from '../../lib/quantum/qubo'

const NODE_COUNT = 5

const NODE_POSITIONS = [
  { x: 50, y: 12 },
  { x: 88, y: 38 },
  { x: 74, y: 82 },
  { x: 26, y: 82 },
  { x: 12, y: 38 },
]

const INITIAL_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 2],
]

function edgeKey(a: number, b: number) {
  return `${Math.min(a, b)}-${Math.max(a, b)}`
}

export function QuboBuilder() {
  const [edges, setEdges] = useState<[number, number][]>(INITIAL_EDGES)
  const [previewBits, setPreviewBits] = useState<number[]>([0, 0, 0, 0, 0])

  const graph: UnweightedGraph = useMemo(
    () => ({ nodes: NODE_COUNT, edges }),
    [edges],
  )

  const Q = useMemo(() => maxCutToQubo(graph), [graph])
  const optimum = useMemo(() => bestClassicalQubo(Q, graph), [Q, graph])

  const previewCost = evaluateQubo(Q, previewBits)
  const previewCut = maxCutValue(graph, previewBits)

  const toggleEdge = (i: number, j: number) => {
    const key = edgeKey(i, j)
    setEdges((prev) => {
      const exists = prev.some(([a, b]) => edgeKey(a, b) === key)
      if (exists) return prev.filter(([a, b]) => edgeKey(a, b) !== key)
      return [...prev, [Math.min(i, j), Math.max(i, j)] as [number, number]]
    })
  }

  const toggleBit = (i: number) => {
    setPreviewBits((prev) => prev.map((b, idx) => (idx === i ? 1 - b : b)))
  }

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Bir partiyi iki salona ayırmak gibi düşün: komşu masalar farklı salondaysa kesim sayılır (iyi), aynı salondaysa kesilmez (kötü). Max-Cut en çok kenarı kesen bölümlemeyi arar; QUBO bu oyunu sayılara çevirir."
        steps={[
          'Graf düğümleri varlıklar, kenarlar komşuluk ilişkileridir.',
          'Her düğüme 0 veya 1 biti ata — iki farklı bit farklı salon demektir, kenar kesilir.',
          'QUBO matrisi Q, hangi bit çiftlerinin maliyeti artırıp azaltacağını kodlar.',
          'Düşük QUBO skoru = daha iyi kesim; klasik optimum tüm bitstringleri deneyerek bulunur.',
          'Düğüme tıklayarak bit değiştir, kenar ortasına tıklayarak kenar ekle/çıkar — Q anında güncellenir.',
        ]}
        symbols={[
          { symbol: 'Q', meaning: 'QUBO matrisi — minimize edilecek ikinci dereceden form' },
          { symbol: 'xᵢ', meaning: 'i. düğümün bit değeri (0 veya 1)' },
          { symbol: 'Cut', meaning: 'Farklı taraftaki uçları olan kenar sayısı' },
          { symbol: 'Bitstring', meaning: 'Tüm düğüm bitlerinin birleşimi, örn. 10101' },
        ]}
        example="5 düğümlü grafikte 10101 bitstringi bazı kenarları keser, 00000 hiç kesmez. Q matrisindeki çapraz dışı terimler (i≠j) komşu düğümler farklı gruptaysa maliyeti düşürür."
        watch="Kenar ekle/çıkar ve düğüm bitlerini değiştir. Seçili bitstring kutusundaki Cut ve QUBO değerleri ile klasik optimum kutusunu karşılaştır — optimum her zaman en yüksek cut ve en düşük QUBO'yu vermeli."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-sm font-medium text-white">Graf düzenleyici</h3>
          <p className="mb-3 text-xs text-slate-500">İki düğüme tıkla: kenar varsa sil, yoksa ekle.</p>
          <svg viewBox="0 0 100 100" className="mx-auto h-56 w-full max-w-xs rounded-lg bg-navy-900/60">
            {edges.map(([i, j]) => (
              <line
                key={edgeKey(i, j)}
                x1={NODE_POSITIONS[i].x}
                y1={NODE_POSITIONS[i].y}
                x2={NODE_POSITIONS[j].x}
                y2={NODE_POSITIONS[j].y}
                stroke="#22d3ee"
                strokeWidth={1.5}
                opacity={0.7}
              />
            ))}
            {NODE_POSITIONS.map((pos, i) => (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={previewBits[i] === 1 ? 7 : 6}
                  fill={previewBits[i] === 1 ? '#06b6d4' : '#152d4a'}
                  stroke="#22d3ee"
                  strokeWidth={1.2}
                  className="cursor-pointer"
                  onClick={() => toggleBit(i)}
                />
                <text x={pos.x} y={pos.y + 3} textAnchor="middle" className="fill-white text-[8px] pointer-events-none">
                  {i}
                </text>
              </g>
            ))}
            {/* invisible hit targets for edge toggling */}
            {NODE_POSITIONS.map((_, i) =>
              NODE_POSITIONS.map((_, j) => {
                if (j <= i) return null
                const mx = (NODE_POSITIONS[i].x + NODE_POSITIONS[j].x) / 2
                const my = (NODE_POSITIONS[i].y + NODE_POSITIONS[j].y) / 2
                return (
                  <circle
                    key={`hit-${i}-${j}`}
                    cx={mx}
                    cy={my}
                    r={4}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={() => toggleEdge(i, j)}
                  />
                )
              }),
            )}
          </svg>
          <p className="mt-2 text-center text-xs text-slate-500">
            Kenar ortasına tıkla · düğüm rengi = bit ({bitsToLabel(previewBits)})
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-display text-sm font-medium text-white">Q matrisi (minimize)</h3>
            <div className="overflow-x-auto rounded-lg border border-navy-700 bg-navy-900/80 p-2">
              <table className="w-full text-center font-mono text-xs">
                <thead>
                  <tr>
                    <th className="p-1 text-slate-500" />
                    {Array.from({ length: NODE_COUNT }, (_, i) => (
                      <th key={i} className="p-1 text-cyan-electric/70">
                        {i}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Q.map((row, i) => (
                    <tr key={i}>
                      <td className="p-1 text-cyan-electric/70">{i}</td>
                      {row.map((val, j) => (
                        <td
                          key={j}
                          className={`p-1 ${j > i && val !== 0 ? 'text-cyan-glow' : val !== 0 ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                          {j >= i ? (val === 0 ? '·' : val.toFixed(0)) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <motion.div
            key={`${previewCost}-${optimum.quboCost}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3 text-sm"
          >
            <div className="rounded-lg border border-navy-700 bg-navy-900/60 p-3">
              <p className="text-xs text-slate-500">Seçili bitstring</p>
              <p className="font-mono text-cyan-glow">{bitsToLabel(previewBits)}</p>
              <p className="mt-1 text-slate-400">
                QUBO: <span className="text-white">{previewCost.toFixed(0)}</span>
              </p>
              <p className="text-slate-400">
                Cut: <span className="text-white">{previewCut}</span> / {edges.length}
              </p>
            </div>
            <div className="rounded-lg border border-cyan-electric/25 bg-cyan-electric/5 p-3">
              <p className="text-xs text-slate-500">Klasik optimum</p>
              <p className="font-mono text-cyan-glow">{bitsToLabel(optimum.bits)}</p>
              <p className="mt-1 text-slate-400">
                QUBO: <span className="text-white">{optimum.quboCost.toFixed(0)}</span>
              </p>
              <p className="text-slate-400">
                Cut: <span className="text-white">{optimum.cutValue}</span> / {edges.length}
              </p>
            </div>
          </motion.div>

          <details className="text-xs text-slate-500">
            <summary className="cursor-pointer text-slate-400">Tüm {1 << NODE_COUNT} yapılandırma</summary>
            <ul className="mt-2 max-h-32 space-y-0.5 overflow-y-auto font-mono">
              {enumerateBitstrings(NODE_COUNT).map((bits) => (
                <li key={bitsToLabel(bits)}>
                  {bitsToLabel(bits)} → cut {maxCutValue(graph, bits)}, QUBO {evaluateQubo(Q, bits).toFixed(0)}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>

      <ChallengeTip>
        0-2 köşegen kenarını sil. Klasik optimum bitstring değişiyor mu? Seçili bitstring ile
        optimum arasındaki cut farkını karşılaştır.
      </ChallengeTip>
    </div>
  )
}
