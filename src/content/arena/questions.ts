import type { ArenaQuestion } from './types'

export const ARENA_QUESTIONS: ArenaQuestion[] = [
  // --- Kuantum Temeller (4) + NISQ cross (arena-t2 moved to nisq) ---
  {
    id: 'arena-t1',
    topic: 'temel',
    question:
      'Bir qubit |ψ⟩ = α|0⟩ + β|1⟩ durumunda |α|² + |β|² = 1 koşulu neyi ifade eder?',
    options: [
      'Olasılık normalizasyonu',
      'Enerji korunumu',
      'Transpile derinliği sınırı',
      'Ceza katsayısı seçimi',
    ],
    correctIndex: 0,
    explanation:
      'Kuantum durum vektörü normalize edilmelidir; |α|² ve |β|² ölçüm olasılıklarıdır ve toplamları 1 olmalıdır.',
  },
  {
    id: 'arena-t2',
    topic: 'nisq',
    question: 'NISQ bağlamında "circuit depth" (devre derinliği) neden kritiktir?',
    options: [
      'Derinlik arttıkça qubit sayısı azalır',
      'Gürültü birikimi ve decoherence derin devrelerde hızla artar',
      'Derinlik sadece simülatörde anlamlıdır',
      'Derinlik penalty terimini otomatik ayarlar',
    ],
    correctIndex: 1,
    explanation:
      'NISQ cihazlarda kapılar hatalıdır; uzun devrelerde hata birikir. Bu yüzden sığ ansatz ve kısa devreler tercih edilir.',
  },
  {
    id: 'arena-t3',
    topic: 'temel',
    question:
      'Optimizasyon probleminde n qubit ile kaç farklı ikili bitstring temsil edilebilir?',
    options: ['n', '2n', '2ⁿ', 'n²'],
    correctIndex: 2,
    explanation:
      'Her qubit bir ikili karar değişkeni olarak kodlanırsa n qubit 2ⁿ olası kombinasyonu temsil eder.',
  },
  {
    id: 'arena-t4',
    topic: 'temel',
    question: 'CNOT kapısı optimizasyon algoritmalarında neden önemlidir?',
    options: [
      'Klasik maliyet fonksiyonunu hesaplar',
      'Shot sayısını otomatik artırır',
      'QUBO matrisini transpile eder',
      'Qubitler arası dolaşıklık kurarak korelasyonlu arama uzayını temsil eder',
    ],
    correctIndex: 3,
    explanation:
      'Dolaşıklık, qubitler arası bağımlılıkları temsil eder; QAOA gibi algoritmalar cost Hamiltonian yapısını bu kapılarla yansıtır.',
  },
  {
    id: 'arena-t5',
    topic: 'temel',
    question:
      '1000 shot ile devre çalıştırıldığında elde edilen histogram neyi gösterir?',
    options: [
      'Ölçüm sonuçlarının istatistiksel dağılımını',
      'Her shot aynı sonucu verir',
      'Transpile hata oranını',
      'Klasik baseline skorunu',
    ],
    correctIndex: 0,
    explanation:
      'Kuantum ölçüm olasılıksaldır; çoklu shot ile bitstring dağılımı tahmin edilir ve en sık sonuç aday çözüm olarak alınır.',
  },

  // --- QUBO / Ising (5) ---
  {
    id: 'arena-q1',
    topic: 'qubo',
    question:
      'QUBO formunda minimize edilen ifade genel olarak hangisidir?',
    options: [
      '∑ᵢ hᵢσᵢ',
      '∑ᵢⱼ Qᵢⱼ xᵢ xⱼ + ∑ᵢ cᵢ xᵢ (xᵢ ∈ {0,1})',
      '∑ᵢ |ψᵢ|²',
      '∑ᵢ λᵢ sin(θᵢ)',
    ],
    correctIndex: 1,
    explanation:
      'QUBO (Quadratic Unconstrained Binary Optimization) ikili değişkenler üzerinde quadratic bir maliyet fonksiyonu minimize eder.',
  },
  {
    id: 'arena-q2',
    topic: 'qubo',
    question: 'Ising modelinde spin değişkenleri sᵢ tipik olarak hangi kümededir?',
    options: ['{0, 1}', '{0, 1, 2}', '{-1, +1}', 'ℝ'],
    correctIndex: 2,
    explanation:
      'Ising spinleri genelde {-1, +1} alır; x = (s+1)/2 dönüşümü ile QUBO ikili değişkenlerine eşlenir.',
  },
  {
    id: 'arena-q3',
    topic: 'qubo',
    question:
      'Max-Cut probleminde kenar (i,j) için QUBO ceza terimi genelde nasıl yazılır?',
    options: [
      'wᵢⱼ (xᵢ - xⱼ)² minimize etmek',
      'wᵢⱼ xᵢ + wᵢⱼ xⱼ',
      'wᵢⱼ / (xᵢ + x_j)',
      '−wᵢⱼ (xᵢ − xⱼ)² veya eşdeğeri wᵢⱼ (2xᵢxⱼ − xᵢ − xⱼ) minimize etmek',
    ],
    correctIndex: 3,
    explanation:
      'QUBO minimize edildiği için Max-Cut’ta −cut yazılır: −w(xᵢ−xⱼ)² = w(2xᵢxⱼ−xᵢ−xⱼ). (xᵢ−xⱼ)² tek başına minimize edilirse cut azalır.',
  },
  {
    id: 'arena-q4',
    topic: 'qubo',
    question:
      'Kısıtlı bir problemi QUBO\'ya çevirmek için en yaygın yaklaşım nedir?',
    options: [
      'Ceza (penalty) terimleri ekleyerek ihlali maliyetli kılmak',
      'Kısıtları yok saymak',
      'Qubit sayısını yarıya indirmek',
      'Shot sayısını sıfırlamak',
    ],
    correctIndex: 0,
    explanation:
      'Kısıt ihlali λ·(kısıt)² şeklinde ceza terimi ile hedef fonksiyona eklenir; λ yeterince büyükse optimal çözüm kısıtı sağlar.',
  },
  {
    id: 'arena-q5',
    topic: 'qubo',
    question:
      'Simetrik QUBO matrisinde Qᵢⱼ = Qⱼᵢ olduğunda xᵢ xⱼ terimi neden tek kez sayılır?',
    options: [
      'Matris her zaman diagonal olmalıdır',
      'xᵢ xⱼ = xⱼ xᵢ olduğu için çift sayımı önlemek gerekir',
      'IBM cihazları simetrik matris kabul etmez',
      'Ising dönüşümü simetriyi kaldırır',
    ],
    correctIndex: 1,
    explanation:
      'İkili değişkenlerde xᵢxⱼ = xⱼxᵢ; off-diagonal terimler genelde i<j için bir kez yazılır veya simetrik matrisin yarısı kullanılır.',
  },

  // --- QAOA (4) ---
  {
    id: 'arena-a1',
    topic: 'qaoa',
    question: 'QAOA\'da "mixer Hamiltonian" H_M tipik olarak ne yapar?',
    options: [
      'Maliyet fonksiyonunu kodlar',
      'Gürültü modelini simüle eder',
      'Arama uzayında süperpozisyonu koruyarak keşif yapar',
      'Transpile optimizasyonu yapar',
    ],
    correctIndex: 2,
    explanation:
      'Mixer (genelde ∑Xᵢ) tüm bitstringler arasında geçiş olasılığını korur; cost layer ise iyi çözümlere ağırlık verir.',
  },
  {
    id: 'arena-a2',
    topic: 'qaoa',
    question: 'QAOA parametreleri γ (gamma) ve β (beta) neyi temsil eder?',
    options: [
      'Shot sayısı ve qubit sayısı',
      'Ceza katsayısı ve learning rate',
      'Transpile seviyesi ve backend seçimi',
      'Cost ve mixer katmanlarındaki evrim süreleri / açıları',
    ],
    correctIndex: 3,
    explanation:
      'Her QAOA katmanında e^{-iγH_C} cost unitary ve e^{-iβH_M} mixer unitary uygulanır; γ ve β klasik optimizer tarafından ayarlanır.',
  },
  {
    id: 'arena-a3',
    topic: 'qaoa',
    question: 'QAOA çıktısından çözüm okuma (decoding) adımında ne yapılır?',
    options: [
      'En sık ölçülen bitstring(ler) alınır, kısıt kontrolü ve post-processing uygulanır',
      'İlk qubit ölçülür ve biter',
      'Tüm shotlar atılır',
      'Sadece simülatör sonucu kabul edilir',
    ],
    correctIndex: 0,
    explanation:
      'QAOA olasılıksal sonuç verir; en iyi aday bitstringler seçilir, kısıt ihlali varsa ceza veya local search ile düzeltilir.',
  },
  {
    id: 'arena-a4',
    topic: 'qaoa',
    question: 'p=1 QAOA ile p=3 QAOA arasındaki temel fark nedir?',
    options: [
      'p qubit sayısını belirler',
      'p, cost-mixer alternasyon katman sayısıdır; p arttıkça ifade gücü artar ama devre derinliği de artar',
      'p shot sayısıdır',
      'p sadece simülatörde kullanılır',
    ],
    correctIndex: 1,
    explanation:
      'p parametresi QAOA derinliğini belirler. Daha yüksek p daha iyi yaklaşım sağlayabilir ancak NISQ\'ta gürültü nedeniyle sınırlıdır.',
  },

  // --- VQE (3) ---
  {
    id: 'arena-v1',
    topic: 'vqe',
    question: 'VQE (Variational Quantum Eigensolver) hangi tür problemler için uygundur?',
    options: [
      'Sadece graf kesim problemleri',
      'Sadece portföy optimizasyonu',
      'Ground-state enerji ve genel eigenvalue problemleri',
      'Klasik sorting',
    ],
    correctIndex: 2,
    explanation:
      'VQE parametrik ansatz ile ⟨ψ(θ)|H|ψ(θ)⟩ beklenen değerini minimize ederek Hamiltonian\'ın en düşük eigenvalue\'sunu bulmaya çalışır.',
  },
  {
    id: 'arena-v2',
    topic: 'vqe',
    question: 'VQE\'de klasik optimizer\'ın rolü nedir?',
    options: [
      'Qubit sayısını artırmak',
      'IBM token yenilemek',
      'Transpile layout seçmek',
      'Ansatz parametrelerini (θ) maliyet fonksiyonuna göre güncellemek',
    ],
    correctIndex: 3,
    explanation:
      'VQE hibrit bir algoritmadır: kuantum devresi beklenen değeri ölçer, klasik optimizer parametreleri iteratif günceller.',
  },
  {
    id: 'arena-v3',
    topic: 'vqe',
    question: 'QAOA ile VQE arasındaki ilişki en doğru nasıl ifade edilir?',
    options: [
      'QAOA, belirli bir parametrik ansatz yapısına sahip VQE türü bir algoritmadır',
      'Tamamen farklı; hiçbir ortak nokta yok',
      'VQE sadece kimya moleküllerinde kullanılır, optimizasyonda kullanılmaz',
      'VQE shot gerektirmez',
    ],
    correctIndex: 0,
    explanation:
      'QAOA, cost+mixer alternasyonlu sabit bir ansatz ile VQE çerçevesinde çalışır; ikisi de variational quantum algorithm ailesindendir.',
  },

  // --- NISQ / IBM (4) ---
  {
    id: 'arena-n1',
    topic: 'nisq',
    question: 'NISQ dönemi cihazların temel kısıtı nedir?',
    options: [
      'Sınırsız qubit ve sıfır gürültü',
      'Sınırlı qubit, yüksek hata oranı, kısa tutarlılık süresi',
      'Sadece klasik simülasyon',
      'Yalnızca 2 qubit destekler',
    ],
    correctIndex: 1,
    explanation:
      'NISQ (Noisy Intermediate-Scale Quantum): orta ölçekli ama hatalı cihazlar; error correction henüz tam pratik değildir.',
  },
  {
    id: 'arena-n2',
    topic: 'nisq',
    question: 'IBM Quantum\'da "transpile" adımı ne yapar?',
    options: [
      'Sonuçları grafikleştirir',
      'Shot sayısını rastgele belirler',
      'Mantıksal devreyi donanımın native kapı setine ve bağlantı topolojisine uyarlar',
      'QUBO matrisini çözer',
    ],
    correctIndex: 2,
    explanation:
      'Transpile, abstract devreyi hedef backend\'in kapı seti, coupling map ve kalibrasyon kısıtlarına göre yeniden yazar.',
  },
  {
    id: 'arena-n3',
    topic: 'nisq',
    question: 'Gerçek IBM backend ile simülatör karşılaştırmasında hangisi doğrudur?',
    options: [
      'Simülatör her zaman daha kötü sonuç verir',
      'Backend shot kullanamaz',
      'İkisi aynı transpile çıktısını garanti eder',
      'Simülatör gürültüsüz ideal sonuç verir; backend gürültü ve kalibrasyon etkileri içerir',
    ],
    correctIndex: 3,
    explanation:
      'Simülatör algoritma doğruluğunu test etmek içindir; gerçek cihaz sonuçları gürültü, SPAM hataları ve bağlantı kısıtlarından etkilenir.',
  },
  {
    id: 'arena-n4',
    topic: 'nisq',
    question: 'Yarışma ortamında yedek simülatör planı neden önemlidir?',
    options: [
      'Backend kuyruğu veya erişim sorununda geliştirmeyi sürdürebilmek için',
      'Shot sayısını sıfırlamak için',
      'QUBO formülasyonunu değiştirmek için',
      'Sunum slaytlarını otomatik üretmek için',
    ],
    correctIndex: 0,
    explanation:
      'IBM backend\'lerde kuyruk, token veya bağlantı sorunları olabilir; Aer/simulator veya TRUBA gibi alternatifler risk azaltır.',
  },

  // --- Sektör: Banka-Finans + Haberleşme (4) ---
  {
    id: 'arena-s1',
    topic: 'sektor',
    question:
      'Portföy optimizasyonunda ikili QUBO encoding ile genelde ne temsil edilir?',
    options: [
      'Her hisse senedinin fiyat geçmişi',
      'Her varlığın portföye dahil edilip edilmemesi (xᵢ ∈ {0,1})',
      'Piyasa volatilitesi sürekli değişkeni',
      'Merkez bankası faiz oranı',
    ],
    correctIndex: 1,
    explanation:
      'Seçim probleminde xᵢ=1 varlık i portföyde, xᵢ=0 değil; getiri ve risk terimleri bu ikili değişkenler üzerinde quadratic yazılır.',
  },
  {
    id: 'arena-s2',
    topic: 'sektor',
    question:
      'Finansal portföyde "cardinality constraint" (en fazla K varlık) QUBO\'ya nasıl eklenir?',
    options: [
      'Kısıt eklenemez, problem QUBO olamaz',
      'Sadece VQE ile çözülür',
      '(∑xᵢ - K)² ceza terimi veya slack değişkenleri ile',
      'Shot sayısı K\'ya eşitlenir',
    ],
    correctIndex: 2,
    explanation:
      'Toplam seçim sayısını K\'ya sabitlemek için ceza terimi (∑xᵢ-K)² veya ek ikili slack değişkenleri kullanılır.',
  },
  {
    id: 'arena-s3',
    topic: 'sektor',
    question:
      'Haberleşme ağlarında frekans atama (frequency assignment) neden combinatorial optimizasyondur?',
    options: [
      'Frekanslar sürekli olduğu için analitik çözüm vardır',
      'Sadece kuantum bilgisayarda tanımlıdır',
      'Klasik yöntemler yasaktır',
      'Komşu hücrelere çakışmayan frekans seçimi ikili/kartezyen kararlar gerektirir',
    ],
    correctIndex: 3,
    explanation:
      'Interference kısıtları ve sınırlı spektrum, frekans/kanal seçimini graf renklendirme veya QUBO benzeri yapılara dönüştürür.',
  },
  {
    id: 'arena-s4',
    topic: 'sektor',
    question:
      'Bankacılıkta kredi riski portföy seçiminde kuantum yaklaşımın ilk adımı genelde nedir?',
    options: [
      'Problemi QUBO/Ising formuna çevirmek ve küçük örnek üzerinde klasik baseline ile kıyaslamak',
      'Doğrudan IBM\'e yükleme',
      'Sunum hazırlamak',
      'Qubit sayısını maksimuma çıkarmak',
    ],
    correctIndex: 0,
    explanation:
      'İş problemi → matematiksel model → QUBO formülasyon → küçük instance ile doğrulama, yarışma disiplininin temel adımıdır.',
  },

  // --- Extra cross-topic (4) to reach 29 ---
  {
    id: 'arena-x1',
    topic: 'qaoa',
    question:
      'QAOA cost Hamiltonian H_C, QUBO maliyet matrisi Q ile nasıl ilişkilidir?',
    options: [
      'Hiçbir ilişki yok',
      'H_C, Q terimlerine karşılık gelen Z operatörleri cinsinden yazılır',
      'H_C sadece X kapılarından oluşur',
      'Q matrisi transpile sonrası oluşur',
    ],
    correctIndex: 1,
    explanation:
      'QUBO\'daki xᵢxⱼ terimleri Ising ZᵢZⱼ terimlerine dönüşür; cost Hamiltonian bu etkileşimleri kuantum operatör olarak kodlar.',
  },
  {
    id: 'arena-x2',
    topic: 'vqe',
    question: 'VQE\'de "barren plateau" problemi ne anlama gelir?',
    options: [
      'Optimizer çok hızlı yakınsar',
      'Shot sayısının yetersiz olması',
      'Geniş ansatz\'larda gradyanların üssel olarak küçülmesi, eğitimi zorlaştırır',
      'Backend kuyruğunun dolu olması',
    ],
    correctIndex: 2,
    explanation:
      'Derin/rastgele ansatz\'larda maliyet gradyanları ortalama olarak sıfıra yakın olabilir; parametre optimizasyonu zorlaşır.',
  },
  {
    id: 'arena-x3',
    topic: 'nisq',
    question: 'Optimization level (transpile) yükseltmek genelde ne trade-off yaratır?',
    options: [
      'Shot sayısını azaltır',
      'Qubit sayısını artırır',
      'Gürültüyü tamamen kaldırır',
      'Daha kısa devre ama daha uzun transpile süresi',
    ],
    correctIndex: 3,
    explanation:
      'Yüksek optimization level kapı eşdeğerliği ile devreyi sıkıştırır; transpile süresi artabilir ama derinlik azalabilir.',
  },
  {
    id: 'arena-x4',
    topic: 'sektor',
    question:
      'Haberleşmede "cell planning" problemi QUBO\'ya çevrilirken tipik amaç fonksiyonu neyi optimize eder?',
    options: [
      'Kapasite/kapsama ve interference cezalarını dengeleyen maliyet',
      'Anten rengini',
      'Sunucu işletim sistemi seçimini',
      'Shot sayısını',
    ],
    correctIndex: 0,
    explanation:
      'Ağ planlama QUBO\'ları genelde kapasite, kapsama ve komşu hücre girişimini dengeleyen çok amaçlı maliyet terimleri içerir.',
  },
]

export const ARENA_EXAM_COUNT = ARENA_QUESTIONS.length
