import { motion } from 'framer-motion'

interface LessonBlockProps {
  title: string
  children: React.ReactNode
}

export function LessonBlock({ title, children }: LessonBlockProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      <h2 className="mb-3 font-display text-xl font-semibold text-white">{title}</h2>
      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">{children}</div>
    </motion.section>
  )
}
