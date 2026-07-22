import { useMemo, useState } from 'react'
import { PlaygroundExplainer, ChallengeTip } from '../playground'
import { motion, AnimatePresence } from 'framer-motion'
import {
  blochCoords,
  createBellState,
  createProductState,
  measureQubit,
  measureTwoQubit,
  probOne,
  probZero,
  qubitFromAngles,
  type QubitState,
  type TwoQubitAmps,
} from '../../lib/quantum/statevector'

function BlochCanvas({ x, y, z }: { x: number; y: number; z: number }) {
  const size = 180
  const cx = size / 2
  const cy = size / 2
  const r = 70
  const px = cx + x * r
  const py = cy - y * r

  return (
    <svg width={size} height={size} className="mx-auto" aria-label="Bloch küresi izdüşümü">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth={1.5} />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="rgba(148,163,184,0.2)" />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="rgba(148,163,184,0.2)" />
      <text x={cx} y={14} textAnchor="middle" className="fill-slate-500 text-[10px]">
        |0⟩ (kuzey)
      </text>
      <text x={cx} y={size - 4} textAnchor="middle" className="fill-slate-500 text-[10px]">
        |1⟩ (güney)
      </text>
      <motion.circle
        cx={px}
        cy={py}
        r={8}
        fill="#22d3ee"
        animate={{ cx: px, cy: py }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      />
      <line
        x1={cx}
        y1={cy}
        x2={px}
        y2={py}
        stroke="rgba(6,182,212,0.5)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={size - 8} y={cy - 6} textAnchor="end" className="fill-cyan-glow text-[10px]">
        z = {z.toFixed(2)}
      </text>
    </svg>
  )
}

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-mono text-slate-400">{label}</span>
        <span className="text-cyan-glow">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-navy-900">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.25 }}
        />
      </div>
    </div>
  )
}

