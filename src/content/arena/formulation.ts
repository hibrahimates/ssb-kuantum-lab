import type { FormulationTask } from './types'

/** Max-Cut on a 4-node diamond graph — interactive QUBO formulation steps. */
export const MAX_CUT_FORMULATION: FormulationTask = {
  id: 'max-cut-diamond',
  title: 'Max-Cut Formülasyon Görevi',
  scenario:
    'Dört düğümlü elmas grafında (1—2, 2—3, 3—4, 4—1, 2—4) kenar ağırlıkları w=1. ' +
    'Düğümleri iki kümeye ayırarak kesilen kenar sayısını maksimize etmek istiyorsun. ' +
    'Aşağıdaki QUBO formülasyon kararlarını doğru seç.',
  steps: [
    {
      id: 'encoding',
      title: 'Değişken Kodlaması',
      prompt: 'Her düğüm i için hangi ikili değişken tanımı Max-Cut QUBO\'su için uygundur?',
      choices: [
        {
          id: 'enc-a',
          label: 'xᵢ = 1 düğüm A kümesinde, xᵢ = 0 düğüm B kümesinde',
          correct: true,
          explanation:
            'Standart ikili bölümleme: iki küme etiketi {0,1} ile kodlanır; farklı etiketli düğümler arası kenar kesilmiş sayılır.',
        },
        {
          id: 'enc-b',
          label: 'xᵢ = düğüm derecesi (komşu sayısı)',
          correct: false,
          explanation:
            'Derece sabit graf özelliğidir, karar değişkeni değildir; küme üyeliği temsil edilmez.',
        },
        {
          id: 'enc-c',
          label: 'xᵢ ∈ {0,1,2,3} — dört küme',
          correct: false,
          explanation:
            'Max-Cut ikili bölümleme problemidir; tek ikili değişken yeterlidir. Dört değer gereksiz karmaşıklık yaratır.',
        },
        {
          id: 'enc-d',
          label: 'xᵢ = kenar ağırlığı toplamı',
          correct: false,
          explanation:
            'Ağırlık sabit parametredir; optimizasyon değişkeni küme ataması olmalıdır.',
        },
      ],
    },
    {
      id: 'objective',
      title: 'Amaç Fonksiyonu',
      prompt: 'Kenar (i,j) için kesilen kenarı ödüllendiren QUBO terimi hangisidir? (minimize QUBO varsayımı)',
      choices: [
        {
          id: 'obj-a',
          label: 'Minimize: ∑_{(i,j)∈E} wᵢⱼ (xᵢ - xⱼ)²',
          correct: false,
          explanation:
            '(xᵢ−xⱼ)² kesilen kenarı sayar; bu ifadeyi minimize etmek cut değerini azaltır (aynı kümede kalmayı tercih eder) — Max-Cut için yanlış yön.',
        },
        {
          id: 'obj-b',
          label: 'Minimize: ∑_{(i,j)∈E} wᵢⱼ (2xᵢxⱼ − xᵢ − xⱼ)',
          correct: true,
          explanation:
            '2xᵢxⱼ−xᵢ−xⱼ = −(xᵢ−xⱼ)²; QUBO minimize edildiğinde −cut minimize edilir, yani cut maksimize edilir — maxCutToQubo ile aynı konvansiyon.',
        },
        {
          id: 'obj-c',
          label: 'Minimize: ∑_{(i,j)∈E} wᵢⱼ xᵢ xⱼ',
          correct: false,
          explanation:
            'xᵢxⱼ=1 yalnızca her iki düğüm de 1 iken; aynı kümedeki kenarları ödüllendirir — Max-Cut ile ters.',
        },
        {
          id: 'obj-d',
          label: 'Maximize: ∑_{(i,j)∈E} wᵢⱼ (1 - xᵢ)(1 - xⱼ)',
          correct: false,
          explanation:
            'Bu form da aynı kümedeki kenarları ödüllendirir; Max-Cut için xᵢ≠xⱼ koşulu gerekir.',
        },
      ],
    },
    {
      id: 'ising-map',
      title: 'Ising Eşlemesi',
      prompt: 'QUBO ikili xᵢ değişkenini Ising spin sᵢ ∈ {-1,+1} ile eşlemek için doğru dönüşüm hangisidir?',
      choices: [
        {
          id: 'map-a',
          label: 'xᵢ = (1 + sᵢ) / 2',
          correct: true,
          explanation: 'sᵢ=+1 → xᵢ=1, sᵢ=-1 → xᵢ=0; standart QUBO-Ising dönüşümüdür.',
        },
        {
          id: 'map-b',
          label: 'xᵢ = sᵢ²',
          correct: false,
          explanation: 'sᵢ² = 1 her zaman; ikili bilgi kaybolur.',
        },
        {
          id: 'map-c',
          label: 'xᵢ = |sᵢ|',
          correct: false,
          explanation: '|sᵢ| = 1 sabittir; küme ataması temsil edilemez.',
        },
        {
          id: 'map-d',
          label: 'xᵢ = sᵢ + sⱼ',
          correct: false,
          explanation: 'İki spin toplamı ikili değer vermez; değişken başına tek dönüşüm gerekir.',
        },
      ],
    },
    {
      id: 'qaoa-ready',
      title: 'QAOA Hazırlığı',
      prompt: 'Bu Max-Cut QUBO\'su için QAOA cost Hamiltonian H_C nasıl yazılır?',
      choices: [
        {
          id: 'hc-a',
          label: 'H_C = ∑_{(i,j)∈E} wᵢⱼ (1 - ZᵢZⱼ) / 2 (Ising-Z formu)',
          correct: true,
          explanation:
            'ZᵢZⱼ eigenvalue\'ları sᵢsⱼ verir; (1-ZᵢZⱼ)/2 operatörü xᵢ≠xⱼ durumunu ödüllendirir — standart Max-Cut QAOA cost.',
        },
        {
          id: 'hc-b',
          label: 'H_C = ∑ᵢ Xᵢ (sadece mixer)',
          correct: false,
          explanation: '∑Xᵢ mixer Hamiltonian\'dır; maliyet fonksiyonunu kodlamaz.',
        },
        {
          id: 'hc-c',
          label: 'H_C = ∑ᵢ Zᵢ (tek qubit maliyet yeterli)',
          correct: false,
          explanation:
            'Kenar terimleri için ZᵢZⱼ etkileşimleri gerekir; tek Z terimleri yeterli değildir.',
        },
        {
          id: 'hc-d',
          label: 'H_C = 0 (boş Hamiltonian)',
          correct: false,
          explanation: 'Cost layer olmadan QAOA optimizasyon yapmaz.',
        },
      ],
    },
    {
      id: 'penalty',
      title: 'Ceza Terimi (Portföy benzeri kısıt)',
      prompt:
        'Aynı formülasyon mantığıyla: portföyde tam 2 varlık seçmek için (∑xᵢ - 2)² ceza terimi ekleniyor. ' +
        'λ (ceza katsayısı) çok küçükse ne olur?',
      choices: [
        {
          id: 'pen-a',
          label: 'Optimal çözüm kısıtı ihlal edebilir; maliyet kısıttan önce minimize edilir',
          correct: true,
          explanation:
            'λ yetersizse optimizer kısıt ihlal ederek daha düşük ana maliyet bulabilir — ceza katsayısı analizi kritiktir.',
        },
        {
          id: 'pen-b',
          label: 'QAOA otomatik olarak λ=∞ seçer',
          correct: false,
          explanation: 'λ kullanıcı/formülatör tarafından seçilir; algoritma otomatik ayarlamaz.',
        },
        {
          id: 'pen-c',
          label: 'Kısıt her zaman sağlanır, λ önemsizdir',
          correct: false,
          explanation:
            'Soft penalty yaklaşımında λ yeterince büyük olmalıdır; aksi halde kısıt ihlali optimal olabilir.',
        },
        {
          id: 'pen-d',
          label: 'Shot sayısı λ ile orantılı artar',
          correct: false,
          explanation: 'λ formülasyon parametresidir; shot sayısı ölçüm istatistiği içindir, doğrudan ilişkili değildir.',
        },
      ],
    },
    {
      id: 'validation',
      title: 'Doğrulama Stratejisi',
      prompt: 'Formülasyonu yarışmada teslim etmeden önce en iyi doğrulama adımı hangisidir?',
      choices: [
        {
          id: 'val-a',
          label: 'Küçük örnek üzerinde brute-force / klasik çözüm ile QUBO enerjisini kıyasla',
          correct: true,
          explanation:
            'n küçükken tüm 2ⁿ kombinasyon taranabilir; QUBO değerleri beklenen Max-Cut ile eşleşmelidir.',
        },
        {
          id: 'val-b',
          label: 'Sadece en büyük qubit sayılı backend seç',
          correct: false,
          explanation: 'Backend seçimi doğrulama değildir; formülasyon hatası büyük cihazda da devam eder.',
        },
        {
          id: 'val-c',
          label: 'Shot=1 yeterli, istatistik gerekmez',
          correct: false,
          explanation: 'Formülasyon doğrulaması klasik yapılır; shot istatistiği algoritma aşamasındadır.',
        },
        {
          id: 'val-d',
          label: 'Sunum slaytlarını önce hazırla',
          correct: false,
          explanation: 'Sunum önemli ama formülasyon doğrulanmadan sonuç güvenilmez olur.',
        },
      ],
    },
  ],
}

export const FORMULATION_TASK = MAX_CUT_FORMULATION
