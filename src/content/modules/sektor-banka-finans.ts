import type { ModuleContent } from './types'

export const sektorBankaFinans: ModuleContent = {
  slug: 'sektor-banka-finans',
  order: 8,
  title: 'Sektör: Banka & Finans',
  subtitle: 'Portföy ve risk toy QUBO problemleri',
  goal: 'Bankacılık/finans metaforlu optimizasyon problemlerini QUBO diline çevirmek için sezgi geliştirmek.',
  analogy: {
    title: 'Portfolio = alışveriş sepeti + bütçe cezası',
    text: 'Her varlık raftaki ürün: xᵢ=1 sepete koy, xᵢ=0 bırak. Getiri ürün indirimi (minimize −rᵀx). Risk kovaryansı “beraber alınca pahalılaşan paket” — xᵢxⱼ cezası. Bütçe k=3 ürün kuralı Penalty (Σx−3)² ile trafik cezası gibi: fazla/eksik ürün puan keser.',
  },
  intuitions: [
    {
      title: '5 varlık, k=2 toy',
      setup:
        'Getiriler r=[0.06,0.11,0.04,0.09,0.13]. Kovaryans cezası basit: Qᵢⱼ=0.1 i≠j. λ=80, kısıt (Σx−2)².',
      insight:
        'Optimal yakın: varlık 2+5 (getiri 0.24) veya 4+5 (0.22) — risk cezası seçimi kaydırır. Brute-force 2⁵=32 atama.',
    },
    {
      title: 'Sektör limiti',
      setup:
        '3 tech, 2 finans varlığı. Kısıt: tech exposure ≤2 → penalty λ_tech·(tech_sum−2)². x=(1,1,1,0,0) tech_sum=3 ihlal.',
      insight:
        'İş kuralı → matematik → Q terimi zinciri sunumda tek slayt. λ_tech ayrı λ_budget olabilir.',
    },
    {
      title: 'QAOA vs greedy banka toy',
      setup:
        '6 varlık, k=3. Greedy getiri/risk oranı: getiri 0.28, risk skor 0.15. QAOA p=1+repair: getiri 0.31, risk 0.14.',
      insight:
        'Kuantum her zaman kazanmaz — ama formülasyon + post-processing ile rekabetçi olabilir. Karşılaştırma zorunlu.',
    },
  ],
  tryThis: [
    {
      prompt:
        'constraint playground\'da ceza P kaydırıcısını 4→16 artır. Tabloda tam 1 varlık seçmeyen (uygunsuz) satırların nasıl gerilediğini gözlemle.',
    },
    {
      prompt:
        'live-qubo\'da kenar DSL\'ine 0-1,1-2,2-3,3-4,4-0 yaz (beşgen). En iyi kesim bitstring\'ini ve cut değerini not et.',
    },
    {
      prompt:
        'İş kuralı yaz: “En az 1 likit varlık (x₁=1 zorunlu)”. Bunu hard encoding (x₁ sabit) vs Penalty olarak nasıl eklersin?',
      hint: 'Zorunlu dahil → x₁=1 sabitle; yumuşak tercih → ceza terimi.',
    },
  ],
  playgrounds: ['knapsack', 'constraint', 'live-qubo'],
  sections: [
    {
      id: 'portfolio',
      title: 'Portföy Seçimi Toy Modeli',
      body: 'n varlıktan k tanesini seç: xᵢ∈{0,1}. Maliyet: −Σ rᵢ xᵢ + risk (Σᵢⱼ Qᵢⱼ xᵢ xⱼ). Kısıt Σ xᵢ = k → Penalty λ(Σ xᵢ − k)². Örnek n=4, k=2, r=[0.08,0.12,0.05,0.15]: brute-force optimal (0,1,0,1) getiri 0.27.',
      miniPlayground: 'knapsack',
    },
    {
      id: 'risk',
      title: 'Risk ve Korelasyon',
      body: 'Kovaryans matrisi Σ: portföy varyansı xᵀΣx → QUBO çapraz terimleri. Yüksek korelasyonlu çift (i,j) birlikte seçilince maliyet +0.3 gibi. Toy Σ seyrek tutulur; hackathon grafiğinde kenar = risk bağlantısı.',
    },
    {
      id: 'constraints',
      title: 'Sektörel Kısıtlar',
      body: 'Sektör başına max exposure, minimum likidite, zorunlu varlık. Her biri Penalty veya hard encoding. Önce→sonra: “Tech ≤2” → tech_ids toplamı ≤2 → λ(Σ_{i∈tech} xᵢ − 2)² if aşım. Sunumda iş kuralı → Q terimi.',
      miniPlayground: 'constraint',
    },
    {
      id: 'evaluation',
      title: 'Çözüm Değerlendirme',
      body: 'Kuantum çıktısı geçerli portföy mü? (tam k varlık, sektör limitleri) Greedy/CP-SAT karşılaştır: getiri, risk, ihlal sayısı. Örnek tablo: | yöntem | getiri | risk | geçerli | süre |.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Portföy seçiminde xᵢ = 1 ne anlama gelir?',
      options: [
        'Varlık i portföye dahil',
        'Varlık i reddedildi ve silindi',
        'Risk sıfır',
        'Qubit bozuldu',
      ],
      correctIndex: 0,
      explanation: 'İkili değişken: 1 = seçildi, 0 = seçilmedi.',
    },
    {
      id: 'q2',
      question: 'Σ xᵢ = k kısıtı QUBO’da tipik olarak nasıl eklenir?',
      options: [
        'Linear programlama gevşetmesi',
        'Penalty: λ(Σ xᵢ - k)²',
        'Simülatörde otomatik sağlanır',
        'Mixer devresine eklenmez',
      ],
      correctIndex: 1,
      explanation: 'Eşitlik kısıtı ceza terimi olarak ikinci dereceye açılır.',
    },
    {
      id: 'q3',
      question: 'Kovaryans matrisi QUBO ile neden uyumludur?',
      options: [
        'Sadece doğrusal terimler üretir',
        'xᵢ xⱼ çapraz terimleri (ikinci derece) üretir',
        'Qubit sayısını azaltır',
        'Transpile gerektirmez',
      ],
      correctIndex: 1,
      explanation: 'xᵀΣx ikinci dereceden ikili terimler içerir; Q matrisine map edilir.',
    },
    {
      id: 'q4',
      question: 'Yarışma sunumunda finans modülünden beklenen?',
      options: [
        'Sadece Qiskit kurulum ekran görüntüsü',
        'İş kuralı → QUBO → kuantum sonuç → klasik karşılaştırma',
        'Yalnızca literatür özeti',
        'Donanım şeması',
      ],
      correctIndex: 1,
      explanation: 'Uçtan uca formülasyon ve değerlendirme zinciri puanlanır.',
    },
    {
      id: 'q5',
      question: 'Getiri maximizasyonu QUBO’da genelde nasıl yazılır?',
      options: [
        'Getiri terimlerini minimize edilecek maliyete negatif işaretle ekle',
        'Getiri terimlerini sil',
        'Shot sayısıyla çarp',
        'Sadece Z kapılarıyla ifade edilemez',
      ],
      correctIndex: 0,
      explanation: 'Maximize rᵀx → minimize -rᵀx dönüşümü standarttır.',
    },
    {
      id: 'q6',
      question: '5 varlık, k=2, brute-force kaç atama tarar?',
      options: ['10', '25', '32', '64'],
      correctIndex: 2,
      explanation: '2⁵=32 — modül sezgi örneğiyle uyumlu toy doğrulama.',
    },
  ],
}
