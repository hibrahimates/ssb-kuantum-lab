import { motion } from 'framer-motion'
import { ListenButton } from './ListenButton'

interface LessonBlockProps {
  title: string
  narration?: string
  tourId?: string
  children: React.ReactNode
}

export function LessonBlock({ title, narration, tourId, children }: LessonBlockProps) {
  return (
    <motion.section
      data-tour-id={tourId}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8 scroll-mt-28"
    >
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        {narration ? <ListenButton text={narration} /> : null}
      </div>
      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">{children}</div>
    </motion.section>
  )
}
