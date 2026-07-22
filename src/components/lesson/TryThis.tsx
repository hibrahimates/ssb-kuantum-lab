import { motion } from 'framer-motion'
import type { ModuleTryThis } from '../../content/modules/types'
import { GlossaryText } from './GlossaryTooltip'

interface TryThisProps {
  challenge: ModuleTryThis
  index: number
}

export function TryThis({ challenge, index }: TryThisProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-300">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-amber-100">
          <GlossaryText text={challenge.prompt} />
        </p>
        {challenge.hint && (
          <p className="mt-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">İpucu: </span>
            <GlossaryText text={challenge.hint} />
          </p>
        )}
      </div>
    </motion.li>
  )
}
