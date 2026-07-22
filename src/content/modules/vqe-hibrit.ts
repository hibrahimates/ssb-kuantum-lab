import type { ModuleContent } from './types'

export const vqeHibrit: ModuleContent = {
  slug: 'vqe-hibrit',
  order: 6,
  title: 'VQE Hibrit',
  subtitle: 'Ansatz, varyasyonel döngü ve optimizer rolü',
  goal: 'VQE’nin varyasyonel prensibini, Ansatz seçimini ve QAOA ile farkını anlamak.',
  analogy: {
    title: 'VQE = ayarlanabilir tarif + tadım döngüsü',
    text: 'Ansatz mutfak tarifidir — malzemeler (kapılar) ve baharat miktarları (Parameter θ) sabittir ama ayarlanabilir. Klasik optimizer aşçıdır: her turda yemeği tadar (⟨H⟩ ölçer), tuz/γ ekler veya çıkarır. QAOA belirli bir tarif ailesidir (cost-mixer alternasyonu); VQE daha geniş menü. Kötü tarif (aşırı derin Ansatz) Barren plateau — tuz hiç tatmaz.',
  },
  intuitions: [
    {
      title: 'Toy VQE: 2 Qubit, 3 Parameter',
      setup:
        'H = 0.7 Z₀ + 0.3 Z₁ + 0.5 Z₀Z₁. Ansatz: RY(θ₀)⊗RY(θ₁) + CNOT + RY(θ₂). Başlangıç θ=(0,0,0), ⟨H⟩=0.9. Optimizer 20 adımda ⟨H⟩→0.2.',
      insight:
        '3 Parameter ile 2 Qubit problemi eğitilebilir. 20 Parameter + 8 Qubit NISQ\'ta plateau riski — Ansatz sığ tut.',
    },
    {
      title: 'VQE vs QAOA aynı QUBO',
      setup:
        '4 Qubit portfolio toy. QAOA p=2: 4 Parameter, belirli yapı. VQE TwoLocal depth=2: 8 Parameter, daha esnek.',
      insight:
        'VQE expressivity ↑ ama trainability ↓ olabilir. Sunumda “neden QAOA?” veya “neden VQE?” cevabı şart.',
    },
    {
      title: 'Finans toy enerji',
      setup:
        'Minimize portföy risk+maliyet H. VQE 100 iterasyon, 1024 shot/iter. En iyi θ ile final 4096 shot: geçerli portföy %78 histogram.',
      insight:
        'Erken durdurma: iterasyon 60\'ta ⟨H⟩ platoya girdiyse dur — kalan 40 iterasyon shot israfı.',
    },
  ],
  tryThis: [
    {
      prompt:
        'variational playground\'da döngüyü izle: maliyet geçmişi çubukları γ/β güncellenirken nasıl değişiyor? Yakınsama hızına odaklan (Barren plateau sezgisi).',
    },
    {
      prompt:
        'Döngüyü duraklat, Sıfırla, tekrar başlat. İkinci turda maliyet çubukları daha hızlı yükseliyor mu? Aynı ansatz derinliği — rastgele başlangıç etkisini not et.',
      hint: 'Derin ≠ her zaman iyi — NISQ kuralı.',
    },
    {
      prompt:
        'VQE döngüsünü kağıda 5 adım yaz: QUBO→H, Ansatz, Estimator, optimizer, final shot. Modül 10 checklist\'e ekle.',
    },
  ],
  playgrounds: ['variational'],
  sections: [
    {
      id: 'principle',
      title: 'Varyasyonel Prensip',
      body: 'VQE parametrik devre |ψ(θ)⟩ ile ⟨ψ(θ)|H|ψ(θ)⟩ minimize edilir. Optimizasyonda H problem Hamiltonian\'ı (QUBO maliyeti). Klasik optimizer θ günceller; kuantum devre enerji tahmini döner. Örnek: θ=(0.1,0.5,1.2) → ⟨H⟩=4.7 → optimizer θ\'yi günceller → ⟨H⟩=3.1.',
    },
    {
      id: 'ansatz',
      title: 'Ansatz Seçimi',
      body: 'Ansatz parametrik devre şablonu: TwoLocal, EfficientSU2, problem-özel devre. 4 Qubit TwoLocal depth=2: ~8 Parameter. Problem-uyumlu sığ Ansatz NISQ\'ta genelde daha iyi. Yarışmada “neden bu Ansatz?” slaytına yaz.',
      miniPlayground: 'variational',
    },
    {
      id: 'vs-qaoa',
      title: 'VQE vs QAOA',
      body: 'QAOA belirli Ansatz ailesi (cost-mixer); VQE genel çerçeve. QAOA kombinatoriyel optimizasyon için doğal; VQE kimya spektrumundan geldi ama Ising/QUBO\'ya uygulanır. İkisi de hibrit: kuantum ölçüm + klasik optimizer. Karşılaştırma tablosu sunumda.',
    },
    {
      id: 'workflow',
      title: 'Pratik VQE Döngüsü',
      body: '1) QUBO → Pauli Hamiltonian. 2) Ansatz + θ. 3) Estimator/Sampler ile ⟨H⟩. 4) Klasik optimizer. 5) Yakınsama veya bütçe bitince final shot. Örnek bütçe: max 80 iterasyon × 2048 shot = 163840 shot. Hackathon kısıtında erken durdurma planla.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'VQE neyi minimize eder?',
      options: [
        'Transpile süresini',
        '⟨ψ(θ)|H|ψ(θ)⟩ beklenen değerini',
        'Qubit sayısını',
        'Sunum slayt sayısını',
      ],
      correctIndex: 1,
      explanation: 'Varyasyonel prensip: parametrik durumla Hamiltonian beklenen değeri minimize edilir.',
    },
    {
      id: 'q2',
      question: 'Ansatz nedir?',
      options: [
        'Klasik LP çözücüsü',
        'Parametrik kuantum devre şablonu',
        'IBM fatura kalemi',
        'Ceza katsayısı',
      ],
      correctIndex: 1,
      explanation: 'Ansatz, ayarlanabilir parametreli kuantum devre yapısıdır.',
    },
    {
      id: 'q3',
      question: 'QAOA, VQE çerçevesine göre nasıl konumlanır?',
      options: [
        'Tamamen bağımsız, hibrit değil',
        'Belirli bir ansatz ailesi olan özel VQE türü',
        'Sadece simülatör algoritması',
        'Klasik greedy algoritma',
      ],
      correctIndex: 1,
      explanation: 'QAOA, cost-mixer alternasyonlu yapılandırılmış bir varyasyonel yaklaşımdır.',
    },
    {
      id: 'q4',
      question: 'Barren plateau riskini azaltmak için ne yapılabilir?',
      options: [
        'Ansatz derinliğini sınırsız artırmak',
        'Problem yapısına uygun sığ ansatz kullanmak',
        'Shot sayısını 1 yapmak',
        'Optimizer kullanmamak',
      ],
      correctIndex: 1,
      explanation: 'Sığ, problem-uyumlu ansatz genelde daha trainable landscape verir.',
    },
    {
      id: 'q5',
      question: 'VQE döngüsünde klasik optimizer rolü nedir?',
      options: [
        'QPU kalibrasyonu',
        'Devre parametrelerini θ güncellemek',
        'Q matrisini otomatik yazmak',
        'Sunum hazırlamak',
      ],
      correctIndex: 1,
      explanation: 'Klasik optimizer, kuantum devre parametrelerini maliyete göre ayarlar.',
    },
    {
      id: 'q6',
      question: 'Optimizasyon için VQE’de H genelde neyi temsil eder?',
      options: [
        'Mixer Hamiltonian',
        'Problem maliyetini kodlayan Hamiltonian',
        'Identity operatörü',
        'CNOT sayısı',
      ],
      correctIndex: 1,
      explanation: 'QUBO/Ising maliyeti Pauli-Z formunda H operatörüne dönüştürülür.',
    },
    {
      id: 'q7',
      question: '2 Qubit toy\'da 20 iterasyon sonrası ⟨H⟩ platoya girdiyse ne yapmalı?',
      options: [
        '200 iterasyon daha zorla',
        'Erken durdur, farklı Ansatz veya başlangıç dene',
        'QUBO\'yu sil',
        'Shot=1 yap',
      ],
      correctIndex: 1,
      explanation: 'Shot budget israfını önlemek için erken durdurma ve alternatif Ansatz mantıklıdır.',
    },
  ],
}
