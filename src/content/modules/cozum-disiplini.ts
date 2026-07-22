import type { ModuleContent } from './types'

export const cozumDisiplini: ModuleContent = {
  slug: 'cozum-disiplini',
  order: 10,
  title: 'Çözüm Disiplini',
  subtitle: 'Problem okuma → QUBO → algoritma → sunum',
  goal: 'Yarışma ve hackathon gününde uygulanabilir uçtan uca çözüm disiplinini içselleştirmek.',
  analogy: {
    title: 'Hackathon = operasyon odası checklist',
    text: 'Acil servis triyajı gibi: önce problem okuma (triyaj), QUBO formülasyonu (tanı), algoritma (tedavi), sunum (taburcu raporu). Checklist atlanırsa hasta (çözüm) yanlış tedavi görür. Bu modül tüm lab modüllerinin birleşik checklist\'idir.',
  },
  intuitions: [
    {
      title: '2 saatlik sprint bütçesi',
      setup:
        'Hackathon toy problemi: 0–20 dk okuma, 20–50 dk QUBO+brute-force, 50–90 dk QAOA sim, 90–110 dk QPU test, 110–120 dk sunum iskeleti.',
      insight:
        'Süre aşımında QPU yerine sim sonucu + sapma analizi slayta — boş slayt yerine dürüst limit analizi puan kazandırır.',
    },
    {
      title: 'λ tarama mini tablo',
      setup:
        'λ ∈ {5, 20, 50, 100, 200}. Her λ için sim 4096 shot: geçerli% ve ort maliyet kaydet. λ=20 geçerli %60, λ=100 geçerli %98.',
      insight:
        'Tablo sunumun “Method” slaytında — jüri formülasyon disiplinini görür. Penalty annealing stratejisini cümleyle açıkla.',
    },
    {
      title: 'Klasik benchmark zorunluluğu',
      setup:
        'Aynı QUBO: greedy 0.3 sn maliyet 42, QAOA+repair 45 sn maliyet 38, brute-force (n küçük) maliyet 37 referans.',
      insight:
        'QAOA greedy\'den iyi ama optimum değil — dürüst karşılaştırma güven verir. classical-vs-quantum playground bu mantığı pekiştirir.',
    },
  ],
  tryThis: [
    {
      prompt:
        'classical-vs-quantum playground\'da klasik taramanın 8 yapılandırmayı sırayla gezdiğini izle. γ/β kaydırarak QAOA histogramında optimum bitstring payını artır — hangi taraf daha “pahalı” (shot vs iterasyon)?',
    },
    {
      prompt:
        'Checklist yaz: ☐ problem okuma ☐ QUBO ☐ brute-force ☐ λ tarama ☐ sim QAOA ☐ QPU test ☐ klasik benchmark ☐ sunum. Her maddeye max süre ata.',
    },
    {
      prompt:
        'Negatif sonuç senaryosu: QPU simden %20 kötü. Sunumda 3 maddelik sapma analizi taslağı yaz (derinlik, readout, layout).',
    },
  ],
  playgrounds: ['classical-vs-quantum'],
  sections: [
    {
      id: 'reading',
      title: '1. Problemi Oku ve Parçala',
      body: 'Metni değişkenler, amaç, kısıtlar, gizli varsayımlar olarak ayır. Örnek not: “5 varlık, k=2, tech≤1, minimize risk−getiri”. Takımda whiteboard meydan okuma — 10 dk. Toy kelimesi basitleştirme izni; kısıt yapısı korunur.',
    },
    {
      id: 'qubo',
      title: '2. QUBO Formülasyonu',
      body: 'Maliyet → Q matrisi, kısıt → Penalty. n≤12 Brute-force doğrula. λ taraması: geçerli% vs maliyet eğrisi. Formülasyon dokümanı sunum “Method” omurgası. Önce→sonra: metin → Q → referans skor 847.',
    },
    {
      id: 'algorithm',
      title: '3. Algoritma ve Deney Tasarımı',
      body: 'QAOA mı VQE mi? p, Ansatz, shot budget, Transpile Optimization level. Deney tablosu: | run | backend | p | shots | top string | maliyet | geçerli |. Negatif sonuç analizi değerlidir.',
    },
    {
      id: 'presentation',
      title: '4. Sunum İskeleti',
      body: 'Problem → QUBO denklemi → algoritma diyagramı → sonuçlar (klasik karşılaştırma) → kısıtlar/limitler → sonraki adımlar. Her slaytta “so what?”. 8 slayt hedef, son 30 dk prova.',
    },
    {
      id: 'team',
      title: '5. Hackathon Günü Rol Dağılımı',
      body: 'Formülasyon lideri, kod/IBM lideri, deney kaydı, sunum yazarı — roller önceden belli. Git commit + parametre log. Son 30 dk sadece prova — yeni algoritma icat etme.',
    },
    {
      id: 'checklist',
      title: 'Uçtan Uca Checklist',
      body: '☐ Değişken/kısıt/maliyet listesi ☐ Q matrisi ☐ brute-force (n küçük) ☐ λ tarama ☐ sim QAOA/VQE ☐ QPU final ☐ klasik benchmark ☐ Post-processing/repair raporu ☐ sunum iskeleti. Bu liste Modül 1 labirent metaforunun final kapısıdır.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'Çözüm disiplininde ilk adım nedir?',
      options: [
        'IBM QPU rezervasyonu',
        'Problemi okuyup değişken/kısıt/maliyet ayrımı',
        'Sunum animasyonu',
        'Ansatz seçimi',
      ],
      correctIndex: 1,
      explanation: 'Formülasyon hatası tüm pipeline’ı çökertir; okuma ilk adımdır.',
    },
    {
      id: 'q2',
      question: 'λ taraması neden yapılır?',
      options: [
        'Shot sayısını rastgele belirlemek için',
        'Ceza ağırlığı ile geçerli çözüm/maliyet dengesini bulmak için',
        'Transpile iptali için',
        'Takım büyüklüğü için',
      ],
      correctIndex: 1,
      explanation: 'λ, kısıt ihlali ile maliyet optimizasyonu arasındaki dengeyi belirler.',
    },
    {
      id: 'q3',
      question: 'Sunumda klasik karşılaştırma neden beklenir?',
      options: [
        'Klasik her zaman üstün olduğu için kuantum anlamsız',
        'Kuantum yaklaşımın değerini ve sınırlarını göstermek için',
        'Zorunlu değil',
        'Sadece finans modülünde',
      ],
      correctIndex: 1,
      explanation: 'Benchmark, formülasyon ve algoritma seçiminin kalitesini kanıtlar.',
    },
    {
      id: 'q4',
      question: 'Brute-force doğrulama hangi aşamada yapılmalı?',
      options: [
        'Sunumdan sonra',
        'QUBO yazıldıktan hemen sonra (küçük n)',
        'Asla',
        'Sadece final hackathon’da',
      ],
      correctIndex: 1,
      explanation: 'Erken doğrulama formülasyon hatalarını ucuz maliyetle yakalar.',
    },
    {
      id: 'q5',
      question: 'Hackathon gününde son 30 dakika ne için ayrılmalı?',
      options: [
        'Yeni algoritma icat',
        'Sunum provası ve slayt tutarlılığı',
        'QUBO silme',
        'Simülatör kurulumu',
      ],
      correctIndex: 1,
      explanation: 'Zamanında biten ama iyi anlatılamayan çözüm puan kaybeder.',
    },
    {
      id: 'q6',
      question: 'Deney kayıtlarında neler olmalı?',
      options: [
        'Sadece final skor',
        'Parametreler, shot, backend, transpile seviyesi, tarih/saat',
        'Yalnızca ekran görüntüsü',
        'Takım üye doğum tarihleri',
      ],
      correctIndex: 1,
      explanation: 'Tekrarlanabilirlik ve hata ayıklama için tam deney metadata şart.',
    },
    {
      id: 'q7',
      question: 'QPU sonucu simülatörden kötü çıkarsa ne yapılmalı?',
      options: [
        'Sonucu gizle',
        'Sapma nedenini analiz edip sunumda açıkla',
        'Formülasyonu sil',
        'Yarışmadan çekil',
      ],
      correctIndex: 1,
      explanation: 'NISQ gürültüsü beklenen bir sonuç; analiz jüri için değerlidir.',
    },
    {
      id: 'q8',
      question: '2 saatlik sprintte QUBO+brute-force için ayrılan süre (modül sezgi)?',
      options: ['0–10 dk', '20–50 dk', '90–110 dk', '110–120 dk'],
      correctIndex: 1,
      explanation: 'Formülasyon ve doğrulama sprintin ~30 dk\'sını almalı — checklist disiplini.',
    },
  ],
}
