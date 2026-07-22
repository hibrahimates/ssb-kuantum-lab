import type { ModuleContent } from './types'

export const klasikKopru: ModuleContent = {
  slug: 'klasik-kopru',
  order: 2,
  title: 'Klasik Köprü',
  subtitle: 'Maliyet fonksiyonu, kısıt ve kombinatoriyel zorluk',
  goal: 'Klasik optimizasyon dilini (değişken, maliyet, kısıt, Penalty) kuantum formülasyonuna taşıyabilecek seviyede pekiştirmek.',
  analogy: {
    title: 'Optimizasyon = ceza puanlı bulmaca',
    text: 'Bir QUBO problemi sudoku gibidir ama kurallar ceza puanıyla yazılır: doğru hamle maliyeti düşürür, kural ihlali Penalty ile pahalılaşır. λ çok düşükse oyuncu kuralları çiğner (kısıt ihlali); λ çok yüksekse sadece kurallara uyar, skor (maliyet) optimize etmez. Klasik köprü modülü bu dengeyi sezgisel olarak oturtur.',
  },
  intuitions: [
    {
      title: 'Knapsack toy: 4 eşya, kapasite 5',
      setup:
        'Eşyalar: A(w=3,v=30), B(w=2,v=20), C(w=2,v=25), D(w=4,v=40). Kapasite W=5. xᵢ∈{0,1}: eşya i alınsın mı?',
      insight:
        'Optimal: B+C (ağırlık 4, değer 45). Brute-force 2⁴=16 atama — saniyeler. 30 eşyada 2³⁰≈1 milyar: brute-force ölü. Yarışmada n=20–40 arası tipik.',
    },
    {
      title: 'Penalty λ denemesi',
      setup:
        'Kısıt: x₁+x₂+x₃=1 (one-hot). Gerçek maliyet: minimize x₁·5 + x₂·3 + x₃·8. λ=1 ile ceza zayıf → çözüm (1,1,1) maliyet=16+4=20 (ihlal). λ=100 → (0,1,0) maliyet=3.',
      insight:
        'λ taraması şart: λ∈{1,10,50,100} grafiği çiz; geçerli çözüm oranı %100 olana kadar artır, sonra maliyeti kontrol et.',
    },
    {
      title: 'Klasik vs kuantum arama',
      setup:
        'n=10 ikili değişken, 1024 kombinasyon. Klasik greedy 0.01 sn; tam Brute-force 1024 değerlendirme ~1 ms. n=25 → 33 milyon kombinasyon.',
      insight:
        'Klasik heuristik hızlı ama optimum garantisi yok. QAOA “yaklaşık en iyi” arar — karşılaştırma sunumda zorunlu (Modül 10).',
    },
  ],
  tryThis: [
    {
      prompt:
        'Knapsack playground\'da ağırlık limitini 5\'ten 3\'e düşür. Hangi eşya kombinasyonu optimal kalır? Değer/ağırlık oranına bak.',
      hint: 'Greedy “en iyi oran” ile optimal farklı olabilir — bunu not al.',
    },
    {
      prompt:
        'classical-vs-quantum playground\'da klasik tarama adım sayacını oku (8 yapılandırma). QAOA tarafı tüm uzayı tek tek gezmiyor — 2^n büyümesini kağıda extrapole et (n=12, n=20).',
    },
    {
      prompt:
        'Constraint/Penalty düşün: λ=1 ve λ=50 için aynı toy problemde geçerli çözüm sayısını tahmin et — sonra Modül 9\'da doğrula.',
    },
  ],
  playgrounds: ['knapsack', 'classical-vs-quantum'],
  sections: [
    {
      id: 'cost',
      title: 'Maliyet Fonksiyonu Nedir?',
      body: 'Optimizasyon probleminin özü bir maliyet fonksiyonunu minimize (veya maximize) etmektir. Değişkenler atandıkça maliyet hesaplanır; en iyi atama en düşük maliyeti verir. Örnek: 3 proje {P1,P2,P3}, maliyetler {40,25,55} — minimize P2+P3 = 80 vs P1+P2 = 65. Yarışmada senaryo “iş yükü dağıtımı”, “Portfolio” veya “Routing” metaforuyla gelir; önce bunu xᵢ ve Σ cᵢxᵢ diline çevir.',
    },
    {
      id: 'constraints',
      title: 'Kısıtlar ve Ceza (Penalty)',
      body: 'Kısıt, çözümün uyması gereken kuraldır: kapasite limiti, bütçe tavanı, her düğüme tam bir atama vb. Klasik çözücülerde kısıtlar doğrudan modele eklenir; QUBO dünyasında genelde soft constraint olarak Penalty terimi eklenir. (Σxᵢ−k)² açıldığında xᵢxⱼ çapraz terimleri doğar — Q matrisine gömülür. λ seçimi dengeyi belirler: λ=10 ihlale izin verirken λ=500 maliyet landscape\'ini düzleştirir.',
      miniPlayground: 'constraint',
    },
    {
      id: 'combinatorial',
      title: 'Kombinatoriyel Patlama',
      body: 'n ikili değişken için 2^n olası atama vardır. n=20 → 2²⁰≈1.048.576; n=30 → ~1 milyar. Max-Cut, TSP benzeri Routing, knapsack ve graph coloring NP-hard sınıfına yakındır. Sayısal örnek: 25 değişkenli knapsack\'te saniyede 10⁶ değerlendirme yapsan ~33 saniye — yarışma süresi yetmez. Kuantum yaklaşımlar (QAOA, VQE) bu uzayda yaklaşık en iyi çözüm arar.',
    },
    {
      id: 'bridge',
      title: 'Kuantuma Köprü: Binary Encoding',
      body: 'Kuantum algoritmaları genelde her karar değişkenini bir Qubit (veya Qubit ölçümü) ile temsil eder: |0⟩ ve |1⟩ klasik 0/1\'e karşılık gelir. Maliyet fonksiyonunu ikinci dereceden ikili forma (QUBO) yazdığınızda, cost Hamiltonian ve Mixer devreleri tanımlanabilir. Önce→sonra: “3 varlıktan 1 seç” → x₁,x₂,x₃∈{0,1}, minimize maliyet, Penalty (x₁+x₂+x₃−1)².',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'QUBO formülasyonunda kısıtlar genelde nasıl eklenir?',
      options: [
        'Doğrudan LP gevşetmesi ile',
        'Ceza (penalty) terimleri ile maliyet fonksiyonuna',
        'Simülasyon anında rastgele atlanarak',
        'Sadece post-processing filtresi ile',
      ],
      correctIndex: 1,
      explanation:
        'QUBO unconstrained (kısıtsız) bir formdur; kısıtlar ceza terimleriyle maliyete eklenir ve λ ile ağırlıklandırılır.',
    },
    {
      id: 'q2',
      question: '20 ikili değişkenli bir problemde kaç olası atama vardır?',
      options: ['20', '400', '2^20 ≈ 1 milyon', '2^20 ≈ 1 milyar'],
      correctIndex: 2,
      explanation: 'Her değişken 2 değer alır; toplam kombinasyon 2^n = 2^20 ≈ 1.048.576.',
    },
    {
      id: 'q3',
      question: 'Ceza katsayısı λ çok küçük seçilirse ne olur?',
      options: [
        'Maliyet her zaman sıfır olur',
        'Kısıt ihlali olan çözümler kabul edilebilir hale gelir',
        'Qubit sayısı artar',
        'Devre derinliği sıfırlanır',
      ],
      correctIndex: 1,
      explanation:
        'λ küçükse ceza terimi baskın olmaz; optimizer maliyeti düşürürken kısıtları ihlal edebilir.',
    },
    {
      id: 'q4',
      question: 'Max-Cut problemi hangi optimizasyon sınıfına örnektir?',
      options: [
        'Lineer programlama',
        'Kombinatoriyel (NP-hard) optimizasyon',
        'Sürekli konveks optimizasyon',
        'Ordinary differential equations',
      ],
      correctIndex: 1,
      explanation:
        'Max-Cut, graf üzerinde ikili bölümleme arayan klasik bir kombinatoriyel optimizasyon problemidir.',
    },
    {
      id: 'q5',
      question: 'Yarışmada ilk adım olarak ne yapılmalıdır?',
      options: [
        'Doğrudan Qiskit kodu yazmak',
        'Problemi okuyup değişken, maliyet ve kısıtları netleştirmek',
        'IBM QPU rezervasyonu almak',
        'Sunum slaytlarını hazırlamak',
      ],
      correctIndex: 1,
      explanation:
        'Doğru formülasyon olmadan algoritma ve kod anlamsızdır; problem okuma disiplini kritiktir.',
    },
    {
      id: 'q6',
      question: '4 eşyalı knapsack toy\'da kapasite 5 iken B(w=2,v=20)+C(w=2,v=25) toplam değeri nedir?',
      options: ['40', '45', '50', '55'],
      correctIndex: 1,
      explanation: 'B+C ağırlık 4≤5, değer 20+25=45 — modül sezgi örneğiyle uyumlu.',
    },
  ],
}
