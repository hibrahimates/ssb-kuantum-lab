import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ArenaQuestion } from '../../content/arena/types'

const EXAM_DURATION_SEC = 30 * 60

interface TimedExamProps {
  questions: ArenaQuestion[]
  useTimer: boolean
  onSubmit: (answers: (number | null)[]) => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function TimedExam({ questions, useTimer, onSubmit }: TimedExamProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null),
  )
  const [remainingSec, setRemainingSec] = useState(EXAM_DURATION_SEC)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const question = questions[currentIndex]
  const answeredCount = answers.filter((a) => a !== null).length
  const allAnswered = answeredCount === questions.length

  const handleSubmit = useCallback(() => {
    onSubmit(answers)
  }, [answers, onSubmit])

  useEffect(() => {
    if (!useTimer || timedOut) return
    if (remainingSec <= 0) {
      setTimedOut(true)
      handleSubmit()
      return
    }
    const id = window.setInterval(() => {
      setRemainingSec((s) => s - 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [useTimer, remainingSec, handleSubmit, timedOut])

  const selectAnswer = (index: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = index
      return next
    })
  }

  const goTo = (index: number) => {
    if (index >= 0 && index < questions.length) setCurrentIndex(index)
  }

  return (
    <div className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-slate-400">
          Deneme sınavı — {answeredCount}/{questions.length} cevaplandı
        </span>
        {useTimer && (
          <span
            className={`font-mono font-medium ${remainingSec < 300 ? 'text-amber-300' : 'text-cyan-glow'}`}
          >
            ⏱ {formatTime(remainingSec)}
          </span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const answered = answers[i] !== null
          const active = i === currentIndex
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => goTo(i)}
              className={`h-8 min-w-8 rounded-md px-2 text-xs font-medium transition-colors ${
                active
                  ? 'bg-cyan-electric/20 text-cyan-glow ring-1 ring-cyan-electric/40'
                  : answered
                    ? 'bg-emerald-500/15 text-emerald-200'
                    : 'bg-navy-700/60 text-slate-400 hover:bg-navy-700'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
            Soru {currentIndex + 1} / {questions.length}
          </p>
          <h3 className="mb-4 font-display text-base font-medium text-white sm:text-lg">
            {question.question}
          </h3>

          <ul className="space-y-2">
            {question.options.map((option, index) => {
              const selected = answers[currentIndex] === index
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => selectAnswer(index)}
                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? 'border-cyan-electric/50 bg-cyan-electric/10 text-white'
                        : 'border-slate-700/80 text-slate-300 hover:border-cyan-electric/30 hover:bg-navy-700/50'
                    }`}
                  >
                    {option}
                  </button>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => goTo(currentIndex - 1)}
            className="rounded-lg border border-slate-700/80 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-electric/30 disabled:opacity-40"
          >
            ← Önceki
          </button>
          <button
            type="button"
            disabled={currentIndex === questions.length - 1}
            onClick={() => goTo(currentIndex + 1)}
            className="rounded-lg border border-slate-700/80 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-electric/30 disabled:opacity-40"
          >
            Sonraki →
          </button>
        </div>

        {!confirmSubmit ? (
          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-4 py-2 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
          >
            Sınavı bitir
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {!allAnswered && (
              <span className="text-xs text-amber-300">
                {questions.length - answeredCount} soru boş
              </span>
            )}
            <button
              type="button"
              onClick={() => setConfirmSubmit(false)}
              className="rounded-lg border border-slate-700/80 px-3 py-2 text-sm text-slate-400"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-4 py-2 text-sm font-semibold text-navy-950"
            >
              Onayla ve gönder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
