import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Sphere } from '@react-three/drei'
import type { Mesh } from 'three'
import { Vector3 } from 'three'
import { blochCoords, measureQubit, qubitFromAngles } from '../../../lib/quantum/statevector'
import { SceneCanvas } from '../SceneCanvas'
import { SceneCaption } from '../SceneCaption'
import { useSceneMotionContext } from '../SceneMotionContext'

const CYAN = '#22d3ee'
const CYAN_DIM = '#0891b2'
const SLATE = '#334155'

function BlochArrow({
  theta,
  phi,
  flash,
  measured,
}: {
  theta: number
  phi: number
  flash: boolean
  measured: 0 | 1 | null
}) {
  const tipRef = useRef<Mesh>(null)
  const shaftRef = useRef<Mesh>(null)
  const { animate } = useSceneMotionContext()

  const target = useMemo(() => {
    if (measured === 0) return { x: 0, y: 0, z: 1 }
    if (measured === 1) return { x: 0, y: 0, z: -1 }
    const state = qubitFromAngles(theta, phi)
    return blochCoords(state)
  }, [theta, phi, measured])

  const pos = useRef({ x: target.x, y: target.y, z: target.z })

  const up = useMemo(() => new Vector3(0, 1, 0), [])
  const dir = useMemo(() => new Vector3(), [])

  useFrame((_, delta) => {
    const lerp = animate ? Math.min(1, delta * 6) : 1
    pos.current.x += (target.x - pos.current.x) * lerp
    pos.current.y += (target.y - pos.current.y) * lerp
    pos.current.z += (target.z - pos.current.z) * lerp

    const { x, y, z } = pos.current
    const len = Math.sqrt(x * x + y * y + z * z) || 0.001

    if (tipRef.current) {
      tipRef.current.position.set(x, y, z)
    }
    if (shaftRef.current) {
      shaftRef.current.position.set(x / 2, y / 2, z / 2)
      shaftRef.current.scale.set(1, len, 1)
      dir.set(x / len, y / len, z / len)
      shaftRef.current.quaternion.setFromUnitVectors(up, dir)
    }
  })

  const flashScale = flash ? 1.35 : 1

  return (
    <group>
      <mesh ref={shaftRef}>
        <cylinderGeometry args={[0.012, 0.012, 1, 8]} />
        <meshStandardMaterial color={CYAN} transparent opacity={0.75} />
      </mesh>
      <mesh ref={tipRef} scale={flashScale * 0.08}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={flash ? '#ffffff' : CYAN}
          emissive={flash ? CYAN : '#0e7490'}
          emissiveIntensity={flash ? 1.2 : 0.4}
        />
      </mesh>
    </group>
  )
}

function BlochScene({
  theta,
  phi,
  flash,
  measured,
}: {
  theta: number
  phi: number
  flash: boolean
  measured: 0 | 1 | null
}) {
  const { animate } = useSceneMotionContext()
  const ringRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!ringRef.current || !animate) return
    ringRef.current.rotation.y += delta * 0.15
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={0.9} color="#e2e8f0" />
      <directionalLight position={[-3, -1, 2]} intensity={0.25} color={CYAN_DIM} />

      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="#0a1628" wireframe transparent opacity={0.35} />
      </Sphere>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.01, 0.004, 8, 64]} />
        <meshBasicMaterial color={CYAN_DIM} transparent opacity={0.5} />
      </mesh>
      <Line points={[[0, 0, 1.15], [0, 0, -1.15]]} color={SLATE} lineWidth={1} />
      <Line points={[[1.15, 0, 0], [-1.15, 0, 0]]} color={SLATE} lineWidth={1} transparent opacity={0.6} />

      <BlochArrow theta={theta} phi={phi} flash={flash} measured={measured} />
    </>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="flex justify-between font-mono text-slate-400">
        <span>{label}</span>
        <span className="text-cyan-glow">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-cyan-electric"
      />
    </label>
  )
}

export function BlochSphereScene() {
  const [theta, setTheta] = useState(Math.PI / 3)
  const [phi, setPhi] = useState(Math.PI / 4)
  const [flash, setFlash] = useState(false)
  const [measured, setMeasured] = useState<0 | 1 | null>(null)

  const state = useMemo(() => qubitFromAngles(theta, phi), [theta, phi])
  const p0 = (Math.cos(theta / 2) ** 2 * 100).toFixed(0)
  const p1 = (Math.sin(theta / 2) ** 2 * 100).toFixed(0)

  const handleMeasure = () => {
    const { outcome } = measureQubit(state)
    setMeasured(outcome)
    setFlash(true)
    window.setTimeout(() => setFlash(false), 350)
  }

  const handleReset = () => {
    setMeasured(null)
    setFlash(false)
  }

  return (
    <div>
      <div className="grid gap-3 border-b border-cyan-electric/10 bg-navy-900/40 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2 sm:grid-cols-2">
          <SliderRow
            label="θ (polar)"
            value={theta}
            min={0}
            max={Math.PI}
            step={0.02}
            display={`${((theta * 180) / Math.PI).toFixed(0)}°`}
            onChange={(v) => {
              setMeasured(null)
              setTheta(v)
            }}
          />
          <SliderRow
            label="φ (azimuthal)"
            value={phi}
            min={0}
            max={2 * Math.PI}
            step={0.02}
            display={`${((phi * 180) / Math.PI).toFixed(0)}°`}
            onChange={(v) => {
              setMeasured(null)
              setPhi(v)
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleMeasure}
            className="rounded-md border border-cyan-electric/40 bg-cyan-deep/20 px-3 py-1.5 text-xs font-medium text-cyan-glow hover:bg-cyan-deep/35"
          >
            Ölç
          </button>
          {measured !== null ? (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-slate-600 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Sıfırla
            </button>
          ) : null}
        </div>
      </div>

      <SceneCanvas camera={{ position: [1.8, 1.2, 2.6], fov: 42 }}>
        <BlochScene theta={theta} phi={phi} flash={flash} measured={measured} />
      </SceneCanvas>

      <div className="flex justify-center gap-6 border-t border-cyan-electric/10 bg-navy-900/30 px-4 py-2 font-mono text-xs text-slate-400">
        <span>P(|0⟩) = {p0}%</span>
        <span>P(|1⟩) = {p1}%</span>
        {measured !== null ? (
          <span className="text-cyan-glow">Sonuç: |{measured}⟩</span>
        ) : null}
      </div>

      <SceneCaption>
        Bloch küresi tek qubit durumunu görselleştirir: ok |ψ⟩ yönünü, θ/φ açıları süperpozisyon
        karışımını gösterir. Ölçüm oku kuzey (|0⟩) veya güney (|1⟩) kutbuna indirir — optimizasyonda
        algoritma olasılıkları kaydırmaya çalışır.
      </SceneCaption>
    </div>
  )
}
