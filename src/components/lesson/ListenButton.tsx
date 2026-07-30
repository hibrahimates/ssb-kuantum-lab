import { useCallback, useEffect, useState } from 'react'
import {
  isPaused,
  isSpeaking,
  pauseSpeaking,
  resumeSpeaking,
  speak,
  stopSpeaking,
} from '../../lib/tts'

interface ListenButtonProps {
  text: string
  label?: string
  className?: string
}

type ListenState = 'idle' | 'speaking' | 'paused'

function syncState(): ListenState {
  if (isPaused()) return 'paused'
  if (isSpeaking()) return 'speaking'
  return 'idle'
}

export function ListenButton({ text, label = 'Dinle', className = '' }: ListenButtonProps) {
  const [state, setState] = useState<ListenState>('idle')

  useEffect(() => {
    return () => {
      stopSpeaking()
    }
  }, [])

  useEffect(() => {
    const tick = setInterval(() => {
      setState((prev) => {
        const next = syncState()
        return next === prev ? prev : next
      })
    }, 250)
    return () => clearInterval(tick)
  }, [])

  const handleClick = useCallback(() => {
    if (state === 'speaking') {
      pauseSpeaking()
      setState('paused')
      return
    }
    if (state === 'paused') {
      resumeSpeaking()
      setState('speaking')
      return
    }
    speak(text)
    setState('speaking')
  }, [state, text])

  const handleStop = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      stopSpeaking()
      setState('idle')
    },
    [],
  )

  const buttonLabel =
    state === 'speaking' ? 'Duraklat' : state === 'paused' ? 'Devam' : label

  const icon = state === 'speaking' ? '⏸' : state === 'paused' ? '▶' : '🔊'

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 rounded-md border border-cyan-electric/25 bg-navy-800/60 px-2.5 py-1 text-xs font-medium text-cyan-glow transition-colors hover:border-cyan-electric/45 hover:bg-navy-800"
        aria-label={buttonLabel}
      >
        <span aria-hidden>{icon}</span>
        {buttonLabel}
      </button>
      {state !== 'idle' ? (
        <button
          type="button"
          onClick={handleStop}
          className="rounded-md border border-slate-600/40 px-2 py-1 text-xs text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200"
          aria-label="Durdur"
        >
          ⏹
        </button>
      ) : null}
    </span>
  )
}
