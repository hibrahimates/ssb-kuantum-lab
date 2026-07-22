import { motion } from 'framer-motion'
import { glossary } from '../content/glossary'

export function Terimler() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-white">Terimler Sözlüğü</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        İngilizce teknik terimler ve Türkçe açıklamaları. Modüllerde ilk geçişte kısa
        tanımlar da verilir.
      </p>

      <dl className="mt-8 space-y-4">
        {glossary.map((entry, index) => (
          <motion.div
            key={entry.term}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl border border-cyan-electric/10 bg-navy-800/40 p-5"
          >
            <dt className="font-display text-lg font-semibold text-cyan-glow">{entry.term}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-400">{entry.translation}</dd>
            <dd className="mt-2 text-sm leading-relaxed text-slate-300">{entry.description}</dd>
          </motion.div>
        ))}
      </dl>
    </motion.div>
  )
}
