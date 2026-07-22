import { C, type Complex } from './complex'
import {
  applyHadamardAll,
  applyMaxCutCostEdge,
  applyRx,
} from './statevector'
import { maxCutValue, type UnweightedGraph } from './qubo'

export interface QaoaParams {
  gamma: number[]
  beta: number[]
}

export interface QaoaResult {
  state: Complex[]
  expectedCut: number
  zzExpectations: number[]
}

export function runQaoaStatevector(
  graph: UnweightedGraph,
  params: QaoaParams,
): QaoaResult {
  const n = graph.nodes
  const p = params.gamma.length
  const dim = 1 << n
  let state: Complex[] = [{ re: 1, im: 0 }]
  while (state.length < dim) {
    state.push({ re: 0, im: 0 })
  }
  state = applyHadamardAll(state, n)

  for (let layer = 0; layer < p; layer++) {
    const gamma = params.gamma[layer]
    for (const [i, j] of graph.edges) {
      state = applyMaxCutCostEdge(state, n, i, j, gamma)
    }
    const beta = params.beta[layer]
    for (let q = 0; q < n; q++) {
      state = applyRx(state, n, q, beta)
    }
  }

  const zzExpectations = graph.edges.map(([i, j]) => zzExpectation(state, n, i, j))
  const expectedCut = expectedMaxCutFromZZ(graph, zzExpectations)

  return { state, expectedCut, zzExpectations }
}

function zzExpectation(state: Complex[], n: number, i: number, j: number): number {
  const dim = state.length
  let exp = 0
  for (let idx = 0; idx < dim; idx++) {
    const xi = (idx >> (n - 1 - i)) & 1
    const xj = (idx >> (n - 1 - j)) & 1
    const sign = xi === xj ? 1 : -1
    exp += C.abs2(state[idx]) * sign
  }
  return exp
}

/** Max-Cut = (1/2) Σ_{(i,j)} (1 − ⟨Z_i Z_j⟩). */
export function expectedMaxCutFromZZ(
  graph: UnweightedGraph,
  zzExpectations: number[],
): number {
  let cut = 0
  for (let e = 0; e < graph.edges.length; e++) {
    cut += 0.5 * (1 - zzExpectations[e])
  }
  return cut
}

export function sampleComputationalBasis(
  state: Complex[],
  shots: number,
  n: number,
  rng: () => number = Math.random,
): Map<string, number> {
  const probs: number[] = state.map((a) => C.abs2(a))
  const hist = new Map<string, number>()

  for (let s = 0; s < shots; s++) {
    let r = rng()
    for (let idx = 0; idx < probs.length; idx++) {
      r -= probs[idx]
      if (r <= 0) {
        const label = idx.toString(2).padStart(n, '0')
        hist.set(label, (hist.get(label) ?? 0) + 1)
        break
      }
    }
  }
  return hist
}

export function histogramToSortedEntries(hist: Map<string, number>): { label: string; count: number }[] {
  return [...hist.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

/** Grid scan for p=1 landscape: expected cut vs γ (fixed β). */
export function scanGammaLandscape(
  graph: UnweightedGraph,
  beta: number,
  gammaMin: number,
  gammaMax: number,
  steps: number,
): { gamma: number; expectedCut: number }[] {
  const points: { gamma: number; expectedCut: number }[] = []
  for (let s = 0; s <= steps; s++) {
    const gamma = gammaMin + ((gammaMax - gammaMin) * s) / steps
    const { expectedCut } = runQaoaStatevector(graph, { gamma: [gamma], beta: [beta] })
    points.push({ gamma, expectedCut })
  }
  return points
}

/** 2D heatmap for p=1: expected cut over (γ, β) grid. */
export function scanGammaBetaHeatmap(
  graph: UnweightedGraph,
  gammaSteps: number,
  betaSteps: number,
): { gamma: number; beta: number; expectedCut: number }[] {
  const points: { gamma: number; beta: number; expectedCut: number }[] = []
  for (let gi = 0; gi <= gammaSteps; gi++) {
    const gamma = (Math.PI * gi) / gammaSteps
    for (let bi = 0; bi <= betaSteps; bi++) {
      const beta = (Math.PI * bi) / betaSteps
      const { expectedCut } = runQaoaStatevector(graph, { gamma: [gamma], beta: [beta] })
      points.push({ gamma, beta, expectedCut })
    }
  }
  return points
}

export function cutFromBitstring(graph: UnweightedGraph, label: string): number {
  const bits = label.split('').map((c) => (c === '1' ? 1 : 0))
  return maxCutValue(graph, bits)
}

/** Default demo graph: square with diagonal. */
export const DEMO_MAX_CUT_GRAPH: UnweightedGraph = {
  nodes: 4,
  edges: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 2],
  ],
}
