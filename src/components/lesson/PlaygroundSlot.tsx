import type { PlaygroundId } from '../../content/modules/types'
import { renderPlayground } from '../sim/registry'

const PLAYGROUND_LABELS: Record<PlaygroundId, string> = {
  qubit: 'Qubit Keşfi',
  qubo: 'QUBO Oluşturucu',
  qaoa: 'QAOA Laboratuvarı',
  constraint: 'Ceza (Penalty) Laboratuvarı',
  shots: 'Shot Histogramı',
  'classical-vs-quantum': 'Klasik vs Kuantum',
  knapsack: 'Knapsack Mini Lab',
  variational: 'Varyasyonel Döngü',
  'live-qubo': 'Canlı QUBO',
  'live-qaoa': 'Canlı QAOA',
  'viz-coin': 'Yazı-Tura → Kübit',
  'viz-maze': 'Labirent Arama',
  'viz-radio': 'Radyo Ayarı (γ/β)',
}

interface PlaygroundSlotProps {
  id: PlaygroundId | string
  unlocked: boolean
  compact?: boolean
}

function PlaygroundFallback({ id, compact }: { id: string; compact?: boolean }) {
  const label = PLAYGROUND_LABELS[id as PlaygroundId] ?? id

  return (
    <div
      className={`rounded-lg border border-dashed border-cyan-electric/25 bg-navy-900/60 text-center ${
        compact ? 'px-4 py-6' : 'px-6 py-10'
      }`}
    >
      <p className="text-sm font-medium text-cyan-glow">{label}</p>
      <p className="mt-2 text-xs text-slate-500">Playground tanımlı değil: {id}</p>
    </div>
  )
}

function PlaygroundLocked({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-amber-500/20 bg-amber-500/5 text-center ${
        compact ? 'px-4 py-5' : 'px-6 py-8'
      }`}
    >
      <p className="text-sm font-medium text-amber-200">Playground kilitli</p>
      <p className="mt-1 text-xs text-slate-500">
        Önceki modül quizini %70 ile geçince bu alan açılır.
      </p>
    </div>
  )
}

export function PlaygroundSlot({ id, unlocked, compact }: PlaygroundSlotProps) {
  if (!unlocked) {
    return <PlaygroundLocked compact={compact} />
  }

  const node = renderPlayground(id as PlaygroundId)
  if (!node) {
    return <PlaygroundFallback id={id} compact={compact} />
  }

  return <>{node}</>
}

export { PLAYGROUND_LABELS }
