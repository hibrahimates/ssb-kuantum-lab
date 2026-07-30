import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { SceneCanvas } from '../SceneCanvas'
import { SceneCaption } from '../SceneCaption'
import { useSceneMotionContext } from '../SceneMotionContext'

const CYAN = '#22d3ee'

/** Toy QAOA-like cost landscape C(γ, β). */
function costSurface(gamma: number, beta: number): number {
  const g = gamma * Math.PI * 2
  const b = beta * Math.PI * 2
  return (
    0.6 * Math.sin(g * 2.1) * Math.cos(b * 1.7) +
    0.35 * Math.cos(g * 1.3 + 0.5) * Math.sin(b * 2.4) +
    0.15 * Math.sin(g * 4 + b * 3)
  )
}

function LandscapeMesh() {
  const geom = useMemo(() => {
    const size = 2.2
    const segs = 40
    const positions: number[] = []
    const indices: number[] = []

    for (let iy = 0; iy <= segs; iy++) {
      for (let ix = 0; ix <= segs; ix++) {
        const u = ix / segs
        const v = iy / segs
        const x = (u - 0.5) * size * 2
        const z = (v - 0.5) * size * 2
        const gamma = u
        const beta = v
        const y = costSurface(gamma, beta) * 0.55
        positions.push(x, y, z)
      }
    }

    for (let iy = 0; iy < segs; iy++) {
      for (let ix = 0; ix < segs; ix++) {
        const a = iy * (segs + 1) + ix
        const b = a + 1
        const c = a + segs + 1
        const d = c + 1
        indices.push(a, c, b, b, c, d)
      }
    }

    return { positions: new Float32Array(positions), indices }
  }, [])

  return (
    <mesh rotation={[-0.35, 0.4, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geom.positions, 3]} />
        <bufferAttribute attach="index" args={[new Uint16Array(geom.indices), 1]} />
      </bufferGeometry>
      <meshStandardMaterial
        color="#0f2137"
        emissive="#0891b2"
        emissiveIntensity={0.15}
        wireframe
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function ParamMarker({ gamma, beta }: { gamma: number; beta: number }) {
  const ref = useRef<Mesh>(null)
  const { animate } = useSceneMotionContext()
  const size = 2.2

  const target = useMemo(() => {
    const x = (gamma - 0.5) * size * 2
    const z = (beta - 0.5) * size * 2
    const y = costSurface(gamma, beta) * 0.55 + 0.08
    return { x, y, z }
  }, [gamma, beta, size])

  useFrame((_, delta) => {
    if (!ref.current) return
    const lerp = animate ? Math.min(1, delta * 5) : 1
    ref.current.position.x += (target.x - ref.current.position.x) * lerp
    ref.current.position.y += (target.y - ref.current.position.y) * lerp
    ref.current.position.z += (target.z - ref.current.position.z) * lerp
  })

  return (
    <group rotation={[-0.35, 0.4, 0]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export function EnergyLandscapeScene() {
  const [gamma, setGamma] = useState(0.35)
  const [beta, setBeta] = useState(0.55)
  const energy = costSurface(gamma, beta)

  return (
    <div>
      <div className="grid gap-3 border-b border-cyan-electric/10 bg-navy-900/40 px-4 py-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs">
          <span className="flex justify-between font-mono text-slate-400">
            <span>γ (cost katmanı)</span>
            <span className="text-cyan-glow">{gamma.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            className="accent-cyan-electric"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="flex justify-between font-mono text-slate-400">
            <span>β (mixer katmanı)</span>
            <span className="text-cyan-glow">{beta.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={beta}
            onChange={(e) => setBeta(Number(e.target.value))}
            className="accent-cyan-electric"
          />
        </label>
      </div>

      <SceneCanvas className="h-60 w-full" camera={{ position: [0, 2.2, 3.5], fov: 42 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 2]} intensity={0.8} color="#e2e8f0" />
        <directionalLight position={[-2, 1, -1]} intensity={0.2} color="#0891b2" />
        <LandscapeMesh />
        <ParamMarker gamma={gamma} beta={beta} />
      </SceneCanvas>

      <div className="flex justify-center gap-6 border-t border-cyan-electric/10 bg-navy-900/30 px-4 py-2 font-mono text-xs text-slate-400">
        <span>⟨H_C⟩ ≈ {energy.toFixed(3)}</span>
        <span className="text-slate-500">Düşük = daha iyi aday bitstring</span>
      </div>

      <SceneCaption>
        QAOA klasik optimizer γ ve β parametrelerini bu tür bir maliyet yüzeyinde arar. Tepe
        noktaları (barren plateau) gradient&apos;i sıfırlar; vadiler düşük maliyetli çözümlere
        işaret eder.
      </SceneCaption>
    </div>
  )
}
