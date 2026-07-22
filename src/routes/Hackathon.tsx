import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const timeline = [
  {
    day: 'Gün 1 — 09:00–12:00',
    title: 'Problem analizi ve formülasyon',
    tasks: [
      'Yarışma problem metnini takımca okuyun; varsayımları ve metrikleri yazılı hale getirin',
      'İş değeri ve kısıtları netleştirin (bankacılık / haberleşme / optimizasyon)',
      'QUBO veya Ising formülasyonunu kağıt üzerinde çıkarın; ceza katsayılarını tartışın',
      'Takım rollerini atayın: formülasyon, algoritma, deney, sunum',
    ],
  },
  {
    day: 'Gün 1 — 13:00–17:00',
    title: 'Algoritma seçimi ve simulator',
    tasks: [
      'Küçük instance üzerinde klasik baseline (brute-force veya OR-Tools) çalıştırın',
      'QAOA / VQE / kuantum-inspired yol haritasını seçin ve gerekçelendirin',
      'Qiskit Aer veya IBM simulator ile ilk devre denemeleri',
      'Shot sayısı, p derinliği ve parametre aralığı için hipotez oluşturun',
    ],
  },
  {
    day: 'Gün 2 — 09:00–12:00',
    title: 'IBM backend ve deneyler',
    tasks: [
      'Transpile: optimization level, coupling map, initial layout seçimleri',
      'Gerçek backend veya noise model ile karşılaştırmalı koşular',
      'Sonuçları tablo + histogram olarak kaydedin; tekrarlanabilirlik için seed/not alın',
      'Yedek plan: kuyruk uzarsa Aer / TRUBA / lokal simülatör ile devam',
    ],
  },
  {
    day: 'Gün 2 — 13:00–17:00',
    title: 'Sunum ve prova',
    tasks: [
      'Problem → model → sonuç → limitasyon iskeletini doldurun',
      'Klasik vs kuantum kıyas grafiği hazırlayın',
      'Demo senaryosu: 2 dakikalık canlı akış provası',
      'Jüri soruları için limitasyon ve gelecek çalışma slaytlarını netleştirin',
    ],
  },
]

const roles = [
  {
    role: 'Formülasyon',
    icon: 'Frm',
    duties: 'QUBO/Ising yazımı, ceza terimleri, küçük örnek doğrulama, kısıt analizi',
  },
  {
    role: 'Algoritma',
    icon: 'Alg',
    duties: 'QAOA/VQE devre tasarımı, parametre optimizasyonu, cost/mixer Hamiltonian',
  },
  {
    role: 'Deney',
    icon: 'Dny',
    duties: 'IBM/simulator koşuları, shot/transpile ayarları, metrik toplama, log tutma',
  },
  {
    role: 'Sunum',
    icon: 'Sun',
    duties: 'Slayt akışı, grafikler, demo script, jüri Q&A hazırlığı',
  },
]

const ibmChecklist = [
  {
    item: 'IBM Quantum hesabı ve API token',
    detail: 'Token süresi dolmadan önce yenileyin; ortam değişkeni olarak saklayın, slayta yapıştırmayın.',
  },
  {
    item: 'Transpile ayarları',
    detail: 'optimization_level (0–3), basis_gates, coupling_map. Derinliği (depth) ve CNOT sayısını loglayın.',
  },
  {
    item: 'Shot sayısı',
    detail: '1024–4096 arası başlayın; histogram stabil değilse artırın. Maliyet/kuyruk trade-off\'unu not edin.',
  },
  {
    item: 'Gürültü farkındalığı',
    detail: 'Simülatör ideal; backend SPAM + gate hataları içerir. Noise model ile ara test yapın.',
  },
  {
    item: 'Yedek simülatör planı',
    detail: 'IBM kuyruğu uzarsa Qiskit Aer, lokal noise sim veya TRUBA kuantum kaynakları (kavramsal) ile devam.',
  },
  {
    item: 'Sonuç kaydı',
    detail: 'Job ID, backend adı, transpile özeti, ham counts JSON — tekrarlanabilirlik için şart.',
  },
]

const presentationSkeleton = [
  { section: 'Problem', points: 'İş bağlamı, girdi/çıktı, kısıtlar, değerlendirme metriği' },
  { section: 'Model', points: 'QUBO/Ising formülasyonu, değişken kodlaması, ceza terimleri, küçük örnek doğrulama' },
  { section: 'Algoritma', points: 'QAOA/VQE seçimi, p derinliği, optimizer, devre diyagramı (kısa)' },
  { section: 'Sonuç', points: 'Klasik baseline kıyası, backend vs simulator, tablo/grafik, en iyi çözüm' },
  { section: 'Limitasyon', points: 'NISQ gürültüsü, qubit/derinlik sınırı, ölçeklenme, gelecek iş' },
]

