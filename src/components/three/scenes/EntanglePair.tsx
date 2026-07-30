import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Sphere } from '@react-three/drei'
import type { Group } from 'three'
import {
  createBellState,
  createProductState,
  qubitFromAngles,
  twoQubitProbabilities,
} from '../../../lib/quantum/statevector'
import { SceneCanvas } from '../SceneCanvas'
import { SceneCaption } from '../SceneCaption'
import { useSceneMotionContext } from '../SceneMotionContext'

const CYAN = '#22d3ee'
const SLATE = '#475569'

function QubitNode({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Sphere args={[0.22, 16, 16]}>
        <meshStandardMaterial color="#0a1628" emissive={CYAN} emissiveIntensity={0.25} wireframe />
      </Sphere>
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={CYAN} emissive="#0891b2" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function EntangleVisualization({ bell }: { bell: boolean }) {
  const linkRef = useRef<Group>(null)
  const { animate } = useSceneMotionContext()

  const probs = useMemo(() => {
    const amps = bell
      ? createBellState()
      : createProductState(qubitFromAngles(Math.PI / 3, 0), qubitFromAngles(Math.PI / 4, 0))
    return twoQubitProbabilities(amps)
  }, [bell])

  const linkOpacity = bell ? 0.95 : 0.35
  const pulse = bell ? 1 : 0.4

  useFrame((state) => {
    if (!linkRef.current || !animate) return
    const t = state.clock.elapsedTime
    linkRef.current.scale.y = pulse + Math.sin(t * 2) * 0.08 * pulse
  })

  const left = [-0.9, 0, 0] as [number, number, number]
  const right = [0.9, 0, 0] as [number, number, number]

  return (
    <>
      <QubitNode position={left} />
      <QubitNode position={right} />
      <group ref={linkRef}>
        <Line
          points={[left, right]}
          color={bell ? CYAN : SLATE}
          lineWidth={bell ? 2.5 : 1}
          transparent
          opacity={linkOpacity}
        />
        {bell ? (
          <Line
            points={[
              [-0.45, 0.35, 0],
              [0, 0.55, 0],
              [0.45, 0.35, 0],
            ]}
            color={CYAN}
            lineWidth={1.5}
            transparent
            opacity={0.6}
          />
        ) : null}
      </group>
      <group position={[0, -0.85, 0]}>
        {(['|00⟩', '|01⟩', '|10⟩', '|11⟩'] as const).map((label, i) => (
          <mesh key={label} position={[(i - 1.5) * 0.55, probs[i] * 0.35, 0]}>
            <boxGeometry args={[0.2, Math.max(0.04, probs[i] * 0.7), 0.15]} />
            <meshStandardMaterial
              color={bell && (i === 0 || i === 3) ? CYAN : '#334155'}
              emissive={bell && (i === 0 || i === 3) ? '#0891b2' : '#1e293b'}
              emissiveIntensity={0.35}
            />
          </mesh>
        ))}
      </group>
    </>
  )
}

export function EntanglePairScene() {
  const [bell, setBell] = useState(true)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-cyan-electric/10 bg-navy-900/40 px-4 py-3">
        <span className="text-xs text-slate-400">Durum:</span>
        <button
          type="button"
          onClick={() => setBell(false)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
            !bell
              ? 'border border-cyan-electric/50 bg-cyan-deep/25 text-cyan-glow'
              : 'border border-slate-600 text-slate-400 hover:text-slate-200'
          }`}
        >
          Product state
        </button>
        <button
          type="button"
          onClick={() => setBell(true)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
            bell
              ? 'border border-cyan-electric/50 bg-cyan-deep/25 text-cyan-glow'
              : 'border border-slate-600 text-slate-400 hover:text-slate-200'
          }`}
        >
          Bell |Φ⁺⟩
        </button>
      </div>

      <SceneCanvas camera={{ position: [0, 0.2, 3], fov: 48 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 3, 2]} intensity={0.75} />
        <EntangleVisualization bell={bell} />
      </SceneCanvas>

      <div className="flex justify-center gap-4 border-t border-cyan-electric/10 bg-navy-900/30 px-4 py-2 font-mono text-xs text-slate-400">
        {bell ? (
          <>
            <span>P(|00⟩) ≈ 50%</span>
            <span>P(|11⟩) ≈ 50%</span>
            <span className="text-cyan-glow">|01⟩, |10⟩ ≈ 0</span>
          </>
        ) : (
          <span>Bağımsız qubitler — tüm |00⟩…|11⟩ kombinasyonları mümkün</span>
        )}
      </div>

      <SceneCaption>
        Product state qubitleri bağımsız temsil eder; Bell durumu |00⟩ ve |11⟩ arasında
        dolaşık korelasyon kurar — birini ölçmek diğerini anında belirler. QAOA ansatz&apos;ı
        bu korelasyonları keşif için kullanır.
      </SceneCaption>
    </div>
  )
}
