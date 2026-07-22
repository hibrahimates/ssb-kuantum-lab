/** QUBO helpers: Max-Cut encoding, evaluation, small brute-force search. */

export type QuboMatrix = number[][]

export interface UnweightedGraph {
  nodes: number
  edges: [number, number][]
}

/** Build symmetric Q for minimizing −(Max-Cut value). */
export function maxCutToQubo(graph: UnweightedGraph): QuboMatrix {
  const n = graph.nodes
  const Q: QuboMatrix = Array.from({ length: n }, () => Array(n).fill(0))

  for (const [i, j] of graph.edges) {
    if (i === j) continue
    Q[i][i] -= 1
    Q[j][j] -= 1
    const a = Math.min(i, j)
    const b = Math.max(i, j)
    Q[a][b] += 2
  }

  return Q
}

/**
 * Evaluate QUBO: xᵀQx with x_i ∈ {0,1}.
 * Convention: diagonal once; off-diagonal i<j once (undirected).
 */
export function evaluateQubo(Q: QuboMatrix, bits: number[]): number {
  const n = bits.length
  let cost = 0
  for (let i = 0; i < n; i++) {
    cost += Q[i][i] * bits[i]
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      cost += Q[i][j] * bits[i] * bits[j]
    }
  }
  return cost
}

/** Max-Cut edge count for partition bits (0/1 = side A/B). */
export function maxCutValue(graph: UnweightedGraph, bits: number[]): number {
  let cut = 0
  for (const [i, j] of graph.edges) {
    if (bits[i] !== bits[j]) cut += 1
  }
  return cut
}

export function bitsToLabel(bits: number[]): string {
  return bits.map((b) => String(b)).join('')
}

export function labelToBits(label: string): number[] {
  return label.split('').map((c) => (c === '1' ? 1 : 0))
}

export function enumerateBitstrings(n: number): number[][] {
  const total = 1 << n
  const out: number[][] = []
  for (let k = 0; k < total; k++) {
    const bits: number[] = []
    for (let i = n - 1; i >= 0; i--) {
      bits.push((k >> i) & 1)
    }
    out.push(bits)
  }
  return out
}

export interface ClassicalOptimum {
  bits: number[]
  quboCost: number
  cutValue: number
}

export function bestClassicalQubo(
  Q: QuboMatrix,
  graph?: UnweightedGraph,
): ClassicalOptimum {
  const n = Q.length
  let best: ClassicalOptimum = {
    bits: Array(n).fill(0),
    quboCost: Infinity,
    cutValue: 0,
  }

  for (const bits of enumerateBitstrings(n)) {
    const quboCost = evaluateQubo(Q, bits)
    const cutValue = graph ? maxCutValue(graph, bits) : 0
    if (quboCost < best.quboCost) {
      best = { bits: [...bits], quboCost, cutValue }
    }
  }
  return best
}

export function mergeGraphs(base: UnweightedGraph, extraEdges: [number, number][]): UnweightedGraph {
  const edgeSet = new Set(base.edges.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`))
  for (const [i, j] of extraEdges) {
    edgeSet.add(`${Math.min(i, j)}-${Math.max(i, j)}`)
  }
  const edges = [...edgeSet].map((k) => {
    const [a, b] = k.split('-').map(Number)
    return [a, b] as [number, number]
  })
  return { nodes: base.nodes, edges }
}
