import { Suspense } from 'react'
import type { Scene3dId } from '../../content/modules/types'
import { useSceneMotion } from './hooks/useSceneMotion'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { SceneMotionContext } from './SceneMotionContext'
import { SCENE_LABELS, SCENE_REGISTRY } from './registry'

interface SceneHostProps {
  id: Scene3dId
}

function SceneFallback({ label }: { label: string }) {
  return (
    <div className="flex h-56 items-center justify-center bg-navy-950/60">
      <div className="text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-pulse rounded-full border border-cyan-electric/30" />
        <p className="font-mono text-xs text-slate-500">{label} yükleniyor…</p>
      </div>
    </div>
  )
}

export function SceneHost({ id }: SceneHostProps) {
  const Scene = SCENE_REGISTRY[id]
  const motion = useSceneMotion()
  const label = SCENE_LABELS[id]

  return (
    <div
      ref={motion.containerRef}
      className="mt-4 overflow-hidden rounded-xl border border-cyan-electric/20 bg-navy-900/50"
      aria-label={`3D sahne: ${label}`}
    >
      <SceneMotionContext.Provider value={{ animate: motion.animate, reducedMotion: motion.reducedMotion }}>
        <SceneErrorBoundary>
          <Suspense fallback={<SceneFallback label={label} />}>
            <Scene />
          </Suspense>
        </SceneErrorBoundary>
      </SceneMotionContext.Provider>
    </div>
  )
}
