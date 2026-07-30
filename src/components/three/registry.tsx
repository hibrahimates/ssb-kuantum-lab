import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { Scene3dId } from '../../content/modules/types'

type SceneComponent = ComponentType

export const SCENE_REGISTRY: Record<Scene3dId, LazyExoticComponent<SceneComponent>> = {
  'bloch-sphere': lazy(() =>
    import('./scenes/BlochSphere').then((m) => ({ default: m.BlochSphereScene })),
  ),
  'superposition-wave': lazy(() =>
    import('./scenes/SuperpositionWave').then((m) => ({ default: m.SuperpositionWaveScene })),
  ),
  'entangle-pair': lazy(() =>
    import('./scenes/EntanglePair').then((m) => ({ default: m.EntanglePairScene })),
  ),
  'energy-landscape': lazy(() =>
    import('./scenes/EnergyLandscape').then((m) => ({ default: m.EnergyLandscapeScene })),
  ),
  'noise-cloud': lazy(() =>
    import('./scenes/NoiseCloud').then((m) => ({ default: m.NoiseCloudScene })),
  ),
  'hero-orbit': lazy(() =>
    import('./scenes/HeroOrbit').then((m) => ({ default: m.HeroOrbitScene })),
  ),
}

export const SCENE_LABELS: Record<Scene3dId, string> = {
  'bloch-sphere': 'Bloch küresi — qubit durumu',
  'superposition-wave': 'Süperpozisyon dalgası',
  'entangle-pair': 'Dolaşık qubit çifti',
  'energy-landscape': 'QAOA enerji yüzeyi',
  'noise-cloud': 'NISQ gürültü bulutu',
  'hero-orbit': 'Hero orbit atmosferi',
}
