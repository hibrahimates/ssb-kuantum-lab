import { motion } from 'framer-motion'
import type { ModuleAnalogy } from '../../content/modules/types'
import { GlossaryText } from './GlossaryTooltip'
import { PlaygroundSlot } from './PlaygroundSlot'
import { ListenButton } from './ListenButton'

interface AnalogyCardProps {
  analogy: ModuleAnalogy
  unlocked: boolean
}

export function AnalogyCard({ analogy, unlocked }: AnalogyCardProps) {
  const narrationText = analogy.narration ?? analogy.text

  return (
    <motion.aside
      data-tour-id="analogy"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="my-6 scroll-mt-28 overflow-hidden rounded-xl border border-cyan-electric/20 bg-gradient-to-br from-cyan-electric/10 via-navy-900/40 to-navy-800/30"
    >
      <div className="border-b border-cyan-electric/20 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-glow/80">
              Sezgi · Analoji
            </p>
            <h2 className="font-display text-lg font-semibold text-white">{analogy.title}</h2>
          </div>
          <ListenButton text={narrationText} />
        </div>
      </div>
      <div className="px-5 py-4 text-sm leading-relaxed text-slate-300">
        <GlossaryText text={analogy.text} />
      </div>
      {analogy.visual ? (
        <div className="border-t border-cyan-electric/15 px-5 py-4">
          <PlaygroundSlot id={analogy.visual} unlocked={unlocked} compact />
        </div>
      ) : null}
    </motion.aside>
  )
}
