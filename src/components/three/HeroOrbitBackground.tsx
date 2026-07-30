import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSceneMotion } from './hooks/useSceneMotion'
import { SceneMotionContext } from './SceneMotionContext'

const HeroOrbitContent = lazy(() =>
  import('./scenes/HeroOrbit').then((m) => ({
    default: m.HeroOrbitSceneContent,
  })),
)

export function HeroOrbitBackground() {
  const motion = useSceneMotion()

  return (
    <div
      ref={motion.containerRef}
      className="pointer-events-none absolute inset-0 opacity-[0.22]"
      aria-hidden
    >
      <SceneMotionContext.Provider
        value={{ animate: motion.animate, reducedMotion: motion.reducedMotion }}
      >
        <Canvas
          dpr={[1, 1.5]}
          frameloop={motion.animate ? 'always' : 'never'}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          camera={{ position: [0, 0.4, 3.2], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <HeroOrbitContent />
          </Suspense>
        </Canvas>
      </SceneMotionContext.Provider>
    </div>
  )
}
