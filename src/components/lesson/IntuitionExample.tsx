import { motion } from 'framer-motion'
import type { ModuleIntuition } from '../../content/modules/types'
import { GlossaryText } from './GlossaryTooltip'

interface IntuitionExampleProps {
  intuition: ModuleIntuition
  index: number
}

export function IntuitionExample({ intuition, index }: IntuitionExampleProps) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-lg border border-cyan-electric/15 bg-navy-900/50 p-4"
    >
      <h3 className="font-display text-base font-semibold text-cyan-glow">{intuition.title}</h3>
      <p className="mt-2 text-sm text-slate-400">
        <span className="font-medium text-slate-300">Senaryo: </span>
        <GlossaryText text={intuition.setup} />
      </p>
      <p className="mt-2 rounded-md border-l-2 border-emerald-500/50 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-100/90">
        <span className="font-semibold text-emerald-300">Çıkarım → </span>
        <GlossaryText text={intuition.insight} />
      </p>
    </motion.li>
  )
}
