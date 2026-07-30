import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SSB_DUYURU_URL =
  'https://kuantum.ssb.gov.tr/yarisma-duyurular/ibm-quantum-platformu-kaynaklari-ve-egitim-dokumanlari'

const resourceGroups = [
  {
    title: 'IBM Quantum Platform',
    description: 'Bulut kuantum platformu ve ürün sayfası.',
    links: [
      { label: 'IBM Quantum Platform', url: 'https://quantum.cloud.ibm.com/' },
      { label: 'IBM Quantum Ürünleri', url: 'https://www.ibm.com/quantum/products' },
    ],
  },
  {
    title: 'Eğitim & Öğrenme',
    description: 'Resmi IBM Quantum Learning kaynakları.',
    links: [
      { label: 'IBM Quantum Learning', url: 'https://quantum.cloud.ibm.com/learning/en' },
      {
        label: 'Qiskit YouTube Kanalı',
        url: 'https://www.youtube.com/@qiskit',
      },
      {
        label: 'Qiskit Tanıtım Videosu',
        url: 'https://youtu.be/MLE5LhsLD5U',
        note: 'MLE5LhsLD5U',
      },
    ],
  },
  {
    title: 'Kurulum & Ortam',
    description: 'Qiskit kurulumu ve geliştirme ortamı.',
    links: [
      {
        label: 'Qiskit Kurulum Rehberi',
        url: 'https://quantum.cloud.ibm.com/docs/en/guides/install-qiskit',
      },
      {
        label: 'Bulut Notebook Ortamları',
        url: 'https://www.ibm.com/quantum/blog/qiskit-notebook-environments',
      },
    ],
  },
  {
    title: 'Simülatörler',
    description: 'Yerel ve bulut simülatör seçenekleri.',
    links: [
      {
        label: 'Yerel Simülatörler',
        url: 'https://quantum.cloud.ibm.com/docs/en/guides/local-simulators',
      },
    ],
  },
]

export function Kaynaklar() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-white">Kaynaklar</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        SSB duyurusunda listelenen resmi IBM Quantum ve Qiskit kaynakları. Sezon 3 modüllerinde bu
        linklerle pratik yapacaksın.
      </p>

      <div className="mt-8 space-y-6">
        {resourceGroups.map((group) => (
          <section
            key={group.title}
            className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-5"
          >
            <h2 className="font-display text-lg font-semibold text-cyan-glow">{group.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{group.description}</p>
            <ul className="mt-4 space-y-2">
              {group.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-cyan-glow"
                  >
                    <span className="text-cyan-electric/60 group-hover:text-cyan-glow">↗</span>
                    {link.label}
                    {'note' in link && link.note ? (
                      <span className="text-xs text-slate-600">({link.note})</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-cyan-electric/20 bg-gradient-to-br from-cyan-electric/5 to-navy-900/40 p-6">
        <h2 className="font-display text-lg font-semibold text-white">SSB Resmi Duyuru</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tüm kaynak listesi ve güncel duyurular için SSB&apos;nin resmi sayfasını ziyaret et.
        </p>
        <a
          href={SSB_DUYURU_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-5 py-2.5 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
        >
          IBM Quantum Platformu Kaynakları
          <span aria-hidden>↗</span>
        </a>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/yol"
          className="rounded-lg border border-cyan-electric/25 px-4 py-2 text-sm font-medium text-cyan-glow transition-colors hover:border-cyan-electric/45"
        >
          ← Yol haritasına dön
        </Link>
        <Link to="/hackathon" className="text-sm text-slate-400 hover:text-cyan-glow hover:underline">
          Hackathon playbook
        </Link>
      </div>
    </motion.div>
  )
}
