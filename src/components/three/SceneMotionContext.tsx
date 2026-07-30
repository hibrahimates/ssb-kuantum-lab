import { createContext, useContext } from 'react'

export interface SceneMotionContextValue {
  animate: boolean
  reducedMotion: boolean
}

export const SceneMotionContext = createContext<SceneMotionContextValue>({
  animate: true,
  reducedMotion: false,
})

export function useSceneMotionContext(): SceneMotionContextValue {
  return useContext(SceneMotionContext)
}
