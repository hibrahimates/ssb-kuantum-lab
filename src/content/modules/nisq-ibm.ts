import type { ModuleContent } from './types'

export const nisqIbm: ModuleContent = {
  slug: 'nisq-ibm',
  order: 9,
  title: 'NISQ & IBM',
  subtitle: 'Gürültü, shot, transpile ve simulator vs QPU',
  season: 3,
  seasonTitle: 'Araçlar & IBM',
  levelLabel: 'Atölye',
  nextHook: 'NISQ ve sim/QPU farkını kavradın — Sezon 4’te banka ve haberleşme senaryoları seni bekliyor.',
  goal: 'NISQ kısıtlarını, IBM Quantum stack’ini ve simülatör ile QPU arasındaki pratik farkları bilmek.',
  analogy: {
    title: 'NISQ QPU = sisli hava fotoğraf makinesi',
    text: 'Simülatör stüdyo ışığındaki net fotoğraftır — gürültü yok, istediğin kadar çekim (shot). QPU sisli günde çekim: her Shot biraz bulanık (gate hatası, readout error). Transpile fotoğrafı kırpmak/kadrajlamak gibidir — yanlış kadraj (Coupling map) ekstra SWAP ekler, bulanıklık artar. Shot sayısı kaç fotoğraf ortalaması aldığındır.',
  },
  intuitions: [
    {
      title: 'Shot budget hesabı',
      setup:
        'QAOA: 50 iterasyon × 2048 shot/iter = 102400 shot. Final doğrulama: +4096 shot. Toplam ~106k shot — IBM kredi/limit kontrol et.',
      insight:
        'Iterasyon başına shot düşür (512) veya iterasyon sayısını sınırla (30). Tabloya yaz: iter, shot, backend, tarih.',
    },
    {
      title: 'Transpile önce→sonra',
      setup:
        'Mantıksal devre: 4 CNOT (0,1),(1,2),(2,3),(0,3). Coupling map linear: 0—1—2—3. Transpile optimization_level=3: 6 CNOT + 2 SWAP.',
      insight:
        'Derinlik 4→10 katman. NISQ\'ta layout seçimi sonucu ±%30 olasılık kaydırabilir — seed_transpiler sabitle.',
    },
    {
      title: 'Sim vs QPU sapması',
      setup:
        '4 Qubit Max-Cut toy. Simülatör: en iyi bitstring %62. QPU (gerçekçi gürültü): %41, ikinci aday %38.',
      insight:
        'Sapma normal — sunumda analiz et: derinlik, readout calibration, p değeri. “Sim X, QPU Y çünkü…” cümlesi jüri puanı.',
    },
  ],
  tryThis: [
    {
      prompt:
        'shots playground\'da 64 vs 2048 shot histogramını karşılaştır. Dağılım ne zaman “yeterince stabil” hissediliyor?',
    },
    {
      prompt:
        'Aşağıdaki pseudo-config\'i oku: optimization_level=0 vs 3, shots=1024, backend=simulator. Hangi kombinasyon hızlı debug, hangisi QPU final?',
      hint: 'Debug: düşük level + sim. Final: level 3 + QPU + yüksek shot.',
    },
    {
      prompt:
        'Qiskit kod bloğundaki transpile satırını incele. backend değiştirince CNOT sayısının neden arttığını Coupling map ile açıkla.',
    },
  ],
  playgrounds: ['shots'],
  sections: [
    {
      id: 'nisq',
      title: 'NISQ Dönemi',
      narration:
        'NISQ cihazlar gürültülü ama gerçek. Bu bölümde gate hataları, decoherence ve derinlik kısıtlarını konuşacağız.',
      body: 'NISQ cihazlar yüzlerce Qubit\'e ölçeklenir ama fault-tolerant hata düzeltme pratik değildir. Gate hatası ~0.1–1%, T1/T2 decoherence, readout hatası. Örnek: 50 kapılı devre, kapı başına %0.5 hata → toplam başarı ~0.995⁵⁰≈78%. Circuit depth birincil kısıt.',
      scene3d: 'noise-cloud',
    },
    {
      id: 'shots',
      title: 'Shot, Sampler ve Estimator',
      body: 'Shot: tekrarlı çalıştırma + histogram. Sampler bitstring dağılımı; Estimator ⟨O⟩ tahmini. QAOA iterasyonunda Estimator pahalı — shot budget planla. Örnek config: shots=4096, rep_delay=0.002s → job süresi backend kuyruğuna bağlı.',
      miniPlayground: 'shots',
      tryIt: {
        kind: 'lab-js',
        title: 'Shot histogramı dene',
        starter: `// Gürültüsüz teorik P(1)=0.7 vs shot sayısı
const prob1 = 0.7;
const shots = 256;
const hist = shotsHistogram(prob1, shots);

print("P(1) teorik:", prob1, "| shot:", shots);
for (const bit of ["0", "1"]) {
  const count = hist[bit];
  print(bit + ":", count, "(" + (100 * count / shots).toFixed(1) + "%)");
}
print("");
print("Not: Az shot → dalgalı histogram.");
print("QPU gürültüsü ek sapma yaratır (simülatörde yok).");`,
        hint: 'shots değerini 64 → 1024 yap — dağılım teorik %70/%30\'a yaklaşır.',
      },
    },
    {
      id: 'transpile',
      title: 'Transpile ve Layout',
      body: 'Transpile mantıksal devreyi native kapılara ve Coupling map\'e uyarlar. Pseudo-config örneği: `{ optimization_level: 3, initial_layout: [0,1,2,3], seed_transpiler: 42 }` — level 3 agresif optimizasyon, seed tekrarlanabilirlik. Yanlış layout CNOT patlatır.',
    },
    {
      id: 'code',
      title: 'IBM Runtime ile Çalıştırma İskeleti',
      body: 'Aşağıdaki snippet simülatör/backend seçimi ve shot tanımını gösterir. Hackathon\'da job queue, timeout ve maliyet limitleri eklenir.',
      codeBlock: {
        language: 'python',
        code: `# Qiskit Runtime — öğretim iskeleti
from qiskit import transpile
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2

service = QiskitRuntimeService(channel="ibm_quantum")
backend = service.least_busy(operational=True, simulator=False)

qc_transpiled = transpile(qc, backend=backend, optimization_level=3)

sampler = SamplerV2(mode=backend)
job = sampler.run([qc_transpiled], shots=4096)
result = job.result()[0].data.meas.get_counts()

# result → bitstring histogram; en düşük maliyetli geçerli çözüm seçilir`,
      },
    },
    {
      id: 'local-sim',
      title: 'Aer ve Yerel Simülatörler',
      narration:
        'Bulut simülatörleri kaldırıldı — geliştirme artık yerelde. Aer, fake backend ve noise model burada devreye girer.',
      body: 'Resmi rehber: [Local simulators](https://quantum.cloud.ibm.com/docs/en/guides/local-simulators). **qiskit-aer** ile `AerSimulator()` statevector veya shot modunda çalışır — gürültüsüz, hızlı iterasyon. **Fake backend** (`FakeManilaV2` vb.): gerçek cihazın kapı seti ve coupling map’ini taklit eder; transpile testi için ideal. **Noise model** ekleyerek QPU sapmasını yerelde önceden gör. **Not:** IBM bulut simülatör backend’leri (eski `ibmq_qasm_simulator` vb.) deprecated/kaldırıldı — yeni pipeline yerel Aer + Runtime QPU.',
    },
    {
      id: 'sim-vs-qpu',
      title: 'Simülatör vs QPU',
      body: 'Yerel Aer (statevector): gürültüsüz, hızlı iterasyon — formülasyon ve Parameter taraması. Fake backend + noise: QPU’ya yakın profil, hâlâ yerel. Gerçek QPU: kuyruk, gerçek gürültü — sonuçlar sapabilir. Örnek tablo satırı: | backend | shots | p | top bitstring | maliyet | geçerli? |. Sunumda en az 3 satır: Aer, fake+noise, QPU.',
    },
    {
      id: 'pseudo-config',
      title: 'Manipüle Edilebilir Pseudo-Config',
      body: 'Gerçek QPU\'ya gitmeden önce şu dörtlüyü tablola: (1) backend = AerSimulator / FakeBackend / ibm_xxx, (2) optimization_level = 0–3, (3) shots = 1024–8192, (4) p = 1–2. Debug turu: Aer + level 0 + 1024 shot. Transpile testi: fake backend + level 3. Final turu: QPU + level 3 + 4096 shot + aynı seed. Değiştirdiğinde neyi gözlemlemen gerektiğini yanına yaz.',
    },
  ],
  resources: [
    {
      label: 'Local Simulators (resmi)',
      url: 'https://quantum.cloud.ibm.com/docs/en/guides/local-simulators',
      note: 'Aer, fake backend, noise model',
    },
    {
      label: 'IBM Quantum Platform',
      url: 'https://quantum.cloud.ibm.com/',
      note: 'QPU job ve Runtime',
    },
    {
      label: 'Install Qiskit',
      url: 'https://quantum.cloud.ibm.com/docs/en/guides/install-qiskit',
      note: 'qiskit-aer kurulumu',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'NISQ cihazların temel sınırlaması nedir?',
      options: [
        'Sınırsız qubit ve sıfır hata',
        'Gürültülü kapılar, sınırlı derinlik, pratik hata düzeltme yok',
        'Sadece 2 qubit destekler',
        'Klasik optimizasyon yapamaz',
      ],
      correctIndex: 1,
      explanation:
        'NISQ: orta ölçekli qubit sayısı, yüksek gürültü, fault-tolerant henüz yok.',
    },
    {
      id: 'q2',
      question: 'Transpile adımının ana amacı nedir?',
      options: [
        'Sunum PDF üretmek',
        'Devreyi backend native kapılarına ve topolojisine uyarlamak',
        'Shot sayısını sıfırlamak',
        'QUBO matrisini çözmek',
      ],
      correctIndex: 1,
      explanation: 'Transpile fiziksel donanım kısıtlarına uyum sağlar.',
    },
    {
      id: 'q3',
      question: 'Sampler ile Estimator arasındaki fark?',
      options: [
        'Sampler bitstring dağılımı; Estimator operatör beklenen değeri',
        'İkisi de aynıdır',
        'Sampler sadece QPU için',
        'Estimator shot kullanmaz her zaman',
      ],
      correctIndex: 0,
      explanation:
        'Sampler ölçüm sonuçları/histogram; Estimator ⟨O⟩ tahmini için kullanılır.',
    },
    {
      id: 'q4',
      question: 'Coupling map neden önemlidir?',
      options: [
        'Qubitler arası fiziksel bağlantıyı tanımlar; SWAP maliyetini etkiler',
        'Shot sayısını belirler',
        'Ceza λ değerini otomatik seçer',
        'Sunum dilini belirler',
      ],
      correctIndex: 0,
      explanation:
        'Doğrudan bağlı olmayan qubitler arası CNOT için SWAP gerekir; maliyet artar.',
    },
    {
      id: 'q5',
      question: 'Hackathon öncesi geliştirmede genelde hangisi tercih edilir?',
      options: [
        'Doğrudan QPU, simülatör yasak',
        'Simülatörde hızlı iterasyon, QPU’da final test',
        'Sadece kağıt hesap',
        'Transpile olmadan ham devre',
      ],
      correctIndex: 1,
      explanation: 'Simülatör hızlı debug; QPU gerçekçi gürültü profili için.',
    },
    {
      id: 'q6',
      question: 'optimization_level transpile’da neyi etkiler?',
      options: [
        'Sunum kalitesini',
        'Devre optimizasyon agresifliğini (kapı sayısı, derinlik)',
        'Takım büyüklüğünü',
        'Quiz eşiğini',
      ],
      correctIndex: 1,
      explanation: 'Yüksek seviye daha agresif devre optimizasyonu uygular.',
    },
    {
      id: 'q7',
      question: '50 iterasyon × 2048 shot/iter toplam shot?',
      options: ['2560', '10240', '102400', '204800'],
      correctIndex: 2,
      explanation: 'Modül sezgi örneği: 50×2048=102400 shot — budget planlaması kritik.',
    },
  ],
}
