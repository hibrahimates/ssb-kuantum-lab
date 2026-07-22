import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FormulationTask } from '../../content/arena/types'

interface FormulationTaskProps {
  task: FormulationTask
  onComplete: (selections: Record<string, string>) => void
}

export function FormulationTaskPanel({ task, onComplete }: FormulationTaskProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)

  const step = task.steps[stepIndex]
  const selectedId = selections[step.id]
  const selectedChoice = step.choices.find((c) => c.id === selectedId)
  const isLast = stepIndex === task.steps.length - 1

  const handleSelect = (choiceId: string) => {
    if (showFeedback) return
    setSelections((prev) => ({ ...prev, [step.id]: choiceId }))
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (isLast) {
      onComplete({ ...selections, [step.id]: selectedId ?? '' })
      return
    }
    setStepIndex((i) => i + 1)
    setShowFeedback(false)
  }

  return (
    <div className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-4 sm:p-6">
      <div className="mb-2 text-xs uppercase tracking-wide text-cyan-electric/70">
        Formülasyon görevi
      </div>
      <h2 className="font-display text-lg font-semibold text-white sm:text-xl">{task.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{task.scenario}</p>

      <div className="mt-4 mb-6 flex items-center gap-2">
        {task.steps.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < stepIndex
                ? 'bg-emerald-500/60'
                : i === stepIndex
                  ? 'bg-cyan-electric/60'
                  : 'bg-navy-700/80'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-xs text-slate-500">
            Adım {stepIndex + 1} / {task.steps.length} — {step.title}
          </p>
          <h3 className="mt-1 mb-4 font-display text-base font-medium text-white">
            {step.prompt}
          </h3>

          <ul className="space-y-2">
            {step.choices.map((choice) => {
              let cls =
                'w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors '

              if (showFeedback) {
                if (choice.correct) {
                  cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                } else if (choice.id === selectedId) {
                  cls += 'border-red-500/50 bg-red-500/10 text-red-100'
                } else {
                  cls += 'border-slate-700/50 text-slate-500'
                }
              } else if (selectedId === choice.id) {
                cls += 'border-cyan-electric/50 bg-cyan-electric/10 text-white'
              } else {
                cls +=
                  'border-slate-700/80 text-slate-300 hover:border-cyan-electric/30 hover:bg-navy-700/50'
              }

              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    disabled={showFeedback}
                    onClick={() => handleSelect(choice.id)}
                    className={cls}
                  >
                    {choice.label}
                  </button>
                </li>
              )
            })}
          </ul>

          {showFeedback && selectedChoice && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-lg border p-4 ${
                selectedChoice.correct
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-amber-500/30 bg-amber-500/5'
              }`}
            >
              <p className="text-sm font-medium text-white">
                {selectedChoice.correct ? 'Doğru seçim' : 'Yanlış seçim'}
              </p>
              <p className="mt-2 text-sm text-slate-300">{selectedChoice.explanation}</p>
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-4 py-2 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
              >
                {isLast ? 'Sonuçları gör' : 'Sonraki adım'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
