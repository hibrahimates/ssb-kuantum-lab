import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { QuizQuestion } from '../../content/modules/types'
import { calculateScorePercent, isUnlocked } from '../../lib/scoring'
import {
  markModuleComplete,
  notifyProgressChange,
  saveQuizScore,
} from '../../lib/progress'
import { ResultCard } from './ResultCard'

interface QuizEngineProps {
  moduleSlug: string
  questions: QuizQuestion[]
}

export function QuizEngine({ moduleSlug, questions }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalCorrect, setFinalCorrect] = useState(0)

  const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const handleSelect = (index: number) => {
    if (showExplanation) return
    setSelectedIndex(index)
    setShowExplanation(true)
    if (index === question.correctIndex) {
      setCorrectCount((c) => c + 1)
    }
  }

  const handleNext = () => {
    if (isLast) {
      const score = calculateScorePercent(correctCount, questions.length)
      setFinalScore(score)
      setFinalCorrect(correctCount)
      saveQuizScore(moduleSlug, score)
      if (isUnlocked(score)) {
        markModuleComplete(moduleSlug)
      }
      notifyProgressChange()
      setFinished(true)
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelectedIndex(null)
    setShowExplanation(false)
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedIndex(null)
    setShowExplanation(false)
    setCorrectCount(0)
    setFinished(false)
    setFinalScore(0)
    setFinalCorrect(0)
  }

  if (questions.length === 0) {
    return (
      <p className="text-sm text-slate-500">Bu modül için henüz quiz eklenmedi.</p>
    )
  }

  if (finished) {
    return (
      <ResultCard
        scorePercent={finalScore}
        correct={finalCorrect}
        total={questions.length}
        passed={isUnlocked(finalScore)}
        onRetry={!isUnlocked(finalScore) ? handleRetry : undefined}
      />
    )
  }

  return (
    <div className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-6">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <span>Modül Quizi</span>
        <span>
          Soru {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="mb-4 font-display text-lg font-medium text-white">
            {question.question}
          </h3>

          <ul className="space-y-2">
            {question.options.map((option, index) => {
              let optionClass =
                'w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors '

              if (showExplanation) {
                if (index === question.correctIndex) {
                  optionClass += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                } else if (index === selectedIndex) {
                  optionClass += 'border-red-500/50 bg-red-500/10 text-red-100'
                } else {
                  optionClass += 'border-slate-700/50 text-slate-500'
                }
              } else if (selectedIndex === index) {
                optionClass += 'border-cyan-electric/50 bg-cyan-electric/10 text-white'
              } else {
                optionClass +=
                  'border-slate-700/80 text-slate-300 hover:border-cyan-electric/30 hover:bg-navy-700/50'
              }

              return (
                <li key={index}>
                  <button
                    type="button"
                    disabled={showExplanation}
                    onClick={() => handleSelect(index)}
                    className={optionClass}
                  >
                    {option}
                  </button>
                </li>
              )
            })}
          </ul>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg border border-cyan-electric/20 bg-navy-950/60 p-4"
            >
              <p className="text-sm text-slate-300">{question.explanation}</p>
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-4 py-2 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
              >
                {isLast ? 'Sonuçları gör' : 'Sonraki soru'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
