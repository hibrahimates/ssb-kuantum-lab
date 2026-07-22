import type { ModuleContent } from './types'

export const isingQubo: ModuleContent = {
  slug: 'ising-qubo',
  order: 4,
  title: 'Ising & QUBO',
  subtitle: 'Binary encoding ve Max-Cut → QUBO dönüşümü',
  goal: 'Ising ve QUBO formlarını tanımak, Max-Cut gibi problemleri ikinci dereceden ikili modele dönüştürmek.',
  analogy: {
    title: 'QUBO = ceza puanlı bulmaca matrisi',
    text: 'Q matrisi sudoku ızgarası gibidir: diyagonal hücreler tek değişken maliyetini, off-diagonal hücreler ikili etkileşimi taşır. Ising (+1/-1 spin) ile QUBO (0/1) aynı bulmacanın farklı alfabeleridir: s=2x−1 dönüşümü pusula yönünü ters çevirmek kadar basittir. Penalty terimleri ızgaraya ekstra “kural ihlali” puanı yazar.',
  },
  intuitions: [
    {
      title: '3 düğümlü Max-Cut toy',
      setup:
        'Üçgen graf: kenarlar (1,2,w=1), (2,3,w=1), (1,3,w=2). x∈{0,1}³. Kesilen kenar sayısı: farklı etiketli çiftler.',
      insight:
        'Optimal cut değeri 3 (1|23 veya 12|3 bölümü). 2³=8 atama brute-force ile doğrulanır — formülasyon hatası burada yakalanır.',
    },
    {
      title: 'Q matrisi sayısal',
      setup:
        'Minimize E = 3x₁ + 5x₂ + 2x₁x₂. Q₁₁=3, Q₂₂=5, Q₁₂=Q₂₁=2 (simetrik). x=(1,0)→E=3; x=(0,1)→E=5; x=(1,1)→E=3+5+2=10.',
      insight:
        'En iyi x=(1,0), maliyet 3. QUBO playground\'da aynı Q\'yu gir — çıktı eşleşmeli.',
    },
    {
      title: 'Banka: 4 varlık, k=2 kısıt',
      setup:
        'Getiriler r=[0.08,0.12,0.05,0.15]. Minimize −rᵀx + λ(Σx−2)². λ=50, x=(0,1,0,1) geçerli, getiri 0.27.',
      insight:
        'Penalty λ=5 iken (1,1,1,1) de “ucuz” görünebilir — λ taraması formülasyon doğrulamasının parçası.',
    },
  ],
  tryThis: [
    {
      prompt:
        'QUBO playground\'da graf düzenleyicide düğümlere tıklayarak kenar ekle/çıkar. Q matrisi ve klasik optimum cut değerinin nasıl değiştiğini izle.',
    },
    {
      prompt:
        'live-qubo\'da kenar DSL\'ini 0-1,1-2,2-0 (üçgen) → 0-1,1-2,2-3,3-0 (kare) yap. Q matrisi ve en iyi kesim bitstring\'i nasıl değişiyor?',
      hint: 'Graf yapısı QUBO\'nun off-diagonal terimlerini doğrudan değiştirir.',
    },
    {
      prompt:
        'Ising s=2x−1 dönüşümünü kağıda yaz: x=0→s=−1, x=1→s=+1. Spin formundaki +1/+1 çifti neden maliyeti artırır?',
    },
  ],
  playgrounds: ['qubo', 'live-qubo'],
  sections: [
    {
      id: 'qubo-def',
      title: 'QUBO Formu',
      body: 'QUBO minimize edilecek fonksiyon: E(x) = Σᵢ Qᵢᵢ xᵢ + Σᵢ<ⱼ Qᵢⱼ xᵢ xⱼ, xᵢ ∈ {0,1}. Örnek: Q₁₁=4, Q₂₂=1, Q₁₂=2 → x=(1,1) maliyeti 4+1+2=7. Kısıtsız görünse de Penalty terimleri Q\'ya gömülür. Qiskit Optimization doğrudan QUBO kabul eder.',
      miniPlayground: 'qubo',
    },
    {
      id: 'ising',
      title: 'Ising Modeli ile İlişki',
      body: 'Ising formu spin sᵢ ∈ {+1,−1}: H = Σᵢ hᵢ sᵢ + Σᵢ<ⱼ Jᵢⱼ sᵢ sⱼ. Dönüşüm sᵢ = 2xᵢ − 1 ile QUBO\'ya çevrilir. Örnek: s₁=s₂=+1 (x₁=x₂=1) ↔ ikisi de seçili. Fizikte Ising manyetik sistemleri; optimizasyonda Max-Cut, clustering, Portfolio seçimi.',
    },
    {
      id: 'maxcut',
      title: 'Max-Cut → QUBO Örneği',
      body: 'Max-Cut: düğümleri iki kümeye böl, kesilen kenar ağırlıklarını maximize et. Minimize konvansiyonunda C = Σ_{(i,j)∈E} wᵢⱼ (xᵢ − xⱼ)² açılır. 2 düğüm tek kenar w=3: x farklıysa cut=3. Dikkat: işaret konvansiyonunu karıştırma — önce toy n=3 brute-force doğrula.',
    },
    {
      id: 'validation',
      title: 'Formülasyon Doğrulama',
      body: 'QUBO yazdıktan sonra n ≤ 12 için Brute-force: tüm 2^n atamayı tara. λ Penalty için ayrı test: kısıt ihlali maliyeti referanstan yüksek olmalı. Önce→sonra: ham problem metni → Q matrisi → brute-force skor 847 → QUBO skor 847 ✓. Hackathon\'da bu adım saatler kazandırır.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'QUBO’da değişkenler hangi kümeden alınır?',
      options: ['{0,1}', '{+1,-1}', 'Reel sayılar', 'Tam sayılar ℤ'],
      correctIndex: 0,
      explanation: 'QUBO binary (ikili) optimizasyon formülasyonudur; xᵢ ∈ {0,1}.',
    },
    {
      id: 'q2',
      question: 'Ising spin sᵢ ile QUBO değişkeni xᵢ arasındaki standart dönüşüm nedir?',
      options: ['sᵢ = xᵢ', 'sᵢ = 2xᵢ - 1', 'sᵢ = xᵢ²', 'sᵢ = 1/xᵢ'],
      correctIndex: 1,
      explanation: 'sᵢ = 2xᵢ - 1 dönüşümü {0,1} → {+1,-1} eşlemesini sağlar.',
    },
    {
      id: 'q3',
      question: 'Max-Cut’ta kesilen bir kenar (i,j) için hangi koşul sağlanır?',
      options: ['xᵢ = xⱼ', 'xᵢ ≠ xⱼ', 'xᵢ + xⱼ = 0', 'xᵢ = 1 her zaman'],
      correctIndex: 1,
      explanation: 'Farklı kümelerdeki düğümler farklı etiket alır; kesilen kenar xᵢ ≠ xⱼ.',
    },
    {
      id: 'q4',
      question: 'Q matrisinde Qᵢⱼ (i≠j) terimi neyi temsil eder?',
      options: [
        'Tek değişkenli doğrusal maliyet',
        'İki değişken arası ikinci dereceden etkileşim',
        'Shot sayısı',
        'Transpile seviyesi',
      ],
      correctIndex: 1,
      explanation: 'Qᵢⱼ xᵢ xⱼ terimi ikili değişkenler arası çapraz maliyet/etkileşimdir.',
    },
    {
      id: 'q5',
      question: 'Küçük QUBO formülasyonunu doğrulamak için en pratik yöntem?',
      options: [
        'Doğrudan QPU’ya yükle',
        'Brute-force ile tüm ikili atamaları tara',
        'Sadece rastgele örnekle',
        'Sunum slaytına güven',
      ],
      correctIndex: 1,
      explanation: 'n küçükken exhaustive search referans çözüm verir ve formülasyon hatalarını yakalar.',
    },
    {
      id: 'q6',
      question: 'Ceza terimleri QUBO’da nereye eklenir?',
      options: [
        'Ayrı bir LP dosyasına',
        'Q matrisinin diyagonal ve off-diagonal elemanlarına',
        'Sadece mixer Hamiltonian’a',
        'Post-processing filtresine',
      ],
      correctIndex: 1,
      explanation: 'Penalty terimleri ikinci dereceden ikili forma açılarak Q matrisine gömülür.',
    },
    {
      id: 'q7',
      question: 'E=3x₁+5x₂+2x₁x₂ için optimal x ve maliyet?',
      options: ['(1,1), 10', '(1,0), 3', '(0,1), 5', '(0,0), 0'],
      correctIndex: 1,
      explanation: 'Modül sezgi örneği: x=(1,0) maliyet 3 — en düşük.',
    },
  ],
  simType: 'qubo',
}
