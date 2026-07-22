import type { ModuleContent } from './types'

export const kuantumTemeller: ModuleContent = {
  slug: 'kuantum-temeller',
  order: 3,
  title: 'Kuantum Temeller',
  subtitle: 'Qubit, süperpozisyon, ölçüm ve dolaşıklık',
  goal: 'Optimizasyon algoritmalarını anlamak için gerekli minimum kuantum kavramlarını (Qubit, ölçüm, devre) oturtmak.',
  analogy: {
    title: 'Qubit = pusula iğnesi + yazı-tura',
    text: 'Klasik bit kesin yazı (0) veya tura (1) gibidir — para masada dururken sonucu bilirsin. Qubit ise havada dönen para: ölçene kadar hem yazı hem tura “ağırlıklı” olarak vardır (Superposition). Pusula iğnesi gibi α|0⟩+β|1⟩ yönünü gösterir; ölçüm pusulayı masaya indirir ve tek sonuç alırsın. Optimizasyonda algoritma, olasılığı ucuz çözümlere kaydırmaya çalışır.',
    visual: 'viz-coin',
  },
  intuitions: [
    {
      title: 'Yazı-tura 1000 kez',
      setup:
        '|ψ⟩=(|0⟩+|1⟩)/√2 durumunda tek ölçüm: %50 yazı, %50 tura. 1000 Shot sonrası ~500/500 histogram (istatistiksel sapma ±√N).',
      insight:
        'Tek Shot sonucuna güvenme — QAOA çıktısı histogramdır. En sık bitstring aday çözüm, ama %60 bile yeterli değilse post-processing gerekir.',
    },
    {
      title: '3 Qubit = 8 kombinasyon',
      setup:
        '3 ikili karar değişkeni: 000…111 arası 8 atama. Product state |+⟩⊗|+⟩⊗|+⟩ her bitstring olasılığını 1/8 verir.',
      insight:
        'Eşit dağılım optimizasyon değil — cost Hamiltonian bazı bitstringleri bastırır, Mixer keşif yapar. 3 Qubit toy Max-Cut için yeterli sezgi.',
    },
    {
      title: 'Bankacılık kararı tek Qubit',
      setup:
        'Varlık A dahil mi? x_A=1 → |1⟩, x_A=0 → |0⟩. Maliyet düşükse devre |1⟩ olasılığını artırır; ölçümde 1 gelme sıklığı artar.',
      insight:
        'Qubit sayısı = ikili değişken sayısı (standart kodlama). 10 varlık → 10 Qubit; NISQ\'ta derinlik sınırlar p ve ansatz seçimini.',
    },
  ],
  tryThis: [
    {
      prompt:
        'viz-coin görselinde süperpozisyonu izle; ardından qubit playground\'da θ\'yı 90°, φ\'yi 0° yap ve Durumu güncelle. |0⟩/|1⟩ olasılık çubuklarında |+⟩ sezgisini gözlemle.',
    },
    {
      prompt:
        'Qubit playground\'da 2-kubit Bell dene\'ye bas. |00⟩ ve |11⟩ olasılıklarının eşitlendiğini, |01⟩/|10⟩\'un sıfırlandığını doğrula; birkaç kez Ölç.',
    },
    {
      prompt:
        'shots playground\'da Shot sayısını 64 → 2048 yap. Histogramın nasıl stabilize olduğunu not et — yarışmada shot budget böyle seçilir.',
      hint: '4096 ≈ %1.6 bin hatası (√N kuralı).',
    },
  ],
  playgrounds: ['viz-coin', 'qubit', 'shots'],
  sections: [
    {
      id: 'qubit',
      title: 'Qubit ve Süperpozisyon',
      body: 'Klasik bit 0 veya 1 iken, Qubit |ψ⟩ = α|0⟩ + β|1⟩ durumunda her iki tabanı aynı anda taşıyabilir — buna Superposition denir. |α|² ve |β|² ölçüm olasılıklarıdır; toplamları 1 olmalıdır. Örnek: α=0.9, β=0.436 → P(0)=0.81, P(1)=0.19. Optimizasyonda her Qubit bir ikili karar değişkenini temsil eder.',
      visual: 'viz-coin',
    },
    {
      id: 'measurement',
      title: 'Ölçüm ve Shot',
      body: 'Qubit ölçüldüğünde Superposition çöker ve 0 veya 1 sonucu alınır. 100 Shot, P(1)=0.7 ise ~70 kez 1 görürsün (±7 sapma normal). QAOA çıktısı olasılık dağılımıdır — en sık ölçülen bitstring aday çözümdür; kısıt kontrolü ve Post-processing gerekebilir.',
      miniPlayground: 'shots',
    },
    {
      id: 'gates',
      title: 'Kapılar ve Devre',
      body: 'Kuantum devresi unitary kapılardan oluşur: Hadamard (H) Superposition yaratır, RX/RY/RZ rotasyonları Parameter taşır, CNOT Entanglement kurar. QAOA\'da cost unitary e^-iγH_C ve mixer unitary e^-iβH_M alternatif uygulanır; γ ve β klasik optimizer tarafından ayarlanır. 2 Qubit toy: H→CNOT→H zinciri Bell durumu üretir.',
    },
    {
      id: 'entanglement',
      title: 'Dolaşıklık Neden Önemli?',
      body: 'Entanglement, Qubitler arasında klasik kopyalanamayan korelasyon yaratır. Product state tüm kombinasyonları bağımsız temsil edemez; optimizasyon algoritmaları dolaşık ansatz ile arama uzayını verimli tarar. NISQ\'ta Circuit depth arttıkça decoherence artar — p=1 QAOA sığ, p=3 derin sayılır.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: '|ψ⟩ = (|0⟩ + |1⟩)/√2 durumunda |0⟩ ölçüm olasılığı nedir?',
      options: ['0', '0.25', '0.5', '1'],
      correctIndex: 2,
      explanation: 'Eşit süperpozisyonda her tabanın genlik katsayısı 1/√2; olasılık |1/√2|² = 0.5.',
    },
    {
      id: 'q2',
      question: 'QAOA sonucunu yorumlamak için neden birden fazla shot gerekir?',
      options: [
        'Shot sayısı qubit sayısını artırır',
        'Tek ölçüm deterministik değildir; istatistik gerekir',
        'Shot transpile adımını atlar',
        'Shot sadece simülatör için gereklidir',
      ],
      correctIndex: 1,
      explanation:
        'Kuantum ölçümü olasılıksaldır; güvenilir dağılım için çoklu tekrar şarttır.',
    },
    {
      id: 'q3',
      question: 'Hadamard (H) kapısı ne yapar?',
      options: [
        'Qubiti |0⟩ durumuna sıfırlar',
        'Süperpozisyon oluşturur',
        'Qubiti siler',
        'Ceza terimi ekler',
      ],
      correctIndex: 1,
      explanation: 'H, |0⟩ → (|0⟩+|1⟩)/√2 dönüşümüyle süperpozisyon yaratır.',
    },
    {
      id: 'q4',
      question: 'Optimizasyonda bir qubit genelde neyi temsil eder?',
      options: [
        'Sürekli bir reel değişken',
        'İkili (0/1) karar değişkeni',
        'Lagrange çarpanı',
        'Shot sayısı',
      ],
      correctIndex: 1,
      explanation: 'QUBO/Ising formülasyonunda her ikili değişken bir qubit ölçümüne map edilir.',
    },
    {
      id: 'q5',
      question: 'Circuit depth (devre derinliği) NISQ’ta neden kritiktir?',
      options: [
        'Derin devreler her zaman daha doğrudur',
        'Gürültü ve decoherence derinlikle artar',
        'Derinlik shot sayısını azaltır',
        'IBM QPU derinliği sınırsız destekler',
      ],
      correctIndex: 1,
      explanation:
        'NISQ cihazlarda hata birikimi devre derinliğiyle artar; sığ devreler tercih edilir.',
    },
    {
      id: 'q6',
      question: 'Dolaşıklık olmadan product state ile tam arama uzayı temsil edilebilir mi?',
      options: [
        'Evet, her zaman tam temsil mümkün',
        'Hayır, belirli korelasyonlar için dolaşıklık gerekir',
        'Sadece simülatörde mümkün',
        'Dolaşıklık sadece VQE için gereklidir',
      ],
      correctIndex: 1,
      explanation:
        'Product state tüm ikili kombinasyonların karmaşık korelasyonlarını verimli kodlayamaz.',
    },
    {
      id: 'q7',
      question: '1000 shot sonrası P(1)=0.5 için beklenen “1” sayısı yaklaşık?',
      options: ['100', '250', '500', '1000'],
      correctIndex: 2,
      explanation: '1000×0.5=500; modül sezgi örneğiyle uyumlu istatistik.',
    },
  ],
  simType: 'qubit',
}
