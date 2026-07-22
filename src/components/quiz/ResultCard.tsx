import { motion } from 'framer-motion'
import { isUnlocked, formatScore, UNLOCK_THRESHOLD } from '../../lib/scoring'

interface ResultCardProps {
  scorePercent: number
  correct: number
  total: number
  passed: boolean
  onRetry?: () => void
}

export function ResultCard({
  scorePercent,
  correct,
  total,
  passed,
  onRetry,
}: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border p-6 ${
        passed
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-amber-500/30 bg-amber-500/5'
      }`}
    >
      <h3 className="font-display text-xl font-semibold text-white">
        {passed ? 'Tebrikler!' : 'Bir kez daha dene'}
      </h3>
      <p className="mt-2 text-3xl font-bold text-gradient-cyan">{formatScore(scorePercent)}</p>
      <p className="mt-2 text-sm text-slate-300">
        {correct} / {total} doğru cevap
      </p>
      <p className="mt-3 text-sm text-slate-400">
        {passed
          ? 'Sonraki modül kilidi açıldı. Yol haritasından devam edebilirsin.'
          : `Geçmek için en az %${UNLOCK_THRESHOLD} gerekli. Şu an ${isUnlocked(scorePercent) ? 'geçtin' : 'geçemedin'}.`}
      </p>
      {!passed && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-cyan-electric/30 px-4 py-2 text-sm font-medium text-cyan-glow transition-colors hover:bg-cyan-electric/10"
        >
          Quizi yeniden dene
        </button>
      )}
    </motion.div>
  )
}
