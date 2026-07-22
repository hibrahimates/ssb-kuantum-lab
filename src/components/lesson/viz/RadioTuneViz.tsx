/** Radio dial metaphor for tuning γ and β. */
import { PlaygroundExplainer } from '../../playground'

export function RadioTuneViz() {
  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        title="QAOA parametre ayarı"
        analogy="Eski radyoda doğru frekansı bulunca istasyon netleşir. QAOA'da γ ve β ibreleri de böyle: doğru kombinasyonda iyi Max-Cut 'istasyonu' belirginleşir."
        steps={[
          'γ ibresi cost (maliyet) katmanını ayarlar — problemle ilişkili açı.',
          'β ibresi mixer katmanını ayarlar — keşif ve süperpozisyon dengesi.',
          'İbreler yanlış konumdayken sinyal zayıf (düşük beklenen cut).',
          'Doğru bölgede sinyal çubuğu yükselir — parametre optimizasyonunun görsel metaforu.',
        ]}
        symbols={[
          { symbol: 'γ', meaning: 'Cost katmanı açısı' },
          { symbol: 'β', meaning: 'Mixer katmanı açısı' },
          { symbol: 'Sinyal gücü', meaning: 'Beklenen cut — ne kadar iyi ayarlandığının göstergesi' },
        ]}
        watch="Animasyonda ibreler dönerken sinyal çubuğunun yükselip alçaldığını izle — gerçek labda γ/β kaydırınca benzer etkiyi görürsün."
      />
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div className="relative">
          <svg viewBox="0 0 160 160" className="h-40 w-40">
            <circle cx="80" cy="80" r="70" fill="#0a1628" stroke="rgba(34,211,238,0.3)" strokeWidth="2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180
              const x1 = 80 + 58 * Math.cos(rad)
              const y1 = 80 + 58 * Math.sin(rad)
              const x2 = 80 + 65 * Math.cos(rad)
              const y2 = 80 + 65 * Math.sin(rad)
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(148,163,184,0.4)"
                  strokeWidth={1}
                />
              )
            })}
            <text x="80" y="28" textAnchor="middle" className="fill-cyan-glow text-[9px]">
              γ
            </text>
            <text x="138" y="84" textAnchor="middle" className="fill-cyan-glow text-[9px]">
              β
            </text>
            <line
              className="radio-needle-gamma"
              x1="80"
              y1="80"
              x2="80"
              y2="28"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              className="radio-needle-beta"
              x1="80"
              y1="80"
              x2="130"
              y2="80"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity={0.8}
            />
            <circle cx="80" cy="80" r="6" fill="#22d3ee" />
          </svg>
          <div className="radio-static-wave absolute -right-2 top-1/2 h-16 w-8 -translate-y-1/2 rounded-r-full border border-cyan-electric/20 bg-cyan-electric/5" />
        </div>

        <div className="max-w-xs space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-glow radio-led" />
            <span className="text-slate-300">Sinyal gücü (beklenen cut)</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-navy-900">
            <div className="radio-signal-bar h-full rounded-full bg-gradient-to-r from-cyan-deep to-cyan-glow" />
          </div>
          <p className="text-xs text-slate-500">
            İbreler dönerken sinyal çubuğu yükselip alçalır — parametre optimizasyonunun sezgisel
            görseli.
          </p>
        </div>
      </div>

      <style>{`
        .radio-needle-gamma {
          transform-origin: 80px 80px;
          animation: tuneGamma 4s ease-in-out infinite;
        }
        .radio-needle-beta {
          transform-origin: 80px 80px;
          animation: tuneBeta 3s ease-in-out infinite;
        }
        @keyframes tuneGamma {
          0%, 100% { transform: rotate(-60deg); }
          50% { transform: rotate(80deg); }
        }
        @keyframes tuneBeta {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-40deg); }
        }
        .radio-signal-bar {
          width: 30%;
          animation: signalStrength 4s ease-in-out infinite;
        }
        @keyframes signalStrength {
          0%, 100% { width: 25%; opacity: 0.5; }
          35% { width: 45%; opacity: 0.7; }
          50% { width: 90%; opacity: 1; }
          65% { width: 55%; opacity: 0.8; }
        }
        .radio-led { animation: ledBlink 4s ease-in-out infinite; }
        @keyframes ledBlink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; box-shadow: 0 0 6px #22d3ee; }
        }
        .radio-static-wave {
          animation: staticWave 1.5s ease-in-out infinite;
        }
        @keyframes staticWave {
          0%, 100% { opacity: 0.3; transform: translateY(-50%) scaleY(0.8); }
          50% { opacity: 0.8; transform: translateY(-50%) scaleY(1.1); }
        }
      `}</style>
    </div>
  )
}
