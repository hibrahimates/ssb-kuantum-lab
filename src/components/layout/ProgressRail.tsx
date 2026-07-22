import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllModuleMetas } from '../../content/modules'
import {
  getProgress,
  getQuizScore,
  isModuleComplete,
  PROGRESS_EVENT,
} from '../../lib/progress'
import { isModuleUnlocked } from '../../lib/scoring'

export function ProgressRail() {
  const modules = getAllModuleMetas()
  const [, tick] = useState(0)

  useEffect(() => {
    const refresh = () => tick((n) => n + 1)
    window.addEventListener(PROGRESS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const progress = getProgress()
  const completedCount = progress.completedModules.length
  const percent = Math.round((completedCount / modules.length) * 100)

  return (
    <div className="rounded-xl border border-cyan-electric/15 bg-navy-800/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Genel İlerleme</span>
        <span className="font-display text-sm font-semibold text-cyan-glow">%{percent}</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-navy-950">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-deep to-cyan-glow"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <ol className="space-y-2">
        {modules.map((mod) => {
          const done = isModuleComplete(mod.slug)
          const score = getQuizScore(mod.slug)
          const unlocked = isModuleUnlocked(mod.slug)

          return (
            <li key={mod.slug}>
              <Link
                to={`/modul/${mod.slug}`}
                className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-navy-700/40"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    done
                      ? 'bg-cyan-electric/20 text-cyan-glow'
                      : unlocked
                        ? 'border border-cyan-electric/30 text-cyan-electric'
                        : 'border border-slate-700 text-slate-600'
                  }`}
                >
                  {done ? '✓' : unlocked ? mod.order : '🔒'}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      done ? 'text-cyan-100' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {mod.title}
                  </p>
                  {score !== undefined && (
                    <p className="text-xs text-slate-500">Quiz: %{score}</p>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
