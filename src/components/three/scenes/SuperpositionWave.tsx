import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import type { Mesh } from 'three'
import { qubitFromAngles } from '../../../lib/quantum/statevector'
import { SceneCanvas } from '../SceneCanvas'
import { SceneCaption } from '../SceneCaption'
import { useSceneMotionContext } from '../SceneMotionContext'

const CYAN = '#22d3ee'
const NAVY = '#152d4a'

function WaveLines({ amp0, amp1 }: { amp0: number; amp1: number }) {
  const groupRef = useRef<Mesh>(null)
  const { animate } = useSceneMotionContext()
  const phase = useRef(0)

  const wave0 = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 80; i++) {
      const x = (i / 80) * 6 - 3
      pts.push([x, amp0 * Math.sin(x * 2), 0.3])
    }
    return pts
  }, [amp0])

  const wave1 = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 80; i++) {
      const x = (i / 80) * 6 - 3
      pts.push([x, amp1 * Math.sin(x * 2 + Math.PI / 3), -0.3])
    }
    return pts
  }, [amp1])

  const combined = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 80; i++) {
      const x = (i / 80) * 6 - 3
      const y0 = amp0 * Math.sin(x * 2)
      const y1 = amp1 * Math.sin(x * 2 + Math.PI / 3)
      pts.push([x, (y0 + y1) / Math.sqrt(2), 0])
    }
    return pts
  }, [amp0, amp1])

  useFrame((_, delta) => {
    if (!groupRef.current || !animate) return
    phase.current += delta
    groupRef.current.position.x = Math.sin(phase.current * 0.4) * 0.05
  })

  return (
    <group ref={groupRef}>
      <Line points={wave0} color={CYAN} lineWidth={2} transparent opacity={0.85} />
      <Line points={wave1} color="#06b6d4" lineWidth={2} transparent opacity={0.65} />
      <Line
        points={combined}
        color="#e2e8f0"
        lineWidth={1.5}
        transparent
        opacity={0.5}
        dashed
        dashSize={0.08}
        gapSize={0.06}
      />
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[6.2, 2.4]} />
        <meshBasicMaterial color={NAVY} transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

function AmplitudeBars({ p0, p1 }: { p0: number; p1: number }) {
  return (
    <group position={[0, -1.1, 0]}>
      <mesh position={[-0.6, p0 * 0.5, 0]}>
        <boxGeometry args={[0.35, Math.max(0.05, p0), 0.2]} />
        <meshStandardMaterial color={CYAN} emissive="#0e7490" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.6, p1 * 0.5, 0]}>
        <boxGeometry args={[0.35, Math.max(0.05, p1), 0.2]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0e7490" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

export function SuperpositionWaveScene() {
  const [theta, setTheta] = useState(Math.PI / 2)

  const { amp0, amp1, p0, p1 } = useMemo(() => {
    const state = qubitFromAngles(theta, 0)
    const a0 = Math.abs(state.alpha.re)
    const a1 = Math.abs(state.beta.re)
    return {
      amp0: a0,
      amp1: a1,
      p0: a0 * a0,
      p1: a1 * a1,
    }
  }, [theta])

  return (
    <div>
      <div className="border-b border-cyan-electric/10 bg-navy-900/40 px-4 py-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="flex justify-between font-mono text-slate-400">
            <span>θ — |0⟩ ↔ |1⟩ karışımı</span>
            <span className="text-cyan-glow">{((theta * 180) / Math.PI).toFixed(0)}°</span>
          </span>
          <input
            type="range"
            min={0}
            max={Math.PI}
            step={0.02}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            className="accent-cyan-electric"
          />
        </label>
        <div className="mt-2 flex gap-4 font-mono text-xs text-slate-500">
          <span>|α| = {amp0.toFixed(2)}</span>
          <span>|β| = {amp1.toFixed(2)}</span>
        </div>
      </div>

      <SceneCanvas camera={{ position: [0, 0.3, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 3]} intensity={0.7} />
        <WaveLines amp0={amp0} amp1={amp1} />
        <AmplitudeBars p0={p0} p1={p1} />
      </SceneCanvas>

      <div className="flex justify-center gap-8 border-t border-cyan-electric/10 bg-navy-900/30 px-4 py-2 font-mono text-xs text-slate-400">
        <span>|0⟩ olasılık: {(p0 * 100).toFixed(0)}%</span>
        <span>|1⟩ olasılık: {(p1 * 100).toFixed(0)}%</span>
      </div>

      <SceneCaption>
        İki dalga |0⟩ ve |1⟩ genliklerini temsil eder; kesikli çizgi süperpozisyon toplamını
        gösterir. θ=90° eşit karışım (|+⟩), θ=0° saf |0⟩ demektir — QAOA başlangıcı genelde
        eşit süperpozisyondan başlar.
      </SceneCaption>
    </div>
  )
}
