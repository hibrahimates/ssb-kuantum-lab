import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ARENA_QUESTIONS,
  ARENA_EXAM_COUNT,
  FORMULATION_TASK,
  buildArenaResult,
  scoreExam,
  scoreFormulation,
} from '../content/arena'
import type { ArenaResult } from '../content/arena'
import { TimedExam } from '../components/arena/TimedExam'
import { FormulationTaskPanel } from '../components/arena/FormulationTask'
import { ArenaResultCard } from '../components/arena/ArenaResultCard'
import { getLastArenaScore, saveArenaScore } from '../lib/progress'
import { formatScore } from '../lib/scoring'

type ArenaPhase = 'intro' | 'exam' | 'formulation' | 'results'

export function Arena() {
  const [phase, setPhase] = useState<ArenaPhase>('intro')
  const [useTimer, setUseTimer] = useState(true)
  const [examAnswers, setExamAnswers] = useState<(number | null)[]>([])
  const [result, setResult] = useState<ArenaResult | null>(null)
  const lastScore = getLastArenaScore()

  const handleExamSubmit = (answers: (number | null)[]) => {
    setExamAnswers(answers)
    setPhase('formulation')
  }

  const handleFormulationComplete = (selections: Record<string, string>) => {
    const examResult = scoreExam(ARENA_QUESTIONS, examAnswers)
    const formulationResult = scoreFormulation(FORMULATION_TASK, selections)
    const arenaResult = buildArenaResult(examResult, formulationResult, ARENA_EXAM_COUNT)
    setResult(arenaResult)
    saveArenaScore({
      totalPercent: arenaResult.totalPercent,
      examPercent: arenaResult.examPercent,
      formulationPercent: arenaResult.formulationPercent,
      completedAt: arenaResult.completedAt,
    })
    setPhase('results')
  }

  const handleRetry = () => {
    setExamAnswers([])
    setResult(null)
    setPhase('intro')
  }

  const handleStart = () => {
    setExamAnswers([])
    setResult(null)
    setPhase('exam')
  }

  if (phase === 'results' && result) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white">Ön Eleme Arenası — Sonuç</h1>
        <div className="mt-6">
          <ArenaResultCard result={result} onRetry={handleRetry} />
        </div>
      </motion.div>
    )
  }

  if (phase === 'exam') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white">Ön Eleme Arenası</h1>
        <p className="mt-2 text-sm text-slate-400">
          {ARENA_EXAM_COUNT} soruluk karışık deneme — cevapları işaretle, sorular arasında gezinebilirsin.
        </p>
        <div className="mt-6">
          <TimedExam
            questions={ARENA_QUESTIONS}
            useTimer={useTimer}
            onSubmit={handleExamSubmit}
          />
        </div>
      </motion.div>
    )
  }

  if (phase === 'formulation') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white">Formülasyon Görevi</h1>
        <p className="mt-2 text-sm text-slate-400">
          Sınav tamamlandı. Şimdi Max-Cut QUBO formülasyon kararlarını uygula.
        </p>
        <div className="mt-6">
          <FormulationTaskPanel task={FORMULATION_TASK} onComplete={handleFormulationComplete} />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-white">Ön Eleme Arenası</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Yarışma ön elemesine hazırlık: {ARENA_EXAM_COUNT} soruluk karışık MCQ sınavı ve Max-Cut
        QUBO formülasyon görevi. Toplam skor %70 sınav + %30 formülasyon ağırlıklıdır.
      </p>

      {lastScore && (
        <div className="mt-6 rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-4">
          <p className="text-sm text-slate-400">Son arena skorun</p>
          <p className="mt-1 text-2xl font-bold text-gradient-cyan">
            {formatScore(lastScore.totalPercent)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Sınav {formatScore(lastScore.examPercent)} · Formülasyon{' '}
            {formatScore(lastScore.formulationPercent)} ·{' '}
            {new Date(lastScore.completedAt).toLocaleDateString('tr-TR')}
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-5">
          <h2 className="font-display font-semibold text-cyan-glow">Deneme sınavı</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-400">
            <li>{ARENA_EXAM_COUNT} soru — 6 konu başlığı</li>
            <li>Kuantum temeller, QUBO, QAOA, VQE, NISQ, sektör</li>
            <li>Sorular arası gezinme, sonunda gönderim</li>
          </ul>
        </div>
        <div className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-5">
          <h2 className="font-display font-semibold text-cyan-glow">Formülasyon görevi</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-400">
            <li>Max-Cut elmas graf QUBO kararları</li>
            <li>6 adım: kodlama, amaç, Ising, QAOA, ceza, doğrulama</li>
            <li>Her adımda anlık geri bildirim</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-700/60 bg-navy-800/30 p-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={useTimer}
            onChange={(e) => setUseTimer(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-navy-900 text-cyan-electric focus:ring-cyan-electric/40"
          />
          30 dakikalık süre sınırı kullan (önerilen)
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleStart}
          className="rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-6 py-3 font-display text-sm font-semibold text-navy-950 shadow-lg shadow-cyan-electric/10 transition-opacity hover:opacity-90"
        >
          Arenaya başla
        </button>
        <Link
          to="/yol"
          className="rounded-lg border border-cyan-electric/30 px-4 py-3 text-sm font-medium text-cyan-glow transition-colors hover:bg-cyan-electric/10"
        >
          Modülleri tamamla →
        </Link>
      </div>
    </motion.div>
  )
}
