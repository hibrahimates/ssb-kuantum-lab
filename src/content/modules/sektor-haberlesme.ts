import type { ModuleContent } from './types'

export const sektorHaberlesme: ModuleContent = {
  slug: 'sektor-haberlesme',
  order: 9,
  title: 'Sektör: Haberleşme',
  subtitle: 'Routing ve kanal atama kısıtları',
  goal: 'Haberleşme ağı optimizasyon senaryolarında Routing, kanal atama ve interference kısıtlarını QUBO Penalty terimlerine dönüştürmek.',
  analogy: {
    title: 'Kanal atama = komşu apartmanlara farklı Wi-Fi kanalı',
    text: 'Her hücre (düğüm) bir apartman: one-hot kısıt “tam bir kanal seç” = her evde tek router kanalı açık. Komşu apartmanlar aynı kanalı kullanırsa parazit (interference) — Penalty xᵢxⱼ trafik cezası gibi. λ düşükse herkes kanal 6\'da, ağ çöker; λ yüksekse kanal maliyeti optimize edilemez.',
  },
  intuitions: [
    {
      title: '3 hücre, 3 kanal toy',
      setup:
        'Düğümler A—B—C zincir. Kanallar {1,2,3}. One-hot: her düğümde Σⱼ xᵢⱼ=1. Komşu çakışma: A-B ve B-C için aynı kanal cezası.',
      insight:
        'Geçerli atama: A=1,B=2,C=1 veya A=2,B=1,C=2 vb. 3 hücre × 3 kanal = 9 ikili değişken (flatten) — formülasyon boyutu büyür.',
    },
    {
      title: 'λ=10 vs λ=200',
      setup:
        '4 düğüm, graph coloring toy. λ=10: histogramda %40 geçersiz (komşu aynı renk). λ=200: %95 geçerli, maliyet landscape sert.',
      insight:
        'Penalty annealing: λ=10 ile başla (keşif), λ=100 ile bitir (kısıt). Haberleşme problemlerinde kısıt sayısı yüksek.',
    },
    {
      title: 'Routing kapasite',
      setup:
        '3 talep, 2 yol. x_{t,y}=1 talep t yol y. Kapasite: her yol max 2 talep. Penalty kapasite aşımı. Toy: yol1 aşırı yüklendiğinde ceza +50.',
      insight:
        'Routing + kanal atama birleşik hackathon sorusu olabilir — değişken gruplarını ayır, Q matrisini blok yaz.',
    },
  ],
  tryThis: [
    {
      prompt:
        'constraint playground\'da ceza P kaydırıcısını 4→16 yap. Tabloda tam 1 varlık seçmeyen (uygunsuz) satırların üst sıralardan nasıl düştüğünü gözlemle — one-hot kısıtın toy karşılığı.',
    },
    {
      prompt:
        '3 hücre 3 kanal toy\'unu kağıda yaz: 9 değişken listele. One-hot üç ayrı kısıt — her birinin Penalty formunu aç.',
    },
    {
      prompt:
        'Constraint tablosunda uygunsuz bir satır seç. Hangi biti değiştirerek tek adımlık repair yapardın? Kağıda yaz — Modül 10\'da repair raporlama.',
      hint: 'Playground tablo gösterir; repair burada düşünce egzersizi.',
    },
  ],
  playgrounds: ['constraint'],
  sections: [
    {
      id: 'routing',
      title: 'Routing Toy Problemi',
      body: 'Trafik yönlendirme: talep t yol y seçer, kapasite aşılmaz. İkili x_{t,y}∈{0,1}. Kapasite kısıtı Penalty: λ(Σ_t x_{t,y} − cap_y)². Graf: düğümler POP/router, kenarlar link — ağırlık gecikme veya kapasite maliyeti.',
    },
    {
      id: 'channel',
      title: 'Kanal Atama ve Çakışma',
      body: 'xᵢ,ⱼ=1: düğüm i kanal j. One-hot: Σⱼ xᵢ,ⱼ=1. Komşu çakışma: λ xᵢ,ⱼ xᵢ′,ⱼ (aynı kanal j komşularda). Graph coloring ile aynı sınıf. 4 düğüm toy: brute-force geçerli atama sayısını say.',
      miniPlayground: 'constraint',
    },
    {
      id: 'penalty',
      title: 'Kısıt → Penalty Dönüşümü',
      body: 'Eşitlik (Σx=1): λ(Σx−1)². Çift seçim yasağı: λ xᵢ xⱼ. λ küçük → geçersiz atamalar; büyük → maliyet bozulur. Penalty annealing: λ=5→50→200 kademe. Örnek log: | λ | geçerli% | ort maliyet |.',
    },
    {
      id: 'metrics',
      title: 'Değerlendirme Metrikleri',
      body: 'Geçerli çözüm oranı, gecikme, spektrum verimliliği, kapasite ihlali. Histogramdan en iyi geçerli çözüm; geçersizse repair/local search. Sunum: “1000 shot, 340 geçersiz, repair sonrası 890 geçerli, ort maliyet −12%”.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Kanal atamada one-hot kısıt ne anlama gelir?',
      options: [
        'Her düğüm en fazla bir kanal seçer (genelde tam bir kanal)',
        'Hiç kanal kullanılmaz',
        'Tüm düğümler aynı kanalı kullanır',
        'Qubit sayısı 1 olmalı',
      ],
      correctIndex: 0,
      explanation: 'One-hot: her düğüm için Σⱼ xᵢ,ⱼ = 1 — tek kanal seçimi.',
    },
    {
      id: 'q2',
      question: 'Komşu hücrelerin aynı kanalı kullanmasını engellemek için tipik penalty?',
      options: [
        'λ xᵢ xⱼ (her ikisi 1 ise ceza)',
        'Shot sayısını artırmak',
        'Mixer devresini kaldırmak',
        'Transpile seviyesi 0',
      ],
      correctIndex: 0,
      explanation: 'xᵢ xⱼ terimi iki düğümün aynı kanalı seçmesini cezalandırır.',
    },
    {
      id: 'q3',
      question: 'Graph coloring ile kanal atama ilişkisi?',
      options: [
        'Aynı problem sınıfı: komşular farklı renk/kanal',
        'Hiç ilişkili değil',
        'Sadece finans problemlerinde kullanılır',
        'Sadece simülatör kavramı',
      ],
      correctIndex: 0,
      explanation: 'Kanal atama graf renklendirme optimizasyonunun sektörel karşılığıdır.',
    },
    {
      id: 'q4',
      question: 'Penalty annealing ne işe yarar?',
      options: [
        'λ’yi kademeli artırarak önce maliyet sonra kısıt odaklı arama',
        'QPU sıcaklığını ayarlamak',
        'Shot sayısını sıfırlamak',
        'Ansatz silmek',
      ],
      correctIndex: 0,
      explanation: 'λ artışı kısıt ihlalini giderek daha pahalı hale getirir.',
    },
    {
      id: 'q5',
      question: 'Geçersiz kuantum çıktısı için pratik adım?',
      options: [
        'Yok say ve sun',
        'Repair / local search ile geçerli çözüme iyileştir',
        'QUBO’yu sil',
        'Simülatörü kapat',
      ],
      correctIndex: 1,
      explanation: 'Post-processing geçerli çözüm oranını artırır; jüriye raporlanmalı.',
    },
    {
      id: 'q6',
      question: 'Haberleşme routing toy modelinde kenar ağırlığı neyi temsil edebilir?',
      options: [
        'Link kapasitesi veya gecikme maliyeti',
        'Shot sayısı',
        'Ansatz parametresi',
        'Sunum süresi',
      ],
      correctIndex: 0,
      explanation: 'Kenar ağırlıkları kapasite, mesafe veya gecikme maliyeti olabilir.',
    },
    {
      id: 'q7',
      question: 'Wi-Fi kanal analojisinde λ çok düşükse ne olur?',
      options: [
        'Komşular aynı kanalı seçer, parazit artar',
        'Tüm kısıtlar otomatik sağlanır',
        'Shot sayısı sıfırlanır',
        'QUBO lineer olur',
      ],
      correctIndex: 0,
      explanation: 'Modül analojisi: düşük λ → kural ihlali ucuz → geçersiz atamalar baskın.',
    },
  ],
  simType: 'constraint',
}
