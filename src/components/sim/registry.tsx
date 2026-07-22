import type { ReactNode } from 'react'
import type { PlaygroundId } from '../../content/modules/types'
import { QubitExplorer } from './QubitExplorer'
import { QuboBuilder } from './QuboBuilder'
import { QaoaLab } from './QaoaLab'
import { ConstraintPenaltyLab } from './ConstraintPenaltyLab'
import { ShotHistogramLab } from './ShotHistogramLab'
import { ClassicalVsQuantumLab } from './ClassicalVsQuantumLab'
import { KnapsackMiniLab } from './KnapsackMiniLab'
import { VariationalLoopLab } from './VariationalLoopLab'
import { LiveQuboLab } from './LiveQuboLab'
import { LiveQaoaLab } from './LiveQaoaLab'
import { CoinToQubitViz, MazeSearchViz, RadioTuneViz } from '../lesson/viz'

export type { PlaygroundId } from '../../content/modules/types'

const PLAYGROUND_MAP: Record<PlaygroundId, () => ReactNode> = {
  qubit: () => <QubitExplorer />,
  qubo: () => <QuboBuilder />,
  qaoa: () => <QaoaLab />,
  constraint: () => <ConstraintPenaltyLab />,
  shots: () => <ShotHistogramLab />,
  'classical-vs-quantum': () => <ClassicalVsQuantumLab />,
  knapsack: () => <KnapsackMiniLab />,
  variational: () => <VariationalLoopLab />,
  'live-qubo': () => <LiveQuboLab />,
  'live-qaoa': () => <LiveQaoaLab />,
  'viz-coin': () => <CoinToQubitViz />,
  'viz-maze': () => <MazeSearchViz />,
  'viz-radio': () => <RadioTuneViz />,
}

export function renderPlayground(id: PlaygroundId): ReactNode {
  const factory = PLAYGROUND_MAP[id]
  return factory ? factory() : null
}

export function isPlaygroundId(value: string): value is PlaygroundId {
  return value in PLAYGROUND_MAP
}

export function resolveModulePlaygrounds(
  simType?: PlaygroundId,
  playgrounds?: PlaygroundId[],
): PlaygroundId[] {
  if (playgrounds?.length) return playgrounds
  if (simType) return [simType]
  return []
}
