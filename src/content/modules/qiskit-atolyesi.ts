import type { ModuleContent } from './types'

export const qiskitAtolyesi: ModuleContent = {
  slug: 'qiskit-atolyesi',
  order: 8,
  title: 'Qiskit Atölyesi',
  subtitle: 'Kurulum, venv, hello devre ve bulut notebook',
  season: 3,
  seasonTitle: 'Araçlar & IBM',
  levelLabel: 'Atölye',
  nextHook: 'Qiskit elinin altında — şimdi NISQ kısıtları ve sim vs QPU derinlemesine.',
  goal: 'Qiskit’i yerel ortamda kurmak, sanal ortam kullanmak ve ilk kuantum devresini çalıştırmak.',
  goalNarration:
    'Bu atölyede Qiskit kurulumunu, venv ipuçlarını ve hello devre iskeletini adım adım göreceğiz. Kodu kopyala-yapıştır değil — satır satır anla.',
  analogy: {
    title: 'Qiskit kurulumu = mutfak tezgâhı hazırlığı',
    text: 'venv ayrı mutfak tezgâhidir — global Python karışıklığı (tuz/şeker karışması) olmaz. pip install qiskit malzemeleri getirir; hello devre ilk tarif denemesidir. Bulut notebook ortak mutfaktır — takım aynı ortamda çalışır, “bende çalışıyor” draması azalır.',
  },
  intuitions: [
    {
      title: 'venv neden şart?',
      setup:
        'python3 -m venv .venv && source .venv/bin/activate. Proje klasöründe qiskit==1.x sabitle. Global pip upgrade başka projeyi bozar.',
      insight:
        'Yarışma repo’sunda requirements.txt + .venv gitignore. CI/CD ve takım uyumu için versiyon kilitle.',
    },
    {
      title: 'Hello devre 3 satır',
      setup:
        'QuantumCircuit(1,1) → h(0) → measure(0,0) → AerSimulator.run(shots=1024).',
      insight:
        'Hadamard |0⟩’ı |+⟩ yapar; histogram ~50/50. Bu tek satır modül 3 süperpozisyon sezgisini kodda görünür kılar.',
    },
    {
      title: 'Bulut notebook',
      setup:
        'Kurulum sorunu yaşayan takım üyesi quantum.cloud.ibm.com notebook ortamını kullanır — Qiskit önceden yüklü.',
      insight:
        'Yerel + bulut hibrit: geliştirme local, demo bulut. İkisinde de aynı devre kodu çalışmalı.',
    },
  ],
  tryThis: [
    {
      prompt:
        'Resmi kurulum rehberini takip et; venv içinde qiskit --version çıktısını terminalde doğrula.',
      hint: 'Kurulum linki modül resources bölümünde.',
    },
    {
      prompt:
        'Hello devre kod bloğunu çalıştır; histogramda |0⟩ ve |1⟩ yaklaşık eşit mi? Shot sayısını 256 vs 4096 yap, farkı not et.',
    },
    {
      prompt:
        'Aşağıdaki lab-js starter’da hadamardToy fonksiyonunu oku — |+⟩ durumunun olasılık vektörünü elle hesapla.',
    },
  ],
  sections: [
    {
      id: 'install',
      title: 'Qiskit Kurulumu',
      narration:
        'Resmi kurulum rehberi Python 3.9+ ve pip gerektirir. Adımları atlamadan takip et.',
      body: 'Resmi rehber: [Install Qiskit](https://quantum.cloud.ibm.com/docs/en/guides/install-qiskit). Özet: Python 3.9+, pip güncel, `pip install qiskit qiskit-aer`. IBM Runtime için ayrıca `qiskit-ibm-runtime`. Versiyon uyumsuzluğu en sık hata kaynağı — requirements.txt ile sabitle.',
    },
    {
      id: 'venv',
      title: 'Sanal Ortam (venv) İpucu',
      body: '```bash\npython3 -m venv .venv\nsource .venv/bin/activate   # Windows: .venv\\Scripts\\activate\npip install -U pip\npip install qiskit qiskit-aer qiskit-ibm-runtime\n```\nHer proje için ayrı venv — global site-packages karışmasın. `.venv/` klasörünü `.gitignore`\'a ekle. Takım README’sine “venv activate → pip install -r requirements.txt” yaz.',
    },
    {
      id: 'hello',
      title: 'Hello Circuit — İlk Devre',
      narration:
        'Tek qubit, Hadamard, ölçüm — süperpozisyonun histogram karşılığı.',
      body: 'Aşağıdaki snippet öğretim amaçlıdır; Aer simülatöründe çalışır. Hadamard |0⟩ → |+⟩; ölçümde ~%50 |0⟩, ~%50 |1⟩.',
      codeBlock: {
        language: 'python',
        code: `# Hello circuit — öğretim iskeleti
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(1, 1)
qc.h(0)           # |0⟩ → |+⟩ = (|0⟩+|1⟩)/√2
qc.measure(0, 0)

sim = AerSimulator()
job = sim.run(qc, shots=1024)
counts = job.result().get_counts()
print(counts)     # ~ {'0': 512, '1': 512 }`,
      },
    },
    {
      id: 'try-lab',
      title: 'Hadamard Sezgi — Lab-JS',
      body: 'Hadamard kapısının |0⟩ üzerindeki etkisini olasılık vektörü olarak gör. |+⟩ = (1/√2, 1/√2) — ölçümde yazı/tura eşit dağılım.',
      tryIt: {
        kind: 'lab-js',
        title: 'hadamardToy — süperpozisyon sezgisi',
        starter: `// hadamardToy: |0⟩ üzerine H → |+⟩
const h = hadamardToy();
print("|+⟩ olasılıkları:");
print("  P(|0⟩) =", h.p0.toFixed(3));
print("  P(|1⟩) =", h.p1.toFixed(3));
print("  p0 + p1 =", (h.p0 + h.p1).toFixed(3));
print("  1024 shot beklenen: ~512 / ~512");`,
        hint: 'p0 + p1 = 1 olmalı. Modül 3 yazı-tura sezgisini burada sayısal gör.',
      },
    },
    {
      id: 'notebooks',
      title: 'Bulut Notebook Ortamları',
      body: 'Kurulum engeli yaşayanlar için IBM bulut notebook: [Qiskit notebook environments](https://www.ibm.com/quantum/blog/qiskit-notebook-environments). Platform üzerinden notebook aç — Qiskit önceden yüklü. Takım demo’su için ideal; production kodu yine repo + venv ile versiyonla.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Qiskit kurulumunda venv kullanmanın ana nedeni nedir?',
      options: [
        'Python’u tamamen kaldırmak',
        'Proje bağımlılıklarını izole etmek, versiyon çakışmasını önlemek',
        'QPU kotasını artırmak',
        'Git commit hızlandırmak',
      ],
      correctIndex: 1,
      explanation: 'venv proje bazlı paket izolasyonu sağlar — takım uyumu için kritik.',
    },
    {
      id: 'q2',
      question: 'Hello devrede qc.h(0) ne yapar?',
      options: [
        '|0⟩ durumunu |+⟩ süperpozisyonuna çevirir',
        'Qubit’i sıfırlar',
        'CNOT uygular',
        'Shot sayısını belirler',
      ],
      correctIndex: 0,
      explanation: 'Hadamard |0⟩ → (|0⟩+|1⟩)/√2 = |+⟩; ölçümde ~50/50 dağılım.',
    },
    {
      id: 'q3',
      question: 'AerSimulator hello devrede hangi rolü oynar?',
      options: [
        'Gerçek QPU kuyruğuna job gönderir',
        'Devreyi yerel olarak gürültüsüz simüle eder',
        'Sunum PDF üretir',
        'QUBO matrisini çözer',
      ],
      correctIndex: 1,
      explanation: 'Aer yerel gürültüsüz simülatör — hızlı geliştirme için ideal.',
    },
    {
      id: 'q4',
      question: 'Bulut notebook ortamı ne zaman tercih edilir?',
      options: [
        'Her zaman — venv gereksiz',
        'Yerel kurulum sorunu veya hızlı takım demosu için',
        'Sadece final sunum günü',
        'Token oluşturmak için',
      ],
      correctIndex: 1,
      explanation: 'Bulut notebook kurulum bariyerini düşürür; asıl geliştirme yine repo+venv.',
    },
    {
      id: 'q5',
      question: '1024 shot hello devrede beklenen histogram?',
      options: [
        'Sadece |0⟩ — %100',
        'Yaklaşık %50 |0⟩, %50 |1⟩',
        'Sadece |1⟩ — %100',
        'Üç eşit tepe',
      ],
      correctIndex: 1,
      explanation: '|+⟩ ölçümünde her sonuç olasılığı 0.5 — istatistiksel sapma ±√N.',
    },
  ],
  resources: [
    {
      label: 'Install Qiskit (resmi)',
      url: 'https://quantum.cloud.ibm.com/docs/en/guides/install-qiskit',
    },
    {
      label: 'Qiskit Notebook Environments',
      url: 'https://www.ibm.com/quantum/blog/qiskit-notebook-environments',
      note: 'Bulut notebook — kurulum alternatifi',
    },
    {
      label: 'IBM Quantum Platform',
      url: 'https://quantum.cloud.ibm.com/',
      note: 'Notebook ve job paneli',
    },
  ],
}
