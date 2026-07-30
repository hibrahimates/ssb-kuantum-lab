import type { ModuleContent } from './types'

export const ibmPlatform: ModuleContent = {
  slug: 'ibm-platform',
  order: 7,
  title: 'IBM Quantum Platform',
  subtitle: 'Hesap, Open Plan, Learning ve Qiskit ekosistemi',
  season: 3,
  seasonTitle: 'Araçlar & IBM',
  levelLabel: 'Atölye',
  nextHook: 'Platform hazır — sıradaki durak: Qiskit kurulumu ve ilk devren.',
  goal: 'IBM Quantum Platform hesabını açmak, Open Plan limitlerini bilmek ve resmi öğrenme kaynaklarına yön bulmak.',
  goalNarration:
    'Bu modülde IBM Quantum bulut platformunu, ücretsiz Open Plan kotasını ve öğrenme kanallarını tanıyacağız. Yarışma öncesi hesabını şimdi aç — kuyruk ve kredi sürprizi yaşama.',
  analogy: {
    title: 'IBM Platform = kuantum garaj + atölye kütüphanesi',
    text: 'Quantum Platform garaj kapısıdır: hesabın anahtarı, QPU kuyruğu ve kredi sayacı burada. Open Plan aylık ~10 dakika QPU süresi gibi sınırlı ama gerçek bir test sürüşü — simülatörler sınırsız pratik alanı. Learning bölümü atölye kütüphanesi; Qiskit YouTube kanalı ustaların demo videoları. Hesabını bugün aç, yarışma günü “giriş yapamıyorum” draması yaşama.',
  },
  intuitions: [
    {
      title: 'Open Plan kotası',
      setup:
        'Open Plan: ~10 dk/ay QPU süresi (politika değişebilir — dashboard’dan kontrol et). Simülatör job’ları genelde ayrı limitte. 4096 shot × 5 job = budget tablosuna yaz.',
      insight:
        'QPU’yu final test için sakla; geliştirmede local Aer kullan. Kotayı takım içi paylaş — aynı hesapla 3 kişi spam job atmasın.',
    },
    {
      title: 'Hesap checklist',
      setup:
        '1) quantum.cloud.ibm.com kayıt 2) API token oluştur 3) Learning’de “Qiskit basics” 4) İlk sim job 5) Token’ı .env’e koy, repoya commit etme.',
      insight:
        'Hackathon öncesi checklist’i tamamla — son gün token/2FA sorunu %50 takım gecikmesi demek.',
    },
    {
      title: 'Önerilen video',
      setup:
        'Qiskit kanalındaki “Hello Quantum World” tarzı kısa demo (~5 dk): devre çiz, sim çalıştır, histogram oku.',
      insight:
        'Video izle → aynı devreyi Qiskit atölyesinde tekrar et. Pasif izleme ≠ öğrenme; kodu elle yaz.',
    },
  ],
  tryThis: [
    {
      prompt:
        'quantum.cloud.ibm.com adresine git, hesap aç ve dashboard’da Open Plan kotanı not et. Simülatör ve QPU limitlerini karşılaştır.',
    },
    {
      prompt:
        'Learning bölümünde “Getting started with Qiskit” yolunu bul; ilk üniteyi tamamla veya en az bir notebook’u aç.',
      hint: 'Resmi Learning içeriği modül quiz sorularına da temel oluşturur.',
    },
    {
      prompt:
        'Qiskit YouTube kanalından önerilen videoyu izle; histogram çıktısını modül 9’daki shot playground ile mental eşleştir.',
    },
  ],
  playgrounds: ['shots'],
  sections: [
    {
      id: 'platform',
      title: 'IBM Quantum Platform',
      narration:
        'IBM Quantum Platform, Qiskit Runtime, simülatörler ve gerçek QPU’lara tek kapıdan erişim sağlar. Yarışma takımın için bu panel ana kontrol odasıdır.',
      body: 'Resmi portal: [quantum.cloud.ibm.com](https://quantum.cloud.ibm.com/). Buradan backend listesi, job geçmişi, API token yönetimi ve faturalandırma/Open Plan kotası görünür. Ürün ve plan detayları: [ibm.com/quantum/products](https://www.ibm.com/quantum/products). Yarışma öncesi tüm takım üyeleri hesap açmalı — paylaşımlı tek hesap yerine kişisel hesap + ortak token stratejisi tercih edilebilir.',
    },
    {
      id: 'open-plan',
      title: 'Open Plan ve Kota',
      body: 'Open Plan ücretsiz katmandır; aylık sınırlı QPU süresi (~10 dk/ay — güncel değeri dashboard’dan doğrula) ve job kotası sunar. Simülatör job’ları genelde daha cömerttir. Strateji: geliştirme → local Aer veya fake backend; doğrulama → bulut sim; final → QPU. Her job için shots, backend adı ve tarihi tabloya yaz — jüri “deney disiplini” puanlar.',
      scene3d: 'hero-orbit',
    },
    {
      id: 'checklist',
      title: 'Hesap Checklist',
      body: '**Yarışma öncesi 5 adım:** (1) Platform hesabı aç. (2) Settings → API token oluştur, güvenli sakla (.env, gitignore). (3) İlk “Hello” devresini simülatörde çalıştır — job SUCCESS gör. (4) Learning’de bir ünite tamamla. (5) Takım Slack/Discord’a token paylaşım kuralını yaz (asla public repo). Eksik adım = hackathon günü panik.',
    },
    {
      id: 'learning',
      title: 'IBM Quantum Learning',
      narration:
        'Resmi Learning portalı Qiskit kavramlarını adım adım öğretir. Modül quiz’leriyle birlikte kullan.',
      body: 'Öğrenme merkezi: [quantum.cloud.ibm.com/learning/en](https://quantum.cloud.ibm.com/learning/en). Interaktif dersler, notebook’lar ve sertifika yolları içerir. Özellikle “Fundamentals” ve “Qiskit patterns” bölümleri yarışma formülasyonuna köprü kurar. Pasif okuma yerine her ünitede en az bir hücreyi çalıştır.',
    },
    {
      id: 'youtube',
      title: 'Qiskit YouTube ve Önerilen Video',
      body: 'Resmi kanal: [youtube.com/@qiskit](https://www.youtube.com/@qiskit). Kısa demo’lar, release notları ve hackathon ipuçları burada. **Önerilen başlangıç videosu:** [Hello Quantum World demo](https://youtu.be/MLE5LhsLD5U) — devre çizimi, job gönderimi ve histogram okuma akışını 5 dakikada gösterir. İzledikten sonra bir sonraki modülde aynı devreyi Python ile yaz.',
    },
  ],
  quiz: [
    {
      id: 'q1',
      question: 'IBM Quantum Platform’da Open Plan’ın tipik QPU kotası nedir?',
      options: [
        'Sınırsız QPU, sınırsız süre',
        'Aylık sınırlı QPU süresi (~10 dk/ay — dashboard’dan doğrula)',
        'Sadece 1 shot hakkı',
        'QPU erişimi yok, sadece PDF',
      ],
      correctIndex: 1,
      explanation:
        'Open Plan ücretsiz ama sınırlı QPU süresi sunar; simülatör genelde daha cömert. Güncel kotayı dashboard’dan kontrol et.',
    },
    {
      id: 'q2',
      question: 'API token güvenliği için doğru uygulama hangisi?',
      options: [
        'Token’ı public GitHub repo’ya commit et',
        'Token’ı .env dosyasında sakla, .gitignore’a ekle',
        'Token’ı sunum slaytına yapıştır',
        'Token paylaşımına gerek yok',
      ],
      correctIndex: 1,
      explanation: 'Token gizli anahtardır — ortam değişkeni ve gitignore zorunlu.',
    },
    {
      id: 'q3',
      question: 'Geliştirme aşamasında QPU yerine ne tercih edilmeli?',
      options: [
        'Her iterasyonda QPU — en hızlı yol',
        'Local simülatör / fake backend ile hızlı iterasyon',
        'Sadece kağıt hesap',
        'QPU kuyruğunu beklemek zorunlu',
      ],
      correctIndex: 1,
      explanation: 'QPU kotası sınırlı; geliştirmede sim/fake backend, finalde QPU.',
    },
    {
      id: 'q4',
      question: 'IBM Quantum Learning portalının ana faydası nedir?',
      options: [
        'Sadece fatura görüntüleme',
        'Resmi, adım adım Qiskit ve kuantum eğitim içeriği',
        'Yarışma jürisi listesi',
        'QUBO matrisi otomatik çözücü',
      ],
      correctIndex: 1,
      explanation: 'Learning interaktif dersler ve notebook’larla resmi öğrenme yolu sunar.',
    },
    {
      id: 'q5',
      question: 'Yarışma öncesi hesap checklist’inde hangi adım eksik bırakılmamalı?',
      options: [
        'LinkedIn profil fotoğrafı güncelleme',
        'İlk sim job’ının SUCCESS dönmesi',
        '10 farklı QPU backend’e aynı anda spam',
        'Token’ı takım grubuna düz metin yapıştırma',
      ],
      correctIndex: 1,
      explanation: 'İlk başarılı sim job pipeline’ın çalıştığını doğrular — son gün sürprizi önler.',
    },
  ],
  resources: [
    {
      label: 'IBM Quantum Platform',
      url: 'https://quantum.cloud.ibm.com/',
      note: 'Ana portal — hesap, job, token',
    },
    {
      label: 'IBM Quantum Products',
      url: 'https://www.ibm.com/quantum/products',
      note: 'Plan ve ürün karşılaştırması',
    },
    {
      label: 'IBM Quantum Learning',
      url: 'https://quantum.cloud.ibm.com/learning/en',
      note: 'Resmi interaktif eğitim',
    },
    {
      label: 'Qiskit YouTube',
      url: 'https://www.youtube.com/@qiskit',
      note: 'Demo videoları ve release notları',
    },
    {
      label: 'Önerilen: Hello Quantum World',
      url: 'https://youtu.be/MLE5LhsLD5U',
      note: '~5 dk platform turu',
    },
  ],
}
