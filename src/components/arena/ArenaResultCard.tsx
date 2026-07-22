import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  ARENA_QUESTIONS,
  FORMULATION_TASK,
  getTopicBreakdownData,
  type ArenaResult,
} from '../../content/arena'
import { formatScore } from '../../lib/scoring'

interface ArenaResultCardProps {
  result: ArenaResult
  onRetry: () => void
}

function barColor(score: number): string {
  if (score >= 70) return 'rgba(52, 211, 153, 0.75)'
  if (score >= 50) return 'rgba(6, 182, 212, 0.75)'
  return 'rgba(251, 191, 36, 0.75)'
}

export function ArenaResultCard({ result, onRetry }: ArenaResultCardProps) {
  const [showReview, setShowReview] = useState(false)

  const topicData = getTopicBreakdownData(result.exam.topicCorrect)
  const wrongQuestions = ARENA_QUESTIONS.filter(
    (_, i) => result.exam.answers[i] !== ARENA_QUESTIONS[i].correctIndex,
  )
  const wrongSteps = FORMULATION_TASK.steps.filter((step) => {
    const selId = result.formulation.selections[step.id]
    const choice = step.choices.find((c) => c.id === selId)
    return !choice?.correct
  })

  const passed = result.totalPercent >= 70

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div
        className={`rounded-xl border p-6 ${
          passed
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-amber-500/30 bg-amber-500/5'
        }`}
      >
        <h2 className="font-display text-2xl font-semibold text-white">
          {passed ? 'Güçlü performans!' : 'Gelişim alanların var'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Toplam skor (%70 sınav + %30 formülasyon ağırlıklı)
        </p>
        <p className="mt-3 text-4xl font-bold text-gradient-cyan">
          {formatScore(result.totalPercent)}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
          <span>
            Sınav: {formatScore(result.examPercent)} ({result.exam.correctCount}/
            {ARENA_QUESTIONS.length})
          </span>
          <span>
            Formülasyon: {formatScore(result.formulationPercent)} (
            {result.formulation.correctCount}/{result.formulation.totalSteps})
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-electric/10 bg-navy-800/30 p-4">
        <h3 className="mb-4 text-sm font-medium text-slate-400">Konu bazlı sınav dağılımı</h3>
        <div className="h-52 sm:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} margin={{ bottom: 8 }}>
              <XAxis
                dataKey="topic"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={56}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`%${value}`, 'Skor']}
                contentStyle={{
                  background: '#0f2137',
                  border: '1px solid rgba(6,182,212,0.2)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {topicData.map((entry, index) => (
                  <Cell key={index} fill={barColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {(wrongQuestions.length > 0 || wrongSteps.length > 0) && (
        <div className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-4 sm:p-6">
          <button
            type="button"
            onClick={() => setShowReview(!showReview)}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-display text-lg font-semibold text-white">
              Yanlış cevapları incele
            </h3>
            <span className="text-sm text-cyan-glow">{showReview ? 'Gizle ▲' : 'Göster ▼'}</span>
          </button>

          {showReview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 space-y-4"
            >
              {wrongQuestions.map((q) => {
                const qIndex = ARENA_QUESTIONS.indexOf(q)
                const userAnswer = result.exam.answers[qIndex]
                return (
                  <div
                    key={q.id}
                    className="rounded-lg border border-red-500/20 bg-navy-950/40 p-4"
                  >
                    <p className="text-sm font-medium text-white">{q.question}</p>
                    {userAnswer !== null && (
                      <p className="mt-2 text-xs text-red-300">
                        Senin cevabın: {q.options[userAnswer]}
                      </p>
                    )}
                    {userAnswer === null && (
                      <p className="mt-2 text-xs text-amber-300">Boş bırakıldı</p>
                    )}
                    <p className="mt-2 text-xs text-emerald-300">
                      Doğru: {q.options[q.correctIndex]}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{q.explanation}</p>
                  </div>
                )
              })}

              {wrongSteps.map((step) => {
                const selId = result.formulation.selections[step.id]
                const sel = step.choices.find((c) => c.id === selId)
                const correct = step.choices.find((c) => c.correct)
                return (
                  <div
                    key={step.id}
                    className="rounded-lg border border-amber-500/20 bg-navy-950/40 p-4"
                  >
                    <p className="text-xs uppercase text-slate-500">{step.title}</p>
                    <p className="mt-1 text-sm font-medium text-white">{step.prompt}</p>
                    {sel && (
                      <p className="mt-2 text-xs text-red-300">Senin seçimin: {sel.label}</p>
                    )}
                    {correct && (
                      <p className="mt-1 text-xs text-emerald-300">
                        Doğru: {correct.label}
                      </p>
                    )}
                    {correct && (
                      <p className="mt-2 text-sm text-slate-400">{correct.explanation}</p>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-cyan-electric/30 px-4 py-2 text-sm font-medium text-cyan-glow transition-colors hover:bg-cyan-electric/10"
        >
          Arenayı yeniden dene
        </button>
        <Link
          to="/yol"
          className="rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-4 py-2 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
        >
          Modüllere dön
        </Link>
        <Link
          to="/hackathon"
          className="rounded-lg border border-slate-700/80 px-4 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-electric/30"
        >
          Hackathon playbook →
        </Link>
      </div>
    </motion.div>
  )
}