export function QubitExplorer() {
  const [theta, setTheta] = useState(Math.PI / 3)
  const [phi, setPhi] = useState(Math.PI / 4)
  const [entangled, setEntangled] = useState(false)
  const [singleState, setSingleState] = useState<QubitState>(() => qubitFromAngles(Math.PI / 3, Math.PI / 4))
  const [twoAmps, setTwoAmps] = useState<TwoQubitAmps>(() => createProductState(qubitFromAngles(Math.PI / 3, Math.PI / 4), qubitFromAngles(0, 0)))
  const [lastOutcome, setLastOutcome] = useState<string | null>(null)

  const derivedSingle = useMemo(() => qubitFromAngles(theta, phi), [theta, phi])
  const activeSingle = entangled ? singleState : derivedSingle

  const bloch = useMemo(() => blochCoords(activeSingle), [activeSingle])
  const p0 = probZero(activeSingle)
  const p1 = probOne(activeSingle)

  const twoProbs = useMemo(() => {
    const amps = entangled ? twoAmps : createProductState(activeSingle, qubitFromAngles(0, 0))
    return amps.map((a) => a.re * a.re + a.im * a.im)
  }, [entangled, twoAmps, activeSingle])

  const syncFromSliders = () => {
    const s = qubitFromAngles(theta, phi)
    setSingleState(s)
    if (entangled) {
      setTwoAmps(createBellState())
    } else {
      setTwoAmps(createProductState(s, qubitFromAngles(0, 0)))
    }
    setLastOutcome(null)
  }

  const toggleEntangle = () => {
    const next = !entangled
    setEntangled(next)
    if (next) {
      setTwoAmps(createBellState())
    } else {
      setTwoAmps(createProductState(singleState, qubitFromAngles(0, 0)))
    }
    setLastOutcome(null)
  }

  const handleMeasure = () => {
    if (entangled) {
      const { label, collapsed } = measureTwoQubit(twoAmps)
      setTwoAmps(collapsed)
      setLastOutcome(`2-kubit ölçüm: |${label}⟩`)
    } else {
      const { outcome, collapsed } = measureQubit(activeSingle)
      setSingleState(collapsed)
      setTheta(outcome === 0 ? 0 : Math.PI)
      setPhi(0)
      setLastOutcome(`Ölçüm sonucu: |${outcome}⟩`)
    }
  }

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        analogy="Klasik madeni para ya tura ya yazıdır — ölçene kadar ikisi birden olamaz. Kuantum kübit ise ikisinin karışımında olabilir; ölçüm yapınca rastgele ama olasılıklı bir sonuç seçilir."
        steps={[
          'θ (theta) kübitin |0⟩ ile |1⟩ arasındaki dengesini ayarlar: θ=0° tam |0⟩, θ=180° tam |1⟩.',
          'φ (phi) faz açısıdır; olasılık çubuklarını değiştirmeden durumun fazını kaydırır.',
          'Bloch küresi bu durumu görselleştirir: nokta kuzeye yakınsa |0⟩, güneye yakınsa |1⟩ baskındır.',
          'Ölç düğmesi Born kuralına göre |0⟩ veya |1⟩ üretir ve süperpozisyonu çöker (tek sonuca indirger).',
          'Bell modunda iki kübit dolaşık (entangled) olur: yalnızca |00⟩ ve |11⟩ çıkabilir, asla karışık çiftler.',
        ]}
        symbols={[
          { symbol: '|0⟩, |1⟩', meaning: 'Kübitin iki temel durumu (klasik 0 ve 1 gibi)' },
          { symbol: 'θ', meaning: 'Polar açı — |0⟩/|1⟩ karışım oranını belirler' },
          { symbol: 'φ', meaning: 'Azimut açısı — faz bilgisi' },
          { symbol: 'Born kuralı', meaning: 'Ölçüm olasılığı = genliğin karesi (|α|², |β|²)' },
        ]}
        example="θ=60°, φ=45° iken |0⟩ olasılığı cos²(30°) ≈ %75, |1⟩ ≈ %25. Ölç'e birkaç kez basarsan sonuçlar bu orana yaklaşır. θ=90° yapınca her iki sonuç da yaklaşık %50 olur."
        watch="θ kaydırıcısını hareket ettir; Bloch noktası ve |0⟩/|1⟩ çubukları birlikte değişmeli. θ=90° yapıp birkaç kez Ölç'e bas — oran yaklaşık yarı yarıya mı? Bell modunda yalnızca |00⟩ ve |11⟩ çıktığını doğrula."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="text-slate-300">θ (polar): {(theta * (180 / Math.PI)).toFixed(0)}°</span>
            <input
              type="range"
              min={0}
              max={Math.PI}
              step={0.02}
              value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              onMouseUp={syncFromSliders}
              onTouchEnd={syncFromSliders}
              className="mt-1 w-full accent-cyan-electric"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-300">φ (azimut): {(phi * (180 / Math.PI)).toFixed(0)}°</span>
            <input
              type="range"
              min={0}
              max={2 * Math.PI}
              step={0.02}
              value={phi}
              onChange={(e) => setPhi(Number(e.target.value))}
              onMouseUp={syncFromSliders}
              onTouchEnd={syncFromSliders}
              className="mt-1 w-full accent-cyan-electric"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={syncFromSliders}
              className="rounded-lg border border-cyan-electric/30 bg-navy-900 px-3 py-1.5 text-sm text-cyan-glow hover:bg-navy-700"
            >
              Durumu güncelle
            </button>
            <button
              type="button"
              onClick={handleMeasure}
              className="rounded-lg bg-cyan-electric/20 px-4 py-1.5 text-sm font-medium text-cyan-glow hover:bg-cyan-electric/30"
            >
              Ölç
            </button>
            <button
              type="button"
              onClick={toggleEntangle}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                entangled
                  ? 'border-cyan-glow bg-cyan-electric/15 text-cyan-glow'
                  : 'border-slate-600 text-slate-400 hover:border-cyan-electric/40'
              }`}
            >
              {entangled ? 'Bell |Φ⁺⟩ açık' : '2-kubit Bell dene'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {lastOutcome && (
              <motion.p
                key={lastOutcome}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-cyan-electric/25 bg-navy-900/80 px-3 py-2 text-sm text-cyan-glow"
              >
                {lastOutcome}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {!entangled && <BlochCanvas x={bloch.x} y={bloch.y} z={bloch.z} />}

          {!entangled ? (
            <div className="space-y-2">
              <ProbBar label="|0⟩" value={p0} color="#06b6d4" />
              <ProbBar label="|1⟩" value={p1} color="#22d3ee" />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500">Bell durumu: yalnızca |00⟩ ve |11⟩ olası.</p>
              {['00', '01', '10', '11'].map((lab, i) => (
                <ProbBar key={lab} label={`|${lab}⟩`} value={twoProbs[i]} color={i % 3 === 0 ? '#06b6d4' : '#334155'} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ChallengeTip>
        θ = 90° yap ve birkaç kez Ölç&apos;e bas. |0⟩/|1⟩ oranı yaklaşık %50-%50 mi? Bell modunda
        yalnızca |00⟩ ve |11⟩ çıktığını doğrula.
      </ChallengeTip>
    </div>
  )
}
