import { evaluateQubo, type QuboMatrix } from './qubo'

/**
 * Embed equality constraint Σ x_i = target into QUBO via penalty P·(Σ x_i − target)².
 * Expanded: P·(2 Σ_{i<j} x_i x_j − (2target−1) Σ_i x_i + target²).
 */
export function addEqualityConstraint(
  Q: QuboMatrix,
  indices: number[],
  target: number,
  penalty: number,
): QuboMatrix {
  const next = Q.map((row) => [...row])

  for (const i of indices) {
    next[i][i] += penalty * (1 - 2 * target)
  }
  for (let a = 0; a < indices.length; a++) {
    for (let b = a + 1; b < indices.length; b++) {
      const i = indices[a]
      const j = indices[b]
      const lo = Math.min(i, j)
      const hi = Math.max(i, j)
      next[lo][hi] += 2 * penalty
    }
  }

  return next
}

/** Exactly-one-of-N: Σ x_i = 1. */
export function addExactlyOneConstraint(Q: QuboMatrix, indices: number[], penalty: number): QuboMatrix {
  return addEqualityConstraint(Q, indices, 1, penalty)
}

export interface SelectionAsset {
  id: string
  name: string
  /** Linear reward (maximize → negate in QUBO). */
  return: number
}

export function buildSelectionQubo(
  assets: SelectionAsset[],
  penalty: number,
): { Q: QuboMatrix; constant: number } {
  const n = assets.length
  const Q: QuboMatrix = Array.from({ length: n }, () => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    Q[i][i] -= assets[i].return
  }

  const indices = assets.map((_, i) => i)
  const withPenalty = addExactlyOneConstraint(Q, indices, penalty)

  return { Q: withPenalty, constant: penalty }
}

export interface ConfigRow {
  bits: number[]
  label: string
  objective: number
  penaltyTerm: number
  totalQubo: number
  feasible: boolean
  selected: string[]
}

export function evaluateSelectionConfigs(
  assets: SelectionAsset[],
  penalty: number,
  topK = 8,
): ConfigRow[] {
  const n = assets.length
  const baseQ: QuboMatrix = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    baseQ[i][i] -= assets[i].return
  }

  const indices = assets.map((_, i) => i)
  const Q = addExactlyOneConstraint(baseQ, indices, penalty)

  const rows: ConfigRow[] = []
  const total = 1 << n

  for (let k = 0; k < total; k++) {
    const bits: number[] = []
    for (let i = n - 1; i >= 0; i--) {
      bits.push((k >> i) & 1)
    }
    const sum = bits.reduce((s, b) => s + b, 0)
    const objective = bits.reduce((s, b, i) => s + (b ? -assets[i].return : 0), 0)
    const penaltyTerm = penalty * (sum - 1) ** 2
    const totalQubo = evaluateQubo(Q, bits)
    const selected = assets.filter((_, i) => bits[i] === 1).map((a) => a.name)

    rows.push({
      bits,
      label: bits.map(String).join(''),
      objective,
      penaltyTerm,
      totalQubo,
      feasible: sum === 1,
      selected,
    })
  }

  rows.sort((a, b) => a.totalQubo - b.totalQubo)
  return rows.slice(0, topK)
}
