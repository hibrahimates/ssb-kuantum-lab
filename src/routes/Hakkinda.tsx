import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const YARISMA_URL = 'https://kuantum.ssb.gov.tr/yarisma'

export function Hakkinda() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-white">Hakkında</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Kuantum Lab, SSB Kuantum Algoritma Yarışması&apos;na hazırlanmak isteyen takımlar
        için ücretsiz, tarayıcı tabanlı bir eğitim laboratuvarıdır.
      </p>

      <section className="mt-8 space-y-4 text-slate-300">
        <h2 className="font-display text-xl font-semibold text-white">Nasıl kullanılır?</h2>
        <ol className="list-inside list-decimal space-y-2 text-sm leading-relaxed">
          <li>
            <Link to="/yol" className="text-cyan-glow hover:underline">
              Yol haritasından
            </Link>{' '}
            modüllere sırayla ilerle.
          </li>
          <li>Her modülde quiz skorun %70 ve üzerindeyse ilerleme kaydedilir.</li>
          <li>Veriler yalnızca tarayıcının localStorage&apos;ında saklanır; sunucu yok.</li>
          <li>
            <Link to="/terimler" className="text-cyan-glow hover:underline">
              Terimler
            </Link>{' '}
            sayfasından EN→TR glossar&apos;a bak.
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-6">
        <h2 className="font-display text-lg font-semibold text-white">Resmi yarışma</h2>
        <p className="mt-2 text-sm text-slate-400">
          Başvuru, takvim ve güncel duyurular için SSB&apos;nin resmi yarışma sayfasını
          ziyaret et.
        </p>
        <a
          href={YARISMA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-5 py-2.5 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
        >
          kuantum.ssb.gov.tr/yarisma
          <span aria-hidden>↗</span>
        </a>
      </section>
    </motion.div>
  )
}
