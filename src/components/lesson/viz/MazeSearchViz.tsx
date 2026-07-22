/** Maze: deterministic path scan vs probabilistic sampling. */
import { PlaygroundExplainer } from '../../playground'

export function MazeSearchViz() {
  const cells = [
    [1, 1, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ]

  return (
    <div className="rounded-xl border border-cyan-electric/20 bg-navy-800/40 p-5">
      <PlaygroundExplainer
        title="Klasik tarama vs olasılıksal örnekleme"
        analogy="Labirentte klasik arama koridorları sırayla tek tek dener; kuantum örnekleme birçok yolu aynı anda olasılıklı ağırlıklandırır — ama en kısa yolu garanti etmez."
        steps={[
          'Sol panel: klasik tarama — hücreler sırayla taranır (deterministik).',
          'Sağ panel: olasılıksal örnekleme — birçok hücre aynı anda parlar (ağırlıklı).',
          'Klasik yöntem küçük uzayda her seçeneği garantili dener.',
          'Kuantum yaklaşım iyi adaylara olasılık verir; sonuç ölçüme bağlıdır.',
        ]}
        watch="Sol tarafta taramanın sıralı ilerlediğini, sağda ise rastgele parlayan hücrelerin farklı bir stratejiyi temsil ettiğini gözle."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-amber-300/90">Klasik tarama</p>
          <div className="grid grid-cols-6 gap-0.5 rounded-lg bg-navy-950/80 p-2">
            {cells.flatMap((row, r) =>
              row.map((wall, c) => (
                <div
                  key={`c-${r}-${c}`}
                  className={`maze-cell-classic aspect-square rounded-sm ${
                    wall ? 'bg-navy-800' : 'bg-navy-950'
                  }`}
                  style={{ animationDelay: `${(r * 6 + c) * 0.08}s` }}
                />
              )),
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-cyan-glow/90">Olasılıksal örnekleme</p>
          <div className="grid grid-cols-6 gap-0.5 rounded-lg bg-navy-950/80 p-2">
            {cells.flatMap((row, r) =>
              row.map((wall, c) => (
                <div
                  key={`q-${r}-${c}`}
                  className={`maze-cell-quantum aspect-square rounded-sm ${
                    wall ? 'bg-navy-800' : 'bg-navy-950'
                  }`}
                  style={{ animationDelay: `${Math.random() * 1.2}s` }}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <style>{`
        .maze-cell-classic { animation: mazeScan 4s linear infinite; }
        @keyframes mazeScan {
          0%, 100% { box-shadow: inset 0 0 0 0 transparent; }
          10%, 20% { box-shadow: inset 0 0 0 2px rgba(251,191,36,0.7); }
        }
        .maze-cell-quantum { animation: mazePulse 2s ease-in-out infinite; }
        @keyframes mazePulse {
          0%, 100% { box-shadow: inset 0 0 0 0 transparent; opacity: 0.6; }
          50% { box-shadow: inset 0 0 8px rgba(34,211,238,0.5); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
