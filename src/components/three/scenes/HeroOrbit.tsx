import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useSceneMotionContext } from '../SceneMotionContext'

const CYAN = '#22d3ee'
const CYAN_DIM = '#0891b2'

function OrbitRing({
  radius,
  speed,
  tilt,
  opacity,
}: {
  radius: number
  speed: number
  tilt: [number, number, number]
  opacity: number
}) {
  const ref = useRef<Group>(null)
  const { animate } = useSceneMotionContext()

  useFrame((_, delta) => {
    if (!ref.current || !animate) return
    ref.current.rotation.y += delta * speed
  })

  return (
    <group ref={ref} rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.012, 6, 48]} />
        <meshBasicMaterial color={CYAN_DIM} transparent opacity={opacity} />
      </mesh>
    </group>
  )
}

function OrbitDot({ radius, speed, phase }: { radius: number; speed: number; phase: number }) {
  const ref = useRef<Group>(null)
  const { animate } = useSceneMotionContext()

  useFrame((state) => {
    if (!ref.current) return
    const t = animate ? state.clock.elapsedTime * speed + phase : phase
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * 0.15, Math.sin(t) * radius)
  })

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

export function HeroOrbitSceneContent() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <OrbitRing radius={0.9} speed={0.12} tilt={[Math.PI / 3, 0.2, 0]} opacity={0.25} />
      <OrbitRing radius={1.15} speed={-0.08} tilt={[0.5, 0.8, 0.1]} opacity={0.18} />
      <OrbitRing radius={0.65} speed={0.18} tilt={[1.1, 0, 0.4]} opacity={0.15} />
      <OrbitDot radius={0.9} speed={0.35} phase={0} />
      <OrbitDot radius={1.15} speed={0.22} phase={1.8} />
      <OrbitDot radius={0.65} speed={0.45} phase={3.1} />
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
      </mesh>
    </>
  )
}

/** Full scene wrapper for registry / SceneHost. */
export function HeroOrbitScene() {
  return (
    <div className="flex h-48 items-center justify-center bg-navy-950/60">
      <p className="text-xs text-slate-500">Hero orbit — ana sayfa arka planında kullanılır.</p>
    </div>
  )
}
