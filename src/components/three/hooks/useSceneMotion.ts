import { useEffect, useRef, useState } from 'react'

export interface SceneMotionState {
  animate: boolean
  reducedMotion: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function useSceneMotion(): SceneMotionState {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [inViewport, setInViewport] = useState(true)
  const [tabVisible, setTabVisible] = useState(
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry?.isIntersecting ?? true),
      { rootMargin: '80px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const animate = !reducedMotion && inViewport && tabVisible

  return { animate, reducedMotion, containerRef }
}
