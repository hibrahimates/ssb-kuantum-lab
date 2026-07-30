import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ModuleContent } from '../../content/modules/types'
import { isPaused, isSpeaking, pauseSpeaking, resumeSpeaking, speak, stopSpeaking } from '../../lib/tts'

export interface TourStep {
  id: string
  label: string
  text: string
}

function buildTourSteps(content: ModuleContent): TourStep[] {
  const steps: TourStep[] = [
    {
      id: 'intro',
      label: 'Giriş',
      text: `${content.title}. ${content.subtitle}. Bu derste seni adım adım gezdireceğim.`,
    },
    {
      id: 'goal',
      label: 'Hedef',
      text: content.goalNarration ?? `Modül hedefi: ${content.goal}`,
    },
  ]

  if (content.analogy) {
    steps.push({
      id: 'analogy',
      label: 'Analoji',
      text:
        content.analogy.narration ??
        `${content.analogy.title}. ${content.analogy.text}`,
    })
  }

  for (const section of content.sections) {
    steps.push({
      id: section.id,
      label: section.title,
      text: section.narration ?? `${section.title}. ${section.body}`,
    })
  }

  steps.push({
    id: 'next-hook',
    label: 'Sıradaki',
    text: content.nextHook,
  })

  return steps
}

function scrollToStep(stepId: string): void {
  const el = document.querySelector(`[data-tour-id="${stepId}"]`)
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

interface LessonTourProps {
  content: ModuleContent
}

type TourState = 'idle' | 'playing' | 'paused'

export function LessonTour({ content }: LessonTourProps) {
  const steps = useMemo(() => buildTourSteps(content), [content])
  const [state, setState] = useState<TourState>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [activeId, setActiveId] = useState<string | null>(null)
  const cancelRef = useRef(false)
  const indexRef = useRef(0)

  const clearHighlight = useCallback(() => {
    document.querySelectorAll('[data-tour-active="true"]').forEach((node) => {
      node.removeAttribute('data-tour-active')
    })
  }, [])

  const highlight = useCallback(
    (stepId: string) => {
      clearHighlight()
      const el = document.querySelector(`[data-tour-id="${stepId}"]`)
      if (el instanceof HTMLElement) {
        el.setAttribute('data-tour-active', 'true')
      }
      setActiveId(stepId)
      scrollToStep(stepId)
    },
    [clearHighlight],
  )

  const playFrom = useCallback(
    (startIndex: number) => {
      cancelRef.current = false
      indexRef.current = startIndex
      setStepIndex(startIndex)
      setState('playing')

      const run = (i: number) => {
        if (cancelRef.current) return
        if (i >= steps.length) {
          clearHighlight()
          setState('idle')
          setActiveId(null)
          setStepIndex(0)
          return
        }
        const step = steps[i]
        indexRef.current = i
        setStepIndex(i)
        highlight(step.id)
        speak(step.text, {
          onDone: () => {
            if (cancelRef.current) return
            // Kısa nefes — onboarding hissi
            window.setTimeout(() => run(i + 1), 350)
          },
        })
      }

      stopSpeaking()
      window.setTimeout(() => run(startIndex), 50)
    },
    [steps, highlight, clearHighlight],
  )

  const handleStart = () => playFrom(0)

  const handlePauseResume = () => {
    if (state === 'playing') {
      pauseSpeaking()
      setState('paused')
      return
    }
    if (state === 'paused') {
      resumeSpeaking()
      setState('playing')
    }
  }

  const handleStop = () => {
    cancelRef.current = true
    stopSpeaking()
    clearHighlight()
    setState('idle')
    setActiveId(null)
  }

  const handleSkip = () => {
    if (state === 'idle') return
    cancelRef.current = true
    stopSpeaking()
    const next = indexRef.current + 1
    cancelRef.current = false
    playFrom(next)
  }

  const handleJump = (index: number) => {
    cancelRef.current = true
    stopSpeaking()
    playFrom(index)
  }

  useEffect(() => {
    return () => {
      cancelRef.current = true
      stopSpeaking()
      clearHighlight()
    }
  }, [content.slug, clearHighlight])

  // Pause state sync (browser may end speech externally)
  useEffect(() => {
    if (state === 'idle') return
    const id = window.setInterval(() => {
      if (cancelRef.current) return
      if (isPaused()) setState('paused')
      else if (isSpeaking()) setState('playing')
    }, 400)
    return () => window.clearInterval(id)
  }, [state])

  const progress = steps.length === 0 ? 0 : Math.round(((stepIndex + (state === 'idle' ? 0 : 1)) / steps.length) * 100)

  return (
    <div className="mb-8 rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-white">Rehber anlatım</h2>
          <p className="mt-1 text-xs text-slate-500">
            Dersi baştan sona dinle — ilgili bölüm vurgulanır, bitince sonrakine geçer.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {state === 'idle' ? (
            <button
              type="button"
              onClick={handleStart}
              className="rounded-md bg-cyan-electric/25 px-3 py-1.5 text-xs font-semibold text-cyan-glow hover:bg-cyan-electric/40"
            >
              Dersi anlat
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handlePauseResume}
                className="rounded-md border border-cyan-electric/30 px-3 py-1.5 text-xs font-medium text-cyan-glow hover:bg-cyan-electric/10"
              >
                {state === 'paused' ? 'Devam' : 'Duraklat'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="rounded-md border border-slate-600/50 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500"
              >
                Sonraki bölüm
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="rounded-md border border-slate-600/50 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Durdur
              </button>
            </>
          )}
        </div>
      </div>

      {state !== 'idle' ? (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
            <span>
              {stepIndex + 1}/{steps.length}: {steps[stepIndex]?.label}
            </span>
            <span>%{Math.min(100, progress)}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-navy-950">
            <div
              className="h-full rounded-full bg-cyan-electric/70 transition-all duration-500"
              style={{ width: `${Math.min(100, ((stepIndex + 1) / steps.length) * 100)}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {steps.map((step, i) => (
          <button
            key={step.id}
            type="button"
            onClick={() => handleJump(i)}
            className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
              activeId === step.id
                ? 'bg-cyan-electric/25 text-cyan-glow'
                : 'bg-navy-950/60 text-slate-500 hover:text-slate-300'
            }`}
            title={step.label}
          >
            {i + 1}. {step.label.length > 18 ? `${step.label.slice(0, 16)}…` : step.label}
          </button>
        ))}
      </div>
    </div>
  )
}
