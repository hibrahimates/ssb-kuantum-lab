# Kuantum Lab

[SSB Kuantum Algoritma Yarışması](https://kuantum.ssb.gov.tr/yarisma) hazırlık laboratuvarı — interaktif öğrenme yolu, simülasyonlar, ön eleme arenası ve hackathon playbook.

## Ne sunar?

- **10 modül** — klasik optimizasyondan QUBO, QAOA, VQE, NISQ/IBM ve sektör uygulamalarına
- **Quiz ve kilit** — modül quizi ≥%70 ile sonraki modül açılır
- **Simülasyonlar** — QubitExplorer, QuboBuilder, QaoaLab, ConstraintPenaltyLab
- **Ön Eleme Arenası** (`/arena`) — 29 soruluk deneme sınavı + Max-Cut formülasyon görevi
- **Hackathon Playbook** (`/hackathon`) — 2 günlük Teknopark/IBM hazırlık rehberi

İlerleme verileri yalnızca tarayıcıda (`localStorage`) saklanır; backend veya hesap gerekmez.

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç.

## Production build

```bash
npm run build
npm run preview
```

## Vercel deploy

1. Repoyu GitHub'a push et.
2. [Vercel](https://vercel.com) üzerinde yeni proje oluştur ve repoyu bağla.
3. Framework preset: **Vite** — build command: `npm run build`, output directory: `dist`.
4. `vercel.json` SPA fallback içerir (`BrowserRouter` için tüm rotalar `index.html`'e yönlendirilir).
5. Deploy sonrası public URL'i takımınla paylaş.

Resmi yarışma sayfası: [https://kuantum.ssb.gov.tr/yarisma](https://kuantum.ssb.gov.tr/yarisma)

## Teknoloji

Vite · React 19 · TypeScript · Tailwind CSS · Recharts · Framer Motion
