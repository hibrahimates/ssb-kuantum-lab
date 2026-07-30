import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Points } from 'three'
import { SceneCanvas } from '../SceneCanvas'
import { SceneCaption } from '../SceneCaption'
import { useSceneMotionContext } from '../SceneMotionContext'

const CYAN = '#22d3ee'

function NoiseCloudPoints({ density }: { density: number }) {
  const ref = useRef<Points>(null)
  const { animate } = useSceneMotionContext()
  const count = 600

  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.6 + Math.random() * 0.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      sd[i] = Math.random() * Math.PI * 2
    }
    return { positions: pos, seeds: sd }
  }, [])

  useFrame((state) => {
    if (!ref.current || !animate) return
    const t = state.clock.elapsedTime
    const attr = ref.current.geometry.attributes.position
    const arr = attr.array as Float32Array
    const jitter = density * 0.18

    for (let i = 0; i < count; i++) {
      const baseX = positions[i * 3]
      const baseY = positions[i * 3 + 1]
      const baseZ = positions[i * 3 + 2]
      const s = seeds[i]
      arr[i * 3] = baseX + Math.sin(t * 1.2 + s) * jitter
      arr[i * 3 + 1] = baseY + Math.cos(t * 0.9 + s * 1.3) * jitter
      arr[i * 3 + 2] = baseZ + Math.sin(t * 1.5 + s * 0.7) * jitter
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={CYAN}
        size={0.035 + density * 0.025}
        transparent
        opacity={0.35 + density * 0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function IdealCore() {
  return (
    <mesh>
      <sphereGeometry args={[0.35, 24, 24]} />
      <meshStandardMaterial
        color="#0a1628"
        emissive="#0891b2"
        emissiveIntensity={0.35}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

export function NoiseCloudScene() {
  const [density, setDensity] = useState(0.45)

  return (
    <div>
      <div className="border-b border-cyan-electric/10 bg-navy-900/40 px-4 py-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="flex justify-between font-mono text-slate-400">
            <span>Gürültü / decoherence yoğunluğu</span>
            <span className="text-cyan-glow">{(density * 100).toFixed(0)}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="accent-cyan-electric"
          />
        </label>
      </div>

      <SceneCanvas camera={{ position: [0, 0, 2.4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 2, 3]} intensity={0.6} color="#e2e8f0" />
        <IdealCore />
        <NoiseCloudPoints density={density} />
      </SceneCanvas>

      <div className="flex justify-center gap-4 border-t border-cyan-electric/10 bg-navy-900/30 px-4 py-2 font-mono text-xs text-slate-400">
        <span>Simülatör: net çekirdek</span>
        <span>QPU: bulut genişledikçe sinyal kaybolur</span>
      </div>

      <SceneCaption>
        Merkezdeki tel kafes ideal kuantum durumu temsil eder; dış bulut gate hatası ve
        decoherence ile genişler. Devre derinliği arttıkça bulut yoğunlaşır — NISQ&apos;ta p
        seçimi bu trade-off&apos;u yönetir.
      </SceneCaption>
    </div>
  )
}
