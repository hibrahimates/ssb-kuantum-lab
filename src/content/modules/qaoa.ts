import type { ModuleContent } from './types'

export const qaoa: ModuleContent = {
  slug: 'qaoa',
  order: 5,
  title: 'QAOA',
  subtitle: 'Mixer, cost Hamiltonian ve parametre landscape',
  goal: 'QAOA’nın cost/mixer Hamiltonian yapısını, p katman parametrelerini ve klasik optimizer döngüsünü kavramak.',
  analogy: {
    title: 'QAOA = radyo istasyonu ayarı',
    text: 'Cost Hamiltonian (H_C) radyodaki sinyal gücü gibidir — hangi frekansın (bitstring) baskın olacağını belirler. Mixer (H_M) kanal değiştirme düğmesi: arama uzayında zıplarsın. γ ve β Parameter ayarlarıdır; p katman sayısı kaç kez sinyal-kanal döngüsü yaptığındır. Yanlış ayar = gürültü (Barren plateau); doğru ayar = istasyon net (düşük maliyetli bitstring baskın).',
    visual: 'viz-radio',
  },
  intuitions: [
    {
      title: 'p=1 vs p=2 toy',
      setup:
        '4 Qubit Max-Cut toy, simülatörde p=1: en iyi bitstring olasılığı %35. p=2, iyi (γ,β): %55. Aynı shot budget 4096.',
      insight:
        'p artışı kaliteyi artırabilir ama Circuit depth 2× — NISQ\'ta gürültü de 2×. Trade-off tablosu sunumda şart.',
    },
    {
      title: 'γ=0.5, β=0.8 sayısal',
      setup:
        '2 Qubit, maliyet Z₀Z₁+0.5Z₀. p=1, γ=0.5, β=0.8. Simülatör histogram: 01 %42, 10 %41, 00 %9, 11 %8.',
      insight:
        '01 ve 10 düşük maliyetli — histogram bunu yansıtır. Tek shot 11 seçseydin yanlış çözüm sanırdın.',
    },
    {
      title: 'Telecom toy: 3 baz istasyonu cut',
      setup:
        '3 hücre, komşuluk kenarları kapasite paylaşımı. Max-Cut QUBO → QAOA p=1. Klasik greedy cut=2, QAOA+repair cut=3.',
      insight:
        'QAOA her zaman üstün değil — ama formülasyon doğruysa rekabetçi. Klasik karşılaştırma jüri puanı.',
    },
  ],
  tryThis: [
    {
      prompt:
        'viz-radio görselinde dönen γ/β ibrelerini ve sinyal çubuğunu izle; ardından QAOA playground\'da γ/β kaydırıcılarıyla aynı metaforu dene.',
    },
    {
      prompt:
        'QAOA playground\'da p=1 ile başla, γ ve β kaydır. Histogramda en sık bitstring\'in maliyetini hesapla.',
    },
    {
      prompt:
        'live-qaoa\'da p=1→2 yap. Devre derinliği arttığında histogram nasıl değişiyor? Simülatör vs gürültülü profil düşün.',
      hint: 'NISQ modülünde QPU sapmasını hatırla.',
    },
  ],
  playgrounds: ['viz-radio', 'qaoa', 'live-qaoa'],
  sections: [
    {
      id: 'structure',
      title: 'QAOA Yapısı',
      body: 'QAOA p katmanlı parametrik devre: başlangıç H⊗n (|+⟩⊗n). Her katmanda U_C(γ)=e^{-iγH_C} maliyet, U_M(β)=e^{-iβH_M} mixer. p=1: tek γ, tek β. p=3: 3 γ + 3 β = 6 Parameter. p artar → yaklaşım kalitesi ↑, Circuit depth ↑.',
      visual: 'viz-radio',
    },
    {
      id: 'hamiltonians',
      title: 'Cost ve Mixer Hamiltonian',
      body: 'H_C QUBO maliyetini Pauli-Z ile kodlar: xᵢ→(1−Zᵢ)/2. H_M genelde Σ Xᵢ (transverse field Mixer). One-hot kısıtta problem-özel mixer gerekebilir. Örnek 2 Qubit: H_C = 0.5 Z₀ + 0.5 Z₁ + Z₀Z₁; mixer RX(2β) her qubit.',
      miniPlayground: 'qaoa',
    },
    {
      id: 'optimization',
      title: 'Klasik Optimizer Döngüsü',
      body: 'γ=(γ₁…γ_p), β=(β₁…β_p) COBYLA/SPSA/L-BFGS-B ile ayarlanır. Döngü: parametre set → devre çalıştır → ⟨H_C⟩ veya örnek maliyet → güncelle. 50 iterasyon, 4096 shot/iterasyon = 204800 shot — budget planla. Barren plateau: gradient ~0 → farklı başlangıç dene.',
    },
    {
      id: 'code',
      title: 'Qiskit ile Minimal QAOA İskeleti',
      body: 'Aşağıdaki iskelet QUBO→Pauli geçişini gösterir. Gerçek yarışmada Transpile, shot budget ve backend seçimi eklenir.',
      codeBlock: {
        language: 'python',
        code: `# Qiskit-style QAOA iskeleti (öğretim amaçlı)
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from qiskit.primitives import Estimator

gamma = Parameter("γ")
beta = Parameter("β")
n = 4
qc = QuantumCircuit(n)

# Başlangıç: eşit süperpozisyon
qc.h(range(n))

# Cost layer (Z-Z etkileşimleri QUBO'dan)
qc.rzz(2 * gamma, 0, 1)
qc.rz(gamma, 0)
qc.rz(gamma, 1)

# Mixer layer
for q in range(n):
    qc.rx(2 * beta, q)

# ⟨H_C⟩ klasik optimizer ile minimize edilir
# estimator.run(qc, observables).result()`,
      },
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'QAOA’da başlangıç durumu genelde nasıl hazırlanır?',
      options: [
        'Tüm qubitler |0⟩',
        'Tüm qubitler |1⟩',
        'Her qubite H kapısı (eşit süperpozisyon)',
        'Rastgele unitary',
      ],
      correctIndex: 2,
      explanation: 'Standart QAOA uniform superposition ile başlar: |+⟩⊗n.',
    },
    {
      id: 'q2',
      question: 'H_C (cost Hamiltonian) neyi temsil eder?',
      options: [
        'Mixer rotasyonlarını',
        'Optimizasyon maliyet fonksiyonunu (QUBO/Ising)',
        'Shot gürültüsünü',
        'Transpile kurallarını',
      ],
      correctIndex: 1,
      explanation: 'H_C, problem maliyetini Pauli-Z cinsinden kodlar.',
    },
    {
      id: 'q3',
      question: 'Standart transverse field mixer hangi operatörlerden oluşur?',
      options: ['Σᵢ Xᵢ', 'Σᵢ Zᵢ', 'Σᵢ Yᵢ', 'Σᵢ CNOT'],
      correctIndex: 0,
      explanation: 'Klasik QAOA mixer: H_M = Σᵢ Xᵢ.',
    },
    {
      id: 'q4',
      question: 'p parametresi neyi ifade eder?',
      options: [
        'Qubit sayısı',
        'QAOA katman (layer) sayısı',
        'Shot sayısı',
        'Ceza katsayısı λ',
      ],
      correctIndex: 1,
      explanation: 'p, cost-mixer alternasyonunun tekrar sayısıdır.',
    },
    {
      id: 'q5',
      question: 'γ ve β parametreleri kim tarafından optimize edilir?',
      options: [
        'Kuantum devresi otomatik ayarlar',
        'Klasik optimizer (COBYLA, SPSA vb.)',
        'IBM destek ekibi',
        'Transpile pass',
      ],
      correctIndex: 1,
      explanation: 'QAOA hibrittir: kuantum devre + klasik parametre optimizasyonu.',
    },
    {
      id: 'q6',
      question: 'Barren plateau ne anlama gelir?',
      options: [
        'Gradientlerin sıfıra yakın olduğu optimizasyon zorluğu',
        'QPU’nun kapalı olması',
        'Max-Cut çözümünün bulunması',
        'Simülatör hatası',
      ],
      correctIndex: 0,
      explanation:
        'Derin ansatz/devrelerde gradient kaybolabilir; parametre optimizasyonu zorlaşır.',
    },
    {
      id: 'q7',
      question: 'QAOA çıktısı genelde nasıl yorumlanır?',
      options: [
        'Tek shot sonucu kesin çözümdür',
        'Ölçüm histogramından en iyi aday bitstring seçilir',
        'Sadece ⟨H_C⟩ raporlanır, bitstring gerekmez',
        'Transpile log okunur',
      ],
      correctIndex: 1,
      explanation:
        'Pratikte shot histogramından aday çözümler seçilir; kısıt kontrolü ve iyileştirme yapılabilir.',
    },
    {
      id: 'q8',
      question: 'Radyo analojisinde Mixer (H_M) neyi temsil eder?',
      options: [
        'Maliyet sinyal gücü',
        'Kanal değiştirme / arama uzayında karıştırma',
        'Shot sayısı',
        'Transpile seviyesi',
      ],
      correctIndex: 1,
      explanation: 'Mixer arama uzayını gezer; cost ise maliyet landscape\'ini kodlar.',
    },
  ],
  simType: 'qaoa',
}
