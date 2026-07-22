export interface GlossaryEntry {
  term: string
  translation: string
  description: string
}

export const glossary: GlossaryEntry[] = [
  {
    term: 'Qubit',
    translation: 'Kuantum biti',
    description:
      'Klasik bitin 0 veya 1 değerinin aksine, süperpozisyon durumunda her iki değerin kombinasyonunu taşıyabilen temel kuantum birimi.',
  },
  {
    term: 'QUBO',
    translation: 'Quadratic Unconstrained Binary Optimization',
    description:
      'İkili değişkenler üzerinde tanımlanan ikinci dereceden bir maliyet fonksiyonunu minimize eden optimizasyon formülasyonu; kuantum algoritmalarına doğrudan map edilebilir.',
  },
  {
    term: 'Ising',
    translation: 'Ising modeli',
    description:
      'Spin değişkenleri (+1/-1) ile tanımlanan ikinci dereceden enerji modeli; QUBO ile dönüşümle eşdeğerdir.',
  },
  {
    term: 'QAOA',
    translation: 'Quantum Approximate Optimization Algorithm',
    description:
      'Kombinatoriyel optimizasyon problemlerini çözmek için parametrik kuantum devreleri kullanan hibrit algoritma; maliyet ve mixer Hamiltonianları ile çalışır.',
  },
  {
    term: 'VQE',
    translation: 'Variational Quantum Eigensolver',
    description:
      'Parametrik ansatz ile Hamiltonian beklenen değerini minimize eden hibrit varyasyonel algoritma.',
  },
  {
    term: 'NISQ',
    translation: 'Noisy Intermediate-Scale Quantum',
    description:
      'Gürültülü, sınırlı qubit sayılı mevcut kuantum donanım dönemi; algoritma tasarımında hata ve derinlik kısıtları dikkate alınmalıdır.',
  },
  {
    term: 'Ansatz',
    translation: 'Parametrik devre şablonu',
    description:
      'VQE ve benzeri varyasyonel algoritmalarda kullanılan, ayarlanabilir parametrelerle tanımlanan kuantum devre yapısı.',
  },
  {
    term: 'Hamiltonian',
    translation: 'Hamiltonyen operatör',
    description:
      'Sistemin enerji/maliyet operatörü; QUBO maliyeti Pauli-Z cinsinden Hamiltonian olarak yazılır.',
  },
  {
    term: 'Mixer',
    translation: 'Karıştırıcı Hamiltonian',
    description:
      'QAOA’da arama uzayını gezen unitary; standart form Σ Xᵢ (transverse field mixer).',
  },
  {
    term: 'Shot',
    translation: 'Ölçüm tekrarı',
    description:
      'Kuantum devresinin çalıştırılıp ölçüm sonucunun kaydedildiği tek bir deneme; istatistiksel sonuçlar için birden fazla shot gerekir.',
  },
  {
    term: 'Transpile',
    translation: 'Devre derleme/uyarlama',
    description:
      'Mantıksal kuantum devresini fiziksel backend’in native kapı setine ve qubit topolojisine dönüştürme adımı.',
  },
  {
    term: 'Sampler',
    translation: 'Örnekleyici',
    description:
      'Kuantum devresini çalıştırıp bitstring ölçüm dağılımı (histogram) döndüren primitive.',
  },
  {
    term: 'Estimator',
    translation: 'Beklenen değer tahmincisi',
    description:
      'Parametrik devre ve observables için ⟨O⟩ beklenen değerini tahmin eden hibrit primitive.',
  },
  {
    term: 'Max-Cut',
    translation: 'Maksimum kesim',
    description:
      'Graf düğümlerini iki kümeye bölerek kesilen kenar ağırlıklarını maximize eden klasik kombinatoriyel problem.',
  },
  {
    term: 'Penalty',
    translation: 'Ceza terimi',
    description:
      'QUBO’da kısıt ihlalini maliyet fonksiyonuna ekleyen ikinci dereceden terim; λ ile ağırlıklandırılır.',
  },
  {
    term: 'Superposition',
    translation: 'Süperpozisyon',
    description:
      'Qubitin |0⟩ ve |1⟩ durumlarının aynı anda taşınması; ölçümde tek sonuca çöker.',
  },
  {
    term: 'Entanglement',
    translation: 'Dolaşıklık',
    description:
      'Qubitler arasında klasik olarak kopyalanamayan kuantum korelasyon; ansatz expressivity için önemlidir.',
  },
  {
    term: 'Pauli-Z',
    translation: 'Pauli-Z operatörü',
    description:
      'QUBO/Ising maliyet terimlerini kuantum devresine map etmek için kullanılan temel observables.',
  },
  {
    term: 'CNOT',
    translation: 'Controlled-NOT kapısı',
    description:
      'İki qubit arasında dolaşıklık kuran temel kapı; fiziksel topolojiye göre SWAP maliyeti gerektirebilir.',
  },
  {
    term: 'Circuit depth',
    translation: 'Devre derinliği',
    description:
      'Kuantum devresindeki kapı katman sayısı; NISQ’ta gürültü ile birlikte artar.',
  },
  {
    term: 'Coupling map',
    translation: 'Bağlantı haritası',
    description:
      'Fiziksel QPU’da hangi qubit çiftlerinin doğrudan kapı uygulayabildiğini tanımlayan graf.',
  },
  {
    term: 'Barren plateau',
    translation: 'Çorak plato',
    description:
      'Varyasyonel optimizasyonda gradientlerin sıfıra yakın olduğu zor landscape bölgesi.',
  },
  {
    term: 'QPU',
    translation: 'Quantum Processing Unit',
    description:
      'Gerçek kuantum işlem birimi; simülatöre göre gürültülü ve kuyruk süreli erişim gerektirir.',
  },
  {
    term: 'Parameter',
    translation: 'Parametre (γ, β, θ)',
    description:
      'QAOA/VQE devresinde klasik optimizer tarafından ayarlanan rotasyon açıları.',
  },
  {
    term: 'Portfolio',
    translation: 'Portföy',
    description:
      'Finans toy problemlerinde seçilen varlık kümesi; ikili değişkenlerle kodlanır.',
  },
  {
    term: 'Routing',
    translation: 'Yönlendirme',
    description:
      'Haberleşme ağlarında trafik veya bağlantı yollarının atanması optimizasyon problemi.',
  },
  {
    term: 'One-hot',
    translation: 'Tek-seçim kodlaması',
    description:
      'Her düğüm/kaynak için tam bir seçeneğin aktif olduğunu garanti eden kısıt: Σ x = 1.',
  },
  {
    term: 'Brute-force',
    translation: 'Tam tarama',
    description:
      'Küçük ikili problemlerde tüm 2^n atamaları deneyerek referans çözüm bulma yöntemi.',
  },
  {
    term: 'Post-processing',
    translation: 'Son işleme',
    description:
      'Kuantum ölçüm çıktısına kısıt kontrolü, repair veya local search uygulama adımı.',
  },
  {
    term: 'IBM Quantum',
    translation: 'IBM Kuantum platformu',
    description:
      'Qiskit, Runtime ve bulut QPU erişimi sağlayan IBM kuantum bilişim ekosistemi.',
  },
  {
    term: 'Optimization level',
    translation: 'Optimizasyon seviyesi',
    description:
      'Transpile sırasında devre optimizasyon agresifliğini belirleyen seviye (0–3).',
  },
  {
    term: 'Intuition',
    translation: 'Sezgi örneği',
    description:
      'Küçük sayılarla somutlaştırılmış toy senaryo; formülasyon ve algoritma seçiminde zihinsel model kurmayı kolaylaştırır.',
  },
  {
    term: 'Playground',
    translation: 'İnteraktif deney alanı',
    description:
      'Parametreleri elle değiştirip sonucu gözlemleyebileceğin modül içi simülasyon veya görselleştirme.',
  },
  {
    term: 'Toy problem',
    translation: 'Oyuncak problem',
    description:
      'Gerçek yarışma verisini basitleştiren küçük örnek; yapı korunur, boyut küçültülür — formülasyon testi için idealdir.',
  },
  {
    term: 'Penalty annealing',
    translation: 'Ceza kademelendirme',
    description:
      'λ ceza katsayısını iterasyon boyunca kademeli artırarak önce maliyet, sonra kısıt odaklı arama stratejisi.',
  },
]

export function findGlossaryTerm(term: string): GlossaryEntry | undefined {
  return glossary.find((entry) => entry.term.toLowerCase() === term.toLowerCase())
}

export function getGlossaryTermsSorted(): GlossaryEntry[] {
  return [...glossary].sort((a, b) => b.term.length - a.term.length)
}
