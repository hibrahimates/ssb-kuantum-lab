import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useSceneMotionContext } from './SceneMotionContext'

interface SceneCanvasProps {
  children: ReactNode
  className?: string
  camera?: { position: [number, number, number]; fov?: number }
}

export function SceneCanvas({
  children,
  className = 'h-56 w-full',
  camera = { position: [0, 0, 3.2], fov: 45 },
}: SceneCanvasProps) {
  const { animate } = useSceneMotionContext()

  return (
    <div className={`relative overflow-hidden bg-navy-950/60 ${className}`}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={animate ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        camera={camera}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#050d18']} />
        <fog attach="fog" args={['#050d18', 4, 9]} />
        {children}
      </Canvas>
    </div>
  )
}
