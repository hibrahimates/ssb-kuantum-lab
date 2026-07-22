import type { ModuleContent } from './types'

export const yarismaHaritasi: ModuleContent = {
  slug: 'yarisma-haritasi',
  order: 1,
  title: 'Yarışma Haritası',
  subtitle: 'SSB Kuantum Algoritma Yarışması sürecine genel bakış',
  goal: 'Yarışmanın aşamalarını, takım gereksinimlerini ve hazırlık önceliklerini anlamak — labirent haritasını okuyup hangi kapıdan gireceğini bilmek gibi.',
  analogy: {
    title: 'Yarışma = çok aşamalı labirent',
    text: 'SSB Kuantum Algoritma Yarışması bir labirent gibidir: ön eleme koridorları (sınav, çözüm, sunum) final salonuna açılır. Takımın 3–6 kişi olması, herkesin aynı kapıdan girmesi değil — biri haritayı okur (formülasyon), biri pusulayı tutar (kod), biri yolu işaretler (sunum). Bu laboratuvar modülleri labirentin duvarlarına yazılmış ipuçlarıdır.',
    visual: 'viz-maze',
  },
  intuitions: [
    {
      title: 'Takım kapasitesi hesabı',
      setup:
        '4 kişilik takım: Ayşe formülasyon, Burak Qiskit, Cem deney kaydı, Deniz sunum. Ön eleme 3 hafta; haftada 6 saat ortak çalışma = 72 saat.',
      insight:
        '72 saati modül modül böl: ~8 saat/modül × 9 teknik modül = yeterli derinlik. Modül 1 (bu sayfa) sadece 2 saat — geri kalanı QUBO/QAOA\'ya ayır.',
    },
    {
      title: 'Ön eleme vs final farkı',
      setup:
        'Ön elemede çevrimiçi sınav + PDF çözüm + 10 dk sunum. Finalde IBM QPU, canlı hackathon, sektör toy problemi (banka veya haberleşme).',
      insight:
        'Ön elemede formülasyon doğruluğu ağırlıklı; finalde transpile, shot budget ve QPU gürültüsü puan kırar. Simülatörde çalışan kod QPU\'da patlayabilir — bunu Modül 7\'de öğreneceksin.',
    },
    {
      title: 'Lab ilerleme eşiği',
      setup:
        'Her modül quizinde %70 geçiş şart. Modül 3\'ü %65 ile geçersen Modül 4 playground\'u kilitli kalır.',
      insight:
        'Quiz skoru sadece rozet değil — kavram boşluğunu erken yakalar. %70 altındaysan ilgili modüldeki Intuition ve TryThis bölümlerine dön.',
    },
  ],
  tryThis: [
    {
      prompt:
        'Labirent görselinde (viz-maze) çıkışa giden yolu takip et. Her dönüşe bir yarışma aşaması yaz: sınav → çözüm → sunum → hackathon.',
      hint: 'Yan yollar = dikkat dağıtan görevler (gereksiz literatür taraması, erken QPU rezervasyonu).',
    },
    {
      prompt:
        'Takımında 4 rol dağıt: formülasyon, kod, deney kaydı, sunum. Her role bu lab\'in hangi modülünün en kritik olduğunu not et.',
    },
  ],
  playgrounds: ['viz-maze'],
  sections: [
    {
      id: 'overview',
      title: 'Yarışma Aşamaları',
      body: 'SSB Kuantum Algoritma Yarışması üç ana aşamadan oluşur: başvuru, ön eleme (çevrimiçi sınav + çözüm geliştirme + sunum) ve final hackathon. Her aşama farklı becerileri ölçer — teorik bilgi, formülasyon yeteneği ve takım halinde uygulama. Örnek zaman çizelgesi: başvuru kapandıktan sonra 2 hafta sınav hazırlığı, 3 hafta çözüm geliştirme, 1 hafta sunum provası.',
    },
    {
      id: 'team',
      title: 'Takım Yapısı',
      body: 'Takımlar 3–6 kişiden oluşur. Formülasyon, algoritma geliştirme, deney tasarımı ve sunum rollerini erken paylaşmak hackathon gününde kritik avantaj sağlar. 5 kişilik ideal dağılım: 1 formülasyon lideri, 2 kod (Qiskit + klasik benchmark), 1 deney metadata, 1 sunum. 3 kişilik takımda aynı kişi formülasyon + sunum, diğer ikisi kod + deney olabilir — ama tek kişi hem QUBO hem QPU hem slayt yapmasın.',
    },
    {
      id: 'prep',
      title: 'Ne Çalışmalıyız?',
      body: 'Klasik optimizasyon temelleri, QUBO formülasyonu, QAOA/VQE mantığı, NISQ kısıtları ve sektör problemlerine özgü kısıt → Penalty dönüşümleri bu laboratuvarın ana eksenidir. Öncelik sırası: (1) problem okuma disiplini, (2) QUBO yazma, (3) QAOA parametreleri, (4) IBM Runtime akışı, (5) sektör toy örnekleri. Her modül sonunda quiz %70 — yol haritası seni zorlamadan ilerletmez.',
    },
    {
      id: 'checklist',
      title: 'Hazırlık Checklist',
      body: 'Başlamadan önce: Python + temel lineer cebir, kombinatoriyel optimizasyon sezgisi, Qiskit kurulumu (Modül 7\'de detay). Yarışma günü çantası: parametre log tablosu, λ tarama grafiği şablonu, klasik benchmark scripti, sunum iskeleti (Modül 10). Bu checklist Modül 10\'da genişletilir.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'SSB Kuantum Algoritma Yarışması takımları kaç kişiden oluşabilir?',
      options: ['1–2 kişi', '3–6 kişi', '7–10 kişi', 'Sınır yok'],
      correctIndex: 1,
      explanation: 'Resmi duyuruya göre takımlar 3–6 kişiden oluşur.',
    },
    {
      id: 'q2',
      question: 'Ön eleme aşamasında hangisi beklenmez?',
      options: [
        'Çevrimiçi sınav',
        'Çözüm geliştirme',
        'Sunum',
        'IBM QPU üzerinde canlı hackathon',
      ],
      correctIndex: 3,
      explanation:
        'IBM QPU üzerinde yoğun hackathon final aşamasına aittir; ön eleme çevrimiçi sınav ve çözüm sunumu içerir.',
    },
    {
      id: 'q3',
      question: 'Final hackathon hangi sektör temalarını kapsayabilir?',
      options: [
        'Yalnızca akademik teorik fizik',
        'Bankacılık, finans ve haberleşme optimizasyonu',
        'Sadece oyun geliştirme',
        'Donanım üretimi',
      ],
      correctIndex: 1,
      explanation:
        'Final problemleri bankacılık, finans ve haberleşme alanlarında optimizasyon-modelleme odaklıdır.',
    },
    {
      id: 'q4',
      question: 'Bu laboratuvarın ana eksenlerinden biri hangisidir?',
      options: [
        'Kuantum donanım üretimi',
        'QUBO formülasyonu ve QAOA/VQE mantığı',
        'Mobil oyun tasarımı',
        'Veritabanı normalizasyonu',
      ],
      correctIndex: 1,
      explanation:
        'Lab, klasik optimizasyondan QUBO ve hibrit kuantum algoritmalarına köprü kurar.',
    },
    {
      id: 'q5',
      question: 'Modül quizlerinde ilerleme kaydı için gereken minimum skor?',
      options: ['%50', '%70', '%90', '%100'],
      correctIndex: 1,
      explanation: 'Yol haritasında bir sonraki modül, önceki quiz %70 ve üzerinde geçilince açılır.',
    },
    {
      id: 'q6',
      question: 'Ön eleme aşamasında takımdan beklenenler arasında hangisi vardır?',
      options: [
        'Çevrimiçi sınav',
        'Çözüm geliştirme',
        'Sunum',
        'Hepsi',
      ],
      correctIndex: 3,
      explanation: 'Ön eleme sınav, çözüm geliştirme ve sunum içerir; canlı IBM hackathon final aşamasındadır.',
    },
    {
      id: 'q7',
      question: 'Labirent analojisinde “formülasyon lideri” neyi temsil eder?',
      options: [
        'Haritayı okuyup değişken/kısıt/maliyet ayrımını yapan kişi',
        'Sadece slayt tasarımı yapan kişi',
        'IBM fatura ödeyen kişi',
        'Rastgele parametre seçen kişi',
      ],
      correctIndex: 0,
      explanation:
        'Formülasyon lideri problemin matematiksel haritasını çıkarır — yanlış harita tüm takımı çıkmaz sokakta bırakır.',
    },
  ],
}
