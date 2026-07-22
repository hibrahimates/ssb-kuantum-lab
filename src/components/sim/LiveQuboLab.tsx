import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import {
  bestClassicalQubo,
  bitsToLabel,
  evaluateQubo,
  maxCutToQubo,
  maxCutValue,
} from '../../lib/quantum/qubo'
import { parseEdgeList } from '../../lib/quantum/graphParse'

const DEFAULT_EDGES = '0-1,1-2,2-3,3-0,0-2'

export function LiveQuboLab() {
  const [edgeText, setEdgeText] = useState(DEFAULT_EDGES)

  const parsed = useMemo(() => parseEdgeList(edgeText), [edgeText])
  const graph = parsed.graph
  const hasGraph = !parsed.error && graph.edges.length > 0
  const Q = useMemo(() => (hasGraph ? maxCutToQubo(graph) : []), [graph, hasGraph])
  const optimum = useMemo(
    () => (hasGraph ? bestClassicalQubo(Q, graph) : null),
    [Q, graph, hasGraph],
  )

  const nodePositions = useMemo(() => {
    const n = graph.nodes
    return Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2
      return { x: 50 + 38 * Math.cos(angle), y: 50 + 38 * Math.sin(angle) }
    })
  }, [graph.nodes])

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Harita üzerinde yol ağı çizmek gibi: kenar listesini değiştirince en iyi bölümleme (Max-Cut) anında yeniden hesaplanır. QUBO formülü grafiğin cebirsel fotoğrafıdır."
        steps={[
          'Kenar DSL alanına düğüm çiftleri yaz — örn. 0-1,1-2,2-0.',
          'Parser grafı oluşturur; geçersiz girişte hata mesajı görürsün.',
          'Q matrisi graf yapısından otomatik türetilir.',
          'Klasik optimum tüm bitstringleri deneyerek en iyi kesimi bulur.',
          'Graf görselinde renkli düğümler optimum bitstringi gösterir.',
        ]}
        symbols={[
          { symbol: 'Kenar DSL', meaning: 'Düğüm çiftlerinin metin formatı (0-1,1-2,...)' },
          { symbol: 'Q', meaning: 'Grafın QUBO matris temsili' },
          { symbol: 'Cut', meaning: 'Farklı gruplara düşen kenar sayısı' },
        ]}
        example="Üçgen 0-1,1-2,2-0 için 3 düğüm, 3 kenar. Köşegen 0-2 ekleyince graf değişir ve optimum bitstring farklı olabilir — cut değeri ve Q matrisi birlikte güncellenir."
        watch="Kenar listesini düzenle — Q matrisi, optimum bitstring ve cut anında değişmeli. Üçgen yaz, sonra köşegen ekle; optimum nasıl kayıyor?"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-slate-300">Kenar DSL</span>
            <textarea
              value={edgeText}
              onChange={(e) => setEdgeText(e.target.value)}
              rows={3}
              spellCheck={false}
              className="mt-1 w-full rounded-lg border border-navy-700 bg-navy-950/80 px-3 py-2 font-mono text-sm text-cyan-glow focus:border-cyan-electric/50 focus:outline-none"
              placeholder="0-1,1-2,2-0"
            />
          </label>
          <p className="font-mono text-xs text-slate-500">
            # örnek: 0-1,1-2,2-3,3-0
          </p>
          {parsed.error && (
            <p className="text-sm text-amber-400">{parsed.error}</p>
          )}
          {!hasGraph && (
            <div className="rounded-lg border border-cyan-electric/20 bg-navy-900/70 px-4 py-6 text-center text-sm text-slate-400">
              <p className="font-medium text-cyan-glow">Kenar listesi gerekli</p>
              <p className="mt-2">
                Geçerli bir kenar DSL yazın — örn.{' '}
                <span className="font-mono text-slate-300">0-1,1-2,2-0</span>
              </p>
            </div>
          )}

          {hasGraph && (
          <svg viewBox="0 0 100 100" className="h-48 w-full rounded-lg bg-navy-900/60">
            {graph.edges.map(([i, j]) => (
              <line
                key={`${i}-${j}`}
                x1={nodePositions[i]?.x ?? 0}
                y1={nodePositions[i]?.y ?? 0}
                x2={nodePositions[j]?.x ?? 0}
                y2={nodePositions[j]?.y ?? 0}
                stroke="#22d3ee"
                strokeWidth={1.5}
                opacity={0.7}
              />
            ))}
            {nodePositions.map((pos, i) => {
              const bit = optimum!.bits[i] ?? 0
              return (
                <circle
                  key={i}
                  cx={pos.x}
                  cy={pos.y}
                  r={bit ? 7 : 6}
                  fill={bit ? '#06b6d4' : '#152d4a'}
                  stroke="#22d3ee"
                  strokeWidth={1.2}
                />
              )
            })}
          </svg>
          )}
        </div>

        <div className="space-y-4">
          {!hasGraph ? (
            <div className="flex h-full min-h-[12rem] items-center justify-center rounded-lg border border-dashed border-cyan-electric/20 bg-navy-900/50 px-4 py-8 text-center text-sm text-slate-500">
              Q matrisi ve optimum kesim, geçerli kenar listesi girildiğinde hesaplanır.
            </div>
          ) : (
          <>
          <div>
            <h3 className="mb-2 font-display text-sm font-medium text-white">Q matrisi</h3>
            <div className="overflow-x-auto rounded-lg border border-navy-700 bg-navy-900/80 p-2">
              <table className="w-full text-center font-mono text-xs">
                <tbody>
                  {Q.map((row, i) => (
                    <tr key={i}>
                      {row.map((val, j) => (
                        <td
                          key={j}
                          className={`p-1 ${j >= i && val !== 0 ? 'text-cyan-glow' : val !== 0 ? 'text-slate-400' : 'text-slate-600'}`}
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
            key={optimum?.quboCost ?? 'empty'}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-cyan-electric/25 bg-cyan-electric/5 p-3 text-sm"
          >
            <p className="text-xs text-slate-500">En iyi kesim (klasik)</p>
            <p className="font-mono text-lg text-cyan-glow">{bitsToLabel(optimum!.bits)}</p>
            <p className="text-slate-400">
              Cut {optimum!.cutValue}/{graph.edges.length} · QUBO {optimum!.quboCost.toFixed(0)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              QUBO doğrulama: {evaluateQubo(Q, optimum!.bits).toFixed(0)} · cut doğrulama:{' '}
              {maxCutValue(graph, optimum!.bits)}
            </p>
          </motion.div>
          </>
          )}
        </div>
      </div>

      <ChallengeTip>
        Üçgen 0-1,1-2,2-0 yaz. Dörtgen + köşegen 0-2 ekle. Optimum bitstring nasıl değişiyor?
      </ChallengeTip>
    </div>
  )
}
