import { bitsToLabel, enumerateBitstrings, evaluateQubo, type QuboMatrix } from './qubo'

export interface KnapsackItem {
  id: string
  name: string
  weight: number
  value: number
}

export function knapsackWeight(items: KnapsackItem[], bits: number[]): number {
  return bits.reduce((sum, b, i) => sum + (b ? items[i].weight : 0), 0)
}

export function knapsackValue(items: KnapsackItem[], bits: number[]): number {
  return bits.reduce((sum, b, i) => sum + (b ? items[i].value : 0), 0)
}

export function knapsackFeasible(items: KnapsackItem[], capacity: number, bits: number[]): boolean {
  return knapsackWeight(items, bits) <= capacity
}

/** Minimize −value + P·(Σ w_i x_i − W)² (soft capacity penalty). */
export function knapsackToQubo(
  items: KnapsackItem[],
  capacity: number,
  penalty: number,
): QuboMatrix {
  const n = items.length
  const Q: QuboMatrix = Array.from({ length: n }, () => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    Q[i][i] -= items[i].value
    Q[i][i] += penalty * (items[i].weight ** 2 - 2 * capacity * items[i].weight)
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      Q[i][j] += 2 * penalty * items[i].weight * items[j].weight
    }
  }

  return Q
}

export interface KnapsackConfig {
  bits: number[]
  label: string
  weight: number
  value: number
  quboCost: number
  feasible: boolean
}

export function evaluateKnapsackConfigs(
  items: KnapsackItem[],
  capacity: number,
  penalty: number,
): KnapsackConfig[] {
  const Q = knapsackToQubo(items, capacity, penalty)
  const n = items.length

  return enumerateBitstrings(n).map((bits) => {
    const weight = knapsackWeight(items, bits)
    const value = knapsackValue(items, bits)
    const feasible = weight <= capacity
    return {
      bits,
      label: bitsToLabel(bits),
      weight,
      value,
      quboCost: evaluateQubo(Q, bits),
      feasible,
    }
  })
}

export function bestFeasibleKnapsack(items: KnapsackItem[], capacity: number): KnapsackConfig | null {
  const configs = evaluateKnapsackConfigs(items, capacity, 0)
  let best: KnapsackConfig | null = null
  for (const c of configs) {
    if (!c.feasible) continue
    if (!best || c.value > best.value) best = c
  }
  return best
}

export function bestKnapsackQubo(
  items: KnapsackItem[],
  capacity: number,
  penalty: number,
): KnapsackConfig {
  const configs = evaluateKnapsackConfigs(items, capacity, penalty)
  let best = configs[0]
  for (const c of configs) {
    if (c.quboCost < best.quboCost) best = c
  }
  return best
}