const emergencyCards = [
  {
    title: 'Transpile hatası / devre çalışmıyor',
    fix: 'Qubit sayısını ve coupling map\'i kontrol edin. optimization_level düşürün veya devreyi sığlaştırın.',
  },
  {
    title: 'Backend kuyruğu saatlerce',
    fix: 'Aer simulator + noise model ile sonuçları tamamlayın; sunumda "simülatör vs gerçek" ayrımını açık söyleyin.',
  },
  {
    title: 'QAOA sonuçları rastgele görünüyor',
    fix: 'Shot artırın, p=1 ile başlayın, parametreleri klasik optimizer ile yeniden tarayın, post-processing ekleyin.',
  },
  {
    title: 'Kısıt ihlali (ceza yetersiz)',
    fix: 'λ ceza katsayısını artırın veya kısıtı yeniden formüle edin; brute-force ile küçük örnekte doğrulayın.',
  },
  {
    title: 'Formülasyon takım içi anlaşmazlık',
    fix: '5 dk\'lık "tek sayfa spec": değişkenler, amaç, kısıtlar, metrik — formülasyon lideri yazsın, herkes onaylasın.',
  },
  {
    title: 'Sunumda kuantum "sihir" gibi anlatılıyor',
    fix: 'Her iddiayı metrik + grafik ile destekleyin; limitasyon slaytını atlamayın — jüri bunu sever.',
  },
]

export function Hackathon() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-white">Hackathon Playbook</h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        Teknopark / IBM odaklı 2 günlük final hazırlık rehberi — SSB Kuantum Algoritma Yarışması
        final aşaması için pratik kontrol listesi.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-cyan-glow">2 günlük zaman çizelgesi</h2>
        <div className="mt-4 space-y-4">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-4 sm:p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-electric/70">
                {item.day}
              </p>
              <h3 className="mt-1 font-display font-semibold text-white">{item.title}</h3>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-400">
                {item.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-cyan-glow">Takım rolleri</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {roles.map((r) => (
            <div
              key={r.role}
              className="rounded-xl border border-cyan-electric/10 bg-navy-800/30 p-4"
            >
              <h3 className="font-display font-semibold text-white">
                <span
                  aria-hidden
                  className="mr-2 inline-flex h-6 min-w-6 items-center justify-center rounded border border-cyan-electric/30 px-1 text-[10px] font-bold uppercase tracking-wide text-cyan-glow"
                >
                  {r.icon}
                </span>
                {r.role}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{r.duties}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-cyan-glow">
          IBM / simulator kontrol listesi
        </h2>
        <div className="mt-4 space-y-3">
          {ibmChecklist.map((c, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-700/60 bg-navy-800/30 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-cyan-electric/30 text-xs text-cyan-glow">
                  ✓
                </span>
                <div>
                  <h3 className="text-sm font-medium text-white">{c.item}</h3>
                  <p className="mt-1 text-sm text-slate-400">{c.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-cyan-glow">Sunum iskeleti</h2>
        <div className="mt-4 rounded-xl border border-cyan-electric/15 bg-navy-800/40 p-4 sm:p-6">
          <ol className="space-y-4">
            {presentationSkeleton.map((s, i) => (
              <li key={s.section} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-electric/15 font-display text-sm font-bold text-cyan-glow">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-white">{s.section}</h3>
                  <p className="mt-1 text-sm text-slate-400">{s.points}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-amber-200">
          Yarışma günü acil kartları
        </h2>
        <p className="mt-1 text-sm text-slate-500">Sık yapılan hatalar ve hızlı düzeltmeler</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {emergencyCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-amber-500/20 bg-navy-800/40 p-4"
            >
              <h3 className="text-sm font-semibold text-amber-100">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{card.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/arena"
          className="rounded-lg bg-gradient-to-r from-cyan-deep to-cyan-electric px-4 py-2 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90"
        >
          Ön eleme arenasına git
        </Link>
        <Link
          to="/yol"
          className="text-sm text-cyan-glow hover:underline"
        >
          ← Yol haritasına dön
        </Link>
      </div>
    </motion.div>
  )
}
