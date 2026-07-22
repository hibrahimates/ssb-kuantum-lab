/** Coin flip → qubit superposition metaphor (CSS/SVG loop). */
import { PlaygroundExplainer } from '../../playground'

export function CoinToQubitViz() {
  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        title="Madeni para → kübit"
        analogy="Klasik madeni para ya tura (T) ya yazı (Y) — ölçene kadar ikisi birden olamaz. Kuantum kübit ise ikisinin karışımında olabilir; ölçüm yapınca rastgele ama olasılıklı bir sonuç seçilir."
        steps={[
          'Klasik bit: 0 veya 1 — tek kesin değer.',
          'Kuantum kübit: α|0⟩ + β|1⟩ süperpozisyonu — ölçene kadar ikisi birden.',
          'Ölçüm süperpozisyonu çöker: |0⟩ veya |1⟩ çıkar.',
          'Olasılıklar Born kuralıyla belirlenir (genliğin karesi).',
        ]}
        symbols={[
          { symbol: '|0⟩, |1⟩', meaning: 'Kübitin iki temel durumu' },
          { symbol: 'α, β', meaning: 'Her durumun genlik katsayıları' },
        ]}
        watch="Soldaki madeni paranın T/Y arasında kesin geçiş yaptığını, sağdaki Bloch noktasının ise |0⟩ ile |1⟩ arasında sürekli hareket ettiğini karşılaştır."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-medium text-slate-500">Klasik</p>
          <div className="coin-flip-classic relative h-24 w-24">
            <div className="coin-face coin-tails absolute inset-0 flex items-center justify-center rounded-full border-2 border-slate-500 bg-navy-900 font-display text-lg text-slate-300">
              Y
            </div>
            <div className="coin-face coin-heads absolute inset-0 flex items-center justify-center rounded-full border-2 border-cyan-electric bg-navy-800 font-display text-lg text-cyan-glow">
              T
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Tek sonuç: 0 veya 1</p>
        </div>

        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-medium text-slate-500">Kuantum kübit</p>
          <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="1.5" />
            <line x1="60" y1="8" x2="60" y2="112" stroke="rgba(148,163,184,0.2)" />
            <text x="60" y="18" textAnchor="middle" className="fill-slate-500 text-[8px]">
              |0⟩
            </text>
            <text x="60" y="112" textAnchor="middle" className="fill-slate-500 text-[8px]">
              |1⟩
            </text>
            <circle className="bloch-orbit" cx="60" cy="60" r="6" fill="#22d3ee" />
            <line
              className="bloch-ray"
              x1="60"
              y1="60"
              x2="60"
              y2="20"
              stroke="rgba(6,182,212,0.5)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>
          <p className="mt-3 text-xs text-slate-500">α|0⟩ + β|1⟩ — ölçene kadar ikisi birden</p>
        </div>
      </div>

      <style>{`
        .coin-flip-classic { perspective: 400px; }
        .coin-face { backface-visibility: hidden; }
        .coin-tails { transform: rotateY(0deg); animation: coinFlipClassic 2.4s ease-in-out infinite; }
        .coin-heads { transform: rotateY(180deg); animation: coinFlipClassic 2.4s ease-in-out infinite; }
        @keyframes coinFlipClassic {
          0%, 45% { transform: rotateY(0deg); }
          50%, 95% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        .bloch-orbit {
          transform-origin: 60px 60px;
          animation: blochOrbit 3s ease-in-out infinite;
        }
        .bloch-ray {
          transform-origin: 60px 60px;
          animation: blochRay 3s ease-in-out infinite;
        }
        @keyframes blochOrbit {
          0%, 100% { transform: rotate(-35deg) translateY(-28px) rotate(35deg); }
          50% { transform: rotate(35deg) translateY(28px) rotate(-35deg); }
        }
        @keyframes blochRay {
          0%, 100% { transform: rotate(-35deg); }
          50% { transform: rotate(35deg); }
        }
      `}</style>
    </div>
  )
}
