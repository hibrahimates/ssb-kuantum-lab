import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ProgressRail } from '../components/layout/ProgressRail'
import { getAllModuleMetas, groupModulesBySeason } from '../content/modules'
import { useProgressTick } from '../hooks/useProgressTick'
import { isModuleComplete } from '../lib/progress'
import { isModuleUnlocked, UNLOCK_THRESHOLD } from '../lib/scoring'

const SEASON_ORDER = [1, 2, 3, 4] as const

export function Yol() {
  useProgressTick()
  const modules = getAllModuleMetas()
  const seasonGroups = groupModulesBySeason(modules)

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-white">Yol Haritası</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Sıfırdan kahramana — dört sezonluk yolculuk. Her modülde quiz skorun %{UNLOCK_THRESHOLD}{' '}
          ve üzerindeyse bir sonraki modül açılır. İlerlemen cihazında saklanır.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {SEASON_ORDER.map((seasonNum) => {
            const seasonModules = seasonGroups.get(seasonNum)
            if (!seasonModules || seasonModules.length === 0) return null

            const seasonTitle = seasonModules[0].seasonTitle
            const levelLabel = seasonModules[0].levelLabel

            return (
              <section key={seasonNum}>
                <div className="mb-4 flex items-baseline gap-3">
                  <h2 className="font-display text-lg font-semibold text-cyan-glow">
                    Sezon {seasonNum} · {seasonTitle}
                  </h2>
                  <span className="rounded-full border border-cyan-electric/20 px-2 py-0.5 text-xs text-slate-500">
                    {levelLabel}
                  </span>
                </div>
                <div className="space-y-3">
                  {seasonModules.map((mod, index) => {
                    const unlocked = isModuleUnlocked(mod.slug)
                    const completed = isModuleComplete(mod.slug)

                    return (
                      <motion.div
                        key={mod.slug}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/modul/${mod.slug}`}
                          className={`group flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                            unlocked
                              ? 'border-cyan-electric/10 bg-navy-800/40 hover:border-cyan-electric/25 hover:bg-navy-800/70'
                              : 'border-slate-700/40 bg-navy-900/30 hover:border-slate-600/50 hover:bg-navy-900/50'
                          }`}
                        >
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${
                              completed
                                ? 'bg-cyan-electric/20 text-cyan-glow'
                                : unlocked
                                  ? 'bg-cyan-electric/10 text-cyan-glow'
                                  : 'bg-slate-800/80 text-slate-500'
                            }`}
                          >
                            {completed ? '✓' : unlocked ? mod.order : '🔒'}
                          </span>
                          <div>
                            <h3
                              className={`font-display text-lg font-semibold ${
                                unlocked
                                  ? 'text-white group-hover:text-cyan-100'
                                  : 'text-slate-400 group-hover:text-slate-300'
                              }`}
                            >
                              {mod.title}
                              {!unlocked ? (
                                <span className="ml-2 text-xs font-normal text-amber-400/80">
                                  Kilitli
                                </span>
                              ) : null}
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">{mod.subtitle}</p>
                            {!unlocked && mod.order > 1 ? (
                              <p className="mt-2 text-xs text-amber-400/70">
                                Önceki modül quizini %{UNLOCK_THRESHOLD} ile geç
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            )
          })}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              to="/arena"
              className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 transition-colors hover:border-amber-500/40"
            >
              <h3 className="font-display font-semibold text-amber-200">Ön Eleme Arenası</h3>
              <p className="mt-1 text-sm text-slate-400">Deneme sınavı ve formülasyon görevi</p>
            </Link>
            <Link
              to="/hackathon"
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-colors hover:border-emerald-500/40"
            >
              <h3 className="font-display font-semibold text-emerald-200">Hackathon Playbook</h3>
              <p className="mt-1 text-sm text-slate-400">2 günlük plan, IBM checklist, sunum iskeleti</p>
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ProgressRail />
        </aside>
      </div>
    </div>
  )
}
