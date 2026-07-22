import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Home() {
  return (
    <div className="relative -mx-4 -mt-8 min-h-[calc(100vh-4rem)] overflow-hidden lg:-mx-8">
      <div className="hero-glow absolute inset-0 bg-circuit-grid bg-circuit bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/40 to-navy-950" />

      <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-electric/80">
            SSB Kuantum Algoritma Yarışması
          </p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="text-gradient-cyan">Kuantum Lab</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Yarışmaya hazırlanmak için interaktif öğrenme yolu — klasik optimizasyondan
            QUBO ve QAOA&apos;ya, sektör problemlerinden hackathon playbook&apos;una.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10"
          >
            <Link
              to="/yol"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-deep to-cyan-glow px-8 py-3.5 font-display text-base font-semibold text-navy-950 shadow-lg shadow-cyan-electric/20 transition-transform hover:scale-[1.02]"
            >
              Öğrenmeye başla
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
